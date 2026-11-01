"use client";

import { PARTIES } from "@/config/candidates";
import { PARTY_COINS, partyKey } from "@/config/parties";
import { pumpUrl } from "@/config/site";
import { changeColor, fmtCompact, fmtDir, fmtUsd, fmtUsdShort } from "@/lib/format";
import { useMarket } from "@/lib/market-context";
import SectionTitle from "./SectionTitle";
import { Label, Wrap } from "./ui";

// The party coins: a card each, in the party's colour, linking to pump.fun.
export default function PartiesSection() {
  const { markets, holders, stats, mints } = useMarket();
  const images = Object.fromEntries((stats?.coins ?? []).map((c) => [c.mint, c.image]));

  return (
    <Wrap className="pt-16">
      <SectionTitle kicker="Pick a side" title="The Parties" />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {PARTY_COINS.map((c) => {
          const p = PARTIES[c.party];
          const m = markets[partyKey(c.id)];
          const h = holders[partyKey(c.id)];
          const mint = mints.byId[partyKey(c.id)] ?? "";
          const img = images[mint];
          const empty = mint ? "—" : "Soon";
          const card = (
            <>
              <div className="flex items-center gap-3 p-4">
                {img && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img} alt="" referrerPolicy="no-referrer" className="h-14 w-14 shrink-0 border-2 border-ink object-cover" />
                )}
                <div className="min-w-0">
                  <div className="font-head text-3xl uppercase leading-[0.92]">{c.name}</div>
                  <span className="mt-2 inline-block border-2 border-ink bg-paper px-1.5 py-0.5 font-narrow text-[11px] font-bold uppercase tracking-[0.14em] text-mark">
                    ${c.ticker}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 border-t-2 border-ink bg-paper text-ink">
                <div className="px-3 py-2">
                  <Label className="text-ink/60">Mkt cap</Label>
                  <div className="font-mono text-sm tabular-nums">{m ? fmtUsdShort(m.marketCap) : empty}</div>
                </div>
                <div className="px-3 py-2">
                  <Label className="text-ink/60">24h</Label>
                  <div className={`font-mono text-sm tabular-nums ${m ? changeColor(m.change24h) : ""}`}>{m ? fmtDir(m.change24h) : empty}</div>
                </div>
                <div className="px-3 py-2">
                  <Label className="text-ink/60">{h ? "Holders" : "Price"}</Label>
                  <div className="font-mono text-sm tabular-nums">{h ? fmtCompact(h.count) : m ? fmtUsd(m.priceUsd) : empty}</div>
                </div>
              </div>
            </>
          );
          const cls = "block border-2 border-ink";
          const style = { background: p.color, color: p.on };
          return mint ? (
            <a
              key={c.id}
              href={pumpUrl(mint)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${c.name}: buy $${c.ticker} on pump.fun`}
              className={`${cls} transition hover:-translate-x-0.5 hover:-translate-y-0.5`}
              style={style}
            >
              {card}
            </a>
          ) : (
            <div key={c.id} className={cls} style={style}>
              {card}
            </div>
          );
        })}
      </div>
    </Wrap>
  );
}
