// src/components/home/TrendingSection.tsx
import { useRef } from "react";
import { useTrendingMovies } from "../../hooks/useTrendingMovies";
import type { Movie } from "../../types/movie.types";
import ArrowRight from "../../assets/Arrow.svg";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const CARD_WIDTH = 224; // 200px card + 24px gap

const TrendingSection = () => {
  const { data: movies, isLoading, isError } = useTrendingMovies();
  const sliderRef = useRef<HTMLDivElement>(null);

  if (isLoading || isError || !movies) {
    return <section className="bg-black h-64 w-full" />;
  }

  const handleSlide = () => {
    if (!sliderRef.current) return;

    sliderRef.current.scrollBy({
      left: CARD_WIDTH * 5,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-black py-12 relative">
      <div className="layout-gutter">
        <h2 className="text-2xl font-bold mb-6">Trending Now</h2>

        <div className="relative">
          {/* SLIDER */}
          <div
            ref={sliderRef}
            className="
              flex gap-6 overflow-x-scroll scroll-smooth
              scrollbar-hide
            "
          >
            {movies.map((movie: Movie) => (
              <div
                key={movie.id}
                className="
                  min-w-[200px] h-[300px]
                  rounded-lg overflow-hidden
                  bg-zinc-900 flex-shrink-0
                "
              >
                {movie.poster_path && (
                  <img
                    src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>

          {/* RIGHT FADE */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-black to-transparent" />

          {/* ARROW BUTTON */}
          <button
            onClick={handleSlide}
            className="
              absolute right-4 top-1/2 -translate-y-1/2 z-10
              bg-black/70 p-3 rounded-full
              hover:bg-black transition
            "
          >
            <img src={ArrowRight} alt="next" className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
