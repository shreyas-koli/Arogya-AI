# Arogya AI — Backend Configuration & Environment Validation

> **Status Notice:** Implemented as of Module 2 (Backend Platform), Phase 2.7.<br/>
> This document specifies the validated configuration settings, environment variable bindings, type invariants, and runtime hardening controls for Arogya AI.
>
> **Scope Boundary:**
> * **Active Configuration:** Core application identity, environment profiles, server network parameters, versioned API prefixing, logging severity, and OpenAPI/interactive documentation endpoints.
> * **Placeholders & Deferred Settings:** Database connection strings (Module 3) and cryptographic secrets (Module 7) are validated placeholders that default to `None`. They do not connect to external systems or activate services at this phase.

---

## 1. Configuration Loading Architecture

Configuration in Arogya AI is managed using **`pydantic-settings`** ([`backend/app/settings.py`](../../backend/app/settings.py)).

### Loading & Precedence Rules
1. **Explicit Initialization:** Direct instantiation (e.g., `Settings(app_env="testing")`) takes highest precedence and is used by test fixtures to construct isolated application instances.
2. **System Environment Variables:** System-level environment variables override defaults and `.env` file entries.
3. **Dotenv File (`.env`):** Loaded from the repository root if present (UTF-8 encoded; excluded from version control).
4. **Model Defaults:** Safe fallback values for local development.

### Case-Insensitivity & Name Matching
* Environment variable names are **case-insensitive** (e.g., `APP_ENV`, `app_env`, and `App_Env` all resolve to `app_env`).
* String values for enumerated settings (such as `APP_ENV` and `LOG_LEVEL`) undergo **automatic case normalization** before schema validation.

---

## 2. Configuration Settings Reference

| Setting | Environment Variable | Type / Permitted Values | Default | Required | Description & Validation Invariants |
| :--- | :--- | :--- | :--- | :---: | :--- |
| `app_name` | `APP_NAME` | `str` | `"Arogya AI"` | No | Human-readable application name. Must not be empty or whitespace-only. |
| `app_env` | `APP_ENV` | `'development'`, `'testing'`, `'staging'`, `'production'` | `"development"` | No | Target runtime environment profile. Normalized to lowercase. |
| `debug` | `DEBUG` | `bool` (`true`, `false`, `1`, `0`) | `False` | No | Enables FastAPI debug mode. **Strictly forbidden** when `app_env` is `'production'`. |
| `api_host` | `API_HOST` | `str` (IP or hostname) | `"127.0.0.1"` | No | Server interface binding. Defaults to loopback for secure local development. |
| `api_port` | `API_PORT` | `int` (`1`–`65535`) | `8000` | No | TCP listening port. Values outside 1–65535 raise a validation error. |
| `api_prefix` | `API_PREFIX` | `str` (starts with `'/'`) | `"/api/v1"` | No | Base routing prefix for domain endpoints. Must start with `'/'`. Trailing slashes are stripped. |
| `log_level` | `LOG_LEVEL` | `'DEBUG'`, `'INFO'`, `'WARNING'`, `'ERROR'`, `'CRITICAL'` | `"INFO"` | No | Logging severity threshold. Normalized to uppercase. |
| `openapi_url` | `OPENAPI_URL` | `str | None` | `"/openapi.json"` | No | Route path for OpenAPI 3.1 JSON schema. Set to `none`, `disabled`, or `""` to disable. |
| `docs_url` | `DOCS_URL` | `str | None` | `"/docs"` | No | Route path for Swagger UI. Set to `none`, `disabled`, or `""` to disable. |
| `redoc_url` | `REDOC_URL` | `str | None` | `"/redoc"` | No | Route path for ReDoc documentation. Set to `none`, `disabled`, or `""` to disable. |
| `database_url` | `DATABASE_URL` | `str | None` | `None` | No | PostgreSQL connection URI (e.g. `postgresql+psycopg://USER:PASSWORD@localhost:5432/arogya_ai`). Enforces PostgreSQL schemes (`postgresql`, `postgres`, `postgresql+psycopg`, `postgresql+psycopg2`, `postgresql+asyncpg`). Rejects non-PostgreSQL schemes. Empty strings and disabling tokens (`'none'`, `'null'`, `'disabled'`) normalize to `None`. Credentials masked via `masked_database_url`. |
| `secret_key` | `SECRET_KEY` | `SecretStr | None` | `None` | No | Cryptographic secret for session signing. Deferred to Module 7; empty strings normalize to `None`. |

---

## 3. Detailed Validation Invariants & Hardening Controls

### Production Debug Protection
To prevent accidental exposure of interactive debug traces or internal frames in deployed environments:
```python
@field_validator("debug")
@classmethod
def enforce_production_debug_safety(cls, debug: bool, info) -> bool:
    env = info.data.get("app_env")
    if env == "production" and debug:
        raise ValueError("debug mode cannot be enabled when app_env is 'production'")
    return debug
```
If an operator configures `APP_ENV=production` and `DEBUG=true`, the application crashes immediately during startup validation rather than running in an unsafe state.

### Interactive Documentation & Schema Endpoint Controls
In Phase 2.6, documentation endpoints (`/openapi.json`, `/docs`, `/redoc`) were added with default access. Phase 2.7 hardens the mechanism for disabling them:

1. **Environment Value Normalization:**
   * Setting `DOCS_URL=none`, `DOCS_URL=None`, `DOCS_URL=disabled`, `DOCS_URL=false`, or `DOCS_URL=""` (empty) reliably parses to Python `None`.
   * This eliminates the risk of literal strings (e.g., `"None"`) mounting Swagger UI at unexpected paths like `/None`.
2. **Valid Custom Paths:**
   * Custom paths must start with `/` (e.g., `DOCS_URL=/api-docs`). Invalid paths without leading slashes (e.g. `DOCS_URL=docs`) fail fast with a clear validation error.
3. **Cascading Schema Suppression:**
   * If `OPENAPI_URL` is disabled (`None`), [`backend/app/main.py`](../../backend/app/main.py) automatically suppresses both `docs_url` and `redoc_url` to avoid mounting broken UI shells.
4. **Security Notice:**
   * Disabling interactive documentation limits public discovery of API paths; **it is not a replacement for authentication, network authorization, or firewall restrictions**.

### Routing Prefix Sanitization
* `api_prefix` must start with a forward slash (`/`).
* Trailing slashes are stripped during settings validation (`"/api/v1/"` $\rightarrow$ `"/api/v1"`), ensuring clean, predictable path concatenation across all routers.
* Root mounting (`api_prefix="/"`) is supported for standalone single-purpose instances.

### Safe Empty Placeholders for Secrets & Database
In development templates (`.env.example`), variables such as `DATABASE_URL=` and `SECRET_KEY=` are left unpopulated:
* Empty or whitespace-only values are automatically normalized to `None` rather than empty strings or empty `SecretStr("")`.
* No placeholder credentials, default passwords, or fake API keys exist in the repository.

### PostgreSQL Connection Configuration & Local Environment Safety (Module 3)
* **Purpose of `DATABASE_URL`:** Configures the primary relational database connection for clinical entity persistence, audit logs, and metadata storage (Module 3).
* **Driver Strategy & Format:**
  * Selected modern driver strategy: **Psycopg 3** with SQLAlchemy 2.0.
  * Standard connection URI: `postgresql+psycopg://USER:PASSWORD@HOST:PORT/DBNAME`
  * Also compatible with: `postgresql://`, `postgres://`, `postgresql+psycopg2://`, and `postgresql+asyncpg://`.
* **Validation & Credential Masking:**
  * Non-PostgreSQL schemes (such as `mysql://` or `sqlite://`) are rejected at startup with a clear validation error.
  * Validation error messages strictly avoid echoing submitted usernames, passwords, or hosts.
  * The `Settings.masked_database_url` property provides a sanitized representation (`postgresql+psycopg://user:***@host:port/dbname`) suitable for observability and diagnostics without exposing credentials.
* **Valid Configuration vs. Live Database Connectivity:**
  * **Valid Configuration:** Establishes that the URI format is syntactically sound, targets a supported PostgreSQL scheme, and provides required components. Phase 3.1 validates this configuration offline without requiring a live PostgreSQL instance.
  * **Live Database Connectivity:** Requires an active PostgreSQL service, valid authentication credentials, network reachability, and an existing target database. Engine/session management and live connection testing are introduced in Phase 3.2.
* **Local Connectivity Verification:**
  * When a local PostgreSQL instance is installed, reachability can be checked without modifying data:
    ```powershell
    # Check PostgreSQL daemon readiness on port 5432
    pg_isready -h localhost -p 5432
    ```
* **Import & Factory Safety:**
  * Importing [`backend/app/main.py`](../../backend/app/main.py) or calling `create_app()` **does not initiate database connections**. Application startup remains deterministic and decoupled from database uptime during unit testing.

---

## 4. Test Isolation & Settings Overriding

To ensure tests remain isolated and deterministic without leaking state:

1. **Singleton Caching:** `get_settings()` uses `@lru_cache(maxsize=1)`.
2. **Test Fixtures:** Automated tests inject an explicit `Settings(...)` instance via the `create_app(settings)` factory, bypassing the singleton cache.
3. **Environment Isolation:** Tests that manipulate `os.environ` must clear the cache (`get_settings.cache_clear()`) or restore original environment variables in fixture teardown.

---

## 5. Deployment Preflight Checklist

Before promoting any Arogya AI backend instance to staging or production:

- [ ] **`APP_ENV`:** Set explicitly to `staging` or `production`.
- [ ] **`DEBUG`:** Set to `false` (enforced by schema validator in production).
- [ ] **`API_HOST`:** Ensure network interface bindings match orchestrator requirements (e.g., `0.0.0.0` inside container, loopback for local dev).
- [ ] **`DOCS_URL` & `REDOC_URL`:** Evaluate whether external API documentation should be disabled (`none` or left empty).
- [ ] **Secrets:** Ensure `.env` is uncommitted and protected with strict filesystem permissions.
- [ ] **Clinical Boundary Notice:** Confirm that operational test completion is not conflated with clinical decision-support certification.
