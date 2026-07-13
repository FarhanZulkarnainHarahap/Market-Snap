import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer">
      <div>
        <strong>Welcome</strong>
        <p>Kami berkomitmen memberikan pengalaman belanja yang menyenangkan dengan produk berkualitas dari cabang terdekat.</p>
      </div>
      <div>
        <strong>Connect With Us</strong>
        <p>Facebook, Instagram, Twitter, Whatsapp</p>
      </div>
      <div>
        <strong>Useful Link</strong>
        <p>Cabang terdekat, promo pilihan, dan pengiriman praktis.</p>
      </div>
      <div className="footer-links">
        <Link href="/dashboard/customer">Home</Link>
        <Link href="/dashboard/customer/catalog">Catalog</Link>
        <Link href="/dashboard/customer/about">About</Link>
        <Link href="/dashboard/customer/contact">Contact</Link>
      </div>
      <div className="footer-bottom">Copyright | The Market Snap | Developed by FARNAJO</div>
    </footer>
  );
}
