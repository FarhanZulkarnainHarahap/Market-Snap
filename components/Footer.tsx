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
        <p>Multiple Branches, Scheduled Offers, Store Admin</p>
      </div>
      <div className="footer-links">
        <a href="#products">Product</a>
        <a href="/dashboard/customer/profile">Address</a>
        <a href="/dashboard/admin">Admin</a>
      </div>
      <div className="footer-bottom">Copyright | The Market Snap | Developed by FARNAJO</div>
    </footer>
  );
}
