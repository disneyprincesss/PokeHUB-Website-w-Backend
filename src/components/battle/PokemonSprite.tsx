import type { PokemonSpriteProps, PokemonStatsBoxProps } from "../../types/pokemon";
import PokemonStatsBox from "../ui/PokemonStatsBox";

export default function PokemonSprite({
  pokemonSprite,
}: {
  pokemonSprite: PokemonSpriteProps;
}) {
  const pokemonStatus: PokemonStatsBoxProps = {
    pokemon: pokemonSprite.pokemon,
    currentHp: pokemonSprite.currentHp,
    maxHp: pokemonSprite.maxHp,
    currentMana: pokemonSprite.currentMana,
    position: pokemonSprite.position === "player" ? "bottom-left" : "top-right",
  };

  const containerStyles =
    pokemonSprite.position === "player"
      ? "bottom-82 left-1/2 transform -translate-x-1/2 z-4 sm:bottom-40 sm:left-130 md:bottom-44 md:left-[25%] lg:bottom-48 lg:left-[15%] xl:left-[30%]"
      : "top-32 left-1/2 transform -translate-x-1/2 z-3 sm:top-45 sm:right-60 sm:left-auto sm:transform-none md:top-40 md:right-[25%] lg:top-60 lg:right-[15%] xl:right-[30%]";

  const spriteTransform =
    pokemonSprite.position === "player"
      ? "sm:-scale-x-150 sm:scale-150 md:-scale-x-165 md:scale-165 lg:-scale-x-250 lg:scale-250 xl:-scale-x-300 xl:scale-300"
      : "sm:scale-125 md:scale-140 lg:scale-150 xl:scale-150";

  return (
    <div className={`absolute ${containerStyles} text-center`}>
      <img
        src={pokemonSprite.pokemon.sprite}
        alt={pokemonSprite.pokemon.name}
        className={`w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 lg:w-48 lg:h-48 transform ${spriteTransform} filter ${
          pokemonSprite.isFlashing
            ? "brightness-200 drop-shadow-[0_0_20px_#ffff00]"
            : "drop-shadow-[4px_4px_8px_rgba(0,0,0,0.5)]"
        } transition-all duration-200`}
        style={{
          imageRendering: "pixelated",
        }}
      />

      <PokemonStatsBox pokemonStatus={pokemonStatus} />
    </div>
  );
}
