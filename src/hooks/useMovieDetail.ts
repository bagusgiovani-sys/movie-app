import { useQuery } from "@tanstack/react-query";
import { getMovieDetail } from "../services/movie.service";

export const useMovieDetail = (id: string) =>
  useQuery({
    queryKey: ["movie-detail", id],
    queryFn: () => getMovieDetail(id),
    enabled: !!id,
  });
