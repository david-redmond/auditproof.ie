import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/auth";
import { auditPath } from "@/lib/constants";
import shared from "./shared.module.css";
import styles from "./page.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroCtas from "@/components/HeroCtas";

export default async function HomePage() {
  const userId = await getSessionUserId();
  if (userId) redirect(auditPath("/dashboard"));

  return (
    <div className={shared.page}>
      <Header />

      <main id="main-content" tabIndex={-1}>
        {/* 1. Hero — one image only */}
        <section className={shared.hero}>
          <div className={`${shared.container} ${shared.heroLayout}`}>
            <div className={shared.heroCopy}>
              <h1 className={shared.heroTitle}>
                Make GDPR calm and boring again.
              </h1>
              <p className={shared.heroSub}>
                Audit-ready GDPR records for small businesses — organised, timestamped, and exportable in minutes.
              </p>
              <HeroCtas />
              <p className={styles.trustLine} aria-label="Trust highlights">
                EU-hosted
                <span className={styles.trustSep} aria-hidden="true"> • </span>
                Timestamped records
                <span className={styles.trustSep} aria-hidden="true"> • </span>
                Exportable audit pack
              </p>
            </div>
            <aside className={shared.heroAside}>
              <figure className={shared.heroFigure}>
                <img
                  className={shared.heroImage}
                  src="/illustrations/hero-vault.svg"
                  alt="GDPR Evidence dashboard with RoPA, data subject requests, incident register and export"
                />
              </figure>
            </aside>
          </div>
        </section>

        {/* 2. Problem */}
        <section className={shared.section}>
          <div className={shared.container}>
            <h2 className={shared.sectionTitle}>
              When GDPR questions come up, most SMEs scramble.
            </h2>
            <ul className={styles.bulletList}>
              <li>Processing records spread across spreadsheets</li>
              <li>Data subject requests buried in emails</li>
              <li>Incidents remembered, not logged</li>
              <li>No exportable GDPR audit pack when you need it</li>
            </ul>
            <p className={shared.bodyCopy}>
              Compliance isn’t just doing the right thing — it’s <strong>proving it</strong>.
            </p>
          </div>
        </section>

        {/* 3. What you get */}
        <section className={`${shared.section} ${shared.sectionAlt}`}>
          <div className={shared.container}>
            <h2 className={shared.sectionTitle}>
              A simple GDPR evidence vault — built for SMEs
            </h2>
            <p className={shared.sectionLead}>
              Capture the records auditors actually ask for: RoPA, request history, incident register, and evidence.
            </p>
            <ul className={styles.bulletList}>
              <li><strong>Record of Processing Activities (RoPA)</strong> — what you process, why, and on what basis</li>
              <li><strong>Data subject request log</strong> — track access, deletion, and correction requests</li>
              <li><strong>Incident & breach register</strong> — log incidents and actions taken</li>
              <li><strong>Policies & evidence store</strong> — upload and organise supporting documents</li>
            </ul>
            <p className={shared.bodyCopy} style={{ marginTop: "var(--theme-space-4)" }}>
              Everything timestamped. One-click export when you need a complete GDPR audit pack.
            </p>
          </div>
        </section>

        {/* 4. How it works */}
        <section className={shared.section}>
          <div className={shared.container}>
            <h2 className={shared.sectionTitle}>How it works</h2>
            <div className={shared.howItWorksGrid}>
              <div className={shared.howItWorksStep}>
                <div className={shared.howItWorksStepNum} aria-hidden="true">1</div>
                <h3 className={shared.howItWorksStepTitle}>Create</h3>
                <p className={shared.howItWorksStepDesc}>
                  Set up your workspace in minutes.
                </p>
              </div>
              <div className={shared.howItWorksStep}>
                <div className={shared.howItWorksStepNum} aria-hidden="true">2</div>
                <h3 className={shared.howItWorksStepTitle}>Record</h3>
                <p className={shared.howItWorksStepDesc}>
                  Add processing activities, requests, incidents, and policies as you go.
                </p>
              </div>
              <div className={shared.howItWorksStep}>
                <div className={shared.howItWorksStepNum} aria-hidden="true">3</div>
                <h3 className={shared.howItWorksStepTitle}>Export</h3>
                <p className={shared.howItWorksStepDesc}>
                  Generate a GDPR audit pack when you need proof.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Audit pack — CTA: View sample only */}
        <section className={`${shared.section} ${shared.sectionAlt}`} id="sample-pack">
          <div className={shared.container}>
            <h2 className={shared.sectionTitle}>See what auditors actually want</h2>
            <p className={shared.sectionLead}>
              A structured audit pack with your key GDPR records, ready to share.
            </p>
            <p className={shared.bodyCopy}>
              PDF cover, RoPA summary, request history, incident register, evidence index. Optional ZIP with attached documents.
            </p>
            <div style={{ marginTop: "var(--theme-space-6)" }}>
              <a href="/sample-audit-pack.pdf" className={shared.ctaSecondary} download="sample-audit-pack.pdf">
                View sample audit pack
              </a>
            </div>
          </div>
        </section>

        {/* 6. Security snapshot */}
        <section className={shared.section}>
          <div className={shared.container}>
            <h2 className={shared.sectionTitle}>Security snapshot</h2>
            <ul className={styles.securityList}>
              <li>EU-hosted storage</li>
              <li>Role-based access controls</li>
              <li>Workspace audit logs</li>
            </ul>
            <p className={shared.bodyCopy} style={{ marginTop: "var(--theme-space-4)" }}>
              <Link href="/security" className={shared.footerLink}>Full security and compliance details →</Link>
            </p>
          </div>
        </section>

        {/* 7. Final CTA — Register free only */}
        <section className={`${styles.finalCtaSection} ${shared.sectionAlt}`} id="cta">
          <div className={shared.container}>
            <h2 className={shared.sectionTitle}>
              Be ready when GDPR questions come up.
            </h2>
            <p className={shared.finalCopy}>
              Your records should already exist — not be created in a panic.
            </p>
            <div className={shared.ctas}>
              <Link href="/signup" className={shared.ctaPrimary}>
                Register free
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
