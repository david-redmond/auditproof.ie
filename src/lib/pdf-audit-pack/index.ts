/**
 * GDPR Audit Pack PDF layout and styling.
 * Use from the audit-exports download route.
 */
export { getColors, PAGE_W, PAGE_H, MARGIN, CONTENT_TOP, CONTENT_BOTTOM } from "./tokens";
export type { PdfContext } from "./types";
export type { AuditPackIncludes } from "./route-data";
export type { SummaryStats } from "./summary";
export { getSummaryStats } from "./summary";
export { formatDate, formatDateTime } from "./format";
export {
  friendlyLawfulBasis,
  friendlyRequestType,
  friendlyOutcome,
  friendlyRisk,
  friendlyDocType,
  subjectRefDisplay,
} from "./labels";
export {
  addPageWithHeader,
  addPageWithHeaderLandscape,
  drawFooterOnPage,
  FOOTER_LEFT_DEFAULT,
  getContentBottom,
  draw,
  wrapText,
  addPageIfNeeded,
  drawDivider,
  drawSectionTitle,
  drawStatusLine,
} from "./layout";
export { drawStyledTable, drawStyledTableTwoRow, truncateCell, wrapCellLines } from "./table";
export { drawCoverPage } from "./cover";
export type { CoverPageOpts } from "./cover";
export { drawExecutiveSummaryPage } from "./executive-summary";
export type { ExecutiveSummaryOpts } from "./executive-summary";
export {
  drawPageHeader,
  drawMetaGrid,
  drawTotalsBox,
  drawCalloutBox,
  drawSectionCard,
  drawInfoBox,
} from "./invoice-layout";
export type { PageHeaderOpts } from "./invoice-layout";
