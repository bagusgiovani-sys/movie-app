import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useFavorites } from "../hooks";
import { useMovieTrailer } from "../hooks";
import type { Movie } from "../types/movie.types";
import TrailerModal from "../components/movie/TrailerModal";
import Button from "../components/ui/Button";
import PlayIcon from "../assets/Play_icon.svg";
import { TMDB_IMAGE_URL } from "../lib/constants";

const EmptyState = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-6">
      <span className="text-8xl">🎬</span>
      <div className="text-center">
        <p className="text-lg font-semibold text-white mb-1">Data Empty</p>
        <p className="text-sm text-zinc-400">
          You don't have a favorite movie yet
        </p>
      </div>
      <Button onClick={() => navigate("/")}>Explore Movie</Button>
    </div>
  );
};

const FavoriteItem = ({
  movie,
  onRemove,
  onWatchTrailer,
}: {
  movie: Movie;
  onRemove: () => void;
  onWatchTrailer: () => void;
}) => {
  const navigate = useNavigate();
  return (
  <div className="relative rounded-2xl overflow-hidden mb-4">
    {/* BACKGROUND POSTER */}
    <img
      src={`${TMDB_IMAGE_URL.original}${movie.backdrop_path || movie.poster_path}`}
      alt=""
      className="absolute top-0 right-0 h-full w-2/3 object-cover object-left"
    />
    {/* GRADIENT: transparent right → black left */}
    <div className="absolute inset-0 bg-gradient-to-r from-black from-50% via-black/80 via-70% to-transparent" />

    {/* CONTENT */}
    <div className="relative z-10 flex gap-4 p-5">
      {/* POSTER */}
      <img
        src={`${TMDB_IMAGE_URL.w200}${movie.poster_path}`}
        alt={movie.title}
        className="w-20 md:w-32 object-cover rounded-lg flex-shrink-0 cursor-pointer self-start"
        onClick={() => navigate(`/movie/${movie.id}`)}
      />

      {/* INFO */}
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
        <p className="text-sm text-zinc-300 line-clamp-2 mb-4 hidden md:block">
          {movie.overview}
        </p>

        {/* BUTTONS */}
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
          <Button variant="favorite" isFavorite={true} onClick={onRemove} size="xs" className="md:hidden" />
          <Button variant="favorite" isFavorite={true} onClick={onRemove} size="sm" className="hidden md:flex" />
        </div>
      </div>
    </div>
  </div>
  );
};

const FavoritesPage = () => {
  const { favorites, toggleFavorite } = useFavorites();
  const [trailerMovieId, setTrailerMovieId] = useState<number | null>(null);
  const { data: trailer } = useMovieTrailer(
    trailerMovieId ? String(trailerMovieId) : "",
  );

  return (
    <motion.div
      className="min-h-screen bg-black text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="layout-gutter pt-34 pb-16">
        <h1 className="text-3xl font-bold mb-8">Favorites</h1>

        {favorites.length === 0 ? (
          <EmptyState />
        ) : (
          <AnimatePresence>
            {favorites.map((movie) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <FavoriteItem
                  movie={movie}
                  onRemove={() => toggleFavorite(movie)}
                  onWatchTrailer={() => setTrailerMovieId(movie.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {trailerMovieId && trailer && (
        <TrailerModal
          videoKey={trailer.key}
          onClose={() => setTrailerMovieId(null)}
        />
      )}
    </motion.div>
  );
};

export default FavoritesPage;