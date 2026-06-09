import Link from "next/link";
import { FiChevronRight, FiSearch, FiSliders } from "react-icons/fi";
import { branches, products } from "@/lib/snap-data";
import { GroceryVisual, ProductCard, SnapFooter, SnapHeader, BenefitStrip } from "./SnapCommon";

export function SnapHomePage() {
  return (
    <>
      <SnapHeader active="home" cartCount={4} />
      <main>
        <section className="home-hero">
          <div>
            <span className="eyebrow">Fresh from nearest branch</span>
            <h1>Belanja segar dari cabang yang paling dekat.</h1>
            <p>Market Snap menampilkan stok aktual dari toko terdekat supaya belanja harian lebih cepat, transparan, dan praktis.</p>
            <div className="hero-buttons">
              <Link className="primary-snap" href="/catalog">Mulai belanja <FiChevronRight /></Link>
              <Link className="secondary-snap" href="/about">Tentang kami</Link>
            </div>
          </div>
          <GroceryVisual />
        </section>
        <section className="snap-section">
          <div className="snap-section-title inline">
            <div>
              <span className="eyebrow">Produk pilihan</span>
              <h2>Stok segar di Market Snap Kemang</h2>
            </div>
            <Link href="/catalog">Lihat catalog <FiChevronRight /></Link>
          </div>
          <div className="snap-product-grid">
            {products.slice(0, 8).map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </section>
      </main>
      <BenefitStrip />
      <SnapFooter />
    </>
  );
}

export function SnapCatalogPage({ initialSearch = "" }: { initialSearch?: string }) {
  const categories = ["Semua Produk", "Promo", "Stok Tersedia", "Diskon"];

  return (
    <>
      <SnapHeader active="catalog" />
      <main>
        <section className="catalog-hero">
          <div>
            <h1>Fresh Catalog</h1>
            <p>Belanja grocery dari cabang terdekat</p>
          </div>
          <GroceryVisual compact />
        </section>
        <section className="catalog-search-card" aria-label="Filter katalog">
          <label className="search-box">
            <input defaultValue={initialSearch} placeholder="Cari produk segar, sehat, dan berkualitas..." />
            <FiSearch />
          </label>
          <label>
            <small>Cabang</small>
            <select defaultValue={branches[0].id}>
              {branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
            </select>
          </label>
          <label>
            <small>Urutkan</small>
            <select defaultValue="newest">
              <option value="newest">Terbaru</option>
              <option value="price">Harga termurah</option>
              <option value="stock">Stok terbanyak</option>
            </select>
          </label>
        </section>
        <section className="catalog-layout">
          <aside className="filter-sidebar">
            <h3>Kategori</h3>
            {["Semua Produk", "Buah", "Sayur", "Dairy & Telur", "Roti & Bakery", "Minuman", "Sembako", "Kebersihan"].map((item, index) => (
              <button className={index === 0 ? "active" : ""} key={item} type="button">{item}</button>
            ))}
            <hr />
            <h3>Rentang Harga</h3>
            <div className="range-line"><span /><span /></div>
            <div className="price-pills"><span>Rp 0</span><span>Rp 100.000</span></div>
            <label className="switch-row">Stok Tersedia <input defaultChecked type="checkbox" /></label>
            <label className="switch-row">Produk Promo <input type="checkbox" /></label>
            <div className="promo-panel">
              <strong>Diskon hingga 30%</strong>
              <p>Untuk produk pilihan</p>
              <Link href="/catalog">Belanja Sekarang</Link>
            </div>
          </aside>
          <div>
            <div className="filter-chips">
              {categories.map((category, index) => <button className={index === 0 ? "active" : ""} key={category} type="button">{category}</button>)}
              <button className="clear-filter" type="button"><FiSliders /> Hapus filter</button>
            </div>
            <div className="snap-product-grid">
              {products.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
            <div className="pagination-row">
              <span>Menampilkan 1-12 dari 126 produk</span>
              <div><button type="button">1</button><button type="button">2</button><button type="button">3</button><button type="button">...</button></div>
              <select defaultValue="12"><option value="12">12 / halaman</option></select>
            </div>
          </div>
        </section>
      </main>
      <BenefitStrip />
      <SnapFooter />
    </>
  );
}
