import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import styles from "../page.module.css";

export const metadata: Metadata = {
  title: "AI Research Lab — Arogya AI",
  description: "Model evaluation benches, explainability runners (SHAP/Grad-CAM), and uncertainty estimation.",
};

export default function ResearchPage() {
  return (
    <PageContainer
      title="AI Research Lab &amp; Model Evaluation"
      description="Comparative evaluation benches, multi-agent experimentation, feature attribution (SHAP), saliency heatmaps (Grad-CAM), and uncertainty estimation."
      breadcrumbs={[
        { label: "Overview", href: "/" },
        { label: "AI Research Lab" },
      ]}
      badge={
        <div
          className={styles.stageBadge}
          role="status"
          aria-label="Roadmap Module 18 Planned"
        >
          <span className={styles.stageDot} aria-hidden="true" />
          <span>Module 18: Planned</span>
        </div>
      }
    >
      <div className={styles.container}>
        {/* Module Implementation Status Callout */}
        <section
          className={styles.disclaimerBox}
          role="region"
          aria-labelledby="research-status-title"
        >
          <svg
            className={styles.disclaimerIcon}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div className={styles.disclaimerBody}>
            <h2 id="research-status-title" className={styles.disclaimerTitle}>
              Roadmap Status: Module 18 (Block 5)
            </h2>
            <p className={styles.disclaimerText}>
              The AI Research Lab is scheduled for implementation in Module 18, following model
              research (Modules 9–10) and agentic orchestration (Modules 11–14). Cross-architecture
              benchmarks, SHAP/Grad-CAM visualizers, and experiment registries are not yet connected to
              this frontend shell.
            </p>
          </div>
        </section>

        {/* Planned Architecture Specifications */}
        <section aria-labelledby="research-capabilities-heading">
          <div className={styles.sectionHeading}>
            <h2 id="research-capabilities-heading" className={styles.sectionTitle}>
              Planned Research Benches
            </h2>
            <p className={styles.sectionSubtitle}>
              Target evaluation and governance tools planned in Block 3 and Block 5.
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
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </div>
              <h3 className={styles.pillarTitle}>Model Evaluation Lab</h3>
              <p className={styles.pillarDescription}>
                Rigorous evaluation comparing multi-agent orchestrations against baseline single-model
                architectures on standardized synthetic benchmarks.
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
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              </div>
              <h3 className={styles.pillarTitle}>Explainability Engine (XAI)</h3>
              <p className={styles.pillarDescription}>
                SHAP waterfall plots for structured tabular risk factors and Grad-CAM saliency
                heatmaps superimposed on chest radiographs.
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
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <h3 className={styles.pillarTitle}>Uncertainty &amp; Abstention</h3>
              <p className={styles.pillarDescription}>
                Calibrated confidence estimation that triggers automatic abstention when model
                entropy exceeds safety thresholds or conflicting evidence is detected.
              </p>
            </article>
          </div>
        </section>

        {/* Research Pipeline Readiness */}
        <section className={styles.specCard} aria-labelledby="research-pipeline-heading">
          <div className={styles.specHeader}>
            <div>
              <h2 id="research-pipeline-heading" className={styles.sectionTitle}>
                Research Pipeline Dependency Map
              </h2>
              <p className={styles.sectionSubtitle}>
                Downstream pipeline sequence defined in MODULE_DEPENDENCIES.md.
              </p>
            </div>
            <div className={styles.statusTags}>
              <span className={styles.badgeSuccess}>Architecture Mapped</span>
              <span className={styles.badgeInfo}>Block 3 &amp; 5</span>
            </div>
          </div>

          <div className={styles.specGrid}>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Module 9</span>
              <span className={styles.specValue}>Tabular Risk Baseline (scikit-learn)</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Module 10</span>
              <span className={styles.specValue}>Chest X-ray Pipeline (PyTorch)</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Module 11</span>
              <span className={styles.specValue}>Multi-Agent State Graph (LangGraph)</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Module 14</span>
              <span className={styles.specValue}>Evidence Synthesis &amp; XAI Presentation</span>
            </div>
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
