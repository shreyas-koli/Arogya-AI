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

    # Persistence & Security Placeholders (Deferred to Modules 3 & 7)
    database_url: str | None = Field(
        default=None,
        description="PostgreSQL connection string (planned in Module 3)",
    )
    secret_key: SecretStr | None = Field(
        default=None,
        description="Cryptographic secret key for session/token verification (Module 7)",
    )

    @field_validator("api_port")
    @classmethod
    def validate_port_range(cls, port: int) -> int:
        """Ensure port is within valid TCP user port bounds."""
        if not (1 <= port <= 65535):
            raise ValueError(f"api_port must be between 1 and 65535, got {port}")
        return port

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
