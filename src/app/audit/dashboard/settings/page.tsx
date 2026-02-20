import { redirect } from "next/navigation";
import { auditPath } from "@/lib/constants";

export const metadata = {
  title: "Settings — Vault",
  description: "Organisation and user settings.",
};

/** Redirect legacy /settings to My account. */
export default function SettingsPage() {
  redirect(auditPath("/dashboard/settings/account"));
}
