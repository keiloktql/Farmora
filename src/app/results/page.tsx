import type { Metadata } from "next";
import ResultsPage from "@/components/pages/results";

export const metadata: Metadata = { title: "Harvest & sale results" };

export default function Page() {
  return <ResultsPage />;
}
