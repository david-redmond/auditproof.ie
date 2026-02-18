import Link from "next/link";
import shared from "../shared.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy — GDPR Evidence",
  description:
    "How GDPR Evidence (Go Solutions) collects, uses, and protects your personal data. EU-hosted. We do not sell your data.",
};

const LAST_UPDATED = "18 February 2025";

export default function PrivacyPage() {
  return (
    <div className={shared.page}>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <section className={shared.hero}>
          <div className={shared.container}>
            <h1 className={shared.heroTitle}>Privacy Policy</h1>
            <p className={shared.legalUpdated}>Last updated: {LAST_UPDATED}</p>
            <p className={shared.heroSub}>
              This policy explains what personal data we collect, why we collect it, and how we protect it. We do not sell your personal data. This tool helps you record and demonstrate compliance; it does not provide legal advice.
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
              <h2 className={shared.sectionTitle}>Who we are</h2>
              <p>
                The service is operated by <strong>Go Solutions</strong> (trading as <strong>GDPR Evidence</strong>). Our website is <a href="https://gdprevidence.ie" className={shared.footerLink}>https://gdprevidence.ie</a> (placeholder). For the purposes of data protection law, we are the data controller for the personal data we collect in connection with this service. You can contact us at: [INSERT COMPANY ADDRESS]. Email: <a href="mailto:support@gdprevidence.ie" className={shared.footerLink}>support@gdprevidence.ie</a>. For data protection and privacy enquiries: <a href="mailto:privacy@gdprevidence.ie" className={shared.footerLink}>privacy@gdprevidence.ie</a>.
              </p>

              <h2 className={shared.sectionTitle}>What personal data we collect</h2>
              <p>We collect only what we need to run the service and support you:</p>
              <ul className={shared.bulletList}>
                <li><strong>Account and workspace data:</strong> name, email address, password (stored hashed), and the organisation name you give when you create a workspace.</li>
                <li><strong>Content you add:</strong> records of processing activities (RoPA), data subject requests, incidents, and any documents or notes you upload. This data is defined by you and may contain personal data; we process it on your instructions as your processor (see our <Link href="/data-processing" className={shared.footerLink}>Data Processing</Link> page).</li>
                <li><strong>Customer support data:</strong> when you contact us, we keep your message and our reply so we can help you and improve the service.</li>
                <li><strong>Payment/billing data (if applicable):</strong> if you subscribe to a paid plan, we or our payment provider process billing details (e.g. email, payment method) to fulfil the contract. We do not store full card numbers.</li>
                <li><strong>Technical and security data:</strong> IP address, browser type, logs of sign-in and key actions (e.g. who invited a user, when an export was generated) for security, fraud prevention, and troubleshooting.</li>
                <li><strong>Cookies and analytics:</strong> we use essential cookies to keep you signed in and, where you have consented, analytics cookies to understand how the site is used. See our <Link href="/cookies" className={shared.footerLink}>Cookie Policy</Link>.</li>
              </ul>

              <h2 className={shared.sectionTitle}>Why we collect it (lawful basis)</h2>
              <p>We use your data only where we have a lawful basis:</p>
              <ul className={shared.bulletList}>
                <li><strong>Contract:</strong> to create and manage your account, provide the service, and handle billing.</li>
                <li><strong>Legitimate interests:</strong> to secure the service, prevent abuse, and improve it (e.g. analytics where consented).</li>
                <li><strong>Legal obligation:</strong> where we must keep certain records (e.g. for tax or regulatory purposes).</li>
                <li><strong>Consent:</strong> where we ask for it explicitly (e.g. non-essential cookies or marketing, if we offer it).</li>
              </ul>

              <h2 className={shared.sectionTitle}>Data retention</h2>
              <p>We keep your data only as long as needed:</p>
              <ul className={shared.bulletList}>
                <li>Account and workspace data: until you close your account or ask us to delete it, plus a short period for backups and legal obligations.</li>
                <li>Support and logs: for a limited period for security and support, then deleted or anonymised.</li>
                <li>Billing records: as required by law (e.g. tax).</li>
              </ul>
              <p>When you delete your account, we delete or anonymise your personal data in line with our retention policy and the terms in our <Link href="/data-processing" className={shared.footerLink}>Data Processing</Link> page.</p>

              <h2 className={shared.sectionTitle}>Data processors and subprocessors</h2>
              <p>We use a small number of trusted subprocessors to run the service (e.g. hosting, email, payment processing). We choose them with care and bind them by contract to protect your data. A list of subprocessors is available on request (contact <a href="mailto:privacy@gdprevidence.ie" className={shared.footerLink}>privacy@gdprevidence.ie</a>). We do not sell your data to any third party.</p>

              <h2 className={shared.sectionTitle}>International transfers</h2>
              <p>Your data is hosted in the European Union. We do not rely on third-country transfers for core storage. If any subprocessor is outside the EEA, we use appropriate safeguards (e.g. Standard Contractual Clauses approved by the European Commission) and will say so in our subprocessor list or on request.</p>

              <h2 className={shared.sectionTitle}>Security</h2>
              <p>We use technical and organisational measures to protect your data: encryption in transit (TLS), access controls, role-based permissions, audit logs, and secure development practices. For more detail, see our <Link href="/security" className={shared.footerLink}>Security & Hosting</Link> page.</p>

              <h2 className={shared.sectionTitle}>Your rights under the GDPR</h2>
              <p>You have the right to:</p>
              <ul className={shared.bulletList}>
                <li>Access your personal data and receive a copy.</li>
                <li>Rectify inaccurate data.</li>
                <li>Request erasure in certain circumstances.</li>
                <li>Restrict processing in certain circumstances.</li>
                <li>Object to processing based on legitimate interests.</li>
                <li>Data portability (receive your data in a machine-readable format).</li>
                <li>Withdraw consent where we rely on it.</li>
                <li>Lodge a complaint with a supervisory authority.</li>
              </ul>
              <p>To exercise these rights, contact us at <a href="mailto:privacy@gdprevidence.ie" className={shared.footerLink}>privacy@gdprevidence.ie</a>. We will respond within one month. You may also use your account settings to access, update, or delete some of your data.</p>

              <h2 className={shared.sectionTitle}>Complaints</h2>
              <p>If you are not satisfied with how we handle your data, you have the right to complain to a data protection authority. If you are in Ireland, you may contact the Data Protection Commission (DPC): <a href="https://www.dataprotection.ie" className={shared.footerLink} rel="noopener noreferrer">www.dataprotection.ie</a>. We will cooperate with any supervisory authority.</p>

              <h2 className={shared.sectionTitle}>Changes to this policy</h2>
              <p>We may update this Privacy Policy from time to time. We will post the new version on this page and update the &quot;Last updated&quot; date. If changes are significant, we will notify you by email or a notice in the service. Continued use of the service after changes means you accept the updated policy.</p>

              <h2 className={shared.sectionTitle}>Contact</h2>
              <p>For privacy and data protection: <a href="mailto:privacy@gdprevidence.ie" className={shared.footerLink}>privacy@gdprevidence.ie</a>. For general support: <a href="mailto:support@gdprevidence.ie" className={shared.footerLink}>support@gdprevidence.ie</a>. Address: [INSERT COMPANY ADDRESS].</p>
              <p><strong>This is not legal advice.</strong> GDPR Evidence helps you record and demonstrate compliance; it does not provide legal advice.</p>
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
