"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { auditPath } from "@/lib/constants";
import styles from "./DashboardSidebar.module.css";

type NavItem = { href: string; label: string; badge?: string };

const GDPR_ITEMS: NavItem[] = [
  { href: auditPath("/dashboard"), label: "Dashboard" },
  { href: auditPath("/dashboard/ropa"), label: "Your data processing register" },
  { href: auditPath("/dashboard/requests"), label: "Customer data requests" },
  { href: auditPath("/dashboard/incidents"), label: "Security incidents" },
  { href: auditPath("/dashboard/evidence"), label: "Policies & supporting documents" },
];

const OUTPUTS_ITEMS: NavItem[] = [
  { href: auditPath("/dashboard/audit-exports"), label: "Export an audit pack" },
];

const ACCOUNT_ITEMS: NavItem[] = [
  { href: auditPath("/dashboard/settings/account"), label: "My account" },
];

const ORGANISATION_ITEMS: NavItem[] = [
  { href: auditPath("/dashboard/settings/organisation"), label: "Organisation settings" },
];

type SidebarProps = {
  isOpen?: boolean;
  onClose?: () => void;
  canManageUsers?: boolean;
  organisationName?: string;
};

export function DashboardSidebar({ isOpen = false, onClose, canManageUsers = false, organisationName }: SidebarProps) {
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLElement>(null);
  const prevPathnameRef = useRef<string | null>(null);

  function isActive(href: string) {
    const dashboardPath = auditPath("/dashboard");
    return pathname === href || (href !== dashboardPath && pathname.startsWith(href));
  }

  /* When drawer is open: focus trap, body scroll lock, close on Escape. */
  useEffect(() => {
    if (!isOpen || !onClose) return;
    const el = sidebarRef.current;
    if (!el) return;

    const focusables = el.querySelectorAll<HTMLElement>(
      'a, button, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusables[0];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    first?.focus();
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  /* Close drawer when route changes (e.g. after tapping a nav link). */
  useEffect(() => {
    if (prevPathnameRef.current !== null && prevPathnameRef.current !== pathname && onClose) {
      onClose();
    }
    prevPathnameRef.current = pathname;
  }, [pathname, onClose]);

  function NavLink({ href, label, badge }: NavItem) {
    const active = isActive(href);
    return (
      <li>
        <Link
          href={href}
          className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`}
          aria-current={active ? "page" : undefined}
        >
          <span className={styles.navLinkText}>{label}</span>
          {badge != null && badge !== "" && (
            <span className={styles.navBadge} aria-label={badge}>
              {badge}
            </span>
          )}
        </Link>
      </li>
    );
  }

  const sidebarContent = (
    <>
      {organisationName && (
        <div className={styles.orgHeader} aria-label="Organisation">
          {organisationName}
        </div>
      )}
      <div className={styles.sidebarContent}>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className={styles.closeButton}
          aria-label="Close menu"
        >
          ×
        </button>
      )}
      <div className={styles.section}>
        <span className={styles.sectionHeading} aria-hidden>
          GDPR records
        </span>
        <ul className={styles.sectionList}>
          {GDPR_ITEMS.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </ul>
      </div>
      <div className={styles.section}>
        <span className={styles.sectionHeading} aria-hidden>
          Outputs
        </span>
        <ul className={styles.sectionList}>
          {OUTPUTS_ITEMS.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </ul>
      </div>
      <div className={styles.section}>
        <span className={styles.sectionHeading} aria-hidden>
          Account
        </span>
        <ul className={styles.sectionList}>
          {ACCOUNT_ITEMS.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </ul>
      </div>
      {canManageUsers && (
        <div className={styles.section}>
          <span className={styles.sectionHeading} aria-hidden>
            Organisation
          </span>
          <ul className={styles.sectionList}>
            {ORGANISATION_ITEMS.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </ul>
        </div>
      )}
      </div>
    </>
  );

  return (
    <>
      {onClose && isOpen && (
        <button
          type="button"
          className={styles.backdrop}
          onClick={onClose}
          aria-label="Close menu"
          tabIndex={-1}
        />
      )}
      <nav
        id="dashboard-sidebar"
        ref={sidebarRef}
        className={`${styles.sidebar} ${isOpen && onClose ? styles.sidebarOverlay : ""}`}
        aria-label="Primary"
      >
        {sidebarContent}
      </nav>
    </>
  );
}
