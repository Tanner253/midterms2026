"use client";

import { SITE, pumpUrl } from "@/config/site";
import { useMarket } from "@/lib/market-context";

const SIZES = {
  sm: "border-2 px-3 py-2 text-[13px]",
  lg: "border-2 px-6 py-3 text-lg",
  hero: "border-2 px-6 py-4 font-head text-[clamp(30px,4vw,44px)] leading-none sm:px-10",
};

export default function BuyButton({
  mint: mintProp,
  ticker = SITE.ticker,
  size = "lg",
  className = "",
}: {
  mint?: string;
  ticker?: string;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const { mints } = useMarket();
  const mint = mintProp ?? mints.main;
  const base = `inline-flex items-center justify-center gap-2 border-ink text-center uppercase ${
    size === "hero" ? "" : "font-narrow font-bold tracking-[0.12em]"
  } ${SIZES[size]} ${className}`;
  if (!mint) {
    if (size === "sm")
      return <span className={`${base} cursor-default whitespace-nowrap bg-paper-3 text-ink/70 shadow-none`}>${ticker} · Soon</span>;
    return (
      <span className="inline-flex flex-col items-center border-2 border-dashed border-ink/50 bg-paper px-6 py-2.5 text-center">
        <span className="font-narrow text-xs font-bold uppercase tracking-[0.3em] text-mark">Launching soon</span>
        <span className="font-narrow text-lg font-bold uppercase tracking-[0.14em] text-ink sm:text-xl">
          ${ticker} on pump.fun
        </span>
      </span>
    );
  }
  return (
    <a
      href={pumpUrl(mint)}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} bg-ink text-paper transition hover:bg-mark`}
    >
      Buy ${ticker} on pump.fun <span aria-hidden="true">↗</span>
    </a>
  );
}
