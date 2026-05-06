// Horizontal scroll carousel of trending movies with left/right arrow navigation
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTrendingMovies } from "../../hooks";
import { MovieCard } from "../../components/movie";
import ArrowRight from "../../assets/Arrow.svg";

// Number of pixels per card — used to jump the slider by 5 cards per arrow click
const CARD_WIDTH = 224;

const TrendingSection = () => {
  const { data: movies, isLoading, isError } = useTrendingMovies();
  const sliderRef = useRef<HTMLDivElement>(null);
  // Track scroll offset to show/hide the left arrow and left fade
  const [scrollPosition, setScrollPosition] = useState(0);
  // Hide the right arrow once the slider is fully scrolled to the end
  const [atEnd, setAtEnd] = useState(false);

  // Check if the list fits without scrolling (e.g. very few results) so the right arrow starts hidden
  useEffect(() => {
    const el = sliderRef.current;
    if (el) setAtEnd(el.scrollWidth <= el.clientWidth);
  }, [movies]);

  // Loading placeholder — matches approximate section height to prevent layout shift
  if (isLoading || !movies) return <section className="bg-black h-64 w-full" />;

  if (isError) {
    return (
      <section className="bg-black py-12">
        <div className="layout-gutter">
          <h2 className="text-2xl font-bold mb-4">Trending Now</h2>
          <p className="text-zinc-500 text-sm">Could not load trending movies.</p>
        </div>
      </section>
    );
  }

  // Sync scroll position state and atEnd flag on every scroll event
  const handleScroll = () => {
    const el = sliderRef.current;
    if (!el) return;
    setScrollPosition(el.scrollLeft);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 10);
  };

  // Jump right / left by 5 card widths with smooth scroll
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
          {/* Scrollable card row — native scroll, no visible scrollbar */}
          <div
            ref={sliderRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-scroll scroll-smooth scrollbar-hide"
          >
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                className="min-w-[200px] flex-shrink-0"
              />
            ))}
          </div>

          {/* Left edge fade — visible only when scrolled away from the start */}
          <div
            className={`pointer-events-none absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-black to-transparent transition-opacity duration-300 ${
              scrollPosition > 0 ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Right edge fade — always present to hint more content */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-black to-transparent" />

          {/* Left arrow — hidden until the user has scrolled right */}
          <button
            onClick={slideLeft}
            className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/70 p-3 rounded-full hover:bg-black transition-all duration-300 ${
              scrollPosition > 0 ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <img src={ArrowRight} alt="prev" className="w-5 h-5 rotate-180" />
          </button>

          {/* Right arrow — hidden when the slider is fully scrolled to the end */}
          <button
            onClick={slideRight}
            className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/70 p-3 rounded-full hover:bg-black transition-all duration-300 ${
              atEnd ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            <img src={ArrowRight} alt="next" className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.section>
  );
};

export default TrendingSection;
