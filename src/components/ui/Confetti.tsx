export default function Confetti() {
  return (
    <div className="pointer-events-none fixed top-0 left-0 w-full h-full z-50 text-4xl text-center">
      {Array.from({ length: 30 }).map((_, i) => (
        <span
          key={i}
          className={`
            absolute
            text-4xl
            select-none
            pointer-events-none
            transition-transform
          `}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            color: [
              "#f44336",
              "#ffeb3b",
              "#4caf50",
              "#2196f3",
              "#ff9800",
              "#e91e63",
            ][i % 6],
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        >
          🎉
        </span>
      ))}
    </div>
  );
}
