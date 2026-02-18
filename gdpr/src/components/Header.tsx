"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import shared from "@/app/shared.module.css";

/** Marketing header: Product, Partners, Security; Sign in (active on /signin); primary CTA "Register for free" on signin page, else "Create workspace". */
export default function Header() {
  const pathname = usePathname();
  const isSigninPage = pathname === "/signin";

  return (
    <header className={shared.header}>
      <div className={shared.headerInner}>
        <Link href="/" className={shared.logo}>
          <img src="/logo.png" alt="GDPR Evidence" className={shared.logoImage} />
        </Link>
        <nav className={shared.headerNav} aria-label="Main">
          <Link href="/gdpr" className={shared.headerNavLink}>
            Product
          </Link>
          <Link href="/partners" className={shared.headerNavLink}>
            Partners
          </Link>
          <Link href="/security" className={shared.headerNavLink}>
            Security
          </Link>
          <Link href="/#cta" className={shared.ctaSecondaryLink}>
            View sample audit pack
          </Link>
          <Link
            href="/signin"
            className={isSigninPage ? shared.headerNavLinkActive : shared.headerNavLink}
            aria-current={isSigninPage ? "page" : undefined}
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className={shared.ctaPrimary}
          >
            {isSigninPage ? "Register for free" : "Create workspace"}
          </Link>
        </nav>
      </div>
    </header>
  );
}
