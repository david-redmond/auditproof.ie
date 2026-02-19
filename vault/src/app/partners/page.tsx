import Link from "next/link";
import shared from "../shared.module.css";
import styles from "./page.module.css";
import PartnerSignupForm from "@/components/PartnerSignupForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HotjarPageTag from "@/components/HotjarPageTag";

export const metadata = {
  title: "Partners — GDPR Evidence",
  description:
    "Help your SME clients stay GDPR audit-ready and earn 10% recurring commission. Free partner access, co-branded exports. Apply today.",
};

const BENEFITS = [
  { icon: "％", title: "10% recurring commission", text: "Earn on every referred subscription, month after month." },
  { icon: "◇", title: "Co-branded audit packs", text: "Optional: your logo on client export packs." },
  { icon: "◆", title: "Free partner access", text: "Use the platform to support your own clients at no extra cost." },
  { icon: "▸", title: "Simple referrals", text: "Unique link, no admin burden. We handle onboarding." },
];

const CLIENT_FEATURES = [
  { icon: "/illustrations/ropa.svg", title: "RoPA (Record of Processing Activities)" },
  { icon: "/illustrations/dsr.svg", title: "Data subject request log" },
  { icon: "/illustrations/incident.svg", title: "Incident & breach register" },
  { icon: "/illustrations/policies.svg", title: "Policies & evidence storage" },
  { icon: "/illustrations/hero-vault.svg", title: "Audit trails and timestamps" },
  { icon: "/illustrations/product-flow.svg", title: "One-click audit export (PDF/ZIP)" },
];

const WHO_CARDS = [
  "Accountants",
  "Bookkeepers",
  "MSP / IT support",
  "Web agencies",
  "Business support firms",
  "GDPR consultants",
];

const FAQ = [
  {
    q: "How does commission work?",
    a: "You refer clients via your unique partner link. When they subscribe, you earn 10% of their recurring fee for as long as they stay. Paid monthly.",
  },
  {
    q: "Do I need to provide GDPR advice?",
    a: "No. GDPR Evidence is a record-keeping and export tool. Your clients use it to stay organised; you don’t need to give legal or compliance advice unless that’s already your role.",
  },
  {
    q: "Can I manage multiple clients?",
    a: "Yes. Each client has their own workspace. You can refer as many as you like and track them from your partner dashboard.",
  },
  {
    q: "Can exports be co-branded?",
    a: "Yes. We can add your logo to audit pack exports (optional). We’ll set this up when you join the programme.",
  },
  {
    q: "Is this suitable for Irish SMEs?",
    a: "Yes. We’re built for SMEs in Ireland and the EU. Data is EU-hosted and the tool is designed for GDPR accountability (RoPA, requests, incidents, evidence).",
  },
];

export default function PartnersPage() {
  return (
    <div className={shared.page}>
      <HotjarPageTag tag="partners" />
      <Header />

      <main id="main-content" tabIndex={-1}>
        {/* 1. Hero */}
        <section className={styles.heroWrap}>
          <div className={styles.heroGrid}>
            <div>
              <h1 className={styles.heroHeadline}>
                Help your clients stay GDPR audit-ready — and earn recurring revenue.
              </h1>
              <p className={styles.heroSubhead}>
                Give SMEs a structured GDPR evidence vault with one-click audit exports, without heavy compliance platforms or extra admin.
              </p>
              <div className={styles.heroCtas}>
                <Link href="#partner-apply" className={shared.ctaPrimary}>
                  Apply to become a partner
                </Link>
                <a href="/sample-audit-pack.pdf" className={shared.ctaSecondary} download="sample-audit-pack.pdf">
                  View sample audit pack
                </a>
              </div>
              <div className={styles.heroTrust}>
                <span className={styles.heroTrustItem}>Free partner access</span>
                <span className={styles.heroTrustItem}>Co-branded exports</span>
                <span className={styles.heroTrustItem}>10% recurring commission</span>
                <span className={styles.heroTrustItem}>No exclusivity</span>
              </div>
            </div>
            <div className={styles.heroImageWrap}>
              <img
                src="/illustrations/partner-hub.svg"
                alt="Partner dashboard and client workspaces with co-branded audit export preview"
                width={520}
                height={340}
              />
            </div>
          </div>
        </section>

        {/* 2. Quick benefits */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.sectionInner}>
            <h2 className={styles.sectionTitle}>Partner benefits</h2>
            <div className={styles.benefitGrid}>
              {BENEFITS.map((b) => (
                <div key={b.title} className={styles.benefitCard}>
                  <div className={styles.benefitIcon} aria-hidden>{b.icon}</div>
                  <div className={styles.benefitTitle}>{b.title}</div>
                  <p className={styles.benefitText}>{b.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Problem */}
        <section className={styles.section}>
          <div className={styles.sectionInner}>
            <div className={styles.twoCol}>
              <div>
                <h2 className={`${styles.sectionTitle} ${styles.sectionTitleLeft}`}>
                  SMEs panic when they’re asked for GDPR evidence.
                </h2>
                <ul className={styles.bulletShort}>
                  <li>RoPA records scattered in spreadsheets</li>
                  <li>Requests buried in emails</li>
                  <li>Incidents not logged consistently</li>
                  <li>No exportable audit trail</li>
                </ul>
                <p style={{ marginTop: "var(--theme-space-4)", fontWeight: 600, color: "var(--theme-text-strong)" }}>
                  Your clients don’t need more policies — they need evidence.
                </p>
              </div>
              <div className={styles.twoColImage}>
                <img src="/illustrations/partners-problem.svg" alt="Messy files and emails turning into a clean audit-ready vault" width={320} height={200} />
              </div>
            </div>
          </div>
        </section>

        {/* 4. What clients get */}
        <section className={`${styles.section} ${styles.sectionGradient}`}>
          <div className={styles.sectionInner}>
            <h2 className={styles.sectionTitle}>What your clients get</h2>
            <div className={styles.featureCardGrid}>
              {CLIENT_FEATURES.map((f) => (
                <div key={f.title} className={styles.featureCard}>
                  <img src={f.icon} alt="" className={styles.featureCardIcon} width={40} height={40} />
                  <div className={styles.featureCardTitle}>{f.title}</div>
                </div>
              ))}
            </div>
            <div className={styles.screenshotStrip}>
              <img src="/illustrations/ropa.svg" alt="RoPA table" width={200} height={200} />
              <img src="/illustrations/dsr.svg" alt="Data subject request log" width={200} height={200} />
              <img src="/illustrations/incident.svg" alt="Incident register" width={200} height={200} />
            </div>
          </div>
        </section>

        {/* 5. How it works */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.sectionInner}>
            <h2 className={styles.sectionTitle}>How it works</h2>
            <div className={styles.stepsWrap}>
              <div>
                <div className={styles.stepNum}>1</div>
                <div className={styles.stepTitle}>Refer a client</div>
                <p className={styles.stepText}>Share your unique partner link. No forms, no admin.</p>
              </div>
              <div>
                <div className={styles.stepNum}>2</div>
                <div className={styles.stepTitle}>Client creates a workspace</div>
                <p className={styles.stepText}>They sign up and record GDPR evidence (RoPA, requests, incidents).</p>
              </div>
              <div>
                <div className={styles.stepNum}>3</div>
                <div className={styles.stepTitle}>You earn 10%</div>
                <p className={styles.stepText}>Recurring commission on their subscription, paid monthly.</p>
              </div>
            </div>
            <div style={{ maxWidth: 360, margin: "var(--theme-space-6) auto 0" }}>
              <img src="/illustrations/partners-how-it-works.svg" alt="Flow: Refer → Workspace → Export → Earn 10%" width={360} height={120} />
            </div>
          </div>
        </section>

        {/* 6. Co-branding */}
        <section className={styles.section}>
          <div className={styles.sectionInner}>
            <h2 className={styles.sectionTitle}>Co-branded audit exports (optional)</h2>
            <p className={styles.sectionSubtitle}>
              Deliver professional GDPR evidence packs with your branding included.
            </p>
            <div className={styles.cobrandMockup}>
              <img src="/illustrations/partners-cobrand.svg" alt="PDF audit pack cover with partner logo and ZIP export preview" width={400} height={280} />
            </div>
            <p style={{ textAlign: "center", marginTop: "var(--theme-space-4)" }}>
              <a href="/sample-audit-pack.pdf" className={shared.ctaSecondary} download="sample-audit-pack.pdf">
                View sample audit pack
              </a>
            </p>
          </div>
        </section>

        {/* 7. Who this is for */}
        <section className={`${styles.section} ${styles.sectionGradient}`}>
          <div className={styles.sectionInner}>
            <h2 className={styles.sectionTitle}>A great fit for:</h2>
            <div className={styles.whoGrid}>
              {WHO_CARDS.map((label) => (
                <div key={label} className={styles.whoCard}>
                  {label}
                </div>
              ))}
            </div>
            <p className={styles.sectionSubtitle} style={{ marginTop: "var(--theme-space-6)", marginBottom: 0 }}>
              If your clients handle customer or employee data, this helps them stay organised and audit-ready.
            </p>
          </div>
        </section>

        {/* 8. Partner application form */}
        <section className={`${styles.section} ${styles.sectionAlt}`} id="partner-apply">
          <div className={styles.sectionInner}>
            <h2 className={styles.sectionTitle}>Apply to become a partner</h2>
            <p className={styles.sectionSubtitle}>
              Takes about 2 minutes. We respond within 1–2 business days.
            </p>
            <div className={styles.formSection}>
              <PartnerSignupForm />
              <p className={styles.formTrust}>
                No spam. No cold sales. Only partner programme follow-up.
              </p>
            </div>
          </div>
        </section>

        {/* 9. FAQ */}
        <section className={styles.section}>
          <div className={styles.sectionInner}>
            <h2 className={styles.sectionTitle}>FAQ</h2>
            <ul className={styles.faqList}>
              {FAQ.map((item) => (
                <li key={item.q} className={styles.faqItem}>
                  <div className={styles.faqQ}>{item.q}</div>
                  <p className={styles.faqA}>{item.a}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 10. Final CTA */}
        <section className={styles.finalCta}>
          <div className={styles.sectionInner}>
            <h2 className={styles.finalCtaHeadline}>
              Offer calm GDPR compliance to your clients.
            </h2>
            <p className={styles.finalCtaSub}>
              Give them an evidence vault they can export anytime — and build recurring revenue for your firm.
            </p>
            <div className={styles.finalCtaBtns}>
              <Link href="#partner-apply" className={shared.ctaPrimary}>
                Apply to become a partner
              </Link>
              <a href="/sample-audit-pack.pdf" className={shared.ctaSecondary} download="sample-audit-pack.pdf">
                View sample audit pack
              </a>
            </div>
            <p className={styles.disclaimer}>
              We provide the evidence trail; we don’t give legal advice.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
