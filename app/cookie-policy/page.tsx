import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { legalContent } from "@/lib/legal-content";

export const metadata: Metadata = { title: "Kebijakan Cookie | Market Snap", alternates: { canonical: "/cookie-policy" } };
export default function Page() { return <LegalPage {...legalContent.cookie} />; }
