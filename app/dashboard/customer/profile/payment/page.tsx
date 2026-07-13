import { redirect } from "next/navigation";

export default function CustomerPaymentPage() {
  redirect("/dashboard/customer/profile/payment-methods");
}
