import { CANDIDATES } from "@/config/candidates";
import { CONTROL, RACES, type Chamber, type Office, type RaceId } from "@/config/race";

export const racesFor = (office: Office) => RACES.filter((r) => r.office === office);
export const raceCandidates = (id: RaceId) => CANDIDATES.filter((c) => c.race === id);
export const raceWinner = (id: RaceId) => raceCandidates(id).find((c) => c.status === "won");
export const calledRaces = () => RACES.filter((r) => raceWinner(r.id));

// ---- "Call the race" ballot

export type ControlPick = "R" | "D";
export type Ballot = { house: ControlPick | null; senate: ControlPick | null; picks: Partial<Record<RaceId, string>> };
export const EMPTY_BALLOT: Ballot = { house: null, senate: null, picks: {} };

export const ballotCandidate = (id: string | null | undefined) => (id ? CANDIDATES.find((c) => c.id === id) : undefined);

const asControl = (v: unknown): ControlPick | null => (v === "R" || v === "D" ? v : null);

// Drop picks that no longer make sense (unknown ids, or a candidate from another race).
export function cleanBallot(b: Partial<Ballot> | null | undefined): Ballot {
  const picks: Ballot["picks"] = {};
  for (const r of RACES) {
    const id = b?.picks?.[r.id];
    if (ballotCandidate(id)?.race === r.id) picks[r.id] = id;
  }
  return { house: asControl(b?.house), senate: asControl(b?.senate), picks };
}

export const isComplete = (b: Ballot) => !!b.house && !!b.senate && RACES.every((r) => b.picks[r.id]);

// Share code: House and Senate letters, a dot, then one digit per race (which of its two candidates,
// "-" for no pick), e.g. "DR.010-10101010".
export function encodeBallot(b: Ballot) {
  const races = RACES.map((r) => {
    const i = raceCandidates(r.id).findIndex((c) => c.id === b.picks[r.id]);
    return i < 0 ? "-" : String(i);
  });
  return `${b.house ?? "-"}${b.senate ?? "-"}.${races.join("")}`;
}

export function decodeBallot(code: string | null): Ballot | null {
  if (!code) return null;
  const [control = "", races = ""] = code.split(".");
  const picks: Ballot["picks"] = {};
  RACES.forEach((r, i) => {
    const c = raceCandidates(r.id)[Number(races[i])];
    if (c) picks[r.id] = c.id;
  });
  const b = cleanBallot({ house: asControl(control[0]), senate: asControl(control[1]), picks });
  return b.house || b.senate || Object.keys(b.picks).length ? b : null;
}

// Picks scored only where reality has decided: right / decided.
export function scoreBallot(b: Ballot) {
  const called = RACES.flatMap((r) => {
    const w = raceWinner(r.id);
    return w ? [{ race: r.id, id: w.id }] : [];
  });
  const chambers = (["house", "senate"] as Chamber[]).filter((k) => CONTROL[k]);
  return {
    decided: called.length + chambers.length,
    right: called.filter((c) => b.picks[c.race] === c.id).length + chambers.filter((k) => b[k] === CONTROL[k]).length,
  };
}
