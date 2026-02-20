import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/auth";
import { auditPath } from "@/lib/constants";
import { getOrgContext } from "@/lib/org";
import { ROPA_TEMPLATES } from "@/lib/ropaTemplates";
import { ImportTemplatesForm } from "./ImportTemplatesForm";
import shared from "../../../../shared.module.css";

export const metadata = {
  title: "RoPA Templates — Vault",
  description: "Start with prebuilt RoPA templates and adapt them to your organisation.",
};

export default async function RopaTemplatesPage() {
  const userId = await getSessionUserId();
  if (!userId) redirect(auditPath("/signin"));
  const ctx = await getOrgContext(userId);
  if (!ctx) redirect(auditPath("/signin"));

  return (
    <main id="main-content" className={shared.section}>
      <div className={shared.container}>
        <ImportTemplatesForm templates={ROPA_TEMPLATES} />
      </div>
    </main>
  );
}
