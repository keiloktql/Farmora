import type { Metadata } from "next";
import BuyersPage from "@/components/pages/buyers";

export const metadata: Metadata = { title: "Buyers & exporters" };

export default function Page() {
  return <BuyersPage />;
}
