import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { legalContent } from "@/lib/legal-content";

export const metadata: Metadata = { title: "Kebijakan Privasi | Market Snap", alternates: { canonical: "/privacy" } };
export default function Page() { return <LegalPage {...legalContent.privacy} />; }
