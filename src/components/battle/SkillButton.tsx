import type { SkillButtonProps } from "../../types/pokemon";

export default function SkillButton({
  skillButton,
}: {
  skillButton: SkillButtonProps;
}) {
  return (
    <button
      onClick={skillButton.onClick}
      disabled={!skillButton.canUse}
      className="bg-[#f0e68c] border-2 border-[#8B4513] rounded-lg p-0.5 sm:p-1 md:p-1.5 m-0.5 text-xs font-bold text-[#2c5234] cursor-pointer transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[#e6d870]"
    >
      <div className="text-xs">
        Skill {skillButton.index + 1}
      </div>
      <div className="text-xs font-normal capitalize leading-tight">
        {skillButton.skill.name.replace(/-/g, " ")}
      </div>
    </button>
  );
}
