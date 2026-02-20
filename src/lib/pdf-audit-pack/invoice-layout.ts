import type { PdfContext } from "./types";
import {
  MARGIN,
  PAGE_W,
  PAGE_H,
  HEADER_H,
  BOX_PAD,
  SPACE_4,
  SPACE_8,
  SPACE_12,
  H2_SIZE,
  BODY_SIZE,
  SMALL_SIZE,
  FOOTER_SIZE,
  LINE_SMALL,
} from "./tokens";
import { addPageIfNeeded } from "./layout";

import type { PDFImage } from "pdf-lib";

/** Options for the page header (invoice-style: strong bar at top) */
export interface PageHeaderOpts {
  leftTitle: string;
  centerTitle?: string;
  rightMetaLines?: string[];
  /** Pre-embedded logo image (embed in caller to avoid async here). */
  logo?: PDFImage | null;
}

/**
 * Draw a strong header bar at top of page: left title (org/product), optional center, right meta (version, date).
 * Optional small logo top-left. Divider under header.
 */
export function drawPageHeader(ctx: PdfContext, opts: PageHeaderOpts): number {
  const { page, font, bold, colors } = ctx;
  let y = PAGE_H - MARGIN - 8;

  if (opts.logo) {
    try {
      const logoH = 24;
      const logoW = (opts.logo.width / opts.logo.height) * logoH;
      page.drawImage(opts.logo, {
        x: MARGIN,
        y: y - logoH,
        width: logoW,
        height: logoH,
        opacity: 0.9,
      });
      if (opts.leftTitle) {
        const leftX = MARGIN + logoW + 10;
        page.drawText(opts.leftTitle, {
          x: leftX,
          y: y - 6,
          size: FOOTER_SIZE + 1,
          font: bold,
          color: colors.text,
        });
      }
    } catch {
      if (opts.leftTitle) {
        page.drawText(opts.leftTitle, {
          x: MARGIN,
          y: y - 6,
          size: FOOTER_SIZE + 1,
          font: bold,
          color: colors.text,
        });
      }
    }
  } else if (opts.leftTitle) {
    page.drawText(opts.leftTitle, {
      x: MARGIN,
      y: y - 6,
      size: FOOTER_SIZE + 1,
      font: bold,
      color: colors.text,
    });
  }

  const reportTitle = opts.centerTitle ?? "GDPR Audit Pack";
  const tw = font.widthOfTextAtSize(reportTitle, H2_SIZE);
  page.drawText(reportTitle, {
    x: (PAGE_W - tw) / 2,
    y: y - 6,
    size: H2_SIZE,
    font: bold,
    color: colors.text,
  });

  if (opts.rightMetaLines && opts.rightMetaLines.length > 0) {
    let rightY = y;
    for (const line of opts.rightMetaLines) {
      const w = font.widthOfTextAtSize(line, SMALL_SIZE);
      page.drawText(line, {
        x: PAGE_W - MARGIN - w,
        y: rightY - 6,
        size: SMALL_SIZE,
        font,
        color: colors.muted,
      });
      rightY -= LINE_SMALL;
    }
  }

  y -= HEADER_H;
  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: PAGE_W - MARGIN, y },
    thickness: 0.8,
    color: colors.divider,
  });
  ctx.setY(y - SPACE_12);
  return ctx.y;
}

/**
 * Two-column metadata block (invoice-style): left lines and right lines in a light bordered box.
 */
export function drawMetaGrid(
  ctx: PdfContext,
  leftLines: string[],
  rightLines: string[]
): void {
  addPageIfNeeded(ctx, 80);
  const { page, font, colors } = ctx;
  const _boxTop = ctx.y;
  const lineHeight = LINE_SMALL + 2;
  const _leftColWidth = (PAGE_W - 2 * MARGIN) * 0.5;
  const _rightColWidth = (PAGE_W - 2 * MARGIN) * 0.5;
  const numRows = Math.max(leftLines.length, rightLines.length);
  const boxHeight = numRows * lineHeight + 2 * BOX_PAD;

  ctx.setY(ctx.y - boxHeight);

  const boxY = ctx.y;
  const boxWidth = PAGE_W - 2 * MARGIN;

  page.drawRectangle({
    x: MARGIN,
    y: boxY,
    width: boxWidth,
    height: boxHeight,
    color: colors.boxBg,
    borderColor: colors.boxBorder,
    borderWidth: 0.5,
  });

  let rowY = boxY + boxHeight - BOX_PAD - LINE_SMALL;
  for (let i = 0; i < numRows; i++) {
    const left = leftLines[i];
    const right = rightLines[i];
    if (left) {
      page.drawText(left, {
        x: MARGIN + BOX_PAD,
        y: rowY,
        size: SMALL_SIZE,
        font,
        color: colors.text,
      });
    }
    if (right) {
      const w = font.widthOfTextAtSize(right, SMALL_SIZE);
      page.drawText(right, {
        x: PAGE_W - MARGIN - BOX_PAD - w,
        y: rowY,
        size: SMALL_SIZE,
        font,
        color: colors.text,
      });
    }
    rowY -= lineHeight;
  }

  ctx.setY(boxY - SPACE_12);
}

/**
 * Totals box (invoice-style): right-aligned box with label/value rows, values right-aligned.
 */
export function drawTotalsBox(
  ctx: PdfContext,
  items: { label: string; value: string; bold?: boolean }[]
): void {
  if (items.length === 0) return;
  addPageIfNeeded(ctx, items.length * (LINE_SMALL + 4) + 2 * BOX_PAD + 4);
  const { page, font, bold, colors } = ctx;
  const lineHeight = LINE_SMALL + 4;
  const boxHeight = items.length * lineHeight + 2 * BOX_PAD;
  const boxWidth = 200;

  ctx.setY(ctx.y - boxHeight);
  const boxY = ctx.y;
  const boxLeft = PAGE_W - MARGIN - boxWidth;

  page.drawRectangle({
    x: boxLeft,
    y: boxY,
    width: boxWidth,
    height: boxHeight,
    color: colors.boxBg,
    borderColor: colors.boxBorder,
    borderWidth: 0.5,
  });

  let rowY = boxY + boxHeight - BOX_PAD - LINE_SMALL;
  for (let i = 0; i < items.length; i++) {
    const { label, value, bold: isBold } = items[i];
    const f = isBold ? bold : font;
    page.drawText(label, {
      x: boxLeft + BOX_PAD,
      y: rowY,
      size: SMALL_SIZE,
      font: f,
      color: colors.text,
    });
    const valueW = f.widthOfTextAtSize(value, SMALL_SIZE);
    page.drawText(value, {
      x: boxLeft + boxWidth - BOX_PAD - valueW,
      y: rowY,
      size: SMALL_SIZE,
      font: f,
      color: colors.text,
    });
    rowY -= lineHeight;
  }

  ctx.setY(boxY - SPACE_12);
}

/** Wrap a string to fit width (by character count approx); returns lines. */
function wrapToLines(font: PdfContext["font"], text: string, maxWidth: number, fontSize: number): string[] {
  const words = text.split(" ");
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

/**
 * Callout box: bordered box with title and body text (e.g. "How to use this pack").
 */
export function drawCalloutBox(
  ctx: PdfContext,
  title: string,
  bodyLines: string[] | string
): void {
  const maxBoxWidth = PAGE_W - 2 * MARGIN - 2 * BOX_PAD;
  const lines =
    typeof bodyLines === "string"
      ? wrapToLines(ctx.font, bodyLines, maxBoxWidth, SMALL_SIZE)
      : bodyLines;
  addPageIfNeeded(ctx, 60);
  const { page, font, bold, colors } = ctx;
  const lineHeight = LINE_SMALL + 2;
  const titleH = BODY_SIZE + 4;
  const bodyH = lines.length * lineHeight;
  const boxHeight = titleH + SPACE_8 + bodyH + 2 * BOX_PAD;

  ctx.setY(ctx.y - boxHeight);
  const boxY = ctx.y;
  const boxWidth = PAGE_W - 2 * MARGIN;

  page.drawRectangle({
    x: MARGIN,
    y: boxY,
    width: boxWidth,
    height: boxHeight,
    color: colors.boxBg,
    borderColor: colors.boxBorder,
    borderWidth: 0.5,
  });

  page.drawText(title, {
    x: MARGIN + BOX_PAD,
    y: boxY + boxHeight - BOX_PAD - BODY_SIZE,
    size: BODY_SIZE,
    font: bold,
    color: colors.text,
  });

  let textY = boxY + boxHeight - BOX_PAD - titleH - SPACE_8 - LINE_SMALL;
  for (const line of lines) {
    page.drawText(line, {
      x: MARGIN + BOX_PAD,
      y: textY,
      size: SMALL_SIZE,
      font,
      color: colors.muted,
    });
    textY -= lineHeight;
  }

  ctx.setY(boxY - SPACE_12);
}

/**
 * Section card: card-like container with title, optional subtitle, optional status line.
 * Light border, subtle background. Uses spacing scale for internal rhythm.
 */
export function drawSectionCard(
  ctx: PdfContext,
  opts: { title: string; subtitle?: string; statusLine?: string }
): void {
  addPageIfNeeded(ctx, 60);
  const { page, font, bold, colors } = ctx;
  const lineHeight = LINE_SMALL + 2;
  let cardHeight = H2_SIZE + SPACE_4;
  if (opts.subtitle) cardHeight += lineHeight + SPACE_4;
  if (opts.statusLine) cardHeight += lineHeight + SPACE_4;
  cardHeight += 2 * BOX_PAD;

  ctx.setY(ctx.y - cardHeight);
  const boxY = ctx.y;
  const margin = ctx.margin ?? MARGIN;
  const boxWidth = (ctx.pageWidth ?? PAGE_W) - 2 * margin;

  page.drawRectangle({
    x: margin,
    y: boxY,
    width: boxWidth,
    height: cardHeight,
    color: colors.boxBg,
    borderColor: colors.boxBorder,
    borderWidth: 0.5,
  });

  let y = boxY + cardHeight - BOX_PAD - H2_SIZE;
  page.drawText(opts.title, {
    x: margin + BOX_PAD,
    y,
    size: H2_SIZE,
    font: bold,
    color: colors.text,
  });
  y -= H2_SIZE + SPACE_4;

  if (opts.subtitle) {
    page.drawText(opts.subtitle, {
      x: margin + BOX_PAD,
      y,
      size: SMALL_SIZE,
      font,
      color: colors.muted,
    });
    y -= lineHeight + SPACE_4;
  }

  if (opts.statusLine) {
    page.drawText(opts.statusLine, {
      x: margin + BOX_PAD,
      y,
      size: SMALL_SIZE,
      font,
      color: colors.muted,
    });
  }

  ctx.setY(boxY - SPACE_12);
}

/**
 * Simple boxed info block (e.g. ZIP section: filename, SHA256).
 */
export function drawInfoBox(ctx: PdfContext, lines: string[]): void {
  if (lines.length === 0) return;
  addPageIfNeeded(ctx, lines.length * (LINE_SMALL + 4) + 2 * BOX_PAD);
  const { page, font, colors } = ctx;
  const margin = ctx.margin ?? MARGIN;
  const boxWidth = (ctx.pageWidth ?? PAGE_W) - 2 * margin;
  const lineHeight = LINE_SMALL + 4;
  const boxHeight = lines.length * lineHeight + 2 * BOX_PAD;

  ctx.setY(ctx.y - boxHeight);
  const boxY = ctx.y;

  page.drawRectangle({
    x: margin,
    y: boxY,
    width: boxWidth,
    height: boxHeight,
    color: colors.boxBg,
    borderColor: colors.boxBorder,
    borderWidth: 0.5,
  });

  let rowY = boxY + boxHeight - BOX_PAD - LINE_SMALL;
  for (const line of lines) {
    page.drawText(line, {
      x: margin + BOX_PAD,
      y: rowY,
      size: SMALL_SIZE,
      font,
      color: colors.text,
    });
    rowY -= lineHeight;
  }

  ctx.setY(boxY - SPACE_12);
}
