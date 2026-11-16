import type { Metadata } from "next";
import FarmerDatabasePage from "@/components/pages/farmer-database";

export const metadata: Metadata = { title: "Farmer database" };

export default function Page() {
  return <FarmerDatabasePage />;
}
