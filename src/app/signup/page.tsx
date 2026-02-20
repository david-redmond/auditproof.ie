import shared from "../shared.module.css";
import styles from "./page.module.css";
import SignupForm from "@/components/SignupForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HotjarPageTag from "@/components/HotjarPageTag";

export const metadata = {
  title: "Create your GDPR workspace — GDPR Evidence",
  description:
    "Get your GDPR records organised and audit-ready. Create your workspace in about 2 minutes. No credit card required.",
};

export default function SignupPage() {
  return (
    <div className={shared.page}>
      <HotjarPageTag tag="signup" />
      <Header />

      <main id="main-content" tabIndex={-1}>
        <section className={shared.section}>
          <div className={`${shared.container} ${styles.signupLayout}`}>
            <div className={styles.signupContent}>
              <h1 className={shared.heroTitle}>
                Create your GDPR workspace
              </h1>
              <p className={shared.heroSub}>
                Get your GDPR records organised and audit-ready — without
                complexity or legal jargon. Creating your workspace takes about{" "}
                <strong>2 minutes</strong>.
              </p>

              <h2 className={shared.sectionTitle}>
                What happens after you sign up
              </h2>
              <p className={shared.bodyCopy}>
                After creating your account, you'll be able to:
              </p>
              <ul className={shared.bulletList}>
                <li>Record your processing activities (RoPA)</li>
                <li>Log deletion and correction requests</li>
                <li>Record incidents and decisions</li>
                <li>Upload policies and evidence</li>
                <li>Generate a GDPR audit pack when needed</li>
              </ul>
              <p className={shared.bodyCopy}>
                You can explore everything before deciding to subscribe.
              </p>

              <blockquote className={shared.pullQuote}>
                This tool helps you <strong>record and demonstrate</strong> GDPR
                compliance. It does not provide legal advice or make compliance
                decisions for you.
              </blockquote>

              <div className={shared.featureCard}>
                <SignupForm />
              </div>

              <p className={styles.footerTrust}>
                EU-hosted data • Secure access • Built around Irish DPC guidance
              </p>
            </div>
            <figure className={`${shared.heroFigure} ${styles.signupFigure}`}>
              <img
                className={shared.heroImage}
                src="/illustrations/signup-secure.svg"
                alt="Secure signup with protected GDPR documents"
              />
            </figure>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
