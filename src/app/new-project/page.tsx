import type { Metadata } from "next";
import NewProjectPage from "@/components/pages/new-project";

export const metadata: Metadata = { title: "New project" };

export default function Page() {
  return <NewProjectPage />;
}
