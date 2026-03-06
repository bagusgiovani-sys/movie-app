import CastCard from "../../components/movie/CastCard";
import type { Cast } from "../../types";

type CastCrewProps = {
  cast: Cast[];
};

const CastCrew = ({ cast }: CastCrewProps) => {
  return (
    <div className="pb-8 lg:pb-12">
      <h2 className="text-lg lg:text-3xl font-bold mb-4 lg:mb-6">Cast & Crew</h2>

      {/* Mobile - list */}
      <div className="lg:hidden space-y-3">
        {cast.slice(0, 5).map((member) => (
          <CastCard key={member.id} member={member} />
        ))}
      </div>

      {/* Desktop - grid */}
      <div className="hidden lg:grid grid-cols-3 gap-6">
        {cast.slice(0, 6).map((member) => (
          <CastCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
};

export default CastCrew;