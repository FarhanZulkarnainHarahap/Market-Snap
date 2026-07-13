import { redirect } from "next/navigation";

type Props = { params: Promise<{ token: string }> };

export default async function AuthResetPasswordTokenPage({ params }: Props) {
  const { token } = await params;
  redirect(`/reset-password?token=${encodeURIComponent(token)}`);
}
