import type { Metadata } from "next";
import BuyersPage from "@/components/pages/buyers";

export const metadata: Metadata = { title: "Buyers" };

export default function Page() {
  return <BuyersPage />;
}
