"use client";

import { useEffect, useState } from "react";
import { CANDIDATES, isAlive } from "@/config/candidates";
import { CURRENT_STAGE, nextDatedEvent, stageLabel, upcomingEvents } from "@/config/race";
import { SITE } from "@/config/site";
import { fmtDate } from "@/lib/format";
import { CYCLE_MS } from "@/lib/market";
import { useMarket } from "@/lib/market-context";
import { pad2, splitDuration, useNow } from "@/lib/useNow";
import { useReducedMotion } from "@/lib/useReducedMotion";
import Avatar from "../Avatar";
import { nextCycleTarget } from "../Countdown";
import FlipTile from "../FlipTile";
import { LiveDot } from "../ui";

const PANELS = ["Next big day", "Next burn", "Candidates", "Up next"] as const;
const ROTATE_MS = 9000;

// WC's jumbotron: one scoreboard that cycles through the race's key numbers.
export default function Scoreboard() {
  const [panel, setPanel] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (paused || reduced) return;
    const t = setInterval(() => setPanel((p) => (p + 1) % PANELS.length), ROTATE_MS);
    return () => clearInterval(t);
  }, [paused, reduced]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Race scoreboard"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      className="relative h-full border-2 border-ink bg-paper"
    >
      <div className="greenbar pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative flex items-center justify-between gap-3 bg-ink px-4 py-2.5 text-paper">
        <span className="flex items-center gap-2 font-narrow text-sm font-bold uppercase tracking-[0.2em]">
          <LiveDot color="var(--color-paper)" /> ${SITE.ticker}
        </span>
        <span className="font-narrow text-xs font-bold uppercase tracking-[0.2em] text-paper/75">{stageLabel(CURRENT_STAGE)}</span>
      </div>

      <div className="relative min-h-[300px] p-5 sm:min-h-[280px] sm:p-6" aria-live="polite">
        <div key={panel} className="animate-rise">
          {panel === 0 && <NextBigDay />}
          {panel === 1 && <NextBurn />}
          {panel === 2 && <Remaining />}
          {panel === 3 && <UpNext />}
        </div>
      </div>

      <div className="relative flex items-center justify-center gap-2 border-t-2 border-ink bg-paper px-4 py-2">
        {PANELS.map((name, i) => (
          <button
            key={name}
            type="button"
            onClick={() => {
              setPanel(i);
              setPaused(true);
            }}
            aria-label={`Show ${name}`}
            aria-pressed={i === panel}
            className="flex h-8 items-center px-1.5"
          >
            <span className={`block h-2 transition-all ${i === panel ? "w-7 bg-mark" : "w-2 bg-ink/35"}`} />
          </button>
        ))}
      </div>
    </section>
  );
}

function PanelTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="font-head text-[clamp(34px,4vw,44px)] uppercase leading-none">{children}</h2>;
}

function NextBigDay() {
  const now = useNow();
  const event = now === null ? null : nextDatedEvent(now);
  const target = event?.date ? Date.parse(`${event.date}T00:00:00-05:00`) : Date.parse(SITE.electionDay);
  const d = now === null ? null : splitDuration(target - now);
  return (
    <>
      <PanelTitle>
        Next big day in
      </PanelTitle>
      <div className="mt-5 flex gap-2 sm:gap-3">
        <FlipTile size="lg" value={d ? String(d.days) : "—"} unit="Days" />
        <FlipTile size="lg" value={d ? pad2(d.hours) : "—"} unit="Hrs" />
        <FlipTile size="lg" value={d ? pad2(d.mins) : "—"} unit="Mins" />
        <FlipTile size="lg" value={d ? pad2(d.secs) : "—"} unit="Secs" />
      </div>
      <p className="mt-4 font-narrow text-base font-bold uppercase tracking-[0.18em] text-ink/85">
        {event ? `${event.title} · ${fmtDate(event.date!, true)}` : "Election Day · Nov 3, 2026"}
      </p>
    </>
  );
}

function NextBurn() {
  const { stats } = useMarket();
  const now = useNow();
  const target = now === null ? null : nextCycleTarget(stats?.nextCycleAt, stats?.cycleIntervalMs ?? CYCLE_MS, now);
  const d = now !== null && target !== null ? splitDuration(target - now) : null;
  return (
    <>
      <PanelTitle>
        Next <em className="not-italic text-red-hot">burn</em> in
      </PanelTitle>
      {d ? (
        <div className="mt-5 flex gap-2 sm:gap-3">
          <FlipTile size="lg" value={pad2(d.hours + d.days * 24)} unit="Hrs" />
          <FlipTile size="lg" value={pad2(d.mins)} unit="Mins" />
          <FlipTile size="lg" value={pad2(d.secs)} unit="Secs" />
        </div>
      ) : (
        <div className="mt-5 border-2 border-dashed border-ink/40 px-4 py-6 text-center font-head text-4xl uppercase text-ink/80">
          Burns start at launch
        </div>
      )}
      <p className="mt-4 font-narrow text-sm font-bold uppercase tracking-[0.18em] text-ink/70">
        Creator fees claimed &amp; burned on-chain every 5 minutes
      </p>
    </>
  );
}

function Remaining() {
  const alive = CANDIDATES.filter(isAlive);
  return (
    <>
      <div className="flex items-end gap-3">
        <span className="font-head text-[clamp(84px,11vw,120px)] leading-[0.8] text-mark">{alive.length}</span>
        <PanelTitle>
          Candidates
          <br />
          remain
        </PanelTitle>
      </div>
      <ul className="mt-5 grid grid-cols-6 gap-x-1 gap-y-2 sm:grid-cols-8">
        {alive.map((c) => (
          <li key={c.id} className="flex flex-col items-center gap-0.5">
            <Avatar c={c} size={34} />
            <span className="max-w-full truncate font-narrow text-[10px] font-bold uppercase tracking-[0.06em] text-ink/75">{c.ticker}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 font-narrow text-sm font-bold uppercase tracking-[0.22em] text-red-hot">12 races · one seat each</p>
    </>
  );
}

function UpNext() {
  const now = useNow();
  const events = now === null ? [] : upcomingEvents(now).slice(0, 3);
  return (
    <>
      <PanelTitle>Up next</PanelTitle>
      <ul className="mt-4 space-y-2">
        {events.map((e) => (
          <li key={e.id} className="flex items-center gap-3 border-2 border-ink bg-paper px-3 py-2">
            <span className="w-20 shrink-0 font-narrow text-sm font-bold uppercase tracking-[0.12em] text-mark">
              {e.date ? fmtDate(e.date) : "TBD"}
            </span>
            <span className="min-w-0">
              <span className="block truncate font-bold">{e.title}</span>
              <span className="block truncate font-narrow text-xs uppercase tracking-[0.14em] text-ink/60">
                {e.date ? new Date(e.date).getUTCFullYear() : e.when} · {e.place}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
