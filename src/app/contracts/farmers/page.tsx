import type { Metadata } from "next";
import ContractsFarmersPage from "@/components/pages/contracts-farmers";

export const metadata: Metadata = { title: "Contracts · Farmers" };

export default function Page() {
  return <ContractsFarmersPage />;
}
