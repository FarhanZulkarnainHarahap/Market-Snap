"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FiAlertCircle, FiCheckCircle, FiClock, FiRefreshCw } from "react-icons/fi";
import { fetchPaymentStatus } from "@/lib/api";
import { formatPaymentDeadline, isSafePaymentRedirect } from "@/lib/payment-security.mjs";

type PaymentStatusData = Awaited<ReturnType<typeof fetchPaymentStatus>>;
type PaymentPageMode = "finish" | "pending" | "error";

const finalStatuses = ["PAID", "FAILED", "CANCELLED", "EXPIRED", "REFUNDED"];

export function PaymentFinishPage() {
  const router = useRouter();
  const params = useSearchParams();
  const orderNumber = useMemo(() => params.get("order_id") ?? recoverOrderNumber(), [params]);
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<PaymentStatusData | null>(null);

  const verify = useCallback(async () => {
    if (!orderNumber) {
      setError("Nomor order tidak ditemukan dari redirect pembayaran.");
      return;
    }
    setError("");
    try {
      const next = await fetchPaymentStatus(orderNumber);
      setStatus(next);
      if (next.paymentStatus === "PAID") return;
      if (next.paymentStatus === "PENDING" && attempts >= 6) {
        router.replace(`/payment/pending?order_id=${encodeURIComponent(next.orderNumber)}`);
        return;
      }
      if (["FAILED", "CANCELLED", "EXPIRED"].includes(next.paymentStatus)) {
        router.replace(`/payment/error?order_id=${encodeURIComponent(next.orderNumber)}&status=${encodeURIComponent(next.paymentStatus)}`);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Status pembayaran belum dapat diverifikasi.");
    }
  }, [attempts, orderNumber, router]);

  useEffect(() => {
    const timer = window.setTimeout(() => void verify(), 0);
    return () => window.clearTimeout(timer);
  }, [verify]);

  useEffect(() => {
    if (!orderNumber || error || (status && finalStatuses.includes(status.paymentStatus))) return;
    if (attempts >= 7) return;
    const timer = window.setTimeout(() => {
      setAttempts((current) => current + 1);
    }, 2500);
    return () => window.clearTimeout(timer);
  }, [attempts, error, orderNumber, status]);

  const paid = status?.paymentStatus === "PAID";
  const safeRedirect = status && isSafePaymentRedirect(status.paymentRedirectUrl) ? status.paymentRedirectUrl : null;

  return (
    <PaymentShell icon={paid ? <FiCheckCircle /> : <FiRefreshCw className="payment-spin" />} title={paid ? "Pembayaran berhasil" : "Memverifikasi pembayaran..."}>
      <p>{paid ? "Pembayaran sudah diverifikasi oleh backend Market Snap dan pesanan siap diproses." : "Market Snap sedang meminta status terbaru dari server pembayaran. Status dari URL tidak dipakai sebagai sumber kebenaran."}</p>
      {orderNumber && <strong>{orderNumber}</strong>}
      {status && <PaymentStatusSummary status={status} />}
      {error && <p className="payment-error">{error}</p>}
      <div className="payment-actions">
        {!paid && <button className="primary-snap" onClick={verify} type="button"><FiRefreshCw /> Cek Lagi</button>}
        {!paid && status?.paymentStatus === "PENDING" && safeRedirect && <a className="primary-snap" href={safeRedirect}>Lanjutkan Pembayaran</a>}
        {status && <Link className="secondary-snap" href={`/dashboard/customer/profile/orders/${encodeURIComponent(status.id)}`}>Lihat Pesanan</Link>}
        {paid && status.invoiceAvailable && <Link className="primary-snap" href={`/dashboard/customer/orders/${encodeURIComponent(status.orderNumber)}/invoice`}>Lihat Invoice</Link>}
        <Link className="secondary-snap" href="/dashboard/customer/catalog">Belanja Lagi</Link>
      </div>
    </PaymentShell>
  );
}

export function PaymentStatePage({ mode }: { mode: PaymentPageMode }) {
  const params = useSearchParams();
  const router = useRouter();
  const orderNumber = useMemo(() => params.get("order_id") ?? recoverOrderNumber(), [params]);
  const [status, setStatus] = useState<PaymentStatusData | null>(null);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  const checkStatus = useCallback(async () => {
    if (!orderNumber) {
      setError("Nomor order tidak ditemukan.");
      return;
    }
    setChecking(true);
    setError("");
    try {
      const next = await fetchPaymentStatus(orderNumber);
      setStatus(next);
      if (next.paymentStatus === "PAID") router.replace(`/payment/finish?order_id=${encodeURIComponent(next.orderNumber)}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Status pembayaran belum dapat dimuat.");
    } finally {
      setChecking(false);
    }
  }, [orderNumber, router]);

  useEffect(() => {
    const timer = window.setTimeout(() => void checkStatus(), 0);
    return () => window.clearTimeout(timer);
  }, [checkStatus]);

  const isPending = status?.paymentStatus === "PENDING" || (mode === "pending" && !status);
  const title = isPending ? "Menunggu pembayaran" : status?.paymentStatus === "PAID" ? "Pembayaran berhasil" : "Pembayaran belum berhasil";
  const icon = isPending ? <FiClock /> : status?.paymentStatus === "PAID" ? <FiCheckCircle /> : <FiAlertCircle />;
  const deadline = formatPaymentDeadline(status?.paymentDeadline);
  const safeRedirect = status && isSafePaymentRedirect(status.paymentRedirectUrl) ? status.paymentRedirectUrl : null;

  return (
    <PaymentShell icon={icon} title={title}>
      <p>{isPending ? "Selesaikan pembayaran sebelum batas waktu sesi pembayaran berakhir." : "Status sebenarnya tetap diambil dari backend Market-Snap."}</p>
      {orderNumber && <strong>{orderNumber}</strong>}
      {status && <PaymentStatusSummary status={status} />}
      {isPending && <p className="payment-muted">{deadline ? `Selesaikan pembayaran sebelum ${deadline}.` : "Batas waktu mengikuti sesi pembayaran yang dibuat saat checkout."}</p>}
      {error && <p className="payment-error">{error}</p>}
      <div className="payment-actions">
        <button className="primary-snap" disabled={checking} onClick={checkStatus} type="button"><FiRefreshCw /> {checking ? "Mengecek..." : "Cek Status"}</button>
        {isPending && safeRedirect && <a className="primary-snap" href={safeRedirect}>Lanjutkan Pembayaran</a>}
        {status && <Link className="secondary-snap" href={`/dashboard/customer/profile/orders/${encodeURIComponent(status.id)}`}>Lihat Pesanan</Link>}
        {!status && <Link className="secondary-snap" href="/dashboard/customer/profile/orders">Lihat Pesanan</Link>}
        <Link className="secondary-snap" href="/dashboard/customer/catalog">Kembali ke katalog</Link>
      </div>
    </PaymentShell>
  );
}

function PaymentStatusSummary({ status }: { status: PaymentStatusData }) {
  const deadline = formatPaymentDeadline(status.paymentDeadline);
  return (
    <dl className="payment-status-grid">
      <div><dt>Total pembayaran</dt><dd>{rupiah(status.total)}</dd></div>
      <div><dt>Status pembayaran</dt><dd>{paymentStatusLabel(status.paymentStatus)}</dd></div>
      <div><dt>Status pesanan</dt><dd>{orderStatusLabel(status.orderStatus)}</dd></div>
      <div><dt>Metode pembayaran</dt><dd>{status.paymentChannel || status.paymentMethod || "Xendit"}</dd></div>
      {status.paidAt && <div><dt>Tanggal pembayaran</dt><dd>{formatDate(status.paidAt)}</dd></div>}
      {deadline && status.paymentStatus === "PENDING" && <div><dt>Deadline pembayaran</dt><dd>{deadline}</dd></div>}
    </dl>
  );
}

function PaymentShell({ children, icon, title }: { children: React.ReactNode; icon: React.ReactNode; title: string }) {
  return (
    <main className="payment-return-page">
      <section className="payment-return-panel">
        <div className="payment-return-icon">{icon}</div>
        <h1>{title}</h1>
        {children}
      </section>
    </main>
  );
}

function recoverOrderNumber() {
  if (typeof window === "undefined") return "";
  return window.sessionStorage.getItem("market-snap-last-order-number") ?? "";
}

function paymentStatusLabel(status: string) {
  const labels: Record<string, string> = {
    CANCELLED: "Dibatalkan",
    EXPIRED: "Kedaluwarsa",
    FAILED: "Gagal",
    PAID: "Pembayaran Berhasil",
    PENDING: "Belum Bayar",
    REFUNDED: "Dikembalikan"
  };
  return labels[status] ?? status;
}

function orderStatusLabel(status: string) {
  const labels: Record<string, string> = {
    CANCELLED: "Dibatalkan",
    COMPLETED: "Selesai",
    DELIVERED: "Sampai",
    OUT_FOR_DELIVERY: "Dalam Pengiriman",
    PACKED: "Dikemas",
    PAID: "Pembayaran Berhasil",
    PENDING_PAYMENT: "Menunggu Pembayaran",
    PICKING: "Disiapkan",
    PROCESSING: "Diproses",
    READY: "Siap Dikirim",
    SHIPPED: "Dikirim",
    WAITING_PAYMENT: "Menunggu Pembayaran"
  };
  return labels[status] ?? status;
}

function rupiah(value: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
}
