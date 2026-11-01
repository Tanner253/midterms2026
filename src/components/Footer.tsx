import Link from "next/link";
import { SITE } from "@/config/site";
import { SOCIAL_ICONS } from "./icons";
import { Wrap } from "./ui";

export default function Footer() {
  const socials = SITE.socials.filter((s) => s.href);
  return (
    <footer className="border-t-[6px] border-ink bg-paper">
      <Wrap className="space-y-5 pb-[calc(env(safe-area-inset-bottom)+2rem)] pt-8 text-sm text-ink/60">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="font-head text-3xl text-ink">
            ${SITE.ticker} <span className="text-mark">·</span> {SITE.name.toUpperCase()}
          </div>
          {socials.length > 0 && (
            <div className="flex gap-4 text-2xl text-ink">
              {socials.map((s) => {
                const Icon = SOCIAL_ICONS[s.label];
                return (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="hover:text-mark">
                    {Icon ? <Icon /> : s.label}
                  </a>
                );
              })}
            </div>
          )}
        </div>
        <p className="max-w-4xl">
          {SITE.name} (${SITE.ticker}) is an independent memecoin project. It is not affiliated with, endorsed by, or
          associated with any candidate, campaign, political party, government body, or Polymarket. Names and photos are
          used only to identify the people the coins are about. Buying a coin is not a political contribution.
          Memecoins are highly speculative and can go to zero; nothing here is financial advice. Odds are live prices from{" "}
          <a href={SITE.polymarketEvent} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-mark">
            Polymarket
          </a>
          , not predictions by this site.
        </p>
        <Link href="/credits/" className="inline-block font-narrow font-bold uppercase tracking-[0.16em] text-ink/80 hover:text-mark">
          Photo credits →
        </Link>
      </Wrap>
    </footer>
  );
}
