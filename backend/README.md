# Arogya AI — Backend Platform

This directory contains the Python backend service, REST API routers, domain logic, and backend test suites for Arogya AI.

> **Status:** Module 3 (Database Persistence & Data Layer) — Phase 3.2: SQLAlchemy Base, Session Lifecycle & Connection Handling.<br/>
> Synchronous SQLAlchemy 2.x engine construction, declarative base, session lifecycle dependency injection, and connection verification are established with Psycopg 3. Full specifications: [`docs/architecture/CONFIGURATION.md`](../docs/architecture/CONFIGURATION.md) and [`docs/architecture/API_CONVENTIONS.md`](../docs/architecture/API_CONVENTIONS.md).

---

## 1. Selected Python Environment & Dependencies

* **Interpreter Version:** Python 3.14.6 (64-bit on Windows).
* **Virtual Environment Path:** `.venv/` (located at repository root, excluded from Git).
* **Core & Testing Dependencies (`backend/requirements.txt`):**
  * `fastapi>=0.115.0,<1.0.0`
  * `uvicorn[standard]>=0.32.0,<1.0.0`
  * `pydantic-settings>=2.6.0,<3.0.0`
  * `pytest>=8.0.0,<10.0.0`
  * `httpx>=0.27.0,<1.0.0`
  * `sqlalchemy>=2.0.0,<3.0.0`
  * `psycopg[binary]>=3.2.0,<4.0.0`

### Installing Dependencies into `.venv`
```powershell
.\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
```

---

## 2. Local Execution & Automation Scripts

A dedicated PowerShell runner ([`scripts/run_backend.ps1`](../scripts/run_backend.ps1)) automates local development server startup and test execution using the isolated `.venv` interpreter:

### Starting the Local Development Server
From the repository root (`C:\_code\Projects\Arogya-AI`):

```powershell
.\scripts\run_backend.ps1
```

By default, the server binds to localhost loopback (`127.0.0.1:8000`) with auto-reload enabled.

#### Optional CLI Flags:
* **Custom Port:** `.\scripts\run_backend.ps1 -Port 8080`
* **Disable Reload:** `.\scripts\run_backend.ps1 -NoReload`
* **Run Tests:** `.\scripts\run_backend.ps1 -Test`

### Interactive API Documentation & OpenAPI Schema
Once running, OpenAPI documentation is available at:
* OpenAPI 3.1 JSON Schema: `http://127.0.0.1:8000/openapi.json`
* Swagger UI (Interactive Explorer): `http://127.0.0.1:8000/docs`
* ReDoc (API Reference): `http://127.0.0.1:8000/redoc`

#### Inspecting OpenAPI Schema via Command Line
To inspect the generated OpenAPI JSON schema without starting the HTTP server:
```powershell
.\.venv\Scripts\python.exe -c "import json; from backend.app.main import create_app; print(json.dumps(create_app().openapi(), indent=2))"
```

#### Disabling Documentation Routes in Staging or Production
In production, interactive documentation can be disabled via environment variables:
* Set `OPENAPI_URL=none`, `DOCS_URL=none`, or `REDOC_URL=none` (or empty strings in `.env`).
* Disabling `OPENAPI_URL` automatically cascades to suppress both Swagger UI and ReDoc.
* *Security Notice:* Disabling documentation is an operational hygiene control; it does **not** replace authentication, network authorization, or access control. Reference: [`docs/architecture/CONFIGURATION.md`](../docs/architecture/CONFIGURATION.md).

### Manual Shell Activation (Optional)
```powershell
.\.venv\Scripts\Activate.ps1
```

---

## 3. Standard Error Envelopes

All HTTP errors, schema validation failures, and unhandled exceptions are caught and formatted into a consistent, safe JSON envelope:

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Not Found",
    "request_id": "4b68e9e1-6789-4a43-bc8e-28954d72851d"
  }
}
```

### Sanitized Validation Failures (HTTP 422)
When request payload validation fails, field locations and rule violations are returned, but **raw user input is strictly dropped** to prevent leaking sensitive medical values, passwords, or PHI:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The submitted request payload failed schema validation.",
    "request_id": "4b68e9e1-6789-4a43-bc8e-28954d72851d",
    "details": [
      {
        "loc": ["body", "patient_age"],
        "msg": "Input should be a valid integer",
        "type": "int_parsing"
      }
    ]
  }
}
```

### Unhandled Server Exceptions (HTTP 500)
Internal exceptions return a generic message (`"An unexpected internal server error occurred."`) without leaking stack traces, database credentials, or file paths. The full exception trace is recorded internally in server logs correlated with the `request_id`.

---

## 4. Request IDs & Correlation Tracing

* **Generation:** Every incoming request is assigned a unique UUID4 by `RequestContextMiddleware`.
* **Client Preservation Policy:** If an incoming `X-Request-ID` header matches a safe alphanumeric pattern (`^[a-zA-Z0-9_\-]{8,64}$`), it is preserved for distributed tracing. Malformed or unsafe headers are rejected and replaced with a fresh UUID.
* **Propagation:** The correlation ID is attached to:
  * Outgoing `X-Request-ID` HTTP response headers.
  * The `error.request_id` field in all error envelopes.
  * Asynchronous `contextvars` for automatic injection into log records.

---

## 5. Structured Logging & Operational Privacy

Application logging is configured via standard Python `logging` (`backend/app/logging.py`) without third-party frameworks:
* **Format:** Single-line structured JSON records containing UTC ISO 8601 timestamps, severity level, logger name, message, and correlation `request_id`.
* **Privacy Guardrails:** Loggers record HTTP method, path, status, and duration, but **never** record request bodies, query values, authorization headers, cookies, or patient-identifiable data.
* **Scope Notice:** Logs and request correlation IDs are operational debugging metadata; they do not imply HIPAA/GDPR clinical compliance or security certification.

---

---

## 6. Database Persistence, Engine Lifecycle & Session Management

As of Module 3, Phase 3.2, database persistence infrastructure is established under `backend/app/db/`:

### Architecture & Components
* **Declarative Base (`backend/app/db/base.py`):**
  * Defines SQLAlchemy 2.x `Base` (`DeclarativeBase`) and exposes `metadata`.
  * In strict compliance with roadmap sequencing, **no entity models exist in Phase 3.2**; clinical domain entities are reserved for Phase 3.3.
* **Synchronous Engine (`create_db_engine`):**
  * Configures connection pooling defaults: `pool_pre_ping=True`, `pool_size=5`, `max_overflow=10`, `pool_timeout=30.0`, `pool_recycle=1800`, and a bounded driver connection timeout (`connect_timeout=10`).
  * Lazily initializes connections; engine construction or application factory startup **never initiates an immediate network connection**.
  * Caches a process-level engine singleton (`get_engine`) and supports clean teardown (`dispose_engine`).
* **Session Lifecycle (`get_db_session`):**
  * Provides a FastAPI dependency yielding an isolated `Session` per HTTP request.
  * Ensures deterministic cleanup via `try...finally`: commits are handled explicitly by business handlers, unhandled exceptions trigger `session.rollback()`, and `session.close()` is guaranteed upon request exit.
  * Sessions are strictly request-scoped and never shared across concurrent requests.
* **Connection Verification (`check_database_connection`):**
  * Performs a lightweight probe query (`SELECT 1`) to test live connectivity.
  * Releases acquired connections back to the pool immediately.
  * Catches driver failures and raises `DatabaseConnectionError` while preserving the underlying cause for debugging; **connection credentials and passwords are never exposed in error text or logs**.

### Safe Local Development & Startup Rules
* **No Startup Migrations or Table Creation:** Application startup (`create_app()`) strictly **must not** run `Base.metadata.create_all()` or Alembic migrations automatically. Automatic DDL on startup creates operational race conditions in clustered deployments and risks silent schema desynchronization.
* **Schema Evolution:** Managed explicitly via Alembic migrations starting in Phase 3.5.

### Testing Strategy: SQLite In-Memory vs. PostgreSQL
* **Isolated Unit Testing:** Backend unit tests use in-memory SQLite engines (`sqlite:///:memory:`) with `StaticPool` to verify dialect-independent session mechanics, rollback behavior, and FastAPI dependency wiring without external infrastructure.
* **PostgreSQL Incompatibility Notice:** **SQLite test passes do NOT establish PostgreSQL production compatibility.** SQLite lacks PostgreSQL-specific types (`UUID`, `JSONB`, `ARRAY`), specific dialect constraints, transactional DDL semantics, and connection concurrency characteristics.
* **PostgreSQL Integration Testing:** Requires a dedicated PostgreSQL 18 instance with application credentials configured in `.env`. Integration testing against live databases remains decoupled from local unit test runs.

---

## 7. Running Backend Tests

Backend tests are organized with root-level [`pytest.ini`](../pytest.ini) and shared fixtures in [`backend/tests/conftest.py`](tests/conftest.py):

### Executing Tests via Automation Script
```powershell
.\scripts\run_backend.ps1 -Test
```

### Direct Pytest Invocation
```powershell
.\.venv\Scripts\python.exe -m pytest
```

### Running Database Unit Tests Exclusively
```powershell
.\.venv\Scripts\python.exe -m pytest backend/tests/test_database.py -v
```

### Test Scope & Coverage:
* Declarative base export, MetaData collection, and entity isolation.
* Engine construction laziness, driver scheme validation, and URL normalization (`postgresql+psycopg://`).
* Rejection of incompatible asynchronous (`asyncpg`) and legacy (`psycopg2`) drivers.
* Engine singleton caching and deterministic teardown (`dispose_engine`).
* Session query execution on dialect-independent test engines.
* Session dependency lifecycle: deterministic closure, automatic rollback on exception, and FastAPI dependency injection.
* Connection verification probe (`SELECT 1`), failure handling, and credential masking.
* Liveness (`/health`) and readiness (`/ready`) response contracts.
* Error envelope formatting across 404, 422, and 500 status codes.
* Field location extraction without echoing sensitive input values.
* Sanitization of 500 errors to prevent leaking internal exception text.
* Uniqueness, preservation, and replacement of `X-Request-ID` headers.
* Dynamic prefix routing and nonexistent route handling.
* OpenAPI 3.1.0 schema retrieval, route documentation, operation IDs, and tags.
* Component schema registration (`HealthResponse`, `ReadyResponse`, `ErrorResponse`, etc.).
* Runtime response payload alignment against OpenAPI component schemas.
* Custom API prefix adaptation in generated schema and runtime routing.
* Configuration-driven interactive docs enabling and disabling (`/docs`, `/redoc`, `/openapi.json`).
* Settings validation, environment variable parsing, case normalization, and port bounds checking.
* Production debug mode prevention and configuration isolation across application instances.

---

## 8. Operational Readiness vs. Clinical Readiness

> **Important Boundary Notice:**<br/>
> The local development server and automated tests verify **software engineering mechanics only** (HTTP lifecycle, routing, error envelopes, logging, and database session lifecycles). This does **not** constitute clinical validation, medical device certification, or production deployment readiness. External databases (Module 3), multi-agent pipelines (Module 11), and clinical safety controls (Module 13) are introduced in subsequent modules.

---

## 9. Directory Layout

```text
Arogya-AI/
├── pytest.ini           # Root pytest test runner configuration
├── scripts/
│   ├── run_backend.ps1  # Local development server and test automation
│   └── validate_foundation.ps1
└── backend/
    ├── app/
    │   ├── __init__.py  # Package exports (create_app, Settings, Error models)
    │   ├── main.py      # Application factory, middleware, and router registration
    │   ├── settings.py  # Validated Pydantic settings model
    │   ├── errors.py    # Standard error envelope and exception handlers
    │   ├── logging.py   # Structured JSON logging and contextvar tracking
    │   ├── middleware.py# RequestContextMiddleware for X-Request-ID tracing
    │   ├── api/
    │   │   ├── __init__.py
    │   │   └── health.py# /health and /ready probe implementations
    │   └── db/
    │       ├── __init__.py  # Database package exports
    │       ├── base.py      # SQLAlchemy 2.x declarative base and metadata
    │       └── session.py   # Engine, session factory, dependency, and connection check
    ├── tests/
    │   ├── __init__.py  # Backend test package
    │   ├── conftest.py  # Shared pytest fixtures (app, client, test_settings)
    │   ├── test_database.py # Database engine, session lifecycle, and probe tests
    │   ├── test_health.py
    │   ├── test_errors.py
    │   ├── test_openapi.py # OpenAPI schema & contract regression tests
    │   └── test_settings.py# Settings validation & runtime hardening tests
    ├── requirements.txt # Pinned core backend and testing dependencies
    └── README.md        # Backend developer guide and setup notes
```

---

## 10. Roadmap Status & Deferred Features

* **Module 2 (Completed):** Backend platform, application factory, health probes, error envelopes, logging, contract tests, and runtime hardening.
* **Phase 3.1 (Completed):** PostgreSQL connection configuration, URI validation, credential masking, and environment safety controls.
* **Phase 3.2 (Completed):** SQLAlchemy 2.0 declarative base, synchronous engine lifecycle, session dependency injection, and connection verification.
* **Phase 3.3 (Next):** Domain entities and relational data models (User, Patient, Encounter, Observation, UploadedAsset, AnalysisRun, AuditEvent).
* **Phase 3.5 (Future):** Alembic migrations and database schema management.

---

## 11. Development Principles & Guardrails

* **Zero Patient Data Policy:** Real patient health information (PHI) must **never** be placed in this directory or used in test fixtures.
* **Secrets Management:** Credentials, database passwords, and API keys must remain strictly in untracked local `.env` files; never commit secrets to version control.
