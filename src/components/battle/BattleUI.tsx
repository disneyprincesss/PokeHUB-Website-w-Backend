import type { BattleUIProps, SkillButtonProps } from "../../types/pokemon";
import BattleLog from "./BattleLog";
import SkillButton from "./SkillButton";

export default function BattleUI({ battle }: { battle: BattleUIProps }) {
  const skillButtons: SkillButtonProps[] = battle.playerPokemon.skills.map(
    (skill, idx) => ({
      skill,
      index: idx,
      canUse: battle.currentMana >= skill.manaCost,
      onClick: () => battle.onSkillSelect(skill),
    })
  );

  return (
    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-3 sm:bottom-10 sm:right-3 sm:left-auto sm:transform-none md:right-5 lg:right-10 bg-[#fff8dcf2] border-3 border-[#8B4513] rounded-lg p-2 sm:p-4 min-w-[200px] max-w-[250px] sm:min-w-[220px] sm:max-w-[275px] md:min-w-[320px] md:max-w-[400px] shadow-lg">
      {/* Turn Status */}
      <div className="mb-2 font-bold text-[#2c5234] text-center text-sm sm:text-lg border-b-2 border-[#8B4513] pb-2 capitalize">
        {battle.winner
          ? `🏆 Winner: ${battle.winner}!`
          : battle.turn === 0
          ? "Your turn"
          : "Opponent's turn"}
      </div>

      {/* Skills Section */}
      {!battle.winner && battle.turn === 0 && (
        <div className="mb-2">
          <div className="mb-2 text-xs sm:text-sm text-[#2c5234] font-bold">
            Choose a skill:
          </div>

          <div className="mb-2 grid grid-cols-2 gap-1 sm:gap-1.5 justify-center">
            {battle.playerPokemon.skills.map((_, idx) => (
              <SkillButton key={idx} skillButton={skillButtons[idx]} />
            ))}
          </div>

          <button
            className="w-full bg-[#deb887] border-2 border-[#8B4513] rounded-lg p-1.5 sm:p-2 text-xs sm:text-sm font-bold text-[#2c5234] cursor-pointer transition-all duration-200 hover:bg-[#d2b48c]"
            onClick={battle.onSkipTurn}
          >
            Skip a turn
          </button>
        </div>
      )}

      <BattleLog battleLog={battle.battleLog} />

      {/* Restart Button */}
      {battle.winner && (
        <button
          className="w-full mt-2 sm:mt-3 bg-[#90EE90] border-2 border-[#8B4513] rounded-lg p-1.5 sm:p-2 text-xs sm:text-sm font-bold text-[#2c5234] cursor-pointer transition-all duration-200 hover:bg-[#77dd77]"
          onClick={battle.onRestart}
        >
          Next Battle
        </button>
      )}
    </div>
  );
}
