import type { PdfContext } from "./types";
import {
  MARGIN,
  MARGIN_TABLE,
  PAGE_W,
  PAGE_H,
  PAGE_W_LANDSCAPE,
  PAGE_H_LANDSCAPE,
  HEADER_H,
  CONTENT_TOP,
  CONTENT_BOTTOM,
  FOOTER_H,
  LINE,
  LINE_SMALL,
  SECTION_TITLE_SIZE,
  BODY_SIZE,
  SMALL_SIZE,
  FOOTER_SIZE,
  TABLE_ROW_HEIGHT,
  PARAGRAPH_MAX_WIDTH,
} from "./tokens";

/**
 * Add a new portrait page with standard header and set y to content top.
 */
export function addPageWithHeader(
  ctx: PdfContext,
  opts: { orgName: string; versionLabel: string }
): void {
  const { font, colors, setPage, setY } = ctx;
  const newPage = ctx.pdf.addPage([PAGE_W, PAGE_H]);
  setPage(newPage);
  ctx.pageWidth = PAGE_W;
  ctx.pageHeight = PAGE_H;
  ctx.margin = MARGIN;
  const headerY = PAGE_H - MARGIN - 6;
  newPage.drawText(opts.orgName, {
    x: MARGIN,
    y: headerY,
    size: FOOTER_SIZE,
    font,
    color: colors.muted,
  });
  const centerTitle = "GDPR Audit Pack";
  const tw = font.widthOfTextAtSize(centerTitle, FOOTER_SIZE);
  newPage.drawText(centerTitle, {
    x: (PAGE_W - tw) / 2,
    y: headerY,
    size: FOOTER_SIZE,
    font,
    color: colors.muted,
  });
  newPage.drawText(opts.versionLabel, {
    x: PAGE_W - MARGIN - font.widthOfTextAtSize(opts.versionLabel, FOOTER_SIZE),
    y: headerY,
    size: FOOTER_SIZE,
    font,
    color: colors.muted,
  });
  newPage.drawLine({
    start: { x: MARGIN, y: PAGE_H - MARGIN - HEADER_H },
    end: { x: PAGE_W - MARGIN, y: PAGE_H - MARGIN - HEADER_H },
    thickness: 0.5,
    color: colors.divider,
  });
  setY(CONTENT_TOP);
}

/**
 * Add a new landscape page for table-heavy sections. Uses 20–25mm margin.
 * Sets ctx.pageWidth, pageHeight, margin and nextPageLandscape for continuation.
 */
export function addPageWithHeaderLandscape(
  ctx: PdfContext,
  opts: { orgName: string; versionLabel: string }
): void {
  const { page, font, colors, setPage, setY } = ctx;
  const w = PAGE_W_LANDSCAPE;
  const h = PAGE_H_LANDSCAPE;
  const margin = MARGIN_TABLE;
  const newPage = ctx.pdf.addPage([w, h]);
  setPage(newPage);
  ctx.pageWidth = w;
  ctx.pageHeight = h;
  ctx.margin = margin;
  ctx.nextPageLandscape = true;
  const headerY = h - margin - 6;
  newPage.drawText(opts.orgName, {
    x: margin,
    y: headerY,
    size: FOOTER_SIZE,
    font,
    color: colors.muted,
  });
  const centerTitle = "GDPR Audit Pack";
  const tw = font.widthOfTextAtSize(centerTitle, FOOTER_SIZE);
  newPage.drawText(centerTitle, {
    x: (w - tw) / 2,
    y: headerY,
    size: FOOTER_SIZE,
    font,
    color: colors.muted,
  });
  newPage.drawText(opts.versionLabel, {
    x: w - margin - font.widthOfTextAtSize(opts.versionLabel, FOOTER_SIZE),
    y: headerY,
    size: FOOTER_SIZE,
    font,
    color: colors.muted,
  });
  newPage.drawLine({
    start: { x: margin, y: h - margin - HEADER_H },
    end: { x: w - margin, y: h - margin - HEADER_H },
    thickness: 0.5,
    color: colors.divider,
  });
  const contentTop = h - margin - HEADER_H - 12;
  setY(contentTop);
}

/** Default footer left text (Go Solutions product name) */
export const FOOTER_LEFT_DEFAULT = "Go Solutions GDPR Audit Pack";

/**
 * Draw footer on a single page: left (brand), center (Confidential), right (Page N of M).
 * Call for each page at the end of PDF generation.
 */
export function drawFooterOnPage(
  ctx: PdfContext,
  page: PdfContext["page"],
  opts: {
    pageNum: number;
    totalPages: number;
    left?: string;
    center?: string;
    right?: string;
    /** @deprecated use left/center/right; if set and right empty, right becomes "Generated ... | Page N of M" */
    generatedAtStr?: string;
  }
): void {
  const { font, colors } = ctx;
  const left = opts.left ?? FOOTER_LEFT_DEFAULT;
  const center = opts.center ?? "Confidential";
  const right = opts.right ?? `Page ${opts.pageNum} of ${opts.totalPages}`;
  const pageW = page.getWidth();
  const pageH = page.getHeight();
  const footerMargin = pageH < 700 ? MARGIN_TABLE : MARGIN;
  const y = footerMargin + 8;
  page.drawText(left, {
    x: footerMargin,
    y,
    size: FOOTER_SIZE,
    font,
    color: colors.footerMuted ?? colors.muted,
  });
  const cw = font.widthOfTextAtSize(center, FOOTER_SIZE);
  page.drawText(center, {
    x: (pageW - cw) / 2,
    y,
    size: FOOTER_SIZE,
    font,
    color: colors.footerMuted ?? colors.muted,
  });
  const rw = font.widthOfTextAtSize(right, FOOTER_SIZE);
  page.drawText(right, {
    x: pageW - footerMargin - rw,
    y,
    size: FOOTER_SIZE,
    font,
    color: colors.footerMuted ?? colors.muted,
  });
}

/**
 * Draw a single line of text at current y, then decrement y.
 */
export function draw(
  ctx: PdfContext,
  text: string,
  size: number = BODY_SIZE,
  isBold: boolean = false
): void {
  addPageIfNeeded(ctx, size === SMALL_SIZE ? LINE_SMALL : LINE);
  ctx.page.drawText(text, {
    x: ctx.margin,
    y: ctx.y,
    size,
    font: isBold ? ctx.bold : ctx.font,
    color: ctx.colors.text,
  });
  ctx.setY(ctx.y - (size === SMALL_SIZE ? LINE_SMALL : LINE));
}

/**
 * Wrap paragraph text to max width and draw multiple lines.
 */
export function wrapText(
  ctx: PdfContext,
  text: string,
  size: number = BODY_SIZE,
  maxWidth: number = PARAGRAPH_MAX_WIDTH
): void {
  const words = text.split(" ");
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    const w = ctx.font.widthOfTextAtSize(test, size);
    if (w > maxWidth && line) {
      draw(ctx, line, size, false);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) draw(ctx, line, size, false);
}

/** Content bottom for current page (uses ctx.pageHeight and ctx.margin). */
export function getContentBottom(ctx: PdfContext): number {
  return ctx.margin + FOOTER_H + 12;
}

export function addPageIfNeeded(
  ctx: PdfContext,
  requiredSpace: number,
  onNewPage?: () => void
): void {
  const contentBottom = getContentBottom(ctx);
  if (ctx.y - requiredSpace < contentBottom) {
    if (ctx.nextPageLandscape) {
      addPageWithHeaderLandscape(ctx, ctx.headerOpts);
    } else {
      addPageWithHeader(ctx, ctx.headerOpts);
    }
    onNewPage?.();
  }
}

/**
 * Draw a thin horizontal divider and reduce y.
 */
export function drawDivider(ctx: PdfContext): void {
  addPageIfNeeded(ctx, 10);
  ctx.setY(ctx.y - 4);
  ctx.page.drawLine({
    start: { x: ctx.margin, y: ctx.y },
    end: { x: ctx.pageWidth - ctx.margin, y: ctx.y },
    thickness: 0.5,
    color: ctx.colors.divider,
  });
  ctx.setY(ctx.y - 12);
}

/**
 * Draw section title with thin divider under it.
 */
export function drawSectionTitle(ctx: PdfContext, text: string): void {
  addPageIfNeeded(ctx, SECTION_TITLE_SIZE + LINE);
  ctx.page.drawText(text, {
    x: ctx.margin,
    y: ctx.y,
    size: SECTION_TITLE_SIZE,
    font: ctx.bold,
    color: ctx.colors.text,
  });
  ctx.setY(ctx.y - SECTION_TITLE_SIZE - 4);
  ctx.page.drawLine({
    start: { x: ctx.margin, y: ctx.y },
    end: { x: ctx.pageWidth - ctx.margin, y: ctx.y },
    thickness: 0.5,
    color: ctx.colors.divider,
  });
  ctx.setY(ctx.y - 12);
}

/**
 * Draw a one-line status summary at the top of a section.
 * Example: "Status: 12 records" or "Status: 3 open • 1 overdue"
 */
export function drawStatusLine(ctx: PdfContext, text: string): void {
  addPageIfNeeded(ctx, LINE_SMALL);
  ctx.page.drawText(text, {
    x: ctx.margin,
    y: ctx.y,
    size: SMALL_SIZE,
    font: ctx.font,
    color: ctx.colors.muted,
  });
  ctx.setY(ctx.y - LINE_SMALL - 6);
}
