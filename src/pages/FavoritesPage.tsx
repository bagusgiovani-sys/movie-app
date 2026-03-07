import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useFavorites } from "../hooks";
import { useMovieTrailer } from "../hooks";
import TrailerModal from "../components/movie/TrailerModal";

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
      <button
        onClick={() => navigate("/")}
        className="bg-red-600 hover:bg-red-700 transition px-10 py-3 rounded-full font-semibold text-white"
      >
        Explore Movie
      </button>
    </div>
  );
};

const FavoriteItem = ({
  movie,
  onRemove,
  onWatchTrailer,
}: {
  movie: any;
  onRemove: () => void;
  onWatchTrailer: () => void;
}) => (
  <div className="border-b border-white/10 py-6">
    <div className="flex gap-4">
      {/* POSTER */}
      <img
        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
        alt={movie.title}
        className="w-22 h-30 md:w-34 md:h-46 rounded-lg object-cover flex-shrink-0 cursor-pointer"
        onClick={() => (window.location.href = `/movie/${movie.id}`)}
      />

      {/* INFO */}
      <div className="flex-1 min-w-0">
        <h3
          className="font-bold text-base md:text-xl mb-1 cursor-pointer hover:text-zinc-300 transition-colors"
          onClick={() => (window.location.href = `/movie/${movie.id}`)}
        >
          {movie.title}
        </h3>
        <div className="flex items-center gap-1 mb-3">
          <svg className="w-4 h-4 fill-yellow-400" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span className="text-sm text-zinc-400">
            {movie.vote_average.toFixed(1)}/10
          </span>
        </div>
        <p className="text-sm text-zinc-400 line-clamp-2 mb-4 hidden md:block">
          {movie.overview}
        </p>

        {/* BUTTONS */}
        <div className="flex items-center gap-3">
          <button
            onClick={onWatchTrailer}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 transition text-white text-sm font-semibold px-5 py-2.5 rounded-xl"
          >
            Watch Trailer
            <svg className="w-4 h-4 fill-white" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          </button>
          <button
            onClick={onRemove}
            className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-600/40 flex items-center justify-center hover:bg-red-600/40 transition"
          >
            <svg className="w-5 h-5 fill-red-500" viewBox="0 0 24 24">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
);

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
