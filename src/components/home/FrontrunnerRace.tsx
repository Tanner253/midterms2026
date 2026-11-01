"use client";

import Link from "next/link";
import { useState } from "react";
import { PARTIES } from "@/config/candidates";
import { raceById } from "@/config/race";
import { SITE } from "@/config/site";
import { changeColor, fmtDir, fmtOdds, fmtUsdShort } from "@/lib/format";
import { useCandidateRows, useMarket, type CandidateRow } from "@/lib/market-context";
import Avatar from "../Avatar";
import SectionTitle from "../SectionTitle";
import { Wrap } from "../ui";

const COLS = {
  name: { label: "Candidate", key: (r: CandidateRow) => r.name, text: true },
  odds: { label: "Odds", key: (r: CandidateRow) => r.odds ?? -1, text: false },
  mcap: { label: "Mkt cap", key: (r: CandidateRow) => r.market?.marketCap ?? -1, text: false },
  change: { label: "24h", key: (r: CandidateRow) => r.market?.change24h ?? -Infinity, text: false },
} as const;
type Col = keyof typeof COLS;

// WC's Golden Boot table, election-style: the top 8 coins by market cap, sortable.
export default function FrontrunnerRace() {
  const rows = useCandidateRows();
  const { oddsLoaded } = useMarket();
  const [sort, setSort] = useState<{ col: Col; desc: boolean }>({ col: "mcap", desc: true });

  // Market cap, not odds: a safe seat's 98% isn't ahead of a toss-up's 60% in another race.
  const top8 = [...rows].sort((a, b) => (b.market?.marketCap ?? -1) - (a.market?.marketCap ?? -1)).slice(0, 8);
  const sorted = [...top8].sort((a, b) => {
    const c = COLS[sort.col];
    const x = c.key(a);
    const y = c.key(b);
    const d = typeof x === "string" ? x.localeCompare(y as string) : (x as number) - (y as number);
    return (sort.desc ? -d : d) || 0;
  });

  const head = (col: Col, cls = "") => {
    const active = sort.col === col;
    return (
      <button
        type="button"
        onClick={() => setSort((s) => ({ col, desc: s.col === col ? !s.desc : !COLS[col].text }))}
        className={`flex items-center gap-1 font-narrow text-[11px] font-bold uppercase tracking-[0.22em] ${active ? "text-paper" : "text-paper/70 hover:text-paper"} ${cls}`}
        aria-label={`Sort by ${COLS[col].label}`}
      >
        {COLS[col].label}
        {active && <span aria-hidden="true">{sort.desc ? "▼" : "▲"}</span>}
      </button>
    );
  };

  const grid = "grid grid-cols-[28px_minmax(0,1fr)_64px] items-center gap-3 md:grid-cols-[36px_minmax(0,1fr)_80px_100px_90px]";

  return (
    <section className="py-14 sm:py-20">
      <Wrap>
        <SectionTitle
          kicker="Ranked by market cap"
          title="Frontrunner race"
          aside={
            <a href={SITE.polymarketEvent} target="_blank" rel="noopener noreferrer" className="font-narrow font-bold uppercase tracking-[0.16em] text-mark hover:text-ink">
              Polymarket ↗
            </a>
          }
        />
        <div className="border-2 border-ink bg-paper">
          <div className={`${grid} bg-ink px-4 py-2.5`}>
            <span className="font-narrow text-[11px] font-bold uppercase tracking-[0.22em] text-paper/70">#</span>
            {head("name")}
            {head("odds", "justify-end")}
            {head("mcap", "hidden justify-end md:flex")}
            {head("change", "hidden justify-end md:flex")}
          </div>
          {!oddsLoaded
            ? Array.from({ length: 8 }, (_, i) => (
                <div key={i} className={`${grid} border-b border-ink/10 px-4 py-3 last:border-0`}>
                  <span className="skeleton h-5 w-5" />
                  <span className="skeleton h-5 w-40" />
                  <span className="skeleton h-5 w-12 justify-self-end" />
                </div>
              ))
            : sorted.map((r, i) => (
                <Link
                  key={r.id}
                  href={`/candidates/#${r.id}`}
                  className={`${grid} border-b border-ink/10 px-4 py-2.5 transition last:border-0 odd:bg-lime/[0.07] hover:bg-mark/10`}
                >
                  <span className={`font-head text-2xl ${i < 3 ? "text-mark" : "text-ink/60"}`}>{i + 1}</span>
                  <span className="flex min-w-0 items-center gap-3">
                    <Avatar c={r} size={36} />
                    <span className="min-w-0">
                      <span className="block truncate font-bold uppercase">{r.name}</span>
                      <span className="block font-narrow text-xs font-bold uppercase tracking-[0.14em]" style={{ color: r.party === "I" ? "var(--color-mark)" : r.party === "R" ? "var(--color-red-hot)" : "var(--color-sky)" }}>
                        {PARTIES[r.party].short} · ${r.ticker} · {raceById(r.race).short}
                      </span>
                    </span>
                  </span>
                  <span className="text-right font-head text-2xl tabular-nums text-mark">{fmtOdds(r.odds)}</span>
                  <span className="hidden text-right font-mono text-sm tabular-nums md:block">{r.market ? fmtUsdShort(r.market.marketCap) : "Soon"}</span>
                  <span className={`hidden text-right font-mono text-sm tabular-nums md:block ${changeColor(r.market?.change24h)}`}>
                    {r.market ? fmtDir(r.market.change24h) : "—"}
                  </span>
                </Link>
              ))}
        </div>
        <p className="mt-4 text-center font-narrow text-sm font-bold uppercase tracking-[0.16em] text-ink/55">Odds are for that candidate&apos;s own race</p>
        <div className="mt-3 text-center">
          <Link href="/candidates/" className="font-narrow font-bold uppercase tracking-[0.16em] text-mark hover:text-ink">
            All {rows.length} candidates →
          </Link>
        </div>
      </Wrap>
    </section>
  );
}
