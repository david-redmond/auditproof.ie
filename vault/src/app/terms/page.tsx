import Link from "next/link";
import shared from "../shared.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Terms of Service — GDPR Evidence",
  description:
    "Terms of use for GDPR Evidence. Acceptance, accounts, subscriptions, liability, and governing law.",
};

const LAST_UPDATED = "18 February 2025";

export default function TermsPage() {
  return (
    <div className={shared.page}>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <section className={shared.hero}>
          <div className={shared.container}>
            <h1 className={shared.heroTitle}>Terms of Service</h1>
            <p className={shared.legalUpdated}>Last updated: {LAST_UPDATED}</p>
            <p className={shared.heroSub}>
              These terms govern your use of GDPR Evidence. By registering or using the service, you agree to these terms. This is not legal advice.
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
              <h2 className={shared.sectionTitle}>1. Acceptance of terms</h2>
              <p>By creating an account or using the GDPR Evidence service (the &quot;Service&quot;) operated by Go Solutions (trading as GDPR Evidence), you agree to be bound by these Terms of Service and our <Link href="/privacy" className={shared.footerLink}>Privacy Policy</Link>. If you do not agree, do not use the Service.</p>

              <h2 className={shared.sectionTitle}>2. Who the service is for</h2>
              <p>The Service is intended for small and medium-sized businesses (SMEs) and their advisers who need to record and demonstrate GDPR compliance. You must be at least 18 years old and have authority to bind your organisation (if applicable). We do not provide legal advice; the Service helps you organise evidence and export it. You are responsible for the accuracy and lawfulness of the data you store.</p>

              <h2 className={shared.sectionTitle}>3. Account registration</h2>
              <p>You register by providing an email address and creating a password. You may be invited by another user to join a workspace. You are responsible for keeping your login details secure and for all activity under your account. You must notify us promptly of any unauthorised use.</p>

              <h2 className={shared.sectionTitle}>4. Workspace ownership and responsibility</h2>
              <p>Each workspace has one or more owners. The owner is responsible for the workspace, its members, and the data in it. You must only create or join workspaces for organisations you are authorised to represent. You are responsible for ensuring that the personal data you upload or record is processed in line with applicable law and that you have a lawful basis and any necessary consents.</p>

              <h2 className={shared.sectionTitle}>5. User obligations</h2>
              <p>You agree to:</p>
              <ul className={shared.bulletList}>
                <li>Use the Service only for lawful purposes and in line with these terms and the <Link href="/acceptable-use" className={shared.footerLink}>Acceptable Use Policy</Link>.</li>
                <li>Provide accurate information and keep it up to date.</li>
                <li>Not use the Service to process personal data in a way that breaches data protection or other laws.</li>
                <li>Not share your account or allow others to use it without our permission.</li>
              </ul>

              <h2 className={shared.sectionTitle}>6. Prohibited use</h2>
              <p>You must not use the Service to: violate any law; infringe others&apos; rights; upload malware or harmful code; attempt to gain unauthorised access to our or others&apos; systems; scrape or automate access in a way we have not agreed; or use it for purposes that could harm the Service or other users. See our <Link href="/acceptable-use" className={shared.footerLink}>Acceptable Use Policy</Link> for more detail. We may suspend or terminate accounts that breach these terms.</p>

              <h2 className={shared.sectionTitle}>7. Subscription and payments</h2>
              <p>Some features may require a paid subscription. We may offer monthly and yearly plans. Fees are as shown at signup or on our pricing page. You pay in advance for the chosen period. We may change prices with notice; continued use after a change may constitute acceptance. Refunds are as stated at purchase (e.g. we may offer a refund within a short period after first payment). If payment fails, we may suspend access until payment is received.</p>

              <h2 className={shared.sectionTitle}>8. Free trial and registration</h2>
              <p>We may offer a free trial or a free tier. Trial and free-tier terms (e.g. duration, feature limits) are as described when you sign up. You may register for free where we make that option available; by doing so you still agree to these terms.</p>

              <h2 className={shared.sectionTitle}>9. Service availability and maintenance</h2>
              <p>We aim to keep the Service available but do not guarantee uninterrupted access. We may perform maintenance with or without advance notice. We are not liable for downtime unless required by law.</p>

              <h2 className={shared.sectionTitle}>10. Data export and backups</h2>
              <p>You can export your data (e.g. audit packs, records) using the tools we provide. We recommend you keep your own backups of important data. We retain data in line with our <Link href="/privacy" className={shared.footerLink}>Privacy Policy</Link> and <Link href="/data-processing" className={shared.footerLink}>Data Processing</Link> page. On account closure, we will delete or anonymise your data in line with our retention policy.</p>

              <h2 className={shared.sectionTitle}>11. Intellectual property</h2>
              <p>We own the Service, its design, and our branding. You do not acquire any rights in them except the right to use the Service under these terms. You retain ownership of the content you upload; you grant us the licence we need to operate the Service (e.g. to store, display, and back up your data).</p>

              <h2 className={shared.sectionTitle}>12. Confidentiality</h2>
              <p>We will keep your data confidential and process it only as set out in our Privacy Policy and Data Processing terms. You must keep any non-public information we give you (e.g. about security or our systems) confidential.</p>

              <h2 className={shared.sectionTitle}>13. Limitation of liability</h2>
              <p>To the fullest extent permitted by law:</p>
              <ul className={shared.bulletList}>
                <li>The Service is provided &quot;as is&quot;. We do not warrant that it will be error-free or uninterrupted.</li>
                <li>We are not liable for any indirect, consequential, or special loss (e.g. loss of profit, data, or goodwill) arising from your use of the Service.</li>
                <li>Our total liability to you for any claims in connection with the Service is limited to the fees you paid us in the 12 months before the claim (or, if you have not paid, to €100).</li>
              </ul>
              <p>Nothing in these terms excludes or limits our liability for death or personal injury caused by our negligence, fraud, or any liability that cannot be excluded by law.</p>

              <h2 className={shared.sectionTitle}>14. Not legal advice</h2>
              <p>GDPR Evidence helps you record and demonstrate compliance. It does not provide legal, regulatory, or professional advice. You are responsible for ensuring your use of the Service and your data processing comply with applicable law. If you need legal advice, please consult a qualified adviser.</p>

              <h2 className={shared.sectionTitle}>15. Termination</h2>
              <p>You may close your account at any time via account settings. We may suspend or terminate your access if you breach these terms, our Acceptable Use Policy, or for other serious reasons (e.g. non-payment, abuse). On termination, your right to use the Service ends. We will handle your data as set out in our Privacy Policy and Data Processing page.</p>

              <h2 className={shared.sectionTitle}>16. Governing law</h2>
              <p>These terms are governed by the laws of Ireland. Any disputes are subject to the exclusive jurisdiction of the courts of Ireland.</p>

              <h2 className={shared.sectionTitle}>17. Contact</h2>
              <p>Go Solutions (trading as GDPR Evidence). Email: <a href="mailto:support@gdprevidence.ie" className={shared.footerLink}>support@gdprevidence.ie</a>. Address: [INSERT COMPANY ADDRESS]. For legal or contractual enquiries, use the same contact details.</p>

              <h2 className={shared.sectionTitle}>18. Updates to these terms</h2>
              <p>We may update these terms from time to time. We will post the new version on this page and update the &quot;Last updated&quot; date. If changes are significant, we will notify you by email or a notice in the Service. Continued use after changes means you accept the updated terms.</p>
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
