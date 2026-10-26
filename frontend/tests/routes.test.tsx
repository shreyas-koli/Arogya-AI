import { describe, it } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { NAV_GROUPS, Sidebar } from "../components/layout/Sidebar";

// All 21 canonical modules from docs/architecture/MODULE_DEPENDENCIES.md
const CANONICAL_MODULES = [
  { id: 1, name: "Project Foundation & Architecture", route: null, userFacing: false },
  { id: 2, name: "Backend Platform", route: null, userFacing: false },
  { id: 3, name: "Database & Data Contracts", route: null, userFacing: false },
  { id: 4, name: "Frontend Shell & Design System", route: "/", userFacing: true },
  { id: 5, name: "Overview Dashboard", route: "/", userFacing: true },
  { id: 6, name: "Patient Intelligence", route: "/patients", userFacing: true },
  { id: 7, name: "Security, Identity & File Handling", route: "/security", userFacing: true },
  { id: 8, name: "Clinical Workspace", route: "/analysis", userFacing: true },
  { id: 9, name: "Tabular ML Research", route: null, userFacing: false },
  { id: 10, name: "Chest X-ray Imaging Research", route: "/imaging", userFacing: true },
  { id: 11, name: "Multi-Agent Orchestration", route: "/agents", userFacing: true },
  { id: 12, name: "Medical Knowledge Hub & RAG", route: "/knowledge", userFacing: true },
  { id: 13, name: "Critic, Consensus, Uncertainty & Safety", route: "/safety", userFacing: true },
  { id: 14, name: "Explainability & Evidence Presentation", route: "/explainability", userFacing: true },
  { id: 15, name: "Reports, Doctor Review & Feedback", route: "/reviews", userFacing: true },
  { id: 16, name: "Patient Timeline & Follow-up", route: "/timeline", userFacing: true },
  { id: 17, name: "Hospital Intelligence & Financial Analytics", route: "/operations", userFacing: true },
  { id: 18, name: "AI Research Lab & Model Evaluation", route: "/research", userFacing: true },
  { id: 19, name: "Administration, Audit & Governance", route: "/admin", userFacing: true },
  { id: 20, name: "Deployment, Monitoring & Release", route: "/monitoring", userFacing: true },
  { id: 21, name: "Research Documentation & Readiness Review", route: "/readiness", userFacing: true },
];

describe("Canonical Route Architecture & Inventory", () => {
  it("accounts for all 21 canonical roadmap modules", () => {
    assert.strictEqual(CANONICAL_MODULES.length, 21);
    const ids = CANONICAL_MODULES.map((m) => m.id);
    for (let i = 1; i <= 21; i++) {
      assert.ok(ids.includes(i), `Module ${i} must exist in canonical roadmap inventory`);
    }
  });

  it("ensures every user-facing module has a corresponding filesystem page", () => {
    const appDir = path.resolve(__dirname, "../app");

    for (const mod of CANONICAL_MODULES) {
      if (!mod.userFacing || !mod.route) continue;

      if (mod.route === "/") {
        const pagePath = path.join(appDir, "page.tsx");
        assert.ok(fs.existsSync(pagePath), `Root page must exist at ${pagePath}`);
      } else {
        const subDir = mod.route.replace(/^\//, "");
        const pagePath = path.join(appDir, subDir, "page.tsx");
        assert.ok(fs.existsSync(pagePath), `Route page must exist for ${mod.route} at ${pagePath}`);
      }
    }
  });

  it("verifies ROUTES.md exists and documents all 21 modules", () => {
    const routesDocPath = path.resolve(__dirname, "../docs/ROUTES.md");
    assert.ok(fs.existsSync(routesDocPath), "frontend/docs/ROUTES.md must exist");

    const content = fs.readFileSync(routesDocPath, "utf-8");
    for (const mod of CANONICAL_MODULES) {
      assert.ok(
        content.includes(`M${mod.id}`) || content.includes(`Module ${mod.id}`),
        `ROUTES.md must document Module ${mod.id}`
      );
    }
  });
});

describe("Sidebar Navigation & Active Route Behavior", () => {
  it("contains all 16 user-facing routes across logical groups", () => {
    const allHrefs = NAV_GROUPS.flatMap((g) => g.items.map((i) => i.href));

    // Ensure no duplicate routes in navigation
    const uniqueHrefs = new Set(allHrefs);
    assert.strictEqual(allHrefs.length, uniqueHrefs.size, "Sidebar navigation must have no duplicate links");

    // All distinct user-facing routes must be represented
    const expectedRoutes = [
      "/",
      "/patients",
      "/analysis",
      "/imaging",
      "/reviews",
      "/timeline",
      "/research",
      "/agents",
      "/knowledge",
      "/safety",
      "/explainability",
      "/admin",
      "/security",
      "/operations",
      "/monitoring",
      "/readiness",
    ];

    for (const r of expectedRoutes) {
      assert.ok(uniqueHrefs.has(r), `Sidebar must contain navigation link for ${r}`);
    }
  });

  it("renders active link attribute aria-current='page' correctly", () => {
    // When currentPath is '/patients'
    const htmlPatients = renderToStaticMarkup(
      <Sidebar isOpen={false} onClose={() => {}} currentPath="/patients" />
    );
    assert.ok(htmlPatients.includes('href="/patients"'));
    assert.ok(htmlPatients.includes('aria-current="page"'));

    // When currentPath is '/'
    const htmlRoot = renderToStaticMarkup(
      <Sidebar isOpen={false} onClose={() => {}} currentPath="/" />
    );
    assert.ok(htmlRoot.includes('aria-current="page"'));
  });

  it("renders roadmap module badges in sidebar", () => {
    const html = renderToStaticMarkup(
      <Sidebar isOpen={false} onClose={() => {}} currentPath="/" />
    );
    const expectedBadges = ["M5", "M6", "M8", "M10", "M15", "M16", "M18", "M11", "M12", "M13", "M14", "M19", "M7", "M17", "M20", "M21"];
    for (const badge of expectedBadges) {
      assert.ok(html.includes(badge), `Sidebar must display badge ${badge}`);
    }
  });
});

describe("Planned Route Content & Disclaimer Integrity", () => {
  const newRoutes = [
    { route: "security", file: "../app/security/page.tsx", moduleNum: 7 },
    { route: "imaging", file: "../app/imaging/page.tsx", moduleNum: 10 },
    { route: "agents", file: "../app/agents/page.tsx", moduleNum: 11 },
    { route: "knowledge", file: "../app/knowledge/page.tsx", moduleNum: 12 },
    { route: "safety", file: "../app/safety/page.tsx", moduleNum: 13 },
    { route: "explainability", file: "../app/explainability/page.tsx", moduleNum: 14 },
    { route: "reviews", file: "../app/reviews/page.tsx", moduleNum: 15 },
    { route: "timeline", file: "../app/timeline/page.tsx", moduleNum: 16 },
    { route: "operations", file: "../app/operations/page.tsx", moduleNum: 17 },
    { route: "monitoring", file: "../app/monitoring/page.tsx", moduleNum: 20 },
    { route: "readiness", file: "../app/readiness/page.tsx", moduleNum: 21 },
  ];

  for (const { route, file, moduleNum } of newRoutes) {
    it(`verifies /${route} renders PlannedFeatureState for Module ${moduleNum} with honest wording`, async () => {
      const mod = await import(file);
      const PageComponent = mod.default;
      const html = renderToStaticMarkup(<PageComponent />);

      // Honest wording: must communicate planned state
      assert.ok(html.includes(`Module ${moduleNum}`));
      assert.ok(html.includes("Planned for a future module"));
      assert.ok(html.includes("Verified Architecture Foundations"));
      assert.ok(html.includes("Research prototype notice"));
    });
  }
});
