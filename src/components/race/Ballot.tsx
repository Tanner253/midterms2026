"use client";

import { useCallback, useEffect, useState } from "react";
import { PARTIES } from "@/config/candidates";
import { CONTROL, RACES, type Chamber, type Office, type RaceId } from "@/config/race";
import { BALLOT, SITE } from "@/config/site";
import { fmtOdds } from "@/lib/format";
import { useCandidateRows, type CandidateRow } from "@/lib/market-context";
import { EMPTY_BALLOT, cleanBallot, decodeBallot, encodeBallot, isComplete, raceWinner, racesFor, scoreBallot, type Ballot as B, type ControlPick } from "@/lib/race";
import Avatar from "../Avatar";
import { IconX } from "../icons";
import { Sticker, VotedCelebration } from "./VotedSticker";

const DRAFT_KEY = "mt26-ballot-v1";
const CHAMBERS: { key: Chamber; label: string }[] = [
  { key: "house", label: "House winner" },
  { key: "senate", label: "Senate winner" },
];
const OFFICES: Office[] = ["Senate", "Governor"];
const SIDES: ControlPick[] = ["R", "D"];

const Verdict = ({ right }: { right: boolean }) => (
  <span className={`absolute right-1.5 top-1.5 z-10 px-2 py-0.5 font-narrow text-xs font-bold uppercase ${right ? "bg-lime text-ink" : "bg-red-hot text-cream"}`}>
    {right ? "✓ Called it" : "✗ Missed"}
  </span>
);

// WC's bracket challenge, midterm-sized: call the House, the Senate and every race, share it, get
// scored as the results come in.
export default function Ballot() {
  const rows = useCandidateRows();
  const [ballot, setBallot] = useState<B>(EMPTY_BALLOT);
  const [shared, setShared] = useState<B | null>(null);
  const [copied, setCopied] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const endCelebration = useCallback(() => setCelebrate(false), []);

  useEffect(() => {
    setShared(decodeBallot(new URLSearchParams(window.location.search).get("b")));
    try {
      setBallot(cleanBallot(JSON.parse(localStorage.getItem(DRAFT_KEY) ?? "null")));
    } catch {}
  }, []);

  const update = (next: B) => {
    const b = cleanBallot(next);
    // Celebrate the moment a ballot becomes complete, not when a saved one loads.
    if (!isComplete(ballot) && isComplete(b)) setCelebrate(true);
    setBallot(b);
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(b));
    } catch {}
  };

  const makeOwn = () => {
    setShared(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("b");
    history.replaceState(null, "", url);
  };

  const shown = shared ?? ballot;
  const complete = isComplete(shown);
  const picked = Object.keys(shown.picks).length + (shown.house ? 1 : 0) + (shown.senate ? 1 : 0);
  const total = RACES.length + CHAMBERS.length;
  const score = scoreBallot(shown);
  const link = typeof window === "undefined" ? "" : `${window.location.origin}/race/?view=ballot&b=${encodeBallot(shown)}`;
  const call = shown.house && shown.senate ? `${PARTIES[shown.house].plural} take the House, ${PARTIES[shown.senate].plural} take the Senate` : null;
  const tweet = call ? `My midterms call: ${call}. Make yours on ${SITE.name} $${SITE.ticker}` : `Calling the midterms on ${SITE.name} $${SITE.ticker}`;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-slab text-[clamp(30px,5vw,56px)] uppercase leading-none">Call the race</h2>
          <p className="mt-2 max-w-xl text-cream/75">Pick the House, the Senate and every race on the board. Share your ballot and watch it score as the results come in.</p>
        </div>
        {shared && (
          <button type="button" onClick={makeOwn} className="border-2 border-cream px-4 py-2 font-narrow font-bold uppercase tracking-[0.14em] hover:bg-cream hover:text-ink">
            Make your own →
          </button>
        )}
      </div>

      <div className="mb-5 border-[3px] border-gold bg-ink px-4 py-3 font-narrow font-bold uppercase tracking-[0.14em]">
        {BALLOT.prize ? (
          <>
            <span className="text-gold">
              {BALLOT.prize.winners} winners × {BALLOT.prize.solEach} SOL
            </span>
            <span className="ml-2 text-cream/80">{BALLOT.prize.rules}</span>
          </>
        ) : (
          <span className="text-cream/80">Giveaways for the best ballots are announced on our socials.</span>
        )}
      </div>

      {shared && (
        <div className="mb-4 bg-gold px-4 py-2 font-narrow text-sm font-bold uppercase tracking-[0.16em] text-ink">Shared ballot · read only</div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {CHAMBERS.map(({ key, label }) => {
          const truth = CONTROL[key];
          const pick = shown[key];
          return (
            <div key={key} className="relative border-[3px] border-gold bg-ink p-4 shadow-brutal-gold">
              {truth && pick && <Verdict right={truth === pick} />}
              <div className="mb-3 font-narrow text-xs font-bold uppercase tracking-[0.24em] text-gold">{label}</div>
              <div className="grid grid-cols-2 gap-3">
                {SIDES.map((p) => (
                  <button
                    key={p}
                    type="button"
                    disabled={!!shared}
                    aria-pressed={pick === p}
                    onClick={() => update({ ...ballot, [key]: p })}
                    className={`min-h-[64px] border-[3px] px-2 py-3 font-slab text-[clamp(15px,2.4vw,22px)] uppercase leading-tight transition ${
                      pick === p ? "border-cream" : "border-ink bg-ink-3 text-cream/70"
                    } ${shared ? "cursor-default" : "hover:-translate-y-0.5"}`}
                    style={pick === p ? { background: PARTIES[p].color, color: PARTIES[p].on } : undefined}
                  >
                    {PARTIES[p].plural}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {OFFICES.map((office) => (
        <section key={office} className="mt-8">
          <h3 className="mb-3 flex items-center gap-2 font-narrow text-sm font-bold uppercase tracking-[0.28em] text-gold">
            <span aria-hidden="true" className="h-1 w-3 bg-gold" />
            {office}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {racesFor(office).map((race) => (
              <RacePick
                key={race.id}
                id={race.id}
                label={race.label}
                rows={rows.filter((r) => r.race === race.id)}
                pick={shown.picks[race.id] ?? null}
                locked={!!shared}
                onPick={(c) => update({ ...ballot, picks: { ...ballot.picks, [race.id]: c } })}
              />
            ))}
          </div>
        </section>
      ))}

      <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="border-[3px] border-cream/30 bg-ink-2 px-4 py-3">
          <div className="font-narrow text-xs font-bold uppercase tracking-[0.24em] text-cream/60">Ballot vs reality</div>
          <div className="font-slab text-xl uppercase">
            {score.decided ? `${score.right}/${score.decided} calls right so far` : complete ? "Nothing decided yet" : `${picked}/${total} picks made`}
          </div>
          <p className="mt-1 text-sm text-cream/60">Calls are scored only once they're decided: each race as it's called, the House and Senate once control is called.</p>
        </div>
        {complete && (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(link);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1800);
                } catch {}
              }}
              className="border-[3px] border-ink bg-gold px-4 py-3 font-narrow font-bold uppercase tracking-[0.14em] text-ink shadow-brutal-sm"
            >
              <span aria-live="polite">{copied ? "Link copied" : "Copy link"}</span>
            </button>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}&url=${encodeURIComponent(link)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border-[3px] border-ink bg-cream px-4 py-3 font-narrow font-bold uppercase tracking-[0.14em] text-ink shadow-brutal-sm"
            >
              <IconX /> Share on X
            </a>
            <NativeShare text={tweet} url={link} />
          </div>
        )}
      </div>

      {complete && call && !shared && (
        <div className="mt-8 flex flex-col items-center justify-center gap-4 text-center sm:flex-row sm:text-left">
          <Sticker size={96} className="shrink-0 -rotate-6 drop-shadow-[4px_5px_0_rgba(0,0,0,0.45)]" />
          <p className="font-slab text-[clamp(22px,3.4vw,36px)] uppercase leading-tight">
            <span className="text-gold">{call}</span>
          </p>
        </div>
      )}

      {celebrate && <VotedCelebration onDone={endCelebration} />}
    </div>
  );
}

// One race on the ballot: tap a candidate to pick them.
function RacePick({ id, label, rows, pick, locked, onPick }: { id: RaceId; label: string; rows: CandidateRow[]; pick: string | null; locked: boolean; onPick: (candidate: string) => void }) {
  const winner = raceWinner(id);
  return (
    <div className="relative border-[3px] border-cream bg-ink-2 shadow-brutal-md">
      {winner && pick && <Verdict right={winner.id === pick} />}
      <div className="border-b-[3px] border-cream/20 px-3 py-2 font-slab text-sm uppercase">{label}</div>
      <div className="grid grid-cols-2">
        {rows.map((r) => (
          <button
            key={r.id}
            type="button"
            disabled={locked}
            aria-pressed={pick === r.id}
            onClick={() => onPick(r.id)}
            className={`flex min-w-0 flex-col items-center gap-1.5 p-3 text-center transition [&:first-child]:border-r-2 [&:first-child]:border-cream/15 ${
              pick === r.id ? "bg-gold text-ink" : locked ? "" : "hover:bg-cream/10"
            } ${locked ? "cursor-default" : ""}`}
          >
            <Avatar c={r} size={52} />
            <span className="w-full font-bold uppercase leading-tight">{r.name}</span>
            <span className={`font-narrow text-xs font-bold uppercase tracking-[0.14em] ${pick === r.id ? "text-ink/70" : "text-cream/60"}`}>
              {PARTIES[r.party].short} · {fmtOdds(r.odds)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function NativeShare({ text, url }: { text: string; url: string }) {
  const [can, setCan] = useState(false);
  useEffect(() => setCan(typeof navigator.share === "function"), []);
  if (!can) return null;
  return (
    <button
      type="button"
      onClick={() => navigator.share({ text, url }).catch(() => {})}
      className="border-[3px] border-ink bg-cream px-4 py-3 font-narrow font-bold uppercase tracking-[0.14em] text-ink shadow-brutal-sm"
    >
      Share…
    </button>
  );
}
