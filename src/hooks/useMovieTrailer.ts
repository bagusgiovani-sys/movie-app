import { useQuery } from "@tanstack/react-query";
import { getMovieVideos } from "../services/movie.service";

export const useMovieTrailer = (id: string) => {
  return useQuery({
    queryKey: ["movie-trailer", id],
    queryFn: () => getMovieVideos(id),
    enabled: !!id,
    select: (data) =>
      data.results.find(
        (v: any) => v.type === "Trailer" && v.site === "YouTube"
      ),
  });
};
