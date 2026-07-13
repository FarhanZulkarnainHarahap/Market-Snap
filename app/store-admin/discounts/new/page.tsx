import { DiscountForm } from "@/components/forms/DiscountForm";

export default function StoreAdminCreateDiscountPage() {
  return <DiscountForm endpoint="/store-admin/discounts" role="adminStore" title="Create Store Discount" />;
}
