# Arogya AI — Frontend Application

This directory contains the Next.js web application for the Arogya AI clinical decision-support and healthcare intelligence research prototype.

> **Status:** Module 4 (Clinical Frontend Application Shell), Phase 4.1: Initialize Next.js Frontend with TypeScript.<br/>
> Established Next.js App Router with TypeScript (strict mode), ESLint 9 flat configuration, Vanilla CSS design foundation, and accessible product landing page.

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

## 4. Environment Variables

Frontend configuration is driven by environment variables using Next.js conventions:

* Template file: [`frontend/.env.example`](.env.example)
* Local configuration file: `frontend/.env.local` (excluded from version control in `.gitignore`).

### Key Variables

| Variable | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | URL | `http://127.0.0.1:8000/api/v1` | Base endpoint URL for the backend FastAPI service. |
| `NEXT_PUBLIC_APP_ENV` | String | `development` | Active environment profile (`development`, `staging`, `production`). |

---

## 5. Directory Structure

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
├── README.md            # Frontend architecture & operator documentation
├── app/
│   ├── favicon.ico      # Application favicon
│   ├── globals.css      # Vanilla CSS design tokens & accessible reset
│   ├── layout.tsx       # Root layout, font definitions, and metadata
│   ├── page.tsx         # Initial product landing & verification page
│   └── page.module.css  # Scoped CSS module for landing page layout
└── public/              # Static public assets (SVG icons, logos)
```

---

## 6. Current Implementation Limitations & Roadmap

* **Clinical Workflow Disconnection:** In Phase 4.1, the frontend serves as an isolated application shell and landing page. It is **not yet connected** to live backend REST endpoints, patient cohort data, or clinical inference pipelines.
* **Component Library:** Design tokens, reusable UI primitives, and layout navigation (sidebar, breadcrumbs) are scheduled for Phase 4.2.
* **Authentication & Authorization:** Client-side route guards and JWT/session management are deferred to subsequent phases.
* **Research Disclaimer:** Arogya AI is an investigative research prototype. It does not provide certified medical diagnosis or autonomous clinical decision-making.
