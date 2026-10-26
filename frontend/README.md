# Arogya AI — Frontend Application

This directory contains the Next.js web application for the Arogya AI clinical decision-support and healthcare intelligence research prototype.

> **Status:** Module 4 (Clinical Frontend Application Shell), Phase 4.4: Reusable UI Component Primitives.<br/>
> Established comprehensive library of reusable, accessible UI component primitives (`Button`, `Card`, `Badge`, `Table`, `Form`, `Dialog`, `Tabs`, `Skeleton`, `Toast`) built on Arogya AI design tokens and integrated into the application shell. Verified with 24 automated unit tests.

---

## 1. Environment & Prerequisites

* **Node.js:** Node.js `v20.x` LTS or higher (tested on Node.js `v24.18.0`).
* **Package Manager:** `npm` (tested on npm `11.16.0`) with committed `package-lock.json`.
* **Framework Stack:**
  * Next.js: `16.4.3` (App Router with Turbopack)
  * React: `19.3.0`
  * TypeScript: `5.x` (Strict type checking enabled)
  * ESLint: `9.x` with `eslint-config-next`
  * Test Runner: Node.js native `node:test` executed via `tsx` with custom ESM CSS loader

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
| `npm run test` | Automated Tests | Executes 24 component unit tests across 8 suites using `node:test` and `tsx`. |

---

## 4. UI Component Library (Phase 4.4)

All shared UI primitives are located in [`frontend/components/ui/`](components/ui/) and exported via a central barrel [`index.ts`](components/ui/index.ts).

### Component Summary

| Component | Primitives & Variants | Key Features |
| :--- | :--- | :--- |
| **Button** | `primary`, `secondary`, `outline`, `ghost`, `danger`<br/>Sizes: `sm`, `md`, `lg` | Semantic `<button>`, native types (`button`, `submit`, `reset`), leading/trailing icons, disabled state with `aria-disabled`. |
| **Card** | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` | Composable structure, polymorphic `as` prop (`article`, `section`, `div`), subtle clinical elevation. |
| **Badge** | `neutral`, `info`, `success`, `warning`, `danger`<br/>Sizes: `sm`, `md` | Explicit text labels, optional indicator dot (`withDot`), high-contrast clinical status tokens. |
| **Table** | `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableCell`, `TableCaption` | Responsive horizontal scroll wrapper, semantic `scope="col"`, dense row token support, accessible caption. |
| **Form** | `Label`, `Input`, `Textarea`, `Select`, `Checkbox`, `FormField` | Programmatic label association, clear `aria-invalid` error states with `role="alert"`, helper text, custom accessible checkbox. |
| **Dialog** | `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogBody`, `DialogFooter`, `DialogClose` | Accessible modal (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`), Escape key listener, backdrop dismiss, focus management, `asChild` composition. |
| **Tabs** | `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` | W3C WAI-ARIA tab pattern (`role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`, `role="tabpanel"`). |
| **Skeleton** | `rectangular`, `circular`, `text` | Decorative loading placeholder (`aria-hidden="true"`), pulse animation respecting `prefers-reduced-motion`. |
| **Toast** | `neutral`, `info`, `success`, `warning`, `danger` | Accessible notification presentation (`role="status"`, `role="alert"`, `aria-live="polite"`), dismissible button. |

### Usage Examples

```tsx
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  FormField,
  Input,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui";

// Card & Table Usage
export function SpecCard() {
  return (
    <Card as="article">
      <CardHeader>
        <CardTitle as="h3">Platform Specifications</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>FastAPI Gateway</TableCell>
              <TableCell><Badge variant="success">Verified</Badge></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// Dialog with Form Fields
export function ConfirmModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Review</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Confirm Review Parameters</DialogTitle>
        <DialogDescription>Review synthetic analysis parameters before proceeding.</DialogDescription>
        <FormField label="Reviewer Notes" htmlFor="notes" helperText="Optional internal audit note">
          <Input id="notes" placeholder="Enter notes..." />
        </FormField>
        <DialogClose asChild>
          <Button variant="primary">Accept</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
```

### Accessibility Guidelines

1. **Semantic Elements:** All primitives use native HTML elements (`<button>`, `<table>`, `<dialog>` / `role="dialog"`, `<label>`, `<input>`).
2. **Accessible Contrast:** Colors adhere to WCAG AAA/AA contrast tokens on both light and dark backgrounds.
3. **Keyboard Focus:** Every interactive element has visible `:focus-visible` styling (`--color-focus-ring` with 2px offset).
4. **Motion Safety:** All animations (Skeleton pulse, Dialog scale, Toast fade) are suppressed under `@media (prefers-reduced-motion: reduce)`.
5. **No Color-Only State:** Badges and alerts always include descriptive text labels; colors never serve as the sole communication medium.

### Explicitly Deferred Functionality

* **Data Grid Engine:** Complex sorting, multi-column filtering, pagination, and virtual scrolling are deferred until real patient/cohort data requires them (Module 6).
* **Clinical Intake Forms:** Live medical file uploads, DICOM previewers, and EHR patient intake validation are deferred to Modules 7 & 8.
* **Global Notification Bus:** Standalone global toast queue and push notification systems are deferred to later application integration phases.

---

## 5. Application Shell & Navigation

* **`AppShell` ([`components/layout/AppShell.tsx`](components/layout/AppShell.tsx)):** Master client shell managing layout geometry, mobile navigation drawer state, backdrop overlay, route synchronization, and `Escape` key listeners.
* **`Sidebar` ([`components/layout/Sidebar.tsx`](components/layout/Sidebar.tsx)):** Primary navigation sidebar featuring semantic `<nav>` markup, active route highlighting (`aria-current="page"`), roadmap stage badges, and prototype version/safety footer.
* **`Header` ([`components/layout/Header.tsx`](components/layout/Header.tsx)):** Clinical header providing mobile drawer toggling (`aria-expanded`, `aria-controls`), dynamic route context title, and prominent "Research Prototype — Human Review Only" safety indicator.
* **`Breadcrumbs` ([`components/layout/Breadcrumbs.tsx`](components/layout/Breadcrumbs.tsx)):** W3C WAI-ARIA compliant breadcrumb trail reflecting true hierarchical routing.
* **`PageContainer` ([`components/layout/PageContainer.tsx`](components/layout/PageContainer.tsx)):** Reusable page scaffold providing standardized heading, description, breadcrumb integration, and responsive content margins.

### Canonical Roadmap Destinations

All navigation links resolve to valid, statically prerendered routes inside the shell:

| Navigation Item | Route | Roadmap Module | Purpose | Status in Shell |
| :--- | :--- | :--- | :--- | :--- |
| **Overview** | `/` | Module 4 | Clinical intelligence overview & component showcase | Active Shell & Primitives |
| **Patient Intelligence** | `/patients` | Module 6 | Longitudinal timelines, encounter history, vitals | Planned Roadmap Preview |
| **Clinical Workspace** | `/analysis` | Module 8 | Multimodal case intake, triage, and review | Planned Roadmap Preview |
| **AI Research Lab** | `/research` | Module 18 / M9–14 | Model evaluation, SHAP, and Grad-CAM benches | Planned Roadmap Preview |
| **Administration** | `/admin` | Module 19 | Role-based access control & audit trail | Planned Roadmap Preview |

---

## 6. Design Tokens & Visual Foundation

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

## 7. Environment Variables

Frontend configuration is driven by environment variables using Next.js conventions:

* Template file: [`frontend/.env.example`](.env.example)
* Local configuration file: `frontend/.env.local` (excluded from version control in `.gitignore`).

### Key Variables

| Variable | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | URL | `http://127.0.0.1:8000/api/v1` | Base endpoint URL for the backend FastAPI service. |
| `NEXT_PUBLIC_APP_ENV` | String | `development` | Active environment profile (`development`, `staging`, `production`). |

---

## 8. Directory Structure

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
├── README.md                   # Frontend architecture & component documentation
├── app/
│   ├── favicon.ico             # Application favicon
│   ├── globals.css             # Vanilla CSS design tokens system & accessible reset
│   ├── layout.tsx              # Root layout wrapping AppShell & fonts
│   ├── page.tsx                # Overview landing page & component showcase
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
│   ├── layout/
│   │   ├── AppShell.tsx        # Master responsive layout container
│   │   ├── AppShell.module.css # Scoped styles for shell, sidebar, and header
│   │   ├── Breadcrumbs.tsx     # Semantic accessible breadcrumbs component
│   │   ├── Header.tsx          # Top bar with page context & status indicator
│   │   ├── PageContainer.tsx   # Reusable page scaffold
│   │   ├── PageContainer.module.css # Scoped styles for PageContainer
│   │   └── Sidebar.tsx         # Primary navigation sidebar & mobile drawer
│   └── ui/
│       ├── index.ts            # Central barrel export for all UI primitives
│       ├── Badge.tsx           # Semantic status badge component
│       ├── Badge.module.css    # Scoped styles for Badge
│       ├── Button.tsx          # Polymorphic button primitive
│       ├── Button.module.css   # Scoped styles for Button
│       ├── Card.tsx            # Composable Card primitives
│       ├── Card.module.css     # Scoped styles for Card
│       ├── Dialog.tsx          # Accessible modal dialog primitive
│       ├── Dialog.module.css   # Scoped styles for Dialog
│       ├── Form.tsx            # Accessible form controls & wrappers
│       ├── Form.module.css     # Scoped styles for Form controls
│       ├── Skeleton.tsx        # Loading placeholder primitive
│       ├── Skeleton.module.css # Scoped styles for Skeleton
│       ├── Table.tsx           # Semantic table primitives & wrapper
│       ├── Table.module.css    # Scoped styles for Table
│       ├── Tabs.tsx            # W3C WAI-ARIA tab navigation
│       ├── Tabs.module.css     # Scoped styles for Tabs
│       ├── Toast.tsx           # Accessible notification toast
│       └── Toast.module.css    # Scoped styles for Toast
├── tests/
│   ├── css-loader.mjs          # Node ESM loader for mocking CSS module imports
│   ├── register-css.mjs        # Node loader registration hook
│   └── components.test.tsx     # 24 unit tests covering all UI primitives
└── public/                     # Static public assets (SVG icons, logos)
```

---

## 9. Current Implementation Limitations & Roadmap

* **Clinical Workflow Disconnection:** In Phase 4.4, the frontend provides the application shell, navigation framework, and reusable UI primitives. Destination routes and component previews are functional and styled, but **not yet connected** to live backend REST endpoints, patient cohort data, or clinical inference pipelines.
* **Authentication & Authorization:** Client-side route guards, user session state, and JWT token refresh are deferred to Module 7.
* **Research Disclaimer:** Arogya AI is an investigative research prototype. It does not provide certified medical diagnosis or autonomous clinical decision-making.
