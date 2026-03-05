// src/pages/detail/MovieDetailPage.tsx
import { useParams } from "react-router-dom";
import { useMovieDetail } from "../hooks/useMovieDetail.ts";
import { useMovieCredits } from "../hooks/useMovieCredit.ts";
import { useState } from "react";
import { useMovieTrailer } from "../hooks/useMovieTrailer.ts";
import TrailerModal from "../components/movie/TrailerModal";
import { useFavorites } from "../hooks/UseFavorites.ts";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

const MovieDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [openTrailer, setOpenTrailer] = useState(false);
  
  const { data: trailer } = useMovieTrailer(id!);
  const { data: movie, isLoading, isError } = useMovieDetail(id!);
  const { data: cast } = useMovieCredits(id!);
  const { toggleFavorite, isFavorite } = useFavorites();

  if (isLoading || isError || !movie) {
    return <div className="min-h-screen bg-black" />;
  }

  return (
    <section className="bg-black text-white min-h-screen">
      {/* BACKDROP */}
      <div className="relative h-[60vh] w-full">
        <img
          src={`${IMAGE_BASE_URL}${movie.backdrop_path}`}
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </div>

      {/* CONTENT */}
      <div className="layout-gutter -mt-40 relative z-10">
        <div className="grid grid-cols-[240px_1fr] gap-10">
          {/* POSTER */}
          <div className="h-[360px] rounded-xl overflow-hidden bg-zinc-900">
            {movie.poster_path && (
              <img
                src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* INFO */}
          <div>
            <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>

            <div className="flex items-center gap-6 text-sm text-zinc-300 mb-6">
              <span>{movie.release_date}</span>
              <span>{movie.genres?.[0]?.name}</span>
              <span>{movie.adult ? "18+" : "13+"}</span>
              <span>{movie.vote_average.toFixed(1)}/10</span>
            </div>

            <p className="text-zinc-300 leading-relaxed max-w-2xl mb-6">
              {movie.overview}
            </p>

            {/* BUTTONS */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setOpenTrailer(true)}
                className="px-10 py-3 rounded-full bg-white text-black font-semibold hover:bg-zinc-200 transition"
              >
                Watch Trailer
              </button>

              <button
                onClick={() => toggleFavorite(movie)}
                className="px-8 py-3 rounded-full border border-white/40 hover:bg-white/10 transition"
              >
                {isFavorite(movie.id) ? "Remove Favorite" : "Add to Favorite"}
              </button>
            </div>
          </div>
        </div>

        {/* CAST */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold mb-8">Cast</h2>

          <div className="grid grid-cols-6 gap-6">
            {cast?.slice(0, 6).map((member: any) => (
              <div key={member.id}>
                <div className="h-[180px] rounded-lg overflow-hidden bg-zinc-800 mb-3">
                  {member.profile_path && (
                    <img
                      src={`${IMAGE_BASE_URL}${member.profile_path}`}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="text-sm font-semibold">{member.name}</div>
                <div className="text-xs text-zinc-400">{member.character}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TRAILER MODAL */}
      {openTrailer && trailer && (
        <TrailerModal
          videoKey={trailer.key}
          onClose={() => setOpenTrailer(false)}
        />
      )}
    </section>
  );
};

export default MovieDetailPage;