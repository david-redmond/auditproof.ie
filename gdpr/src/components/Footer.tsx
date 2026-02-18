import Link from "next/link";
import shared from "@/app/shared.module.css";

export default function Footer() {
  return (
    <footer className={shared.footer}>
      <div className={shared.container}>
        <div className={shared.footerGrid}>
          <div>
            <nav className={shared.footerLinks} aria-label="Footer navigation">
              <Link href="/gdpr" className={shared.footerLink}>
                Product
              </Link>
              <Link href="/#pricing" className={shared.footerLink}>
                Pricing
              </Link>
              <Link href="/partners" className={shared.footerLink}>
                Partner programme
              </Link>
              <Link href="/security" className={shared.footerLink}>
                Security
              </Link>
              <Link href="/privacy" className={shared.footerLink}>
                Privacy Policy
              </Link>
              <Link href="/terms" className={shared.footerLink}>
                Terms
              </Link>
              <Link href="/contact" className={shared.footerLink}>
                Contact
              </Link>
              <Link href="/signin" className={shared.footerLink}>
                Sign in
              </Link>
              <Link href="/signup" className={shared.footerLink}>
                Register
              </Link>
            </nav>
            <div className={shared.footerTrust}>
              <span>EU-hosted data</span>
              <span>Secure access controls</span>
              <span>Audit trails</span>
            </div>
          </div>
          <div>
            <h3 className={shared.footerSecurityTitle}>
              Privacy &amp; data hosting
            </h3>
            <ul className={shared.footerSecurityList}>
              <li>Data stored in the EU; no third-country transfers for core storage.</li>
              <li>Role-based access and audit logs for workspace activity.</li>
              <li>We don’t sell your data. See our Privacy Policy for details.</li>
            </ul>
          </div>
        </div>
        <p className={shared.footerLegal}>
          GDPR Evidence helps you record and demonstrate compliance. This is not legal advice.
        </p>
        <div className={shared.footerBottom}>
          <span className={shared.footerCopyright}>
            © {new Date().getFullYear()} go-solutions
          </span>
          <span className={shared.footerMadeWith}>
            Made with <span aria-hidden="true">♥</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
