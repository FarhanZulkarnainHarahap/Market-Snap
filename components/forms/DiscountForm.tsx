import { CreateResourceForm } from "@/components/forms/CreateResourceForm";

type DiscountFormProps = {
  endpoint: string;
  role: "admin" | "adminStore";
  title: string;
};

export function DiscountForm({ endpoint, role, title }: DiscountFormProps) {
  return (
    <CreateResourceForm
      active={role}
      description="Buat promo dengan periode aktif, quota, minimum belanja, dan tipe potongan."
      endpoint={endpoint}
      fields={[
        { name: "title", label: "Nama promo", required: true },
        { name: "code", label: "Kode voucher", placeholder: "SNAPDEAL" },
        { name: "type", label: "Jenis voucher", type: "select", options: [{ label: "Cart", value: "cart" }, { label: "Shipping", value: "shipping" }, { label: "Product", value: "product" }] },
        { name: "discountType", label: "Tipe diskon", type: "select", options: [{ label: "Percentage", value: "percentage" }, { label: "Nominal", value: "nominal" }] },
        { name: "value", label: "Nilai", required: true, type: "number" },
        { name: "maxDiscount", label: "Maksimal potongan", type: "number" },
        { name: "minSpend", label: "Minimal belanja", type: "number" },
        { name: "expiresAt", label: "Expired date", required: true, type: "date" }
      ]}
      role={role}
      title={title}
    />
  );
}
