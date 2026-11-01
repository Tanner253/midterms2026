import Link from "next/link";
import PageHero from "@/components/PageHero";

export default function NotFound() {
  return (
    <PageHero kicker="Error 404" title="This seat is vacant." subtitle="Recount requested: page not found.">
      <Link
        href="/"
        className="mt-8 inline-block border-2 border-ink bg-ink px-6 py-3 font-narrow text-lg font-bold uppercase tracking-[0.14em] text-paper hover:bg-mark"
      >
        Back to the race →
      </Link>
    </PageHero>
  );
}
