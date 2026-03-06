import { useQuery } from "@tanstack/react-query";
import { getMovieCredits } from "../services";
import type { Cast } from "../types/movie.types";

export const useMovieCredits = (id: string) =>
  useQuery<Cast[]>({
    queryKey: ["movie-credits", id],
    queryFn: () => getMovieCredits(id),
    enabled: !!id,
  });