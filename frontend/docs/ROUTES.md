# Arogya AI — Complete Frontend Route Inventory (Roadmap v2.0)

> **Document Status:** Complete Module Route Architecture (Module 4, Phase 4.6).<br/>
> This document accounts for all **21 canonical roadmap modules** from `docs/architecture/MODULE_DEPENDENCIES.md`, specifying their route path, implementation status, prerequisites, user-facing classification, and deferred functionality notes.

---

## 1. Overview & Architectural Principles

1. **Canonical Source of Truth:** All 21 modules adhere strictly to the roadmap sequence defined in `docs/architecture/MODULE_DEPENDENCIES.md` across 5 execution blocks.
2. **Honest Route States:** Every planned user-facing route is direct-loadable, rendered within the shared `AppShell`, and clearly communicates its actual readiness using `PlannedFeatureState`.
3. **No Fabricated Data or Workflows:** Route placeholders explicitly distinguish active frontend shell foundations from pending backend integrations, model inference, and EHR pipelines.
4. **Internal Foundations vs. User-Facing Routes:** Core platform foundations (Modules 1, 2, 3, 4, 9) that function as internal infrastructure, backend APIs, database persistence, or mathematical research engines are properly accounted for without creating artificial, unneeded top-level routes.

---

## 2. Canonical 21-Module Inventory Matrix

| Module | Canonical Module Name | Route Path | User-Facing / Category | Execution Block | Prerequisites | Implementation Status | Notes on Scope & Deferred Work |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **M1** | Project Foundation & Architecture | *N/A (Monorepo)* | Internal Foundation | Block 1 | None | **Complete** | Root repository layout, git isolation, CI/CD scripts, documentation baselines. |
| **M2** | Backend Platform | *N/A (`/api/v1`)* | Internal Foundation | Block 1 | M1 | **Complete** | Core FastAPI service, logging, request IDs, error conventions. API documented via `/api/v1/docs`. |
| **M3** | Database & Data Contracts | *N/A (Persistence)* | Internal Foundation | Block 1 | M1, M2 | **Complete** | PostgreSQL models, SQLAlchemy schemas, Alembic migrations (`98574e91500e`), synthetic development seed data, repository layer. |
| **M4** | Frontend Shell & Design System | `/` (Global Shell) | User-Facing Foundation | Block 1 | M1 | **In Progress (Phase 4.6)** | Next.js 16 App Router, responsive AppShell, clinical design tokens, UI primitives, application states, complete route architecture. |
| **M5** | Overview Dashboard | `/` | User-Facing (Clinical) | Block 2 | M2, M3, M4 | **Shell Active** (Roadmap M5) | Landing page with research disclaimers, architecture directions, foundation verification matrix, and component showcase. Live API counters deferred to Module 5. |
| **M6** | Patient Intelligence | `/patients` | User-Facing (Clinical) | Block 2 | M2, M3, M4, M5 | **Planned (Module 6)** | Longitudinal patient profiles, synthetic demographic cohorts, encounter records, and physiological observation timelines. EHR integration deferred. |
| **M7** | Security, Identity & File Handling | `/security` | User-Facing (Security/Gov) | Block 2 | M2, M3 | **Planned (Module 7)** | RBAC session policies, multi-factor authentication, cryptographic audit verification, validated medical image uploads. Auth boundaries deferred to Module 7. |
| **M8** | Clinical Workspace | `/analysis` | User-Facing (Clinical) | Block 2 | M3, M4, M5, M6, M7 | **Planned (Module 8)** | Multimodal clinical case intake, chief complaint entry, investigation workflow runners, and observation panel synthesis. Inference runners deferred. |
| **M9** | Tabular ML Research | *Integrated (`/research`)* | ML Research Pipeline | Block 3 | M3, M8 | **Planned (Module 9)** | Baseline scikit-learn / XGBoost risk models on structured vitals and labs. Surfaced directly in the AI Research Lab (`/research`) and Clinical Workspace (`/analysis`). |
| **M10** | Chest X-ray Imaging Research | `/imaging` | User-Facing (Clinical/Vision) | Block 3 | M3, M7, M8 | **Planned (Module 10)** | Chest radiography preprocessing, PyTorch deep learning vision pipeline, DICOM viewing, and Grad-CAM saliency heatmaps. Vision pipeline deferred to Module 10. |
| **M11** | Multi-Agent Orchestration | `/agents` | User-Facing (AI Research) | Block 3 | M8, M9, M10 | **Planned (Module 11)** | Deterministic LangGraph state coordination, specialized agent coordinator (Context, Lab, Vision, Knowledge, Critic), execution tracing. |
| **M12** | Medical Knowledge Hub & RAG | `/knowledge` | User-Facing (Knowledge) | Block 3 | M2, M3, M8, M11 | **Planned (Module 12)** | Clinical practice guidelines index, vector embeddings, source-attributed retrieval-augmented generation (RAG), and prompt-injection defenses. |
| **M13** | Critic, Consensus, Uncertainty & Safety | `/safety` | User-Facing (AI Safety) | Block 3 | M9, M10, M11, M12 | **Planned (Module 13)** | Cross-agent contradiction checking, explicit clinical disagreement preservation, entropy calibration, and safety abstention triggers. |
| **M14** | Explainability & Evidence Presentation | `/explainability` | User-Facing (XAI) | Block 3 | M9, M10, M11, M12, M13 | **Planned (Module 14)** | SHAP feature attribution waterfall plots, Grad-CAM saliency overlays, and guideline evidence synthesis panels. Model explainability runners deferred. |
| **M15** | Reports, Doctor Review & Feedback | `/reviews` | User-Facing (Clinical Workflow) | Block 4 | M7, M8, M9, M10, M11, M12, M13, M14 | **Planned (Module 15)** | Clinician oversight workstation: accept, modify, or reject AI-assisted findings; immutable audit logging separating raw AI outputs from doctor edits. |
| **M16** | Patient Timeline & Follow-up | `/timeline` | User-Facing (Care Workflow) | Block 4 | M3, M6, M7, M15 | **Planned (Module 16)** | Longitudinal patient trajectories, physiological trend charts, ambulatory encounter history, and staff-only follow-up task coordination. |
| **M17** | Hospital Intelligence & Financial Analytics | `/operations` | User-Facing (Operations) | Block 5 | M3, M4, M5, M15 | **Planned (Module 17)** | Departmental workload statistics, bed capacity simulation, compute inference and secure storage cost modeling. Measured vs simulated data segregation. |
| **M18** | AI Research Lab & Model Evaluation | `/research` | User-Facing (Research Bench) | Block 5 | M9, M10, M11, M12, M13, M14 | **Planned (Module 18)** | Comparative benchmarking (multi-agent vs single-model baselines), subgroup fairness metrics, cross-architecture experiment registry. |
| **M19** | Administration, Audit & Governance | `/admin` | User-Facing (Governance) | Block 5 | M3, M7, M15 | **Planned (Module 19)** | User administration, immutable audit query console, model version registry, runtime platform hardening. |
| **M20** | Deployment, Monitoring & Release | `/monitoring` | User-Facing (DevOps/Ops) | Block 5 | Core modules | **Planned (Module 20)** | Container orchestration (Docker Compose), CI/CD test pipelines, API latency telemetry, system health monitoring, release runbooks. |
| **M21** | Research Documentation & Readiness Review | `/readiness` | User-Facing (Compliance) | Block 5 | All modules | **Planned (Module 21)** | Academic handover package, standardized model cards, clinical safety gap analyses, and regulatory readiness reviews (MDR/FDA SaMD frameworks). |

---

## 3. Route Hierarchy & Navigation Structure

All user-facing routes are accessible directly and organized into four logical domain sections within the primary sidebar navigation:

```text
├── Overview (Block 2 / Shell Foundation)
│   └── / .................................... Overview Dashboard & Component Showcase (M5)
│
├── Clinical Workflows (Block 2 & Block 4)
│   ├── /patients ............................ Patient Intelligence (M6)
│   ├── /analysis ............................ Clinical Workspace & Case Analysis (M8)
│   ├── /imaging ............................. Chest X-ray Imaging & Research (M10)
│   ├── /reviews ............................. Doctor Review, Critique & Reports (M15)
│   └── /timeline ............................ Longitudinal Patient Trajectory & Follow-up (M16)
│
├── AI Research & Safety (Block 3)
│   ├── /research ............................ AI Research Lab & Model Evaluation (M18)
│   ├── /agents .............................. Multi-Agent Orchestration & State Graph (M11)
│   ├── /knowledge ........................... Medical Knowledge Hub & RAG Retrieval (M12)
│   ├── /safety .............................. Critic, Consensus & Uncertainty Safety (M13)
│   └── /explainability ...................... Explainability & Evidence Presentation (M14)
│
└── Governance & Operations (Block 2 & Block 5)
    ├── /admin ............................... Platform Administration & Governance (M19)
    ├── /security ............................ Security Safeguards & Identity Management (M7)
    ├── /operations .......................... Hospital Intelligence & Resource Simulation (M17)
    ├── /monitoring .......................... System Deployment & Telemetry Health (M20)
    └── /readiness ........................... Research Documentation & Readiness Review (M21)
```

---

## 4. Route Template Pattern

Every user-facing route is implemented using a standardized, accessible pattern:

```tsx
import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { PlannedFeatureState } from "@/components/states";

export const metadata: Metadata = {
  title: "[Canonical Module Name] — Arogya AI",
  description: "[Module purpose and architectural boundary]",
};

export default function ModulePage() {
  return (
    <PageContainer
      title="[Canonical Module Name]"
      description="[Brief description of intended capabilities]"
      breadcrumbs={[
        { label: "Overview", href: "/" },
        { label: "[Canonical Module Name]" },
      ]}
      badge={
        <div role="status" aria-label="Roadmap Status">
          <span>Module [N]: Planned</span>
        </div>
      }
    >
      <PlannedFeatureState
        moduleName="Module [N]: [Canonical Module Name]"
        targetBlock="Block [B]: [Execution Block]"
        statusText="Planned for a future module"
        description="[Honest explanation of planned capabilities versus current shell]"
        verifiedFoundations={[
          "[Verified Backend / Relational Model from earlier modules]",
        ]}
      />
      {/* Planned Domain Specifications & Architecture Alignments */}
    </PageContainer>
  );
}
```

---

## 5. Non-User-Facing Module Treatment

The following modules function as underlying architecture foundations or research pipeline engines rather than standalone top-level clinical views:

* **Module 1 (Project Foundation & Architecture):** Enforces monorepo structure, Git isolation boundaries, and validation scripts.
* **Module 2 (Backend Platform):** Implements the FastAPI gateway, request correlation IDs, and structured error envelopes (`/api/v1`).
* **Module 3 (Database & Data Contracts):** Provides PostgreSQL models, SQLAlchemy 2.0 sessions, Alembic migrations, and Pydantic data contracts.
* **Module 4 (Frontend Shell & Design System):** The active design system, CSS token registry, reusable UI primitives, and application states serving all routes.
* **Module 9 (Tabular ML Research):** Algorithmic baseline model research pipeline on structured labs/vitals. Directly surfaced through the AI Research Lab (`/research`) and Clinical Workspace (`/analysis`).
