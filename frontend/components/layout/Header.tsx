import React from "react";
import styles from "./AppShell.module.css";

export interface HeaderProps {
  onToggleNav: () => void;
  isNavOpen: boolean;
  currentPath: string;
}

function getPageContext(pathname: string): string {
  if (pathname === "/") {
    return "Overview & Research Summary";
  }
  if (pathname.startsWith("/patients")) {
    return "Patient Intelligence";
  }
  if (pathname.startsWith("/analysis")) {
    return "Clinical Workspace";
  }
  if (pathname.startsWith("/research")) {
    return "AI Research Lab";
  }
  if (pathname.startsWith("/admin")) {
    return "Administration & Governance";
  }
  return "Arogya AI";
}

export function Header({ onToggleNav, isNavOpen, currentPath }: HeaderProps) {
  const pageContext = getPageContext(currentPath);

  return (
    <header className={styles.header} role="banner">
      <div className={styles.headerLeft}>
        <button
          type="button"
          className={styles.menuButton}
          onClick={onToggleNav}
          aria-expanded={isNavOpen}
          aria-controls="app-sidebar"
          aria-label={isNavOpen ? "Close navigation menu" : "Open navigation menu"}
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
            {isNavOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>

        <span className={styles.headerTitle}>{pageContext}</span>
      </div>

      <div className={styles.headerRight}>
        <div
          className={styles.researchPill}
          role="status"
          aria-label="Application status: Research Prototype, Human Review Required"
        >
          <span className={styles.researchDot} aria-hidden="true" />
          <span>Research Prototype — Human Review Only</span>
        </div>
      </div>
    </header>
  );
}
