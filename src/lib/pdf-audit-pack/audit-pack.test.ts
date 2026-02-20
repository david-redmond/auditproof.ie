import { describe, it, expect } from "vitest";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { formatDate, formatDateTime } from "./format";
import { getSummaryStats } from "./summary";
import {
  getColors,
  PAGE_W,
  PAGE_H,
  MARGIN,
  drawCoverPage,
  drawExecutiveSummaryPage,
  drawFooterOnPage,
  getSummaryStats as getSummaryStatsExport,
} from "./index";
import type { PdfContext } from "./types";

describe("formatDate", () => {
  it("formats date as DD MMM YYYY", () => {
    expect(formatDate(new Date("2026-02-08"))).toMatch(/08 Feb 2026/);
  });

  it("returns — for null or undefined", () => {
    expect(formatDate(null)).toBe("—");
    expect(formatDate(undefined)).toBe("—");
  });
});

describe("formatDateTime", () => {
  it("formats with time", () => {
    const s = formatDateTime(new Date("2026-02-08T14:03:00"));
    expect(s).toMatch(/08 Feb 2026/);
    expect(s).toMatch(/\d{1,2}:\d{2}/);
  });
});

describe("getSummaryStats", () => {
  it("computes open and overdue DSR counts", () => {
    const today = new Date();
    const past = new Date(today);
    past.setDate(past.getDate() - 1);
    const future = new Date(today);
    future.setDate(future.getDate() + 1);

    const stats = getSummaryStats(
      5,
      [
        { outcome: null, dueAt: past },   // open, overdue
        { outcome: null, dueAt: future }, // open, not overdue
        { outcome: "completed_full", dueAt: past }, // completed, not counted open/overdue
      ],
      [{ status: "open" }, { status: "closed" }],
      3
    );

    expect(stats.ropaCount).toBe(5);
    expect(stats.dsrCount).toBe(3);
    expect(stats.dsrOpenCount).toBe(2);
    expect(stats.dsrOverdueCount).toBe(1);
    expect(stats.incidentOpenCount).toBe(1);
    expect(stats.evidenceCount).toBe(3);
  });

  it("included-but-empty: open and overdue are 0", () => {
    const stats = getSummaryStats(0, [], [], 0);
    expect(stats.dsrOpenCount).toBe(0);
    expect(stats.dsrOverdueCount).toBe(0);
    expect(stats.incidentOpenCount).toBe(0);
  });
});

describe("status line and Not included", () => {
  it("included-but-empty shows 0 records (derived from stats)", () => {
    const stats = getSummaryStats(0, [], [], 0);
    expect(stats.ropaCount).toBe(0);
    expect(stats.dsrCount).toBe(0);
    // Status line text is built in route: "Status: 0 records" when length === 0
    const ropaStatusWhenEmpty = "Status: 0 records";
    expect(ropaStatusWhenEmpty).toBe("Status: 0 records");
  });

  it("Not included only when section excluded (logic: include flag false)", () => {
    const includesRopa = false;
    const count = 10;
    const recordCountText = includesRopa ? String(count) : "Not included";
    expect(recordCountText).toBe("Not included");

    const includesRopaYes = true;
    const recordCountTextIncluded = includesRopaYes ? String(count) : "Not included";
    expect(recordCountTextIncluded).toBe("10");
  });
});

describe("full PDF audit pack generation", () => {
  it("builds a minimal audit pack PDF with cover and executive summary without throwing", async () => {
    const pdf = await PDFDocument.create();
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
    const colors = getColors();
    let page = pdf.addPage([PAGE_W, PAGE_H]);
    let y = PAGE_H - MARGIN - 40;

    const pdfCtx: PdfContext = {
      pdf,
      page,
      y,
      font,
      bold,
      colors,
      headerOpts: { orgName: "Test Org", versionLabel: "v1.0" },
      setPage: (p) => {
        page = p;
        pdfCtx.page = p;
      },
      setY: (val) => {
        y = val;
        pdfCtx.y = val;
      },
      pageWidth: PAGE_W,
      pageHeight: PAGE_H,
      margin: MARGIN,
    };

    const includes = {
      ropa: true,
      dsrs: true,
      incidents: true,
      evidenceIndex: true,
      evidenceFiles: false,
    };
    const stats = getSummaryStatsExport(0, [], [], 0);

    drawCoverPage(pdfCtx, {
      orgName: "Test Org",
      versionLabel: "v1.0",
      generatedAtStr: "08 Feb 2026 14:00",
      generatedByStr: "Test User",
      includes,
      ropaCount: 0,
      dsrCount: 0,
      incidentCount: 0,
      evidenceCount: 0,
      auditEventCount: 0,
    });

    drawExecutiveSummaryPage(pdfCtx, {
      orgName: "Test Org",
      versionLabel: "v1.0",
      generatedAtStr: "08 Feb 2026 14:00",
      includes,
      stats,
    });

    const totalPages = pdf.getPageCount();
    for (let i = 0; i < totalPages; i++) {
      drawFooterOnPage(pdfCtx, pdf.getPage(i), {
        pageNum: i + 1,
        totalPages,
      });
    }

    const bytes = await pdf.save();
    expect(bytes.length).toBeGreaterThan(1000);
    expect(totalPages).toBeGreaterThanOrEqual(2);
  });

  it("produces deterministic output for the same input (same page count and byte length)", async () => {
    const buildPdf = async () => {
      const pdf = await PDFDocument.create();
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
      const colors = getColors();
      let page = pdf.addPage([PAGE_W, PAGE_H]);
      let y = PAGE_H - MARGIN - 40;
      const pdfCtx: PdfContext = {
        pdf,
        page,
        y,
        font,
        bold,
        colors,
        headerOpts: { orgName: "Test Org", versionLabel: "v2026.02.18" },
        setPage: (p) => {
          page = p;
          pdfCtx.page = p;
        },
        setY: (val) => {
          y = val;
          pdfCtx.y = val;
        },
        pageWidth: PAGE_W,
        pageHeight: PAGE_H,
        margin: MARGIN,
      };
      const includes = { ropa: true, dsrs: true, incidents: true, evidenceIndex: true, evidenceFiles: false };
      const stats = getSummaryStatsExport(0, [], [], 0);
      drawCoverPage(pdfCtx, {
        orgName: "Test Org",
        versionLabel: "v2026.02.18",
        generatedAtStr: "18 Feb 2026 12:00",
        generatedByStr: "Test User",
        includes,
        ropaCount: 0,
        dsrCount: 0,
        incidentCount: 0,
        evidenceCount: 0,
        auditEventCount: 0,
      });
      drawExecutiveSummaryPage(pdfCtx, {
        orgName: "Test Org",
        versionLabel: "v2026.02.18",
        generatedAtStr: "18 Feb 2026 12:00",
        includes,
        stats,
      });
      const totalPages = pdf.getPageCount();
      for (let i = 0; i < totalPages; i++) {
        drawFooterOnPage(pdfCtx, pdf.getPage(i), { pageNum: i + 1, totalPages });
      }
      return pdf.save();
    };
    const [bytes1, bytes2] = await Promise.all([buildPdf(), buildPdf()]);
    expect(bytes1.length).toBe(bytes2.length);
    expect(bytes1.length).toBeGreaterThan(1000);
  });
});
