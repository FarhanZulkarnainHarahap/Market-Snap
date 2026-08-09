"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { useEffect, useState } from "react";
import { FiArrowLeft, FiPrinter } from "react-icons/fi";
import { fetchInvoice } from "@/lib/api";

type InvoiceData = Awaited<ReturnType<typeof fetchInvoice>>;

export function InvoicePage() {
  const params = useParams<{ orderNumber: string }>();
  const orderNumber = decodeURIComponent(params.orderNumber ?? "");
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [message, setMessage] = useState(orderNumber ? "Memuat invoice..." : "Nomor order tidak ditemukan.");

  useEffect(() => {
    if (!orderNumber) return;
    fetchInvoice(orderNumber)
      .then((data) => {
        setInvoice(data);
        setMessage("");
      })
      .catch((error: unknown) => setMessage(error instanceof Error ? error.message : "Invoice belum dapat dimuat."));
  }, [orderNumber]);

  if (!invoice) {
    return (
      <main className="invoice-page">
        <section className="invoice-document">
          <p className="empty-copy">{message}</p>
          <Link className="secondary-snap print-hidden" href="/dashboard/customer/profile/orders"><FiArrowLeft /> Kembali ke riwayat pesanan</Link>
        </section>
      </main>
    );
  }

  const paid = invoice.paymentStatus === "PAID";
  const address = invoice.address;

  return (
    <main className="invoice-page">
      <section className="invoice-document">
        <div className="invoice-toolbar print-hidden">
          <Link className="secondary-snap" href="/dashboard/customer/profile/orders"><FiArrowLeft /> Riwayat pesanan</Link>
          <button className="primary-snap" onClick={() => window.print()} type="button"><FiPrinter /> Cetak invoice</button>
        </div>

        <header className="invoice-header">
          <div>
            <strong className="invoice-brand">Market-Snap</strong>
            <h1>INVOICE</h1>
          </div>
          <span className={paid ? "invoice-badge paid" : "invoice-badge"}>{paid ? "LUNAS" : "BELUM LUNAS"}</span>
        </header>

        <section className="invoice-meta-grid">
          <InfoBlock label="Nomor invoice" value={invoice.invoiceNumber} />
          <InfoBlock label="Nomor order" value={invoice.orderNumber} />
          <InfoBlock label="Tanggal order" value={formatDate(invoice.createdAt)} />
          <InfoBlock label="Tanggal pembayaran" value={invoice.paidAt ? formatDate(invoice.paidAt) : "-"} />
        </section>

        <section className="invoice-party-grid">
          <div>
            <h2>Pelanggan</h2>
            <p>{invoice.customer.name ?? "-"}</p>
            <small>{[invoice.customer.email, invoice.customer.phone].filter(Boolean).join(" - ") || "-"}</small>
          </div>
          <div>
            <h2>Pengiriman</h2>
            <p>{stringField(address.recipientName) || invoice.customer.name || "-"}</p>
            <small>{[stringField(address.detail), stringField(address.district), stringField(address.city), stringField(address.province), stringField(address.postalCode)].filter(Boolean).join(", ") || "-"}</small>
          </div>
          <div>
            <h2>Cabang</h2>
            <p>{invoice.store.name ?? "Market-Snap"}</p>
            <small>{invoice.store.city ?? "-"}</small>
          </div>
        </section>

        <div className="invoice-table">
          <div className="invoice-row invoice-row-head">
            <span>Produk</span>
            <span>Qty</span>
            <span>Harga</span>
            <span>Subtotal</span>
          </div>
          {invoice.items.map((item) => (
            <div className="invoice-row" key={item.id}>
              <span className="invoice-product">
                {item.image ? <Image alt={item.name} height={44} src={item.image} width={44} /> : <span className="invoice-product-placeholder" />}
                <b>{item.name}</b>
              </span>
              <span>{item.quantity}</span>
              <span>{rupiah(item.unitPrice ?? item.finalPrice ?? item.price ?? 0)}</span>
              <span>{rupiah(item.subtotal)}</span>
            </div>
          ))}
        </div>

        <section className="invoice-summary">
          <InvoiceTotal label="Subtotal produk" value={invoice.subtotal} />
          <InvoiceTotal label="Ongkir" value={invoice.shippingCost} />
          <InvoiceTotal label="Biaya layanan" value={invoice.serviceFee} />
          <InvoiceTotal label="Diskon" value={-invoice.discount} />
          <InvoiceTotal strong label="Grand total" value={invoice.grandTotal} />
        </section>

        <section className="invoice-payment-grid">
          <InfoBlock label="Metode pembayaran" value={invoice.paymentMethod ?? "-"} />
          <InfoBlock label="Channel pembayaran" value={invoice.paymentChannel || "-"} />
          <InfoBlock label="Status pembayaran" value={invoice.paymentStatus} />
          <InfoBlock label="Status pesanan" value={invoice.orderStatus} />
          <InfoBlock label="Transaction ID" value={invoice.transactionId ?? "-"} />
        </section>
      </section>
    </main>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return <div className="invoice-info"><span>{label}</span><strong>{value}</strong></div>;
}

function InvoiceTotal({ label, strong = false, value }: { label: string; strong?: boolean; value: number }) {
  return <p className={strong ? "strong" : ""}><span>{label}</span><b>{rupiah(value)}</b></p>;
}

function stringField(value: unknown) {
  return typeof value === "string" ? value : "";
}

function rupiah(value: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}

function formatDate(value: string) {
  return format(new Date(value), "dd MMM yyyy, HH:mm", { locale: idLocale });
}
