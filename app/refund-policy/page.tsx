import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { legalContent } from "@/lib/legal-content";

export const metadata: Metadata = { title: "Kebijakan Refund & Retur | Market Snap", alternates: { canonical: "/refund-policy" } };
export default function Page() { return <LegalPage {...legalContent.refund} />; }
