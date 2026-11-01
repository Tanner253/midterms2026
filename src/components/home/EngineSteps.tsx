"use client";

import { useEffect, useState } from "react";
import { ENGINE_STEPS, SITE } from "@/config/site";
import { fmtNum, fmtSol } from "@/lib/format";
import { useMarket } from "@/lib/market-context";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { CycleTimer } from "../Countdown";
import SectionTitle from "../SectionTitle";
import { Wrap } from "../ui";

const STEP_MS = 6000;
const COLORS = ["var(--color-sky)", "var(--color-red-hot)", "var(--color-mark)", "var(--color-lime)"];

// WC's ecosystem explainer: an auto-playing "broadcast" of the four steps of every fee cycle.
export default function EngineSteps() {
  const { stats, mints } = useMarket();
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || reduced) return;
    const t = setTimeout(() => setStep((s) => (s + 1) % ENGINE_STEPS.length), STEP_MS);
    return () => clearTimeout(t);
  }, [step, paused, reduced]);

  const pre = !mints.any && !stats?.cycles;
  const live = [
    { label: "SOL claimed & routed", value: fmtSol(stats?.totalSolRouted) },
    { label: `$${SITE.ticker} burned`, value: fmtNum(stats?.totalBurned) },
    { label: "SOL added to LP", value: fmtSol(stats?.solToLp) },
    { label: "SOL to marketing", value: fmtSol(stats?.solToMarketing) },
  ];
  const s = ENGINE_STEPS[step];
  const color = COLORS[step];

  return (
    <section className="py-14 sm:py-20">
      <Wrap>
        <SectionTitle
          kicker="Live · the fee engine"
          title={`How it feeds $${SITE.ticker}`}
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
        <div
          className="border-2 border-ink bg-paper "
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
        >
          <div className="relative grid min-h-[300px] overflow-hidden md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]" role="tabpanel" id="engine-panel" aria-labelledby={`engine-tab-${step}`}>
            <div className="greenbar pointer-events-none absolute inset-0" aria-hidden="true" />
            <div className="relative flex items-center justify-center border-b-[3px] border-ink/15 bg-paper p-6 md:border-b-0 md:border-r-[3px]">
              <Illustration step={step} color={color} />
            </div>
            <div key={step} className="relative animate-rise p-6 sm:p-8">
              <div className="font-narrow text-sm font-bold uppercase tracking-[0.3em]" style={{ color }}>
                Step {s.num} / 0{ENGINE_STEPS.length}
              </div>
              <h3 className="mt-2 font-head text-[clamp(56px,8vw,88px)] uppercase leading-none" style={{ color }}>
                {s.title}
              </h3>
              <p className="mt-4 max-w-xl text-lg text-ink/85">{s.body}</p>
              <div className="mt-6 inline-flex flex-col border-2 border-ink bg-paper px-4 py-3 ">
                <span className="font-narrow text-[11px] font-bold uppercase tracking-[0.24em] text-ink/60">{live[step].label}</span>
                <span className="font-head text-4xl tabular-nums">{pre ? "Starts at launch" : live[step].value}</span>
              </div>
            </div>
          </div>

          <div role="tablist" aria-label="Fee cycle steps" className="grid grid-cols-2 border-t-2 border-ink sm:grid-cols-4">
            {ENGINE_STEPS.map((x, i) => (
              <button
                key={x.num}
                id={`engine-tab-${i}`}
                type="button"
                role="tab"
                aria-selected={i === step}
                aria-controls="engine-panel"
                onClick={() => {
                  setStep(i);
                  setPaused(true);
                }}
                className={`relative flex min-h-[52px] items-center gap-2 overflow-hidden border-ink/20 px-4 py-3 text-left transition [&:nth-child(odd)]:border-r-2 sm:[&:not(:last-child)]:border-r-2 ${
                  i === step ? "bg-ink text-paper" : "text-ink/75 hover:bg-ink/10"
                }`}
              >
                <span className="font-head text-lg leading-none">{x.num}</span>
                <span className="font-narrow text-sm font-bold uppercase tracking-[0.12em]">{x.title}</span>
                {i === step && !paused && !reduced && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-1 origin-left"
                    style={{ background: COLORS[i], animation: `step-progress ${STEP_MS}ms linear` }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </Wrap>
    </section>
  );
}

// Simple looping SVG scenes, one per step.
function Illustration({ step, color }: { step: number; color: string }) {
  if (step === 0)
    return (
      <svg viewBox="0 0 200 140" className="w-full max-w-[280px]" aria-hidden="true">
        <rect x="70" y="70" width="60" height="50" fill="var(--color-stock-2)" stroke="var(--color-ink)" strokeWidth="4" />
        <rect x="88" y="66" width="24" height="8" fill="var(--color-ink)" />
        {[-70, -35, 0, 35, 70].map((dx, i) => (
          <circle
            key={dx}
            cx="100"
            cy="70"
            r="9"
            fill={color}
            stroke="var(--color-ink)"
            strokeWidth="3"
            style={{ ["--dx" as string]: `${dx}px`, animation: `coin-in 2.2s ${i * 0.35}s ease-in infinite` }}
          />
        ))}
      </svg>
    );
  if (step === 1)
    return (
      <svg viewBox="0 0 200 140" className="w-full max-w-[280px]" aria-hidden="true">
        <g style={{ transformOrigin: "100px 128px", animation: "flame 0.6s ease-in-out infinite" }}>
          <path d="M100 20c18 26 38 40 38 70a38 38 0 0 1-76 0c0-18 10-26 18-38 2 14 8 20 14 22-2-22 0-38 6-54z" fill="var(--color-red-hot)" stroke="var(--color-ink)" strokeWidth="4" />
          <path d="M100 66c10 12 18 20 18 34a18 18 0 0 1-36 0c0-12 10-20 18-34z" fill="var(--color-mark)" />
        </g>
        <circle cx="100" cy="10" r="8" fill="var(--color-mark)" stroke="var(--color-ink)" strokeWidth="3" style={{ ["--dx" as string]: "0px", animation: "coin-in 1.6s ease-in infinite" }} />
      </svg>
    );
  if (step === 2)
    return (
      <svg viewBox="0 0 200 140" className="w-full max-w-[280px]" aria-hidden="true">
        <rect x="40" y="30" width="120" height="96" fill="var(--color-paper-3)" stroke="var(--color-ink)" strokeWidth="4" />
        <rect
          x="44"
          y="34"
          width="112"
          height="88"
          fill={color}
          style={{ transformOrigin: "100px 122px", animation: "pool-fill 3s ease-in-out infinite alternate" }}
        />
        <text x="100" y="86" textAnchor="middle" fontFamily="var(--ff-head)" fontWeight="900" fontSize="30" fill="var(--color-paper)">
          LP
        </text>
      </svg>
    );
  return (
    <svg viewBox="0 0 200 140" className="w-full max-w-[280px]" aria-hidden="true">
      <path d="M40 60h24l44-26v72L64 80H40z" fill="var(--color-ink)" stroke="var(--color-ink)" strokeWidth="4" strokeLinejoin="round" />
      <rect x="48" y="80" width="14" height="28" fill="var(--color-ink)" stroke="var(--color-ink)" strokeWidth="4" />
      {[0, 0.6, 1.2].map((d) => (
        <path
          key={d}
          d="M124 44c14 12 14 40 0 52"
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          style={{ transformOrigin: "112px 70px", animation: `wave-out 1.8s ${d}s ease-out infinite` }}
        />
      ))}
    </svg>
  );
}
