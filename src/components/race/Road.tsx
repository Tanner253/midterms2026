"use client";

import Link from "next/link";
import { PARTIES } from "@/config/candidates";
import { raceUrl, type Office, type Race } from "@/config/race";
import { fmtOdds } from "@/lib/format";
import { useCandidateRows, type CandidateRow } from "@/lib/market-context";
import { racesFor } from "@/lib/race";
import Avatar from "../Avatar";

const OFFICES: { office: Office; title: string }[] = [
  { office: "Senate", title: "Senate" },
  { office: "Governor", title: "Governor" },
];

const partyColor = (r: CandidateRow) => (r.party === "I" ? "var(--color-gold)" : r.party === "R" ? "var(--color-red-hot)" : "var(--color-sky)");

// One side of a race: the candidate's button, name, coin and that race's odds.
function Side({ r, right = false }: { r: CandidateRow; right?: boolean }) {
  const won = r.status === "won";
  const lost = r.status === "lost";
  return (
    <Link
      href={`/candidates/#${r.id}`}
      className={`flex min-w-0 flex-1 flex-col gap-2 p-3 transition hover:bg-cream/[0.06] ${right ? "items-end text-right" : "items-start"} ${won ? "bg-gold text-ink hover:bg-gold" : ""} ${lost ? "opacity-45" : ""}`}
    >
      <Avatar c={r} size={56} dim={false} />
      <span className={`block w-full font-bold uppercase leading-tight ${lost ? "line-through" : ""}`}>{r.name}</span>
      <span className="block w-full font-narrow text-xs font-bold uppercase tracking-[0.14em]" style={won ? undefined : { color: partyColor(r) }}>
        {PARTIES[r.party].short} · ${r.ticker}
      </span>
      <span className="font-slab text-2xl tabular-nums leading-none">{won ? "★ Won" : fmtOdds(r.odds)}</span>
    </Link>
  );
}

// Head-to-head card for one race. Republicans sit on the left, like the bars on the home page.
function RaceCard({ race, rows }: { race: Race; rows: CandidateRow[] }) {
  const left = rows.find((r) => r.party === "R") ?? rows[0];
  const right = rows.find((r) => r.id !== left.id)!;
  const winner = rows.find((r) => r.status === "won");
  const known = left.odds !== null && right.odds !== null;
  const total = known ? left.odds! + right.odds! : 0;
  const share = total > 0 ? (left.odds! / total) * 100 : 0;
  return (
    <li className={`flex flex-col border-[3px] bg-ink-2 ${winner ? "border-gold shadow-brutal-gold" : "border-cream shadow-brutal-md"}`}>
      <div className="flex items-center justify-between gap-3 border-b-[3px] border-cream/20 px-3 py-2">
        <h4 className="truncate font-slab text-base uppercase">{race.label}</h4>
        {winner ? (
          <span className="shrink-0 bg-gold px-1.5 py-0.5 font-narrow text-[11px] font-bold uppercase tracking-[0.14em] text-ink">Called</span>
        ) : (
          <a href={raceUrl(race.id)} target="_blank" rel="noopener noreferrer" className="shrink-0 font-narrow text-xs font-bold uppercase tracking-[0.14em] text-gold hover:text-cream">
            Odds ↗
          </a>
        )}
      </div>
      <div className="relative flex flex-1">
        <Side r={left} />
        <span aria-hidden="true" className="absolute left-1/2 top-7 -translate-x-1/2 font-slab text-lg text-gold">
          VS
        </span>
        <Side r={right} right />
      </div>
      <div className="relative h-3 border-t-[3px] border-ink" style={{ background: PARTIES[right.party].color }} role="img" aria-label={known ? `${left.name} ${fmtOdds(left.odds)}, ${right.name} ${fmtOdds(right.odds)}` : "Odds loading"}>
        <div className="absolute inset-y-0 left-0 transition-[width] duration-700" style={{ width: `${share}%`, background: PARTIES[left.party].color }} />
      </div>
    </li>
  );
}

// The map of the midterms: every race on the board, head to head. Called races show the winner.
export default function Road() {
  const rows = useCandidateRows();
  return (
    <div className="space-y-10">
      {OFFICES.map(({ office, title }) => {
        const races = racesFor(office);
        return (
          <section key={office}>
            <h3 className="mb-4 flex items-center gap-2 font-narrow text-sm font-bold uppercase tracking-[0.28em] text-gold">
              <span aria-hidden="true" className="h-1 w-3 bg-gold" />
              {title} · {races.length} {races.length === 1 ? "race" : "races"}
            </h3>
            <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {races.map((race) => (
                <RaceCard key={race.id} race={race} rows={rows.filter((r) => r.race === race.id)} />
              ))}
            </ul>
          </section>
        );
      })}
      <p className="font-narrow text-sm font-bold uppercase tracking-[0.16em] text-cream/55">Odds are each race&apos;s own, live from Polymarket.</p>
    </div>
  );
}
