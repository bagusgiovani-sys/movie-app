import { useTrendingMovies } from "../../hooks/useTrendingMovies";
import PlayIcon from "../../assets/Play_icon.svg";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

const HeroSection = () => {
  const { data: trendingMovies, isLoading, isError } = useTrendingMovies();

  if (isLoading || isError) {
    return <section className="h-screen w-full bg-black" />;
  }

  const movie = trendingMovies?.[0];
  const backdropUrl = movie?.backdrop_path
    ? `${IMAGE_BASE_URL}${movie.backdrop_path}`
    : "";

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* BACKGROUND IMAGE */}
      <div className="absolute inset-0">
        <img
          src={backdropUrl}
          alt={movie?.title}
          className="w-full h-full object-cover object-top"
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/40" />

        {/* BOTTOM FADE */}
        <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-black to-transparent" />
      </div>

      {/* HERO CONTENT */}
      <div className="relative z-10 h-full flex items-end pb-24">
        <div className="layout-gutter w-full space-y-6 max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-bold">
            {movie?.title}
          </h1>

          <p className="text-zinc-300 text-sm md:text-lg line-clamp-4">
            {movie?.overview}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* WATCH TRAILER */}
            <button
              className="
                w-full
                sm:w-auto
                flex
                items-center
                justify-center
                sm:justify-start
                gap-4
                rounded-full
                bg-[var(--color-primary-300)]
                px-8
                py-4
                font-semibold
                hover:bg-[var(--color-primary-400)]
                transition
              "
            >
              Watch Trailer
              <img src={PlayIcon} className="w-6 h-6" alt="Play" />
            </button>

            {/* SEE DETAIL */}
            <button
              className="
                w-full
                sm:w-auto
                rounded-full
                border
                border-white/30
                px-10
                py-4
                hover:bg-white/10
                transition
              "
            >
              See Detail
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
