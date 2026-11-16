import type { Metadata } from "next";
import ProgressPage from "@/components/pages/progress";

export const metadata: Metadata = { title: "Progress" };

export default function Page() {
  return <ProgressPage />;
}
