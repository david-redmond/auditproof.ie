import Link from "next/link";
import shared from "../shared.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Acceptable Use Policy — GDPR Evidence",
  description:
    "Rules for using GDPR Evidence. No illegal content, abuse, or malware. Fair use and reporting abuse.",
};

const LAST_UPDATED = "18 February 2025";

export default function AcceptableUsePage() {
  return (
    <div className={shared.page}>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <section className={shared.hero}>
          <div className={shared.container}>
            <h1 className={shared.heroTitle}>Acceptable Use Policy</h1>
            <p className={shared.legalUpdated}>Last updated: {LAST_UPDATED}</p>
            <p className={shared.heroSub}>
              These rules help keep GDPR Evidence safe and lawful for everyone. By using the service, you agree to comply. Breach may result in suspension or termination. This is not legal advice.
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
              <h2 className={shared.sectionTitle}>No illegal content or activity</h2>
              <p>You must not use the service to store, process, or share content or conduct that is illegal in any applicable jurisdiction. This includes (but is not limited to) content that infringes intellectual property, defames others, or facilitates fraud, money laundering, or other crimes. You are responsible for ensuring that your use and the data you upload comply with all applicable laws.</p>

              <h2 className={shared.sectionTitle}>No abuse, hacking, or unauthorised access</h2>
              <p>You must not:</p>
              <ul className={shared.bulletList}>
                <li>Attempt to gain unauthorised access to our systems, other users&apos; accounts, or any non-public data.</li>
                <li>Probe, scan, or test the vulnerability of our systems without our prior permission.</li>
                <li>Interfere with or disrupt the service, servers, or networks (e.g. denial-of-service, overloading).</li>
                <li>Use automated means (e.g. bots, scrapers) to access the service unless we have explicitly agreed (e.g. for an integration).</li>
              </ul>

              <h2 className={shared.sectionTitle}>No malware or harmful code</h2>
              <p>You must not upload, distribute, or link to malware, viruses, or other harmful code. Do not use the service to host or transmit content designed to harm devices or systems.</p>

              <h2 className={shared.sectionTitle}>No infringing content</h2>
              <p>You must not upload or share content that infringes others&apos; intellectual property, privacy, or other rights. You should have the right to use and store any content you add. We may remove content that we reasonably believe infringes third-party rights or this policy.</p>

              <h2 className={shared.sectionTitle}>Fair usage</h2>
              <p>You must use the service in a reasonable way and in line with your plan (e.g. storage and user limits). Abuse of the system (e.g. excessive automated requests, circumventing limits, or using the service in a way that harms other users or our infrastructure) is not permitted. We may throttle or restrict use that we reasonably consider abusive.</p>

              <h2 className={shared.sectionTitle}>Account suspension and termination</h2>
              <p>We may suspend or terminate your account (or your access to a workspace) if we reasonably believe you have breached this policy, our <Link href="/terms" className={shared.footerLink}>Terms of Service</Link>, or the law. We will normally try to contact you first where appropriate, but we may act immediately where necessary (e.g. to protect the service or others). Suspension or termination does not relieve you of any obligations under your contract or law.</p>

              <h2 className={shared.sectionTitle}>Reporting abuse</h2>
              <p>If you become aware of use that you believe violates this policy, please report it to us at <a href="mailto:support@gdprevidence.ie" className={shared.footerLink}>support@gdprevidence.ie</a>. Include as much detail as you can (e.g. account, workspace, or content concerned). We will investigate and take action where appropriate. We may not share the outcome of an investigation with you for privacy or security reasons.</p>

              <h2 className={shared.sectionTitle}>Contact</h2>
              <p>Questions about this policy? Contact <a href="mailto:support@gdprevidence.ie" className={shared.footerLink}>support@gdprevidence.ie</a>. <strong>This is not legal advice.</strong></p>
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
