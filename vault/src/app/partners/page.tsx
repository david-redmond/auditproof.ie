import Link from "next/link";
import shared from "../shared.module.css";
import styles from "./page.module.css";
import PartnerSignupForm from "@/components/PartnerSignupForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Partners — GDPR Evidence",
  description:
    "Partner with us to make GDPR calm and manageable for SMEs. 10% recurring commission, free partner access, co-branded exports. No exclusivity.",
};

export default function PartnersPage() {
  return (
    <div className={shared.page}>
      <Header />

      <main id="main-content" tabIndex={-1}>
        {/* Hero */}
        <section className={shared.hero}>
          <div className={`${shared.container} ${shared.heroLayout}`}>
            <div className={shared.heroCopy}>
              <h1 className={shared.heroTitle}>
                Partner with us to make GDPR calm and manageable for SMEs
              </h1>
              <p className={shared.heroSub}>
                Help your clients stay audit-ready with structured GDPR records
                and one-click exports — without heavy platforms or ongoing
                consultancy.
              </p>
              <p className={shared.badgeNoAdvice}>
                We don’t provide legal advice. We provide the evidence trail.
              </p>
              <div className={shared.ctas}>
                <a href="#become-a-partner" className={shared.ctaPrimary}>
                  Become a partner
                </a>
                <Link href="/signup" className={shared.ctaSecondary}>
                  Register for free
                </Link>
              </div>
            </div>
            <figure className={shared.heroFigure}>
              <img
                className={shared.heroImage}
                src="/illustrations/partner-hub.svg"
                alt="Partner network for GDPR support"
              />
            </figure>
          </div>
        </section>

        {/* Why partners use this / What clients get / What you get – clear cards */}
        <section className={shared.section}>
          <div className={shared.container}>
            <h2 className={shared.sectionTitle}>
              Why partners use this
            </h2>
            <div className={shared.bodyCopy}>
              <p>
                SMEs often have <em>some</em> GDPR elements in place, but when
                they’re asked to show evidence (RoPA, deletion requests,
                incidents), it’s spread across emails, folders, and
                spreadsheets. That’s where panic starts.
              </p>
              <p>
                Our tool keeps the essential GDPR evidence organised, timestamped,
                and exportable in minutes.
              </p>
            </div>
          </div>
        </section>

        <section className={`${shared.section} ${shared.sectionAlt}`}>
          <div className={shared.container}>
            <h2 className={shared.sectionTitle}>
              What your clients get / What you get
            </h2>
            <div className={`${shared.featureGrid} ${styles.twoColGrid}`}>
              <div className={shared.featureCard}>
                <h3 className={shared.featureTitle}>
                  What your clients get
                </h3>
                <ul className={shared.bulletList}>
                  <li>Record of Processing Activities (RoPA)</li>
                  <li>Data subject request log (deletion / correction / access)</li>
                  <li>Incident &amp; breach register</li>
                  <li>Evidence &amp; policy storage</li>
                  <li>One-click audit pack export (PDF / ZIP)</li>
                </ul>
              </div>
              <div className={shared.featureCard}>
                <h3 className={shared.featureTitle}>
                  What you get as a partner
                </h3>
                <ul className={shared.bulletList}>
                  <li>
                    <strong>10% recurring commission</strong> on referred
                    subscriptions
                  </li>
                  <li>Free partner access</li>
                  <li>Optional co-branded exports</li>
                  <li>No exclusivity, no obligation</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Who it's a fit for */}
        <section className={shared.section}>
          <div className={shared.container}>
            <h2 className={shared.sectionTitle}>
              Who it’s a fit for
            </h2>
            <div className={shared.bodyCopy}>
              <p>
                Accountants, bookkeepers, business support firms, MSPs/IT
                providers, web agencies, and GDPR consultants who want a simple,
                practical way to help clients stay organised.
              </p>
            </div>
          </div>
        </section>

        {/* A note on scope */}
        <section className={`${shared.section} ${shared.sectionAlt}`}>
          <div className={shared.container}>
            <h2 className={shared.sectionTitle}>
              A note on scope
            </h2>
            <div className={shared.bodyCopy}>
              <p>
                We don’t provide legal advice and we don’t replace professional
                advisory services. We provide the structure and evidence trail
                so clients can demonstrate accountability.
              </p>
            </div>
          </div>
        </section>

        {/* Partner CTA lane – separate from general signup */}
        <section className={shared.section}>
          <div className={shared.container}>
            <div className={styles.partnerCtaLane}>
              <h2 className={shared.sectionTitle}>Become a partner</h2>
              <p className={shared.bodyCopy}>
                Fill in the form below and we’ll follow up with next steps. Takes about 2 minutes.
              </p>
              <Link href="#become-a-partner" className={shared.ctaPrimary}>
                Apply to become a partner
              </Link>
            </div>
          </div>
        </section>

        {/* Form */}
        <section className={`${shared.section} ${shared.sectionAlt}`} id="become-a-partner">
          <div className={shared.container}>
            <p className={shared.badgeNoAdvice}>
              This is not legal advice. We provide the evidence trail for your clients.
            </p>
            <div className={`${shared.featureCard} ${styles.formCard}`}>
              <PartnerSignupForm />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
