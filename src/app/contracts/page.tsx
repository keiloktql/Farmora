import type { Metadata } from "next";
import ContractsPage from "@/components/pages/contracts";

export const metadata: Metadata = { title: "Contracts" };

export default function Page() {
  return <ContractsPage />;
}
