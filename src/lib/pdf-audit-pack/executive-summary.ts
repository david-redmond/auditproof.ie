import type { PDFFont } from "pdf-lib";
import type { PdfContext } from "./types";
import { addPageWithHeader, draw, drawDivider } from "./layout";
import {
  MARGIN,
  PAGE_W,
  BODY_SIZE,
  SMALL_SIZE,
  SECTION_TITLE_SIZE,
  BOX_PAD,
  LINE_SMALL,
  SPACE_4,
  SPACE_8,
  SPACE_12,
  SPACE_AFTER_SECTION_TITLE,
  SPACE_AFTER_CARD,
} from "./tokens";
import type { AuditPackIncludes } from "./route-data";
import type { SummaryStats } from "./summary";
import { addPageIfNeeded } from "./layout";

export interface ExecutiveSummaryOpts {
  orgName: string;
  versionLabel: string;
  generatedAtStr: string;
  includes: AuditPackIncludes;
  stats: SummaryStats;
}

/** Pluralize count: "1 record" vs "2 records", "1 logged" vs "2 logged" */
function plural(n: number, singular: string, pluralStr: string): string {
  return n === 1 ? `1 ${singular}` : `${n} ${pluralStr}`;
}

/** Width reserved for the large number on the left of each KPI card */
const KPI_NUMBER_WIDTH = 40;

/** KPI card: large number on the left, title + status text on the right. */
function drawKpiCard(
  ctx: PdfContext,
  x: number,
  y: number,
  width: number,
  height: number,
  title: string,
  headline: string,
  sub?: string
): void {
  const { page, font, bold, colors } = ctx;
  page.drawRectangle({
    x,
    y,
    width,
    height,
    color: colors.boxBg,
    borderColor: colors.boxBorder,
    borderWidth: 0.5,
  });
  const pad = BOX_PAD;
  const numberSize = 20;
  const leftX = x + pad;
  const rightX = x + pad + KPI_NUMBER_WIDTH;

  // Large number on the left, vertically centred
  const numberY = y + (height - numberSize) / 2;
  page.drawText(headline, {
    x: leftX,
    y: numberY,
    size: numberSize,
    font: bold,
    color: colors.text,
  });

  // Title and sub on the right of the number
  const line1Y = y + height - pad - SMALL_SIZE;
  page.drawText(title, {
    x: rightX,
    y: line1Y,
    size: SMALL_SIZE,
    font,
    color: colors.muted,
  });
  if (sub) {
    page.drawText(sub, {
      x: rightX,
      y: line1Y - LINE_SMALL - SPACE_4,
      size: SMALL_SIZE,
      font,
      color: colors.muted,
    });
  }
}

const ART12_REMINDER =
  "Under Article 12(3) GDPR, you may extend the response period by up to two months where necessary, taking into account the complexity and number of requests. You must inform the data subject of any such extension within one month of receipt, together with the reasons for the delay.";

/**
 * Page 2: Compliance Dashboard — Status Overview (2x2 KPI cards), Risk & Attention callouts, record counts.
 * All tiles use the same structure: headline = total count, sub = secondary chips (open, overdue, logged, on file).
 */
export function drawExecutiveSummaryPage(ctx: PdfContext, opts: ExecutiveSummaryOpts): void {
  addPageWithHeader(ctx, { orgName: opts.orgName, versionLabel: opts.versionLabel });

  draw(ctx, "Status Overview", SECTION_TITLE_SIZE, true);
  ctx.setY(ctx.y - SPACE_AFTER_SECTION_TITLE);

  const cardH = 56;
  const gap = SPACE_12;
  const contentWidth = PAGE_W - 2 * MARGIN;
  const twoColWidth = (contentWidth - gap) / 2;

  let y = ctx.y;

  // Row 1: RoPA | Requests — headline = total, sub = status chips
  const ropaTotal = opts.includes.ropa ? opts.stats.ropaCount : 0;
  const ropaHeadline = opts.includes.ropa ? String(ropaTotal) : "—";
  const ropaSub = opts.includes.ropa ? plural(ropaTotal, "record", "records") : "Not included";
  drawKpiCard(ctx, MARGIN, y - cardH, twoColWidth, cardH, "RoPA", ropaHeadline, ropaSub);

  const reqTotal = opts.includes.dsrs ? opts.stats.dsrCount : 0;
  const reqOpen = opts.includes.dsrs ? opts.stats.dsrOpenCount : 0;
  const reqOverdue = opts.includes.dsrs ? opts.stats.dsrOverdueCount : 0;
  const reqHeadline = opts.includes.dsrs ? String(reqTotal) : "—";
  const reqChips: string[] = [];
  if (opts.includes.dsrs && reqTotal > 0) {
    reqChips.push(reqOpen === 1 ? "1 open" : `${reqOpen} open`);
    if (reqOverdue > 0) reqChips.push(reqOverdue === 1 ? "1 overdue" : `${reqOverdue} overdue`);
  }
  const reqSub = reqChips.length > 0 ? reqChips.join(" · ") : opts.includes.dsrs ? "0 open" : "Not included";
  drawKpiCard(ctx, MARGIN + twoColWidth + gap, y - cardH, twoColWidth, cardH, "Requests", reqHeadline, reqSub);

  ctx.setY(y - cardH - gap);

  // Row 2: Incidents | Documents — headline = total, sub = status chips
  y = ctx.y;
  const incTotal = opts.includes.incidents ? opts.stats.incidentCount : 0;
  const incOpen = opts.includes.incidents ? opts.stats.incidentOpenCount : 0;
  const incHeadline = opts.includes.incidents ? String(incTotal) : "—";
  const incChips: string[] = [];
  if (opts.includes.incidents) {
    incChips.push(incTotal === 1 ? "1 logged" : `${incTotal} logged`);
    incChips.push(incOpen === 0 ? "0 open" : incOpen === 1 ? "1 open" : `${incOpen} open`);
  }
  const incSub = incChips.length > 0 ? incChips.join(" · ") : opts.includes.incidents ? "0 logged" : "Not included";
  drawKpiCard(ctx, MARGIN, y - cardH, twoColWidth, cardH, "Incidents", incHeadline, incSub);

  const docTotal = opts.includes.evidenceIndex ? opts.stats.evidenceCount : 0;
  const docHeadline = opts.includes.evidenceIndex ? String(docTotal) : "—";
  const docSub = opts.includes.evidenceIndex
    ? docTotal === 1 ? "1 on file" : `${docTotal} on file`
    : "Not included";
  drawKpiCard(ctx, MARGIN + twoColWidth + gap, y - cardH, twoColWidth, cardH, "Documents", docHeadline, docSub);

  ctx.setY(y - cardH - SPACE_AFTER_CARD);

  // Risk & Attention
  draw(ctx, "Risk & Attention", BODY_SIZE, true);
  ctx.setY(ctx.y - SPACE_8);

  if (opts.includes.dsrs && opts.stats.dsrOverdueCount > 0) {
    addPageIfNeeded(ctx, 60);
    const { page, font, colors } = ctx;
    const lines = wrapToLines(font, ART12_REMINDER, contentWidth - 2 * BOX_PAD, SMALL_SIZE);
    const boxHeight = lines.length * (LINE_SMALL + 2) + 2 * BOX_PAD + BODY_SIZE + 4;
    ctx.setY(ctx.y - boxHeight);
    const boxY = ctx.y;
    page.drawRectangle({
      x: MARGIN,
      y: boxY,
      width: contentWidth,
      height: boxHeight,
      color: colors.accentTint,
      borderColor: colors.accent,
      borderWidth: 0.5,
    });
    page.drawText("Overdue requests", {
      x: MARGIN + BOX_PAD,
      y: boxY + boxHeight - BOX_PAD - BODY_SIZE,
      size: BODY_SIZE,
      font: ctx.bold,
      color: colors.text,
    });
    let lineY = boxY + boxHeight - BOX_PAD - BODY_SIZE - 8 - LINE_SMALL;
    for (const line of lines) {
      page.drawText(line, {
        x: MARGIN + BOX_PAD,
        y: lineY,
        size: SMALL_SIZE,
        font,
        color: colors.text,
      });
      lineY -= LINE_SMALL + 2;
    }
    ctx.setY(boxY - SPACE_12);
  }

  if (opts.includes.incidents && opts.stats.incidentOpenCount === 0 && opts.stats.incidentCount >= 0) {
    draw(ctx, "No open incidents.", SMALL_SIZE, false);
    ctx.setY(ctx.y - SPACE_4);
  }

  ctx.setY(ctx.y - SPACE_12);
  drawDivider(ctx);

  // Record counts (clean list)
  draw(ctx, "Record counts", BODY_SIZE, true);
  ctx.setY(ctx.y - SPACE_8);
  draw(ctx, `RoPA: ${opts.includes.ropa ? opts.stats.ropaCount : "Not included"}`, SMALL_SIZE);
  draw(ctx, `Requests: ${opts.includes.dsrs ? opts.stats.dsrCount : "Not included"}`, SMALL_SIZE);
  draw(ctx, `Incidents: ${opts.includes.incidents ? opts.stats.incidentCount : "Not included"}`, SMALL_SIZE);
  draw(ctx, `Documents: ${opts.includes.evidenceIndex ? opts.stats.evidenceCount : "Not included"}`, SMALL_SIZE);
}

/** Wrap text to lines by width (for callout body) */
function wrapToLines(font: PDFFont, text: string, maxWidth: number, fontSize: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(test, fontSize) <= maxWidth) {
      line = test;
    } else {
      if (line) lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}
