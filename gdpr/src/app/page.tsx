import Link from "next/link";
import shared from "./shared.module.css";
import styles from "./page.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className={shared.page}>
      <Header />

      <main id="main-content" tabIndex={-1}>
        {/* 1. Hero */}
        <section className={shared.hero}>
          <div className={`${shared.container} ${shared.heroLayout}`}>
            <div className={shared.heroCopy}>
              <h1 className={shared.heroTitle}>
                GDPR audit-ready records for small businesses
              </h1>
              <p className={shared.heroWhoFor}>
                For SMEs with 5–50 employees who need to show evidence, not just policies.
              </p>
              <p className={shared.heroSub}>
                Keep your GDPR evidence organised, timestamped, and ready to
                export — without consultants or complex software.
              </p>
              <div className={shared.ctas}>
                <Link href="/signup" className={shared.ctaPrimary}>
                  Create workspace
                </Link>
                <a href="#cta" className={shared.ctaSecondary}>
                  View sample audit pack
                </a>
                <Link href="/partners" className={shared.ctaSecondary}>
                  For accountants &amp; advisors
                </Link>
              </div>
              <div className={shared.trustGrid} aria-label="Trust highlights">
                <div className={shared.trustCard}>
                  <div className={shared.trustCardIcon} aria-hidden="true">◇</div>
                  <span className={shared.trustCardLabel}>EU-hosted data</span>
                </div>
                <div className={shared.trustCard}>
                  <div className={shared.trustCardIcon} aria-hidden="true">◇</div>
                  <span className={shared.trustCardLabel}>Audit trails</span>
                </div>
                <div className={shared.trustCard}>
                  <div className={shared.trustCardIcon} aria-hidden="true">◇</div>
                  <span className={shared.trustCardLabel}>Access controls</span>
                </div>
                <div className={shared.trustCard}>
                  <div className={shared.trustCardIcon} aria-hidden="true">◇</div>
                  <span className={shared.trustCardLabel}>Export-ready</span>
                </div>
              </div>
              <p className={shared.socialProof}>
                Used by agencies, clinics, SaaS companies, and professional services.
              </p>
              <p className={shared.badgeNoAdvice}>
                No legal advice. No unnecessary complexity.
              </p>
            </div>
            <aside className={shared.heroAside}>
              <figure className={shared.heroFigure}>
                <img
                  className={shared.heroImage}
                  src="/illustrations/hero-vault.svg"
                  alt="Shielded GDPR records and audit-ready documents"
                />
              </figure>
              <div className={shared.heroPanel}>
                <p className={shared.heroPanelHeader}>Security snapshot</p>
                <h2 className={shared.heroPanelTitle}>
                  The evidence vault for calm compliance
                </h2>
                <ul className={shared.heroPanelList}>
                  <li>GDPR records captured with timestamps and owners</li>
                  <li>Secure workspace access with role-based controls</li>
                  <li>One-click export pack for audits and requests</li>
                  <li>Clear guidance on what to record (and what to skip)</li>
                </ul>
                <p className={shared.heroPanelFoot}>
                  Built to help you demonstrate compliance, not just talk about
                  it.
                </p>
              </div>
            </aside>
          </div>
        </section>

        {/* 2. How it works */}
        <section className={shared.section}>
          <div className={shared.container}>
            <h2 className={shared.sectionTitle}>How it works</h2>
            <div className={shared.howItWorksGrid}>
              <div className={shared.howItWorksStep}>
                <div className={shared.howItWorksStepNum} aria-hidden="true">1</div>
                <h3 className={shared.howItWorksStepTitle}>Create</h3>
                <p className={shared.howItWorksStepDesc}>
                  Set up your workspace in about 2 minutes. No credit card required to start.
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
                  Generate a GDPR audit pack (PDF / ZIP) when you need to show evidence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. The Problem */}
        <section className={`${shared.section} ${shared.sectionAlt}`}>
          <div className={shared.container}>
            <h2 className={shared.sectionTitle}>
              When GDPR questions come up, most SMEs scramble.
            </h2>
            <div className={shared.bodyCopy}>
              <p>
                You may already have privacy policies, processes, and systems in
                place — but when someone asks for proof, everything is
                scattered:
              </p>
              <ul className={shared.bulletList}>
                <li>Processing records in spreadsheets</li>
                <li>Deletion requests buried in emails</li>
                <li>Incidents remembered, not logged</li>
                <li>No clear audit trail</li>
              </ul>
              <p>
                GDPR compliance isn’t just about doing the right thing. It’s
                about being able to <strong>demonstrate it</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* 4. The Insight */}
        <section className={shared.section}>
          <div className={shared.container}>
            <h2 className={shared.sectionTitle}>
              Auditors don’t look for perfection. They look for evidence.
            </h2>
            <div className={shared.bodyCopy}>
              <p>
                In practice, GDPR checks focus on a small set of records:
              </p>
              <ul className={shared.bulletList}>
                <li>What personal data you process</li>
                <li>Why you process it</li>
                <li>How you handle data subject requests</li>
                <li>How incidents are recorded and reviewed</li>
              </ul>
              <p>
                If those records are clear, current, and timestamped, you’re
                already most of the way there.
              </p>
            </div>
          </div>
        </section>

        {/* 5. The Solution */}
        <section className={`${shared.section} ${shared.sectionAlt}`}>
          <div className={shared.container}>
            <h2 className={shared.sectionTitle}>
              A simple GDPR evidence vault — built for SMEs
            </h2>
            <div className={shared.bodyCopy}>
              <p>
                Our tool helps you keep the{" "}
                <strong>minimum required GDPR records</strong> in one place, so
                you’re ready when questions arise.
              </p>
              <p>It’s designed to be:</p>
              <ul className={shared.bulletList}>
                <li>Easy to use</li>
                <li>Audit-friendly</li>
                <li>Low-risk</li>
                <li>Affordable for small teams</li>
              </ul>
              <p>
                No legal jargon. No heavy workflows. Just clear records.
              </p>
            </div>
          </div>
        </section>

        {/* 6. What's Included */}
        <section className={shared.section}>
          <div className={shared.container}>
            <h2 className={shared.sectionTitle}>
              What you can record and export
            </h2>
            <div className={shared.featureGrid}>
              <div className={shared.featureCard}>
                <h3 className={shared.featureTitle}>
                  Record of Processing Activities (RoPA)
                </h3>
                <p>
                  Document what data you process, why, and on what lawful basis.
                </p>
              </div>
              <div className={shared.featureCard}>
                <h3 className={shared.featureTitle}>
                  Data Subject Request Log
                </h3>
                <p>
                  Track deletion, correction, and access requests with dates and
                  outcomes.
                </p>
              </div>
              <div className={shared.featureCard}>
                <h3 className={shared.featureTitle}>
                  Incident &amp; Breach Register
                </h3>
                <p>
                  Record incidents, assessments, and actions taken.
                </p>
              </div>
              <div className={shared.featureCard}>
                <h3 className={shared.featureTitle}>
                  Policies &amp; Evidence Store
                </h3>
                <p>
                  Upload privacy notices, agreements, and training records.
                </p>
              </div>
              <div className={`${shared.featureCard} ${shared.featureCardHighlight}`}>
                <h3 className={shared.featureTitle}>One-Click Audit Export</h3>
                <p>
                  Generate a GDPR audit pack (PDF / ZIP) in minutes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. What You Don't Do */}
        <section className={`${shared.section} ${shared.sectionAlt}`}>
          <div className={shared.container}>
            <h2 className={shared.sectionTitle}>What this tool is not</h2>
            <div className={shared.bodyCopy}>
              <p>
                To keep things simple and safe, we intentionally don’t provide:
              </p>
              <ul className={shared.bulletList}>
                <li>Legal advice</li>
                <li>Cookie banners or scanners</li>
                <li>Risk scoring or automated decisions</li>
                <li>Over-engineered compliance workflows</li>
              </ul>
              <p>
                This tool helps you <strong>record and demonstrate</strong> GDPR
                compliance — not replace professional advice.
              </p>
            </div>
            <p className={shared.badgeNoAdvice}>
              This is not legal advice.
            </p>
          </div>
        </section>

        {/* 8. Who It's For */}
        <section className={shared.section}>
          <div className={shared.container}>
            <h2 className={shared.sectionTitle}>
              Built for small and growing businesses
            </h2>
            <div className={shared.bodyCopy}>
              <p>This works best for organisations that:</p>
              <ul className={shared.bulletList}>
                <li>Have 5–50 employees</li>
                <li>Handle customer, client, or employee data</li>
                <li>Don’t have an in-house legal team</li>
                <li>Want GDPR to be organised, not stressful</li>
              </ul>
              <p>
                Common users include agencies, clinics, SaaS companies,
                e-commerce businesses, and professional services firms.
              </p>
            </div>
          </div>
        </section>

        {/* 9. Partner Section */}
        <section className={`${shared.section} ${shared.sectionAlt}`} id="partners">
          <div className={shared.container}>
            <h2 className={shared.sectionTitle}>
              For accountants, advisors, and business support firms
            </h2>
            <div className={shared.bodyCopy}>
              <p>
                Many GDPR issues surface during audits, reviews, or client
                check-ins.
              </p>
              <p>
                We work with partners who want a simple way to help clients stay
                GDPR-organised — without replacing their existing services.
              </p>
              <p className={styles.partnerBenefitsTitle}>Partner benefits:</p>
              <ul className={shared.bulletList}>
                <li>Free partner access</li>
                <li>Co-branded audit exports</li>
                <li>
                  <strong>10% recurring commission</strong>
                </li>
                <li>No exclusivity or obligation</li>
              </ul>
            </div>
            <Link href="/partners" className={shared.ctaSecondary}>
              View partner programme
            </Link>
          </div>
        </section>

        {/* 10. Pricing */}
        <section className={shared.section} id="pricing">
          <div className={shared.container}>
            <h2 className={shared.sectionTitle}>
              Simple, predictable pricing
            </h2>
            <div className={styles.pricingBlock}>
              <p className={styles.pricingMain}>
                <strong>€199</strong> per year per business
              </p>
              <p className={styles.pricingOr}>or</p>
              <p className={styles.pricingMain}>
                <strong>€19</strong> per month
              </p>
              <p className={styles.pricingNote}>
                Includes all features. No per-user limits.
              </p>
              <p className={styles.pricingSub}>
                Less than one hour of consultancy time.
              </p>
            </div>
            <p className={shared.badgeNoAdvice}>
              This is not legal advice.
            </p>
          </div>
        </section>

        {/* 11. Final CTA */}
        <section className={`${shared.section} ${shared.sectionAlt}`} id="cta">
          <div className={shared.container}>
            <h2 className={shared.sectionTitle}>
              Make GDPR calm and boring again.
            </h2>
            <p className={shared.finalCopy}>
              If you’re ever asked about GDPR, you’ll be glad your records are
              already in order.
            </p>
            <div className={shared.ctas}>
              <Link href="/signup" className={shared.ctaPrimary}>
                Create workspace
              </Link>
              <a href="#cta" className={shared.ctaSecondary}>
                View sample audit pack
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
