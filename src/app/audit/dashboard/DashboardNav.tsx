"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { auditPath } from "@/lib/constants";
import styles from "./DashboardNav.module.css";

type DashboardNavProps = {
  userName: string;
  userEmail: string;
  canManageUsers?: boolean;
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  onSidebarClose?: () => void;
  hamburgerRef?: React.RefObject<HTMLButtonElement | null>;
};

function initials(name: string, email: string): string {
  const trimmed = name.trim();
  if (trimmed.length >= 2) {
    const parts = trimmed.split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return trimmed.slice(0, 2).toUpperCase();
  }
  if (email.length >= 1) return email.slice(0, 2).toUpperCase();
  return "?";
}

export function DashboardNav({
  userName,
  userEmail,
  canManageUsers = false,
  sidebarOpen = false,
  onToggleSidebar,
  onSidebarClose,
  hamburgerRef,
}: DashboardNavProps) {
  const router = useRouter();
  const displayName = userName.trim() || userEmail || "User";
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  async function handleLogout() {
    setMenuOpen(false);
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  useEffect(() => {
    if (!menuOpen) return;
    const el = menuRef.current;
    const trigger = triggerRef.current;
    if (!el) return;

    const focusables = el.querySelectorAll<HTMLElement>("a, button");
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        trigger?.focus();
        return;
      }
      if (e.key === "ArrowDown" && document.activeElement === trigger) {
        e.preventDefault();
        first?.focus();
        return;
      }
      if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          trigger?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          trigger?.focus();
        }
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (el.contains(target) || trigger?.contains(target)) return;
      setMenuOpen(false);
    };

    first?.focus();
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <header className={styles.header} role="banner">
      <div className={styles.inner}>
        <div className={styles.left}>
          {onToggleSidebar && (
            <button
              ref={hamburgerRef}
              type="button"
              onClick={onToggleSidebar}
              className={styles.hamburger}
              aria-label="Open menu"
              aria-expanded={sidebarOpen}
              aria-controls="dashboard-sidebar"
            >
              <span className={styles.hamburgerIcon} aria-hidden />
            </button>
          )}
          <Link href={auditPath("/dashboard")} className={styles.logo}>
            <img src="/logo.png" alt="Vault" className={styles.logoImage} />
            <span className={styles.brandName}>Vault</span>
            <span className={styles.tagline}>Audit-proof GDPR</span>
          </Link>
        </div>

        <div className={styles.right}>
          <div className={styles.userMenuWrap} ref={menuRef}>
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className={styles.userTrigger}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-controls="user-menu"
              id="user-menu-button"
            >
              <span className={styles.avatar} aria-hidden>
                {initials(displayName, userEmail)}
              </span>
              <span className={styles.userName}>{displayName}</span>
            </button>
            {menuOpen && (
              <div
                id="user-menu"
                className={styles.userDropdown}
                role="menu"
                aria-labelledby="user-menu-button"
              >
                <Link
                  href={auditPath("/dashboard/settings/account")}
                  role="menuitem"
                  className={styles.menuItem}
                  onClick={() => setMenuOpen(false)}
                >
                  My account
                </Link>
                {canManageUsers && (
                  <Link
                    href={auditPath("/dashboard/settings/organisation")}
                    role="menuitem"
                    className={styles.menuItem}
                    onClick={() => setMenuOpen(false)}
                  >
                    Organisation settings
                  </Link>
                )}
                <button
                  type="button"
                  role="menuitem"
                  className={styles.menuItem}
                  onClick={handleLogout}
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
