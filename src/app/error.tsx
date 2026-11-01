"use client";

import PageHero from "@/components/PageHero";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <PageHero kicker="Something broke" title="Too close to call." subtitle="This page hit an error. Try it again.">
      <button
        type="button"
        onClick={reset}
        className="mt-8 border-2 border-ink bg-ink px-6 py-3 font-narrow text-lg font-bold uppercase tracking-[0.14em] text-paper hover:bg-mark"
      >
        Retry
      </button>
    </PageHero>
  );
}
