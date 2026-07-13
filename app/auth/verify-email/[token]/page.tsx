import { redirect } from "next/navigation";

type Props = { params: Promise<{ token: string }> };

export default async function AuthVerifyEmailTokenPage({ params }: Props) {
  const { token } = await params;
  redirect(`/verify-email?token=${encodeURIComponent(token)}`);
}
