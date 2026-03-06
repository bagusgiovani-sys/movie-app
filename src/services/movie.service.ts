import { api } from "../lib/api";
import type {
  Movie,
  MovieDetail,
  Cast,
  Video,
  MovieListResponse,
  MovieVideosResponse,
} from "../types/movie.types";

/** Trending movies (Home - Trending section) */
export const getTrendingMovies = async (): Promise<Movie[]> => {
  const res = await api.get<MovieListResponse>("/trending/movie/day");
  return res.data.results;
};

/** Latest / Now Playing movies (Home - Latest section) */
export const getLatestMovies = async (): Promise<Movie[]> => {
  const res = await api.get<MovieListResponse>("/movie/now_playing");
  return res.data.results;
};

/** Search movies (Search page) */
export const searchMovies = async (query: string): Promise<Movie[]> => {
  const res = await api.get<MovieListResponse>("/search/movie", {
    params: { query },
  });
  return res.data.results;
};

/** Movie detail (Movie Detail page) */
export const getMovieDetail = async (id: string): Promise<MovieDetail> => {
  const res = await api.get<MovieDetail>(`/movie/${id}`);
  return res.data;
};

/** Movie credits/cast (Movie Detail page) */
export const getMovieCredits = async (id: string): Promise<Cast[]> => {
  const res = await api.get<{ cast: Cast[] }>(`/movie/${id}/credits`);
  return res.data.cast;
};

/** Movie videos/trailers (Movie Detail page) */
export const getMovieVideos = async (id: string): Promise<Video[]> => {
  const res = await api.get<MovieVideosResponse>(`/movie/${id}/videos`);
  return res.data.results.filter(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );
};