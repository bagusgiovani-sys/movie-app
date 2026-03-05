
import { useQuery } from "@tanstack/react-query";
import { getTrendingMovies } from "../services/movie.service";
import type { Movie } from "../types/movie.types";

export const useTrendingMovies = () =>
  useQuery<Movie[]>({
    queryKey: ["trending-movies"],
    queryFn: getTrendingMovies,
  });
