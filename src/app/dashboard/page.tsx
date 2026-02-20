import { redirect } from "next/navigation";
import { auditPath } from "@/lib/constants";

/** Legacy redirect: /dashboard -> /audit/dashboard */
export default function LegacyDashboardRedirect() {
  redirect(auditPath("/dashboard"));
}
