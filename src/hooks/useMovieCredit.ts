import { useQuery } from "@tanstack/react-query";
import { getMovieCredits } from "../services/movie.service";

export const useMovieCredits = (id: string) =>
  useQuery({
    queryKey: ["movie-credits", id],
    queryFn: () => getMovieCredits(id),
    enabled: !!id,
  });
