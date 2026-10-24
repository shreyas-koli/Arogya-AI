"""Arogya AI - Settings & Runtime Configuration Hardening Tests.

Verifies type safety, default configurations, environment variable parsing,
normalization, validation failures, production debug restrictions,
documentation disabling mechanisms, and isolated application instances.
"""

import pytest
from fastapi.testclient import TestClient
from pydantic_core import ValidationError
from backend.app.main import create_app
from backend.app.settings import Settings


def test_default_settings() -> None:
    """Verify default settings provide safe local development values."""
    settings = Settings()
    assert settings.app_name == "Arogya AI"
    assert settings.app_env == "development"
    assert settings.debug is False
    assert settings.api_host == "127.0.0.1"
    assert settings.api_port == 8000
    assert settings.api_prefix == "/api/v1"
    assert settings.log_level == "INFO"
    assert settings.openapi_url == "/openapi.json"
    assert settings.docs_url == "/docs"
    assert settings.redoc_url == "/redoc"
    assert settings.database_url is None
    assert settings.secret_key is None


def test_env_variable_parsing_and_normalization(monkeypatch: pytest.MonkeyPatch) -> None:
    """Environment variables are correctly parsed with case normalization."""
    monkeypatch.setenv("APP_NAME", "Arogya Cluster Node")
    monkeypatch.setenv("APP_ENV", "STAGING")
    monkeypatch.setenv("LOG_LEVEL", "debug")
    monkeypatch.setenv("API_PORT", "9000")
    monkeypatch.setenv("API_PREFIX", "/api/v2/")

    settings = Settings()
    assert settings.app_name == "Arogya Cluster Node"
    assert settings.app_env == "staging"  # Normalized to lowercase
    assert settings.log_level == "DEBUG"  # Normalized to uppercase
    assert settings.api_port == 9000
    assert settings.api_prefix == "/api/v2"  # Trailing slash stripped


def test_disabling_documentation_via_environment_values(monkeypatch: pytest.MonkeyPatch) -> None:
    """Documentation paths set to 'none', 'disabled', or empty parse to None."""
    monkeypatch.setenv("DOCS_URL", "None")
    monkeypatch.setenv("REDOC_URL", "disabled")
    monkeypatch.setenv("OPENAPI_URL", "")
    monkeypatch.setenv("DATABASE_URL", "   ")
    monkeypatch.setenv("SECRET_KEY", "")

    settings = Settings()
    assert settings.docs_url is None
    assert settings.redoc_url is None
    assert settings.openapi_url is None
    assert settings.database_url is None
    assert settings.secret_key is None


@pytest.mark.parametrize(
    ("field", "invalid_value"),
    [
        ("app_name", ""),
        ("app_name", "   "),
        ("app_env", "sandbox"),
        ("api_host", ""),
        ("api_host", "   "),
        ("api_port", 0),
        ("api_port", 65536),
        ("api_prefix", "api/v1"),  # Missing leading slash
        ("api_prefix", ""),
        ("log_level", "VERBOSE"),
        ("docs_url", "docs"),  # Missing leading slash
        ("redoc_url", "redoc"),  # Missing leading slash
        ("openapi_url", "openapi.json"),  # Missing leading slash
    ],
)
def test_invalid_settings_raise_validation_error(field: str, invalid_value: object) -> None:
    """Invalid configuration values fail fast with a Pydantic ValidationError."""
    with pytest.raises(ValidationError):
        Settings(**{field: invalid_value})


def test_production_debug_forbidden() -> None:
    """Enabling debug mode in production environment is strictly prevented."""
    # Direct lowercase production
    with pytest.raises(ValidationError, match="debug mode cannot be enabled"):
        Settings(app_env="production", debug=True)

    # Uppercase production normalization
    with pytest.raises(ValidationError, match="debug mode cannot be enabled"):
        Settings(app_env="PRODUCTION", debug=True)

    # Production with debug=False must succeed
    prod_settings = Settings(app_env="production", debug=False)
    assert prod_settings.app_env == "production"
    assert prod_settings.debug is False


def test_openapi_disabled_cascades_to_docs_and_redoc() -> None:
    """Disabling openapi_url automatically suppresses Swagger UI and ReDoc in the app factory."""
    settings = Settings(openapi_url=None, docs_url="/docs", redoc_url="/redoc")
    app = create_app(settings)

    assert app.openapi_url is None
    assert app.docs_url is None
    assert app.redoc_url is None

    client = TestClient(app)
    assert client.get("/openapi.json").status_code == 404
    assert client.get("/docs").status_code == 404
    assert client.get("/redoc").status_code == 404


def test_settings_overrides_create_isolated_applications() -> None:
    """Independent Settings objects produce isolated applications without cross-contamination."""
    app_a = create_app(Settings(app_name="Node Alpha", api_prefix="/api/alpha"))
    app_b = create_app(Settings(app_name="Node Beta", api_prefix="/api/beta"))

    client_a = TestClient(app_a)
    client_b = TestClient(app_b)

    # Verify App A routing and service identity
    resp_a = client_a.get("/api/alpha/health")
    assert resp_a.status_code == 200
    assert resp_a.json()["service"] == "Node Alpha"
    assert client_a.get("/api/beta/health").status_code == 404

    # Verify App B routing and service identity
    resp_b = client_b.get("/api/beta/health")
    assert resp_b.status_code == 200
    assert resp_b.json()["service"] == "Node Beta"
    assert client_b.get("/api/alpha/health").status_code == 404


def test_root_api_prefix_mounting() -> None:
    """Configuring api_prefix='/' mounts endpoints directly at the root."""
    settings = Settings(api_prefix="/")
    app = create_app(settings)
    client = TestClient(app)

    health_resp = client.get("/health")
    assert health_resp.status_code == 200
    assert health_resp.json()["status"] == "ok"

    ready_resp = client.get("/ready")
    assert ready_resp.status_code == 200
    assert ready_resp.json()["status"] == "ready"
