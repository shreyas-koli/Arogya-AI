# Arogya AI — Backend Platform

This directory contains the Python backend service, REST API routers, domain logic, and backend test suites for Arogya AI.

> **Status:** Module 2 (Backend Platform) — Phase 2.2: FastAPI Application Factory & Settings Management.<br/>
> The application factory (`create_app()`) and typed settings model (`Settings`) are implemented. **API endpoints and routes are intentionally deferred to Phase 2.3.**

---

## 1. Selected Python Environment & Dependencies

* **Interpreter Version:** Python 3.14.6 (64-bit on Windows).
* **Virtual Environment Path:** `.venv/` (located at repository root, excluded from Git).
* **Core Dependencies (`backend/requirements.txt`):**
  * `fastapi>=0.115.0,<1.0.0`
  * `uvicorn[standard]>=0.32.0,<1.0.0`
  * `pydantic-settings>=2.6.0,<3.0.0`

### Installing Dependencies into `.venv`
```powershell
.\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
```

---

## 2. Environment Activation & Verification

### Activating the Virtual Environment in PowerShell
From the repository root (`C:\_code\Projects\Arogya-AI`):

```powershell
.\.venv\Scripts\Activate.ps1
```

*(If PowerShell script execution is restricted, run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` first).*

### Direct Invocation (Without Shell Activation)
```powershell
.\.venv\Scripts\python.exe --version
```

---

## 3. Application Factory & Settings Management

### Application Factory (`backend/app/main.py`)
FastAPI application instances are constructed dynamically through `create_app()`:

```python
from backend.app import create_app, get_settings

# Instantiate with default cached settings
app = create_app()

# Or instantiate with custom settings (e.g. for testing)
from backend.app.settings import Settings
custom_app = create_app(Settings(api_port=8080))
```

*Note: Importing `main.py` or `create_app` does not start an HTTP listener or connect to external databases.*

### Settings Configuration (`backend/app/settings.py`)
Settings are managed through `pydantic-settings`:
* Automatic environment variable override (e.g., `APP_ENV`, `API_PORT`, `DEBUG`).
* Loads local `.env` if present; gracefully falls back to safe development defaults if missing.
* Port bounds validation (`1` to `65535`).
* Production safety guards (disallowing `debug=True` when `app_env="production"`).
* Masked secrets (`SecretStr`) to prevent exposure in logs or exceptions.

---

## 4. Directory Layout

```text
backend/
├── app/
│   ├── __init__.py      # Exports create_app, Settings, get_settings
│   ├── main.py          # Application factory definition
│   ├── settings.py      # Pydantic-settings model and validator
│   └── api/
│       └── __init__.py  # API routing and endpoint package (Phase 2.3+)
├── tests/
│   └── __init__.py      # Backend unit and integration test suite (Phase 2.5)
├── requirements.txt     # Pinned core backend dependencies
└── README.md            # Backend developer guide and setup notes
```

---

## 5. Roadmap Status & Deferred Features

* **Phase 2.3 (Next):** Health and readiness endpoints (`/health`, `/ready`), versioned API prefix routing (`/api/v1`).
* **Phase 2.4:** Structured error responses, request validation handlers, structured logging, and request IDs.
* **Phase 2.5:** Pytest configuration, endpoint tests, and local run automation.
* **Module 3:** Database persistence, SQLAlchemy 2.0 declarative base, and Alembic migrations.

---

## 6. Development Principles & Guardrails

* **Zero Patient Data Policy:** Real patient health information (PHI) must **never** be placed in this directory or used in test fixtures.
* **Secrets Management:** Credentials, database passwords, and API keys must remain strictly in untracked local `.env` files; never commit secrets to version control.
