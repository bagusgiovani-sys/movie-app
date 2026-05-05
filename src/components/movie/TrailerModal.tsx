type Props = {
  videoKey: string;
  onClose: () => void;
};

const TrailerModal = ({ videoKey, onClose }: Props) => {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white text-xl hover:text-zinc-400 transition"
      >
        ✕
      </button>

      <div
        className="w-10/12 h-10/12 aspect-video"
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
          title="Movie Trailer"
          className="w-full h-full rounded-xl"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default TrailerModal;