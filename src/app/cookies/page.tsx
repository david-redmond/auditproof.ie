import Link from "next/link";
import shared from "../shared.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Cookie Policy — GDPR Evidence",
  description:
    "What cookies we use, why, and how you can manage them. Essential and analytics cookies.",
};

const LAST_UPDATED = "18 February 2025";

export default function CookiesPage() {
  return (
    <div className={shared.page}>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <section className={shared.hero}>
          <div className={shared.container}>
            <h1 className={shared.heroTitle}>Cookie Policy</h1>
            <p className={shared.legalUpdated}>Last updated: {LAST_UPDATED}</p>
            <p className={shared.heroSub}>
              This policy explains what cookies we use on the GDPR Evidence website and how you can control them. This is not legal advice.
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
              <h2 className={shared.sectionTitle}>What cookies are</h2>
              <p>Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences, keep you signed in, or understand how the site is used. Some are essential for the site to work; others are used for analytics or marketing and may require your consent under privacy law.</p>

              <h2 className={shared.sectionTitle}>Essential cookies</h2>
              <p>These cookies are necessary for the website and the GDPR Evidence service to function. They include:</p>
              <ul className={shared.bulletList}>
                <li><strong>Session / authentication:</strong> to keep you signed in and secure your session.</li>
                <li><strong>Security:</strong> to help prevent abuse and protect your account.</li>
                <li><strong>Preferences:</strong> to remember basic settings (e.g. language or region) where we offer them.</li>
              </ul>
              <p>We do not need your consent for essential cookies, but we tell you about them in line with transparency requirements.</p>

              <h2 className={shared.sectionTitle}>Analytics cookies</h2>
              <p>We may use analytics tools (e.g. Google Analytics / GA4) to understand how visitors use our website—e.g. which pages are viewed, how long people stay, and whether they complete sign-up. This helps us improve the site. Analytics cookies are not essential. If we use them, we will seek your consent where required by law (e.g. via a cookie banner or preference centre). Until consent is in place, we may limit analytics or use only anonymised data where possible. We do not use cookies for advertising or to sell your data.</p>

              <h2 className={shared.sectionTitle}>How to manage cookies</h2>
              <p>You can control cookies in several ways:</p>
              <ul className={shared.bulletList}>
                <li><strong>Browser settings:</strong> most browsers let you block or delete cookies. Check your browser&apos;s help or settings (e.g. &quot;Privacy&quot; or &quot;Cookies&quot;). Blocking all cookies may affect how the site works (e.g. you may not stay signed in).</li>
                <li><strong>Our consent tool:</strong> if we implement a cookie banner or preference centre, you can accept or refuse non-essential cookies there.</li>
                <li><strong>Opt-out links:</strong> for some analytics (e.g. Google Analytics), you can use the provider&apos;s opt-out tool or browser add-on.</li>
              </ul>
              <p>If we have not yet implemented a cookie banner, we may rely on essential cookies only or limited analytics; we will update this page when our consent model is in place.</p>

              <h2 className={shared.sectionTitle}>Consent model</h2>
              <p>Where the law requires consent for non-essential cookies (e.g. in the EU/EEA), we will obtain it before setting those cookies. You can withdraw consent at any time via your browser or our preference tool (when available). Withdrawing consent does not affect the lawfulness of processing before withdrawal.</p>

              <h2 className={shared.sectionTitle}>Cookie table (examples)</h2>
              <p>Below is an example of the types of cookies we may use. Exact names and durations may vary. We will keep this table updated.</p>
              <div style={{ overflowX: "auto", marginTop: "var(--theme-space-4)", marginBottom: "var(--theme-space-4)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9375rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--theme-border)" }}>
                      <th style={{ textAlign: "left", padding: "var(--theme-space-2) var(--theme-space-3)", fontWeight: 600 }}>Name</th>
                      <th style={{ textAlign: "left", padding: "var(--theme-space-2) var(--theme-space-3)", fontWeight: 600 }}>Purpose</th>
                      <th style={{ textAlign: "left", padding: "var(--theme-space-2) var(--theme-space-3)", fontWeight: 600 }}>Type</th>
                      <th style={{ textAlign: "left", padding: "var(--theme-space-2) var(--theme-space-3)", fontWeight: 600 }}>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: "1px solid var(--theme-border)" }}>
                      <td style={{ padding: "var(--theme-space-2) var(--theme-space-3)" }}>Session / auth cookie</td>
                      <td style={{ padding: "var(--theme-space-2) var(--theme-space-3)" }}>Keep you signed in and secure session</td>
                      <td style={{ padding: "var(--theme-space-2) var(--theme-space-3)" }}>Essential</td>
                      <td style={{ padding: "var(--theme-space-2) var(--theme-space-3)" }}>Session or short-lived</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid var(--theme-border)" }}>
                      <td style={{ padding: "var(--theme-space-2) var(--theme-space-3)" }}>e.g. _ga, _gid (if used)</td>
                      <td style={{ padding: "var(--theme-space-2) var(--theme-space-3)" }}>Analytics (page views, usage)</td>
                      <td style={{ padding: "var(--theme-space-2) var(--theme-space-3)" }}>Analytics</td>
                      <td style={{ padding: "var(--theme-space-2) var(--theme-space-3)" }}>As per provider (e.g. 2 years / 24 hours)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>We do not sell your data. For more on how we use personal data, see our <Link href="/privacy" className={shared.footerLink}>Privacy Policy</Link>.</p>

              <h2 className={shared.sectionTitle}>Contact</h2>
              <p>Questions about cookies? Email <a href="mailto:privacy@gdprevidence.ie" className={shared.footerLink}>privacy@gdprevidence.ie</a>. <strong>This is not legal advice.</strong></p>
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
