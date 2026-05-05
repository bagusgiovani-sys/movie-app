import { useParams } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { useMovieDetail, useMovieCredits, useMovieTrailer, useFavorites } from "../hooks";
import MovieDetailHero from "../features/detail/MovieDetailHero";
import CastCrew from "../features/detail/CastCrew";
import TrailerModal from "../components/movie/TrailerModal";

const MovieDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [openTrailer, setOpenTrailer] = useState(false);

  const { data: trailer } = useMovieTrailer(id!);
  const { data: movie, isLoading, isError } = useMovieDetail(id!);
  const { data: cast } = useMovieCredits(id!);
  const { toggleFavorite, isFavorite } = useFavorites();

  if (isLoading) return <div className="min-h-screen bg-black" />;

  if (isError || !movie) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 text-center px-4">
        <p className="text-xl font-semibold text-white">Failed to load movie</p>
        <p className="text-zinc-500 text-sm">Check your connection and try again.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-6 py-2.5 rounded-full border border-white/30 text-sm hover:bg-white/10 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <motion.div
      className="pr-4 md:pr-0 min-h-screen bg-black text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* HERO — */}
      <motion.div
        initial={{ scale: 1.05, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <MovieDetailHero
          movie={movie}
          onWatchTrailer={() => setOpenTrailer(true)}
          onToggleFavorite={() => toggleFavorite(movie)}
          isFavorite={isFavorite(movie.id)}
        />
      </motion.div>

      {/* CAST */}
      <motion.div
        className="layout-gutter py-8 md:mt-[-10px]"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
      >
        {cast && cast.length > 0 && <CastCrew cast={cast} />}
      </motion.div>

      {openTrailer && trailer && (
        <TrailerModal
          videoKey={trailer.key}
          onClose={() => setOpenTrailer(false)}
        />
      )}
    </motion.div>
  );
};

export default MovieDetailPage;