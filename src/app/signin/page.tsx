import { redirect } from "next/navigation";
import { auditPath } from "@/lib/constants";

/** Legacy redirect: /signin -> /audit/signin */
export default function LegacySigninRedirect() {
  redirect(auditPath("/signin"));
}
