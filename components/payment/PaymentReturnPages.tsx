"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FiAlertCircle, FiCheckCircle, FiClock, FiRefreshCw } from "react-icons/fi";
import { fetchPaymentStatus } from "@/lib/api";

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
      if (next.paymentStatus === "PAID") {
        router.replace(`/dashboard/customer/orders/${encodeURIComponent(next.orderNumber)}/invoice`);
        return;
      }
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

  return (
    <PaymentShell icon={<FiRefreshCw className="payment-spin" />} title="Memverifikasi pembayaran...">
      <p>Market-Snap sedang meminta status terbaru dari server pembayaran. Status dari URL tidak dipakai sebagai sumber kebenaran.</p>
      {orderNumber && <strong>{orderNumber}</strong>}
      {status && <PaymentStatusSummary status={status} />}
      {error && <p className="payment-error">{error}</p>}
      <div className="payment-actions">
        <button className="primary-snap" onClick={verify} type="button"><FiRefreshCw /> Cek Lagi</button>
        <Link className="secondary-snap" href="/dashboard/customer/profile/orders">Lihat pesanan</Link>
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
      if (next.paymentStatus === "PAID") router.replace(`/dashboard/customer/orders/${encodeURIComponent(next.orderNumber)}/invoice`);
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

  const isPending = mode === "pending" || status?.paymentStatus === "PENDING";
  const title = isPending ? "Menunggu pembayaran" : status?.paymentStatus === "PAID" ? "Pembayaran berhasil" : "Pembayaran belum berhasil";
  const icon = isPending ? <FiClock /> : status?.paymentStatus === "PAID" ? <FiCheckCircle /> : <FiAlertCircle />;

  return (
    <PaymentShell icon={icon} title={title}>
      <p>{isPending ? "Selesaikan pembayaran sebelum batas waktu sesi pembayaran berakhir." : "Status sebenarnya tetap diambil dari backend Market-Snap."}</p>
      {orderNumber && <strong>{orderNumber}</strong>}
      {status && <PaymentStatusSummary status={status} />}
      {mode === "pending" && <p className="payment-muted">Batas waktu mengikuti sesi pembayaran yang dibuat saat checkout.</p>}
      {error && <p className="payment-error">{error}</p>}
      <div className="payment-actions">
        <button className="primary-snap" disabled={checking} onClick={checkStatus} type="button"><FiRefreshCw /> {checking ? "Mengecek..." : "Cek Status"}</button>
        <Link className="secondary-snap" href="/dashboard/customer/profile/orders">Lihat pesanan</Link>
        <Link className="secondary-snap" href="/dashboard/customer/catalog">Kembali ke katalog</Link>
      </div>
    </PaymentShell>
  );
}

function PaymentStatusSummary({ status }: { status: PaymentStatusData }) {
  return (
    <dl className="payment-status-grid">
      <div><dt>Payment status</dt><dd>{status.paymentStatus}</dd></div>
      <div><dt>Order status</dt><dd>{status.orderStatus}</dd></div>
      <div><dt>Transaksi</dt><dd>{status.transactionStatus ?? "-"}</dd></div>
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
