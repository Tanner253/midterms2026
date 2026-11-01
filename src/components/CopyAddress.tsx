"use client";

import { useState } from "react";

export default function CopyAddress({ address }: { address: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const label = (
    <span className="block font-narrow text-[10px] font-bold uppercase tracking-[0.3em] text-mark">Contract address</span>
  );
  if (!address) {
    return (
      <div className="w-full max-w-[520px] border-2 border-dashed border-ink/50 bg-paper/70 px-3 py-2.5">
        {label}
        <span className="font-mono text-sm text-ink/70">Drops at launch</span>
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(address);
          setState("copied");
        } catch {
          setState("failed");
        }
        setTimeout(() => setState("idle"), 1800);
      }}
      className="group flex w-full max-w-[520px] items-center gap-3 border-2 border-ink bg-paper px-3 py-2.5 text-left transition hover:border-mark"
    >
      <span className="min-w-0 flex-1">
        {label}
        <span className="block truncate font-mono text-sm text-ink">{address}</span>
      </span>
      <span aria-live="polite" className="shrink-0 border-2 border-ink bg-mark px-2.5 py-1 font-narrow text-sm font-bold uppercase tracking-[0.14em] text-paper">
        {state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : "Copy"}
      </span>
    </button>
  );
}
