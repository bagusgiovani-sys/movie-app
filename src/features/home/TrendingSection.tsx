import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTrendingMovies } from "../../hooks";
import MovieCard from "../../components/movie/MovieCard";
import ArrowRight from "../../assets/Arrow.svg";

const CARD_WIDTH = 224;

const TrendingSection = () => {
  const { data: movies, isLoading, isError } = useTrendingMovies();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  if (isLoading || isError || !movies) {
    return <section className="bg-black h-64 w-full" />;
  }

  const handleScroll = () => {
    if (sliderRef.current) {
      setScrollPosition(sliderRef.current.scrollLeft);
    }
  };

  const slideRight = () => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({ left: CARD_WIDTH * 5, behavior: "smooth" });
  };

  const slideLeft = () => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({ left: -CARD_WIDTH * 5, behavior: "smooth" });
  };

  return (
    <motion.section
      className="bg-black py-12 relative"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
    >
      <div className="layout-gutter">
        <h2 className="text-2xl font-bold mb-6">Trending Now</h2>

        <div className="relative">
          {/* SLIDER */}
          <div
            ref={sliderRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-scroll scroll-smooth scrollbar-hide"
          >
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                className="min-w-[200px] md:min-w-[200px] flex-shrink-0"
              />
            ))}
          </div>

          {/* LEFT FADE */}
          <div
            className={`pointer-events-none absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-black to-transparent transition-opacity duration-300 ${
              scrollPosition > 0 ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* RIGHT FADE */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-black to-transparent" />

          {/* LEFT ARROW */}
          <button
            onClick={slideLeft}
            className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/70 p-3 rounded-full hover:bg-black transition-all duration-300 ${
              scrollPosition > 0 ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <img src={ArrowRight} alt="prev" className="w-5 h-5 rotate-180" />
          </button>

          {/* RIGHT ARROW */}
          <button
            onClick={slideRight}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/70 p-3 rounded-full hover:bg-black transition-all duration-300"
          >
            <img src={ArrowRight} alt="next" className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.section>
  );
};

export default TrendingSection;