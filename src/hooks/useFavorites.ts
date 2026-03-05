import { useState, useEffect } from "react";
import type { Movie } from "../types/movie.types";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Movie[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  const toggleFavorite = (movie: Movie) => {
    setFavorites((prev) => {
      const exists = prev.find((m) => m.id === movie.id);
      const updated = exists
        ? prev.filter((m) => m.id !== movie.id)
        : [...prev, movie];

      localStorage.setItem("favorites", JSON.stringify(updated));
      return updated;
    });
  };

  const isFavorite = (id: number) =>
    favorites.some((m) => m.id === id);

  return { favorites, toggleFavorite, isFavorite };
};
