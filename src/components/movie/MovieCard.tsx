import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Movie } from "../../types/movie.types";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

type MovieCardProps = {
  movie: Movie;
  className?: string;
};

const MovieCard = ({ movie, className = "" }: MovieCardProps) => {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      onClick={() => navigate(`/movie/${movie.id}`)}
      className={`cursor-pointer group ${className}`}
    >
      {/* POSTER */}
      <div className="h-[300px] rounded-lg overflow-hidden bg-zinc-900 mb-2 relative">
        {/* SKELETON */}
        {!loaded && (
          <div className="absolute inset-0 bg-zinc-800 animate-pulse" />
        )}

        {movie.poster_path ? (
          <img
            src={`${IMAGE_BASE_URL}${movie.poster_path}`}
            alt={movie.title}
            onLoad={() => setLoaded(true)}
            className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-300 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-500 text-sm">
            No Image
          </div>
        )}
      </div>

      {/* TITLE + RATING */}
      <div className="px-1">
        <p className="text-sm font-semibold text-white line-clamp-1 mb-1">
          {movie.title}
        </p>
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4 fill-yellow-400" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span className="text-sm text-zinc-400">
            {movie.vote_average.toFixed(1)}/10
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;