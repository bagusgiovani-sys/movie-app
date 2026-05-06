// Single row in the Favorites list — backdrop bg, poster thumbnail, info, and action buttons
import { useNavigate } from "react-router-dom";
import type { Movie } from "../../types/movie.types";
import { Button } from "../../components/ui";
import PlayIcon from "../../assets/Play_icon.svg";
import { TMDB_IMAGE_URL } from "../../lib/constants";

type FavoriteItemProps = {
  movie: Movie;
  onRemove: () => void;
  onWatchTrailer: () => void;
};

const FavoriteItem = ({ movie, onRemove, onWatchTrailer }: FavoriteItemProps) => {
  const navigate = useNavigate();

  return (
    <div className="relative rounded-2xl overflow-hidden mb-4">
      {/* Blurred backdrop on the right side — falls back to poster when backdrop is missing */}
      <img
        src={`${TMDB_IMAGE_URL.original}${movie.backdrop_path || movie.poster_path}`}
        alt=""
        className="absolute top-0 right-0 h-full w-2/3 object-cover object-left"
      />
      {/* Left-to-right gradient keeps text legible over the backdrop */}
      <div className="absolute inset-0 bg-gradient-to-r from-black from-50% via-black/80 via-70% to-transparent" />

      {/* Foreground content — poster + info column */}
      <div className="relative z-10 flex gap-4 p-5">
        {/* Poster thumbnail — clicking navigates to the detail page */}
        <img
          src={`${TMDB_IMAGE_URL.w200}${movie.poster_path}`}
          alt={movie.title}
          className="w-20 md:w-32 object-cover rounded-lg flex-shrink-0 cursor-pointer self-start"
          onClick={() => navigate(`/movie/${movie.id}`)}
        />

        {/* Info column — title, rating, overview (desktop only), and action buttons */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h3
            className="font-bold text-base md:text-3xl mb-1 cursor-pointer hover:text-zinc-300 transition-colors"
            onClick={() => navigate(`/movie/${movie.id}`)}
          >
            {movie.title}
          </h3>
          <div className="flex items-center gap-1 mb-3">
            <svg className="w-4 h-4 fill-yellow-400" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-md text-zinc-300">
              {movie.vote_average.toFixed(1)}/10
            </span>
          </div>
          {/* Overview hidden on mobile to keep the row compact */}
          <p className="text-sm text-zinc-300 line-clamp-2 mb-4 hidden md:block">
            {movie.overview}
          </p>

          {/* Buttons — mobile uses a smaller inline button; desktop uses the shared Button component */}
          <div className="flex items-center gap-3">
            <button
              onClick={onWatchTrailer}
              className="md:hidden flex items-center gap-2 bg-[var(--color-primary-300)] hover:bg-[var(--color-primary-400)] transition-all duration-200 rounded-xl px-4 py-2.5 text-sm font-semibold"
            >
              Watch Trailer
              <img src={PlayIcon} className="w-4 h-4" alt="Play" />
            </button>
            <Button onClick={onWatchTrailer} className="hidden md:flex">
              Watch Trailer
              <img src={PlayIcon} className="w-5 h-5" alt="Play" />
            </Button>
            {/* Favorite (heart) button — always shows as "active" since this item is already saved */}
            <Button variant="favorite" isFavorite={true} onClick={onRemove} size="xs" className="md:hidden" />
            <Button variant="favorite" isFavorite={true} onClick={onRemove} size="sm" className="hidden md:flex" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoriteItem;
