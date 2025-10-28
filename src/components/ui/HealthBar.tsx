import type { HealthBarProps } from "@/types/pokemon";

export default function HealthBar({health}: {health: HealthBarProps}) {
  const { current, max, type, width = '160px' } = health;

  const getBarColor = () => {
    if (type === 'mana') return '#2196F3';
    
    const percentage = current / max;
    if (percentage > 0.5) return '#4CAF50';
    if (percentage > 0.2) return '#FF9800';
    return '#F44336';
  };

  return (
    <div className={`w-${width} h-2 rounded overflow-hidden border border-black bg-gray-800`}
    >
      <div className={` h-full transition-all duration-500`}
        style={{
        width: `${Math.max(0, (current / max) * 100)}%`,
        background: getBarColor(),
      }}
      />
    </div>
  );
};
