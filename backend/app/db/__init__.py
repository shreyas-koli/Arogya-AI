"""Arogya AI - Database Package.

Module 3: Database Persistence & Session Lifecycle.
Provides the SQLAlchemy declarative base, session factory, FastAPI dependency,
and connection verification.
"""

from backend.app.db.base import Base, metadata
from backend.app.db.session import (
    DatabaseConfigurationError,
    DatabaseConnectionError,
    DatabaseError,
    check_database_connection,
    create_db_engine,
    dispose_engine,
    get_db_session,
    get_engine,
    get_session_factory,
    normalize_engine_url,
)

__all__ = [
    "Base",
    "DatabaseConfigurationError",
    "DatabaseConnectionError",
    "DatabaseError",
    "check_database_connection",
    "create_db_engine",
    "dispose_engine",
    "get_db_session",
    "get_engine",
    "get_session_factory",
    "metadata",
    "normalize_engine_url",
]
