"use client";

import { useState } from "react";
import { currentUserHeaders } from "../../lib/api";
import { apiUrl } from "../../lib/api-url";
import { ManagementHeader } from "../dashboard/ManagementHeader";
import { SnapHeader } from "../snap/SnapCommon";

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

export function CreateResourceForm({ active, description, endpoint, fields, method = "POST", role, title }: CreateResourceFormProps) {
  const [message, setMessage] = useState("Lengkapi data dengan benar sebelum menyimpan.");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const body = formBody(new FormData(event.currentTarget));
      const response = await fetch(apiUrl(endpoint), { method, headers: headers(role), body: JSON.stringify(body) });
      if (!response.ok) throw new Error(await responseMessage(response));
      event.currentTarget.reset();
      setMessage("Data berhasil disimpan.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Data belum berhasil disimpan.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <FormHeader active={active} role={role} />
      <main className="auth-shell">
        <section className="auth-panel wide-form">
          <span className="mini-label">Form data</span>
          <h1>{title}</h1>
          <p>{description}</p>
          <p className="status-pill">{message}</p>
          <form className="form-grid" onSubmit={submit}>
            {fields.map((field) => <FieldInput field={field} key={field.name} />)}
            <button className="primary-button" disabled={submitting} type="submit">{submitting ? "Menyimpan..." : "Simpan"}</button>
          </form>
        </section>
      </main>
    </>
  );
}

function FormHeader({ active, role }: { active: string; role: Role }) {
  if (role === "admin" || role === "adminStore") return <ManagementHeader role={role} />;
  return <SnapHeader active={snapActive(active)} />;
}

function snapActive(active: string): "home" | "catalog" | "about" | "contact" {
  if (active === "catalog") return "catalog";
  if (active === "about") return "about";
  if (active === "contact") return "contact";
  return "home";
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
  if (role !== "public") {
    return { ...currentUserHeaders(), "Content-Type": "application/json" };
  }
  return { "Content-Type": "application/json" };
}

async function responseMessage(response: Response) {
  const payload = await response.json().catch(() => null) as { message?: string } | null;
  return payload?.message ?? "Permintaan belum berhasil diproses.";
}
