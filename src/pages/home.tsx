import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <>
      <main className="relative w-full h-full">
        <div className="bg-[url('/image/pokemonbg.gif')] h-screen bg-cover bg-center flex flex-col items-center justify-center text-zinc-200">
          <div className="w-full h-screen flex flex-col items-center justify-center bg-emerald-950/40 px-4">
            <h1 className="font-jersey text-6xl sm:text-8xl md:text-9xl text-shadow-[0_8px_#2d2c2c] sm:text-shadow-[0_10px_#2d2c2c] text-center">
              WELCOME TO
            </h1>
            <img
              src="/image/nameLogo.png"
              alt="PokeHUB"
              className="h-24 sm:h-32 md:h-48 logo -mt-2 sm:-mt-4 md:-mt-6 hover:scale-105 transition-transform ease-in-out duration-900"
            />
            <p className="font-revalia text-sm sm:text-base md:text-xl text-center mt-2 px-4">
              All the Pokémon Knowledge in One Place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 mt-6 w-full max-w-xs">
              <Link to="/library">
                <button className="cursor-pointer w-full sm:w-auto bg-[#DE4040] hover:bg-[#CC4242] text-zinc-200 font-pixelify text-lg sm:text-xl md:text-2xl py-3 px-6 rounded-xl shadow-md hover:translate-y-0.5 transition-all duration-100">
                  Library
                </button>
              </Link>
              <Link to="/battle">
                <button className=" cursor-pointer w-full sm:w-auto border-2 border-[#DE4040] hover:bg-[#CC4242] text-[#DE4040] hover:text-zinc-200 font-pixelify text-lg sm:text-xl md:text-2xl py-3 px-6 rounded-xl hover:translate-y-0.5 transition-all duration-100">
                  Battle
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
