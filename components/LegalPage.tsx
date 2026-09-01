import Link from "next/link";
import { legalUpdatedAt, siteConfig } from "@/lib/site-config";
import { SnapFooter, SnapHeader } from "@/components/snap/SnapCommon";

type Section = { readonly title: string; readonly paragraphs: readonly string[] };

export function LegalPage({ title, intro, sections }: { title: string; intro: string; sections: readonly Section[] }) {
  return (
    <>
      <SnapHeader simple />
      <main className="legal-page">
        <nav aria-label="Breadcrumb"><Link href="/">Beranda</Link> / <span>{title}</span></nav>
        <article>
          <span className="eyebrow">Dokumen kebijakan</span>
          <h1>{title}</h1>
          <p>{intro}</p>
          <p><strong>Terakhir diperbarui:</strong> {legalUpdatedAt}</p>
          {siteConfig.demoMode && <aside><strong>Template demo.</strong> Pemilik bisnis wajib meminta peninjauan penasihat hukum sebelum memakai dokumen ini sebagai ketentuan final.</aside>}
          {sections.map((section) => (
            <section key={section.title}>
              <h2>{section.title}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </section>
          ))}
          <section>
            <h2>Kontak</h2>
            <p>Pertanyaan mengenai kebijakan ini dapat dikirim ke <a href={`mailto:${siteConfig.supportEmail}`}>{siteConfig.supportEmail}</a>.</p>
          </section>
        </article>
      </main>
      <SnapFooter />
    </>
  );
}
