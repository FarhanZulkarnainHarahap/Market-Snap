import { DiscountForm } from "@/components/forms/DiscountForm";

export default function SuperAdminCreateDiscountPage() {
  return <DiscountForm endpoint="/super-admin/discounts" role="admin" title="Create Discount" />;
}
