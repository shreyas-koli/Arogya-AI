# Arogya AI — API Data Contracts & Schema Architecture

> **Status Notice:** Implemented as of Module 3 (Database Persistence & Data Layer), Phase 3.4.<br/>
> This document specifies the decoupled Pydantic request and response schemas, validation rules, sensitive-field exclusion policies, and serialization conventions for Arogya AI.
>
> **Implementation Scope Boundary:**
> * **Active Schemas:** Pydantic v2 data contracts under [`backend/app/schemas/`](../../backend/app/schemas/) for User, Role, Patient, Encounter, Observation, UploadedAsset, AnalysisRun, AuditEvent, and common pagination.
> * **Deferred Functionality:** Database migrations and seeds (Phase 3.5), domain repositories and services (Phase 3.6), backup/recovery procedures (Phase 3.7), and CRUD route handlers (Phase 3.6+).

---

## 1. Architectural Separation: Persistence Models vs. API Schemas

A fundamental architectural principle of Arogya AI is the strict decoupling of **SQLAlchemy persistence models** from **Pydantic API contracts**:

```text
  ┌───────────────────────────────────────────────────────────────┐
  │                        Client / UI                            │
  └───────────────────────────────┬───────────────────────────────┘
                                  │ HTTPS JSON Payloads
                                  ▼
  ┌───────────────────────────────────────────────────────────────┐
  │                    Pydantic API Contracts                     │
  │                   (backend/app/schemas/)                      │
  │  - Enforces input validation, field bounds, & extra="forbid"  │
  │  - Shields internal database columns and security secrets     │
  │  - Serializes responses via ConfigDict(from_attributes=True)   │
  └───────────────────────────────┬───────────────────────────────┘
                                  │ Service Layer Mediation (Phase 3.6)
                                  ▼
  ┌───────────────────────────────────────────────────────────────┐
  │                  SQLAlchemy Domain Entities                   │
  │                     (backend/app/db/models.py)                │
  │  - Manages relational tables, foreign keys, & DB indices      │
  │  - Enforces relational referential integrity (RESTRICT, etc.) │
  │  - Persists database-specific types (e.g. hashed_password)    │
  └───────────────────────────────────────────────────────────────┘
```

### Why Decoupling is Essential
1. **Security & Data Hiding:** Database models contain internal or sensitive attributes (e.g., `hashed_password`, internal filesystem `storage_path`, server-assigned timestamps). Exposing database models directly in API endpoints risks catastrophic data leakage.
2. **Independent Evolution:** Database table structures and API contracts evolve at different velocities. Decoupling allows refactoring database tables (e.g. normalization, partitioning) without breaking public API contracts.
3. **Payload Sanitization:** API request models validate and sanitize external user input prior to business logic execution, forbidding unknown fields (`extra="forbid"`) to prevent parameter injection attacks.

---

## 2. Naming Conventions & Schema Taxonomy

Arogya AI adopts standard schema suffixes across all domain entities:

| Schema Suffix | Base Class | Configuration | Primary Responsibility |
| :--- | :--- | :--- | :--- |
| **`*Create`** | `BaseSchema` | `extra="forbid"` | Validates client payloads for resource creation. Excludes server-generated identifiers (`id`), timestamps (`created_at`), and internal references. |
| **`*Update`** | `BaseSchema` | `extra="forbid"` | Validates client payloads for partial/full updates. All attributes are optional (`None` default) to support PATCH semantics. |
| **`*Response`** | `ORMModel` | `from_attributes=True` | Formats server responses. Safely maps from SQLAlchemy ORM instances, automatically serializing UUIDs, ISO 8601 UTC datetimes, and nested associations. |
| **`*Filter`** | `BaseSchema` | `extra="forbid"` | Validates query parameters for search, filtering, and range queries (e.g., `AuditEventFilter`). |

---

## 3. Serialization & Validation Conventions

### UUID & Timezone-Aware Timestamps
* **UUID Identifiers:** All primary keys and foreign keys are represented as Python `uuid.UUID` objects in Pydantic schemas. In JSON responses, Pydantic v2 automatically serializes UUIDs as standard 36-character hyphenated strings (`"123e4567-e89b-12d3-a456-426614174000"`).
* **ISO 8601 UTC Timestamps:** All event and lifecycle timestamps are validated for timezone awareness (`ensure_timezone_aware`). Naive datetimes (lacking timezone information) are strictly rejected with HTTP 422 validation errors. Timestamps serialize to ISO 8601 UTC strings (e.g. `"2026-10-25T10:00:00Z"`).

### Unknown Field Handling (`extra="forbid"`)
All request schemas inherit from `BaseSchema`, which enforces `model_config = ConfigDict(extra="forbid")`. Passing unexpected attributes (e.g. client passing `{"is_admin": true}` or `{"storage_path": "/etc/passwd"}`) triggers an immediate `ValidationError`.

### Standard Pagination Envelope
Collection endpoints return data wrapped in `PaginatedResponse[T]`:
```json
{
  "items": [],
  "total": 150,
  "page": 1,
  "page_size": 20
}
```

---

## 4. Sensitive Field Exclusion & Security Boundaries

### User & Authentication Credentials
* **Plaintext Password Handling:** `UserCreate` accepts a `password` field (min 8, max 128 chars) strictly for credential generation upon registration.
* **Response Exclusion:** `UserResponse` **never** defines or outputs `password` or `hashed_password`. Even when serializing directly from an ORM `User` instance populated with a password hash, the hash is dropped by design during Pydantic attribute selection.

### Uploaded Asset Metadata Boundary
* **No Client Storage Paths:** `AssetMetadataCreate` allows clients to declare display filenames, MIME media types, positive file sizes, and SHA-256 checksums (`^[a-fA-F0-9]{64}$`). Clients are strictly forbidden from providing `storage_path`.
* **Server-Assigned Storage:** The internal `storage_path` is assigned exclusively by backend storage services upon physical file ingest.
* **Zero Binary Content in JSON:** Binary image payloads must never be embedded in JSON metadata schemas.

### Analysis Run Boundary
* **No Client-Injected Results:** `AnalysisRunCreate` accepts model names, versions, target patient/asset references, and hyperparameters. Clients **cannot** submit `status`, `results_summary`, `error_message`, or `completed_at`.
* **Segregation of Results:** Model predictions (`results_summary`) are stored separately from ground-truth clinical observations (`Observation`). AI model evaluations represent research signals and must never overwrite confirmed medical records.

### Audit Event Privacy & Integrity
* **Immutable System Records:** `AuditEventResponse` and `AuditEventFilter` provide inspection capabilities for system administrators and compliance auditors. There is **no client-facing create or update schema** for audit events; audit records are written exclusively by server-side middleware and domain services.
* **Zero PHI/Secrets in Audit Payloads:** The `event_metadata` JSON object is restricted to operational telemetry (e.g. `request_id`, execution duration). Raw clinical measurements, patient names, credentials, and authorization headers are strictly excluded.

---

## 5. Rules Reserved for the Future Service Layer (Phase 3.6)

Pydantic schemas enforce syntactic and structural validity. Semantic business rules requiring database queries or multi-entity coordination must **not** be placed in Pydantic validators and are explicitly reserved for the future service layer:

1. **Patient-Encounter Referential Consistency:** When an `Observation`, `UploadedAsset`, or `AnalysisRun` references both a `patient_id` and an `encounter_id`, the service layer must verify that the specified encounter actually belongs to that patient.
2. **Uniqueness Collision Handling:** Uniqueness of `username`, `email`, `mrn_pseudonym`, and `storage_path` must be caught via database transactions and translated into HTTP 409 Conflict envelopes.
3. **Password Hashing:** Conversion of `UserCreate.password` into a secure cryptographic hash (e.g., Argon2id) occurs within the user service in Module 7 before persistence.
4. **Physical File Upload & Verification:** Verifying that an uploaded binary payload matches its declared `file_size_bytes` and `checksum_sha256` digest is handled by the storage service in Module 5.
5. **Role Assignment Authorization:** Ensuring that only users with administrative privileges can assign elevated roles to user accounts is enforced by authorization service policies in Module 7.

---

## 6. Known Limitations & Deferred Features

* **No Public CRUD Routers (Phase 3.6+):** Endpoints utilizing these schemas are not yet mounted. Schemas are prepared for domain services in Phase 3.6.
* **No Database Migrations or Seed Records (Phase 3.5):** Physical tables and seed records remain deferred to Phase 3.5.
* **No Regulatory Compliance Claim:** The presence of healthcare data structures does not constitute automated HIPAA, GDPR, or CDSCO medical device compliance. Arogya AI is strictly an academic research prototype.
