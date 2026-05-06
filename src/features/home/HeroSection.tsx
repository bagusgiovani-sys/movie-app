// Full-screen hero — shows the #1 trending movie with a trailer button and detail link
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTrendingMovies, useMovieTrailer } from "../../hooks";
import { TrailerModal } from "../../components/movie";
import { Button } from "../../components/ui";
import PlayIcon from "../../assets/Play_icon.svg";
import { TMDB_IMAGE_URL } from "../../lib/constants";

const HeroSection = () => {
  // Fetch trending list; pick the first movie as the featured title
  const { data: trendingMovies, isLoading, isError } = useTrendingMovies();
  const [openTrailer, setOpenTrailer] = useState(false);
  const navigate = useNavigate();

  const movie = trendingMovies?.[0];
  // Trailer hook requires a string id; pass empty string when no movie yet (hook is disabled internally)
  const { data: trailer } = useMovieTrailer(movie?.id ? String(movie.id) : "");

  // Loading — hold the full viewport height to prevent layout shift
  if (isLoading) return <section className="h-screen w-full bg-black" />;

  if (isError) {
    return (
      <section className="h-screen w-full bg-black flex items-center justify-center">
        <p className="text-zinc-500">Could not load featured movie.</p>
      </section>
    );
  }

  // No movie returned (empty trending list) — same placeholder height
  if (!movie) return <section className="h-screen w-full bg-black" />;

  // Use null instead of empty string so the img tag is skipped entirely when missing
  const backdropUrl = movie.backdrop_path
    ? `${TMDB_IMAGE_URL.original}${movie.backdrop_path}`
    : null;

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background — backdrop image with dark overlay and bottom fade */}
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

      {/* Content — staggered-entry title, overview snippet, and action buttons */}
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

          {/* Buttons — trailer disabled when no trailer key is available */}
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

      {/* Trailer modal — only mounts when the modal is open and a trailer key exists */}
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
