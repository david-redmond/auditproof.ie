import Link from "next/link";
import shared from "../shared.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Product — GDPR Evidence",
  description:
    "A simple way to keep GDPR evidence organised and audit-ready. Record, review, and export the records regulators and auditors typically ask for.",
};

export default function ProductPage() {
  return (
    <div className={shared.page}>
      <Header />

      <main id="main-content" tabIndex={-1}>
        {/* Product Overview */}
        <section className={shared.hero}>
          <div className={`${shared.container} ${shared.heroLayout}`}>
            <div className={shared.heroCopy}>
              <h1 className={shared.heroTitle}>
                A simple way to keep GDPR evidence organised and audit-ready
              </h1>
              <p className={shared.heroSub}>
                This tool helps small businesses record, manage, and export the
                GDPR information that regulators and auditors typically ask for.
              </p>
              <p className={shared.heroSub}>
                It focuses on <strong>evidence and accountability</strong> — not
                legal advice, not automation, and not complex compliance
                workflows.
              </p>
              <blockquote className={shared.pullQuote}>
                "Can you show how you comply with GDPR?" You'll already have the
                answer.
              </blockquote>
            </div>
            <figure className={shared.heroFigure}>
              <img
                className={shared.heroImage}
                src="/illustrations/product-flow.svg"
                alt="Record, review, and export workflow"
              />
            </figure>
          </div>
        </section>

        {/* How It Works */}
        <section className={shared.section}>
          <div className={shared.container}>
            <h2 className={shared.sectionTitle}>
              GDPR, without the stress
            </h2>
            <ol className={shared.stepList}>
              <li data-step="1. ">
                <strong>Record</strong>
                <p>
                  Capture the key GDPR records as you go — processing
                  activities, requests, incidents, and policies.
                </p>
              </li>
              <li data-step="2. ">
                <strong>Review</strong>
                <p>
                  Keep everything up to date with clear timestamps and
                  ownership.
                </p>
              </li>
              <li data-step="3. ">
                <strong>Export</strong>
                <p>
                  Generate a complete GDPR audit pack in minutes, ready to share
                  with an auditor, advisor, or regulator.
                </p>
              </li>
            </ol>
            <p className={shared.bodyCopy}>
              No scrambling. No last-minute spreadsheets.
            </p>
          </div>
        </section>

        {/* What You Can Record - RoPA */}
        <section className={`${shared.section} ${shared.sectionAlt}`}>
          <div className={shared.container}>
            <h2 className={shared.sectionTitle}>
              What You Can Record
            </h2>
            <h3 className={shared.subsectionTitle}>
              Record of Processing Activities (RoPA)
            </h3>
            <div className={shared.sectionWithArt}>
              <div className={shared.bodyCopy}>
                <p>
                  Document how and why personal data is processed across your
                  business.
                </p>
                <p>For each activity, record:</p>
                <ul className={shared.bulletList}>
                  <li>Purpose of processing</li>
                  <li>Categories of personal data</li>
                  <li>Categories of data subjects</li>
                  <li>Lawful basis</li>
                  <li>Retention period</li>
                  <li>Third-party processors</li>
                </ul>
                <p>
                  This aligns with Article 30 GDPR and the Irish DPC's
                  expectations for accountability.
                </p>
              </div>
              <figure className={shared.sectionArt}>
                <img
                  className={shared.sectionArtImage}
                  src="/illustrations/ropa.svg"
                  alt="Structured record of processing activities"
                />
              </figure>
            </div>
          </div>
        </section>

        {/* Data Subject Request Log */}
        <section className={shared.section}>
          <div className={shared.container}>
            <h3 className={shared.subsectionTitle}>
              Data Subject Request Log
            </h3>
            <div className={shared.sectionWithArt}>
              <div className={shared.bodyCopy}>
                <p>
                  Track how you handle requests from individuals, including:
                </p>
                <ul className={shared.bulletList}>
                  <li>Deletion (right to erasure)</li>
                  <li>Correction (rectification)</li>
                  <li>Access requests</li>
                </ul>
                <p>Each request is logged with:</p>
                <ul className={shared.bulletList}>
                  <li>Date received</li>
                  <li>Request type</li>
                  <li>Actions taken</li>
                  <li>Completion date</li>
                  <li>Outcome</li>
                </ul>
                <p>
                  This provides clear evidence that requests are handled properly
                  and on time.
                </p>
              </div>
              <figure className={shared.sectionArt}>
                <img
                  className={shared.sectionArtImage}
                  src="/illustrations/dsr.svg"
                  alt="Request log checklist"
                />
              </figure>
            </div>
          </div>
        </section>

        {/* Incident & Breach Register */}
        <section className={`${shared.section} ${shared.sectionAlt}`}>
          <div className={shared.container}>
            <h3 className={shared.subsectionTitle}>
              Incident & Breach Register
            </h3>
            <div className={shared.sectionWithArt}>
              <div className={shared.bodyCopy}>
                <p>
                  Record data protection incidents in a consistent, auditable
                  way.
                </p>
                <p>Log:</p>
                <ul className={shared.bulletList}>
                  <li>What happened</li>
                  <li>When it happened</li>
                  <li>Initial risk assessment</li>
                  <li>Actions taken</li>
                  <li>Whether notification was required</li>
                </ul>
                <p>
                  Even a "no breaches" history is valuable evidence during an
                  audit.
                </p>
              </div>
              <figure className={shared.sectionArt}>
                <img
                  className={shared.sectionArtImage}
                  src="/illustrations/incident.svg"
                  alt="Incident register and shield"
                />
              </figure>
            </div>
          </div>
        </section>

        {/* Policies & Evidence Store */}
        <section className={shared.section}>
          <div className={shared.container}>
            <h3 className={shared.subsectionTitle}>
              Policies & Evidence Store
            </h3>
            <div className={shared.sectionWithArt}>
              <div className={shared.bodyCopy}>
                <p>
                  Upload and organise key GDPR-related documents, such as:
                </p>
                <ul className={shared.bulletList}>
                  <li>Privacy notices</li>
                  <li>Data retention policies</li>
                  <li>Processor agreements</li>
                  <li>Training records</li>
                </ul>
                <p>
                  Everything is stored securely and linked to your overall GDPR
                  records.
                </p>
              </div>
              <figure className={shared.sectionArt}>
                <img
                  className={shared.sectionArtImage}
                  src="/illustrations/policies.svg"
                  alt="Policies and evidence folder"
                />
              </figure>
            </div>
          </div>
        </section>

        {/* GDPR Audit Export */}
        <section className={`${shared.section} ${shared.sectionAlt}`}>
          <div className={shared.container}>
            <h2 className={shared.sectionTitle}>
              GDPR Audit Export
            </h2>
            <p className={shared.sectionLead}>
              One click. One pack. Fully organised.
            </p>
            <div className={shared.bodyCopy}>
              <p>
                When you need to demonstrate GDPR compliance, generate a
                complete audit pack that includes:
              </p>
              <ul className={shared.bulletList}>
                <li>Organisation GDPR summary</li>
                <li>Record of Processing Activities</li>
                <li>Data subject request history</li>
                <li>Incident and breach register</li>
                <li>Evidence and policy index</li>
              </ul>
              <p>Exports are available as:</p>
              <ul className={shared.bulletList}>
                <li>
                  <strong>PDF</strong> (easy to review and share)
                </li>
                <li>
                  <strong>ZIP</strong> (for advisors or consultants)
                </li>
              </ul>
              <p>
                Each export is timestamped and versioned, providing a clear
                audit trail.
              </p>
            </div>
          </div>
        </section>

        {/* Clear Boundaries */}
        <section className={shared.section}>
          <div className={shared.container}>
            <h2 className={shared.sectionTitle}>
              Clear Boundaries (Important)
            </h2>
            <div className={shared.bodyCopy}>
              <p>
                To keep the tool simple, safe, and low-risk, it intentionally
                does <strong>not</strong>:
              </p>
              <ul className={shared.bulletList}>
                <li>Provide legal advice</li>
                <li>Automatically delete data from your systems</li>
                <li>Scan websites or manage cookie consent</li>
                <li>Replace professional advisors or consultants</li>
              </ul>
              <p>
                The purpose of the tool is to{" "}
                <strong>record decisions and actions</strong>, not to make them
                for you.
              </p>
            </div>
          </div>
        </section>

        {/* Who This Is For */}
        <section className={`${shared.section} ${shared.sectionAlt}`}>
          <div className={shared.container}>
            <h2 className={shared.sectionTitle}>
              Who This Is For
            </h2>
            <h3 className={shared.subsectionTitle}>A good fit if you:</h3>
            <ul className={shared.bulletList}>
              <li>Are a small or growing business</li>
              <li>Handle customer, client, or employee personal data</li>
              <li>Want GDPR to be organised and manageable</li>
              <li>Need to demonstrate compliance when asked</li>
            </ul>
            <p className={shared.bodyCopy}>
              Common users include:
            </p>
            <ul className={shared.bulletList}>
              <li>Agencies</li>
              <li>Clinics and practices</li>
              <li>SaaS companies</li>
              <li>E-commerce businesses</li>
              <li>Professional services firms</li>
            </ul>

            <h3 className={shared.subsectionTitle}>Not ideal if you:</h3>
            <ul className={shared.bulletList}>
              <li>Are a large enterprise with bespoke legal systems</li>
              <li>Need full automation or data discovery</li>
              <li>Require sector-specific compliance tooling</li>
            </ul>
          </div>
        </section>

        {/* Built With Accountability */}
        <section className={shared.section}>
          <div className={shared.container}>
            <h2 className={shared.sectionTitle}>
              Built With Accountability in Mind
            </h2>
            <ul className={shared.bulletList}>
              <li>EU-hosted infrastructure</li>
              <li>Secure access controls</li>
              <li>Clear audit trails</li>
              <li>Designed around Irish DPC guidance</li>
            </ul>
            <p className={shared.bodyCopy}>
              GDPR compliance is ongoing — this tool helps you{" "}
              <strong>document it properly</strong>.
            </p>
          </div>
        </section>

        {/* Next Steps */}
        <section className={`${shared.section} ${shared.sectionAlt}`}>
          <div className={shared.container}>
            <h2 className={shared.sectionTitle}>Next Steps</h2>
            <p className={shared.bodyCopy}>
              If you'd like to see how this works in practice:
            </p>
            <ul className={shared.bulletList}>
              <li>View a sample GDPR audit pack</li>
              <li>Request a short walkthrough</li>
              <li>Ask questions before committing</li>
            </ul>
            <p className={shared.finalCopy}>
              <strong>Make GDPR calm and boring again.</strong>
            </p>
            <div className={shared.ctas}>
              <Link href="/#cta" className={shared.ctaPrimary}>
                View sample audit pack
              </Link>
              <Link href="/signup" className={shared.ctaSecondary}>
                Register for free
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
