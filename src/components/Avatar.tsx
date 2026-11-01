"use client";

import { useState } from "react";
import { PARTIES, initials, type Candidate } from "@/config/candidates";
import { PHOTOS } from "@/config/photos";

// Candidate portrait (or initials) in a ballot oval with a party-colour rim.
// `square` for table cells; `dim` greys out candidates who lost (pass dim={false}
// when the parent row/card already fades them).
export default function Avatar({
  c,
  size = 44,
  square = false,
  dim = true,
}: {
  c: Candidate;
  size?: number;
  square?: boolean;
  dim?: boolean;
}) {
  const [broken, setBroken] = useState(false);
  const src = broken ? undefined : (c.image ?? PHOTOS[c.id]?.src);
  const p = PARTIES[c.party];
  const rim = square ? 2 : Math.max(2, Math.round(size * 0.07));
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden font-head ${square ? "" : "rounded-[50%]"} ${
        dim && c.status === "lost" ? "grayscale" : ""
      }`}
      style={{
        width: square ? size : Math.round(size * 0.82),
        height: size,
        background: p.color,
        border: `${rim}px solid ${p.color}`,
        color: p.on,
        fontSize: size * 0.36,
      }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" loading="lazy" referrerPolicy="no-referrer" onError={() => setBroken(true)} className="h-full w-full object-cover object-[50%_18%]" />
      ) : (
        initials(c.name)
      )}
    </span>
  );
}

export function PartyTag({ party }: { party: Candidate["party"] }) {
  const p = PARTIES[party];
  return (
    <span
      className="inline-block px-1.5 py-0.5 font-narrow text-[11px] font-bold tracking-[0.14em]"
      style={{ background: p.color, color: p.on }}
      title={p.name}
    >
      {p.short}
    </span>
  );
}
