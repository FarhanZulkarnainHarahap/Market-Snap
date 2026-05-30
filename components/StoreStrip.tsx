import type { Store } from "../lib/types";

type StoreStripProps = {
  store: Store;
  serviceable: boolean;
};

export function StoreStrip({ store, serviceable }: StoreStripProps) {
  return (
    <section className="store-strip">
      <div>
        <span className="mini-label">Cabang aktif</span>
        <h2>{store.name}</h2>
        <p>{store.area} - radius layanan {store.radiusKm} km</p>
      </div>
      <div className="store-status">
        <span className={serviceable ? "dot ok" : "dot warn"} />
        {serviceable ? "Siap melayani alamatmu" : "Pilih alamat lain untuk checkout"}
      </div>
    </section>
  );
}
