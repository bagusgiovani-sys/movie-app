import { useNavigate } from "react-router-dom";
import Logo from "../../assets/Logo.svg";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-black border-t border-white/30 mt-auto">
      <div className="layout-gutter py-8 lg:py-10">

        {/* DESKTOP */}
        <div className="hidden md:flex items-center justify-between">
          {/* LOGO */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src={Logo} alt="Movie Logo" className="h-8 w-auto" />
          </div>

          {/* COPYRIGHT */}
          <p className="text-sm text-zinc-500">
            Copyright ©{new Date().getFullYear()} Movie Explorer
          </p>
        </div>

        {/* MOBILE */}
        <div className="flex md:hidden flex-col items-start gap-6">
          {/* LOGO */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src={Logo} alt="Movie Logo" className="h-8 w-auto" />
          </div>
        
          {/* COPYRIGHT */}
          <p className="text-sm text-zinc-500">
            Copyright ©{new Date().getFullYear()} Movie Explorer
          </p>
        </div>

      </div>
    </footer>
  );
}