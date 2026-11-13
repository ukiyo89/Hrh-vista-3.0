import type { Metadata } from "next";
import { Sponsors } from "@/components/site/Sponsors";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const metadata: Metadata = {
  title: "Partners & Sponsors — HR VISTA 3.0",
  description:
    "Explore HR VISTA 3.0 community partners BeingHR & Being Networks alongside CHRIST University Lavasa (CPCG) and corporate partnership showcases.",
};

export default function PartnersPage() {
  return (
    <>
      <SiteHeader />
      <Sponsors />
      <SiteFooter />
    </>
  );
}
