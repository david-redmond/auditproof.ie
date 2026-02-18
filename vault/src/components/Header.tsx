"use client";

import Link from "next/link";
import shared from "@/app/shared.module.css";

type HeaderProps = {
  /** When true, show Sign in link + "Register for free" primary (for forgot/reset password pages). */
  authVariant?: boolean;
};

/** Primary CTA: signup. On auth pages: "Sign in" link + "Register for free" button. */
export default function Header({ authVariant }: HeaderProps) {
  return (
    <header className={shared.header}>
      <div className={shared.headerInner}>
        <Link href="/" className={shared.logo}>
          <img src="/logo.png" alt="GDPR Evidence" className={shared.logoImage} />
        </Link>
        <nav className={shared.headerNav} aria-label="Primary">
          <Link href="/gdpr" className={shared.headerNavLink}>
            Product
          </Link>
          <Link href="/partners" className={shared.headerNavLink}>
            Partners
          </Link>
          <Link href="/security" className={shared.headerNavLink}>
            Security
          </Link>
          {authVariant ? (
            <>
              <Link href="/signin" className={shared.headerNavLink}>
                Sign in
              </Link>
              <Link href="/signup" className={shared.ctaPrimary}>
                Register for free
              </Link>
            </>
          ) : (
            <>
              <Link href="/#cta" className={shared.ctaSecondaryLink}>
                View sample audit pack
              </Link>
              <Link href="/signin" className={shared.headerNavLink}>
                Sign in
              </Link>
              <Link href="/signup" className={shared.ctaPrimary}>
                Register for free
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
