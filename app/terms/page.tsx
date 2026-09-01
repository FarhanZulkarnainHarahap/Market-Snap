import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { legalContent } from "@/lib/legal-content";

export const metadata: Metadata = { title: "Syarat & Ketentuan | Market Snap", alternates: { canonical: "/terms" } };
export default function Page() { return <LegalPage {...legalContent.terms} />; }
