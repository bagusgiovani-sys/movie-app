import { useState } from "react";
import { motion } from "framer-motion";
import { useLatestMovies } from "../../hooks";
import MovieCard from "../../components/movie/MovieCard";

const LatestSection = () => {
  const { data: movies, isLoading, isError } = useLatestMovies();
  const [visibleCount, setVisibleCount] = useState(15);

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
          {/* GRID */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {movies.slice(0, visibleCount).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {/* FADE + LOAD MORE */}
          {visibleCount < movies.length && (
            <div className="relative mt-4">
              {/* GRADIENT FADE */}
              <div className="absolute -top-32 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />

              {/* LOAD MORE BUTTON */}
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