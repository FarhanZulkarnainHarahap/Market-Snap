import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { legalContent } from "@/lib/legal-content";

export const metadata: Metadata = { title: "Kebijakan Pembatalan | Market Snap", alternates: { canonical: "/cancellation-policy" } };
export default function Page() { return <LegalPage {...legalContent.cancellation} />; }
