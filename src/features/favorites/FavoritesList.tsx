// src/features/favorites/FavoritesList.tsx
import MovieCard from "../../components/movie/MovieCard";
import { useFavorites } from "../../hooks";

const FavoritesList = () => {
  const { favorites } = useFavorites();

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-zinc-500">
        <p className="text-xl font-semibold mb-2">No favorites yet</p>
        <p className="text-sm">Start adding movies you love!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {favorites.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
};

export default FavoritesList;

