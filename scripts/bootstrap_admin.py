#!/usr/bin/env python3
"""Arogya AI — Initial Administrator Account Bootstrap Script.

Module 7, Phase 7.2: Safe Initial Administrator Setup.
Creates or updates the primary system administrator account using bcrypt-hashed
passwords and links the canonical 'administrator' role.

SAFETY & GOVERNANCE:
- Never hardcodes passwords or commits credentials to Git.
- Accepts credentials securely via environment variables (ADMIN_USERNAME, ADMIN_PASSWORD)
  or CLI arguments (--username, --password).
- In interactive environments without arguments, securely prompts for password via getpass.
- Ensures all three canonical system roles (administrator, doctor_reviewer, researcher)
  are populated in the database.
- Records an immutable audit log event without logging password content.
"""

import argparse
import getpass
import logging
import os
from pathlib import Path
import sys
import uuid

# Ensure repository root is on sys.path
_repo_root = Path(__file__).resolve().parent.parent
if str(_repo_root) not in sys.path:
    sys.path.insert(0, str(_repo_root))

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from backend.app.db.models import AuditEvent, Role, User
from backend.app.db.session import create_db_engine, get_session_factory
from backend.app.security.passwords import hash_password
from backend.app.security.roles import RoleName
from backend.app.services.audit import AuditService
from backend.app.settings import get_settings

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("arogya.bootstrap")

# Canonical roles to ensure exist
CANONICAL_ROLES = [
    (RoleName.ADMINISTRATOR.value, "System administrator with full operational privileges"),
    (RoleName.DOCTOR_REVIEWER.value, "Clinical reviewer with patient CRUD, analysis review, and asset handling permissions"),
    (RoleName.RESEARCHER.value, "Research scientist with read-only cohort evaluation permissions"),
]


def bootstrap_roles(session: Session) -> dict[str, Role]:
    """Ensure canonical system roles are present in database.

    Args:
        session: Active SQLAlchemy session.

    Returns:
        Mapping of role name to Role entity instance.
    """
    role_map: dict[str, Role] = {}
    for name, desc in CANONICAL_ROLES:
        role = session.scalar(select(Role).where(Role.name == name))
        if role is None:
            role = Role(
                id=uuid.uuid4(),
                name=name,
                description=desc,
            )
            session.add(role)
            logger.info("Created canonical role: %s", name)
        role_map[name] = role
    session.flush()
    return role_map


def bootstrap_admin_user(
    session: Session,
    *,
    username: str,
    email: str,
    password: str,
    full_name: str = "System Administrator",
) -> User:
    """Create or update administrator user with bcrypt password hash.

    Args:
        session: Active SQLAlchemy session.
        username: Administrator username.
        email: Administrator email address.
        password: Plaintext password to hash.
        full_name: Display name.

    Returns:
        Configured User instance with administrator role assigned.
    """
    roles = bootstrap_roles(session)
    admin_role = roles[RoleName.ADMINISTRATOR.value]

    hashed = hash_password(password)

    # Check if user exists by username or email
    stmt = (
        select(User)
        .options(selectinload(User.roles))
        .where((User.username == username) | (User.email == email))
    )
    user = session.scalar(stmt)

    if user is None:
        user = User(
            id=uuid.uuid4(),
            username=username,
            email=email,
            full_name=full_name,
            hashed_password=hashed,
            is_active=True,
        )
        user.roles.append(admin_role)
        session.add(user)
        logger.info("Created new administrator user '%s' (%s)", username, email)
    else:
        user.hashed_password = hashed
        user.is_active = True
        user.full_name = full_name
        if admin_role not in user.roles:
            user.roles.append(admin_role)
        logger.info("Updated existing administrator user '%s' (%s)", username, email)

    session.flush()

    # Record audit event
    AuditService(session).record_event(
        event_type="auth.admin_bootstrapped",
        action="update" if user is not None else "create",
        actor_id=user.id,
        resource_type="user",
        resource_id=str(user.id),
        description=f"Administrator account '{username}' bootstrapped successfully",
        metadata={"username": username, "email": email},
    )

    return user


def main() -> None:
    """CLI entrypoint for administrator bootstrap."""
    parser = argparse.ArgumentParser(
        description="Bootstrap or update Arogya AI initial administrator account."
    )
    parser.add_argument(
        "--username",
        default=os.getenv("ADMIN_USERNAME", "admin"),
        help="Administrator login username (default: 'admin' or $ADMIN_USERNAME)",
    )
    parser.add_argument(
        "--email",
        default=os.getenv("ADMIN_EMAIL", "admin@arogya.local"),
        help="Administrator email (default: 'admin@arogya.local' or $ADMIN_EMAIL)",
    )
    parser.add_argument(
        "--password",
        default=os.getenv("ADMIN_PASSWORD"),
        help="Administrator password (or set $ADMIN_PASSWORD; prompts if omitted)",
    )
    parser.add_argument(
        "--full-name",
        default=os.getenv("ADMIN_FULL_NAME", "System Administrator"),
        help="Administrator display name",
    )

    args = parser.parse_args()

    password = args.password
    if not password:
        if sys.stdin.isatty():
            password = getpass.getpass("Enter administrator password: ")
            confirm = getpass.getpass("Confirm administrator password: ")
            if password != confirm:
                print("Error: Passwords do not match", file=sys.stderr)
                sys.exit(1)
        else:
            print(
                "Error: Password must be provided via --password argument or ADMIN_PASSWORD env var in non-interactive mode.",
                file=sys.stderr,
            )
            sys.exit(1)

    if len(password.strip()) < 8:
        print("Error: Administrator password must be at least 8 characters long.", file=sys.stderr)
        sys.exit(1)

    settings = get_settings()
    if not settings.database_url:
        print(
            "Error: DATABASE_URL is unconfigured. Set DATABASE_URL in .env before bootstrapping admin.",
            file=sys.stderr,
        )
        sys.exit(1)

    engine = create_db_engine(settings.database_url)
    session_factory = get_session_factory(engine)

    with session_factory() as session:
        try:
            user = bootstrap_admin_user(
                session,
                username=args.username.strip(),
                email=args.email.strip(),
                password=password.strip(),
                full_name=args.full_name.strip(),
            )
            session.commit()
            print(
                f"[SUCCESS] Administrator user '{user.username}' successfully configured with 'administrator' role."
            )
        except Exception as exc:
            session.rollback()
            print(f"[ERROR] Bootstrap failed: {exc}", file=sys.stderr)
            sys.exit(1)


if __name__ == "__main__":
    main()
