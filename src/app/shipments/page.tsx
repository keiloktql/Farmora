import type { Metadata } from "next";
import ShipmentsPage from "@/components/pages/shipments";

export const metadata: Metadata = { title: "Shipment tracking" };

export default function Page() {
  return <ShipmentsPage />;
}
