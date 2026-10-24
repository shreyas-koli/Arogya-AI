# Arogya AI — Backend Platform

This directory contains the Python backend service, REST API routers, domain logic, and backend test suites for Arogya AI.

> **Status:** Module 2 (Backend Platform) — Phase 2.4: Error Handling, Request Validation, Structured Logging & Request IDs.<br/>
> Implemented application-wide error envelopes, input validation error sanitization, standard Python structured logging, and request correlation IDs (`X-Request-ID`).

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

## 6. Running Backend Tests

Backend tests are located in `backend/tests/` and use pytest with FastAPI's `TestClient`:

```powershell
.\.venv\Scripts\python.exe -m pytest backend/tests -v
```

The test suite validates:
* Liveness and readiness endpoints (`200 OK`).
* Consistent error envelopes across 404, 422, and 500 status codes.
* Field location extraction without echoing sensitive input values.
* Sanitization of 500 errors to prevent leaking internal exception text.
* Uniqueness, preservation, and replacement of `X-Request-ID` headers.
* Dynamic prefix routing and nonexistent route handling.

---

## 7. Directory Layout

```text
backend/
├── app/
│   ├── __init__.py      # Package exports (create_app, Settings, Error models)
│   ├── main.py          # Application factory, middleware, and router registration
│   ├── settings.py      # Validated Pydantic settings model
│   ├── errors.py        # Standard error envelope and exception handlers
│   ├── logging.py       # Structured JSON logging and contextvar tracking
│   ├── middleware.py    # RequestContextMiddleware for X-Request-ID tracing
│   └── api/
│       ├── __init__.py  # API package exports (health_router)
│       └── health.py    # /health and /ready probe implementations
├── tests/
│   ├── __init__.py      # Backend test package
│   ├── test_health.py   # Health, readiness, and prefix routing tests
│   └── test_errors.py   # Error handling, validation, and request-ID tests
├── requirements.txt     # Pinned core backend and testing dependencies
└── README.md            # Backend developer guide and setup notes
```

---

## 8. Roadmap Status & Deferred Features

* **Phase 2.5 (Next):** Pytest configuration hardening, endpoint tests, and local run automation.
* **Phase 2.6:** Document API conventions and inspect generated OpenAPI documentation.
* **Module 3:** Database persistence, PostgreSQL schemas, and Alembic migrations.

---

## 9. Development Principles & Guardrails

* **Zero Patient Data Policy:** Real patient health information (PHI) must **never** be placed in this directory or used in test fixtures.
* **Secrets Management:** Credentials, database passwords, and API keys must remain strictly in untracked local `.env` files; never commit secrets to version control.
