"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { headerNavConfig } from "@/config/nav";
import styles from "./Header.module.css";

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const getNavHref = (href: string) => href;

  const isActive = (item: (typeof headerNavConfig)[0]) => {
    if (item.href === "/") return pathname === "/";
    return pathname === item.href || pathname.startsWith(item.href + "/");
  };

  useEffect(() => {
    if (!mobileOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className={styles.navbar} role="banner">
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Link href="/" className={styles.brandLink}>
            <img src="/logo.png" alt="" className={styles.logoImg} />
          </Link>
        </div>

        <nav className={styles.nav} aria-label="Primary">
          {headerNavConfig.map((item) => (
            <Link
              key={item.href}
              href={getNavHref(item.href)}
              className={`${styles.navLink} ${isActive(item) ? styles.navLinkActive : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <Link href="/signin" className={styles.signIn}>Sign in</Link>
          <Link href="/signup" className={styles.btnPrimary}>Register free</Link>
        </div>

        <button
          type="button"
          className={styles.hamburger}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-panel"
        >
          <span className={styles.hamburgerIcon} aria-hidden />
        </button>
      </div>

      <div
        id="mobile-nav-panel"
        ref={panelRef}
        className={`${styles.mobilePanel} ${mobileOpen ? styles.mobilePanelOpen : ""}`}
        aria-hidden={!mobileOpen}
        onClick={(e) => e.target === e.currentTarget && setMobileOpen(false)}
      >
        <div className={styles.mobileDropdown} onClick={(e) => e.stopPropagation()}>
          <nav className={styles.mobileNav} aria-label="Mobile navigation">
            {headerNavConfig.map((item) => (
              <Link
                key={item.href}
                href={getNavHref(item.href)}
                className={`${styles.mobileNavLink} ${isActive(item) ? styles.mobileNavLinkActive : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className={styles.mobileDivider} />
          <Link href="/signin" className={styles.mobileSignIn} onClick={() => setMobileOpen(false)}>Sign in</Link>
          <Link href="/signup" className={styles.mobileCtaPrimary} onClick={() => setMobileOpen(false)}>Register free</Link>
        </div>
      </div>
    </header>
  );
}
