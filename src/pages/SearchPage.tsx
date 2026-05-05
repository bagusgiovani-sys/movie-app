import { useSearchParams } from "react-router-dom";
import { useSearchMovies } from "../hooks";
import MovieCardHorizontal from "../components/movie/MovieCardHorizontal";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const { data: movies, isLoading, isError } = useSearchMovies(query);

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-12 px-4">
      <div className="layout-gutter">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Search Results</h1>
          {query && (
            <p className="text-zinc-400 text-lg">
              Showing results for "{query}"
            </p>
          )}
        </div>

        {/* LOADING */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
          </div>
        )}

        {/* ERROR */}
        {isError && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400 text-center">
            Failed to search movies. Please try again.
          </div>
        )}

        {/* RESULTS */}
        {!isLoading && !isError && movies && movies.length > 0 && (
          <div className="flex flex-col gap-2">
            {movies.map((movie) => (
              <MovieCardHorizontal key={movie.id} movie={movie} />
            ))}
          </div>
        )}

        {/* NO RESULTS */}
        {!isLoading && !isError && movies?.length === 0 && query && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎬</div>
            <h2 className="text-2xl font-bold mb-2">No movies found</h2>
            <p className="text-zinc-400">Try searching with different keywords</p>
          </div>
        )}

        {/* INITIAL STATE */}
        {!query && !isLoading && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold mb-2">Start searching</h2>
            <p className="text-zinc-400">Use the search bar above to find movies</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;