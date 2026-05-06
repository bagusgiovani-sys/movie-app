// Favorites page — lists saved movies with animated removal and inline trailer playback
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFavorites } from "../hooks";
import { useMovieTrailer } from "../hooks";
import { FavoriteItem, FavoritesEmptyState } from "../features/favorites";
import { TrailerModal } from "../components/movie";

const FavoritesPage = () => {
  const { favorites, toggleFavorite } = useFavorites();
  // Store the id of the movie whose trailer is being requested; null means no modal
  const [trailerMovieId, setTrailerMovieId] = useState<number | null>(null);
  // Fetch the trailer for whichever card was clicked; hook is inactive when id is empty
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

        {/* Empty state — shown when the user has no saved movies */}
        {favorites.length === 0 ? (
          <FavoritesEmptyState />
        ) : (
          // AnimatePresence animates each card out (height collapse) when removed
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

      {/* Trailer modal — only mounts when both a movie id and a trailer key are present */}
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
