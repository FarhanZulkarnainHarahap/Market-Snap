import { orderStatuses, stores } from "../lib/market-data";

export function AdminPreview() {
  return (
    <section className="admin-band">
      <div className="section-heading">
        <span className="mini-label">Admin dashboard</span>
        <h2>Operasional toko, stok, diskon, dan order dalam satu tempat</h2>
      </div>
      <div className="admin-grid">
        <Panel title="Cabang">
          {stores.map((store) => <Row key={store.id} label={store.name} value={store.area} />)}
        </Panel>
        <Panel title="Status order">
          {orderStatuses.slice(0, 5).map((status, index) => <Row key={status} label={status} value={`${index + 2} order`} />)}
        </Panel>
        <Panel title="Laporan bulan ini">
          <Row label="Penjualan" value="Rp 42,8 jt" />
          <Row label="Penambahan stok" value="1.240 item" />
          <Row label="Pengurangan stok" value="918 item" />
        </Panel>
      </div>
    </section>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="admin-panel">
      <h3>{title}</h3>
      <div>{children}</div>
    </article>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="admin-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
