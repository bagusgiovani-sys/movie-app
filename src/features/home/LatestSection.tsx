// Grid of latest-release movies with a "Load More" button for pagination
import { useState } from "react";
import { motion } from "framer-motion";
import { useLatestMovies } from "../../hooks";
import { MovieCard } from "../../components/movie";

const LatestSection = () => {
  const { data: movies, isLoading, isError } = useLatestMovies();
  // How many movies are visible; grows by 5 on each "Load More" click
  const [visibleCount, setVisibleCount] = useState(15);

  // Loading placeholder — tall block prevents layout shift while data arrives
  if (isLoading || !movies) return <section className="bg-black h-96" />;

  if (isError) {
    return (
      <section className="bg-black py-16">
        <div className="layout-gutter">
          <h2 className="text-2xl font-bold mb-6">Latest Release</h2>
          <p className="text-zinc-500 text-sm">Could not load latest movies.</p>
        </div>
      </section>
    );
  }

  return (
    <motion.section
      className="bg-black py-16"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="layout-gutter">
        <h2 className="text-2xl font-bold mb-8">Latest Release</h2>

        <div className="relative">
          {/* Responsive grid — 2 columns on mobile, 5 on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {movies.slice(0, visibleCount).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {/* Fade + Load More — only shown when more movies exist beyond the current slice */}
          {visibleCount < movies.length && (
            <div className="relative mt-4">
              {/* Gradient covers the last row to soften the cutoff edge */}
              <div className="absolute -top-32 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />

              {/* Load More adds 5 more movies per click */}
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 5)}
                  className="px-10 py-3 rounded-full border border-white/40 hover:bg-white/10 transition"
                >
                  Load More
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
};

export default LatestSection;
