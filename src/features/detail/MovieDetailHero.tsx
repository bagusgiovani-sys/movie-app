import { useState } from "react";
import type { MovieDetail } from "../../types";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

type MovieDetailHeroProps = {
  movie: MovieDetail;
  onWatchTrailer: () => void;
  onToggleFavorite: () => void;
  isFavorite: boolean;
};

const InfoCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="bg-zinc-950/80 backdrop-blur-sm rounded-xl p-2 md:px-4 md:py-5 text-center border border-zinc-800 flex-1">
    <div className="flex justify-center mb-1 lg:mb-2">{icon}</div>
    <div className="text-xs text-zinc-500 mb-0.5">{label}</div>
    <div className="text-sm lg:text-2xl font-semibold">{value}</div>
  </div>
);

const MovieDetailHero = ({
  movie,
  onWatchTrailer,
  onToggleFavorite,
  isFavorite,
}: MovieDetailHeroProps) => {
  const [backdropLoaded, setBackdropLoaded] = useState(false);
  const [posterLoaded, setPosterLoaded] = useState(false);
  const [desktopBackdropLoaded, setDesktopBackdropLoaded] = useState(false);
  const [desktopPosterLoaded, setDesktopPosterLoaded] = useState(false);

  return (
    <>
      {/* ── MOBILE ────────────────────────────────────────────── */}
      <div className="lg:hidden">
        {/* BACKDROP */}
        <div className="relative h-80 bg-zinc-900">
          {!backdropLoaded && (
            <div className="absolute inset-0 bg-zinc-800 animate-pulse" />
          )}
          <img
            src={`${IMAGE_BASE_URL}${movie.backdrop_path}`}
            alt={movie.title}
            onLoad={() => setBackdropLoaded(true)}
            className={`w-full h-full object-cover object-top transition-opacity duration-500 ${
              backdropLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
        </div>

        <div className="px-4 -mt-24 relative z-10">
          {/* POSTER + TITLE */}
          <div className="flex gap-4 mb-4">
            <div className="flex-shrink-0 w-28 h-40 rounded-lg overflow-hidden bg-zinc-800 relative">
              {!posterLoaded && (
                <div className="absolute inset-0 bg-zinc-800 animate-pulse" />
              )}
              {movie.poster_path && (
                <img
                  src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                  alt={movie.title}
                  onLoad={() => setPosterLoaded(true)}
                  className={`w-full h-full object-cover shadow-2xl transition-opacity duration-500 ${
                    posterLoaded ? "opacity-100" : "opacity-0"
                  }`}
                />
              )}
            </div>
            <div className="flex-1 flex flex-col justify-end pb-1">
              <h1 className="text-xl font-bold mb-1 leading-tight">{movie.title}</h1>
              <div className="flex items-center gap-1.5 text-sm text-zinc-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{movie.release_date}</span>
              </div>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-3 mb-5">
            <button
              onClick={onWatchTrailer}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <span>Watch Trailer</span>
              <svg className="w-4 h-4 fill-white" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </button>
            <button
              onClick={onToggleFavorite}
              className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${
                isFavorite ? "bg-red-600" : "bg-transparent border-2 border-zinc-800"
              }`}
            >
              <svg
                className={`w-6 h-6 ${isFavorite ? "fill-white" : "fill-none"}`}
                stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          {/* RATING CARDS */}
          <div className="flex gap-3 mb-6">
            <InfoCard
              label="Rating"
              value={`${movie.vote_average.toFixed(1)}/10`}
              icon={<svg className="w-6 h-6 fill-yellow-500" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>}
            />
            <InfoCard
              label="Genre"
              value={movie.genres?.[0]?.name ?? "—"}
              icon={<svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" /></svg>}
            />
            <InfoCard
              label="Age Limit"
              value={movie.adult ? "18+" : "13+"}
              icon={
                <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center">
                  <span className="text-xs font-bold">{movie.adult ? "18" : "13"}</span>
                </div>
              }
            />
          </div>
        </div>
      </div>

      {/* ── DESKTOP ───────────────────────────────────────────── */}
      <div className="hidden lg:block">
        <div className="relative h-full overflow-hidden bg-zinc-900">
          {/* BACKDROP SKELETON */}
          {!desktopBackdropLoaded && (
            <div className="absolute inset-0 bg-zinc-800 animate-pulse" />
          )}
          <img
            src={`${IMAGE_BASE_URL}${movie.backdrop_path}`}
            alt={movie.title}
            onLoad={() => setDesktopBackdropLoaded(true)}
            className={`w-full h-full object-cover object-center transition-opacity duration-500 ${
              desktopBackdropLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

          <div className="absolute inset-0 layout-gutter flex items-end md:mb-55">
            <div className="flex gap-8 w-full">
              {/* POSTER */}
              {movie.poster_path && (
                <div className="flex-shrink-0 w-56 rounded-2xl overflow-hidden bg-zinc-800 relative">
                  {!desktopPosterLoaded && (
                    <div className="absolute inset-0 bg-zinc-800 animate-pulse" />
                  )}
                  <img
                    src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                    alt={movie.title}
                    onLoad={() => setDesktopPosterLoaded(true)}
                    className={`w-full shadow-2xl transition-opacity duration-500 ${
                      desktopPosterLoaded ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </div>
              )}

              {/* INFO */}
              <div className="flex-1 flex flex-col justify-end gap-4">
                <h1 className="text-5xl font-bold">{movie.title}</h1>
                <div className="flex items-center gap-2 text-zinc-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{movie.release_date}</span>
                </div>

                {/* BUTTONS */}
                <div className="flex gap-4">
                  <button
                    onClick={onWatchTrailer}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-10 py-4 rounded-xl flex items-center gap-3 transition-colors"
                  >
                    <span>Watch Trailer</span>
                    <svg className="w-5 h-5 fill-white" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </button>
                  <button
                    onClick={onToggleFavorite}
                    className={`w-16 h-16 rounded-xl flex items-center justify-center transition-all ${
                      isFavorite ? "bg-red-600" : "bg-transparent border-2 border-zinc-700 hover:border-zinc-600"
                    }`}
                  >
                    <svg
                      className={`w-7 h-7 ${isFavorite ? "fill-white" : "fill-none"}`}
                      stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>

                {/* RATING CARDS */}
                <div className="flex gap-4">
                  <InfoCard
                    label="Rating"
                    value={`${movie.vote_average.toFixed(1)}/10`}
                    icon={<svg className="w-8 h-8 fill-yellow-500" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>}
                  />
                  <InfoCard
                    label="Genre"
                    value={movie.genres?.[0]?.name ?? "—"}
                    icon={<svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" /></svg>}
                  />
                  <InfoCard
                    label="Age Limit"
                    value={movie.adult ? "18+" : "13+"}
                    icon={
                      <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
                        <span className="text-sm font-bold">{movie.adult ? "18" : "13"}</span>
                      </div>
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieDetailHero;