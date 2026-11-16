import type { Metadata } from "next";
import RecommendationsPage from "@/components/pages/recommendations";

export const metadata: Metadata = { title: "Recommended farmers" };

export default function Page() {
  return <RecommendationsPage />;
}
