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
import { ContestHead, Oval } from "../ui";
import { Sticker, VotedCelebration } from "./VotedSticker";

const DRAFT_KEY = "mt26-ballot-v1";
const CHAMBERS: { key: Chamber; label: string }[] = [
  { key: "house", label: "House winner" },
  { key: "senate", label: "Senate winner" },
];
const OFFICES: Office[] = ["Senate", "Governor"];
const SIDES: ControlPick[] = ["R", "D"];

const Verdict = ({ right }: { right: boolean }) => (
  <span className={`absolute right-1.5 top-1.5 z-10 px-2 py-0.5 font-narrow text-xs font-bold uppercase text-paper ${right ? "bg-lime" : "bg-red-hot"}`}>
    {right ? "✓ Called it" : "✗ Missed"}
  </span>
);

const rowCls = (locked: boolean) => `flex min-h-[56px] w-full items-center gap-3 border-t-2 border-ink px-3 py-2 text-left transition first:border-t-0 ${locked ? "cursor-default" : "hover:bg-paper-3"}`;

// WC's bracket challenge, midterm-sized: a real ballot. Mark the House, the Senate and every race,
// share it, and get scored as the results come in.
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
          <h2 className="font-head text-[clamp(44px,7vw,84px)] uppercase leading-[0.92]">Call the race</h2>
          <p className="mt-2 max-w-xl text-ink/75">Mark the House, the Senate and every race on the board. Share your ballot and watch it score as the results come in.</p>
        </div>
        {shared && (
          <button type="button" onClick={makeOwn} className="border-2 border-ink px-4 py-2 font-narrow font-bold uppercase tracking-[0.14em] hover:bg-ink hover:text-paper">
            Make your own →
          </button>
        )}
      </div>

      <div className="mb-5 border-2 border-ink bg-paper-2 px-4 py-3 font-narrow font-bold uppercase tracking-[0.14em]">
        {BALLOT.prize ? (
          <>
            <span className="text-mark">
              {BALLOT.prize.winners} winners × {BALLOT.prize.solEach} SOL
            </span>
            <span className="ml-2 text-ink/80">{BALLOT.prize.rules}</span>
          </>
        ) : (
          <span className="text-ink/80">Giveaways for the best ballots are announced on our socials.</span>
        )}
      </div>

      {shared && <div className="mb-4 bg-mark px-4 py-2 font-narrow text-sm font-bold uppercase tracking-[0.16em] text-paper">Shared ballot · read only</div>}

      <div className="grid gap-4 md:grid-cols-2">
        {CHAMBERS.map(({ key, label }) => {
          const truth = CONTROL[key];
          const pick = shown[key];
          return (
            <div key={key} className="relative border-2 border-ink bg-paper">
              {truth && pick && <Verdict right={truth === pick} />}
              <ContestHead title={label} note="Vote for one" />
              {SIDES.map((p) => (
                <button key={p} type="button" disabled={!!shared} aria-pressed={pick === p} onClick={() => update({ ...ballot, [key]: p })} className={rowCls(!!shared)}>
                  <Oval size={22} filled={pick === p} />
                  <span className="font-head text-[28px] uppercase leading-none" style={{ color: PARTIES[p].color }}>
                    {PARTIES[p].plural}
                  </span>
                </button>
              ))}
            </div>
          );
        })}
      </div>

      {OFFICES.map((office) => (
        <section key={office} className="mt-8">
          <h3 className="mb-3 font-head text-3xl uppercase leading-none">{office}</h3>
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
        <div className="border-2 border-ink bg-paper-2 px-4 py-3">
          <div className="font-narrow text-xs font-bold uppercase tracking-[0.22em] text-ink/60">Ballot vs reality</div>
          <div className="font-head text-3xl uppercase leading-tight">
            {score.decided ? `${score.right}/${score.decided} calls right so far` : complete ? "Nothing decided yet" : `${picked}/${total} picks made`}
          </div>
          <p className="mt-1 text-sm text-ink/60">Calls are scored only once they're decided: each race as it's called, the House and Senate once control is called.</p>
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
              className="border-2 border-ink bg-mark px-4 py-3 font-narrow font-bold uppercase tracking-[0.14em] text-paper"
            >
              <span aria-live="polite">{copied ? "Link copied" : "Copy link"}</span>
            </button>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}&url=${encodeURIComponent(link)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border-2 border-ink bg-ink px-4 py-3 font-narrow font-bold uppercase tracking-[0.14em] text-paper"
            >
              <IconX /> Share on X
            </a>
            <NativeShare text={tweet} url={link} />
          </div>
        )}
      </div>

      {complete && call && !shared && (
        <div className="mt-8 flex flex-col items-center justify-center gap-4 text-center sm:flex-row sm:text-left">
          <Sticker size={96} className="shrink-0 -rotate-6" />
          <p className="font-head text-[clamp(32px,4.4vw,52px)] uppercase leading-[0.95]">
            <span className="text-mark">{call}</span>
          </p>
        </div>
      )}

      {celebrate && <VotedCelebration onDone={endCelebration} />}
    </div>
  );
}

// One race on the ballot: mark a candidate's oval to pick them.
function RacePick({ id, label, rows, pick, locked, onPick }: { id: RaceId; label: string; rows: CandidateRow[]; pick: string | null; locked: boolean; onPick: (candidate: string) => void }) {
  const winner = raceWinner(id);
  return (
    <div className="relative border-2 border-ink bg-paper">
      {winner && pick && <Verdict right={winner.id === pick} />}
      <ContestHead title={label} note="Vote for one" />
      {rows.map((r) => (
        <button key={r.id} type="button" disabled={locked} aria-pressed={pick === r.id} onClick={() => onPick(r.id)} className={rowCls(locked)}>
          <Oval size={20} filled={pick === r.id} />
          <Avatar c={r} size={40} />
          <span className="min-w-0 flex-1">
            <span className="block truncate font-bold uppercase leading-tight">{r.name}</span>
            <span className="font-narrow text-xs font-bold uppercase tracking-[0.14em] text-ink/60">{PARTIES[r.party].name}</span>
          </span>
          <span className="font-mono text-sm tabular-nums text-ink/70">{fmtOdds(r.odds)}</span>
        </button>
      ))}
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
      className="border-2 border-ink bg-paper px-4 py-3 font-narrow font-bold uppercase tracking-[0.14em] text-ink"
    >
      Share…
    </button>
  );
}
