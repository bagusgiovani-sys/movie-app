// Site footer — logo + copyright, separate layouts for desktop and mobile
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/Logo.svg";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-black border-t border-white/30 mt-auto">
      <div className="layout-gutter py-8 lg:py-10">

        {/* Desktop layout — logo on the left, copyright on the right */}
        <div className="hidden md:flex items-center justify-between">
          {/* Logo — navigates home on click */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src={Logo} alt="Movie Logo" className="h-8 w-auto" />
          </div>

          {/* Dynamic year so the copyright never goes stale */}
          <p className="text-sm text-zinc-500">
            Copyright ©{new Date().getFullYear()} Movie Explorer
          </p>
        </div>

        {/* Mobile layout — stacked column: logo then copyright */}
        <div className="flex md:hidden flex-col items-start gap-6">
          {/* Logo — navigates home on click */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src={Logo} alt="Movie Logo" className="h-8 w-auto" />
          </div>

          <p className="text-sm text-zinc-500">
            Copyright ©{new Date().getFullYear()} Movie Explorer
          </p>
        </div>

      </div>
    </footer>
  );
}
