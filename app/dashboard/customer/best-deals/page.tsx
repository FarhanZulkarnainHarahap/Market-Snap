import { redirect } from "next/navigation";

export default function CustomerBestDealsPage() {
  redirect("/dashboard/customer/catalog?promo=true");
}
