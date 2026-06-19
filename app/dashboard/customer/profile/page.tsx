import { SnapHeader } from "@/components/snap/SnapCommon";

export default function ProfilePage() {
  return (
    <>
      <SnapHeader active="home" />
      <main className="dashboard-shell">
        <section className="page-heading">
          <span className="mini-label">Profil & alamat</span>
          <h1>Kelola alamat pengiriman</h1>
          <p>Alamat utama menentukan cabang terdekat dan opsi ongkir saat checkout.</p>
        </section>
        <section className="two-column">
          <form className="form-card">
            <h2>Data personal</h2>
            <label>Nama<input placeholder="Nama lengkap" /></label>
            <label>Email<input placeholder="nama@email.com" type="email" /></label>
            <label>Foto profil<input accept=".jpg,.jpeg,.png,.gif" type="file" /></label>
            <button className="primary-button" type="submit">Simpan profil</button>
          </form>
          <div className="list-card">
            <h2>Alamat tersimpan</h2>
            <p className="muted-copy">Belum ada alamat tersimpan.</p>
            <button className="secondary-button">Tambah alamat</button>
          </div>
        </section>
      </main>
    </>
  );
}
