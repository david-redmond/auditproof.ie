import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { Types } from "mongoose";
import path from "path";
import fs from "fs";
import { getSessionUserId } from "@/lib/auth";
import { getOrgContext } from "@/lib/org";
import { getSubscriptionStatus } from "@/lib/billing";
import { connectToDatabase } from "@/lib/mongoose";
import {
  AuditPackModel,
  AuditEventModel,
  DataSubjectRequestModel,
  EvidenceDocumentModel,
  IncidentModel,
  OrganisationModel,
  RopaRecordModel,
  UserModel,
} from "@/lib/models";
import {
  getColors,
  PAGE_W,
  PAGE_H,
  MARGIN,
  getSummaryStats,
  formatDate,
  formatDateTime,
  friendlyLawfulBasis,
  friendlyRequestType,
  friendlyOutcome,
  friendlyRisk,
  friendlyDocType,
  subjectRefDisplay,
  addPageWithHeader,
  addPageWithHeaderLandscape,
  drawFooterOnPage,
  drawStyledTable,
  drawStyledTableTwoRow,
  drawCoverPage,
  drawExecutiveSummaryPage,
  drawSectionCard,
  drawInfoBox,
  draw,
  wrapText,
} from "@/lib/pdf-audit-pack";
import type { PdfContext } from "@/lib/pdf-audit-pack";
import { SECTION_GAP, SPACE_AFTER_METRIC_ROW, SPACE_BEFORE_TABLE } from "@/lib/pdf-audit-pack/tokens";

/** Normalise orgId to ObjectId so queries always match DB. */
function toObjectId(value: unknown): Types.ObjectId {
  if (value instanceof Types.ObjectId) return value;
  if (typeof value === "string") return new Types.ObjectId(value);
  throw new Error("Invalid orgId");
}

/** Match orgId whether stored as ObjectId or string. */
function orgIdFilter(orgId: Types.ObjectId): { $or: [{ orgId: Types.ObjectId }, { orgId: string }] } {
  return { $or: [{ orgId }, { orgId: String(orgId) }] };
}

/** Load logo from public if available (optional). */
function loadLogoPng(): Uint8Array | null {
  try {
    const logoPath = path.join(process.cwd(), "public", "logo.png");
    const buf = fs.readFileSync(logoPath);
    return new Uint8Array(buf);
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const ctx = await getOrgContext(userId);
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const subscription = await getSubscriptionStatus(ctx.orgId);
  if (!subscription.isActive) {
    return NextResponse.json(
      { message: "Subscription required to generate/download the audit pack." },
      { status: 402 }
    );
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const type = searchParams.get("type");
  if (!id || !type) return NextResponse.json({ error: "Missing id or type" }, { status: 400 });

  await connectToDatabase();
  const pack = await AuditPackModel.findOne({ _id: id, orgId: ctx.orgId }).lean();
  if (!pack) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (type !== "pdf") {
    return NextResponse.json({ error: "ZIP export not implemented yet." }, { status: 501 });
  }

  const queryOrgId = toObjectId(pack.orgId);
  const includes = pack.includes ?? {
    ropa: true,
    dsrs: true,
    incidents: true,
    evidenceIndex: true,
    evidenceFiles: false,
  };

  const orgFilter = orgIdFilter(queryOrgId);

  const [org, generatedByUser, ropaCount, dsrCount, incidentCount, evidenceCount, auditEventCount, ropaList, incidentList, dsrList, evidenceList] =
    await Promise.all([
      OrganisationModel.findById(queryOrgId).select("name").lean(),
      UserModel.findById(pack.generatedByUserId).select("name email").lean(),
      RopaRecordModel.countDocuments(orgFilter),
      DataSubjectRequestModel.countDocuments(orgFilter),
      IncidentModel.countDocuments(orgFilter),
      EvidenceDocumentModel.countDocuments(orgFilter),
      AuditEventModel.countDocuments(orgFilter),
      includes.ropa ? RopaRecordModel.find(orgFilter).sort({ name: 1 }).lean() : Promise.resolve([]),
      includes.incidents ? IncidentModel.find(orgFilter).sort({ discoveredAt: -1 }).lean() : Promise.resolve([]),
      includes.dsrs ? DataSubjectRequestModel.find(orgFilter).sort({ receivedAt: -1 }).lean() : Promise.resolve([]),
      includes.evidenceIndex ? EvidenceDocumentModel.find(orgFilter).sort({ uploadedAt: -1 }).lean() : Promise.resolve([]),
    ]);

  const orgName = org?.name ?? "Unknown organisation";
  const generatedAt = pack.generatedAt ? new Date(pack.generatedAt) : new Date();
  const generatedAtStr = formatDateTime(generatedAt);
  const generatedByStr = generatedByUser
    ? [generatedByUser.name, generatedByUser.email].filter(Boolean).join(" • ") || generatedByUser.email
    : "";

  const stats = getSummaryStats(ropaCount, dsrList, incidentList, evidenceCount);
  const versionLabel = pack.versionLabel;
  const logoPng = loadLogoPng();

  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const colors = getColors();
  const logoImage = logoPng
    ? await pdf.embedPng(logoPng).catch(() => null)
    : null;

  let page = pdf.addPage([PAGE_W, PAGE_H]);
  let y = PAGE_H - MARGIN - 40;

  const pdfCtx: PdfContext = {
    pdf,
    page,
    y,
    font,
    bold,
    colors,
    headerOpts: { orgName, versionLabel },
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

  // ---------- Cover page ----------
  drawCoverPage(pdfCtx, {
    orgName,
    versionLabel,
    generatedAtStr,
    generatedByStr,
    includes,
    ropaCount,
    dsrCount: dsrList.length,
    incidentCount: incidentList.length,
    evidenceCount,
    auditEventCount,
    logo: logoImage,
  });

  // ---------- Executive summary (page 2) ----------
  drawExecutiveSummaryPage(pdfCtx, {
    orgName,
    versionLabel,
    generatedAtStr,
    includes,
    stats,
  });

  // ---------- Section A: RoPA (Article 30) — landscape ----------
  if (includes.ropa) {
    pdfCtx.nextPageLandscape = true;
    addPageWithHeaderLandscape(pdfCtx, { orgName, versionLabel });
    drawSectionCard(pdfCtx, {
      title: "Record of Processing Activities (RoPA)",
      subtitle: "Article 30 GDPR — A list of the ways your organisation uses personal data.",
      statusLine:
        ropaList.length === 0
          ? "0 records"
          : `${ropaList.length} record${ropaList.length === 1 ? "" : "s"}`,
    });
    // Fixed column widths; ~32% to Retention (long-text). Landscape content width ≈ 722pt.
    const ropaColWidths = [88, 72, 232, 72, 58, 58, 72, 70];
    const ropaHeaders = [
      "Data use",
      "Lawful basis",
      "Retention",
      "Recipients",
      "Intl?",
      "Region",
      "Last reviewed",
      "Suppliers",
    ];
    const rows = ropaList.length
      ? ropaList.map((r) => {
          const period = (r.retention?.period ?? "").trim().toLowerCase();
          const retentionDisplay =
            period === "until withdrawn" || period === "until_withdrawn"
              ? "Until withdrawn"
              : period === "other" && r.retention?.rationale
                ? `Other: ${r.retention.rationale}`
                : r.retention?.period ?? "—";
          const recipientsSummary =
            Array.isArray(r.recipients) && r.recipients.length
              ? r.recipients.length === 1
                ? r.recipients[0]
                : `${r.recipients.length} recipients`
              : "—";
          const suppliers = r.processors?.length
            ? r.processors.length === 1
              ? r.processors[0].name ?? "—"
              : `${r.processors.length} processors`
            : "—";
          const intlRegion =
            r.internationalTransfers?.occurs && Array.isArray(r.internationalTransfers?.countries) && r.internationalTransfers.countries.length
              ? r.internationalTransfers.countries.join(", ")
              : r.internationalTransfers?.occurs
                ? "Yes"
                : "—";
          return [
            r.name ?? "—",
            friendlyLawfulBasis(r.lawfulBasis ?? undefined),
            retentionDisplay,
            recipientsSummary,
            r.internationalTransfers?.occurs ? "Yes" : "No",
            intlRegion,
            formatDate(r.lastReviewedAt),
            suppliers,
          ];
        })
      : [];
    drawStyledTable(pdfCtx, {
      headers: ropaHeaders,
      colWidths: ropaColWidths,
      rows,
      emptyMessage: "No RoPA entries recorded.",
    });
    pdfCtx.setY(pdfCtx.y - SECTION_GAP);
  }

  // ---------- Section B: DSR (Articles 12–23) — landscape, two-row pattern ----------
  if (includes.dsrs) {
    pdfCtx.nextPageLandscape = true;
    addPageWithHeaderLandscape(pdfCtx, { orgName, versionLabel });
    drawSectionCard(pdfCtx, {
      title: "Data Subject Requests (Articles 12–23 GDPR)",
      subtitle: "Requests to access, correct, or delete personal data.",
      statusLine:
        dsrList.length === 0
          ? "0 records"
          : `${stats.dsrOpenCount} open${stats.dsrOverdueCount > 0 ? ` • ${stats.dsrOverdueCount} overdue` : ""}`,
    });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Two-row layout: row1 = Received | Type | Who | Reply By | Status; row2 = ID? | Sent? | Extension | Note. Col4 ~32% for Note.
    const dsrColWidths = [90, 108, 108, 352, 64];
    const dsrHeadersRow1 = ["Received", "Type", "Who", "Reply by", "Late?"];
    const dsrHeadersRow2 = ["ID?", "Sent?", "Extension", "Note"];
    type DsrDoc = (typeof dsrList)[number] & { identityVerifiedAt?: Date | null; overdueNote?: string | null };
    const overdueIndices: number[] = [];
    const dsrRows = dsrList.map((d: DsrDoc, idx: number) => {
      const due = d.dueAt ? new Date(d.dueAt) : null;
      const isOverdue = !d.outcome && due != null && (due.setHours(0, 0, 0, 0), due < today);
      if (isOverdue) overdueIndices.push(idx);
      const idVerified = d.identityVerifiedAt ? "Yes" : "—";
      const responseSentStr = d.responseSent ? (d.responseSentAt ? formatDate(d.responseSentAt) : "Yes") : "No";
      const extStr = d.extension?.used
        ? (d.extension.newDueAt ? formatDate(d.extension.newDueAt) : "Yes") + (d.extension.justification ? " + reason" : "")
        : "No";
      const note = isOverdue && !d.outcome && (d.overdueNote ?? d.summary) ? String((d.overdueNote ?? d.summary) ?? "") : "—";
      return {
        row1: [
          formatDate(d.receivedAt),
          friendlyRequestType(d.requestType),
          subjectRefDisplay(d.subjectRef),
          formatDate(d.dueAt),
          isOverdue ? "Yes" : "No",
        ],
        row2: [idVerified, responseSentStr, extStr, note],
      };
    });
    drawStyledTableTwoRow(pdfCtx, {
      headersRow1: dsrHeadersRow1,
      headersRow2: dsrHeadersRow2,
      colWidths: dsrColWidths,
      rows: dsrRows,
      emptyMessage: "No requests recorded.",
      highlightRecord: (i) => overdueIndices.includes(i),
    });
    pdfCtx.setY(pdfCtx.y - SECTION_GAP);
    const dsrCallout =
      "Response deadlines apply under Articles 12–15. Extensions must be justified and the data subject informed; ensure extension rationale is logged.";
    draw(pdfCtx, dsrCallout, 9.5, false);
    pdfCtx.setY(pdfCtx.y - 8);
  }

  // ---------- Section C: Incidents (Articles 33–34) — landscape ----------
  if (includes.incidents) {
    pdfCtx.nextPageLandscape = true;
    addPageWithHeaderLandscape(pdfCtx, { orgName, versionLabel });
    drawSectionCard(pdfCtx, {
      title: "Security Incidents & Personal Data Breaches (Articles 33–34 GDPR)",
      subtitle: "Incidents that could affect personal data.",
    });
    const incLogged = stats.incidentCount;
    const incOpen = stats.incidentOpenCount;
    const incidentMetric =
      incLogged === 0
        ? "Incidents logged: 0 · Open: 0"
        : incLogged === 1
          ? `Incidents logged: 1 · Open: ${incOpen}`
          : `Incidents logged: ${incLogged} · Open: ${incOpen}`;
    draw(pdfCtx, incidentMetric, 9.5, true);
    pdfCtx.setY(pdfCtx.y - SPACE_AFTER_METRIC_ROW);
    const incident72h =
      "Where notification is required, GDPR requires notification without undue delay and, where feasible, within 72 hours of becoming aware of the breach.";
    const incidentContentWidth = pdfCtx.pageWidth - 2 * pdfCtx.margin;
    wrapText(pdfCtx, incident72h, 9.5, incidentContentWidth);
    pdfCtx.setY(pdfCtx.y - SPACE_BEFORE_TABLE);
    // Summary and Rationale get ~32% and ~34% (long-text). Landscape ≈ 722pt.
    const colWidths = [72, 232, 58, 58, 58, 244];
    const headers = ["Found on", "Summary", "Severity", "Status", "DPC?", "Rationale if not"];
    const rows = incidentList.length
      ? incidentList.map((inc) => {
          const notif = inc.notification ?? undefined;
          const statusDisplay = inc.status === "closed" ? "Closed" : "Open";
          return [
            formatDate(inc.discoveredAt),
            inc.title ?? "—",
            friendlyRisk(inc.riskLevel),
            statusDisplay,
            notif?.dpcNotified ? (notif.dpcNotifiedAt ? formatDate(notif.dpcNotifiedAt) : "Yes") : "No",
            notif?.dpcNotified ? "—" : (notif?.rationaleIfNotNotified ?? "—"),
          ];
        })
      : [];
    drawStyledTable(pdfCtx, {
      headers,
      colWidths,
      rows,
      emptyMessage: "No incidents recorded in this system at the time of export.",
    });
    pdfCtx.setY(pdfCtx.y - SECTION_GAP);
  }

  // ---------- Section D: Evidence / Documents (Article 24) — landscape ----------
  if (includes.evidenceIndex) {
    pdfCtx.nextPageLandscape = true;
    addPageWithHeaderLandscape(pdfCtx, { orgName, versionLabel });
    drawSectionCard(pdfCtx, {
      title: "Accountability & Supporting Documents (Article 24 GDPR)",
      subtitle: "Policies and documents that support GDPR accountability.",
      statusLine:
        evidenceList.length === 0
          ? "0 documents"
          : `${evidenceList.length} document${evidenceList.length === 1 ? "" : "s"}`,
    });
    // Document name ~35% (long-text). Landscape ≈ 722pt.
    const colWidths = [88, 254, 108, 108, 164];
    const headers = ["What this is", "Document name", "Added on", "Review by", "Tags"];
    const rows = evidenceList.map((doc) => [
      friendlyDocType(doc.type),
      doc.title ?? "—",
      formatDate(doc.uploadedAt),
      formatDate(doc.reviewDueAt),
      Array.isArray(doc.tags) && doc.tags.length ? doc.tags.slice(0, 3).join(", ") : "—",
    ]);
    drawStyledTable(pdfCtx, {
      headers,
      colWidths,
      rows,
      emptyMessage: "No documents uploaded at the time of export. The organisation may maintain policies outside this system.",
    });
    pdfCtx.setY(pdfCtx.y - SECTION_GAP);
  }

  // ---------- Section E: ZIP (portrait) ----------
  if (includes.evidenceFiles) {
    pdfCtx.nextPageLandscape = false;
    addPageWithHeader(pdfCtx, { orgName, versionLabel });
    drawSectionCard(pdfCtx, {
      title: "Attached files (ZIP)",
      statusLine: "ZIP archive",
    });
    const zipArtifact = pack.artifacts?.zip as { key?: string; sha256?: string } | undefined;
    const zipLines: string[] = [];
    if (zipArtifact?.key) {
      zipLines.push(`ZIP attached: ${zipArtifact.key}`);
      if (zipArtifact.sha256) zipLines.push(`SHA256: ${zipArtifact.sha256}`);
      if (evidenceList.length > 0) {
        zipLines.push(
          "Documents in evidence index (see Policies & Supporting Documents) may be included in the ZIP."
        );
      }
    } else {
      zipLines.push("Evidence files were not attached.");
    }
    drawInfoBox(pdfCtx, zipLines);
  }

  // ---------- Footers on all pages (left: brand, center: Confidential, right: Page N of M) ----------
  const totalPages = pdf.getPageCount();
  for (let i = 0; i < totalPages; i++) {
    const p = pdf.getPage(i);
    drawFooterOnPage(pdfCtx, p, {
      pageNum: i + 1,
      totalPages,
    });
  }

  // Mark first export time for this org (used in Stripe metadata / reporting)
  await OrganisationModel.updateOne(
    { _id: queryOrgId, firstExportAt: null },
    { $set: { firstExportAt: new Date() } }
  );

  const pdfBytes = await pdf.save();
  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="audit-${versionLabel}.pdf"`,
    },
  });
}
