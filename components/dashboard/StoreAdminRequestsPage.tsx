"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { FiCheck, FiRefreshCw, FiSearch, FiUserCheck, FiX } from "react-icons/fi";
import { approveStoreAdminRequest, fetchAdminStoreAdminRequests, fetchStores, rejectStoreAdminRequest } from "@/lib/api";
import type { ApiStoreAdminRequest } from "@/lib/api-contracts";
import type { Store } from "@/lib/types";
import { ManagementHeader } from "./ManagementHeader";

const statusOptions = [
  { label: "Semua", value: "" },
  { label: "Menunggu", value: "PENDING" },
  { label: "Disetujui", value: "APPROVED" },
  { label: "Ditolak", value: "REJECTED" },
  { label: "Dibatalkan", value: "CANCELLED" }
];

const requestColumn = createColumnHelper<never, ApiStoreAdminRequest>();

export function StoreAdminRequestsPage() {
  const [requests, setRequests] = useState<ApiStoreAdminRequest[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [refreshTick, setRefreshTick] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ApiStoreAdminRequest | null>(null);
  const [storeId, setStoreId] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [mode, setMode] = useState<"approve" | "reject" | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadData() {
      setLoading(true);
      setMessage("");
      const params = new URLSearchParams();
      if (status) params.set("status", status);
      if (submittedSearch) params.set("search", submittedSearch);
      try {
        const [requestPayload, storeData] = await Promise.all([fetchAdminStoreAdminRequests(params), fetchStores()]);
        if (!active) return;
        setRequests(requestPayload.data);
        setCounts(requestPayload.counts ?? {});
        setStores(storeData);
      } catch (error) {
        if (active) setMessage(error instanceof Error ? error.message : "Pengajuan belum dapat dimuat.");
      } finally {
        if (active) setLoading(false);
      }
    }
    void loadData();
    return () => {
      active = false;
    };
  }, [refreshTick, status, submittedSearch]);

  function openAction(request: ApiStoreAdminRequest, nextMode: "approve" | "reject") {
    setSelected(request);
    setMode(nextMode);
    setStoreId(request.requestedStore?.id ?? stores[0]?.id ?? "");
    setRejectReason("");
    setMessage("");
  }

  async function submitAction(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected || !mode) return;
    setSubmitting(true);
    setMessage("");
    try {
      const response = mode === "approve"
        ? await approveStoreAdminRequest(selected.id, storeId)
        : await rejectStoreAdminRequest(selected.id, rejectReason.trim());
      setMessage(response.message);
      setSelected(null);
      setMode(null);
      setRefreshTick((value) => value + 1);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Pengajuan belum dapat diproses.");
    } finally {
      setSubmitting(false);
    }
  }

  const metrics = useMemo(() => [
    { label: "Menunggu", value: counts.PENDING ?? requests.filter((item) => item.status === "PENDING").length },
    { label: "Disetujui", value: counts.APPROVED ?? requests.filter((item) => item.status === "APPROVED").length },
    { label: "Ditolak", value: counts.REJECTED ?? requests.filter((item) => item.status === "REJECTED").length },
    { label: "Total tampil", value: requests.length }
  ], [counts, requests]);
  const columns = useMemo(() => [
    requestColumn.accessor((request) => request.user.name, { id: "name" }),
    requestColumn.accessor("status", { id: "status" }),
    requestColumn.accessor((request) => request.requestedStore?.name ?? "", { id: "store" }),
    requestColumn.accessor("createdAt", { id: "createdAt" })
  ], []);
  const tableRows = useMemo(() => requests.map((request) => ({ id: request.id, original: request, columnCount: columns.length })), [columns.length, requests]);

  return (
    <>
      <ManagementHeader role="admin" />
      <main className="dashboard-shell management-content">
        <section className="page-heading dashboard-heading management-hero">
          <div>
            <span className="mini-label">Super Admin</span>
            <h1>Pengajuan Store Admin</h1>
            <p>Review customer yang ingin menjadi Store Admin, pilih cabang, lalu setujui atau tolak dengan alasan yang jelas.</p>
            <span className="status-pill">{loading ? "Memuat data..." : "Data approval terbaru"}</span>
          </div>
        </section>
        <section className="management-metric-grid">
          {metrics.map((metric) => (
            <article className="metric-card management-metric" key={metric.label}><i><FiUserCheck /></i><span>{metric.label}</span><strong>{metric.value}</strong><small>Store Admin request</small></article>
          ))}
        </section>
        <section className="admin-panel management-table-card request-admin-card">
          <div className="management-panel-head">
            <div>
              <span>Approval</span>
              <h2>Daftar pengajuan</h2>
            </div>
            <button onClick={() => setRefreshTick((value) => value + 1)} type="button"><FiRefreshCw /> Sinkronkan</button>
          </div>
          <form className="request-admin-filter" onSubmit={(event) => { event.preventDefault(); setSubmittedSearch(search.trim()); }}>
            <label><FiSearch /><input onChange={(event) => setSearch(event.target.value)} placeholder="Cari nama, email, atau alasan" value={search} /></label>
            <select onChange={(event) => setStatus(event.target.value)} value={status}>
              {statusOptions.map((option) => <option key={option.value || "all"} value={option.value}>{option.label}</option>)}
            </select>
            <button type="submit">Cari</button>
          </form>
          {message && <p className="account-message">{message}</p>}
          {requests.length ? (
            <div className="request-admin-list">
              {tableRows.map((row) => {
                const request = row.original;
                return (
                <article className="request-admin-row" key={request.id}>
                  <div>
                    <span className={`request-status ${request.status.toLowerCase()}`}>{requestStatusLabel(request.status)}</span>
                    <h3>{request.user.name}</h3>
                    <p>{request.user.email} · {request.user.phone ?? "Nomor HP belum ada"}</p>
                    <small>Cabang pilihan: {request.requestedStore?.name ?? "Belum memilih"} · Diajukan {formatDateTime(request.createdAt)}</small>
                    <blockquote>{request.reason}</blockquote>
                    {request.experience && <small>Pengalaman: {request.experience}</small>}
                    {request.rejectionReason && <small>Alasan ditolak: {request.rejectionReason}</small>}
                  </div>
                  <div className="request-admin-actions">
                    {request.status === "PENDING" ? (
                      <>
                        <button onClick={() => openAction(request, "approve")} type="button"><FiCheck /> Setujui</button>
                        <button className="danger" onClick={() => openAction(request, "reject")} type="button"><FiX /> Tolak</button>
                      </>
                    ) : <strong>{request.assignedStore?.name ?? request.reviewedBy?.name ?? "Selesai direview"}</strong>}
                  </div>
                </article>
                );
              })}
            </div>
          ) : (
            <div className="management-empty-panel">
              <strong>Belum ada pengajuan</strong>
              <span>Pengajuan customer akan muncul otomatis setelah dikirim dari halaman profil.</span>
            </div>
          )}
        </section>
      </main>
      {selected && mode && (
        <div className="account-modal-backdrop">
          <section aria-modal="true" className="account-modal request-action-modal" role="dialog">
            <button aria-label="Tutup" className="account-modal-close" onClick={() => { setSelected(null); setMode(null); }} type="button"><FiX /></button>
            <span className="account-modal-icon">{mode === "approve" ? <FiCheck /> : <FiX />}</span>
            <h2>{mode === "approve" ? "Setujui Store Admin" : "Tolak pengajuan"}</h2>
            <p>{selected.user.name} · {selected.user.email}</p>
            <form className="account-form single" onSubmit={submitAction}>
              {mode === "approve" ? (
                <label>Cabang assignment
                  <select onChange={(event) => setStoreId(event.target.value)} required value={storeId}>
                    {stores.map((store) => <option key={store.id} value={store.id}>{store.name} - {store.area}</option>)}
                  </select>
                </label>
              ) : (
                <label>Alasan penolakan
                  <textarea minLength={5} onChange={(event) => setRejectReason(event.target.value)} required rows={4} value={rejectReason} />
                </label>
              )}
              <button className="primary-snap" disabled={submitting || (mode === "approve" && !storeId)} type="submit">{submitting ? "Memproses..." : mode === "approve" ? "Setujui pengajuan" : "Tolak pengajuan"}</button>
            </form>
          </section>
        </div>
      )}
    </>
  );
}

function requestStatusLabel(status: ApiStoreAdminRequest["status"]) {
  const labels: Record<ApiStoreAdminRequest["status"], string> = {
    APPROVED: "Disetujui",
    CANCELLED: "Dibatalkan",
    PENDING: "Menunggu",
    REJECTED: "Ditolak"
  };
  return labels[status];
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("id-ID", { day: "2-digit", hour: "2-digit", minute: "2-digit", month: "short", year: "numeric" });
}
