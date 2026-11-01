import { Oval } from "./ui";

export default function SectionTitle({
  kicker,
  title,
  aside,
  id,
}: {
  kicker: string;
  title: React.ReactNode;
  aside?: React.ReactNode;
  id?: string;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-t-[6px] border-ink pt-3">
      <div>
        <div className="flex items-center gap-2 font-narrow text-xs font-bold uppercase tracking-[0.26em] text-ink/70">
          <Oval size={11} filled />
          {kicker}
        </div>
        <h2 id={id} className="mt-1.5 font-head text-[clamp(44px,7vw,88px)] uppercase leading-[0.92]">
          {title}
        </h2>
      </div>
      {aside}
    </div>
  );
}
