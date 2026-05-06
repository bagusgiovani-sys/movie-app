import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";

const FavoritesEmptyState = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-6">
      <span className="text-8xl">🎬</span>
      <div className="text-center">
        <p className="text-lg font-semibold text-white mb-1">Data Empty</p>
        <p className="text-sm text-zinc-400">You don't have a favorite movie yet</p>
      </div>
      <Button onClick={() => navigate("/")}>Explore Movie</Button>
    </div>
  );
};

export default FavoritesEmptyState;
