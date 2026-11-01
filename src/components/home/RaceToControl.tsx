"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Chamber } from "@/config/race";
import { SITE } from "@/config/site";
import { fmtUsdShort } from "@/lib/format";
import { useCandidateRows, usePartyOdds, type CandidateRow } from "@/lib/market-context";
import Avatar from "../Avatar";
import SectionTitle from "../SectionTitle";
import { Wrap } from "../ui";

// One decimal so the two sides never visibly add up to 101%.
const pct1 = (p: number) => `${(p * 100).toFixed(1)}%`;

const CHAMBERS: { key: Chamber; title: string; name: string; magic: string; note?: string }[] = [
  { key: "house", title: "Race to 218", name: "the House", magic: "218" },
  { key: "senate", title: "Race to 51", name: "the Senate", magic: "51", note: "Republicans hold at 50, with the VP breaking ties" },
];

// Tug of war for each chamber: who's winning Congress, by party.
export default function RaceToControl() {
  const party = usePartyOdds();
  const rows = useCandidateRows();
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), 80);
    return () => clearTimeout(t);
  }, []);

  const cap = (p: "R" | "D" | "I") => rows.filter((r) => r.party === p && r.market).reduce((a, r) => a + r.market!.marketCap, 0);
  const caps = { R: cap("R"), D: cap("D"), I: cap("I") };
  const capTotal = caps.R + caps.D + caps.I;
  // Ranked by market cap: a safe seat's 98% isn't "ahead" of a toss-up's 60% in another race.
  const front = (p: "R" | "D") => [...rows].filter((r) => r.party === p).sort((a, b) => (b.market?.marketCap ?? -1) - (a.market?.marketCap ?? -1))[0];

  return (
    <section className="py-14 sm:py-20">
      <Wrap>
        <SectionTitle
          kicker="Who's winning Congress"
          title="Race for Congress"
          aside={
            <a href={SITE.polymarketEvent} target="_blank" rel="noopener noreferrer" className="font-narrow font-bold uppercase tracking-[0.16em] text-gold hover:text-cream">
              Party odds on Polymarket ↗
            </a>
          }
        />

        <div className="border-[3px] border-cream bg-ink-2 p-4 shadow-brutal-gold sm:p-6">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
            {CHAMBERS.map((c) => {
              const odds = party[c.key];
              const known = odds.R !== null && odds.D !== null;
              const lead = !known ? null : odds.R! > odds.D! ? "R" : odds.D! > odds.R! ? "D" : null;
              return (
                <div key={c.key}>
                  <a href={SITE.control[c.key].event} target="_blank" rel="noopener noreferrer" className="mb-3 block font-slab text-xl uppercase hover:text-gold sm:text-2xl">
                    {c.title}
                  </a>
                  <div className="flex items-end justify-between gap-4">
                    <PartyEnd side="R" label="Republicans" value={known ? pct1(odds.R!) : "—"} lead={lead === "R"} called={odds.called === "R"} />
                    <PartyEnd side="D" label="Democrats" value={known ? pct1(odds.D!) : "—"} lead={lead === "D"} called={odds.called === "D"} />
                  </div>
                  <Bar
                    label={`Polymarket · chance to control ${c.name}`}
                    r={drawn && known ? odds.R! : 0}
                    d={drawn && known ? odds.D! : 0}
                    marker={`★ ${c.magic} to win ★`}
                  />
                  {c.note && <p className="-mt-2 font-narrow text-xs font-bold uppercase tracking-[0.16em] text-cream/60">{c.note}</p>}
                </div>
              );
            })}
          </div>

          <Bar
            label="The coin vote · candidate market cap by party"
            r={drawn && capTotal ? caps.R / capTotal : 0}
            d={drawn && capTotal ? caps.D / capTotal : 0}
            empty={capTotal ? undefined : "Polls open when the candidate coins launch"}
            rightNote={capTotal ? `${fmtUsdShort(caps.R)} vs ${fmtUsdShort(caps.D)}` : undefined}
          />

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <TopCoin r={front("R")} side="R" />
            <TopCoin r={front("D")} side="D" />
          </div>
        </div>
      </Wrap>
    </section>
  );
}

function PartyEnd({ side, label, value, lead, called }: { side: "R" | "D"; label: string; value: string; lead: boolean; called: boolean }) {
  const color = side === "R" ? "text-red-hot" : "text-sky";
  return (
    <div className={side === "D" ? "text-right" : ""}>
      <div className={`flex items-center gap-2 font-narrow text-sm font-bold uppercase tracking-[0.2em] ${color} ${side === "D" ? "justify-end" : ""}`}>
        {label}
        {lead && <span className="bg-gold px-1.5 py-0.5 text-[11px] tracking-[0.14em] text-ink">{called ? "Called" : "Leads"}</span>}
      </div>
      <div className={`font-slab text-[clamp(36px,5vw,60px)] leading-none tabular-nums ${color}`}>{value}</div>
    </div>
  );
}

function Bar({
  label,
  r,
  d,
  empty,
  rightNote,
  marker,
}: {
  label: string;
  r: number;
  d: number;
  empty?: string;
  rightNote?: string;
  marker?: string;
}) {
  return (
    <div className={marker ? "mb-8 mt-5" : "mt-5"}>
      <div className="mb-1.5 flex justify-between gap-3 font-narrow text-[11px] font-bold uppercase tracking-[0.2em] text-cream/60">
        <span>{label}</span>
        {rightNote && <span className="tabular-nums">{rightNote}</span>}
      </div>
      <div className="relative h-9 border-[3px] border-ink bg-ink-3">
        {empty ? (
          <div className="flex h-full items-center justify-center border-2 border-dashed border-cream/20 px-2 text-center font-narrow text-xs font-bold uppercase tracking-[0.18em] text-cream/55">
            {empty}
          </div>
        ) : (
          <>
            <div className="absolute inset-y-0 left-0 bg-red transition-[width] duration-1000 ease-out" style={{ width: `${r * 100}%` }} />
            <div className="absolute inset-y-0 right-0 bg-blue transition-[width] duration-1000 ease-out" style={{ width: `${d * 100}%` }} />
          </>
        )}
        <div aria-hidden="true" className="absolute inset-y-[-8px] left-1/2 w-[3px] -translate-x-1/2 bg-gold" />
        {marker && (
          <span className="absolute -bottom-[30px] left-1/2 -translate-x-1/2 whitespace-nowrap bg-gold px-1.5 py-0.5 font-narrow text-[10px] font-bold uppercase tracking-[0.16em] text-ink">
            {marker}
          </span>
        )}
      </div>
    </div>
  );
}

function TopCoin({ r, side }: { r?: CandidateRow; side: "R" | "D" }) {
  if (!r) return null;
  return (
    <Link
      href={`/candidates/#${r.id}`}
      className={`flex items-center gap-3 border-[3px] border-ink bg-ink px-3 py-2 transition hover:-translate-y-0.5 ${side === "D" ? "sm:flex-row-reverse sm:text-right" : ""}`}
    >
      <Avatar c={r} size={44} />
      <span className="min-w-0 flex-1">
        <span className={`block font-narrow text-[11px] font-bold uppercase tracking-[0.2em] ${side === "R" ? "text-red-hot" : "text-sky"}`}>
          {side === "R" ? "Top GOP coin" : "Top DEM coin"}
        </span>
        <span className="block truncate font-bold uppercase">{r.name}</span>
      </span>
      <span className="font-slab text-xl tabular-nums text-gold">{r.market ? fmtUsdShort(r.market.marketCap) : "Soon"}</span>
    </Link>
  );
}
