"use client";

import { SITE } from "@/config/site";
import { fmtCompact, fmtNum, fmtUsd } from "@/lib/format";
import { useMarket } from "@/lib/market-context";
import { splitDuration, useNow } from "@/lib/useNow";
import { BallotBar, StatBlock, Wrap } from "../ui";
import Scoreboard from "./Scoreboard";

export default function Hero() {
  const { markets, stats, mints, loaded, statsFailed, marketsFailed } = useMarket();
  const now = useNow();
  const caps = Object.values(markets).map((m) => m.marketCap);
  const days = now === null ? null : splitDuration(Date.parse(SITE.electionDay) - now).days;

  const burned = !loaded ? null : stats ? (
    <>
      <span className="sm:hidden">{fmtCompact(stats.totalBurned)}</span>
      <span className="hidden sm:inline">{fmtNum(stats.totalBurned)}</span>
    </>
  ) : statsFailed && mints.any ? (
    "—"
  ) : (
    "Starts at launch"
  );
  const ecoCap = !loaded ? null : caps.length ? fmtUsd(caps.reduce((a, b) => a + b, 0)) : marketsFailed ? "—" : "Pre-launch";

  return (
    <section className="border-b-[6px] border-ink bg-paper">
      <BallotBar />
      <Wrap className="py-8 sm:py-12">
        <h1 className="mb-8 font-head text-[clamp(76px,11.5vw,156px)] uppercase leading-[0.86]">
          The midterms, <span className="text-mark">on-chain.</span>
        </h1>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-stretch">
          <div className="min-w-0">
            <Scoreboard />
          </div>
          <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <StatBlock
              tone="red"
              label={`$${SITE.ticker} burned`}
              value={burned ?? <span className="skeleton inline-block h-10 w-48 align-middle">loading</span>}
              valueClass={typeof burned === "string" && burned.length > 3 ? "text-[clamp(32px,4vw,44px)] uppercase" : undefined}
            />
            <StatBlock
              tone="gold"
              label="Total ecosystem marketcap"
              value={ecoCap ?? <span className="skeleton inline-block h-10 w-40 align-middle">loading</span>}
              valueClass={ecoCap === "Pre-launch" ? "text-[clamp(32px,4vw,44px)] uppercase" : undefined}
            />
            <StatBlock
              label="Days to Election Day"
              value={days === null ? "—" : days}
              sub="Tuesday · Nov 3, 2026"
              className="sm:col-span-2 lg:col-span-1"
            />
          </div>
        </div>
      </Wrap>
    </section>
  );
}
