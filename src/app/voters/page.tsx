import type { Metadata } from "next";
import { share } from "@/lib/og";
import VoterCard from "@/components/VoterCard";
import { SITE } from "@/config/site";

const description = "The 2026 Voter Card: every wallet on the rolls, ranked. Earlier and steadier ranks higher.";

export const metadata: Metadata = {
  title: "Voter Card",
  description,
  ...share(`2026 Voter Card | ${SITE.name}`, description),
};

export default function VotersPage() {
  return <VoterCard />;
}
