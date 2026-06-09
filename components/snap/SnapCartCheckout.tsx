import Link from "next/link";
import { FiClock, FiHome, FiLock, FiMapPin, FiMinus, FiPlus, FiShield, FiShoppingBag, FiTrash2, FiTruck, FiZap } from "react-icons/fi";
import { branches, cartItems, products, rupiah } from "@/lib/snap-data";
import { BenefitStrip, SnapFooter, SnapHeader } from "./SnapCommon";

export function SnapCartPage() {
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const total = subtotal + 10000 - 20000;

  return (
    <>
      <SnapHeader active="home" cartCount={4} />
      <main>
        <section className="snap-page-title">
          <h1>Keranjang Belanja</h1>
          <p>Review produk pilihanmu sebelum checkout. Belanja segar, cepat, dan aman.</p>
        </section>
        <section className="cart-layout">
          <div>
            <article className="cart-list">
              <header><span><FiShoppingBag /> Cabang aktif</span><h2>{branches[0].name}</h2><button type="button">Ubah cabang</button></header>
              {cartItems.map(({ product, quantity }) => (
                <div className="cart-item-row" key={product.id}>
                  <img alt={product.name} src={product.image} />
                  <div><h3>{product.name}</h3><p>{product.unit}</p><strong>Stok: {product.stock}</strong><span>{branches[0].name}</span></div>
                  <div className="qty-stepper"><button type="button"><FiMinus /></button><span>{quantity}</span><button type="button"><FiPlus /></button></div>
                  <b>{rupiah(product.price * quantity)}</b>
                  <button className="trash-button" type="button"><FiTrash2 /></button>
                </div>
              ))}
            </article>
            <article className="voucher-box">
              <div><h3>Punya kode voucher?</h3><div><input placeholder="Masukkan kode voucher" /><button type="button">Terapkan</button></div></div>
              <div><p>Voucher tersedia untukmu</p><button type="button">SNAPWELCOME<br /><small>Diskon 20%</small></button><button type="button">SNAPSHIP<br /><small>Gratis Ongkir</small></button></div>
            </article>
          </div>
          <aside className="cart-side">
            <Summary subtotal={subtotal} total={total} />
            <article className="nearest-card">
              <img alt="" src="/market-snap-favicon-transparent.png" />
              <h3>Cabang Terdekat</h3>
              <strong>{branches[0].name}</strong>
              <p>{branches[0].address}</p>
              <span> Buka {branches[0].hours}</span>
              <button type="button"><FiMapPin /> Lihat di Peta</button>
            </article>
            <article className="trust-card">
              <h3>Belanja Aman & Terpercaya</h3>
              {["100% Produk Segar", "Pembayaran Terlindungi", "Pengantaran Cepat", "Layanan 24/7"].map((item) => <p key={item}><FiShield /> {item}</p>)}
            </article>
          </aside>
        </section>
      </main>
      <BenefitStrip />
      <SnapFooter />
    </>
  );
}

function Summary({ subtotal, total }: { subtotal: number; total: number }) {
  return (
    <article className="summary-panel">
      <h2>Ringkasan Belanja</h2>
      <p><span>Subtotal (4 item)</span><strong>{rupiah(subtotal)}</strong></p>
      <p><span>Estimasi Ongkir</span><strong>Rp 10.000</strong></p>
      <p className="green"><span>Diskon Voucher</span><strong>- Rp 20.000</strong></p>
      <hr />
      <p className="total"><span>Total Pembayaran</span><strong>{rupiah(total)}</strong></p>
      <div className="eta-card"><FiClock /><span><strong>Estimasi Tiba Hari ini, 18:00 - 20:00</strong><small>Pengantaran cepat di area Kemang</small></span></div>
      <Link className="primary-snap wide" href="/checkout"><FiLock /> Checkout Sekarang</Link>
    </article>
  );
}

export function SnapCheckoutPage() {
  const checkoutProducts = [products[4], products[7], products[0]];
  const subtotal = 42700;
  const total = 34400;

  return (
    <>
      <SnapHeader active="home" />
      <main>
        <section className="checkout-title-row">
          <div><h1>Checkout</h1><p>Lengkapi informasi di bawah untuk menyelesaikan pesanan Anda.</p></div>
          <div className="stepper"><span className="active">1</span><span>2</span><span>3</span><span>4</span></div>
        </section>
        <section className="checkout-page-grid">
          <div className="checkout-forms">
            <CheckoutBlock title="1. Alamat Pengiriman" action="Ubah Alamat">
              <div className="address-card"><FiHome /><div><strong>Rumah <span>Utama</span></strong><p>{branches[0].address}</p><small>Penerima Andi Pratama - 0812-3456-7890</small></div></div>
              <button className="dashed-add" type="button"><FiPlus /> Tambah alamat baru</button>
            </CheckoutBlock>
            <CheckoutBlock title="2. Jadwal Pengiriman">
              <div className="date-row">{["Hari ini Kamis 22 Mei", "Jumat 23 Mei", "Sabtu 24 Mei", "Minggu 25 Mei", "Senin 26 Mei"].map((date, index) => <button className={index === 0 ? "active" : ""} key={date} type="button">{date}</button>)}</div>
              <select><option>08:00 - 10:00</option><option>18:00 - 20:00</option></select>
            </CheckoutBlock>
            <CheckoutBlock title="3. Cabang Terdekat" action="Ubah cabang">
              <div className="branch-checkout"><img alt="" src="https://images.unsplash.com/photo-1564661066126-98f46a9780d9?auto=format&fit=crop&w=800&q=80" /><div><h3>{branches[0].name}</h3><p>{branches[0].address}</p><span>{branches[0].distance} jarak dari lokasi Anda</span></div></div>
            </CheckoutBlock>
            <CheckoutBlock title="4. Opsi Pengiriman">
              <div className="delivery-row"><button className="active" type="button"><FiTruck /> Pengiriman Standar<br /><strong>Rp 10.000</strong></button><button type="button"><FiZap /> Pengiriman Express<br /><strong>Rp 18.000</strong></button><button type="button"><FiHome /> Ambil di Cabang<br /><strong>GRATIS</strong></button></div>
            </CheckoutBlock>
            <CheckoutBlock title="5. Metode Pembayaran">
              <div className="payment-row"><button className="active" type="button">E-Wallet</button><button type="button">Virtual Account</button><button type="button">COD</button></div>
              <div className="voucher-success"><strong>Voucher berhasil!</strong><span>Diskon 20%</span></div>
            </CheckoutBlock>
          </div>
          <aside className="checkout-summary">
            <article className="summary-panel">
              <h2>Ringkasan Pesanan <small>3 item</small></h2>
              {checkoutProducts.map((product) => <div className="mini-order" key={product.id}><img alt={product.name} src={product.image} /><span><strong>{product.name}</strong><small>{product.unit}</small><b>{rupiah(product.price)}</b></span><small>Qty: 1</small></div>)}
              <p><span>Subtotal</span><strong>{rupiah(subtotal)}</strong></p>
              <p className="green"><span>Diskon Voucher</span><strong>- Rp 15.000</strong></p>
              <p><span>Biaya Pengiriman</span><strong>Rp 10.000</strong></p>
              <hr />
              <p className="total"><span>Total Pembayaran</span><strong>{rupiah(total)}</strong></p>
              <button className="primary-snap wide" type="button"><FiLock /> Buat pesanan</button>
            </article>
            <article className="invoice-card"><h2>Preview Invoice</h2><strong>MARKET SNAP</strong><p>#INV/2025/05/22/14321</p><hr /><p>Total <b>{rupiah(total)}</b></p></article>
          </aside>
        </section>
      </main>
      <SnapFooter />
      <BenefitStrip />
    </>
  );
}

function CheckoutBlock({ title, action, children }: { title: string; action?: string; children: React.ReactNode }) {
  return <article className="checkout-block"><header><h2>{title}</h2>{action && <button type="button">{action}</button>}</header>{children}</article>;
}
