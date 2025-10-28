import BattleUI from "@/components/battle/BattleUI";
import PokemonSprite from "@/components/battle/PokemonSprite";
import Navbar from "@/components/navbar";
import Confetti from "@/components/ui/Confetti";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { usePokemonBattle } from "@/hooks/usePokemonBattle";
import type { BattleUIProps, PokemonSpriteProps} from "@/types/pokemon";

export default function BattlePage() {
  const {
    pokemons,
    currentHp,
    maxHp,
    currentMana,
    battleLog,
    winner,
    loading,
    turn,
    flash,
    showConfetti,
    handleSkillSelect,
    handleSkipTurn,
    handleRestart,
  } = usePokemonBattle(); // Pass selected Pokemon to the hook

  const playerPokemon: PokemonSpriteProps = {
    pokemon: pokemons[0],
    currentHp: currentHp[0],
    maxHp: maxHp[0],
    currentMana: currentMana[0],
    isFlashing: flash[0],
    position: "player",
  };

const opponentPokemon: PokemonSpriteProps = {
    pokemon: pokemons[1],
    currentHp: currentHp[1],
    maxHp: maxHp[1],
    currentMana: currentMana[1],
    isFlashing: flash[1],
    position: "opponent",
  };

  const battle: BattleUIProps = {
    playerPokemon: pokemons[0],
    currentMana: currentMana[0],
    turn,
    winner,
    battleLog,
    onSkillSelect: handleSkillSelect,
    onSkipTurn: handleSkipTurn,
    onRestart: handleRestart,
  };

  if (loading || pokemons.length < 2) {
    return <LoadingScreen />;
  }

  return (
    <main>
      <Navbar />
      <div className="w-screen h-screen bg-[url('/image/background.png')] bg-cover bg-center relative overflow-hidden"
      >
        {showConfetti && <Confetti />}

        <PokemonSprite pokemonSprite={playerPokemon} />

        <PokemonSprite pokemonSprite={opponentPokemon} />

        <BattleUI battle={battle} />
      </div>
    </main>
  );
}
