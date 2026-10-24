"""Arogya AI - Application Settings & Configuration Management.

Provides type-safe, validated environment settings using pydantic-settings.
"""

from functools import lru_cache
from typing import Literal
from pydantic import Field, SecretStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

AppEnv = Literal["development", "testing", "staging", "production"]
LogLevel = Literal["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]


class Settings(BaseSettings):
    """Core application settings with environment variable overrides."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    # Core Application
    app_name: str = Field(
        default="Arogya AI",
        description="Name of the application",
    )
    app_env: AppEnv = Field(
        default="development",
        description="Deployment environment (development, testing, staging, production)",
    )
    debug: bool = Field(
        default=False,
        description="Enable debug mode (automatically disabled in production)",
    )

    # Server Configuration
    api_host: str = Field(
        default="127.0.0.1",
        description="Host interface for the API server",
    )
    api_port: int = Field(
        default=8000,
        description="TCP port for the API server",
    )
    api_prefix: str = Field(
        default="/api/v1",
        description="Base routing prefix for versioned API endpoints",
    )
    log_level: LogLevel = Field(
        default="INFO",
        description="Logging level",
    )

    # API Documentation Configuration
    openapi_url: str | None = Field(
        default="/openapi.json",
        description="Path to OpenAPI JSON schema route, or None to disable",
    )
    docs_url: str | None = Field(
        default="/docs",
        description="Path to Swagger UI documentation route, or None to disable",
    )
    redoc_url: str | None = Field(
        default="/redoc",
        description="Path to ReDoc documentation route, or None to disable",
    )

    # Persistence & Security Placeholders (Deferred to Modules 3 & 7)
    database_url: str | None = Field(
        default=None,
        description="PostgreSQL connection string (planned in Module 3)",
    )
    secret_key: SecretStr | None = Field(
        default=None,
        description="Cryptographic secret key for session/token verification (Module 7)",
    )

    @field_validator("app_name")
    @classmethod
    def validate_app_name(cls, name: str) -> str:
        """Ensure application name is not empty or whitespace-only."""
        cleaned = name.strip()
        if not cleaned:
            raise ValueError("app_name cannot be empty or whitespace-only")
        return cleaned

    @field_validator("app_env", mode="before")
    @classmethod
    def normalize_app_env(cls, env: object) -> object:
        """Allow case-insensitive environment declarations (e.g. 'PRODUCTION' -> 'production')."""
        if isinstance(env, str):
            return env.strip().lower()
        return env

    @field_validator("log_level", mode="before")
    @classmethod
    def normalize_log_level(cls, level: object) -> object:
        """Allow case-insensitive logging level declarations (e.g. 'info' -> 'INFO')."""
        if isinstance(level, str):
            return level.strip().upper()
        return level

    @field_validator("api_host")
    @classmethod
    def validate_api_host(cls, host: str) -> str:
        """Ensure API server host interface is not empty or whitespace-only."""
        cleaned = host.strip()
        if not cleaned:
            raise ValueError("api_host cannot be empty or whitespace-only")
        return cleaned

    @field_validator("api_port")
    @classmethod
    def validate_port_range(cls, port: int) -> int:
        """Ensure port is within valid TCP user port bounds."""
        if not (1 <= port <= 65535):
            raise ValueError(f"api_port must be between 1 and 65535, got {port}")
        return port

    @field_validator("api_prefix")
    @classmethod
    def validate_api_prefix(cls, prefix: str) -> str:
        """Ensure routing prefix starts with '/' and is cleanly formatted."""
        cleaned = prefix.strip()
        if not cleaned:
            raise ValueError("api_prefix cannot be empty; specify a valid root path like '/' or '/api/v1'")
        if not cleaned.startswith("/"):
            raise ValueError(f"api_prefix must start with '/', got {prefix!r}")
        return cleaned.rstrip("/") if cleaned != "/" else "/"

    @field_validator("openapi_url", "docs_url", "redoc_url", mode="before")
    @classmethod
    def validate_doc_url(cls, v: object) -> str | None:
        """Normalize and validate documentation route paths.

        Supports explicitly disabling endpoints via '', 'none', 'null', 'false', 'off', or 'disabled'.
        Non-empty route paths must start with a forward slash ('/').
        """
        if v is None:
            return None
        if isinstance(v, str):
            cleaned = v.strip()
            if not cleaned or cleaned.lower() in {"none", "null", "false", "off", "disabled"}:
                return None
            if not cleaned.startswith("/"):
                raise ValueError(f"Documentation route path must start with '/', got {v!r}")
            return cleaned.rstrip("/") if cleaned != "/" else "/"
        return v

    @field_validator("database_url", mode="before")
    @classmethod
    def normalize_database_url(cls, v: object) -> str | None:
        """Convert empty or whitespace-only database connection strings to None."""
        if v is None:
            return None
        if isinstance(v, str):
            cleaned = v.strip()
            return cleaned if cleaned else None
        return v

    @field_validator("secret_key", mode="before")
    @classmethod
    def normalize_secret_key(cls, v: object) -> object:
        """Convert empty or whitespace-only secret keys to None."""
        if v is None:
            return None
        if isinstance(v, str):
            cleaned = v.strip()
            return cleaned if cleaned else None
        return v

    @field_validator("debug")
    @classmethod
    def enforce_production_debug_safety(cls, debug: bool, info) -> bool:
        """Prevent enabling debug mode in production environment."""
        env = info.data.get("app_env")
        if env == "production" and debug:
            raise ValueError("debug mode cannot be enabled when app_env is 'production'")
        return debug


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return cached application settings singleton."""
    return Settings()
