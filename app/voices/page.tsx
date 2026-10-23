import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Voices } from "@/components/site/Voices";

export const metadata: Metadata = {
  title: "Past voices — HR VISTA",
  description: "Meet the leaders and practitioners behind HR VISTA: speaker biographies and photographs from past conversations.",
};

export default function VoicesPage() {
  return <><SiteHeader /><Voices /><SiteFooter /></>;
}
