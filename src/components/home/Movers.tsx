"use client";

import Link from "next/link";
import { raceById } from "@/config/race";
import { useCandidateRows, type CandidateRow } from "@/lib/market-context";
import SectionTitle from "../SectionTitle";
import TokenCard from "../TokenCard";
import { Wrap } from "../ui";

type Pick = { r: CandidateRow; label: string; tone: string };

// Top gainer & top loser over 24h. Before any coin is live, the biggest Polymarket odds
// movers over 7 days stand in, and failing that the biggest race.
function pickMovers(rows: CandidateRow[]): { kicker: string; title: string; picks: Pick[] } {
  const live = rows.filter((r) => r.market);
  if (live.length >= 2) {
    const s = [...live].sort((a, b) => b.market!.change24h - a.market!.change24h);
    return {
      kicker: "Last 24 hours",
      title: "Top gainer & top loser",
      picks: [
        { r: s[0], label: "▲ Top gainer", tone: "bg-lime text-paper" },
        { r: s.at(-1)!, label: "▼ Top loser", tone: "bg-red-hot text-paper" },
      ],
    };
  }
  const moved = rows.filter((r) => r.oddsWeek !== null && r.oddsWeek !== 0);
  if (moved.length >= 2) {
    const s = [...moved].sort((a, b) => b.oddsWeek! - a.oddsWeek!);
    if (s[0].oddsWeek! > 0 && s.at(-1)!.oddsWeek! < 0)
      return {
        kicker: "Polymarket · last 7 days",
        title: "Biggest odds movers",
        picks: [
          { r: s[0], label: "▲ Odds riser", tone: "bg-lime text-paper" },
          { r: s.at(-1)!, label: "▼ Odds faller", tone: "bg-red-hot text-paper" },
        ],
      };
  }
  // Roster order: the two candidates in the biggest race.
  return {
    kicker: "Polymarket",
    title: "The biggest race",
    picks: [
      { r: rows[0], label: `★ ${raceById(rows[0].race).short}`, tone: "bg-ink text-paper" },
      { r: rows[1], label: `★ ${raceById(rows[1].race).short} rival`, tone: "bg-ink text-paper" },
    ],
  };
}

export default function Movers() {
  const { kicker, title, picks } = pickMovers(useCandidateRows());
  return (
    <section className="py-14 sm:py-20">
      <Wrap>
        <SectionTitle
          kicker={kicker}
          title={title}
          aside={
            <Link href="/candidates/" className="font-narrow font-bold uppercase tracking-[0.16em] text-mark hover:text-ink">
              See all →
            </Link>
          }
        />
        <div className="grid gap-6 md:grid-cols-2">
          {picks.map(({ r, label, tone }) => (
            <TokenCard
              key={label}
              r={r}
              fallback="board"
              banner={<div className={`border-b-2 border-ink px-4 py-2 font-narrow text-sm font-bold uppercase tracking-[0.24em] ${tone}`}>{label}</div>}
            />
          ))}
        </div>
      </Wrap>
    </section>
  );
}
