import Link from "next/link";
import shared from "../shared.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Security — GDPR Evidence",
  description:
    "How we handle your data: EU hosting, access controls, and audit trails. No fear-mongering — just clear facts.",
};

export default function SecurityPage() {
  return (
    <div className={shared.page}>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <section className={shared.hero}>
          <div className={shared.container}>
            <h1 className={shared.heroTitle}>
              Security &amp; data hosting
            </h1>
            <p className={shared.heroSub}>
              We keep your GDPR evidence secure and in the EU. Here’s a short overview — no jargon.
            </p>
          </div>
        </section>

        <section className={shared.section}>
          <div className={shared.container}>
            <h2 className={shared.sectionTitle}>Where your data lives</h2>
            <div className={shared.bodyCopy}>
              <p>
                Workspace data is stored in the European Union. We don’t rely on third-country transfers for core storage, so your records stay within a GDPR-friendly jurisdiction.
              </p>
            </div>
          </div>
        </section>

        <section className={`${shared.section} ${shared.sectionAlt}`}>
          <div className={shared.container}>
            <h2 className={shared.sectionTitle}>Access and controls</h2>
            <div className={shared.bodyCopy}>
              <p>
                Access to workspaces is controlled by role (e.g. owner, member). We use standard security practices: encrypted connections, secure authentication, and no sharing of your data with third parties for advertising or selling.
              </p>
            </div>
          </div>
        </section>

        <section className={shared.section}>
          <div className={shared.container}>
            <h2 className={shared.sectionTitle}>Audit trails</h2>
            <div className={shared.bodyCopy}>
              <p>
                Key actions in your workspace are logged so you can see who did what and when. That supports your own accountability and makes it easier to answer questions from auditors or regulators.
              </p>
            </div>
          </div>
        </section>

        <section className={`${shared.section} ${shared.sectionAlt}`}>
          <div className={shared.container}>
            <p className={shared.bodyCopy}>
              For full details, see our{" "}
              <Link href="/privacy" className={shared.footerLink}>
                Privacy Policy
              </Link>
              . Questions?{" "}
              <Link href="/contact" className={shared.footerLink}>
                Contact us
              </Link>
              .
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
