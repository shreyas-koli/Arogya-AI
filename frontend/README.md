# Arogya AI — Frontend Application

This directory contains the Next.js web application for the Arogya AI clinical decision-support and healthcare intelligence research prototype.

> **Status:** Module 4 (Clinical Frontend Application Shell), Phase 4.3: Application Shell & Navigation.<br/>
> Established responsive application shell with semantic sidebar navigation, clinical header, breadcrumbs, accessible mobile drawer, PageContainer wrapper, and valid internal roadmap routes (`/`, `/patients`, `/analysis`, `/research`, `/admin`).

---

## 1. Environment & Prerequisites

* **Node.js:** Node.js `v20.x` LTS or higher (tested on Node.js `v24.18.0`).
* **Package Manager:** `npm` (tested on npm `11.16.0`) with committed `package-lock.json`.
* **Framework Stack:**
  * Next.js: `16.4.3` (App Router with Turbopack)
  * React: `19.3.0`
  * TypeScript: `5.x` (Strict type checking enabled)
  * ESLint: `9.x` with `eslint-config-next`

---

## 2. Getting Started & Installation

From the repository root or the `frontend/` directory:

```bash
# Navigate to frontend directory
cd frontend

# Install exact pinned dependencies from package-lock.json
npm ci
```

---

## 3. Operational Commands

All commands are executed from the `frontend/` directory:

| Command | Action | Description |
| :--- | :--- | :--- |
| `npm run dev` | Local Dev Server | Starts Next.js development server at `http://localhost:3000` with fast refresh. |
| `npm run build` | Production Build | Compiles TypeScript, runs route optimization, and generates static production output. |
| `npm run start` | Production Server | Runs the compiled production server on port 3000. |
| `npm run lint` | ESLint | Executes ESLint against all source files using Next.js core web vitals and TypeScript rules. |
| `npm run type-check` | TypeScript Check | Runs `tsc --noEmit` to verify type safety without emitting build artifacts. |

---

## 4. Application Shell & Navigation (Phase 4.3)

The application shell provides a standardized, accessible clinical-research layout across all routes.

### Shell Architecture & Components

* **`AppShell` ([`components/layout/AppShell.tsx`](components/layout/AppShell.tsx)):** Master client shell managing layout geometry, mobile navigation drawer state, backdrop overlay, route synchronization, and `Escape` key listeners.
* **`Sidebar` ([`components/layout/Sidebar.tsx`](components/layout/Sidebar.tsx)):** Primary navigation sidebar featuring semantic `<nav>` markup, active route highlighting (`aria-current="page"`), roadmap stage badges, and prototype version/safety footer.
* **`Header` ([`components/layout/Header.tsx`](components/layout/Header.tsx)):** Clinical header providing mobile drawer toggling (`aria-expanded`, `aria-controls`), dynamic route context title, and prominent "Research Prototype — Human Review Only" safety indicator.
* **`Breadcrumbs` ([`components/layout/Breadcrumbs.tsx`](components/layout/Breadcrumbs.tsx)):** W3C WAI-ARIA compliant breadcrumb trail reflecting true hierarchical routing.
* **`PageContainer` ([`components/layout/PageContainer.tsx`](components/layout/PageContainer.tsx)):** Reusable page scaffold providing standardized heading, description, breadcrumb integration, and responsive content margins.

### Canonical Roadmap Destinations

All navigation links resolve to valid, statically prerendered routes inside the shell:

| Navigation Item | Route | Roadmap Module | Purpose | Status in Shell |
| :--- | :--- | :--- | :--- | :--- |
| **Overview** | `/` | Module 4 | Clinical intelligence overview & research landing | Active Shell & Spec |
| **Patient Intelligence** | `/patients` | Module 6 | Longitudinal timelines, encounter history, vitals | Planned Roadmap Preview |
| **Clinical Workspace** | `/analysis` | Module 8 | Multimodal case intake, triage, and review | Planned Roadmap Preview |
| **AI Research Lab** | `/research` | Module 18 / M9–14 | Model evaluation, SHAP, and Grad-CAM benches | Planned Roadmap Preview |
| **Administration** | `/admin` | Module 19 | Role-based access control & audit trail | Planned Roadmap Preview |

---

## 5. Design Tokens & Visual Foundation

The design system communicates clinical clarity, scientific credibility, precision, and trust. Tokens are implemented entirely as standard CSS custom properties in [`frontend/app/globals.css`](app/globals.css) and consumed via CSS Modules.

### Semantic Token Categories

| Category | Token Prefix | Examples | Purpose |
| :--- | :--- | :--- | :--- |
| **Colors (Brand)** | `--color-brand-` | `--color-brand-primary`, `--color-brand-subtle`, `--color-brand-border` | Clinical deep teal/cyan identity and interactive states. |
| **Colors (Accent)** | `--color-accent-` | `--color-accent-primary`, `--color-accent-subtle` | Secondary medical blue/slate accent. |
| **Colors (Surfaces)** | `--color-bg-` | `--color-bg-canvas`, `--color-bg-surface`, `--color-bg-surface-elevated` | Layered canvas, card, and modal surfaces. |
| **Colors (Text)** | `--color-text-` | `--color-text-primary`, `--color-text-secondary`, `--color-text-muted` | High-contrast WCAG AAA/AA text hierarchy. |
| **Colors (Status)** | `--color-{status}-` | `--color-success-fg`, `--color-warning-bg`, `--color-danger-border` | Status indicators (Success, Warning, Danger, Info). |
| **Typography** | `--font-`, `--font-size-` | `--font-sans`, `--font-size-display`, `--font-size-body`, `--font-weight-bold` | Scalable type scale with fluid clamp headings. |
| **Spacing** | `--space-` | `--space-1` (4px) to `--space-20` (80px), `--space-table-cell-y` | 4pt/8pt systematic grid for cards, forms, and dense data tables. |
| **Borders & Radii** | `--border-`, `--radius-` | `--border-width-sm`, `--radius-sm` (6px), `--radius-lg` (12px), `--radius-full` | Restrained radii and border widths. |
| **Elevation** | `--shadow-` | `--shadow-sm`, `--shadow-md`, `--shadow-lg` | Clean, subtle shadows without glowing artifacts. |
| **Layout & Sizing** | `--layout-`, `--control-` | `--layout-max-width` (1120px), `--control-height-md` (40px) | Layout constraints, gutters, and dense row tokens. |
| **Motion** | `--motion-` | `--motion-duration-fast`, `--motion-easing-default` | Respects `prefers-reduced-motion` unconditionally. |

---

## 6. Environment Variables

Frontend configuration is driven by environment variables using Next.js conventions:

* Template file: [`frontend/.env.example`](.env.example)
* Local configuration file: `frontend/.env.local` (excluded from version control in `.gitignore`).

### Key Variables

| Variable | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | URL | `http://127.0.0.1:8000/api/v1` | Base endpoint URL for the backend FastAPI service. |
| `NEXT_PUBLIC_APP_ENV` | String | `development` | Active environment profile (`development`, `staging`, `production`). |

---

## 7. Directory Structure

```text
frontend/
├── .env.example                # Environment variable template
├── .gitignore                  # Frontend-specific ignores (.next, node_modules)
├── eslint.config.mjs           # ESLint 9 flat configuration
├── next.config.ts              # Next.js configuration (Turbopack, cache components)
├── next-env.d.ts               # Next.js TypeScript type declarations
├── package.json                # Pinned frontend dependencies and scripts
├── package-lock.json           # Deterministic npm lockfile
├── tsconfig.json               # TypeScript strict configuration
├── README.md                   # Frontend architecture & navigation documentation
├── app/
│   ├── favicon.ico             # Application favicon
│   ├── globals.css             # Vanilla CSS design tokens system & accessible reset
│   ├── layout.tsx              # Root layout wrapping AppShell & fonts
│   ├── page.tsx                # Overview & research landing page
│   ├── page.module.css         # Scoped CSS module for landing page content
│   ├── admin/
│   │   └── page.tsx            # Administration & governance route
│   ├── analysis/
│   │   └── page.tsx            # Clinical workspace & case analysis route
│   ├── patients/
│   │   └── page.tsx            # Patient intelligence & timeline route
│   └── research/
│       └── page.tsx            # AI research lab & model evaluation route
├── components/
│   └── layout/
│       ├── AppShell.tsx        # Master responsive layout container
│       ├── AppShell.module.css # Scoped styles for shell, sidebar, and header
│       ├── Breadcrumbs.tsx     # Semantic accessible breadcrumbs component
│       ├── Header.tsx          # Top bar with page context & status indicator
│       ├── PageContainer.tsx   # Reusable page scaffold
│       ├── PageContainer.module.css # Scoped styles for PageContainer
│       └── Sidebar.tsx         # Primary navigation sidebar & mobile drawer
└── public/                     # Static public assets (SVG icons, logos)
```

---

## 8. Current Implementation Limitations & Roadmap

* **Clinical Workflow Disconnection:** In Phase 4.3, the frontend provides the application shell and navigation framework. Destination routes are valid and styled, but **not yet connected** to live backend REST endpoints, patient cohort data, or clinical inference pipelines.
* **Component Library (Phase 4.4+):** Shared button, input, badge, table, modal, and clinical card components will be established in subsequent phases.
* **Authentication & Authorization:** Client-side route guards, user session state, and JWT token refresh are deferred to Module 7.
* **Research Disclaimer:** Arogya AI is an investigative research prototype. It does not provide certified medical diagnosis or autonomous clinical decision-making.
