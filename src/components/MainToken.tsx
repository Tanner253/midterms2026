"use client";

import { SITE } from "@/config/site";
import { changeColor, fmtCompact, fmtDir, fmtNum, fmtSol, fmtUsd, timeAgo } from "@/lib/format";
import { DEMO, MAIN_KEY } from "@/lib/market";
import { useMarket } from "@/lib/market-context";
import { useNow } from "@/lib/useNow";
import BurnCam from "./BurnCam";
import BuyButton from "./BuyButton";
import CopyAddress from "./CopyAddress";
import { CycleTimer } from "./Countdown";
import PageHero from "./PageHero";
import SectionTitle from "./SectionTitle";
import { Label, StatBlock, Wrap } from "./ui";

export default function MainToken() {
  const { markets, holders, stats, mints, loaded } = useMarket();
  const now = useNow();
  const m = markets[MAIN_KEY];
  const h = holders[MAIN_KEY];
  const mint = mints.main;
  const pre = !mint;
  const burnedPct = stats ? (stats.totalBurned / SITE.totalSupply) * 100 : null;
  const routed = stats?.totalSolRouted ?? 0;
  const empty = pre ? "Soon" : loaded ? "—" : "";

  return (
    <>
      <PageHero
       
        kicker="The main coin"
        title={`$${SITE.ticker}`}
        titleClass="text-[clamp(64px,9vw,128px)]"
                subtitle="Every candidate coin's fees buy it and burn it. Watch the burn live."
        aside={
          <div className="w-full lg:w-[420px] xl:w-[520px]">
            <BurnCam />
          </div>
        }
      >
        <div className="mt-8 flex flex-col items-start gap-4">
          <BuyButton size="hero" />
          <CopyAddress address={mint} />
        </div>
      </PageHero>

      <Wrap className="pt-14">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4 border-b-[3px] border-ink/15 pb-6">
          <div>
            <Label className="text-mark">Market cap</Label>
            <div className="font-head text-[clamp(60px,10vw,108px)] leading-none tabular-nums">{m ? fmtUsd(m.marketCap) : empty || "—"}</div>
            {m && (
              <div className={`mt-1 font-narrow text-lg font-bold tabular-nums ${changeColor(m.change24h)}`}>
                {fmtDir(m.change24h)} <span className="text-ink/60">(24H)</span>
              </div>
            )}
          </div>
          <div className="text-right">
            <Label className="text-ink/70">24H volume</Label>
            <div className="font-head text-[clamp(48px,7vw,80px)] leading-none tabular-nums">{m ? fmtUsd(m.volume24h) : empty || "—"}</div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatBlock label="Price" value={m ? fmtUsd(m.priceUsd) : empty || "—"} valueClass="text-[clamp(30px,4vw,44px)] break-all" />
          <StatBlock label="Liquidity" value={m ? fmtUsd(m.liquidityUsd) : empty || "—"} valueClass="text-[clamp(30px,4vw,44px)]" />
          <StatBlock
            label="Holders"
            value={h ? fmtNum(h.count) : empty || "—"}
            valueClass="text-[clamp(30px,4vw,44px)]"
            sub={h?.change24h != null ? <span className={changeColor(h.change24h)}>{h.change24h > 0 ? "▲" : h.change24h < 0 ? "▼" : "•"} {fmtNum(Math.abs(h.change24h))} 24h</span> : undefined}
          />
          <StatBlock
            tone="red"
            label="Supply burnt"
            value={burnedPct !== null && (stats!.cycles > 0 || stats!.totalBurned > 0) ? `${burnedPct.toFixed(2)}%` : pre ? "Soon" : "—"}
            valueClass="text-[clamp(30px,4vw,44px)]"
            sub={stats && stats.totalBurned > 0 ? `${fmtCompact(stats.totalBurned)} $${SITE.ticker}` : undefined}
          />
        </div>

        <div className="mt-8 border-2 border-ink bg-paper ">
          <div className="flex items-center justify-between bg-ink px-4 py-2.5 text-paper">
            <Label>Live chart</Label>
            <Label className="text-paper/70">via DexScreener</Label>
          </div>
          {mint && !DEMO ? (
            <iframe
              title={`$${SITE.ticker} price chart`}
              src={`https://dexscreener.com/solana/${mint}?embed=1&theme=light&trades=0&info=0`}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="h-[360px] w-full bg-paper sm:h-[480px]"
            />
          ) : (
            <div className="relative h-[300px] overflow-hidden sm:h-[380px]">
              <svg aria-hidden="true" className="absolute inset-0 h-full w-full text-ink/10" preserveAspectRatio="none" viewBox="0 0 400 200">
                {[40, 80, 120, 160].map((y) => (
                  <line key={y} x1="0" x2="400" y1={y} y2={y} stroke="currentColor" strokeDasharray="4 6" />
                ))}
                <polyline points="0,170 50,160 90,165 140,130 190,138 240,96 290,104 340,62 400,40" fill="none" stroke="rgb(107 47 191 / 0.3)" strokeWidth="3" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                <div className="font-head text-[clamp(36px,5vw,56px)] uppercase leading-none">Chart goes live at launch</div>
                <p className="mt-3 font-narrow font-bold uppercase tracking-[0.18em] text-ink/60">
                  {DEMO ? "Hidden in preview mode" : `When $${SITE.ticker} trades on pump.fun`}
                </p>
              </div>
            </div>
          )}
        </div>
      </Wrap>

      <Wrap className="pt-16">
        <SectionTitle
          kicker="On-chain, every cycle"
          title="Fee engine"
          aside={
            stats?.nextCycleAt ? (
              <div className="font-narrow font-bold uppercase tracking-[0.16em] text-ink/70">
                Next cycle in{" "}
                <span className="text-ink">
                  <CycleTimer next={stats.nextCycleAt} intervalMs={stats.cycleIntervalMs} />
                </span>
              </div>
            ) : null
          }
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatBlock tone="gold" label="SOL claimed" value={stats && routed > 0 ? fmtSol(routed) : mints.any ? "—" : "Soon"} valueClass="text-[clamp(30px,4vw,44px)]" />
          <StatBlock tone="red" label="To buy & burn" value={stats && routed > 0 ? fmtSol(stats.solToBurn) : "—"} valueClass="text-[clamp(30px,4vw,44px)]" />
          <StatBlock label="Dev cut (10%)" value={stats && routed > 0 ? fmtSol(stats.solToDev) : "—"} valueClass="text-[clamp(30px,4vw,44px)]" />
          <StatBlock label="Cycles run" value={stats?.cycles ? fmtNum(stats.cycles) : "—"} valueClass="text-[clamp(30px,4vw,44px)]" />
        </div>
        {stats && routed > 0 && (
          <div className="mt-5 flex h-4 border-2 border-ink" role="img" aria-label="Where claimed SOL went">
            <span className="bg-red-hot" style={{ width: `${(stats.solToBurn / routed) * 100}%` }} />
            <span className="bg-mark" style={{ width: `${(stats.solToDev / routed) * 100}%` }} />
          </div>
        )}
        <p className="mt-4 font-narrow text-sm font-bold uppercase tracking-[0.16em] text-ink/55">
          {stats?.cycles ? `${fmtNum(stats.cycles)} cycles run` : "No cycles run yet"}
          {stats?.lastCycleAt && now !== null ? ` · last ${timeAgo(stats.lastCycleAt, now)}` : ""}
        </p>
      </Wrap>

      <section className="mt-16 bg-stock py-10">
        <Wrap className="flex justify-center">
          <BuyButton size="hero" />
        </Wrap>
      </section>
    </>
  );
}
