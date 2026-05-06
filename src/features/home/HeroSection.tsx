import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTrendingMovies, useMovieTrailer } from "../../hooks";
import { TrailerModal } from "../../components/movie";
import { Button } from "../../components/ui";
import PlayIcon from "../../assets/Play_icon.svg";
import { TMDB_IMAGE_URL } from "../../lib/constants";

const HeroSection = () => {
  const { data: trendingMovies, isLoading, isError } = useTrendingMovies();
  const [openTrailer, setOpenTrailer] = useState(false);
  const navigate = useNavigate();

  const movie = trendingMovies?.[0];
  const { data: trailer } = useMovieTrailer(movie?.id ? String(movie.id) : "");

  if (isLoading) return <section className="h-screen w-full bg-black" />;

  if (isError) {
    return (
      <section className="h-screen w-full bg-black flex items-center justify-center">
        <p className="text-zinc-500">Could not load featured movie.</p>
      </section>
    );
  }

  if (!movie) return <section className="h-screen w-full bg-black" />;

  const backdropUrl = movie.backdrop_path
    ? `${TMDB_IMAGE_URL.original}${movie.backdrop_path}`
    : null;

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* BACKGROUND IMAGE */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      >
        {backdropUrl && (
          <img
            src={backdropUrl}
            alt={movie.title}
            className="w-full h-full object-cover object-top"
          />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-black to-transparent" />
      </motion.div>

      {/* HERO CONTENT */}
      <div className="relative z-10 h-full flex items-end pb-24">
        <div className="layout-gutter w-full space-y-6 max-w-2xl">

          <motion.h1
            className="text-3xl md:text-5xl font-bold"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
          >
            {movie.title}
          </motion.h1>

          <motion.p
            className="text-zinc-300 text-sm md:text-lg line-clamp-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: "easeOut" }}
          >
            {movie.overview}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9, ease: "easeOut" }}
          >
            <Button disabled={!trailer} onClick={() => setOpenTrailer(true)}>
              Watch Trailer
              <img src={PlayIcon} className="w-6 h-6" alt="Play" />
            </Button>

            <Button variant="secondary" onClick={() => navigate(`/movie/${movie.id}`)}>
              See Detail
            </Button>
          </motion.div>
        </div>
      </div>

      {/* TRAILER MODAL */}
      {openTrailer && trailer && (
        <TrailerModal
          videoKey={trailer.key}
          onClose={() => setOpenTrailer(false)}
        />
      )}
    </section>
  );
};

export default HeroSection;