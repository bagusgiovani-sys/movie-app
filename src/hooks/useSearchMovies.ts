import { useQuery } from "@tanstack/react-query";
import { searchMovies } from "../services";
import type { Movie } from "../types/movie.types";

export const useSearchMovies = (query: string) =>
  useQuery<Movie[]>({
    queryKey: ["search-movies", query],
    queryFn: () => searchMovies(query),
    enabled: !!query,
  });