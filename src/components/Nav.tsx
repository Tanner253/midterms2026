"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE } from "@/config/site";
import BuyButton from "./BuyButton";
import { IconBallot, IconCoin, IconFlag, IconHome, IconUsers, SOCIAL_ICONS } from "./icons";
import Logo from "./Logo";

export const LINKS = [
  { href: "/", label: "Home", short: "Home", Icon: IconHome },
  { href: "/midterms/", label: `$${SITE.ticker}`, short: `$${SITE.ticker}`, Icon: IconCoin },
  { href: "/candidates/", label: "Candidates", short: "Candidates", Icon: IconUsers },
  { href: "/race/", label: "The Race", short: "Race", Icon: IconFlag },
  { href: "/voters/", label: "Voter Card", short: "Voters", Icon: IconBallot },
];

const norm = (p: string) => p.replace(/\/+$/, "") || "/";

export default function Nav() {
  const path = norm(usePathname() ?? "/");
  const socials = SITE.socials.filter((s) => s.href);
  return (
    <>
      <header className="sticky top-0 z-40 h-[68px] border-b-[3px] border-ink bg-paper">
        <div className="mx-auto flex h-full max-w-7xl items-center gap-3 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo size={58} />
            <span className="font-head text-[26px] leading-[0.86]">
              MIDTERMS
              <br />
              <span className="text-mark">2026</span>
            </span>
          </Link>
          <nav aria-label="Main" className="ml-auto hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => {
              const active = path === norm(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`whitespace-nowrap px-3 py-2 font-narrow text-[15px] font-bold uppercase tracking-[0.1em] transition ${
                    active ? "bg-ink text-paper" : "text-ink/80 hover:bg-paper-3"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-3 lg:ml-2">
            {socials.map((s) => {
              const Icon = SOCIAL_ICONS[s.label];
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="hidden text-xl text-ink/80 hover:text-mark sm:block"
                >
                  {Icon ? <Icon /> : s.label}
                </a>
              );
            })}
            <div className="hidden sm:block lg:hidden xl:block">
              <BuyButton size="sm" />
            </div>
          </div>
        </div>
      </header>

      <nav
        aria-label="Sections"
        className="sticky top-[68px] z-30 grid grid-cols-5 border-b-[3px] border-ink bg-paper lg:hidden"
      >
        {LINKS.map((l) => {
          const active = path === norm(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-[52px] flex-col items-center justify-center gap-1 px-1 font-narrow text-[11px] font-bold uppercase tracking-[0.04em] ${
                active ? "bg-ink text-paper" : "text-ink/75"
              }`}
            >
              <l.Icon className="text-[19px]" />
              <span className="max-w-full truncate">{l.short}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
