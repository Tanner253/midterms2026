import { CANDIDATES } from "@/config/candidates";
import { PARTY_COINS, partyKey } from "@/config/parties";
import { SITE } from "@/config/site";

// Contract addresses come from the crank: it finds every coin the dev wallet launched and publishes
// the list with its stats (see /api/stats). Addresses typed into the config still win.

export type LaunchedCoin = { mint: string; symbol: string; name: string; image: string | null; main: boolean };

export type Mints = {
  main: string;
  // Candidate id (or partyKey) → contract address.
  byId: Record<string, string>;
  // Candidate id → the launched coin's own ticker (shown instead of the config's).
  symbols: Record<string, string>;
  // At least one coin is live.
  any: boolean;
};

const norm = (s: string) => s.replace(/[^a-z0-9]/gi, "").toUpperCase();

const longest = (hits: { id: string; len: number }[]) => hits.sort((a, b) => b.len - a.len)[0]?.id ?? null;

// Which candidate a launched coin is: the candidate's full name inside the coin's name first (tickers
// get reused), else its ticker ($PAXTON), else the candidate's ticker inside the coin's ticker
// ($KENPAXTON). Longest match wins.
export function candidateFor(coin: Pick<LaunchedCoin, "symbol" | "name">): string | null {
  const t = norm(coin.symbol);
  const n = norm(coin.name);
  const byName = longest(CANDIDATES.filter((c) => n && n.includes(norm(c.name))).map((c) => ({ id: c.id, len: norm(c.name).length })));
  if (byName) return byName;
  const exact = CANDIDATES.find((c) => norm(c.ticker) === t);
  if (exact) return exact.id;
  return longest(CANDIDATES.filter((c) => t && t.includes(norm(c.ticker))).map((c) => ({ id: c.id, len: c.ticker.length })));
}

// Which party coin a launched coin is, by its name or ticker.
function partyFor(coin: Pick<LaunchedCoin, "symbol" | "name">) {
  const t = norm(coin.symbol);
  const n = norm(coin.name);
  return PARTY_COINS.find((p) => (n && n === norm(p.name)) || (t && t === norm(p.ticker))) ?? null;
}

// `coins` come oldest first; if a candidate was launched twice the first coin wins (relaunches had
// less traction). Addresses typed into the config win over both.
export function resolveMints(coins: LaunchedCoin[]): Mints {
  let main = "";
  const byId: Record<string, string> = {};
  const symbols: Record<string, string> = {};
  const symbolOf: Record<string, string> = {};
  for (const c of coins) {
    symbolOf[c.mint] = c.symbol.replace(/^\$/, "").toUpperCase();
    if (c.main) main ||= c.mint;
    else {
      const party = partyFor(c);
      const id = party ? partyKey(party.id) : candidateFor(c);
      if (id && !byId[id]) byId[id] = c.mint;
    }
  }
  if (SITE.mainMint) main = SITE.mainMint;
  for (const c of CANDIDATES) if (c.mint) byId[c.id] = c.mint;
  for (const p of PARTY_COINS) if (p.mint) byId[partyKey(p.id)] = p.mint;
  for (const [id, mint] of Object.entries(byId)) if (symbolOf[mint]) symbols[id] = symbolOf[mint];
  return { main, byId, symbols, any: Boolean(main) || Object.keys(byId).length > 0 };
}

// Just the addresses typed into the config (before the crank's list loads).
export const CONFIG_MINTS = resolveMints([]);
