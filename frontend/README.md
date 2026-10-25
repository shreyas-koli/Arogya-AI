# Arogya AI — Frontend Application

This directory contains the Next.js web application for the Arogya AI clinical decision-support and healthcare intelligence research prototype.

> **Status:** Module 4 (Clinical Frontend Application Shell), Phase 4.2: Design Tokens and Visual Foundation.<br/>
> Established comprehensive clinical design tokens in Vanilla CSS, accessible styling primitives, high-contrast palette with light/dark support, responsive layout scales, and WCAG AA/AAA compliant typography.

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

## 4. Design Tokens & Visual Foundation

The design system communicates clinical clarity, scientific credibility, precision, and trust. Tokens are implemented entirely as standard CSS custom properties in [`frontend/app/globals.css`](app/globals.css) and consumed via CSS Modules.

### Token Location & Structure

All design tokens are defined on `:root` and `@media (prefers-color-scheme: dark)` in:
```text
frontend/app/globals.css
```

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

### How to Consume Design Tokens

When styling components, import the component CSS module and reference CSS custom properties directly:

```css
/* Example Component CSS Module */
.clinicalCard {
  background-color: var(--color-bg-surface);
  border: var(--border-width-sm) solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
  color: var(--color-text-primary);
}

.criticalAlert {
  background-color: var(--color-danger-bg);
  border: var(--border-width-sm) solid var(--color-danger-border);
  color: var(--color-danger-fg);
}
```

### Guidelines for Future Components

1. **No Hardcoded Values:** Do not introduce ad-hoc hex colors, arbitrary pixel paddings, or one-off margins. Always use `--color-*` and `--space-*` tokens.
2. **Accessible Contrast:** Text must maintain at least 4.5:1 contrast against its background (WCAG AA) and 7:1 for headings/primary text (WCAG AAA).
3. **Keyboard Focus:** Always preserve visible keyboard focus via `:focus-visible` using `--color-focus-ring`.
4. **Reduced Motion:** Interactive transitions must use `--motion-duration-*` or be disabled under `@media (prefers-reduced-motion: reduce)`.
5. **Dark Mode Coherence:** Use semantic color tokens (`--color-bg-surface`, `--color-text-primary`) rather than fixed white/black so the dark color scheme adapts automatically.

---

## 5. Environment Variables

Frontend configuration is driven by environment variables using Next.js conventions:

* Template file: [`frontend/.env.example`](.env.example)
* Local configuration file: `frontend/.env.local` (excluded from version control in `.gitignore`).

### Key Variables

| Variable | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | URL | `http://127.0.0.1:8000/api/v1` | Base endpoint URL for the backend FastAPI service. |
| `NEXT_PUBLIC_APP_ENV` | String | `development` | Active environment profile (`development`, `staging`, `production`). |

---

## 6. Directory Structure

```text
frontend/
├── .env.example         # Environment variable template
├── .gitignore           # Frontend-specific ignores (.next, node_modules)
├── eslint.config.mjs    # ESLint 9 flat configuration
├── next.config.ts       # Next.js configuration (Turbopack, cache components)
├── next-env.d.ts        # Next.js TypeScript type declarations
├── package.json         # Pinned frontend dependencies and scripts
├── package-lock.json    # Deterministic npm lockfile
├── tsconfig.json        # TypeScript strict configuration
├── README.md            # Frontend architecture & design token documentation
├── app/
│   ├── favicon.ico      # Application favicon
│   ├── globals.css      # Vanilla CSS design tokens system & accessible reset
│   ├── layout.tsx       # Root layout, skip-to-content, fonts, and metadata
│   ├── page.tsx         # Product landing page demonstrating design tokens
│   └── page.module.css  # Scoped CSS module consuming semantic tokens
└── public/              # Static public assets (SVG icons, logos)
```

---

## 7. Current Implementation Limitations & Roadmap

* **Clinical Workflow Disconnection:** In Phase 4.2, the frontend serves as an isolated application shell and landing page. It is **not yet connected** to live backend REST endpoints, patient cohort data, or clinical inference pipelines.
* **Component Library (Phase 4.3):** Shared button, input, badge, table, modal, and clinical card components will be established in subsequent phases.
* **Navigation & Shell (Phase 4.4):** Sidebar navigation, breadcrumbs, and clinician workspace shells belong to later phases.
* **Authentication & Authorization:** Client-side route guards and JWT/session management are deferred to subsequent phases.
* **Research Disclaimer:** Arogya AI is an investigative research prototype. It does not provide certified medical diagnosis or autonomous clinical decision-making.
