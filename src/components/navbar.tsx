import { Link } from "react-router-dom";
import "../index.css";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="w-full absolute top-0 px-4 sm:px-10 pr-4 sm:pr-10 lg:pr-20 py-5 flex items-center justify-between z-5">
      <div>
        <Link to="/">
          <img
            src="/image/logo.png"
            alt="PokeHUB"
            className="h-12 sm:h-16 lg:h-18 logo"
          />
        </Link>
      </div>

      {/* Mobile menu button */}
      <button
        className="cursor-pointer md:hidden text-neutral-100 z-50"
        onClick={toggleMenu}
      >
        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Desktop menu */}
      <div className="hidden md:flex gap-8 lg:gap-15 text-neutral-100">
        <Link
          to="/library"
          className="cursor-pointer hover:text-amber-600 font-jersey text-2xl lg:text-3xl hover:text-shadow-[0_0_10px_rgba(225,162,55, 1)] transition-colors"
        >
          LIBRARY
        </Link>
        <Link
          to="/battle"
          className="cursor-pointer hover:text-amber-600 font-jersey text-2xl lg:text-3xl hover:text-shadow-[0_0_10px_rgba(225,162,55, 1)] transition-colors"
        >
          BATTLE
        </Link>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={`${isMenuOpen ? "block" : "hidden"} md:hidden fixed`}
        onClick={toggleMenu}
      />

      {/* Mobile menu */}
      <div
        className={`${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden fixed top-0 right-0 h-full w-64 bg-gray-900/95 backdrop-blur-sm z-40 transition-transform duration-300 ease-in-out flex flex-col items-center justify-center gap-8`}
      >
        <Link
          to="/library"
          className="cursor-pointer hover:text-amber-600 font-jersey text-3xl hover:text-shadow-[0_0_10px_rgba(225,162,55, 1)] transition-colors text-neutral-100"
          onClick={toggleMenu}
        >
          LIBRARY
        </Link>
        <Link
          to="/battle"
          className="cursor-pointer hover:text-amber-600 font-jersey text-3xl hover:text-shadow-[0_0_10px_rgba(225,162,55, 1)] transition-colors text-neutral-100"
          onClick={toggleMenu}
        >
          BATTLE
        </Link>
      </div>
    </nav>
  );
}
