"""Arogya AI - Backend API Package.

This package houses the versioned API routers, endpoint definitions,
and request/response handlers for Arogya AI.
"""

from backend.app.api.health import router as health_router

__all__ = ["health_router"]
