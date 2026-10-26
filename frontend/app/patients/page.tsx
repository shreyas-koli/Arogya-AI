import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { PlannedFeatureState } from "@/components/states";
import styles from "../page.module.css";

export const metadata: Metadata = {
  title: "Patient Intelligence — Arogya AI",
  description: "Longitudinal patient profiles, encounters, and clinical observation timelines.",
};

export default function PatientsPage() {
  return (
    <PageContainer
      title="Patient Intelligence"
      description="Longitudinal patient records, encounter history, physiological observations, and clinical timeline tracking."
      breadcrumbs={[
        { label: "Overview", href: "/" },
        { label: "Patient Intelligence" },
      ]}
      badge={
        <div
          className={styles.stageBadge}
          role="status"
          aria-label="Roadmap Module 6 Planned"
        >
          <span className={styles.stageDot} aria-hidden="true" />
          <span>Module 6: Planned</span>
        </div>
      }
    >
      <div className={styles.container}>
        {/* Module Implementation Status Callout using PlannedFeatureState */}
        <PlannedFeatureState
          moduleName="Module 6: Patient Intelligence"
          targetBlock="Block 2: Clinical Domain Foundation"
          statusText="Planned for a future module"
          description="Patient Intelligence is scheduled for full implementation in Module 6. The relational entities (Patient, Encounter, Observation) and data access repositories are verified in the backend (Module 3). Interactive patient cohorts, longitudinal timelines, and live EHR integration are not yet connected to this frontend shell."
          verifiedFoundations={[
            "SQLAlchemy Models: Patient, Encounter, Observation (Module 3)",
            "Repositories: PatientRepository, EncounterRepository, ObservationRepository",
            "Pydantic Schemas: PatientCreate, PatientResponse, EncounterResponse",
            "Synthetic Seed: De-identified synthetic patient cohorts",
          ]}
        />

        {/* Planned Architecture Specifications */}
        <section aria-labelledby="patients-capabilities-heading">
          <div className={styles.sectionHeading}>
            <h2 id="patients-capabilities-heading" className={styles.sectionTitle}>
              Planned Domain Capabilities
            </h2>
            <p className={styles.sectionSubtitle}>
              Target capabilities defined in the system architecture specification.
            </p>
          </div>

          <div className={styles.pillarsGrid}>
            <article className={styles.pillarCard}>
              <div className={styles.pillarIconContainer} aria-hidden="true">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className={styles.pillarTitle}>Cohort &amp; Demographic Profiles</h3>
              <p className={styles.pillarDescription}>
                De-identified synthetic patient demographics, MRN tracking, and baseline
                clinical profiles linked to verified database entities.
              </p>
            </article>

            <article className={styles.pillarCard}>
              <div className={styles.pillarIconContainer} aria-hidden="true">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <h3 className={styles.pillarTitle}>Encounter Timeline</h3>
              <p className={styles.pillarDescription}>
                Chronological visualization of inpatient, outpatient, and ambulatory encounters
                with clinical provider attribution and notes.
              </p>
            </article>

            <article className={styles.pillarCard}>
              <div className={styles.pillarIconContainer} aria-hidden="true">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <h3 className={styles.pillarTitle}>Observation Panels</h3>
              <p className={styles.pillarDescription}>
                Standardized physiological vitals and lab panels mapped to reference ranges
                with automatic out-of-bounds flagging.
              </p>
            </article>
          </div>
        </section>

        {/* Foundation Alignment */}
        <section className={styles.specCard} aria-labelledby="patients-backend-heading">
          <div className={styles.specHeader}>
            <div>
              <h2 id="patients-backend-heading" className={styles.sectionTitle}>
                Backend Data Readiness
              </h2>
              <p className={styles.sectionSubtitle}>
                Persistence layer status verified in Module 3.
              </p>
            </div>
            <div className={styles.statusTags}>
              <span className={styles.badgeSuccess}>Schemas Ready</span>
              <span className={styles.badgeInfo}>Module 3 Verified</span>
            </div>
          </div>

          <div className={styles.specGrid}>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Database Model</span>
              <span className={styles.specValue}>Patient, Encounter, Observation</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Repositories</span>
              <span className={styles.specValue}>PatientRepository, EncounterRepository</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Pydantic Contracts</span>
              <span className={styles.specValue}>PatientCreate, PatientResponse</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Synthetic Seed</span>
              <span className={styles.specValue}>De-identified synthetic cohorts</span>
            </div>
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
