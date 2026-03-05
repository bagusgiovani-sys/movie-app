import { useQuery } from "@tanstack/react-query";
import { searchMovies } from "../services/movie.service";

export const useSearchMovies = (query: string) =>
  useQuery({
    queryKey: ["search-movies", query],
    queryFn: () => searchMovies(query),
    enabled: !!query,
  });
