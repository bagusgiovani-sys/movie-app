import { useQuery } from "@tanstack/react-query";
import { getLatestMovies } from "../services";
import type { Movie } from "../types/movie.types";

export const useLatestMovies = () =>
  useQuery<Movie[]>({
    queryKey: ["latest-movies"],
    queryFn: getLatestMovies,
  });