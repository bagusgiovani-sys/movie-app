import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFavorites } from "../hooks";
import { useMovieTrailer } from "../hooks";
import { FavoriteItem, FavoritesEmptyState } from "../features/favorites";
import { TrailerModal } from "../components/movie";

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
          <FavoritesEmptyState />
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
