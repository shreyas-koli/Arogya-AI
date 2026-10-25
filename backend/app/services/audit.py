"""Arogya AI — Audit Domain Service.

Module 3, Phase 3.6: Data Access Repositories & Clinical Domain Service Layer.
Coordinates operational audit recording, sanitizing sensitive metadata and ensuring
traceability without leaking credentials, tokens, or private health details.

GOVERNANCE & IMMUTABILITY LIMITATION NOTICE:
Audit events provide an immutable application-level log of operational mutations.
Immutability is enforced at the application layer by exposing no mutation or deletion
APIs. Database-level append-only table policies, write-once storage mechanisms,
and cryptographic tamper-proofing are deferred to later security modules (Modules 7 & 13).
"""

from typing import Any, Sequence
from uuid import UUID
from sqlalchemy.orm import Session

from backend.app.db.models import AuditEvent
from backend.app.repositories.audit import AuditRepository

# Keys that must NEVER be persisted in audit event metadata
SENSITIVE_METADATA_KEYS = {
    "password",
    "hashed_password",
    "password_hash",
    "secret",
    "secret_key",
    "token",
    "access_token",
    "refresh_token",
    "authorization",
    "api_key",
}


def sanitize_audit_metadata(metadata: dict[str, Any] | None) -> dict[str, Any] | None:
    """Scrub sensitive credential fields and token values from audit metadata dictionaries."""
    if metadata is None:
        return None

    cleaned: dict[str, Any] = {}
    for key, value in metadata.items():
        lower_key = key.strip().lower()
        if any(sensitive in lower_key for sensitive in SENSITIVE_METADATA_KEYS):
            cleaned[key] = "[REDACTED_CREDENTIAL]"
        elif isinstance(value, dict):
            cleaned[key] = sanitize_audit_metadata(value)
        else:
            cleaned[key] = value

    return cleaned


class AuditService:
    """Domain service for recording and retrieving operational audit logs."""

    def __init__(self, session: Session) -> None:
        """Initialize AuditService with an active session."""
        self.session = session
        self.audit_repo = AuditRepository(session)

    def record_event(
        self,
        event_type: str,
        action: str,
        actor_id: UUID | None = None,
        resource_type: str | None = None,
        resource_id: str | None = None,
        description: str | None = None,
        ip_address: str | None = None,
        event_metadata: dict[str, Any] | None = None,
    ) -> AuditEvent:
        """Record an operational audit event with automatic metadata credential sanitization."""
        sanitized_metadata = sanitize_audit_metadata(event_metadata)
        return self.audit_repo.create(
            event_type=event_type,
            action=action,
            actor_id=actor_id,
            resource_type=resource_type,
            resource_id=resource_id,
            description=description,
            ip_address=ip_address,
            event_metadata=sanitized_metadata,
        )

    def get_event(self, event_id: UUID) -> AuditEvent | None:
        """Retrieve an audit event by its unique ID."""
        return self.audit_repo.get_by_id(event_id)

    def list_events(
        self,
        limit: int = 100,
        offset: int = 0,
        actor_id: UUID | None = None,
        resource_type: str | None = None,
        action: str | None = None,
    ) -> Sequence[AuditEvent]:
        """Retrieve bounded chronological audit events matching query filters."""
        return self.audit_repo.list_events(
            limit=limit,
            offset=offset,
            actor_id=actor_id,
            resource_type=resource_type,
            action=action,
        )
