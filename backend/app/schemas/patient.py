"""Arogya AI - Patient API Schemas.

Module 3, Phase 3.4: Pydantic Request/Response Schemas & Data Contracts.
Defines contracts for research and synthetic patient profiles. Strictly complies
with the zero-PHI governance framework: requires pseudonymous identifiers;
real patient identifiers, names, and contact details are strictly prohibited.
"""

from datetime import date, datetime
from typing import Literal
from uuid import UUID
from pydantic import Field
from backend.app.schemas.common import BaseSchema, ORMModel

BiologicalSex = Literal["male", "female", "other", "unknown"]


class PatientBase(BaseSchema):
    """Base schema attributes for patient records."""

    mrn_pseudonym: str = Field(
        min_length=3,
        max_length=64,
        description="Pseudonymous subject or synthetic medical record number (e.g. 'SYNTH-PAT-0001')",
        examples=["SYNTH-PAT-0001"],
    )
    birth_date: date | None = Field(
        default=None,
        description="Date or synthetic birth reference for demographic stratification",
        examples=["1985-06-15"],
    )
    biological_sex: BiologicalSex | None = Field(
        default=None,
        description="Biological sex classification ('male', 'female', 'other', 'unknown')",
        examples=["female"],
    )
    is_synthetic: bool = Field(
        default=True,
        description="True for artificially generated records; False for licensed public research datasets",
    )


class PatientCreate(PatientBase):
    """Request contract for registering a new research patient record."""

    pass


class PatientUpdate(BaseSchema):
    """Request contract for updating patient profile attributes."""

    birth_date: date | None = Field(
        default=None,
        description="Updated birth date reference",
    )
    biological_sex: BiologicalSex | None = Field(
        default=None,
        description="Updated biological sex classification",
    )
    is_synthetic: bool | None = Field(
        default=None,
        description="Updated synthetic dataset designation",
    )


class PatientResponse(PatientBase, ORMModel):
    """Response contract representing a patient record."""

    id: UUID = Field(
        description="Unique patient identifier",
    )
    created_at: datetime = Field(
        description="Patient record creation timestamp in UTC",
    )
    updated_at: datetime = Field(
        description="Patient record last-modified timestamp in UTC",
    )
