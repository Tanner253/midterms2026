"use client";

import { useEffect, useState } from "react";
import { CANDIDATES, isAlive, statusLabel, statusTone } from "@/config/candidates";
import { RACES, raceById } from "@/config/race";
import { SITE, pumpUrl } from "@/config/site";
import { changeColor, fmtDir, fmtOdds, fmtOddsDelta, fmtPct, fmtUsdShort, fmtCompact } from "@/lib/format";
import { useCandidateRows, useMarket, type CandidateRow } from "@/lib/market-context";
import Avatar from "./Avatar";
import PageHero from "./PageHero";
import PartiesSection from "./PartiesSection";
import TokenCard from "./TokenCard";
import { Segmented, StatBlock, Wrap } from "./ui";

const VIEW_KEY = "mt26_candidates_view";
const ROW_H = 60;

type Ranked = CandidateRow & { rank: number; move: number };

// WC's board ranks by market cap. Odds can't rank here: each is for a different race, so a safe
// seat's 98% isn't ahead of a toss-up's 60%. Before launch the board stays in roster order.
// Movement compares against the 24h-ago ranking (mcap / (1 + change)).
function rank(rows: CandidateRow[], byMcap: boolean): Ranked[] {
  const roster = (r: CandidateRow) => -rows.indexOf(r);
  const now = (r: CandidateRow) => (byMcap ? (r.market?.marketCap ?? -1) : roster(r));
  const then = (r: CandidateRow) => (byMcap ? (r.market ? r.market.marketCap / (1 + r.market.change24h / 100) : -1) : roster(r));
  const order = (key: (r: CandidateRow) => number) =>
    [...rows].sort((a, b) => Number(isAlive(b)) - Number(isAlive(a)) || key(b) - key(a)).map((r) => r.id);
  const cur = order(now);
  const prev = order(then);
  return rows.map((r) => ({ ...r, rank: cur.indexOf(r.id), move: prev.indexOf(r.id) - cur.indexOf(r.id) }));
}

export default function CandidatesView() {
  const rows = useCandidateRows();
  const { loaded, oddsLoaded } = useMarket();
  const [view, setView] = useState<"table" | "cards">("table");

  useEffect(() => {
    try {
      const v = localStorage.getItem(VIEW_KEY);
      if (v === "table" || v === "cards") setView(v);
    } catch {}
  }, []);
  const pickView = (v: "table" | "cards") => {
    setView(v);
    try {
      localStorage.setItem(VIEW_KEY, v);
    } catch {}
  };

  const live = rows.filter((r) => r.market);
  const byMcap = live.length > 0;
  const ranked = rank(rows, byMcap);
  const ordered = [...ranked].sort((a, b) => a.rank - b.rank);
  const alive = CANDIDATES.filter(isAlive).length;
  const totalCap = live.reduce((a, r) => a + r.market!.marketCap, 0);
  const totalVol = live.reduce((a, r) => a + r.market!.volume24h, 0);
  const avgChange = live.length ? live.reduce((a, r) => a + r.market!.change24h, 0) / live.length : null;
  const pre = !live.length;

  return (
    <>
      <PageHero
       
        kicker={`${CANDIDATES.length} coins · ${RACES.length} races`}
        title="The Candidates"
        titleClass="text-[clamp(64px,8.4vw,120px)]"
                subtitle={`${CANDIDATES.length} names on the board, ${alive} still in the running. Every coin feeds $${SITE.ticker}.`}
        aside={
          <div className="grid auto-rows-fr grid-cols-2 gap-3 md:w-[440px]">
            <StatBlock tone="gold" label="Still in" value={`${alive}/${CANDIDATES.length}`} valueClass="text-[clamp(36px,4.4vw,52px)]" />
            <StatBlock label="Total market cap" value={pre ? (loaded ? "Pre-launch" : "—") : fmtUsdShort(totalCap)} valueClass="text-[clamp(28px,2.9vw,38px)]" />
            <StatBlock tone="cream" label="Avg 24h change" value={fmtPct(avgChange)} valueClass="text-[clamp(28px,2.9vw,38px)]" />
            <StatBlock tone="red" label="24h volume" value={pre ? "—" : fmtUsdShort(totalVol)} valueClass="text-[clamp(28px,2.9vw,38px)]" />
          </div>
        }
      />

      <Wrap className="pt-10">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Segmented
            label="Candidates view"
            value={view}
            onChange={pickView}
            options={[
              { v: "table", l: "Table" },
              { v: "cards", l: "Cards" },
            ]}
          />
          <span className="font-narrow text-xs font-bold uppercase tracking-[0.2em] text-ink/60">
            {byMcap ? "Ranked by market cap" : "Ranked by market cap once coins launch"}
          </span>
        </div>

        {view === "table" ? (
          <Board rows={ordered} byMcap={byMcap} ready={byMcap ? loaded : oddsLoaded} />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {ordered.map((r) => (
              <TokenCard key={r.id} id={r.id} r={r} />
            ))}
          </div>
        )}

        <p className="mt-5 font-narrow text-sm font-bold uppercase tracking-[0.16em] text-ink/55">
          Odds are for that candidate&apos;s own race, live from{" "}
          <a href={SITE.polymarketEvent} target="_blank" rel="noopener noreferrer" className="text-mark underline-offset-2 hover:underline">
            Polymarket ↗
          </a>
        </p>
      </Wrap>

      <PartiesSection />
    </>
  );
}

function Board({ rows, byMcap, ready }: { rows: Ranked[]; byMcap: boolean; ready: boolean }) {
  // Only animate reorders after the first data has settled, so the board doesn't shuffle on load.
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => setAnimate(true), 1200);
    return () => clearTimeout(t);
  }, [ready]);
  const anyHolders = rows.some((r) => r.holders);
  const cols = anyHolders
    ? "md:grid-cols-[44px_46px_minmax(0,1fr)_76px_96px_92px_96px_84px]"
    : "md:grid-cols-[44px_46px_minmax(0,1fr)_76px_96px_92px_96px]";
  const grid = `grid grid-cols-[22px_minmax(0,1fr)_58px_58px] items-center gap-2 px-2.5 md:gap-3 md:px-4 ${cols}`;
  const th = "font-narrow text-[10px] font-bold uppercase tracking-[0.22em]";

  return (
    <div className="border-2 border-ink bg-paper">
      <div className={`${grid} sticky top-[124px] z-20 bg-ink py-2.5 text-paper/75 lg:top-[68px]`}>
        <span className={th}>
          <span className="md:hidden">#</span>
          <span className="hidden md:inline">Pos</span>
        </span>
        <span className={`${th} hidden md:block`}>Mv</span>
        <span className={th}>Candidate</span>
        <span className={`${th} text-right ${byMcap ? "hidden md:block" : "text-paper"}`}>Odds</span>
        <span className={`${th} text-right ${byMcap ? "text-paper" : "hidden md:block"}`}>Mkt cap</span>
        <span className={`${th} text-right`}>
          <span className="md:hidden">{byMcap ? "24H" : "7D"}</span>
          <span className="hidden md:inline">24H</span>
        </span>
        <span className={`${th} hidden text-right md:block`}>Volume</span>
        {anyHolders && <span className={`${th} hidden text-right md:block`}>Holders</span>}
      </div>

      <div className="relative" style={{ height: rows.length * ROW_H }}>
        {rows.map((r) => {
          const tone = statusTone(r);
          const sub = r.status === "running" ? raceById(r.race).short : statusLabel(r);
          const cells = (
            <>
              <span className={`font-head text-2xl md:text-3xl ${r.rank < 3 ? "text-mark" : "text-ink"}`}>{r.rank + 1}</span>
              <span className="hidden font-mono text-xs font-bold md:block">
                {!ready ? "" : r.move > 0 ? <span className="text-lime">▲{r.move}</span> : r.move < 0 ? <span className="text-red-hot">▼{-r.move}</span> : <span className="text-ink/40">–</span>}
              </span>
              <span className="flex min-w-0 items-center gap-2.5">
                <Avatar c={r} size={34} square dim={false} />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold uppercase leading-tight md:text-base" title={r.name}>
                    {r.name}
                  </span>
                  <span className="block truncate font-narrow text-[11px] font-bold uppercase tracking-[0.12em]">
                    <span className="text-mark">${r.ticker}</span>
                    <span className={tone === "out" ? "text-red-hot/80" : tone === "gold" ? "text-mark" : "text-ink/60"}> · {sub}</span>
                  </span>
                </span>
              </span>
              <span className={`text-right font-mono text-xs font-bold md:text-sm tabular-nums ${byMcap ? "hidden md:block" : "text-mark"}`}>
                {ready || byMcap ? fmtOdds(r.odds) : <span className="skeleton ml-auto block h-4 w-10" />}
              </span>
              <span className={`text-right font-mono text-xs tabular-nums md:text-sm ${byMcap ? "" : "hidden text-ink/50 md:block"}`}>
                {r.market ? fmtUsdShort(r.market.marketCap) : "Soon"}
              </span>
              <span className={`text-right font-mono text-xs tabular-nums md:text-sm ${changeColor(byMcap ? r.market?.change24h : r.oddsWeek)}`}>
                <span className="md:hidden">{byMcap ? (r.market ? fmtPct(r.market.change24h) : "—") : r.oddsWeek !== null ? fmtOddsDelta(r.oddsWeek).replace(" pts", "") : "—"}</span>
                <span className="hidden md:inline">{r.market ? fmtDir(r.market.change24h) : "—"}</span>
              </span>
              <span className="hidden text-right font-mono text-sm tabular-nums md:block">{r.market ? fmtUsdShort(r.market.volume24h) : "—"}</span>
              {anyHolders && <span className="hidden text-right font-mono text-sm tabular-nums md:block">{r.holders ? fmtCompact(r.holders.count) : "—"}</span>}
            </>
          );
          const cls = `${grid} absolute inset-x-0 border-b border-ink/10 hover:bg-mark/10 target:bg-mark/15 scroll-mt-48 ${
            animate ? "transition-[transform,background-color] duration-700 ease-[cubic-bezier(.34,.9,.3,1)]" : ""
          } ${
            tone === "out" ? "opacity-55" : ""
          } ${r.rank % 2 ? "bg-lime/[0.07]" : ""}`;
          const style = { height: ROW_H, transform: `translateY(${r.rank * ROW_H}px)` };
          return r.mint ? (
            <a key={r.id} id={r.id} href={pumpUrl(r.mint)} target="_blank" rel="noopener noreferrer" aria-label={`${r.name}: buy $${r.ticker} on pump.fun`} className={cls} style={style}>
              {cells}
            </a>
          ) : (
            <a key={r.id} id={r.id} href={r.pmUrl} target="_blank" rel="noopener noreferrer" aria-label={`${r.name}: race odds on Polymarket`} className={cls} style={style}>
              {cells}
            </a>
          );
        })}
      </div>
    </div>
  );
}
