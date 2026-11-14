import { cacheLife } from "next/cache";
import HarvestLinkApp from "@/components/harvestlink-app";

type View = "marketplace" | "network" | "forecasts" | "shipments";

export default async function CachedHarvestLink({ initialView }: { initialView: View }) {
  "use cache";
  cacheLife("hours");

  return <HarvestLinkApp initialView={initialView} />;
}
