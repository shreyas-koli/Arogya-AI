import React from "react";
import Link from "next/link";
import styles from "./AppShell.module.css";

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
}

interface NavItemConfig {
  href: string;
  label: string;
  badge?: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItemConfig[] = [
  {
    href: "/",
    label: "Overview",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    href: "/patients",
    label: "Patient Intelligence",
    badge: "M6",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    href: "/analysis",
    label: "Clinical Workspace",
    badge: "M8",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    href: "/research",
    label: "AI Research Lab",
    badge: "M18",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M10 2v7.31L4.62 17A2 2 0 0 0 6.3 20h11.4a2 2 0 0 0 1.68-3L14 9.31V2" />
        <line x1="8" y1="2" x2="16" y2="2" />
        <line x1="6.5" y1="15" x2="17.5" y2="15" />
      </svg>
    ),
  },
  {
    href: "/admin",
    label: "Administration",
    badge: "M19",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
];

export function Sidebar({ isOpen, onClose, currentPath }: SidebarProps) {
  return (
    <aside
      id="app-sidebar"
      className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}
      aria-label="Primary Navigation"
    >
      {/* Brand Header */}
      <div className={styles.sidebarHeader}>
        <Link href="/" className={styles.brandLink} onClick={onClose}>
          <div className={styles.brandIcon} aria-hidden="true">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 4v16m-8-8h16" />
            </svg>
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandName}>Arogya AI</span>
            <span className={styles.brandTagline}>Research Platform</span>
          </div>
        </Link>

        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close navigation drawer"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Nav Menu */}
      <nav className={styles.navSection} aria-label="Main Navigation">
        <span className={styles.navLabel}>Clinical Architecture</span>
        <ul className={styles.navList}>
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? currentPath === "/"
                : currentPath === item.href || currentPath.startsWith(item.href + "/");

            return (
              <li key={item.href} className={styles.navItem}>
                <Link
                  href={item.href}
                  className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
                  aria-current={isActive ? "page" : undefined}
                  onClick={onClose}
                >
                  <div className={styles.navLinkContent}>
                    <span className={styles.navIcon}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={styles.navBadge} aria-label={`Roadmap module ${item.badge}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer / Safety Notice */}
      <div className={styles.sidebarFooter}>
        <div className={styles.footerPrototypeBadge}>
          <span className={styles.footerDot} aria-hidden="true" />
          <span>Prototype v0.1</span>
        </div>
        <p className={styles.footerDisclaimer}>
          Academic research system. For clinician review &amp; evaluation only; not for autonomous care.
        </p>
      </div>
    </aside>
  );
}
