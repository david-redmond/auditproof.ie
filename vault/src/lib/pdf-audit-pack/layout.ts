import type { PdfContext } from "./types";
import {
  MARGIN,
  PAGE_W,
  PAGE_H,
  HEADER_H,
  CONTENT_TOP,
  CONTENT_BOTTOM,
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
 * Add a new page with standard header and set y to content top.
 */
export function addPageWithHeader(
  ctx: PdfContext,
  opts: { orgName: string; versionLabel: string }
): void {
  const { page, font, bold, colors, setPage, setY } = ctx;
  const newPage = ctx.pdf.addPage([PAGE_W, PAGE_H]);
  setPage(newPage);
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
 * Draw footer on a single page (call for each page at the end).
 */
export function drawFooterOnPage(
  ctx: PdfContext,
  page: { drawText: PdfContext["page"]["drawText"]; drawLine?: PdfContext["page"]["drawLine"] },
  opts: { generatedAtStr: string; pageNum: number; totalPages: number }
): void {
  const { font, colors } = ctx;
  const footerText = `Generated ${opts.generatedAtStr} • Page ${opts.pageNum} of ${opts.totalPages}`;
  const w = font.widthOfTextAtSize(footerText, FOOTER_SIZE);
  page.drawText(footerText, {
    x: (PAGE_W - w) / 2,
    y: MARGIN + 6,
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
    x: MARGIN,
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

export function addPageIfNeeded(
  ctx: PdfContext,
  requiredSpace: number,
  onNewPage?: () => void
): void {
  if (ctx.y - requiredSpace < CONTENT_BOTTOM) {
    addPageWithHeader(ctx, ctx.headerOpts);
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
    start: { x: MARGIN, y: ctx.y },
    end: { x: PAGE_W - MARGIN, y: ctx.y },
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
    x: MARGIN,
    y: ctx.y,
    size: SECTION_TITLE_SIZE,
    font: ctx.bold,
    color: ctx.colors.text,
  });
  ctx.setY(ctx.y - SECTION_TITLE_SIZE - 4);
  ctx.page.drawLine({
    start: { x: MARGIN, y: ctx.y },
    end: { x: PAGE_W - MARGIN, y: ctx.y },
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
    x: MARGIN,
    y: ctx.y,
    size: SMALL_SIZE,
    font: ctx.font,
    color: ctx.colors.muted,
  });
  ctx.setY(ctx.y - LINE_SMALL - 6);
}
