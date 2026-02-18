import Link from "next/link";
import shared from "../shared.module.css";
import styles from "./page.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SigninForm from "@/components/SigninForm";

export const metadata = {
  title: "Sign in — GDPR Evidence",
  description:
    "Access your GDPR Evidence workspace. Sign in to manage your RoPA, evidence, and audit packs.",
};

export default function SigninPage() {
  return (
    <div className={shared.page}>
      <Header />

      <main id="main-content" tabIndex={-1}>
        <section className={shared.section} aria-labelledby="signin-heading">
          <div className={`${shared.container} ${styles.signinLayout}`}>
            <div className={`${shared.featureCard} ${styles.signinCard}`}>
              <h1 id="signin-heading" className={styles.signinTitle}>
                Sign in
              </h1>
              <p className={styles.signinSubtitle}>
                Access your GDPR Evidence workspace.
              </p>

              <SigninForm />

              <div className={styles.secondaryCta}>
                <p className={styles.secondaryCtaText}>
                  Don&apos;t have a workspace yet?
                </p>
                <Link href="/signup" className={styles.secondaryCtaLink}>
                  Register for free
                </Link>
              </div>

              <p className={styles.footerTrust}>
                EU-hosted storage. Role-based access. Export-ready audit packs.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
