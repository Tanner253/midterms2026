"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ENTERED_KEY } from "@/lib/splash";
import Logo from "./Logo";
import { Oval } from "./ui";

const GATED = new Set(["/", "/midterms", "/candidates", "/race", "/voters"]);

// The gate: a blank ballot. Marking the oval lets you in.
export default function Splash() {
  const path = (usePathname() ?? "/").replace(/\/+$/, "") || "/";
  const [open, setOpen] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const show = open && GATED.has(path);

  useEffect(() => {
    if (document.documentElement.dataset.entered) setOpen(false);
  }, []);

  useEffect(() => {
    if (!show) return;
    const html = document.documentElement;
    html.style.overflow = "hidden";
    button.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && enter();
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [show]);

  function enter() {
    try {
      localStorage.setItem(ENTERED_KEY, "1");
    } catch {}
    document.documentElement.dataset.entered = "1";
    setLeaving(true);
    setTimeout(() => setOpen(false), 260);
  }

  if (!show) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to US Midterms 2026"
      className={`fixed inset-0 z-50 flex flex-col justify-between overflow-clip bg-paper transition-opacity duration-200 [html[data-entered]_&]:hidden ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
    >
      <div aria-hidden="true" className="timing mx-3 mt-3" />
      <div className="flex animate-rise flex-col items-center px-4 text-center">
        <Logo size={190} className="-my-6" />
        <div className="font-head text-[clamp(84px,17vw,190px)] leading-[0.84]">
          US MIDTERMS
          <br />
          <span className="text-mark">2026</span>
        </div>
        <p className="mt-4 font-narrow text-sm font-bold uppercase tracking-[0.26em] text-ink/70">Official ballot · Exclusively on pump.fun</p>
        <button
          ref={button}
          type="button"
          onClick={enter}
          className="group mt-8 flex items-center gap-3 border-2 border-ink bg-paper px-6 py-4 font-narrow text-xl font-bold uppercase tracking-[0.14em] text-ink transition hover:bg-ink hover:text-paper"
        >
          <Oval size={20} filled={leaving} className="group-hover:border-paper" />
          Mark the oval to enter
        </button>
      </div>
      <div aria-hidden="true" className="timing mx-3 mb-3" />
    </div>
  );
}
