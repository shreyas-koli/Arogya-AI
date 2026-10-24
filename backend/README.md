# Arogya AI — Backend Platform

This directory contains the Python backend service, REST API routers, domain logic, and backend test suites for Arogya AI.

> **Status:** Module 2 (Backend Platform) — Phase 2.3: Health/Readiness Endpoints & Versioned API Prefix.<br/>
> The application factory, settings management, and health/readiness endpoints under `/api/v1` are implemented and tested.

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

### Installing Dependencies into `.venv`
```powershell
.\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
```

---

## 2. Environment Activation & Local Execution

### Activating the Virtual Environment in PowerShell
From the repository root (`C:\_code\Projects\Arogya-AI`):

```powershell
.\.venv\Scripts\Activate.ps1
```

*(If PowerShell script execution is restricted, run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` first).*

### Starting the Local Development Server
To launch the FastAPI ASGI server with auto-reload:

```powershell
.\.venv\Scripts\uvicorn.exe backend.app.main:app --reload --host 127.0.0.1 --port 8000
```

Once running, interactive OpenAPI documentation is available at:
* Swagger UI: `http://127.0.0.1:8000/docs`
* ReDoc: `http://127.0.0.1:8000/redoc`

---

## 3. Health & Readiness Probes

All health probes are mounted under the configured versioned API prefix (default: `/api/v1`):

### 1. Liveness Probe (`GET /api/v1/health`)
* **Purpose:** Lightweight process liveness indicator for container orchestrators and monitoring agents.
* **Response (HTTP 200):**
  ```json
  {
    "status": "ok",
    "service": "Arogya AI"
  }
  ```

### 2. Readiness Probe (`GET /api/v1/ready`)
* **Purpose:** Evaluates whether initialized subsystems are ready to accept traffic.
* **Response (HTTP 200):**
  ```json
  {
    "status": "ready",
    "service": "Arogya AI",
    "environment": "development",
    "checks": {
      "core_api": {
        "status": "ready",
        "detail": "FastAPI application factory and settings initialized"
      },
      "database": {
        "status": "unconfigured",
        "detail": "PostgreSQL connection unconfigured (planned in Module 3)"
      },
      "ml_inference": {
        "status": "unconfigured",
        "detail": "Machine learning pipelines unconfigured (planned in Modules 9-10)"
      }
    }
  }
  ```

> **Readiness Scope Limitation:**<br/>
> At Phase 2.3, readiness confirms only that the FastAPI application factory, routing prefix, and settings have successfully loaded in memory. External databases (Module 3) and ML inference pipelines (Modules 9–10) are intentionally marked `unconfigured`. This probe does not imply clinical readiness or production validation.

---

## 4. Running Backend Tests

Backend tests are located in `backend/tests/` and use pytest with FastAPI's `TestClient`:

```powershell
.\.venv\Scripts\python.exe -m pytest backend/tests -v
```

The test suite validates:
* Liveness response structure and status code (`200 OK`).
* Readiness component checks and unconfigured state transparency.
* Dynamic prefix routing (verifying that modifying `api_prefix` cleanly relocates routes without duplication).
* 404 handling on nonexistent routes.

---

## 5. Directory Layout

```text
backend/
├── app/
│   ├── __init__.py      # Exports create_app, Settings, get_settings
│   ├── main.py          # Application factory and router registration
│   ├── settings.py      # Validated Pydantic settings model
│   └── api/
│       ├── __init__.py  # API package exports (health_router)
│       └── health.py    # /health and /ready probe implementations
├── tests/
│   ├── __init__.py      # Backend test package
│   └── test_health.py   # Health, readiness, and prefix routing tests
├── requirements.txt     # Pinned core backend and testing dependencies
└── README.md            # Backend developer guide and setup notes
```

---

## 6. Roadmap Status & Deferred Features

* **Phase 2.4 (Next):** Consistent error responses, request validation handlers, structured logging, and request IDs.
* **Phase 2.5:** Pytest configuration hardening and local test run automation.
* **Module 3:** Database persistence, PostgreSQL schemas, and Alembic migrations.

---

## 7. Development Principles & Guardrails

* **Zero Patient Data Policy:** Real patient health information (PHI) must **never** be placed in this directory or used in test fixtures.
* **Secrets Management:** Credentials, database passwords, and API keys must remain strictly in untracked local `.env` files; never commit secrets to version control.
