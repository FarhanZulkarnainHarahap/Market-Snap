"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Tooltip } from "chart.js";
import type { ChartOptions, TooltipItem } from "chart.js";
import {
  FiBell,
  FiBarChart2,
  FiCamera,
  FiCheck,
  FiChevronRight,
  FiBriefcase,
  FiEdit2,
  FiHeadphones,
  FiHome,
  FiLock,
  FiMail,
  FiPlus,
  FiShield,
  FiTag,
  FiTrash2,
  FiUser,
  FiX
} from "react-icons/fi";
import { SnapHeader } from "@/components/snap/SnapCommon";
import { cancelStoreAdminRequest, createAddress, createStoreAdminRequest, deleteAddress, fetchAddresses, fetchCurrentUser, fetchMyStoreAdminRequest, fetchNotifications, fetchOrderStatistics, fetchOrders, fetchStores, fetchVouchers, markAllNotificationsRead, markNotificationRead, requestEmailVerification, requestPasswordReset, updateAddress, updateCurrentUser, uploadProfileAvatar } from "@/lib/api";
import { customerAccountMenus, type CustomerAccountMenuKey } from "@/lib/customer-menus";
import { rupiah } from "@/lib/format";
import type { Address, OrderStatistics, OrderSummary, Store, Voucher } from "@/lib/types";
import type { ApiNotification, ApiStoreAdminRequest, ApiUser } from "@/lib/api-contracts";

ChartJS.register(ArcElement, BarElement, CategoryScale, Legend, LinearScale, LineElement, PointElement, Tooltip);

type AccountSection = Exclude<CustomerAccountMenuKey, "logout"> | "security";

type ProfileForm = {
  email: string;
  name: string;
  phone: string;
};

type AddressForm = {
  city: string;
  detail: string;
  district: string;
  isPrimary: boolean;
  label: string;
  lat: string;
  lng: string;
  note: string;
  phone: string;
  postalCode: string;
  province: string;
  recipientName: string;
};

const accountSections = ["Akun", "Belanja", "Informasi"] as const;

export function AccountLayout({ active, children, title, description }: { active: AccountSection; children: React.ReactNode; title: string; description: string }) {
  const headerActive = active === "orders" ? "orders" : active === "notifications" ? "notifications" : "profile";
  const { loading, user } = useAccountUser();

  return (
    <>
      <SnapHeader active={headerActive} />
      <main className="account-page">
        <section className="account-hero">
          <div>
            <span className="eyebrow">Akun Customer</span>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
        </section>

        <section className="account-layout">
          <aside className="account-sidebar" aria-label="Menu akun">
            <UserCard loading={loading} user={user} />
            <nav>
              {accountSections.map((section) => (
                <div className="account-menu-group" key={section}>
                  <p>{section}</p>
                  {customerAccountMenus.filter((item) => item.section === section).map(({ key, href, label, text, icon: Icon }) => (
                    <Link className={active === key ? "active" : ""} href={href} key={key}>
                      <Icon />
                      <span><strong>{label}</strong><small>{text}</small></span>
                      <FiChevronRight />
                    </Link>
                  ))}
                </div>
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
        {editing ? (
          <form className="account-form" onSubmit={submit}>
            <label>Nama lengkap<input onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} value={profileForm.name} /></label>
            <label>Email<input onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} type="email" value={profileForm.email} /></label>
            <label>Nomor handphone<input onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} placeholder="0812-3456-7890" value={profileForm.phone} /></label>
            <button className="primary-snap" type="submit"><FiCheck /> Simpan perubahan</button>
          </form>
        ) : (
          <div className="account-read-grid">
            <p><span>Nama lengkap</span><strong>{profileForm.name || "Belum diisi"}</strong></p>
            <p><span>Email</span><strong>{profileForm.email || "Belum tersedia"}</strong></p>
            <p><span>Nomor handphone</span><strong>{profileForm.phone || "Belum diisi"}</strong></p>
          </div>
        )}
        {!loading && !user?.verified && <button className="secondary-snap account-verify-button" onClick={openVerificationModal} type="button"><FiMail /> Verifikasi akun</button>}
        {message && <p className="account-message">{message}</p>}
      </section>

      <section className="account-grid">
        <QuickPanel actionHref="/profile/addresses" action="Tambah" title="Alamat utama">
          {primaryAddress ? <SavedAddress address={primaryAddress} /> : <p className="empty-copy">Belum ada alamat tersimpan.</p>}
        </QuickPanel>
        <QuickPanel actionHref="/profile/orders" action="Lihat semua" title="Pesanan terakhir">
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
      city: address.city ?? "",
      detail: address.detail,
      district: address.district ?? "",
      isPrimary: address.isPrimary,
      label: address.label,
      lat: String(address.lat),
      lng: String(address.lng),
      note: address.note ?? "",
      phone: address.phone ?? "",
      postalCode: address.postalCode ?? "",
      province: address.province ?? "",
      recipientName: address.recipientName ?? ""
    });
    setFormOpen(true);
    setMessage("");
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = {
      city: form.city.trim() || undefined,
      detail: form.detail.trim(),
      district: form.district.trim() || undefined,
      isPrimary: form.isPrimary,
      label: form.label.trim(),
      lat: Number(form.lat),
      lng: Number(form.lng),
      note: form.note.trim() || undefined,
      phone: form.phone.trim() || undefined,
      postalCode: form.postalCode.trim() || undefined,
      province: form.province.trim() || undefined,
      recipientName: form.recipientName.trim() || undefined
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

  async function removeAddress(address: Address) {
    if (!window.confirm(`Hapus alamat ${address.label}?`)) return;
    try {
      await deleteAddress(address.id);
      setMessage("Alamat berhasil dihapus.");
      await loadAddresses();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Alamat belum dapat dihapus.");
    }
  }

  async function makePrimary(address: Address) {
    try {
      await updateAddress(address.id, { isPrimary: true });
      setMessage("Alamat utama berhasil diperbarui.");
      await loadAddresses();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Alamat utama belum dapat diperbarui.");
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
            {addresses.map((address) => <SavedAddress address={address} key={address.id} onDelete={() => removeAddress(address)} onEdit={() => startEdit(address)} onPrimary={() => makePrimary(address)} />)}
          </div>
        ) : (
          <p className="empty-copy">Belum ada alamat tersimpan. Tambahkan alamat untuk checkout lebih cepat.</p>
        )}
      </section>
      {formOpen && (
        <QuickPanel title={editingId ? "Edit alamat" : "Form alamat baru"}>
          <form className="account-form" onSubmit={submit}>
            <label>Label alamat<input onChange={updateAddressField("label", setForm)} placeholder="Rumah / Kantor" required value={form.label} /></label>
            <label>Nama penerima<input onChange={updateAddressField("recipientName", setForm)} placeholder="Nama penerima" value={form.recipientName} /></label>
            <label>Nomor handphone<input onChange={updateAddressField("phone", setForm)} placeholder="0812-3456-7890" value={form.phone} /></label>
            <label>Detail alamat<input onChange={updateAddressField("detail", setForm)} placeholder="Nama jalan, nomor rumah, patokan" required value={form.detail} /></label>
            <label>Kecamatan<input onChange={updateAddressField("district", setForm)} placeholder="Kecamatan" value={form.district} /></label>
            <label>Kota/Kabupaten<input onChange={updateAddressField("city", setForm)} placeholder="Kota atau kabupaten" value={form.city} /></label>
            <label>Provinsi<input onChange={updateAddressField("province", setForm)} placeholder="Provinsi" value={form.province} /></label>
            <label>Kode pos<input onChange={updateAddressField("postalCode", setForm)} placeholder="Kode pos" value={form.postalCode} /></label>
            <label>Catatan/patokan<input onChange={updateAddressField("note", setForm)} placeholder="Catatan atau patokan alamat" value={form.note} /></label>
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
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    fetchNotifications()
      .then((items) => {
        if (active) setNotifications(items);
      })
      .catch((error) => {
        if (active) setMessage(error instanceof Error ? error.message : "Notifikasi belum dapat dimuat.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function readOne(notification: ApiNotification) {
    if (notification.isRead) return;
    try {
      await markNotificationRead(notification.id);
      setNotifications((current) => current.map((item) => item.id === notification.id ? { ...item, isRead: true } : item));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Notifikasi belum dapat diperbarui.");
    }
  }

  async function readAll() {
    try {
      await markAllNotificationsRead();
      setNotifications((current) => current.map((item) => ({ ...item, isRead: true })));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Notifikasi belum dapat diperbarui.");
    }
  }

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
          {notifications.some((item) => !item.isRead) && <button onClick={readAll} type="button">Tandai dibaca</button>}
        </div>
        {loading ? <AccountProfileSkeleton /> : null}
        {!loading && message ? <p className="empty-copy">{message}</p> : null}
        {!loading && !message && notifications.length ? (
          <div className="account-list rich-list notification-list">
            {notifications.map((notification) => (
              <button className={notification.isRead ? "read" : "unread"} key={notification.id} onClick={() => readOne(notification)} type="button">
                <span><b>{notification.title}</b><small>{notification.message}</small><small>{formatDateTime(notification.createdAt)}</small></span>
                <strong>{notification.isRead ? "Dibaca" : "Baru"}</strong>
              </button>
            ))}
          </div>
        ) : null}
        {!loading && !message && !notifications.length ? <p className="empty-copy">Belum ada notifikasi baru.</p> : null}
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

export function StoreAdminRequestContent() {
  const { loading: userLoading, user } = useAccountUser();
  const [request, setRequest] = useState<ApiStoreAdminRequest | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [form, setForm] = useState({ experience: "", reason: "", requestedStoreId: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([
      fetchMyStoreAdminRequest().catch(() => null),
      fetchStores().catch(() => [])
    ]).then(([requestData, storeData]) => {
      if (!active) return;
      setRequest(requestData);
      setStores(storeData);
      setForm((current) => ({ ...current, requestedStoreId: requestData?.requestedStore?.id ?? storeData[0]?.id ?? "" }));
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      const response = await createStoreAdminRequest({
        experience: form.experience.trim() || undefined,
        reason: form.reason.trim(),
        requestedStoreId: form.requestedStoreId || undefined
      });
      setRequest(response.data);
      setMessage(response.message);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Pengajuan belum dapat dikirim.");
    } finally {
      setSubmitting(false);
    }
  }

  async function cancelRequest() {
    if (!window.confirm("Batalkan pengajuan Store Admin?")) return;
    setSubmitting(true);
    setMessage("");
    try {
      const response = await cancelStoreAdminRequest();
      setRequest(response.data);
      setMessage(response.message);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Pengajuan belum dapat dibatalkan.");
    } finally {
      setSubmitting(false);
    }
  }

  const latestPending = request?.status === "PENDING";
  const latestApproved = request?.status === "APPROVED";
  const ready = Boolean(user?.verified && user.phone);

  if (loading || userLoading) {
    return <section className="account-panel"><AccountProfileSkeleton /></section>;
  }

  return (
    <>
      <section className="account-panel store-request-panel">
        <div className="account-section-title">
          <div>
            <span className="eyebrow">Store Admin</span>
            <h2>Pengajuan akses cabang</h2>
          </div>
          <span className={`request-status ${request ? request.status.toLowerCase() : "new"}`}>{request ? requestStatusLabel(request.status) : "Belum diajukan"}</span>
        </div>
        <div className="store-request-grid">
          <article>
            <FiBriefcase />
            <strong>Data akun</strong>
            <span>{user?.name ?? "Customer"}</span>
            <small>{user?.verified ? "Email terverifikasi" : "Email belum terverifikasi"} · {user?.phone ? "Nomor HP tersedia" : "Nomor HP belum diisi"}</small>
          </article>
          <article>
            <FiHome />
            <strong>Cabang pilihan</strong>
            <span>{request?.assignedStore?.name ?? request?.requestedStore?.name ?? stores.find((store) => store.id === form.requestedStoreId)?.name ?? "Pilih cabang"}</span>
            <small>{latestApproved ? "Akses sudah diberikan" : "Super Admin akan menentukan cabang final."}</small>
          </article>
        </div>
        {request && (
          <div className="request-history-card">
            <strong>{requestStatusTitle(request.status)}</strong>
            <p>{requestStatusCopy(request)}</p>
            <small>Diajukan {formatDateTime(request.createdAt)}{request.reviewedAt ? ` · Direview ${formatDateTime(request.reviewedAt)}` : ""}</small>
            {latestPending && <button disabled={submitting} onClick={cancelRequest} type="button"><FiX /> Batalkan pengajuan</button>}
          </div>
        )}
      </section>
      {!latestPending && !latestApproved && (
        <section className="account-panel">
          <div className="account-section-title compact">
            <h2>Form pengajuan</h2>
          </div>
          {!ready && (
            <p className="account-message">
              Lengkapi {user?.verified ? "" : "verifikasi email"}{!user?.verified && !user?.phone ? " dan " : ""}{user?.phone ? "" : "nomor handphone"} di profil sebelum mengirim pengajuan.
            </p>
          )}
          <form className="account-form store-request-form" onSubmit={submit}>
            <label>Cabang yang diinginkan
              <select onChange={(event) => setForm((current) => ({ ...current, requestedStoreId: event.target.value }))} value={form.requestedStoreId}>
                <option value="">Biarkan Super Admin memilih</option>
                {stores.map((store) => <option key={store.id} value={store.id}>{store.name} - {store.area}</option>)}
              </select>
            </label>
            <label>Alasan pengajuan
              <textarea minLength={20} onChange={(event) => setForm((current) => ({ ...current, reason: event.target.value }))} placeholder="Jelaskan kenapa Anda siap mengelola cabang Market Snap." required rows={5} value={form.reason} />
            </label>
            <label>Pengalaman terkait
              <textarea onChange={(event) => setForm((current) => ({ ...current, experience: event.target.value }))} placeholder="Contoh: pernah mengelola stok, customer service, operasional toko." rows={4} value={form.experience} />
            </label>
            <button className="primary-snap" disabled={!ready || submitting} type="submit"><FiCheck /> {submitting ? "Mengirim..." : "Kirim pengajuan"}</button>
          </form>
        </section>
      )}
      {message && <p className="account-message">{message}</p>}
    </>
  );
}

export function StatisticsAccountContent() {
  const [period, setPeriod] = useState("6months");
  const [statistics, setStatistics] = useState<OrderStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchOrderStatistics(period)
      .then(setStatistics)
      .catch((error) => setMessage(error instanceof Error ? error.message : "Statistik belum dapat dimuat."))
      .finally(() => setLoading(false));
  }, [period]);

  if (loading) {
    return <section className="account-panel"><AccountProfileSkeleton /></section>;
  }

  if (message || !statistics) {
    return <section className="account-panel empty-account-state"><FiBarChart2 /><h2>Statistik belum tersedia</h2><p>{message || "Belum ada data belanja untuk periode ini."}</p></section>;
  }

  const empty = statistics.totalOrders === 0;
  const lineData = chartData(statistics.monthlySpending, "Pengeluaran");
  const orderData = chartData(statistics.monthlyOrders, "Jumlah order");
  const statusData = doughnutData(statistics.ordersByStatus);
  const categoryData = chartData(statistics.productsByCategory, "Kategori");

  return (
    <>
      <section className="account-panel">
        <div className="account-section-title">
          <div>
            <span className="eyebrow">Statistics</span>
            <h2>Statistik belanja</h2>
          </div>
          <select aria-label="Filter periode statistik" onChange={(event) => { setLoading(true); setMessage(""); setPeriod(event.target.value); }} value={period}>
            <option value="7days">7 hari</option>
            <option value="30days">30 hari</option>
            <option value="3months">3 bulan</option>
            <option value="6months">6 bulan</option>
            <option value="12months">12 bulan</option>
            <option value="year">Tahun ini</option>
          </select>
        </div>
        <div className="statistics-summary">
          <StatCard label="Total pesanan" value={statistics.totalOrders} />
          <StatCard label="Total pengeluaran" value={rupiah(statistics.totalSpent)} />
          <StatCard label="Total penghematan" value={rupiah(statistics.totalSavings)} />
          <StatCard label="Rata-rata order" value={rupiah(statistics.averageOrderValue)} />
          <StatCard label="Pesanan selesai" value={statistics.completedOrders} />
          <StatCard label="Pesanan dibatalkan" value={statistics.cancelledOrders} />
        </div>
      </section>
      {empty ? (
        <section className="account-panel empty-account-state"><FiBarChart2 /><h2>Belum ada transaksi</h2><p>Chart akan muncul setelah pesanan dibuat dari database.</p></section>
      ) : (
        <section className="statistics-grid">
          <ChartPanel title="Pengeluaran per bulan"><Line data={lineData} options={moneyChartOptions} /></ChartPanel>
          <ChartPanel title="Jumlah order per bulan"><Bar data={orderData} options={basicChartOptions} /></ChartPanel>
          <ChartPanel title="Status pesanan"><Doughnut data={statusData} options={doughnutOptions} /></ChartPanel>
          <ChartPanel title="Kategori paling sering dibeli"><Bar data={categoryData} options={basicChartOptions} /></ChartPanel>
        </section>
      )}
    </>
  );
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
        <Link className="primary-snap" href="/contact">Hubungi kami</Link>
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

function SavedAddress({ address, onDelete, onEdit, onPrimary }: { address: Address; onDelete?: () => void; onEdit?: () => void; onPrimary?: () => void }) {
  return (
    <div className="saved-address">
      <FiHome />
      <div>
        <strong>{address.label} {address.isPrimary && <span>Utama</span>}</strong>
        <p>{address.detail}</p>
        <small>{[address.recipientName, address.phone, address.district, address.city, address.province, address.postalCode].filter(Boolean).join(" - ") || (address.isPrimary ? "Dipakai untuk estimasi cabang terdekat dan ongkir." : "Alamat tersimpan untuk pengiriman.")}</small>
        {address.note && <small>{address.note}</small>}
      </div>
      {(onEdit || onDelete || onPrimary) && (
        <div className="saved-address-actions">
          {onPrimary && !address.isPrimary && <button onClick={onPrimary} type="button"><FiCheck /> Utama</button>}
          {onEdit && <button aria-label={`Edit ${address.label}`} className="icon-action" onClick={onEdit} type="button"><FiEdit2 /></button>}
          {onDelete && <button aria-label={`Hapus ${address.label}`} className="icon-action danger" onClick={onDelete} type="button"><FiTrash2 /></button>}
        </div>
      )}
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
          <div className="order-payment-row">
            <span className={`payment-status-pill ${String(order.paymentStatus ?? "PENDING").toLowerCase()}`}>Pembayaran: {paymentStatusLabel(order.paymentStatus)}</span>
            <small>Order: {order.orderNumber}</small>
          </div>
          <div className="order-items">
            {order.items.slice(0, compact ? 2 : 4).map((item) => (
              <div className="order-item-row" key={item.id}>
                <Image alt={item.name} height={48} src={item.image} width={48} />
                <span><b>{item.name}</b><small>Qty: {item.quantity}</small></span>
              </div>
            ))}
          </div>
          {order.items.length > (compact ? 2 : 4) && <small className="order-more">+{order.items.length - (compact ? 2 : 4)} produk lainnya</small>}
          {!compact && (
            <div className="order-card-actions">
              {order.paymentStatus === "PAID" && <Link className="secondary-snap" href={`/dashboard/customer/orders/${encodeURIComponent(order.orderNumber)}/invoice`}>Lihat Invoice</Link>}
              {order.paymentStatus === "PENDING" && order.paymentRedirectUrl && <Link className="primary-snap" href={order.paymentRedirectUrl}>Lanjutkan Pembayaran</Link>}
              {order.paymentStatus === "EXPIRED" && <span className="payment-expired-text">Pembayaran Kedaluwarsa</span>}
              <Link className="secondary-snap" href={`/dashboard/customer/profile/orders/${order.id}`}>Detail</Link>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}

function paymentStatusLabel(status?: string) {
  const labels: Record<string, string> = {
    CANCELLED: "Dibatalkan",
    EXPIRED: "Kedaluwarsa",
    FAILED: "Gagal",
    PAID: "Lunas",
    PENDING: "Menunggu",
    REFUNDED: "Refund"
  };
  return labels[String(status ?? "PENDING")] ?? String(status ?? "PENDING");
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

function StatCard({ label, value }: { label: string; value: number | string }) {
  return <article><span>{label}</span><strong>{value}</strong></article>;
}

function ChartPanel({ children, title }: { children: React.ReactNode; title: string }) {
  return <article className="account-panel chart-panel"><h2>{title}</h2><div>{children}</div></article>;
}

function chartData(items: Array<{ label: string; value: number }>, label: string) {
  return {
    labels: items.map((item) => item.label),
    datasets: [{
      backgroundColor: "rgba(75, 151, 54, 0.72)",
      borderColor: "#064220",
      borderWidth: 2,
      data: items.map((item) => item.value),
      label,
      tension: 0.35
    }]
  };
}

function doughnutData(items: Array<{ label: string; value: number }>) {
  return {
    labels: items.map((item) => item.label),
    datasets: [{
      backgroundColor: ["#064220", "#4b9736", "#f59f2f", "#1f7a8c", "#b84a3d", "#7d5fff"],
      data: items.map((item) => item.value)
    }]
  };
}

const basicChartOptions: ChartOptions<"bar"> = {
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  responsive: true
};

const doughnutOptions: ChartOptions<"doughnut"> = {
  maintainAspectRatio: false,
  plugins: { legend: { position: "bottom" as const } },
  responsive: true
};

const moneyChartOptions: ChartOptions<"line"> = {
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context: TooltipItem<"line">) => rupiah(context.parsed.y ?? 0)
      }
    }
  },
  responsive: true
};

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
  return { city: "", detail: "", district: "", isPrimary, label: "", lat: "3.5952", lng: "98.6722", note: "", phone: "", postalCode: "", province: "", recipientName: "" };
}

function memberSince(date?: string) {
  if (!date) return "Member Market Snap";
  return `Member sejak ${new Date(date).toLocaleDateString("id-ID", { month: "long", year: "numeric" })}`;
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

function requestStatusLabel(status: ApiStoreAdminRequest["status"]) {
  const labels: Record<ApiStoreAdminRequest["status"], string> = {
    APPROVED: "Disetujui",
    CANCELLED: "Dibatalkan",
    PENDING: "Menunggu review",
    REJECTED: "Ditolak"
  };
  return labels[status];
}

function requestStatusTitle(status: ApiStoreAdminRequest["status"]) {
  const titles: Record<ApiStoreAdminRequest["status"], string> = {
    APPROVED: "Pengajuan disetujui",
    CANCELLED: "Pengajuan dibatalkan",
    PENDING: "Pengajuan sedang direview",
    REJECTED: "Pengajuan belum disetujui"
  };
  return titles[status];
}

function requestStatusCopy(request: ApiStoreAdminRequest) {
  if (request.status === "APPROVED") return `Akses Store Admin aktif untuk ${request.assignedStore?.name ?? "cabang terpilih"}. Login ulang bila menu admin belum muncul.`;
  if (request.status === "REJECTED") return request.rejectionReason ?? "Super Admin belum dapat menyetujui pengajuan ini.";
  if (request.status === "CANCELLED") return "Pengajuan ini dibatalkan. Anda dapat mengirim pengajuan baru kapan saja.";
  return "Super Admin sedang mengecek data akun, alasan pengajuan, dan cabang yang sesuai.";
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("id-ID", { day: "2-digit", hour: "2-digit", minute: "2-digit", month: "short", year: "numeric" });
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
