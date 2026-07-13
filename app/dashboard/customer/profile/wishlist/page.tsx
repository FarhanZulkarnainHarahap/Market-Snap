import { AccountLayout } from "@/components/snap/AccountPages";

export default function CustomerWishlistPage() {
  return (
    <AccountLayout
      active="wishlist"
      description="Simpan produk favorit dan tambahkan ke keranjang saat stok tersedia."
      title="Wishlist."
    >
      <section className="account-panel empty-account-state">
        <h2>Wishlist belum tersedia</h2>
        <p>Produk favorit akan tampil di sini setelah fitur wishlist aktif.</p>
      </section>
    </AccountLayout>
  );
}
