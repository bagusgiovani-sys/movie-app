import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CloseIcon, SearchIcon, MenuIcon } from "../ui/icons";
import Logo from "../../assets/Logo.svg";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileSearchOpen) {
      setTimeout(() => mobileInputRef.current?.focus(), 150);
    }
  }, [mobileSearchOpen]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setMobileSearchOpen(false);
      setOpen(false);
    }
  };

  const handleSearchClick = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setMobileSearchOpen(false);
      setOpen(false);
    }
  };

  return (
    <motion.header
      className={`fixed top-0 z-50 w-full font-extralight transition-all duration-300 ${
        scrolled ? "backdrop-blur-2xl bg-black/40" : "bg-transparent"
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <div className="layout-gutter flex h-20 md:h-12 items-center mt-2 md:mb-8 md:mt-8 text-[var(--font-size-xl)]">

        {/* LEFT */}
        <div className="flex items-center md:gap-20">
          <img
            src={Logo}
            alt="Movie Logo"
            className="h-8 w-auto sm:h-8 md:h-12 cursor-pointer"
            onClick={() => navigate("/")}
          />

          <nav className="hidden md:flex gap-12 md:text-xl">
            <a href="/" className="group relative inline-block text-gray-300 transition-all duration-300 hover:text-white">
              <span className="relative z-10 block transition-transform duration-300 group-hover:-translate-y-[1px]">Home</span>
              <span className="absolute -bottom-1 left-0 h-[1.5px] w-full origin-left scale-x-0 bg-[var(--color-primary-300)] transition-transform duration-300 group-hover:scale-x-100" />
            </a>
            <a href="/favorites" className="group relative inline-block text-gray-300 transition-all duration-300 hover:text-white">
              <span className="relative z-10 block transition-transform duration-300 group-hover:-translate-y-[1px]">Favorites</span>
              <span className="absolute -bottom-1 left-0 h-[1.5px] w-full origin-left scale-x-0 bg-[var(--color-primary-300)] transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          </nav>
        </div>

        {/* RIGHT */}
        <div className="ml-auto flex items-center gap-3">

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
            <button onClick={handleSearchClick}>
              <SearchIcon className="h-[1em] w-[1em] text-white/70 hover:text-white transition-colors" />
            </button>
            <input
              type="text"
              placeholder="Search Movie"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="w-40 bg-transparent text-white outline-none placeholder:text-white/40"
            />
          </div>

          {/* MOBILE Search */}
          <div className="flex md:hidden items-center gap-3">

            {/* Expandable Search */}
            <div className="flex items-center justify-end">
              <AnimatePresence>
                {mobileSearchOpen && (
                  <motion.div
                    className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 mr-2"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "180px", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <input
                      ref={mobileInputRef}
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleSearch}
                      className="w-full bg-transparent text-white outline-none placeholder:text-white/40 text-sm whitespace-nowrap"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={() => setMobileSearchOpen((prev) => !prev)}
                className="text-white"
                aria-label="Toggle search"
              >
                <SearchIcon className="h-6.5 w-6.5" />
              </button>
            </div>

            {/* Hamburger / Close toggle */}
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="text-white"
              aria-label="Toggle menu"
            >
              {open ? <CloseIcon className="h-6.5 w-6.5" /> : <MenuIcon className="h-6.5 w-6.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="md:hidden"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="layout-gutter pb-6">
              <nav className="mt-4 flex flex-col gap-4 text-white text-[var(--font-size-xl)]">
                <a href="/" onClick={() => setOpen(false)}>Home</a>
                <a href="/favorites" onClick={() => setOpen(false)}>Favorites</a>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}