import { PAIRING } from "@/config/site";
import SectionTitle from "../SectionTitle";
import { Wrap } from "../ui";

export default function Pairing() {
  return (
    <section className="bg-stock py-14 sm:py-20">
      <Wrap>
        <SectionTitle kicker="Why it works" title={PAIRING.title} />
        <p className="-mt-2 mb-8 max-w-2xl text-lg text-ink/80">{PAIRING.intro}</p>
        <ol className="grid border-2 border-ink bg-paper sm:grid-cols-2 lg:grid-cols-3">
          {PAIRING.points.map((p, i) => (
            <li key={p.title} className={`-mb-0.5 -mr-0.5 border-b-2 border-r-2 border-ink p-5 ${i === 0 ? "bg-ink text-paper sm:col-span-2" : ""}`}>
              <div className={`font-narrow text-xs font-bold uppercase tracking-[0.2em] ${i === 0 ? "text-paper/70" : "text-mark"}`}>Measure {i + 1}</div>
              <h3 className="mt-1 font-head text-3xl uppercase leading-none">{p.title}</h3>
              <p className={`mt-2 ${i === 0 ? "text-paper/85" : "text-ink/80"}`}>{p.body}</p>
            </li>
          ))}
        </ol>
      </Wrap>
    </section>
  );
}
