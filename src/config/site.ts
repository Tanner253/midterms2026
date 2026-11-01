// Everything you'd want to edit before launch lives in this folder.
import { CANDIDATES } from "./candidates";

export const SITE = {
  name: "US Midterms 2026",
  ticker: "MIDTERMS",
  url: "https://midterms2026.fun",
  // Paste the $MIDTERMS contract address here once it's live on pump.fun.
  mainMint: "",
  totalSupply: 1_000_000_000,
  electionDay: "2026-11-03T00:00:00-05:00",
  socials: [
    { label: "X", href: "" },
    { label: "Telegram", href: "" },
    { label: "TikTok", href: "" },
    { label: "Instagram", href: "" },
  ],
  // The crank's stats, served from MongoDB by the site's own read-only route (see README).
  statsUrl: "/api/stats/",
  // Polymarket's "Balance of Power" event: the site-wide Polymarket link.
  polymarketEvent: "https://polymarket.com/event/balance-of-power-2026-midterms",
  // Polymarket's House and Senate control markets: event pages and market ids for each party's YES price.
  control: {
    house: { event: "https://polymarket.com/event/which-party-will-win-the-house-in-2026", R: "562803", D: "562802" },
    senate: { event: "https://polymarket.com/event/which-party-will-win-the-senate-in-2026", R: "562794", D: "562793" },
  },
  marketRefreshMs: 60_000,
  oddsRefreshMs: 300_000,
};

// Optional banner under the home hero (giveaways, launches). Set to null to hide.
// Internal links (starting with "/") open in the same tab.
export const ANNOUNCEMENT: { tag: string; title: string; text?: string; ctas?: { label: string; href: string }[] } | null = {
  tag: "Call the race",
  title: "Pick the House, the Senate and all 12 races.",
  text: "Build your ballot, share it, and see how it scores as the results come in.",
  ctas: [{ label: "Make your ballot →", href: "/race/?view=ballot" }],
};

// "Call the race" ballot (WC's bracket challenge). Set prize to e.g.
// { winners: 10, solEach: 0.5, rules: "..." } to run a giveaway; null shows the game without a prize.
export const BALLOT: { prize: { winners: number; solEach: number; rules: string } | null } = {
  prize: null,
};

// Voter Card (WC's Passport): a holder leaderboard built from JSON the claim process publishes.
// Leave enabled false until those files exist; the page then shows a "rolls open at launch" state.
export const VOTER_CARD = {
  enabled: false,
  rosterUrl: "/data/roster/",
};

export const pumpUrl = (mint: string) => `https://pump.fun/coin/${mint}`;

const N = CANDIDATES.length;

export const ENGINE_STEPS = [
  {
    num: "01",
    title: "Claim",
    body: `Every 15 minutes, creator fees are claimed across all ${N} candidate coins, the party coins and the main $MIDTERMS coin.`,
  },
  {
    num: "02",
    title: "Dev cut",
    body: "15% of every claim goes to the dev wallet. It comes off the top, once, and nothing else is taken.",
  },
  {
    num: "03",
    title: "Buy & Burn",
    body: "All the rest market-buys $MIDTERMS and permanently burns it, contracting circulating supply every cycle.",
  },
  {
    num: "04",
    title: "Burn holdings",
    body: "Whatever the creator wallet still holds of any project coin is burned too, so it never builds up a bag.",
  },
] as const;

export const PAIRING = {
  title: "Every candidate feeds $MIDTERMS",
  intro:
    "Candidate coins are tied to $MIDTERMS through the fee engine. Every trade on any candidate pays into the main coin.",
  points: [
    {
      title: "Constant buy pressure",
      body: "After the 15% dev cut, every candidate coin's fees market-buy $MIDTERMS every 15 minutes, no matter who is pumping.",
    },
    {
      title: "Shrinking supply",
      body: "Every $MIDTERMS the engine buys is burned. Supply only goes one way.",
    },
    {
      title: "Nothing held back",
      body: "There's no LP wallet and no marketing wallet. Everything after the dev cut goes to the burn.",
    },
    {
      title: "The whole map in one coin",
      body: "Candidates rise and fall. $MIDTERMS collects from all of them, so whoever wins, $MIDTERMS burns.",
    },
    {
      title: "News is fuel",
      body: "Polls, debates, upsets and race calls move candidate coins. More trading means more fees and more burn.",
    },
  ],
};
