import { memo } from "react";
import type { PokemonListItem } from "@/types/pokemon";

function PokemonCardComponent({ pokemon }: { pokemon: PokemonListItem }) {
  const id = Number(pokemon.url.split("/").filter(Boolean).pop());

  return (
    <div>
      <div className="card w-full max-w-32 cursor-pointer rounded-2xl h-auto min-h-45 flex flex-col px-2 py-3 logo transition-transform hover:scale-105 hover:-translate-y-1">
        <div className="w-full p-2 rounded-2xl flex items-center justify-center bg-amber-200 shadow-md">
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
            alt={pokemon.name}
            className="w-full h-full max-h-25 object-contain img"
          />
        </div>
        <div className="rounded-b-2xl my-2 overflow-hidden">
          <h2 className="font-jersey text-lg sm:text-xl lg:text-2xl text-amber-800 uppercase text-center leading-tight">
            {pokemon.name}
          </h2>
        </div>
      </div>
    </div>
  );
}

const PokemonCard = memo(PokemonCardComponent);
export default PokemonCard;
