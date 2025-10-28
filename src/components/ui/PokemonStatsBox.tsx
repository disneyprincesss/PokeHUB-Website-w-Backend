import type { HealthBarProps, PokemonStatsBoxProps } from "../../types/pokemon";
import { GAME_CONFIG } from "../../constants/gameConstants";
import HealthBar from "./HealthBar";

export default function PokemonStatsBox({
  pokemonStatus,
}: {
  pokemonStatus: PokemonStatsBoxProps;
}) {
  const health: HealthBarProps = {
    current: pokemonStatus.currentHp,
    max: pokemonStatus.maxHp,
    type: "health",
  };

  const mana: HealthBarProps = {
    current: pokemonStatus.currentMana,
    max: GAME_CONFIG.INITIAL_MANA,
    type: "mana",
  };

  const isTopRight = pokemonStatus.position === "top-right";

  const positionStyles = isTopRight 
    ? "-top-16 left-1/2 transform -translate-x-1/2 z-25 sm:-top-25 sm:-right-35 sm:left-auto sm:transform-none" 
    : "-bottom-16 left-1/2 transform -translate-x-1/2 z-35 sm:-bottom-25 sm:left-20";

  return (
    <div
      className={`absolute ${positionStyles} bg-[#fff8dcf2] border-3 border-[#8B4513] rounded-lg p-2 min-w-[200px] shadow-lg`}
    >
      <div className="font-bold font-jersey text-2xl capitalize">
        {pokemonStatus.pokemon.name}
      </div>

      <div className="text-xs text-[#4a5c36] mb-1 capitalize">
        Element Type: {pokemonStatus.pokemon.types.join(", ")}
      </div>

      <div className="mb-1">
        <HealthBar health={health} />
      </div>

      <div>
        <HealthBar health={mana} />
      </div>
    </div>
  );
}
