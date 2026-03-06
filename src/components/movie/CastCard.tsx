import type { Cast } from "../../types";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

type CastCardProps = {
  member: Cast;
};

const CastCard = ({ member }: CastCardProps) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0">
        {member.profile_path ? (
          <img
            src={`${IMAGE_BASE_URL}${member.profile_path}`}
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