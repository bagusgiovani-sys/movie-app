import { useState } from "react";
import type { MovieDetail } from "../../types";
import Button from "../../components/ui/Button";
import PlayIcon from "../../assets/Play_icon.svg";
import Overview from "./Overview";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

type MovieDetailHeroProps = {
  movie: MovieDetail;
  onWatchTrailer: () => void;
  onToggleFavorite: () => void;
  isFavorite: boolean;
};

// Mobile info cards
const InfoCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="bg-zinc-950/80 backdrop-blur-sm rounded-xl p-3 md:px-2 md:py-3 text-center border border-zinc-800 flex-1">
    <div className="flex justify-center mb-1 lg:mb-2">{icon}</div>
    <div className="text-[9px] md:text-[13px] text-zinc-500 mb-0.5">{label}</div>
    <div className="text-[11px] md:text-xl font-semibold">{value}</div>
  </div>
);

// Desktop compact pills with visible container
const StatPill = ({ icon, value }: { icon: React.ReactNode; value: string }) => (
  <div className="flex items-center gap-1.5 bg-zinc-950/80 backdrop-blur-sm border border-zinc-800 rounded-xl px-3 py-2">
    {icon}
    <span className="text-sm font-semibold text-white">{value}</span>
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
      <div className="md:hidden">
        <div className="relative h-80 bg-zinc-900">
          {!backdropLoaded && <div className="absolute inset-0 bg-zinc-800 animate-pulse" />}
          <img
            src={`${IMAGE_BASE_URL}${movie.backdrop_path}`}
            alt={movie.title}
            onLoad={() => setBackdropLoaded(true)}
            className={`w-full h-full object-cover object-top transition-opacity duration-500 ${backdropLoaded ? "opacity-100" : "opacity-0"}`}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
        </div>

        <div className="px-4 -mt-24 relative z-10">
          <div className="flex gap-4 mb-4">
            <div className="flex-shrink-0 w-28 h-44 rounded-lg overflow-hidden bg-zinc-800 relative">
              {!posterLoaded && <div className="absolute inset-0 bg-zinc-800 animate-pulse" />}
              {movie.poster_path && (
                <img
                  src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                  alt={movie.title}
                  onLoad={() => setPosterLoaded(true)}
                  className={`w-full h-full object-cover shadow-2xl transition-opacity duration-500 ${posterLoaded ? "opacity-100" : "opacity-0"}`}
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
            <Button onClick={onWatchTrailer} className="flex-1 justify-center">
              Watch Trailer
              <img src={PlayIcon} className="w-6 h-6" alt="Play" />
            </Button>
            <Button variant="favorite" isFavorite={isFavorite} onClick={onToggleFavorite} size="sm" />
          </div>

          {/* RATING CARDS */}
          <div className="flex gap-3 mb-6">
            <InfoCard label="Rating" value={`${movie.vote_average.toFixed(1)}/10`} icon={<svg className="w-6 h-6 fill-yellow-500" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>} />
            <InfoCard label="Genre" value={movie.genres?.[0]?.name ?? "—"} icon={<svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" /></svg>} />
            <InfoCard label="Age Limit" value={movie.adult ? "18+" : "13+"} icon={<div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center"><span className="text-xs font-bold">{movie.adult ? "18" : "13"}</span></div>} />
          </div>

          {/* OVERVIEW - mobile only */}
          <div className="mb-6">
            <Overview overview={movie.overview} />
          </div>
        </div>
      </div>

      {/* ── DESKTOP ───────────────────────────────────────────── */}
      <div className="hidden lg:block">
        <div className="relative h-full overflow-hidden bg-zinc-900">
          {!desktopBackdropLoaded && <div className="absolute inset-0 bg-zinc-800 animate-pulse" />}
          <img
            src={`${IMAGE_BASE_URL}${movie.backdrop_path}`}
            alt={movie.title}
            onLoad={() => setDesktopBackdropLoaded(true)}
            className={`w-full h-full object-cover object-center transition-opacity duration-500 ${desktopBackdropLoaded ? "opacity-100" : "opacity-0"}`}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/35 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

          <div className="absolute inset-0 layout-gutter flex items-end pb-60">
            <div className="flex gap-8 w-full items-end">
              {/* POSTER */}
              {movie.poster_path && (
                <div className="flex-shrink-0 w-56 rounded-2xl overflow-hidden bg-zinc-800 relative">
                  {!desktopPosterLoaded && <div className="absolute inset-0 bg-zinc-800 animate-pulse" />}
                  <img
                    src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                    alt={movie.title}
                    onLoad={() => setDesktopPosterLoaded(true)}
                    className={`w-full shadow-2xl transition-opacity duration-500 ${desktopPosterLoaded ? "opacity-100" : "opacity-0"}`}
                  />
                </div>
              )}

              {/* INFO */}
              <div className="flex-1 flex flex-col gap-4 pb-1">

                {/* ROW 1: BUTTONS + TITLE */}
                <div className="flex items-center gap-4">
                  <Button onClick={onWatchTrailer}>
                    Watch Trailer
                    <img src={PlayIcon} className="w-6 h-6" alt="Play" />
                  </Button>
                  <Button variant="favorite" isFavorite={isFavorite} onClick={onToggleFavorite} size="sm" />
                  <div className="w-px bg-zinc-700 self-stretch" />
                  <div className="flex-1">
                    <h1 className="text-4xl font-bold leading-tight">{movie.title}</h1>
                    <div className="flex items-center gap-1.5 text-sm text-zinc-300 mt-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{movie.release_date}</span>
                    </div>
                  </div>
                </div>

                {/* ROW 2: OVERVIEW HEADER + STAT PILLS */}
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold whitespace-nowrap">Overview</h2>
                  <div className="w-px bg-zinc-700 self-stretch" />
                  <div className="flex items-center gap-3">
                    <StatPill
                      value={`${movie.vote_average.toFixed(1)}/10`}
                      icon={<svg className="w-5 h-5 fill-yellow-500" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>}
                    />
                    <StatPill
                      value={movie.genres?.[0]?.name ?? "—"}
                      icon={<svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" /></svg>}
                    />
                    <StatPill
                      value={movie.adult ? "18+" : "13+"}
                      icon={<div className="w-5 h-5 bg-white/10 flex items-center justify-center rounded text-xs font-bold">{movie.adult ? "18" : "13"}</div>}
                    />
                  </div>
                </div>

                {/* ROW 3: OVERVIEW TEXT */}
                <p className="text-zinc-300 font-semibold text-sm leading-relaxed">
                  {movie.overview}
                </p>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieDetailHero;