import { SITE } from "@/config/site";

// Small shared building blocks for the ballot look. Use these instead of one-off styles.

// Page-width container used by every section.
export function Wrap({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 ${className}`}>{children}</div>;
}

// The ballot oval. Filled means marked: the red and blue pens crossing to purple.
export function Oval({ filled = false, size = 18, className = "" }: { filled?: boolean; size?: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 rounded-[50%] border-2 border-ink ${className}`}
      style={{
        width: size * 1.55,
        height: size,
        background: filled ? "linear-gradient(100deg, var(--color-red) 0 40%, var(--color-mark) 40% 60%, var(--color-blue) 60%)" : "var(--color-paper)",
      }}
    />
  );
}

// The black band across the top of the sheet.
export function BallotBar() {
  return (
    <div className="bg-ink text-paper">
      <Wrap className="flex items-center justify-between gap-4 py-1.5 font-narrow text-xs font-bold uppercase tracking-[0.2em]">
        <span className="truncate">Official ballot · {SITE.name}</span>
        <span className="hidden shrink-0 sm:block">General election · Nov 3, 2026</span>
      </Wrap>
    </div>
  );
}

// Black contest header, the way a ballot titles each race. `note` is the "vote for one" line.
export function ContestHead({ title, note, className = "" }: { title: React.ReactNode; note?: React.ReactNode; className?: string }) {
  return (
    <div className={`flex items-baseline justify-between gap-3 bg-ink px-3 py-2 text-paper ${className}`}>
      <span className="min-w-0 truncate font-head text-xl uppercase leading-none">{title}</span>
      {note && <span className="shrink-0 font-narrow text-[11px] font-bold uppercase tracking-[0.16em] text-paper/75">{note}</span>}
    </div>
  );
}

// Pulsing "live" dot.
export function LiveDot({ color = "var(--color-red-hot)" }: { color?: string }) {
  return <span aria-hidden="true" className="inline-block h-2.5 w-2.5 animate-pulse-dot rounded-full" style={{ background: color }} />;
}

// Narrow uppercase label used above numbers.
export function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`font-narrow text-[11px] font-bold uppercase tracking-[0.24em] ${className}`}>{children}</div>;
}

// A contest box holding one number. tone picks the colour of the number.
const TONES = {
  red: "text-red",
  gold: "text-mark",
  cream: "text-ink",
  ink: "text-ink",
} as const;

export function StatBlock({
  label,
  value,
  sub,
  tone = "ink",
  className = "",
  valueClass = "text-[clamp(40px,5.4vw,64px)]",
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  sub?: React.ReactNode;
  tone?: keyof typeof TONES;
  className?: string;
  valueClass?: string;
}) {
  return (
    <div className={`flex flex-col border-2 border-ink bg-paper ${className}`}>
      <div className="bg-ink px-3 py-1.5 text-paper">
        <Label>{label}</Label>
      </div>
      <div className="flex flex-1 flex-col justify-center px-3 py-2.5">
        <div className={`font-head leading-none tabular-nums ${TONES[tone]} ${valueClass}`}>{value}</div>
        {sub && <div className="mt-1.5 font-narrow text-sm font-bold uppercase tracking-[0.12em] text-ink/70">{sub}</div>}
      </div>
    </div>
  );
}

// Square segmented control (Cards | Table, Past | Upcoming, 24H | 7D …).
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { v: T; l: React.ReactNode }[];
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="inline-flex border-2 border-ink">
      {options.map((o) => (
        <button
          key={o.v}
          type="button"
          onClick={() => onChange(o.v)}
          aria-pressed={value === o.v}
          className={`px-4 py-2 font-narrow text-xs font-bold uppercase tracking-[0.2em] transition sm:px-6 ${
            value === o.v ? "bg-ink text-paper" : "text-ink/75 hover:bg-paper-3"
          }`}
        >
          {o.l}
        </button>
      ))}
    </div>
  );
}
