"use client";

import { FiBell, FiPackage, FiTag, FiTruck } from "react-icons/fi";
import { SnapHeader } from "./SnapCommon";

const notifications = [
  {
    icon: FiPackage,
    title: "Pesanan sedang dikemas",
    text: "#MS-250526-003 diproses cabang Kemang.",
    label: "Baru"
  },
  {
    icon: FiTag,
    title: "Voucher SNAPWELCOME aktif",
    text: "Gunakan untuk diskon belanja berikutnya.",
    label: "Promo"
  },
  {
    icon: FiTruck,
    title: "Stok buah segar tersedia",
    text: "Cabang terdekat baru restock pagi ini.",
    label: "Info"
  }
];

export function SnapNotificationsPage() {
  return (
    <>
      <SnapHeader active="notifications" />
      <main className="notification-page">
        <section className="notification-title">
          <span><FiBell /> Notification</span>
          <h1>Notifikasi terbaru</h1>
          <p>Update pesanan, voucher, dan stok produk segar dari Market Snap.</p>
        </section>
        <section className="notification-list-panel">
          <h2>Notifikasi terbaru</h2>
          <div className="notification-list">
            {notifications.map(({ icon: Icon, title, text, label }) => (
              <article key={title}>
                <Icon />
                <span>
                  <strong>{title}</strong>
                  <small>{text}</small>
                </span>
                <b>{label}</b>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
