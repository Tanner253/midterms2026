import { BallotBar, Wrap } from "./ui";

// The head of the sheet on every page: the black band, then the page's title set big.
export default function PageHero({
  kicker,
  title,
  subtitle,
  children,
  aside,
  titleClass = "text-[clamp(64px,13vw,168px)]",
}: {
  kicker?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
  aside?: React.ReactNode;
  titleClass?: string;
}) {
  return (
    <section className="border-b-[6px] border-ink bg-paper">
      <BallotBar />
      <Wrap className="grid gap-8 py-10 sm:py-14 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="min-w-0">
          {kicker && <div className="font-narrow text-sm font-bold uppercase tracking-[0.26em] text-mark">{kicker}</div>}
          <h1 className={`mt-2 font-head uppercase leading-[0.86] ${titleClass}`}>{title}</h1>
          {subtitle && <p className="mt-5 max-w-xl text-lg text-ink/80">{subtitle}</p>}
          {children}
        </div>
        {aside && <div className="min-w-0">{aside}</div>}
      </Wrap>
    </section>
  );
}
