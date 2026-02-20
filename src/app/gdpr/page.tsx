import Link from "next/link";
import shared from "../shared.module.css";
import styles from "./page.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Product — GDPR Evidence",
  description:
    "Audit-ready GDPR records for growing businesses. Record evidence, keep it organised, export a complete audit pack.",
};

export default function ProductPage() {
  return (
    <div className={shared.page}>
      <Header />

      <main id="main-content" tabIndex={-1}>
        {/* 1. Hero */}
        <section className={shared.hero}>
          <div className={`${shared.container} ${shared.heroLayout}`}>
            <div className={`${shared.heroCopy} ${styles.heroBlock}`}>
              <h1 className={shared.heroTitle}>
                Audit-ready GDPR records for growing businesses
              </h1>
              <p className={shared.heroSub}>
                Record key evidence, keep it organised, and export a complete GDPR audit pack when you need it.
              </p>
              <div className={shared.ctas}>
                <Link href="/signup" className={shared.ctaPrimary}>
                  Register free
                </Link>
                <a href="/sample-audit-pack.pdf" className={shared.ctaSecondary} download="sample-audit-pack.pdf">
                  View sample audit pack
                </a>
              </div>
              <p className={styles.trustLine} aria-label="Trust highlights">
                EU-hosted
                <span className={styles.trustSep} aria-hidden="true"> • </span>
                Timestamped records
                <span className={styles.trustSep} aria-hidden="true"> • </span>
                Exportable audit pack
              </p>
            </div>
            <aside className={shared.heroAside}>
              <figure className={styles.heroImage}>
                <img
                  src="/illustrations/hero-vault.svg"
                  alt="GDPR Evidence dashboard: RoPA, request log, incident register, export"
                />
              </figure>
            </aside>
          </div>
        </section>

        {/* 2. The Problem */}
        <section className={shared.section}>
          <div className={shared.container}>
            <h2 className={`${shared.sectionTitle} ${styles.sectionTitleCenter}`}>The hard part is the record-keeping</h2>
            <p className={shared.bodyCopy}>
              Processing activities live in spreadsheets or emails. DSARs aren’t tracked. Incidents are handled ad hoc. Evidence gets assembled at the last minute.
            </p>
            <ul className={styles.bulletListShort}>
              <li>Processing activities scattered across tools</li>
              <li>Data subject requests not tracked or overdue</li>
              <li>Incidents and breaches logged informally</li>
              <li>Audit pack pulled together under pressure</li>
            </ul>
          </div>
        </section>

        {/* 3. What you can record — 4 modules in 2x2 grid */}
        <section className={`${shared.section} ${shared.sectionAlt}`}>
          <div className={shared.container}>
            <h2 className={`${shared.sectionTitle} ${styles.sectionTitleCenter}`}>What you can record</h2>

            <div className={styles.modulesGrid}>
              <div className={styles.moduleCard}>
                <h3 className={styles.moduleCardTitle}>Record of Processing Activities (RoPA)</h3>
                <p className={styles.moduleCardLead}>
                  Document what you process, why, and on what lawful basis.
                </p>
                <ul className={styles.moduleCardList}>
                  <li>Purpose and lawful basis</li>
                  <li>Data categories, retention, processors</li>
                  <li>Review dates and ownership</li>
                </ul>
              </div>

              <div className={styles.moduleCard}>
                <h3 className={styles.moduleCardTitle}>Data Subject Request Log</h3>
                <p className={styles.moduleCardLead}>
                  Track access, deletion, and correction requests and meet deadlines.
                </p>
                <ul className={styles.moduleCardList}>
                  <li>Date received and type</li>
                  <li>Actions taken and completion date</li>
                  <li>Outcome and audit trail</li>
                </ul>
              </div>

              <div className={styles.moduleCard}>
                <h3 className={styles.moduleCardTitle}>Incident & Breach Register</h3>
                <p className={styles.moduleCardLead}>
                  Log incidents consistently — even a clear “no breaches” history is evidence.
                </p>
                <ul className={styles.moduleCardList}>
                  <li>What happened and risk assessment</li>
                  <li>Actions and notification decision</li>
                  <li>Closure and documentation</li>
                </ul>
              </div>

              <div className={styles.moduleCard}>
                <h3 className={styles.moduleCardTitle}>Policies & Evidence Store</h3>
                <p className={styles.moduleCardLead}>
                  Upload and organise the documents that back your GDPR records.
                </p>
                <ul className={styles.moduleCardList}>
                  <li>Privacy notices and agreements</li>
                  <li>Training records and internal policies</li>
                  <li>Versioned and findable</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Export / Audit pack */}
        <section className={shared.section} id="export">
          <div className={shared.container}>
            <h2 className={`${shared.sectionTitle} ${styles.sectionTitleCenter}`}>One click. Complete GDPR audit pack.</h2>
            <div className={styles.blockCenter}>
              <ul className={styles.bulletListShort}>
                <li>Organisation summary</li>
                <li>RoPA export</li>
                <li>Request history</li>
                <li>Incident register</li>
                <li>Evidence index</li>
              </ul>
              <p className={shared.bodyCopy} style={{ marginTop: "var(--theme-space-4)" }}>
                PDF cover, table of contents, full registers. Optional ZIP with attached documents.
              </p>
              <div style={{ marginTop: "var(--theme-space-6)" }}>
                <a href="/sample-audit-pack.pdf" className={shared.ctaSecondary} download="sample-audit-pack.pdf">
                  View sample audit pack
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Security snapshot */}
        <section className={`${shared.section} ${shared.sectionAlt}`}>
          <div className={shared.container}>
            <h2 className={`${shared.sectionTitle} ${styles.sectionTitleCenter}`}>Security snapshot</h2>
            <div className={styles.blockCenter}>
              <ul className={styles.securityList}>
                <li>EU-hosted storage</li>
                <li>Role-based access controls</li>
                <li>Workspace audit logs</li>
              </ul>
              <p className={shared.bodyCopy} style={{ marginTop: "var(--theme-space-4)" }}>
                <Link href="/security" className={shared.footerLink}>Full security and compliance details →</Link>
              </p>
            </div>
          </div>
        </section>

        {/* 6. What this tool is not */}
        <section className={shared.section}>
          <div className={shared.container}>
            <h2 className={`${shared.sectionTitle} ${styles.sectionTitleCenter}`}>What this tool is not</h2>
            <div className={styles.blockCenter}>
              <ul className={styles.bulletListShort}>
                <li>Not legal advice</li>
              <li>Not a cookie scanner or banner tool</li>
              <li>Not automated deletion or compliance “magic”</li>
            </ul>
            <p className={shared.bodyCopy} style={{ marginTop: "var(--theme-space-4)" }}>
              It records your decisions — it doesn’t make them for you.
            </p>
          </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
