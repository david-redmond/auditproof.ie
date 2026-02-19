import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footerWrap} role="contentinfo">
      <div className={styles.mainFooter}>
        <div className={styles.footerGrid}>
          <div className={styles.footerBrand}>
            <Link href="/" className={styles.footerLogo}>
              <img src="/logo.png" alt="" className={styles.footerLogoImg} />
              GDPR Evidence
            </Link>
            <p className={styles.footerTagline}>
              Audit-ready GDPR records for small businesses.
            </p>
            <div className={styles.footerTrustRow}>
              <span>EU-hosted data</span>
              <span>Audit trails</span>
              <span>Access controls</span>
            </div>
          </div>

          <div>
            <h3 className={styles.footerColTitle}>Product</h3>
            <ul className={styles.footerColLinks}>
              <li><Link href="/gdpr" className={styles.footerColLink}>Product</Link></li>
              <li><Link href="/pricing" className={styles.footerColLink}>Pricing</Link></li>
              <li><Link href="/partners" className={styles.footerColLink}>Partners</Link></li>
            </ul>
          </div>

          <div>
            <h3 className={styles.footerColTitle}>Company</h3>
            <ul className={styles.footerColLinks}>
              <li><Link href="/security" className={styles.footerColLink}>Security</Link></li>
              <li><Link href="/contact" className={styles.footerColLink}>Contact</Link></li>
              <li><Link href="/legal" className={styles.footerColLink}>Legal</Link></li>
            </ul>
          </div>

          <div>
            <h3 className={styles.footerColTitle}>Policies</h3>
            <ul className={styles.footerColLinks}>
              <li><Link href="/privacy" className={styles.footerColLink}>Privacy Policy</Link></li>
              <li><Link href="/terms" className={styles.footerColLink}>Terms</Link></li>
              <li><Link href="/cookies" className={styles.footerColLink}>Cookies</Link></li>
            </ul>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <span className={styles.bottomCopyright}>© {year} go-solutions</span>
          <span className={styles.bottomDisclaimer}>
            GDPR Evidence helps you record and demonstrate compliance. This is not legal advice.
          </span>
        </div>
      </div>
    </footer>
  );
}
