"use client";

import { useState } from "react";
import { Header } from "../Header";

type Role = "customer" | "admin" | "adminStore" | "public";

type Field = {
  name: string;
  label: string;
  type?: "text" | "email" | "number" | "password" | "date" | "select";
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
};

type CreateResourceFormProps = {
  active: string;
  description: string;
  endpoint: string;
  fields: Field[];
  method?: "POST" | "PATCH";
  role: Role;
  title: string;
};

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:4100/api";
const roleUserId = { customer: "u-user", admin: "u-super", adminStore: "u-store-1", public: "" };

export function CreateResourceForm({ active, description, endpoint, fields, method = "POST", role, title }: CreateResourceFormProps) {
  const [message, setMessage] = useState("Siap submit ke API.");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const body = formBody(new FormData(event.currentTarget));
      const response = await fetch(`${apiBase}${endpoint}`, { method, headers: headers(role), body: JSON.stringify(body) });
      if (!response.ok) throw new Error(await responseMessage(response));
      event.currentTarget.reset();
      setMessage("Data berhasil dibuat dari web ke API.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal submit data.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Header active={active} />
      <main className="auth-shell">
        <section className="auth-panel wide-form">
          <span className="mini-label">Create via API</span>
          <h1>{title}</h1>
          <p>{description}</p>
          <p className="api-pill is-online">{message}</p>
          <form className="form-grid" onSubmit={submit}>
            {fields.map((field) => <FieldInput field={field} key={field.name} />)}
            <button className="primary-button" disabled={submitting} type="submit">{submitting ? "Menyimpan..." : "Simpan"}</button>
          </form>
        </section>
      </main>
    </>
  );
}

function FieldInput({ field }: { field: Field }) {
  if (field.type === "select") {
    return (
      <label>{field.label}
        <select name={field.name} required={field.required}>
          {field.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </label>
    );
  }
  return (
    <label>{field.label}
      <input
        name={field.name}
        placeholder={field.placeholder}
        required={field.required}
        step={field.type === "number" ? "any" : undefined}
        type={field.type ?? "text"}
      />
    </label>
  );
}

function formBody(formData: FormData) {
  return Object.fromEntries(Array.from(formData.entries()).filter(([, value]) => String(value).trim() !== ""));
}

function headers(role: Role): Record<string, string> {
  const userId = roleUserId[role];
  return userId ? { "Content-Type": "application/json", "x-user-id": userId } : { "Content-Type": "application/json" };
}

async function responseMessage(response: Response) {
  const payload = await response.json().catch(() => null) as { message?: string } | null;
  return payload?.message ?? "Request API gagal.";
}
