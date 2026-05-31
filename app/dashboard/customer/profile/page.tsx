import { Header } from "../../../../components/Header";

const addresses = [
  "Jl. Kemang Raya No. 12, Jakarta Selatan",
  "Green Office Park BSD, Tangerang Selatan"
];

export default function ProfilePage() {
  return (
    <>
      <Header active="profile" mode="customer" />
      <main className="dashboard-shell">
        <section className="page-heading">
          <span className="mini-label">Profil & alamat</span>
          <h1>Kelola alamat pengiriman</h1>
          <p>Alamat utama menentukan cabang terdekat dan opsi ongkir saat checkout.</p>
        </section>
        <section className="two-column">
          <form className="form-card">
            <h2>Data personal</h2>
            <label>Nama<input defaultValue="Naya Customer" /></label>
            <label>Email<input defaultValue="naya@marketsnap.test" /></label>
            <label>Foto profil<input accept=".jpg,.jpeg,.png,.gif" type="file" /></label>
            <button className="primary-button" type="submit">Simpan profil</button>
          </form>
          <div className="list-card">
            <h2>Alamat tersimpan</h2>
            {addresses.map((address, index) => (
              <article className="address-row" key={address}>
                <div>
                  <strong>{index === 0 ? "Utama" : "Alamat lain"}</strong>
                  <p>{address}</p>
                </div>
                <button>Ubah</button>
              </article>
            ))}
            <button className="secondary-button">Tambah alamat</button>
          </div>
        </section>
      </main>
    </>
  );
}
