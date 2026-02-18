import Header from "@/components/Header";
import { ResetPasswordPageClient } from "./ResetPasswordPageClient";
import shared from "../shared.module.css";

export const metadata = {
  title: "Set a new password — GDPR Evidence",
  description: "Set a new password for your GDPR Evidence workspace using the link from your email.",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  const token =
    typeof params.token === "string" && params.token.trim() !== ""
      ? params.token.trim()
      : null;

  return (
    <div className={shared.page}>
      <Header authVariant />

      <main id="main-content" tabIndex={-1}>
        <section className={shared.section}>
          <div className={shared.container} style={{ maxWidth: "480px", margin: "0 auto" }}>
            <ResetPasswordPageClient token={token} />
          </div>
        </section>
      </main>

      <footer className={shared.footer}>
        <div className={shared.container}>
          <div className={shared.footerTrust}>
            <span>EU-hosted data</span>
            <span>Secure access controls</span>
            <span>Clear audit trails</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
