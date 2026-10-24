"""Arogya AI - FastAPI Application Factory.

Constructs and configures the FastAPI application instance using validated settings.
"""

from fastapi import FastAPI
from backend.app.api.health import router as health_router
from backend.app.settings import Settings, get_settings


def create_app(settings: Settings | None = None) -> FastAPI:
    """FastAPI application factory.

    Args:
        settings: Optional Settings instance; uses cached get_settings() if None.

    Returns:
        Configured FastAPI application instance with registered routes.
    """
    app_settings = settings or get_settings()

    app = FastAPI(
        title=app_settings.app_name,
        description=(
            "Arogya AI - Modular, research-oriented healthcare intelligence "
            "and clinical decision-support platform."
        ),
        version="0.1.0",
        debug=app_settings.debug,
    )

    # Store settings in application state for downstream dependency access
    app.state.settings = app_settings

    # Mount versioned API routes under the configured prefix
    prefix = app_settings.api_prefix.rstrip("/")
    app.include_router(health_router, prefix=prefix)

    return app


# Application instance for ASGI server discovery (e.g. uvicorn backend.app.main:app)
app = create_app()
