import Link from "next/link";
import { getDisplayPriceAnnual, getDisplayPriceMonthly } from "@/lib/billing";
import shared from "../shared.module.css";
import styles from "./page.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Pricing — GDPR Evidence",
  description:
    "Simple, predictable GDPR pricing. All features included. RoPA, data subject request log, incident register, and exportable audit pack for SME GDPR compliance.",
};

const pricingFeatures = [
  "Unlimited users",
  "Unlimited GDPR records",
  "Unlimited exports",
  "Audit pack generator",
  "EU-hosted storage",
  "Role-based access controls",
  "Full audit logs",
];

export default function PricingPage() {
  const priceAnnual = getDisplayPriceAnnual();
  const priceMonthly = getDisplayPriceMonthly();

  return (
    <div className={shared.page}>
      <Header />

      <main id="main-content" tabIndex={-1}>
        {/* 1. Hero */}
        <section className={shared.hero}>
          <div className={shared.container}>
            <h1 className={shared.heroTitle}>Simple, predictable pricing.</h1>
            <p className={shared.heroSub}>
              All features included. No feature tiers. No hidden limits.
            </p>
          </div>
        </section>

        {/* 2. Pricing cards */}
        <section className={shared.section}>
          <div className={shared.container}>
            <div className={styles.pricingGrid}>
              <div className={`${styles.pricingCard} ${styles.pricingCardHighlight}`}>
                <span className={styles.pricingBadge}>Best value</span>
                <h3 className={styles.pricingCardTitle}>Annual</h3>
                <p className={styles.pricingPrice}>€{priceAnnual}</p>
                <p className={styles.pricingPeriod}>/ year · per business workspace</p>
                <ul className={styles.pricingCardList}>
                  {pricingFeatures.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <Link href="/signup" className={`${shared.ctaPrimary} ${styles.pricingCardCta}`}>
                  Start free
                </Link>
                <p className={styles.pricingNote}>Save compared to monthly billing.</p>
              </div>

              <div className={styles.pricingCard}>
                <h3 className={styles.pricingCardTitle}>Monthly</h3>
                <p className={styles.pricingPrice}>€{priceMonthly}</p>
                <p className={styles.pricingPeriod}>/ month · per business workspace</p>
                <ul className={styles.pricingCardList}>
                  {pricingFeatures.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <Link href="/signup" className={`${shared.ctaPrimary} ${styles.pricingCardCta}`}>
                  Start free
                </Link>
                <p className={styles.pricingNote}>Cancel anytime.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. What's included */}
        <section className={`${shared.section} ${shared.sectionAlt}`}>
          <div className={shared.container}>
            <h2 className={shared.sectionTitle}>What&apos;s included</h2>
            <ul className={styles.includedList}>
              <li>RoPA (Record of Processing Activities)</li>
              <li>Data Subject Request log</li>
              <li>Incident register</li>
              <li>Policies & evidence storage</li>
              <li>Structured exportable audit pack</li>
              <li>Timestamped audit trails</li>
              <li>Workspace ownership controls</li>
            </ul>
            <p className={shared.bodyCopy} style={{ marginTop: "var(--theme-space-4)" }}>
              No per-user fees. No feature restrictions.
            </p>
          </div>
        </section>

        {/* 4. Who this is for */}
        <section className={shared.section}>
          <div className={shared.container}>
            <h2 className={shared.sectionTitle}>Who this is for</h2>
            <p className={shared.bodyCopy}>
              GDPR Evidence is built for small and medium-sized businesses (typically 5–50 employees) who need to keep audit-ready GDPR records without a dedicated compliance team. If you&apos;re an enterprise with a dedicated compliance team, this likely isn&apos;t the right fit.
            </p>
          </div>
        </section>

        {/* 5. FAQ */}
        <section className={`${shared.section} ${shared.sectionAlt}`}>
          <div className={shared.container}>
            <h2 className={shared.sectionTitle}>FAQ</h2>
            <ul className={styles.faqList}>
              <li className={styles.faqItem}>
                <p className={styles.faqQuestion}>What&apos;s included in both plans?</p>
                <p className={styles.faqAnswer}>Both Annual and Monthly include the same features: unlimited users, unlimited GDPR records (RoPA, data subject request log, incident register, evidence store), unlimited exports, the audit pack generator, EU-hosted storage, role-based access, and full audit logs. There are no feature tiers.</p>
              </li>
              <li className={styles.faqItem}>
                <p className={styles.faqQuestion}>Can I switch between monthly and annual?</p>
                <p className={styles.faqAnswer}>Yes. You can change your billing cycle from your account or billing settings. Switching to annual saves you money compared to paying monthly.</p>
              </li>
              <li className={styles.faqItem}>
                <p className={styles.faqQuestion}>Is there a free trial?</p>
                <p className={styles.faqAnswer}>You can start free and explore the product. When you need a full business workspace with all features, you choose either monthly or annual billing at signup.</p>
              </li>
              <li className={styles.faqItem}>
                <p className={styles.faqQuestion}>Where is my data stored?</p>
                <p className={styles.faqAnswer}>In the European Union. We don&apos;t rely on third-country transfers for core storage. See our <Link href="/security" className={shared.footerLink}>Security</Link> page for details.</p>
              </li>
            </ul>
          </div>
        </section>

        {/* 6. Final CTA */}
        <section className={shared.section}>
          <div className={shared.container}>
            <h2 className={shared.sectionTitle}>
              Be ready when GDPR questions come up.
            </h2>
            <div className={shared.ctas}>
              <Link href="/signup" className={shared.ctaPrimary}>
                Start free
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
