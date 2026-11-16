import type { Metadata } from "next";
import WhatsAppPage from "@/components/pages/whatsapp";

export const metadata: Metadata = { title: "WhatsApp" };

export default function Page() {
  return <WhatsAppPage />;
}
