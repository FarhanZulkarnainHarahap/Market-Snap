import Link from "next/link";
import { FiChevronLeft, FiChevronRight, FiHeart, FiMapPin, FiMinus, FiPlus, FiShoppingCart, FiStar } from "react-icons/fi";
import { branches, products, rupiah } from "@/lib/snap-data";
import { BenefitStrip, FeatureList, RelatedProducts, SnapFooter, SnapHeader } from "./SnapCommon";

export function SnapProductPage({ productId }: { productId: string }) {
  const product = products.find((item) => item.id === productId) ?? products[0];
  const branch = branches[0];

  return (
    <>
      <SnapHeader active="home" />
      <main>
        <nav className="breadcrumb"><Link href="/">Beranda</Link><FiChevronRight /> <Link href="/catalog">{product.category}</Link><FiChevronRight /> <span>{product.name}</span></nav>
        <section className="product-detail-layout">
          <div>
            <div className="product-gallery-main">
              <button type="button"><FiChevronLeft /></button>
              <img alt={product.name} src={product.image} />
              <button type="button"><FiChevronRight /></button>
              <button className="favorite-button" type="button"><FiHeart /></button>
            </div>
            <div className="thumbnail-row">
              {[product.image, "/tomato.png", "/bread.png", "/pineapple.png"].map((src, index) => <img alt="" className={index === 0 ? "active" : ""} key={src} src={src} />)}
            </div>
          </div>
          <article className="product-info-panel">
            <span className="tag-soft">{product.category} Segar</span>
            <h1>{product.name}</h1>
            <div className="rating-line"><FiStar /> <strong>{product.rating}</strong> ({product.reviews} ulasan) <span>Terjual 1.2K+</span></div>
            <p className="detail-price">{rupiah(product.price)} <small>/{product.unit}</small></p>
            <p className="muted">Pilihan terbaik dengan rasa segar, tekstur renyah, dan aroma khas. Dipetik dari kebun pilihan untuk kualitas terbaik.</p>
            <FeatureList />
            <h3>Pilih berat</h3>
            <div className="option-row"><button className="active" type="button">500 g</button><button type="button">1 kg <small>Hemat 5%</small></button><button type="button">2 kg <small>Hemat 8%</small></button></div>
            <h3>Jumlah</h3>
            <div className="qty-row"><button type="button"><FiMinus /></button><span>1</span><button type="button"><FiPlus /></button><small>Stok: {product.stock}</small></div>
            <div className="branch-card">
              <strong>Tersedia di cabang</strong>
              <h3>{branch.name} <span>Cabang aktif</span></h3>
              <p>{branch.address}</p>
              <div><span><FiMapPin /> {branch.distance}</span><span>{branch.radius} radius layanan</span><span>{branch.hours}</span></div>
            </div>
            <div className="buy-actions">
              <Link className="secondary-snap" href="/cart"><FiShoppingCart /> Tambah ke keranjang</Link>
              <Link className="primary-snap" href="/checkout">Beli sekarang</Link>
            </div>
          </article>
        </section>
        <section className="product-tabs">
          <div className="tab-head"><button className="active" type="button">Deskripsi</button><button type="button">Nutrisi</button><button type="button">Ulasan ({product.reviews})</button><button type="button">Pengiriman & Retur</button></div>
          <div className="tab-grid">
            <div>
              <p>{product.name} merupakan pilihan berkualitas tinggi untuk kebutuhan harian. Cocok dinikmati langsung, dijadikan salad, atau jus segar untuk keluarga.</p>
              <ul><li>Dipetik dengan standar kualitas premium</li><li>Kaya serat dan vitamin</li><li>Cocok untuk camilan sehat sehari-hari</li></ul>
            </div>
            <div className="nutrition-card"><h3>Nutrisi (per 100 g)</h3><p>Energi <strong>52 kkal</strong></p><p>Karbohidrat <strong>13.8 g</strong></p><p>Serat <strong>2.4 g</strong></p><p>Vitamin C <strong>4.6 mg</strong></p></div>
            <div className="review-card"><h3>Ulasan Pelanggan</h3><strong>4.8 <small>/5</small></strong><p>5 bintang dari pelanggan</p><button type="button">Lihat semua ulasan</button></div>
          </div>
        </section>
        <RelatedProducts />
      </main>
      <BenefitStrip />
      <SnapFooter />
    </>
  );
}
