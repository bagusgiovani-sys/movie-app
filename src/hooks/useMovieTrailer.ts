import { useQuery } from "@tanstack/react-query";
import { getMovieVideos } from "../services";
import type { Video } from "../types/movie.types";

export const useMovieTrailer = (id: string) =>
  useQuery<Video[], Error, Video | undefined>({
    queryKey: ["movie-trailer", id],
    queryFn: () => getMovieVideos(id),
    enabled: !!id,
    select: (data) => data[0],
  });