import Hero from "./HeroSection";
import NewRelease from "./LatestSection";
import Trending from "./TrendingSection";

export default function HomeContent() {
  return (
    <section className="relative w-full overflow-hidden">
      <Hero />
      <Trending />
      <NewRelease />
    </section>
  );
}