import { describe, it } from "node:test";
import assert from "node:assert";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  SummaryCard,
  PatientSummaryCard,
  EncounterSummaryCard,
  AnalysisSummaryCard,
  ReviewQueueSummaryCard,
  RecentActivityFeed,
  AnalysisStatusIndicator,
  PendingReviewTable,
  formatUtcTimestamp,
} from "../components/dashboard";
import type {
  PatientSummary,
  EncounterSummary,
  AnalysisSummary,
  PendingReviewQueueSummary,
  PendingReviewItem,
  RecentActivitySummary,
  AnalysisRunStatus,
} from "../types/dashboard";
import Home from "../app/page";

describe("SummaryCard Primitive", () => {
  it("renders valid typed data with formatted values and unit", () => {
    const html = renderToStaticMarkup(
      <SummaryCard
        title="Active Cohort"
        subtitle="Registered subjects"
        value={1250}
        unit="subjects"
        provenance="Synthetic seed cohort"
        footerNote="Zero-PHI policy enforced"
      />
    );

    assert.ok(html.includes("Active Cohort"));
    assert.ok(html.includes("Registered subjects"));
    assert.ok(html.includes("1,250"));
    assert.ok(html.includes("subjects"));
    assert.ok(html.includes("Synthetic seed cohort"));
    assert.ok(html.includes("Zero-PHI policy enforced"));
    assert.ok(html.includes('role="region"'));
    assert.ok(html.includes('aria-label="Active Cohort summary: 1,250 subjects"'));
  });

  it("renders zero count correctly without falling back to placeholder or empty", () => {
    const html = renderToStaticMarkup(
      <SummaryCard
        title="Pending Flags"
        value={0}
        unit="flags"
      />
    );

    // Value container must contain the literal '0'
    assert.ok(html.includes("Pending Flags"));
    assert.ok(html.includes(">0</span>"));
    assert.ok(!html.includes("—"));
    assert.ok(html.includes('aria-label="Pending Flags summary: 0 flags"'));
  });

  it("renders breakdown items when provided", () => {
    const html = renderToStaticMarkup(
      <SummaryCard
        title="Analysis Breakdown"
        value={100}
        breakdown={[
          { label: "Completed", value: 85 },
          { label: "Abstained", value: 15 },
        ]}
      />
    );

    assert.ok(html.includes('role="list"'));
    assert.ok(html.includes("Completed"));
    assert.ok(html.includes("85"));
    assert.ok(html.includes("Abstained"));
    assert.ok(html.includes("15"));
  });

  it("renders accessible loading skeleton state with aria-busy", () => {
    const html = renderToStaticMarkup(
      <SummaryCard
        title="Patient Cohort"
        status="loading"
      />
    );

    assert.ok(html.includes('role="region"'));
    assert.ok(html.includes('aria-busy="true"'));
    assert.ok(html.includes('aria-label="Patient Cohort loading"'));
    // Main value should not be present
    assert.ok(!html.includes("subjects"));
  });

  it("renders truthful unavailable / pending integration state", () => {
    const html = renderToStaticMarkup(
      <SummaryCard
        title="Realtime Inference Metrics"
        status="unavailable"
        statusMessage="Inference telemetry aggregation scheduled for Phase 5.5."
        provenance="Module 5 Roadmap Boundary"
      />
    );

    assert.ok(html.includes("Integration Pending"));
    assert.ok(html.includes("Inference telemetry aggregation scheduled for Phase 5.5."));
    assert.ok(html.includes("Module 5 Roadmap Boundary"));
  });

  it("renders error state with role='alert'", () => {
    const html = renderToStaticMarkup(
      <SummaryCard
        title="Cohort Telemetry"
        status="error"
        statusMessage="Failed to synchronize with service"
      />
    );

    assert.ok(html.includes('role="alert"'));
    assert.ok(html.includes("Metric Synchronization Error"));
    assert.ok(html.includes("Failed to synchronize with service"));
  });
});

describe("Specialized Domain Summary Cards", () => {
  const patientData: PatientSummary = {
    total_patients: 10,
    synthetic_patients: 10,
    research_cohort_patients: 0,
    generated_at: "2026-01-10T08:00:00Z",
  };

  const encounterData: EncounterSummary = {
    total_encounters: 4,
    planned: 1,
    in_progress: 1,
    completed: 2,
    cancelled: 0,
    reporting_period_start: "2026-01-01T00:00:00Z",
    reporting_period_end: "2026-01-31T23:59:59Z",
    generated_at: "2026-01-15T10:00:00Z",
  };

  const analysisData: AnalysisSummary = {
    total_runs: 4,
    by_status: {
      queued: 0,
      running: 1,
      completed: 2,
      failed: 0,
      abstained: 1,
    },
    active_models_observed: ["chexnet-v2-research", "clinical-bert-ner"],
    generated_at: "2026-01-15T12:00:00Z",
  };

  const reviewData: PendingReviewQueueSummary = {
    pending_count: 3,
    items: [
      {
        run_id: "7b0a88df-2b48-4cb3-9111-c9fe00000001",
        patient_id: "SYNTH-PAT-0001",
        encounter_id: "SYNTH-ENC-0001",
        model_name: "chexnet-v2-research",
        model_version: "2.1.0",
        status: "completed",
        abstained: false,
        created_at: "2026-01-15T11:00:00Z",
      },
      {
        run_id: "7b0a88df-2b48-4cb3-9111-c9fe00000002",
        patient_id: "SYNTH-PAT-0002",
        encounter_id: null,
        model_name: "clinical-bert-ner",
        model_version: "1.4.0",
        status: "abstained",
        abstained: true,
        created_at: "2026-01-15T11:30:00Z",
      },
    ],
    generated_at: "2026-01-15T12:00:00Z",
  };

  it("renders PatientSummaryCard with cohort breakdowns and synthetic provenance", () => {
    const html = renderToStaticMarkup(
      <PatientSummaryCard summary={patientData} provenance="Synthetic seed cohort (Module 3)" />
    );

    assert.ok(html.includes("Patient Cohort"));
    assert.ok(html.includes("10"));
    assert.ok(html.includes("Synthetic"));
    assert.ok(html.includes("Research"));
    assert.ok(html.includes("Zero-PHI policy enforced"));
    assert.ok(html.includes("Synthetic seed cohort (Module 3)"));
  });

  it("renders EncounterSummaryCard with care event breakdowns", () => {
    const html = renderToStaticMarkup(
      <EncounterSummaryCard summary={encounterData} />
    );

    assert.ok(html.includes("Clinical Encounters"));
    assert.ok(html.includes("4"));
    assert.ok(html.includes("Planned"));
    assert.ok(html.includes("In Progress"));
    assert.ok(html.includes("Completed"));
    assert.ok(html.includes("Cancelled"));
  });

  it("renders AnalysisSummaryCard with model observed list and status counts", () => {
    const html = renderToStaticMarkup(
      <AnalysisSummaryCard summary={analysisData} />
    );

    assert.ok(html.includes("AI Analysis Runs"));
    assert.ok(html.includes("4"));
    assert.ok(html.includes("Completed"));
    assert.ok(html.includes("Abstained"));
    assert.ok(html.includes("Active models: chexnet-v2-research, clinical-bert-ner"));
  });

  it("renders ReviewQueueSummaryCard with honest candidate wording and limitation caveat", () => {
    const html = renderToStaticMarkup(
      <ReviewQueueSummaryCard summary={reviewData} />
    );

    // Prompt requirement: Honest wording "candidate" and caveat that sign-off is deferred to Module 15
    assert.ok(html.includes("Runs Requiring Review"));
    assert.ok(html.includes("Candidate model outputs awaiting clinician review"));
    assert.ok(html.includes("3"));
    assert.ok(html.includes("candidates"));
    assert.ok(html.includes("formal doctor sign-off workflow is deferred to Module 15"));
    assert.ok(html.includes("Abstained Flags"));
  });

  it("handles null summaries gracefully by rendering unavailable state", () => {
    const htmlPatient = renderToStaticMarkup(<PatientSummaryCard summary={null} />);
    assert.ok(htmlPatient.includes("Integration Pending"));

    const htmlEncounter = renderToStaticMarkup(<EncounterSummaryCard summary={null} />);
    assert.ok(htmlEncounter.includes("Integration Pending"));

    const htmlAnalysis = renderToStaticMarkup(<AnalysisSummaryCard summary={null} />);
    assert.ok(htmlAnalysis.includes("Integration Pending"));

    const htmlReview = renderToStaticMarkup(<ReviewQueueSummaryCard summary={null} />);
    assert.ok(htmlReview.includes("Integration Pending"));
  });
});

describe("RecentActivityFeed Component", () => {
  const sampleActivity: RecentActivitySummary = {
    total_events: 3,
    activities: [
      {
        id: "act-1",
        event_type: "analysis.abstained",
        action: "execute",
        resource_type: "analysis_run",
        resource_id: "run-uuid-001",
        description: "Safety threshold exceeded; model abstained from prediction",
        timestamp: "2026-01-15T11:30:00Z",
      },
      {
        id: "act-2",
        event_type: "analysis.completed",
        action: "execute",
        resource_type: "analysis_run",
        resource_id: "run-uuid-002",
        description: "Exploratory research run completed successfully",
        timestamp: "2026-01-15T11:00:00Z",
      },
      {
        id: "act-3",
        event_type: "encounter.completed",
        action: "update",
        resource_type: "encounter",
        resource_id: "enc-uuid-001",
        description: "Care encounter status changed to completed",
        timestamp: "2026-01-15T10:00:00Z",
      },
    ],
    generated_at: "2026-01-15T12:00:00Z",
  };

  it("renders safe titles from allowlist rather than raw machine event strings", () => {
    const html = renderToStaticMarkup(
      <RecentActivityFeed summary={sampleActivity} />
    );

    // Check allowlisted safe titles
    assert.ok(html.includes("Model Safety Abstention Logged"));
    assert.ok(html.includes("AI Analysis Concluded"));
    assert.ok(html.includes("Recent System Activity"));
    assert.ok(html.includes("3 Events"));
  });

  it("formats timestamps consistently and safely in UTC", () => {
    assert.strictEqual(
      formatUtcTimestamp("2026-01-15T11:30:00Z"),
      "2026-01-15 11:30:00 UTC"
    );
    assert.strictEqual(
      formatUtcTimestamp("invalid-iso-string"),
      "Invalid timestamp"
    );
    assert.strictEqual(
      formatUtcTimestamp(null),
      "Unknown timestamp"
    );
    assert.strictEqual(
      formatUtcTimestamp(undefined),
      "Unknown timestamp"
    );
  });

  it("handles empty activity list honestly", () => {
    const emptySummary: RecentActivitySummary = {
      total_events: 0,
      activities: [],
      generated_at: "2026-01-15T12:00:00Z",
    };

    const html = renderToStaticMarkup(
      <RecentActivityFeed summary={emptySummary} />
    );

    assert.ok(html.includes("No Recent Events Recorded"));
    assert.ok(html.includes("0 Events"));
  });

  it("handles unavailable / integration pending state truthfully", () => {
    const html = renderToStaticMarkup(
      <RecentActivityFeed summary={null} status="unavailable" />
    );

    assert.ok(html.includes("Operational Feed Pending Integration"));
    assert.ok(html.includes("Audit event aggregation endpoint will be connected in Phase 5.3") || html.includes("Phase 5.5"));
    assert.ok(html.includes("No fabricated events are displayed"));
  });

  it("handles loading skeleton state", () => {
    const html = renderToStaticMarkup(
      <RecentActivityFeed summary={null} status="loading" />
    );

    assert.ok(html.includes('aria-busy="true"'));
    assert.ok(html.includes('aria-labelledby="activity-feed-heading"'));
  });

  it("handles error state with role='alert'", () => {
    const html = renderToStaticMarkup(
      <RecentActivityFeed summary={null} status="error" statusMessage="Audit log service unreachable" />
    );

    assert.ok(html.includes('role="alert"'));
    assert.ok(html.includes("Telemetry Synchronization Error"));
    assert.ok(html.includes("Audit log service unreachable"));
  });

  it("omits sensitive information, raw passwords, or clinical narratives", () => {
    const unsafeActivity: RecentActivitySummary = {
      total_events: 1,
      activities: [
        {
          id: "act-sanitized",
          event_type: "user.login",
          action: "create",
          resource_type: "auth_session",
          resource_id: "sess-123",
          description: "User logged in with multi-factor authentication",
          timestamp: "2026-01-15T09:00:00Z",
        },
      ],
      generated_at: "2026-01-15T09:05:00Z",
    };

    const html = renderToStaticMarkup(
      <RecentActivityFeed summary={unsafeActivity} />
    );

    // Verify sensitive keywords are never inadvertently exposed
    assert.ok(!html.includes("password"));
    assert.ok(!html.includes("token="));
    assert.ok(!html.includes("Bearer"));
    assert.ok(!html.includes("SSN"));
    assert.ok(html.includes("System Authentication Event"));
    assert.ok(html.includes("Zero-PHI Guarantee"));
  });
});

describe("AnalysisStatusIndicator Component (Phase 5.3)", () => {
  const supportedStatuses: AnalysisRunStatus[] = [
    "queued",
    "running",
    "completed",
    "failed",
    "abstained",
  ];

  for (const status of supportedStatuses) {
    it(`renders supported status "${status}" with readable label and accessible aria-label`, () => {
      const html = renderToStaticMarkup(<AnalysisStatusIndicator status={status} />);
      assert.ok(html.includes(`aria-label="Analysis status:`));

      if (status === "completed") {
        assert.ok(html.includes("Completed"));
        assert.ok(html.includes("success"));
      } else if (status === "running") {
        assert.ok(html.includes("Running"));
        assert.ok(html.includes("info"));
      } else if (status === "queued") {
        assert.ok(html.includes("Queued"));
        assert.ok(html.includes("neutral"));
      } else if (status === "failed") {
        assert.ok(html.includes("Failed"));
        assert.ok(html.includes("danger"));
      } else if (status === "abstained") {
        assert.ok(html.includes("Abstained (Safety Flag)"));
        assert.ok(html.includes("warning"));
      }
    });
  }

  it("handles unknown or future status defensively without crashing or falsely claiming success", () => {
    const html = renderToStaticMarkup(
      <AnalysisStatusIndicator status="pending_external_eval" />
    );
    assert.ok(html.includes("Unknown (pending_external_eval)"));
    assert.ok(html.includes("neutral"));
    assert.ok(!html.includes("success"));
  });

  it("handles null or empty status safely with Unknown Status fallback", () => {
    const htmlNull = renderToStaticMarkup(<AnalysisStatusIndicator status={null} />);
    assert.ok(htmlNull.includes("Unknown Status"));
    assert.ok(htmlNull.includes("neutral"));

    const htmlEmpty = renderToStaticMarkup(<AnalysisStatusIndicator status="" />);
    assert.ok(htmlEmpty.includes("Unknown Status"));
  });

  it("does not imply clinical correctness or diagnostic validity in status labels", () => {
    const html = renderToStaticMarkup(<AnalysisStatusIndicator status="completed" />);
    assert.ok(!html.includes("Clinically Validated"));
    assert.ok(!html.includes("Diagnosis Confirmed"));
    assert.ok(html.includes("technical lifecycle indicator only"));
  });
});

describe("PendingReviewTable Component (Phase 5.3)", () => {
  const sampleReviewQueue: PendingReviewQueueSummary = {
    pending_count: 2,
    items: [
      {
        run_id: "7b0a88df-2b48-4cb3-9111-c9fe00000001",
        patient_id: "SYNTH-PAT-0001",
        encounter_id: "SYNTH-ENC-0001",
        model_name: "chexnet-v2-research",
        model_version: "2.1.0",
        status: "completed",
        abstained: false,
        created_at: "2026-01-15T11:00:00Z",
      },
      {
        run_id: "7b0a88df-2b48-4cb3-9111-c9fe00000002",
        patient_id: "SYNTH-PAT-0002",
        encounter_id: null,
        model_name: "clinical-bert-ner",
        model_version: "1.4.0",
        status: "abstained",
        abstained: true,
        created_at: "2026-01-15T11:30:00Z",
      },
    ],
    generated_at: "2026-01-15T12:00:00Z",
  };

  it("renders valid candidate rows from contract with safe shortened IDs and models", () => {
    const html = renderToStaticMarkup(<PendingReviewTable summary={sampleReviewQueue} />);

    // Table headings
    assert.ok(html.includes("Run Reference"));
    assert.ok(html.includes("Subject ID"));
    assert.ok(html.includes("Care Encounter"));
    assert.ok(html.includes("Research Model"));
    assert.ok(html.includes("Execution State"));
    assert.ok(html.includes("Abstention"));
    assert.ok(html.includes("Submitted (UTC)"));

    // Item 1: completed, non-abstained, encounter present
    assert.ok(html.includes("RUN-7b0a88df"));
    assert.ok(html.includes("SYNTH-PAT-0001"));
    assert.ok(html.includes("SYNTH-ENC-0001"));
    assert.ok(html.includes("chexnet-v2-research"));
    assert.ok(html.includes("v2.1.0"));
    assert.ok(html.includes("Completed"));
    assert.ok(html.includes("Normal"));

    // Item 2: abstained, null encounter
    assert.ok(html.includes("SYNTH-PAT-0002"));
    assert.ok(html.includes("Unassociated"));
    assert.ok(html.includes("clinical-bert-ner"));
    assert.ok(html.includes("v1.4.0"));
    assert.ok(html.includes("Abstained (Safety Flag)"));

    // Correct UTC timestamp format
    assert.ok(html.includes("2026-01-15 11:00:00 UTC"));
    assert.ok(html.includes("2026-01-15 11:30:00 UTC"));
  });

  it("includes semantic table structure and scope attributes", () => {
    const html = renderToStaticMarkup(<PendingReviewTable summary={sampleReviewQueue} />);

    assert.ok(html.includes("<table"));
    assert.ok(html.includes("<thead"));
    assert.ok(html.includes("<tbody"));
    assert.ok(html.includes('scope="col"'));
    assert.ok(html.includes("<caption"));
  });

  it("renders prominent review boundary disclaimer and honest candidate wording", () => {
    const html = renderToStaticMarkup(<PendingReviewTable summary={sampleReviewQueue} />);

    // Accurate wording required by Section 3 & 5
    assert.ok(html.includes("Analysis Runs Requiring Review"));
    assert.ok(html.includes("Candidate model outputs awaiting clinician review"));
    assert.ok(html.includes("Research Prototype Review Boundary"));
    assert.ok(html.includes("Module 15 (Doctor Review &amp; Feedback)"));

    // Ensure NO buttons imply clinician approval, sign-off, or clinical amendment
    assert.ok(!html.includes("Approve"));
    assert.ok(!html.includes("Sign Off"));
    assert.ok(!html.includes("Reject Finding"));
    assert.ok(!html.includes("Amend Diagnosis"));
  });

  it("renders loading skeleton state with aria-busy", () => {
    const html = renderToStaticMarkup(
      <PendingReviewTable summary={null} status="loading" />
    );

    assert.ok(html.includes('aria-busy="true"'));
    assert.ok(html.includes("Loading placeholder"));
    assert.ok(!html.includes("RUN-7b0a88df"));
  });

  it("renders truthful unavailable state pending Phase 5.5 integration", () => {
    const html = renderToStaticMarkup(
      <PendingReviewTable summary={null} status="unavailable" />
    );

    assert.ok(html.includes("Review Candidate Queue Pending Backend Integration"));
    assert.ok(html.includes("Phase 5.5 REST API"));
    assert.ok(!html.includes("RUN-7b0a88df"));
  });

  it("renders empty state when queue items list is empty", () => {
    const emptySummary: PendingReviewQueueSummary = {
      pending_count: 0,
      items: [],
      generated_at: "2026-01-15T12:00:00Z",
    };

    const html = renderToStaticMarkup(<PendingReviewTable summary={emptySummary} />);

    assert.ok(html.includes("No Review Candidates In Queue"));
    assert.ok(html.includes("0 Candidates"));
  });

  it("renders error state with role='alert'", () => {
    const html = renderToStaticMarkup(
      <PendingReviewTable summary={null} status="error" statusMessage="Inference review registry timeout" />
    );

    assert.ok(html.includes('role="alert"'));
    assert.ok(html.includes("Review Candidate Synchronization Error"));
    assert.ok(html.includes("Inference review registry timeout"));
  });

  it("omits sensitive clinical narratives, credentials, and tokens", () => {
    const unsafeItem: PendingReviewItem = {
      run_id: "safe-id-001",
      patient_id: "SYNTH-PAT-0001",
      encounter_id: null,
      model_name: "test-model",
      model_version: "1.0",
      status: "completed",
      abstained: false,
      created_at: "2026-01-15T10:00:00Z",
    };
    const summary: PendingReviewQueueSummary = {
      pending_count: 1,
      items: [unsafeItem],
      generated_at: "2026-01-15T10:00:00Z",
    };

    const html = renderToStaticMarkup(<PendingReviewTable summary={summary} />);
    assert.ok(!html.includes("password"));
    assert.ok(!html.includes("Bearer"));
    assert.ok(!html.includes("token="));
    assert.ok(html.includes("Zero-PHI Guarantee"));
  });
});

describe("Overview Page Integration (app/page.tsx)", () => {
  it("renders the dashboard page with summary cards, pending-review table, and recent activity feed", () => {
    const html = renderToStaticMarkup(<Home />);

    // Verify presence of Module 5 overview section
    assert.ok(html.includes("Clinical Overview &amp; Research Metrics"));
    assert.ok(html.includes("Overview summary cards and chronological operational activity"));

    // Verify presence of view mode buttons
    assert.ok(html.includes("Synthetic Demo"));
    assert.ok(html.includes("Integration Pending"));
    assert.ok(html.includes("Loading Skeleton"));

    // Verify presence of summary card domains
    assert.ok(html.includes("Patient Cohort"));
    assert.ok(html.includes("Clinical Encounters"));
    assert.ok(html.includes("AI Analysis Runs"));
    assert.ok(html.includes("Runs Requiring Review"));

    // Verify presence of Phase 5.3 Pending-Review Table
    assert.ok(html.includes("Analysis Runs Requiring Review"));
    assert.ok(html.includes("Candidate model outputs awaiting clinician review"));
    assert.ok(html.includes("Research Prototype Review Boundary"));
    assert.ok(html.includes("chexnet-v2-research"));
    assert.ok(html.includes("clinical-bert-ner"));

    // Verify presence of recent activity feed
    assert.ok(html.includes("Recent System Activity"));

    // Verify presence of provenance disclaimer
    assert.ok(html.includes("SYNTH-PAT-0001"));
    assert.ok(html.includes("Real-time clinical metrics are never fabricated"));

    // Verify technical foundation table includes Module 5 Phase 5.3
    assert.ok(html.includes("Module 5 (Phase 5.3)"));
    assert.ok(html.includes("Phase 5.3 Active"));
  });
});
