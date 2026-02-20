import Link from "next/link";
import shared from "../shared.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Security & Hosting — GDPR Evidence",
  description:
    "How we keep your data secure: EU hosting, encryption, access controls, audit logs, and incident response. Factual and trust-focused.",
};

const LAST_UPDATED = "18 February 2025";

export default function SecurityPage() {
  return (
    <div className={shared.page}>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <section className={shared.hero}>
          <div className={shared.container}>
            <h1 className={shared.heroTitle}>Security &amp; Hosting</h1>
            <p className={shared.legalUpdated}>Last updated: {LAST_UPDATED}</p>
            <p className={shared.heroSub}>
              We keep your GDPR evidence secure and hosted in the EU. This page gives a clear, factual overview of how we protect your data. This is not legal advice.
            </p>
            <p className={shared.legalHubLink}>
              <Link href="/legal" className={shared.footerLink}>
                Legal hub
              </Link>
            </p>
          </div>
        </section>

        <section className={shared.section}>
          <div className={shared.container}>
            <div className={shared.bodyCopy}>
              <h2 className={shared.sectionTitle}>Hosting location</h2>
              <p>Your workspace data is stored in the European Union. We use EU-based infrastructure for core storage so that your data remains within a GDPR-friendly jurisdiction. We do not rely on third-country transfers for the primary storage of your compliance records.</p>

              <h2 className={shared.sectionTitle}>Encryption</h2>
              <p>Data in transit between your device and our servers is protected using TLS (HTTPS). Where applicable, we use encryption at rest for stored data. We do not claim certifications we do not hold; we describe our practices honestly so you can assess them for your own compliance needs.</p>

              <h2 className={shared.sectionTitle}>Backups</h2>
              <p>We take backups of your data to support recovery in the event of failure or incident. Backups are stored securely and in line with our retention policy. We do not use backup data for any purpose other than recovery and operational continuity.</p>

              <h2 className={shared.sectionTitle}>Access controls and least privilege</h2>
              <p>Access to the service and to your data is controlled by authentication (e.g. sign-in) and role-based permissions. Within a workspace, owners and admins can manage users and roles (e.g. editor, viewer). We apply the principle of least privilege: our team only accesses your data when necessary for support, security, or legal obligations, and such access is logged and limited.</p>

              <h2 className={shared.sectionTitle}>Audit logs</h2>
              <p>Key actions in the service (e.g. sign-in, user changes, exports) are logged. These logs support security monitoring, troubleshooting, and your own accountability. They help you demonstrate who did what and when, which is useful for audits and compliance.</p>

              <h2 className={shared.sectionTitle}>Incident response</h2>
              <p>We have procedures to detect, assess, and respond to security incidents. If a personal data breach occurs that is likely to pose a risk to your rights, we will notify you without undue delay and provide information to help you meet your notification obligations. We will also take steps to contain and remedy the incident. See our <Link href="/data-processing" className={shared.footerLink}>Data Processing</Link> page for more on breach notification.</p>

              <h2 className={shared.sectionTitle}>Subprocessors</h2>
              <p>We use a small number of subprocessors (e.g. for hosting, email, and payments). We select them with care and require them to protect your data by contract. A list is available on request—contact <a href="mailto:privacy@gdprevidence.ie" className={shared.footerLink}>privacy@gdprevidence.ie</a>.</p>

              <h2 className={shared.sectionTitle}>Vulnerability management</h2>
              <p>We keep our systems and dependencies updated and address known vulnerabilities in line with risk. We do not disclose detailed security configurations publicly to avoid exposing weaknesses. If you discover a vulnerability, please report it responsibly to <a href="mailto:support@gdprevidence.ie" className={shared.footerLink}>support@gdprevidence.ie</a>.</p>

              <h2 className={shared.sectionTitle}>Data isolation per workspace</h2>
              <p>Your workspace data is logically isolated from other customers. We do not mix your data with other users&apos; data, and access is controlled so that only authorised users in your workspace can see it (subject to your role settings).</p>

              <h2 className={shared.sectionTitle}>GDPR alignment</h2>
              <p>We design and operate the service with GDPR in mind: data minimisation, purpose limitation, security, and your rights. We act as a processor when we process data you store in the service; you remain the controller. For more detail, see our <Link href="/privacy" className={shared.footerLink}>Privacy Policy</Link> and <Link href="/data-processing" className={shared.footerLink}>Data Processing</Link> page.</p>
              <p><strong>This is not legal advice.</strong></p>
            </div>
            <p className={shared.legalHubLink} style={{ marginTop: "var(--theme-space-6)" }}>
              <Link href="/legal" className={shared.footerLink}>
                Legal hub
              </Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
