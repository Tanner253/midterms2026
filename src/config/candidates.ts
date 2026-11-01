import type { RaceId } from "./race";

export type Party = "R" | "D" | "I";

// Set to "won" or "lost" as races are called. Ballots score themselves from it.
export type Status = "running" | "won" | "lost";

export type Candidate = {
  id: string;
  name: string;
  ticker: string;
  party: Party;
  race: RaceId;
  // pump.fun contract address; leave "" until the coin is live.
  mint: string;
  status: Status;
  // Market id on the race's Polymarket event, for live odds.
  polymarketId?: string;
  // Optional photo in /public/candidates/. Initials are shown otherwise.
  image?: string;
};

// color = party fill; on = readable text color on that fill; adj = "Democratic nominee".
export const PARTIES: Record<Party, { name: string; plural: string; adj: string; short: string; color: string; on: string }> = {
  R: { name: "Republican", plural: "Republicans", adj: "Republican", short: "GOP", color: "var(--color-red)", on: "var(--color-paper)" },
  D: { name: "Democrat", plural: "Democrats", adj: "Democratic", short: "DEM", color: "var(--color-blue)", on: "var(--color-paper)" },
  I: { name: "Independent", plural: "Independents", adj: "Independent", short: "IND", color: "var(--color-mark)", on: "var(--color-paper)" },
};

// Roster: both candidates in the 12 statewide races with the most Polymarket volume (Oct 31, 2026),
// biggest race first. Names and parties checked against each race's nominees on Nov 1, 2026.
export const CANDIDATES: Candidate[] = [
  { id: "becerra", name: "Xavier Becerra", ticker: "BECERRA", party: "D", race: "ca-gov", mint: "", status: "running", polymarketId: "628941" },
  { id: "hilton", name: "Steve Hilton", ticker: "HILTON", party: "R", race: "ca-gov", mint: "", status: "running", polymarketId: "628940" },
  { id: "talarico", name: "James Talarico", ticker: "TALARICO", party: "D", race: "tx-sen", mint: "", status: "running", polymarketId: "630963" },
  { id: "paxton", name: "Ken Paxton", ticker: "PAXTON", party: "R", race: "tx-sen", mint: "", status: "running", polymarketId: "630964" },
  { id: "el-sayed", name: "Abdul El-Sayed", ticker: "ELSAYED", party: "D", race: "mi-sen", mint: "", status: "running", polymarketId: "630805" },
  { id: "rogers", name: "Mike Rogers", ticker: "ROGERS", party: "R", race: "mi-sen", mint: "", status: "running", polymarketId: "630806" },
  { id: "jackson", name: "Troy Jackson", ticker: "JACKSON", party: "D", race: "me-sen", mint: "", status: "running", polymarketId: "630772" },
  { id: "collins", name: "Susan Collins", ticker: "COLLINS", party: "R", race: "me-sen", mint: "", status: "running", polymarketId: "630773" },
  { id: "brown", name: "Sherrod Brown", ticker: "BROWN", party: "D", race: "oh-sen", mint: "", status: "running", polymarketId: "631057" },
  { id: "husted", name: "Jon Husted", ticker: "HUSTED", party: "R", race: "oh-sen", mint: "", status: "running", polymarketId: "631058" },
  { id: "peltola", name: "Mary Peltola", ticker: "PELTOLA", party: "D", race: "ak-sen", mint: "", status: "running", polymarketId: "634976" },
  { id: "sullivan", name: "Dan Sullivan", ticker: "SULLIVAN", party: "R", race: "ak-sen", mint: "", status: "running", polymarketId: "634974" },
  { id: "ricketts", name: "Pete Ricketts", ticker: "RICKETTS", party: "R", race: "ne-sen", mint: "", status: "running", polymarketId: "634892" },
  { id: "osborn", name: "Dan Osborn", ticker: "OSBORN", party: "I", race: "ne-sen", mint: "", status: "running", polymarketId: "634893" },
  { id: "hamilton", name: "Adam Hamilton", ticker: "HAMILTON", party: "D", race: "ks-sen", mint: "", status: "running", polymarketId: "630746" },
  { id: "marshall", name: "Roger Marshall", ticker: "MARSHALL", party: "R", race: "ks-sen", mint: "", status: "running", polymarketId: "630747" },
  { id: "turek", name: "Josh Turek", ticker: "TUREK", party: "D", race: "ia-sen", mint: "", status: "running", polymarketId: "630733" },
  { id: "hinson", name: "Ashley Hinson", ticker: "HINSON", party: "R", race: "ia-sen", mint: "", status: "running", polymarketId: "630734" },
  { id: "kreiss-tomkins", name: "Jonathan Kreiss-Tomkins", ticker: "JKT", party: "D", race: "ak-gov", mint: "", status: "running", polymarketId: "635016" },
  { id: "wilson", name: "Bernadette Wilson", ticker: "WILSON", party: "R", race: "ak-gov", mint: "", status: "running", polymarketId: "635012" },
  { id: "hinojosa", name: "Gina Hinojosa", ticker: "HINOJOSA", party: "D", race: "tx-gov", mint: "", status: "running", polymarketId: "629690" },
  { id: "abbott", name: "Greg Abbott", ticker: "ABBOTT", party: "R", race: "tx-gov", mint: "", status: "running", polymarketId: "629691" },
  { id: "andrews", name: "Annie Andrews", ticker: "ANDREWS", party: "D", race: "sc-sen", mint: "", status: "running", polymarketId: "630924" },
  { id: "graham", name: "Darline Graham", ticker: "GRAHAM", party: "R", race: "sc-sen", mint: "", status: "running", polymarketId: "630925" },
];

// Still in the race.
export const isAlive = (c: Candidate) => c.status !== "lost";

export function statusLabel(c: Candidate) {
  switch (c.status) {
    case "running":
      return "Running";
    case "won":
      return "Winner";
    case "lost":
      return "Lost";
  }
}

// Visual tone for status chips: alive (still in), out, or a crowned result.
export function statusTone(c: Candidate): "alive" | "out" | "gold" {
  return c.status === "lost" ? "out" : c.status === "won" ? "gold" : "alive";
}

export function initials(name: string) {
  const parts = name.replace(/[“”"]/g, "").split(/\s+/).filter((p) => /^[A-Za-z]/.test(p) && p !== "Jr.");
  return ((parts[0]?.[0] ?? "") + (parts.at(-1)?.[0] ?? "")).toUpperCase();
}
