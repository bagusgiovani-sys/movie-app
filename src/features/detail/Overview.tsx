type OverviewProps = {
  overview: string;
};

const Overview = ({ overview }: OverviewProps) => {
  return (
    <div className="w-full mb-8 md:pb-2">
      <h2 className="text-lg md:text-3xl font-bold mb-3 lg:mb-4">Overview</h2>
      <p className="w-full text-sm lg:text-base text-zinc-400 leading-relaxed">
        {overview}
      </p>
    </div>
  );
};

export default Overview;