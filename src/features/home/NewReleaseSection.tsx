// src/components/home/LatestSection.tsx
import { useState } from "react";
import { useLatestMovies } from "../../hooks/useLatestMovies";
import type { Movie } from "../../types/movie.types";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const LatestSection = () => {
  const { data: movies, isLoading, isError } = useLatestMovies();
  const [visibleCount, setVisibleCount] = useState(15);

  if (isLoading || isError || !movies) {
    return <section className="bg-black h-96" />;
  }

  return (
    <section className="bg-black py-16">
      <div className="layout-gutter">
        <h2 className="text-2xl font-bold mb-8">Latest Release</h2>

        <div className="relative">
          {/* GRID */}
          <div className="grid grid-cols-5 gap-6">
            {movies.slice(0, visibleCount).map((movie: Movie) => (
              <div
                key={movie.id}
                className="h-[300px] rounded-lg overflow-hidden bg-zinc-900"
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

          {/* LOAD MORE */}
          {visibleCount < movies.length && (
            <div className="flex justify-center mt-12">
              <button
                onClick={() => setVisibleCount((prev) => prev + 5)}
                className="
                  px-10 py-3 rounded-full
                  border border-white/40
                  hover:bg-white/10
                "
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LatestSection;
