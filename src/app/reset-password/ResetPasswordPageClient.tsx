"use client";

import { ResetPasswordForm } from "./ResetPasswordForm";

type Props = {
  token: string | null;
};

export function ResetPasswordPageClient({ token }: Props) {
  return <ResetPasswordForm token={token} />;
}
