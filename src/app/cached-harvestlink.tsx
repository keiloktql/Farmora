import { cacheLife } from "next/cache";
import CropPlanningApp from "@/components/crop-planning-app";

type View = "overview" | "demand" | "plan" | "farmers" | "guidance" | "results" | "farmer-home" | "farmer-plan" | "farmer-guidance" | "farmer-profile";

export default async function CachedHarvestLink({ initialView }: { initialView: View }) {
  "use cache";
  cacheLife("hours");

  return <CropPlanningApp initialView={initialView} />;
}
