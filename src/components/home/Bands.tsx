import Link from "next/link";
import { ANNOUNCEMENT, SITE } from "@/config/site";
import BuyButton from "../BuyButton";
import { ContestHead, Oval, Wrap } from "../ui";

// The buy band, set as a contest on the ballot with $MIDTERMS as the write-in.
export function BuyBand() {
  return (
    <section className="bg-stock py-10">
      <Wrap>
        <div className="mx-auto max-w-3xl border-2 border-ink bg-paper">
          <ContestHead title="Control of Congress" note="Vote for one" />
          {["Republicans", "Democrats"].map((name) => (
            <div key={name} className="flex items-center gap-3 border-b-2 border-ink px-4 py-2.5 font-head text-3xl uppercase leading-none">
              <Oval size={20} />
              {name}
            </div>
          ))}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-3 px-4 py-3">
            <Oval size={20} filled />
            <span className="font-narrow text-xs font-bold uppercase tracking-[0.18em]">Write-in</span>
            <span className="-rotate-2 border-b-2 border-ink px-2 font-hand text-[clamp(28px,5vw,40px)] leading-tight">${SITE.ticker}</span>
            <div className="w-full sm:ml-auto sm:w-auto">
              <BuyButton size="lg" className="w-full sm:w-auto" />
            </div>
          </div>
        </div>
      </Wrap>
    </section>
  );
}

// Optional promo band (giveaways, the ballot game). Configured in config/site.ts.
export function Announcement() {
  if (!ANNOUNCEMENT) return null;
  const { tag, title, text, ctas = [] } = ANNOUNCEMENT;
  return (
    <section className="bg-mark py-10 text-paper">
      <Wrap className="flex flex-col items-start gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <span className="inline-block font-narrow text-xs font-bold uppercase tracking-[0.22em] text-paper/80">{tag}</span>
          <h2 className="mt-1 font-head text-[clamp(40px,6vw,68px)] uppercase leading-[0.92]">{title}</h2>
          {text && <p className="mt-2 text-lg text-paper/85">{text}</p>}
        </div>
        <div className="flex flex-wrap gap-3">
          {ctas.map((c) => {
            const cls = "border-2 border-paper bg-paper px-5 py-3 font-narrow text-lg font-bold uppercase tracking-[0.14em] text-ink transition hover:bg-transparent hover:text-paper";
            return c.href.startsWith("/") ? (
              <Link key={c.href} href={c.href} className={cls}>
                {c.label}
              </Link>
            ) : (
              <a key={c.href} href={c.href} target="_blank" rel="noopener noreferrer" className={cls}>
                {c.label} ↗
              </a>
            );
          })}
        </div>
      </Wrap>
    </section>
  );
}
