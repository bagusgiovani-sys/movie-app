import { useQuery } from "@tanstack/react-query";
import { getMovieDetail } from "../services";
import type { MovieDetail } from "../types/movie.types";

export const useMovieDetail = (id: string) =>
  useQuery<MovieDetail>({
    queryKey: ["movie-detail", id],
    queryFn: () => getMovieDetail(id),
    enabled: !!id,
  });