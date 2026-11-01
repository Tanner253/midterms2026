import type { Party } from "./candidates";

export const STAGES = [
  { id: "stretch", label: "Final Stretch", short: "Stretch", when: "Now–Nov 2", blurb: "Last polls, last ads, last trades before the vote." },
  { id: "election", label: "Election Day", short: "Nov 3", when: "Nov 3, 2026", blurb: "435 House seats, 35 Senate seats and 36 governors on the ballot." },
  { id: "calls", label: "Calls and Runoffs", short: "Calls", when: "Nov–Dec 2026", blurb: "Races get called, close ones get counted, and Georgia votes again Dec 1 if it has to." },
  { id: "congress", label: "New Congress", short: "Jan 3", when: "Jan 3, 2027", blurb: "The 120th Congress is sworn in." },
] as const;

export type StageId = (typeof STAGES)[number]["id"];

// Move this forward as election night goes on.
export const CURRENT_STAGE: StageId = "stretch";

export const stageIndex = (id: StageId) => STAGES.findIndex((s) => s.id === id);
export const stageLabel = (id: StageId) => STAGES[stageIndex(id)].label;

// The 12 statewide races on the board, biggest Polymarket volume first. `event` is the race's
// Polymarket event slug.
export const RACES = [
  { id: "ca-gov", label: "California Governor", short: "CA Gov", office: "Governor", event: "california-governor-election-2026" },
  { id: "tx-sen", label: "Texas Senate", short: "TX Sen", office: "Senate", event: "texas-senate-election-winner" },
  { id: "mi-sen", label: "Michigan Senate", short: "MI Sen", office: "Senate", event: "michigan-senate-election-winner" },
  { id: "me-sen", label: "Maine Senate", short: "ME Sen", office: "Senate", event: "maine-senate-election-winner" },
  { id: "oh-sen", label: "Ohio Senate", short: "OH Sen", office: "Senate", event: "ohio-senate-election-winner" },
  { id: "ak-sen", label: "Alaska Senate", short: "AK Sen", office: "Senate", event: "alaska-senate-election-winner" },
  { id: "ne-sen", label: "Nebraska Senate", short: "NE Sen", office: "Senate", event: "nebraska-senate-election-winner" },
  { id: "ks-sen", label: "Kansas Senate", short: "KS Sen", office: "Senate", event: "kansas-senate-election-winner" },
  { id: "ia-sen", label: "Iowa Senate", short: "IA Sen", office: "Senate", event: "iowa-senate-election-winner" },
  { id: "ak-gov", label: "Alaska Governor", short: "AK Gov", office: "Governor", event: "alaska-governor-election-winner" },
  { id: "tx-gov", label: "Texas Governor", short: "TX Gov", office: "Governor", event: "texas-governor-winner-2026" },
  { id: "sc-sen", label: "South Carolina Senate", short: "SC Sen", office: "Senate", event: "south-carolina-senate-election-winner" },
] as const;

export type Race = (typeof RACES)[number];
export type RaceId = Race["id"];
export type Office = Race["office"];

export const raceById = (id: RaceId): Race => RACES.find((r) => r.id === id)!;
export const raceUrl = (id: RaceId) => `https://polymarket.com/event/${raceById(id).event}`;

export type Chamber = "house" | "senate";

// Set each to "R" or "D" once control is called. Ballots score themselves from it.
export const CONTROL: Record<Chamber, "R" | "D" | null> = { house: null, senate: null };

// The race calendar (WC's fixtures). Add dates as they're announced and fill in
// `result` once an event is decided. Events without a date show as "TBD".
export type RaceEvent = {
  id: string;
  title: string;
  stage: StageId;
  // ISO date (YYYY-MM-DD) or null when not announced yet.
  date: string | null;
  // Shown when date is null.
  when?: string;
  place: string;
  party?: Party;
  // e.g. "No runoff needed". Presence marks the event as decided.
  result?: string;
};

export const EVENTS: RaceEvent[] = [
  { id: "election-day", title: "Election Day", stage: "election", date: "2026-11-03", place: "Nationwide" },
  { id: "georgia-runoff", title: "Georgia runoff, if needed", stage: "calls", date: "2026-12-01", place: "Georgia" },
  { id: "new-congress", title: "120th Congress sworn in", stage: "congress", date: "2027-01-03", place: "Washington, D.C." },
];

// Events count as upcoming until the end of their day (US Eastern, roughly).
const endOfDay = (date: string) => Date.parse(`${date}T23:59:59-05:00`);

export const upcomingEvents = (now: number) =>
  EVENTS.filter((e) => !e.result && (e.date === null || endOfDay(e.date) >= now)).sort(
    (a, b) => (a.date ? Date.parse(a.date) : Infinity) - (b.date ? Date.parse(b.date) : Infinity),
  );

export const pastEvents = (now: number) =>
  EVENTS.filter((e) => e.result || (e.date !== null && endOfDay(e.date) < now)).sort(
    (a, b) => (b.date ? Date.parse(b.date) : 0) - (a.date ? Date.parse(a.date) : 0),
  );

// Next dated event, for countdowns.
export const nextDatedEvent = (now: number) => upcomingEvents(now).find((e) => e.date);
