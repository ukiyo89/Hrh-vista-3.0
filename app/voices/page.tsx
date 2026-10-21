import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Voices } from "@/components/site/Voices";
import { feedback } from "@/lib/data/voices";

export const metadata: Metadata = {
  title: "Voices from 2.0 — HR VISTA",
  description: feedback.length ? "In their own words: personal reflections from the people who experienced HR VISTA 2.0." : "The conversations end. The perspectives stay. A space for personal reflections from HR VISTA 2.0, with reflections coming soon.",
};

export default function VoicesPage() {
  return <><SiteHeader /><Voices /><SiteFooter /></>;
}
