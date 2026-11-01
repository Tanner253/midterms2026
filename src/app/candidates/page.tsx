import type { Metadata } from "next";
import { share } from "@/lib/og";
import CandidatesView from "@/components/CandidatesView";
import { SITE } from "@/config/site";

const description = "Every midterm candidate coin, ranked: market cap, 24h moves, volume and live Polymarket race odds.";

export const metadata: Metadata = {
  title: "The Candidates",
  description,
  ...share(`The Candidates | ${SITE.name}`, description),
};

export default function CandidatesPage() {
  return <CandidatesView />;
}
