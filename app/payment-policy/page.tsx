import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { legalContent } from "@/lib/legal-content";

export const metadata: Metadata = { title: "Kebijakan Pembayaran | Market Snap", alternates: { canonical: "/payment-policy" } };
export default function Page() { return <LegalPage {...legalContent.payment} />; }
