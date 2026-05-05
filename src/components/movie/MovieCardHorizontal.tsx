import { useNavigate } from "react-router-dom";
import type { Movie } from "../../types";
import { TMDB_IMAGE_URL } from "../../lib/constants";

type MovieCardHorizontalProps = {
  movie: Movie;
};

const MovieCardHorizontal = ({ movie }: MovieCardHorizontalProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/movie/${movie.id}`)}
      className="group flex gap-4 cursor-pointer hover:bg-zinc-900 p-3 rounded-xl transition"
    >
      {/* POSTER */}
      <div className="flex-shrink-0 w-22 h-34 rounded-lg overflow-hidden bg-zinc-800">
        {movie.poster_path ? (
          <img
            src={`${TMDB_IMAGE_URL.w500}${movie.poster_path}`}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">
            No Image
          </div>
        )}
      </div>

      {/* INFO */}
      <div className="flex flex-col justify-center gap-2">
        <h3 className="font-semibold text-[16px] md:text-xl group-hover:text-red-400 transition-colors">
          {movie.title}
        </h3>
        <p className="text-zinc-500 text-xs">
          {movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"}
        </p>
        {movie.vote_average > 0 && (
          <div className="flex items-center gap-1">
            <span className="text-yellow-400 text-[16px]">⭐</span>
            <span className="text-zinc-400 text-[16px]">{movie.vote_average.toFixed(1)}/10</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCardHorizontal;