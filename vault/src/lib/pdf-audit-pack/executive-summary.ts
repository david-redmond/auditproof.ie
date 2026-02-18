import type { PdfContext } from "./types";
import { addPageWithHeader, draw, drawDivider, wrapText } from "./layout";
import { BODY_SIZE, SMALL_SIZE, PARAGRAPH_MAX_WIDTH } from "./tokens";
import type { AuditPackIncludes } from "./route-data";
import type { SummaryStats } from "./summary";

export interface ExecutiveSummaryOpts {
  orgName: string;
  versionLabel: string;
  generatedAtStr: string;
  includes: AuditPackIncludes;
  stats: SummaryStats;
}

/**
 * Draw executive summary page (page 2): org/version/timestamp, Record counts panel, Status at a glance.
 */
export function drawExecutiveSummaryPage(ctx: PdfContext, opts: ExecutiveSummaryOpts): void {
  addPageWithHeader(ctx, { orgName: opts.orgName, versionLabel: opts.versionLabel });

  // Small meta line
  draw(ctx, `${opts.orgName} • ${opts.versionLabel} • ${opts.generatedAtStr}`, SMALL_SIZE);
  ctx.setY(ctx.y - 16);

  // Record counts panel
  draw(ctx, "Record counts", BODY_SIZE, true);
  ctx.setY(ctx.y - 4);
  draw(
    ctx,
    `RoPA: ${opts.includes.ropa ? opts.stats.ropaCount : "Not included"}`,
    SMALL_SIZE
  );
  draw(
    ctx,
    `Requests: ${opts.includes.dsrs ? opts.stats.dsrCount : "Not included"}`,
    SMALL_SIZE
  );
  draw(
    ctx,
    `Incidents: ${opts.includes.incidents ? opts.stats.incidentCount : "Not included"}`,
    SMALL_SIZE
  );
  draw(
    ctx,
    `Documents: ${opts.includes.evidenceIndex ? opts.stats.evidenceCount : "Not included"}`,
    SMALL_SIZE
  );
  ctx.setY(ctx.y - 14);

  drawDivider(ctx);

  // Status at a glance
  draw(ctx, "Status at a glance", BODY_SIZE, true);
  ctx.setY(ctx.y - 8);

  const ropaLine = opts.includes.ropa
    ? `${opts.stats.ropaCount} data use${opts.stats.ropaCount === 1 ? "" : "s"} recorded`
    : "Not included";
  const requestsLine = opts.includes.dsrs
    ? `${opts.stats.dsrOpenCount} open / ${opts.stats.dsrOverdueCount} overdue`
    : "Not included";
  draw(ctx, `• RoPA: ${ropaLine}`, SMALL_SIZE);
  draw(ctx, `• Requests: ${requestsLine}`, SMALL_SIZE);
  if (opts.includes.dsrs && opts.stats.dsrOverdueCount > 0) {
    wrapText(
      ctx,
      "Overdue requests should have an explanation logged (e.g. extension under Art. 12(3)).",
      SMALL_SIZE,
      PARAGRAPH_MAX_WIDTH
    );
  }
  const incidentsLine = opts.includes.incidents
    ? `${opts.stats.incidentOpenCount} open incident${opts.stats.incidentOpenCount === 1 ? "" : "s"}`
    : "Not included";
  const documentsLine = opts.includes.evidenceIndex
    ? `${opts.stats.evidenceCount} document${opts.stats.evidenceCount === 1 ? "" : "s"} on file`
    : "Not included";

  draw(ctx, `• Incidents: ${incidentsLine}`, SMALL_SIZE);
  draw(ctx, `• Documents: ${documentsLine}`, SMALL_SIZE);
}
