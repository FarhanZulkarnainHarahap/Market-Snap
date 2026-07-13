import { redirect } from "next/navigation";

export default function CustomerAddressRedirectPage() {
  redirect("/dashboard/customer/profile/addresses");
}
