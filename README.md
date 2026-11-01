# US Midterms 2026 ($MIDTERMS)

The World Cup on Pump format, remade for the 2026 US midterms: one pump.fun coin per candidate in the 12 biggest statewide races, plus three party coins, all feeding the main $MIDTERMS coin.

Live: https://midterms2026.fun

## Pages

| Page | What's on it |
| --- | --- |
| `/` | Splash gate, scoreboard (next big day, next burn, candidates remaining, up next), burned / market cap / Election Day blocks, buy band, ticker, Race to 218 and Race to 51 bars, 4-step fee engine, how candidates feed $MIDTERMS, top gainer & loser, frontrunner table ranked by market cap |
| `/midterms/` | Burn cam, contract address, market cap / volume / price / liquidity / holders / % burnt, chart, fee-engine totals |
| `/candidates/` | Ranked board (position, movement, race odds, market cap, 24h, volume, holders), photo cards, the Parties section |
| `/race/` | Head-to-head race cards grouped by Senate and Governor, race calendar, "Call the race" ballot with share links |
| `/voters/` | Voter Card: holder leaderboard with 5 tiers, 8 badges, wallet lookup |
| `/credits/` | Photo credits |

## Data sources

| What | Where it comes from |
| --- | --- |
| Coin price, market cap, volume, 24h change | DexScreener public API, in the browser, every 60s. Jupiter fills in coins DexScreener misses. |
| Race odds | Each race's Polymarket event (gamma `/markets/keyset`), every 5 min. Open and closed markets are both read, because keyset leaves closed ones out by default. |
| Race to 218, Race to 51, chyron | Polymarket's House and Senate control markets, ids in `SITE.control` |
| Burned total | Read from the chain by `/api/stats` |
| SOL claimed, dev cut, cycle times, holder counts, burn log | MongoDB, written every 15 minutes by the crank (private repo `midterms2026-crank`), served by this site's read-only `/api/stats` route |
| Voter Card | `board-meta.json` + `board-{n}.json`, written by your internal claim process |

Odds are never used to rank coins. Each one is for a different race, so a 98% favourite in a safe seat isn't ahead of a 60% favourite elsewhere. Boards rank by market cap.

## Launch checklist

The launch guide is `LAUNCH.md` in the crank repo. The site's part:

1. **Main coin:** paste the $MIDTERMS contract address into `mainMint` in `src/config/site.ts` and redeploy.
2. **Candidate and party coins:** nothing to do. The crank finds every coin the creator wallet launched and the site matches them by name, then ticker. Until a coin is found, its card says "Soon". An address typed into `candidates.ts` or `parties.ts` wins over the match.
3. **Socials:** fill in `socials` in `src/config/site.ts`; empty links stay hidden.
4. **Giveaway (optional):** set `BALLOT.prize` in `src/config/site.ts`, and edit or remove the home `ANNOUNCEMENT` band there too.
5. **Database:** add `MONGODB_URI` (a read-only user) to the Vercel project's Production environment variables.
6. **Deploy:** `vercel deploy --prod --yes`. Never set `NEXT_PUBLIC_DEMO` in production.

## Fee-engine stats (MongoDB)

The crank saves this as one document (`_id: "current"`) in the `stats` collection of the `midterms2026` database after every cycle. `/api/stats/` returns it, cached for 30 seconds at Vercel's edge:

```json
{
  "totalBurned": 0,
  "totalSolRouted": 0,
  "solToBurn": 0,
  "solToDev": 0,
  "cycles": 0,
  "lastCycleAt": null,
  "nextCycleAt": null,
  "cycleIntervalMs": 900000,
  "capturedAt": null,
  "holders": {
    "<mint>": { "count": 1049, "change24h": -30 }
  }
}
```

- `totalBurned` is in $MIDTERMS tokens; the SOL fields are in SOL; times are ISO strings.
- `holders` is optional. When it's present, holder counts appear on the $MIDTERMS page, the candidates board and the coin cards.
- Until `nextCycleAt` is set, the site shows "Burns start at launch" instead of a countdown.

## Voter Card files

The schema is documented at the top of `src/config/voters.ts`. In short:

- `board-meta.json`: `{ "totalEntries": 9966, "pageCount": 200, "pageSize": 50 }`
- `board-{n}.json`: `{ "entries": [{ "rank": 1, "owner": "<wallet>", "band": "ELECTOR", "badges": ["REGISTERED"] }], "resolvedResultBadges": [] }`

Host them at `VOTER_CARD.rosterUrl`, then set `VOTER_CARD.enabled: true` in `src/config/site.ts`. Until then, the page shows the "rolls open at launch" state plus the tiers and badges explainer.

## Election night

- **A race is called:** set the winner's `status` to `"won"` and the other candidate's to `"lost"` in `src/config/candidates.ts`. The race card shows the winner, and ballots score themselves.
- **Control is called:** set `house` or `senate` in `CONTROL` in `src/config/race.ts` to `"R"` or `"D"`. The bars lock to the result and ballots score those calls.
- **The night moves on:** set `CURRENT_STAGE` in `src/config/race.ts`.
- **Calendar:** edit `EVENTS` in `src/config/race.ts`, and set `result` once an event is decided.
- **New candidate:** add a line to `CANDIDATES`, a photo to `public/candidates/<id>.jpg` and a credit to `src/config/photos.ts`. Market ids are listed at `https://gamma-api.polymarket.com/events?slug=<race event slug>`.

Redeploy with `vercel deploy --prod --yes` after any change.

## Brand

`brand/` holds the scripts that draw the logo, X banner, share card, icons and X post graphic. See `brand/README.md`.

## Local development

```bash
npm install
npm run dev
```

`npm run dev` shows fake market numbers and a demo voter roll (set in `.env.development`) so you can check layouts before launch. Production builds always show real data.
