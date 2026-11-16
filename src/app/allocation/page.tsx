import type { Metadata } from "next";
import AllocationPage from "@/components/pages/allocation";

export const metadata: Metadata = { title: "Crop allocation" };

export default function Page() {
  return <AllocationPage />;
}
