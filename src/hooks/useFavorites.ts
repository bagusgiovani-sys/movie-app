import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { Movie } from "../types/movie.types";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Movie[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  const toggleFavorite = (movie: Movie) => {
    const exists = favorites.find((m) => m.id === movie.id);

    const updated = exists
      ? favorites.filter((m) => m.id !== movie.id)
      : [...favorites, movie];

    localStorage.setItem("favorites", JSON.stringify(updated));
    setFavorites(updated);

    if (exists) {
      toast("Removed from favorites");
    } else {
      toast.success("Successfully added to favorites!");
    }
  };

  const isFavorite = (id: number) => favorites.some((m) => m.id === id);

  return { favorites, toggleFavorite, isFavorite };
};