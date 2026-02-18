import Link from "next/link";
import shared from "../shared.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Data Processing — GDPR Evidence",
  description:
    "How GDPR Evidence acts as a processor for your data. DPA overview, subprocessors, security, and international transfers.",
};

const LAST_UPDATED = "18 February 2025";

export default function DataProcessingPage() {
  return (
    <div className={shared.page}>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <section className={shared.hero}>
          <div className={shared.container}>
            <h1 className={shared.heroTitle}>Data Processing</h1>
            <p className={shared.legalUpdated}>Last updated: {LAST_UPDATED}</p>
            <p className={shared.heroSub}>
              This page summarises how we process personal data on your behalf when you use GDPR Evidence. You are the controller; we are the processor. A full Data Processing Agreement (DPA) is available on request. This is not legal advice.
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
              <h2 className={shared.sectionTitle}>Roles</h2>
              <p><strong>You (the customer)</strong> are the data controller: you decide why and how personal data in your workspace is processed. <strong>GDPR Evidence (Go Solutions)</strong> is the data processor: we process that data only on your documented instructions to provide and support the service.</p>

              <h2 className={shared.sectionTitle}>Scope of processing</h2>
              <p>We process personal data only to:</p>
              <ul className={shared.bulletList}>
                <li>Provide the GDPR Evidence service (hosting, storing, displaying, and exporting the data you add).</li>
                <li>Manage your account, workspace, and user access.</li>
                <li>Support you (e.g. when you contact us).</li>
                <li>Comply with law and protect the security of the service.</li>
              </ul>
              <p>We do not use your data for our own purposes (e.g. advertising or selling). We process it only as necessary to perform the contract and as set out in our <Link href="/privacy" className={shared.footerLink}>Privacy Policy</Link>.</p>

              <h2 className={shared.sectionTitle}>Types of personal data processed</h2>
              <p>The data is defined by you. It typically includes:</p>
              <ul className={shared.bulletList}>
                <li>Account and workspace data: names, email addresses, and organisation details of you and your team.</li>
                <li>Content you upload or create: records of processing activities (RoPA), data subject requests, incident reports, and any documents or notes that may contain personal data. You decide what to store; we process it on your instructions.</li>
              </ul>
              <p>We also process technical data (e.g. IP addresses, logs) as necessary for security and operation, as described in our Privacy Policy.</p>

              <h2 className={shared.sectionTitle}>Subprocessors</h2>
              <p>We use a small number of subprocessors (e.g. for hosting, email, and payment processing). We choose them with care and require them to protect your data by contract. A list of subprocessors is available on request—contact <a href="mailto:privacy@gdprevidence.ie" className={shared.footerLink}>privacy@gdprevidence.ie</a>. We will notify you of any new subprocessors and give you an opportunity to object where required by law.</p>

              <h2 className={shared.sectionTitle}>Security measures</h2>
              <p>We implement technical and organisational measures to protect your data, including:</p>
              <ul className={shared.bulletList}>
                <li>Encryption in transit (TLS) and, where applicable, at rest.</li>
                <li>Access controls and role-based permissions.</li>
                <li>Audit logs and monitoring.</li>
                <li>Secure development and access policies.</li>
              </ul>
              <p>For more detail, see our <Link href="/security" className={shared.footerLink}>Security & Hosting</Link> page.</p>

              <h2 className={shared.sectionTitle}>Data breach notification</h2>
              <p>If we become aware of a personal data breach that is likely to result in a risk to your rights and freedoms, we will notify you without undue delay and provide information to help you meet your own notification obligations to regulators or data subjects. We will also take steps to contain and remedy the breach.</p>

              <h2 className={shared.sectionTitle}>Data deletion on termination</h2>
              <p>When you stop using the service or close your account, we will delete or anonymise the personal data we process on your behalf within the timeframe set out in our retention policy (and in any DPA we sign with you). Backups may be retained for a short period and then overwritten. We will confirm deletion on request where required by contract or law.</p>

              <h2 className={shared.sectionTitle}>Audit and compliance support</h2>
              <p>We can provide information reasonably needed to demonstrate our compliance with our processor obligations (e.g. summaries of security measures or subprocessor list). For more extensive audits, we may agree terms separately. You remain responsible for your own compliance as controller.</p>

              <h2 className={shared.sectionTitle}>International transfers and SCCs</h2>
              <p>Your data is hosted in the European Union. We do not rely on third-country transfers for core storage. If any subprocessor is outside the EEA, we use appropriate safeguards (e.g. Standard Contractual Clauses approved by the European Commission) and will disclose this in our subprocessor list or in the full DPA. You can request a copy of the DPA and any relevant transfer safeguards from <a href="mailto:privacy@gdprevidence.ie" className={shared.footerLink}>privacy@gdprevidence.ie</a>.</p>

              <h2 className={shared.sectionTitle}>Full DPA</h2>
              <p>A full Data Processing Agreement is available on request. Contact us at <a href="mailto:privacy@gdprevidence.ie" className={shared.footerLink}>privacy@gdprevidence.ie</a> or <a href="mailto:support@gdprevidence.ie" className={shared.footerLink}>support@gdprevidence.ie</a>. We can provide a downloadable copy or sign a customer-specific DPA where needed.</p>
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
