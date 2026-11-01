import type { Metadata } from "next";
import { share } from "@/lib/og";
import RaceView from "@/components/RaceView";
import { SITE } from "@/config/site";

const description = "The road to the 120th Congress: every race head to head, the calendar, and your ballot for the House, the Senate and all 12 races.";

export const metadata: Metadata = {
  title: "The Race",
  description,
  ...share(`The Race | ${SITE.name}`, description),
};

export default function RacePage() {
  return <RaceView />;
}
