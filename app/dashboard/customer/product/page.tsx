import { redirect } from "next/navigation";

export default function CustomerProductIndexPage() {
  redirect("/dashboard/customer/catalog");
}
