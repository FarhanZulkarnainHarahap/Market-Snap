import { vouchers } from "../lib/market-data";

export function PromoSection() {
  return (
    <section className="content-section">
      <div className="section-heading">
        <span className="mini-label">Promo & voucher</span>
        <h2>Promo pilihan untuk belanja lebih hemat</h2>
      </div>
      <div className="promo-grid">
        {vouchers.map((voucher) => (
          <article className="promo-card" key={voucher.code}>
            <span>{voucher.code}</span>
            <h3>{voucher.title}</h3>
            <p>{voucher.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
