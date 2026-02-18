import Link from "next/link";
import shared from "../shared.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Contact — GDPR Evidence",
  description:
    "Get in touch with the GDPR Evidence team. Support, privacy, and legal contact details.",
};

export default function ContactPage() {
  return (
    <div className={shared.page}>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <section className={shared.hero}>
          <div className={shared.container}>
            <h1 className={shared.heroTitle}>Contact</h1>
            <p className={shared.heroSub}>
              For product questions, support, partner enquiries, or legal and privacy matters, use the details below. We typically respond within 2 business days.
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
              <h2 className={shared.sectionTitle}>Support and general enquiries</h2>
              <p>
                Email: <a href="mailto:support@gdprevidence.ie" className={shared.footerLink}>support@gdprevidence.ie</a>
              </p>
              <p>Use this for product help, account questions, billing, or partner programme enquiries. We typically respond within 2 business days.</p>

              <h2 className={shared.sectionTitle}>Privacy and data protection</h2>
              <p>
                Email: <a href="mailto:privacy@gdprevidence.ie" className={shared.footerLink}>privacy@gdprevidence.ie</a>
              </p>
              <p>Use this for data protection requests, privacy questions, DPA enquiries, or to exercise your rights under the GDPR.</p>

              <h2 className={shared.sectionTitle}>Address</h2>
              <p>[INSERT COMPANY ADDRESS]</p>
              <p>Go Solutions (trading as GDPR Evidence). Website: <a href="https://gdprevidence.ie" className={shared.footerLink}>https://gdprevidence.ie</a> (placeholder).</p>

              <h2 className={shared.sectionTitle}>Response times</h2>
              <p>We aim to respond to support and privacy emails within 2 business days. For urgent security or data breach matters, please mark your email accordingly and we will prioritise it.</p>
              <p><strong>This is not legal advice.</strong> For legal or regulatory advice, please consult a qualified professional.</p>
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
