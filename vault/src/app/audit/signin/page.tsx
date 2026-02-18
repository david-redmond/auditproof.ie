import Link from "next/link";
import { Suspense } from "react";

import { auditPath } from "@/lib/constants";
import shared from "../../shared.module.css";
import styles from "./page.module.css";
import { RefCapture } from "../dashboard/RefCapture";
import SignInForm from "./SignInForm";
import { SignInMessage } from "./SignInMessage";

export const metadata = {
  title: "Sign in — Vault",
  description: "Sign in to your vault.",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string; org_deleted?: string }>;
}) {
  const params = await searchParams;
  return (
    <div className={shared.page}>
      <Suspense fallback={null}>
        <RefCapture />
      </Suspense>
      <header className={shared.header}>
        <div className={shared.headerInner}>
          <Link href="/" className={shared.logo}>
            <img src="/logo.png" alt="Vault" className={shared.logoImage} />
          </Link>
          <nav className={shared.headerNav} aria-label="Main">
            <Link href={auditPath("/signin")} className={shared.headerNavLink}>
              Sign in
            </Link>
          </nav>
        </div>
      </header>

      <main id="main-content" tabIndex={-1}>
        <section className={`${shared.section} ${styles.heroSection}`}>
          <div className={`${shared.container} ${styles.signinLayout}`}>
            <div className={styles.signinCopy}>
              <p className={styles.kicker}>GDPR Evidence Vault</p>
              <h1 className={shared.heroTitle}>Welcome back</h1>
              <p className={shared.heroSub}>
                Step into a calm, organised workspace for complex compliance
                work. Everything is grouped, searchable, and built to reduce
                cognitive load.
              </p>
              <div className={styles.pillRow}>
                <span className={styles.pill}>Secure access</span>
                <span className={styles.pill}>Human-friendly wording</span>
                <span className={styles.pill}>Audit-ready timeline</span>
              </div>
              <div className={styles.calloutCard}>
                <p className={styles.calloutTitle}>What you can do here</p>
                <ul className={styles.calloutList}>
                  <li>Track RoPA entries and processing context.</li>
                  <li>Manage DSR requests with clear deadlines.</li>
                  <li>Store policies and evidence in one place.</li>
                </ul>
              </div>
            </div>
            <div className={styles.signinPanel}>
              <p className={styles.panelTitle}>Sign in</p>
              <p className={styles.panelSub}>
                Use your work email to access your organisation’s vault.
              </p>
              <SignInMessage deleted={params.deleted} orgDeleted={params.org_deleted} />
              <SignInForm />
              <p className={styles.panelFoot}>
                <Link href="/forgot-password" className={styles.panelFootLink}>
                  Forgot password?
                </Link>
              </p>
              <p className={styles.panelFoot}>
                Need access? Ask your admin to create your credentials.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className={shared.footer}>
        <div className={shared.container}>
          <div className={shared.footerTrust}>
            <span>EU-hosted data</span>
            <span>Secure access controls</span>
            <span>Clear audit trails</span>
            <span>GDPR-first workflow</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
