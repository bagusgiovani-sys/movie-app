import type { Cast } from "../../types";
import { TMDB_IMAGE_URL } from "../../lib/constants";

type CastCardProps = {
  member: Cast;
};

const CastCard = ({ member }: CastCardProps) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0">
        {member.profile_path ? (
          <img
            src={`${TMDB_IMAGE_URL.w500}${member.profile_path}`}
            alt={member.name}
            className="w-14 h-14 lg:w-20 lg:h-20 rounded-xl object-cover"
          />
        ) : (
          <div className="w-14 h-14 lg:w-20 lg:h-20 rounded-xl bg-zinc-800" />
        )}
      </div>
      <div>
        <div className="font-semibold text-sm lg:text-base mb-0.5">{member.name}</div>
        <div className="text-xs lg:text-sm text-zinc-500">{member.character}</div>
      </div>
    </div>
  );
};

export default CastCard;