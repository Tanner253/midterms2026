// Scoreboard digit tile. Keyed by value so each change replays the flip animation.
export default function FlipTile({ value, unit, size = "md" }: { value: string; unit: string; size?: "md" | "lg" }) {
  return (
    <div className="relative min-w-0 flex-1 bg-ink text-paper ">
      <div
        key={value}
        className={`animate-flip-in px-1 pt-1 text-center font-head leading-none tabular-nums ${
          size === "lg" ? "text-[clamp(48px,8vw,88px)]" : "text-[clamp(32px,5vw,56px)]"
        }`}
      >
        {value}
      </div>
      <div className="pb-1 text-center font-narrow text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">{unit}</div>
      <span aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px bg-paper/15" />
    </div>
  );
}
