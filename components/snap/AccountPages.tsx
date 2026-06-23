"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  FiBell,
  FiCamera,
  FiCheck,
  FiChevronRight,
  FiEdit2,
  FiHeadphones,
  FiHome,
  FiLock,
  FiMail,
  FiMapPin,
  FiPackage,
  FiPlus,
  FiShield,
  FiTag,
  FiUser,
  FiX
} from "react-icons/fi";
import { SnapHeader } from "@/components/snap/SnapCommon";
import { createAddress, fetchAddresses, fetchCurrentUser, fetchOrders, fetchVouchers, requestEmailVerification, requestPasswordReset, updateAddress, updateCurrentUser, uploadProfileAvatar } from "@/lib/api";
import { rupiah } from "@/lib/format";
import type { Address, OrderSummary, Voucher } from "@/lib/types";
import type { ApiUser } from "@/lib/api-contracts";

type AccountSection = "profile" | "address" | "orders" | "notifications" | "vouchers" | "security" | "help";

type ProfileForm = {
  email: string;
  name: string;
  phone: string;
};

type AddressForm = {
  detail: string;
  isPrimary: boolean;
  label: string;
  lat: string;
  lng: string;
};

const accountMenus: Array<{ key: AccountSection; href: string; label: string; text: string; icon: typeof FiUser }> = [
  { key: "profile", href: "/account/profile", label: "Profile", text: "Data personal", icon: FiUser },
  { key: "address", href: "/account/address", label: "Address", text: "Alamat pengiriman", icon: FiMapPin },
  { key: "orders", href: "/account/orders", label: "My Orders", text: "Riwayat belanja", icon: FiPackage },
  { key: "notifications", href: "/account/notifications", label: "Notifications", text: "Update pesanan", icon: FiBell },
  { key: "vouchers", href: "/account/vouchers", label: "Vouchers", text: "Promo tersimpan", icon: FiTag },
  { key: "security", href: "/account/security", label: "Security", text: "Password & akses", icon: FiLock },
  { key: "help", href: "/account/help-center", label: "Help Center", text: "Bantuan pelanggan", icon: FiHeadphones }
];

export function AccountLayout({ active, children, title, description }: { active: AccountSection; children: React.ReactNode; title: string; description: string }) {
  const headerActive = active === "orders" ? "orders" : active === "notifications" ? "notifications" : "profile";
  const { loading, user } = useAccountUser();

  return (
    <>
      <SnapHeader active={headerActive} />
      <main className="account-page">
        <section className="account-hero">
          <div>
            <span className="eyebrow">My Account</span>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          <div className="account-summary">
            <span><FiShield /> Akun aktif</span>
            {loading ? <span className="skeleton-line short" /> : <strong>{user?.name ?? "Customer"}</strong>}
            {loading ? <span className="skeleton-line medium" /> : <small>{user?.role ? roleLabel(user.role) : "Customer Market Snap"}</small>}
          </div>
        </section>

        <section className="account-layout">
          <aside className="account-sidebar" aria-label="Menu akun">
            <UserCard loading={loading} user={user} />
            <nav>
              {accountMenus.map(({ key, href, label, text, icon: Icon }) => (
                <Link className={active === key ? "active" : ""} href={href} key={key}>
                  <Icon />
                  <span><strong>{label}</strong><small>{text}</small></span>
                  <FiChevronRight />
                </Link>
              ))}
            </nav>
          </aside>

          <div className="account-content">{children}</div>
        </section>
      </main>
    </>
  );
}

export function ProfileAccountContent() {
  const { loading, reloadUser, user } = useAccountUser();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [verifyEmail, setVerifyEmail] = useState("");
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [verifySubmitting, setVerifySubmitting] = useState(false);
  const [form, setForm] = useState<ProfileForm>({ email: "", name: "", phone: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchAddresses().then(setAddresses).catch(() => setAddresses([]));
    fetchOrders().then(setOrders).catch(() => setOrders([]));
  }, []);

  function toggleEdit() {
    if (!editing) {
      setForm({ email: user?.email ?? "", name: user?.name ?? "", phone: user?.phone ?? "" });
      setMessage("");
    }
    setEditing((current) => !current);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    try {
      await updateCurrentUser({
        email: form.email.trim(),
        name: form.name.trim(),
        phone: form.phone.trim() || undefined
      });
      await reloadUser();
      setEditing(false);
      setMessage("Profil berhasil diperbarui.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Profil belum dapat disimpan.");
    }
  }

  function openVerificationModal() {
    setVerifyEmail(user?.email ?? "");
    setMessage("");
    setVerifyModalOpen(true);
  }

  async function submitVerification(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setVerifySubmitting(true);
    setMessage("");
    try {
      const response = await requestEmailVerification(verifyEmail.trim());
      setMessage(response.message);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Link verifikasi belum dapat dikirim.");
    } finally {
      setVerifySubmitting(false);
    }
  }

  async function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setMessage("");
    try {
      await uploadProfileAvatar(file);
      await reloadUser();
      setMessage("Foto profil berhasil diperbarui.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Foto profil belum dapat diperbarui.");
    }
  }

  const primaryAddress = addresses.find((address) => address.isPrimary) ?? addresses[0];
  const recentOrders = orders.slice(0, 3);
  const profileForm = editing ? form : { email: user?.email ?? "", name: user?.name ?? "", phone: user?.phone ?? "" };

  return (
    <>
      <section className="account-panel profile-panel">
        <div className="account-section-title">
          <div>
            <span className="eyebrow">Profile</span>
            <h2>Data personal</h2>
          </div>
          <button onClick={toggleEdit} type="button"><FiEdit2 /> {editing ? "Batal" : "Edit profil"}</button>
        </div>
        {loading ? <AccountProfileSkeleton /> : (
          <div className="profile-overview">
            <ProfileAvatar editable={Boolean(user?.canEditAvatar)} onEdit={() => fileInputRef.current?.click()} user={user} size="large" />
            <input accept="image/jpeg,image/png,image/gif" className="visually-hidden" onChange={handleAvatarChange} ref={fileInputRef} type="file" />
            <div>
              <h3>{user?.name ?? "Customer"}</h3>
              <p>{user?.email ?? "Email belum tersedia"}</p>
              <span>{memberSince(user?.createdAt)}</span>
            </div>
            <span className={user?.verified ? "verified-pill" : "verified-pill pending"}>{user?.verified ? "Terverifikasi" : "Belum terverifikasi"}</span>
          </div>
        )}
        <form className="account-form" onSubmit={submit}>
          <label>Nama lengkap<input disabled={!editing} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} value={profileForm.name} /></label>
          <label>Email<input disabled={!editing} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} type="email" value={profileForm.email} /></label>
          <label>Nomor handphone<input disabled={!editing} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} placeholder="0812-3456-7890" value={profileForm.phone} /></label>
          {editing && <button className="primary-snap" type="submit"><FiCheck /> Simpan perubahan</button>}
        </form>
        {!loading && !user?.verified && <button className="secondary-snap account-verify-button" onClick={openVerificationModal} type="button"><FiMail /> Verifikasi akun</button>}
        {message && <p className="account-message">{message}</p>}
      </section>

      <section className="account-grid">
        <QuickPanel actionHref="/account/address" action="Tambah" title="Alamat utama">
          {primaryAddress ? <SavedAddress address={primaryAddress} /> : <p className="empty-copy">Belum ada alamat tersimpan.</p>}
        </QuickPanel>
        <QuickPanel actionHref="/account/orders" action="Lihat semua" title="Pesanan terakhir">
          <OrderList orders={recentOrders} compact />
        </QuickPanel>
      </section>
      {verifyModalOpen && (
        <div className="account-modal-backdrop">
          <section aria-modal="true" className="account-modal" role="dialog">
            <button aria-label="Tutup" className="account-modal-close" onClick={() => setVerifyModalOpen(false)} type="button"><FiX /></button>
            <span className="account-modal-icon"><FiMail /></span>
            <h2>Verifikasi akun</h2>
            <p>Masukkan email akun Anda. Kami akan mengirim tautan verifikasi agar belanja bisa langsung digunakan.</p>
            <form className="account-form single" onSubmit={submitVerification}>
              <label>Email<input onChange={(event) => setVerifyEmail(event.target.value)} placeholder="nama@email.com" required type="email" value={verifyEmail} /></label>
              <button className="primary-snap" disabled={verifySubmitting} type="submit">{verifySubmitting ? "Mengirim..." : "Kirim verifikasi"}</button>
            </form>
          </section>
        </div>
      )}
    </>
  );
}

export function AddressAccountContent() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState<AddressForm>(emptyAddressForm());

  useEffect(() => {
    loadAddresses();
  }, []);

  async function loadAddresses() {
    try {
      setAddresses(await fetchAddresses());
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Alamat belum dapat dimuat.");
    }
  }

  function startCreate() {
    setEditingId(null);
    setForm(emptyAddressForm(addresses.length === 0));
    setFormOpen(true);
    setMessage("");
  }

  function startEdit(address: Address) {
    setEditingId(address.id);
    setForm({
      detail: address.detail,
      isPrimary: address.isPrimary,
      label: address.label,
      lat: String(address.lat),
      lng: String(address.lng)
    });
    setFormOpen(true);
    setMessage("");
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = {
      detail: form.detail.trim(),
      isPrimary: form.isPrimary,
      label: form.label.trim(),
      lat: Number(form.lat),
      lng: Number(form.lng)
    };
    try {
      if (editingId) await updateAddress(editingId, payload);
      else await createAddress(payload);
      setMessage(editingId ? "Alamat berhasil diperbarui." : "Alamat berhasil ditambahkan.");
      setFormOpen(false);
      setEditingId(null);
      await loadAddresses();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Alamat belum dapat disimpan.");
    }
  }

  return (
    <>
      <section className="account-panel">
        <div className="account-section-title">
          <div>
            <span className="eyebrow">Address</span>
            <h2>Alamat pengiriman</h2>
          </div>
          <button onClick={startCreate} type="button"><FiPlus /> Tambah alamat</button>
        </div>
        {addresses.length ? (
          <div className="account-grid">
            {addresses.map((address) => <SavedAddress address={address} key={address.id} onEdit={() => startEdit(address)} />)}
          </div>
        ) : (
          <p className="empty-copy">Belum ada alamat tersimpan. Tambahkan alamat untuk checkout lebih cepat.</p>
        )}
      </section>
      {formOpen && (
        <QuickPanel title={editingId ? "Edit alamat" : "Form alamat baru"}>
          <form className="account-form" onSubmit={submit}>
            <label>Label alamat<input onChange={updateAddressField("label", setForm)} placeholder="Rumah / Kantor" required value={form.label} /></label>
            <label>Detail alamat<input onChange={updateAddressField("detail", setForm)} placeholder="Nama jalan, nomor rumah, patokan" required value={form.detail} /></label>
            <label>Latitude<input onChange={updateAddressField("lat", setForm)} placeholder="3.5952" required type="number" value={form.lat} /></label>
            <label>Longitude<input onChange={updateAddressField("lng", setForm)} placeholder="98.6722" required type="number" value={form.lng} /></label>
            <label className="account-check"><input checked={form.isPrimary} onChange={(event) => setForm((current) => ({ ...current, isPrimary: event.target.checked }))} type="checkbox" /> Jadikan alamat utama</label>
            <button className="primary-snap" type="submit"><FiCheck /> {editingId ? "Simpan alamat" : "Tambah alamat"}</button>
          </form>
        </QuickPanel>
      )}
      {message && <p className="account-message">{message}</p>}
    </>
  );
}

export function OrdersAccountContent() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchOrders()
      .then(setOrders)
      .catch((error) => setMessage(error instanceof Error ? error.message : "Pesanan belum dapat dimuat."));
  }, []);

  return (
    <section className="account-panel">
      <div className="account-section-title">
        <div>
          <span className="eyebrow">My Orders</span>
          <h2>Riwayat belanja</h2>
        </div>
      </div>
      {message ? <p className="empty-copy">{message}</p> : <OrderList orders={orders} />}
    </section>
  );
}

export function NotificationsAccountContent() {
  return (
    <>
      <QuickPanel title="Preferensi notifikasi">
        <div className="toggle-list">
          <label><span>Update status pesanan</span><input defaultChecked type="checkbox" /></label>
          <label><span>Promo dan voucher</span><input defaultChecked type="checkbox" /></label>
          <label><span>Rekomendasi produk</span><input type="checkbox" /></label>
          <label><span>Reminder checkout cart</span><input defaultChecked type="checkbox" /></label>
        </div>
      </QuickPanel>
      <section className="account-panel">
        <div className="account-section-title compact">
          <h2>Notifikasi terbaru</h2>
        </div>
        <div className="account-list rich-list">
          <p><span><b>Pesanan sedang dikemas</b><small>Pesanan cabang terdekat sedang diproses.</small></span><strong>Baru</strong></p>
          <p><span><b>Voucher aktif</b><small>Gunakan voucher untuk diskon belanja berikutnya.</small></span><strong>Promo</strong></p>
          <p><span><b>Stok buah segar tersedia</b><small>Cabang terdekat baru restock pagi ini.</small></span><strong>Info</strong></p>
        </div>
      </section>
    </>
  );
}

export function VouchersAccountContent() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchVouchers()
      .then((items) => {
        setVouchers(items);
        setMessage(items.length ? "" : "Belum ada voucher aktif saat ini.");
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : "Voucher belum dapat dimuat."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="account-grid voucher-grid">
        {Array.from({ length: 4 }, (_, index) => (
          <article className="account-panel voucher-card voucher-skeleton" aria-hidden="true" key={index}>
            <span className="skeleton-icon" />
            <span className="skeleton-line short" />
            <span className="skeleton-line wide" />
            <span className="skeleton-line medium" />
            <span className="skeleton-button" />
          </article>
        ))}
      </section>
    );
  }

  if (!vouchers.length) {
    return <section className="account-panel empty-account-state"><FiTag /><h2>Voucher belum tersedia</h2><p>{message}</p></section>;
  }

  return (
    <section className="account-grid voucher-grid">
      {vouchers.map((voucher) => (
        <article className="account-panel voucher-card" key={voucher.id}>
          <FiTag />
          <span>{voucher.code}</span>
          <h2>{voucher.title}</h2>
          <p>{voucherSummary(voucher)}</p>
          <small>{voucherMeta(voucher)}</small>
          <button type="button">Pakai voucher</button>
        </article>
      ))}
    </section>
  );
}

export function PaymentAccountContent() {
  return <section className="account-panel empty-account-state"><FiShield /><h2>Payment dipindahkan ke checkout</h2><p>Metode pembayaran dipilih langsung saat membuat pesanan.</p></section>;
}

export function SecurityAccountContent() {
  const { user } = useAccountUser();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function openModal() {
    setEmail(user?.email ?? "");
    setMessage("");
    setModalOpen(true);
  }

  async function submitReset(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      const response = await requestPasswordReset(email.trim());
      setMessage(response.message);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Permintaan belum dapat dikirim.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className="account-panel security-panel">
        <div className="account-section-title">
          <div>
            <span className="eyebrow">Security</span>
            <h2>Password & akses</h2>
          </div>
          <button onClick={openModal} type="button">Ubah password</button>
        </div>
        <p><FiLock /> Password dan sesi login dikelola aman melalui akun Market Snap.</p>
        <p><FiShield /> Sesi login aktif di perangkat ini.</p>
        <p><FiBell /> Notifikasi login baru dikirim melalui email.</p>
      </section>
      <QuickPanel title="Perangkat aktif">
        <div className="account-list">
          <p><span>Chrome</span><strong>Aktif</strong></p>
        </div>
      </QuickPanel>
      {modalOpen && (
        <div className="account-modal-backdrop">
          <section aria-modal="true" className="account-modal" role="dialog">
            <button aria-label="Tutup" className="account-modal-close" onClick={() => setModalOpen(false)} type="button"><FiX /></button>
            <span className="account-modal-icon"><FiMail /></span>
            <h2>Ubah password</h2>
            <p>Masukkan email akun Market Snap Anda. Kami akan mengirim tautan untuk membuat password baru.</p>
            <form className="account-form single" onSubmit={submitReset}>
              <label>Email<input onChange={(event) => setEmail(event.target.value)} placeholder="nama@email.com" required type="email" value={email} /></label>
              <button className="primary-snap" disabled={submitting} type="submit">{submitting ? "Mengirim..." : "Kirim tautan"}</button>
            </form>
            {message && <p className="account-message">{message}</p>}
          </section>
        </div>
      )}
    </>
  );
}

export function HelpAccountContent() {
  return (
    <>
      <section className="account-grid">
        <HelpCard title="Lacak pesanan" text="Pantau status belanja secara real-time." />
        <HelpCard title="Pembayaran" text="Bantuan VA, e-wallet, QRIS, kartu, dan refund." />
        <HelpCard title="Pengiriman" text="Atur alamat, jadwal, ongkir, dan cabang terdekat." />
        <HelpCard title="Produk & voucher" text="Tanya stok, promo aktif, dan kualitas produk." />
      </section>
      <section className="account-panel contact-help">
        <FiHeadphones />
        <div>
          <span className="eyebrow">Customer Care</span>
          <h2>Butuh bantuan lebih cepat?</h2>
          <p>Tim Market Snap siap membantu pesanan, pembayaran, dan pengirimanmu setiap hari.</p>
        </div>
        <Link className="primary-snap" href="/contact-us">Hubungi kami</Link>
      </section>
    </>
  );
}

function UserCard({ loading = false, user }: { loading?: boolean; user?: ApiUser | null }) {
  if (loading) {
    return (
      <div className="account-user-card">
        <span className="skeleton-avatar" />
        <div><span className="skeleton-line short" /><span className="skeleton-line medium" /></div>
      </div>
    );
  }
  return (
    <div className="account-user-card">
      <ProfileAvatar user={user} />
      <div>
        <strong>{user?.name ?? "Customer"}</strong>
        <small>{user?.email ?? "Memuat profil..."}</small>
      </div>
    </div>
  );
}

function AccountProfileSkeleton() {
  return (
    <div className="profile-overview" aria-hidden="true">
      <span className="skeleton-avatar large" />
      <div className="profile-skeleton-copy">
        <span className="skeleton-line medium" />
        <span className="skeleton-line wide" />
        <span className="skeleton-line short" />
      </div>
    </div>
  );
}

function ProfileAvatar({ editable = false, onEdit, size = "normal", user }: { editable?: boolean; onEdit?: () => void; size?: "large" | "normal"; user?: ApiUser | null }) {
  const className = size === "large" ? "profile-avatar large" : "profile-avatar";
  const content = user?.avatarUrl ? (
    <Image alt={user.name} height={size === "large" ? 64 : 48} src={user.avatarUrl} unoptimized width={size === "large" ? 64 : 48} />
  ) : (
    <FiUser />
  );
  if (user?.avatarUrl) {
    return (
      <span className={className}>
        {content}
        {editable && <button aria-label="Ubah foto profil" className="profile-avatar-edit" onClick={onEdit} type="button"><FiCamera /></button>}
      </span>
    );
  }
  return <span className={className}>{content}{editable && <button aria-label="Ubah foto profil" className="profile-avatar-edit" onClick={onEdit} type="button"><FiCamera /></button>}</span>;
}

function QuickPanel({ action, actionHref, children, title }: { action?: string; actionHref?: string; children: React.ReactNode; title: string }) {
  return (
    <article className="account-panel">
      <div className="account-section-title compact">
        <h2>{title}</h2>
        {action && actionHref && <Link className="account-panel-action" href={actionHref}>{action}</Link>}
      </div>
      {children}
    </article>
  );
}

function SavedAddress({ address, onEdit }: { address: Address; onEdit?: () => void }) {
  return (
    <div className="saved-address">
      <FiHome />
      <div>
        <strong>{address.label} {address.isPrimary && <span>Utama</span>}</strong>
        <p>{address.detail}</p>
        <small>{address.isPrimary ? "Dipakai untuk estimasi cabang terdekat dan ongkir." : "Alamat tersimpan untuk pengiriman."}</small>
      </div>
      {onEdit && <button aria-label={`Edit ${address.label}`} className="icon-action" onClick={onEdit} type="button"><FiEdit2 /></button>}
    </div>
  );
}

function OrderList({ compact = false, orders }: { compact?: boolean; orders: OrderSummary[] }) {
  if (!orders.length) return <p className="empty-copy">Belum ada pesanan tersimpan.</p>;
  return (
    <div className="order-card-list">
      {orders.map((order) => (
        <article className={compact ? "order-card compact" : "order-card"} key={order.id}>
          <div className="order-card-head">
            <span>{statusLabel(order.status)}</span>
            <strong>{rupiah(order.total)}</strong>
          </div>
          <div className="order-items">
            {order.items.slice(0, compact ? 2 : 4).map((item) => (
              <div className="order-item-row" key={item.id}>
                <img alt={item.name} src={item.image} />
                <span><b>{item.name}</b><small>Qty: {item.quantity}</small></span>
              </div>
            ))}
          </div>
          {order.items.length > (compact ? 2 : 4) && <small className="order-more">+{order.items.length - (compact ? 2 : 4)} produk lainnya</small>}
        </article>
      ))}
    </div>
  );
}

function HelpCard({ text, title }: { text: string; title: string }) {
  return (
    <article className="account-panel help-card">
      <FiHeadphones />
      <h2>{title}</h2>
      <p>{text}</p>
      <button type="button">Lihat bantuan</button>
    </article>
  );
}

function useAccountUser() {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function reloadUser() {
    const data = await fetchCurrentUser();
    setUser(data);
    setLoading(false);
    return data;
  }

  useEffect(() => {
    let active = true;
    fetchCurrentUser()
      .then((data) => {
        if (active) setUser(data);
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { loading, reloadUser, user };
}

function updateAddressField(field: keyof AddressForm, setForm: React.Dispatch<React.SetStateAction<AddressForm>>) {
  return (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = field === "isPrimary" ? event.target.checked : event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
  };
}

function emptyAddressForm(isPrimary = false): AddressForm {
  return { detail: "", isPrimary, label: "", lat: "3.5952", lng: "98.6722" };
}

function memberSince(date?: string) {
  if (!date) return "Member Market Snap";
  return `Member sejak ${new Date(date).toLocaleDateString("id-ID", { month: "long", year: "numeric" })}`;
}

function roleLabel(role: ApiUser["role"]) {
  const normalized = String(role).toLowerCase();
  if (normalized === "admin" || normalized === "super_admin") return "Admin Market Snap";
  if (normalized === "store_admin") return "Admin Store Market Snap";
  return "Customer Market Snap";
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    CANCELLED: "Dibatalkan",
    CONFIRMED: "Dikonfirmasi",
    PROCESSING: "Diproses",
    SHIPPED: "Dikirim",
    WAITING_PAYMENT: "Menunggu pembayaran",
    WAITING_PAYMENT_CONFIRMATION: "Menunggu konfirmasi",
    Diproses: "Diproses",
    Dikirim: "Dikirim",
    Selesai: "Selesai"
  };
  return labels[status] ?? status;
}

function voucherSummary(voucher: Voucher) {
  const value = voucher.type === "percentage" ? `${voucher.value}%` : rupiah(voucher.value);
  const scope = voucher.scope === "shipping" ? "ongkir" : voucher.scope === "product" ? "produk pilihan" : "total belanja";
  return `Potongan ${value} untuk ${scope}.`;
}

function voucherMeta(voucher: Voucher) {
  const minSpend = voucher.minSpend ? `Minimal belanja ${rupiah(voucher.minSpend)}` : "Tanpa minimal belanja";
  const maxDiscount = voucher.maxDiscount ? `maks. ${rupiah(voucher.maxDiscount)}` : "tanpa batas maksimum";
  return `${minSpend}, ${maxDiscount}. Berlaku hingga ${new Date(voucher.expiresAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}`;
}
