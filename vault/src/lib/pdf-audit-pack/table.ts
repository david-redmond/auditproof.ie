import type { PDFFont } from "pdf-lib";
import type { PdfContext } from "./types";
import {
  PAGE_W,
  MARGIN,
  TABLE_HEADER_SIZE,
  TABLE_CELL_SIZE,
  TABLE_CELL_PAD_H,
  TABLE_CELL_PAD_V,
  TABLE_LINE,
} from "./tokens";
import { addPageIfNeeded } from "./layout";

function getTableBounds(ctx: PdfContext) {
  const left = ctx.margin ?? MARGIN;
  const width = (ctx.pageWidth ?? PAGE_W) - 2 * left;
  return { left, width };
}

/** Minimum row height when no wrapping */
const TABLE_ROW_HEIGHT_MIN = 20;

/**
 * Wrap text to fit width at given font size. Returns array of lines (no truncation).
 */
export function wrapCellLines(
  font: PDFFont,
  str: string,
  maxW: number,
  fontSize: number = TABLE_CELL_SIZE
): string[] {
  const s = String(str ?? "").trim() || "—";
  if (s.length === 0) return ["—"];
  const words = s.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(test, fontSize) <= maxW) {
      line = test;
    } else {
      if (line) lines.push(line);
      line = font.widthOfTextAtSize(word, fontSize) <= maxW ? word : word;
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : ["—"];
}

/**
 * Truncate string to fit width (legacy / fallback). Prefer wrapCellLines for tables.
 */
export function truncateCell(
  font: PDFFont,
  str: string,
  maxW: number,
  fontSize: number = TABLE_CELL_SIZE
): string {
  const s = String(str ?? "").trim() || "—";
  if (font.widthOfTextAtSize(s, fontSize) <= maxW) return s;
  let t = s;
  while (t.length && font.widthOfTextAtSize(t + "…", fontSize) > maxW) t = t.slice(0, -1);
  return t ? t + "…" : "…";
}

/** Compute height for a cell with given number of lines */
function cellHeight(lines: number, fontSize: number, padV: number): number {
  if (lines <= 0) return TABLE_ROW_HEIGHT_MIN;
  return Math.max(TABLE_ROW_HEIGHT_MIN, lines * TABLE_LINE + 2 * padV);
}

/** Draw a single header cell with optional multi-line text */
function drawHeaderCell(
  ctx: PdfContext,
  x: number,
  y: number,
  width: number,
  lines: string[],
  rowHeight: number
): void {
  const { page, bold, colors } = ctx;
  const padV = TABLE_CELL_PAD_V;
  let lineY = y - padV - TABLE_HEADER_SIZE;
  for (let i = 0; i < lines.length; i++) {
    page.drawText(lines[i], {
      x: x + TABLE_CELL_PAD_H,
      y: lineY,
      size: TABLE_HEADER_SIZE,
      font: bold,
      color: colors.text,
    });
    lineY -= TABLE_LINE;
  }
}

/** Draw header row with full labels (wrapped); return height used */
function drawTableHeaderRow(
  ctx: PdfContext,
  headers: string[],
  colWidths: number[],
  headerLines: string[][],
  headerRowHeight: number
): void {
  const { page, colors } = ctx;
  const { left: tableLeft, width: tableWidth } = getTableBounds(ctx);
  const topY = ctx.y;
  const bottomY = ctx.y - headerRowHeight;
  page.drawRectangle({
    x: tableLeft,
    y: bottomY,
    width: tableWidth,
    height: headerRowHeight,
    color: colors.tableHeaderBg,
  });
  page.drawLine({
    start: { x: tableLeft, y: topY },
    end: { x: tableLeft + tableWidth, y: topY },
    thickness: 0.5,
    color: colors.divider,
  });
  let x = tableLeft;
  for (let i = 0; i < headers.length; i++) {
    const w = colWidths[i];
    const lines = headerLines[i];
    drawHeaderCell(ctx, x, topY, w, lines, headerRowHeight);
    x += w;
  }
  page.drawLine({
    start: { x: tableLeft, y: bottomY },
    end: { x: tableLeft + tableWidth, y: bottomY },
    thickness: 0.5,
    color: colors.divider,
  });
  ctx.setY(bottomY);
}

/** Draw one body cell (multi-line) */
function drawBodyCell(
  ctx: PdfContext,
  x: number,
  topY: number,
  width: number,
  lines: string[],
  rowHeight: number,
  isBold?: boolean
): void {
  const { page, font, bold, colors } = ctx;
  const f = isBold ? bold : font;
  const padV = TABLE_CELL_PAD_V;
  let lineY = topY - padV - TABLE_CELL_SIZE;
  for (let i = 0; i < lines.length; i++) {
    page.drawText(lines[i], {
      x: x + TABLE_CELL_PAD_H,
      y: lineY,
      size: TABLE_CELL_SIZE,
      font: f,
      color: colors.text,
    });
    lineY -= TABLE_LINE;
  }
}

/**
 * Draw a styled table: full header labels (wrapped), body cells wrapped, no truncation.
 * Zebra striping, optional row highlight (e.g. overdue). Repeats header on page break.
 */
export function drawStyledTable(
  ctx: PdfContext,
  opts: {
    headers: string[];
    colWidths: number[];
    rows: string[][];
    zebraStriping?: boolean;
    /** When rows are empty, show one styled row with this message (first column). */
    emptyMessage?: string;
    /** Per-row: true = highlight (e.g. overdue) with left border or tint */
    highlightRow?: (rowIndex: number) => boolean;
  }
): void {
  const { page, font, colors } = ctx;
  const { left: tableLeft, width: tableWidth } = getTableBounds(ctx);
  let { headers, colWidths, rows, zebraStriping = true, highlightRow } = opts;
  if (rows.length === 0 && opts.emptyMessage) {
    const emptyRow = Array(headers.length).fill("—");
    emptyRow[0] = opts.emptyMessage;
    rows = [emptyRow];
  }

  // Precompute wrapped header lines and header row height
  const headerLines: string[][] = [];
  let headerRowHeight = TABLE_ROW_HEIGHT_MIN;
  for (let i = 0; i < headers.length; i++) {
    const w = colWidths[i] - 2 * TABLE_CELL_PAD_H;
    const lines = wrapCellLines(ctx.bold, headers[i], w, TABLE_HEADER_SIZE);
    headerLines.push(lines);
    headerRowHeight = Math.max(headerRowHeight, cellHeight(lines.length, TABLE_HEADER_SIZE, TABLE_CELL_PAD_V));
  }

  // Precompute wrapped body cells and row heights
  const rowCellLines: string[][][] = [];
  const rowHeights: number[] = [];
  for (let r = 0; r < rows.length; r++) {
    const cells = rows[r];
    const cellLines: string[][] = [];
    let rh = TABLE_ROW_HEIGHT_MIN;
    for (let c = 0; c < cells.length; c++) {
      const w = colWidths[c] - 2 * TABLE_CELL_PAD_H;
      const lines = wrapCellLines(font, cells[c], w, TABLE_CELL_SIZE);
      cellLines.push(lines);
      rh = Math.max(rh, cellHeight(lines.length, TABLE_CELL_SIZE, TABLE_CELL_PAD_V));
    }
    rowCellLines.push(cellLines);
    rowHeights.push(rh);
  }

  const redrawHeader = () =>
    drawTableHeaderRow(ctx, headers, colWidths, headerLines, headerRowHeight);

  addPageIfNeeded(ctx, headerRowHeight);
  redrawHeader();

  for (let i = 0; i < rows.length; i++) {
    const rowHeight = rowHeights[i];
    addPageIfNeeded(ctx, rowHeight, redrawHeader);
    const rowY = ctx.y;

    if (highlightRow?.(i)) {
      page.drawRectangle({
        x: tableLeft,
        y: rowY - rowHeight,
        width: tableWidth,
        height: rowHeight,
        color: colors.accentTint,
      });
      page.drawRectangle({
        x: tableLeft,
        y: rowY - rowHeight,
        width: 4,
        height: rowHeight,
        color: colors.risk,
      });
    } else if (zebraStriping && i % 2 === 1) {
      page.drawRectangle({
        x: tableLeft,
        y: rowY - rowHeight,
        width: tableWidth,
        height: rowHeight,
        color: colors.tableZebra,
      });
    }

    let x = tableLeft;
    const cellLines = rowCellLines[i];
    for (let j = 0; j < cellLines.length; j++) {
      drawBodyCell(ctx, x, rowY, colWidths[j], cellLines[j], rowHeight);
      x += colWidths[j];
    }
    ctx.setY(ctx.y - rowHeight);
  }
}

/**
 * Two-row pattern for wide tables (e.g. DSR): each logical record = row 1 (primary) + row 2 (operational).
 * Row 1: Received | Type | Who | Reply By | Status
 * Row 2: ID? | Sent? | Extension | Note (cols 1–4; col 5 empty for alignment)
 * Uses same column widths for both rows; prevents horizontal compression and overflow.
 */
export function drawStyledTableTwoRow(
  ctx: PdfContext,
  opts: {
    headersRow1: string[];
    headersRow2: string[];
    colWidths: number[];
    rows: { row1: string[]; row2: string[] }[];
    emptyMessage?: string;
    highlightRecord?: (recordIndex: number) => boolean;
  }
): void {
  const { page, font, colors } = ctx;
  const { left: tableLeft, width: tableWidth } = getTableBounds(ctx);
  let { headersRow1, headersRow2, colWidths, rows, highlightRecord } = opts;
  if (rows.length === 0 && opts.emptyMessage) {
    rows = [
      {
        row1: [opts.emptyMessage, "—", "—", "—", "—"],
        row2: ["—", "—", "—", "—"],
      },
    ];
  }

  const padH = TABLE_CELL_PAD_H;
  const padV = TABLE_CELL_PAD_V;

  // Header row 1 (5 cols)
  const h1Lines: string[][] = [];
  let h1Height = TABLE_ROW_HEIGHT_MIN;
  for (let i = 0; i < headersRow1.length; i++) {
    const w = colWidths[i] - 2 * padH;
    const lines = wrapCellLines(ctx.bold, headersRow1[i], w, TABLE_HEADER_SIZE);
    h1Lines.push(lines);
    h1Height = Math.max(h1Height, cellHeight(lines.length, TABLE_HEADER_SIZE, padV));
  }
  // Header row 2 (4 cols)
  const h2Lines: string[][] = [];
  let h2Height = TABLE_ROW_HEIGHT_MIN;
  for (let i = 0; i < headersRow2.length; i++) {
    const w = colWidths[i] - 2 * padH;
    const lines = wrapCellLines(ctx.bold, headersRow2[i], w, TABLE_HEADER_SIZE);
    h2Lines.push(lines);
    h2Height = Math.max(h2Height, cellHeight(lines.length, TABLE_HEADER_SIZE, padV));
  }
  const totalHeaderHeight = h1Height + h2Height;

  function drawTwoRowHeader() {
    const topY = ctx.y;
    ctx.setY(ctx.y - totalHeaderHeight);
    const bottomY = ctx.y;
    page.drawRectangle({
      x: tableLeft,
      y: bottomY,
      width: tableWidth,
      height: totalHeaderHeight,
      color: colors.tableHeaderBg,
    });
    page.drawLine({
      start: { x: tableLeft, y: topY },
      end: { x: tableLeft + tableWidth, y: topY },
      thickness: 0.5,
      color: colors.divider,
    });
    let x = tableLeft;
    for (let i = 0; i < headersRow1.length; i++) {
      drawHeaderCell(ctx, x, topY, colWidths[i], h1Lines[i], h1Height);
      x += colWidths[i];
    }
    const row2Y = topY - h1Height;
    page.drawLine({
      start: { x: tableLeft, y: row2Y },
      end: { x: tableLeft + tableWidth, y: row2Y },
      thickness: 0.5,
      color: colors.divider,
    });
    x = tableLeft;
    for (let i = 0; i < headersRow2.length; i++) {
      drawHeaderCell(ctx, x, row2Y, colWidths[i], h2Lines[i], h2Height);
      x += colWidths[i];
    }
    page.drawLine({
      start: { x: tableLeft, y: bottomY },
      end: { x: tableLeft + tableWidth, y: bottomY },
      thickness: 0.5,
      color: colors.divider,
    });
  }

  addPageIfNeeded(ctx, totalHeaderHeight, drawTwoRowHeader);
  drawTwoRowHeader();

  for (let recIdx = 0; recIdx < rows.length; recIdx++) {
    const r1 = rows[recIdx].row1;
    const r2 = rows[recIdx].row2;
    const r1CellLines: string[][] = [];
    let r1Height = TABLE_ROW_HEIGHT_MIN;
    for (let c = 0; c < r1.length; c++) {
      const w = colWidths[c] - 2 * padH;
      const lines = wrapCellLines(font, r1[c], w, TABLE_CELL_SIZE);
      r1CellLines.push(lines);
      r1Height = Math.max(r1Height, cellHeight(lines.length, TABLE_CELL_SIZE, padV));
    }
    const r2CellLines: string[][] = [];
    let r2Height = TABLE_ROW_HEIGHT_MIN;
    for (let c = 0; c < r2.length; c++) {
      const w = colWidths[c] - 2 * padH;
      const lines = wrapCellLines(font, r2[c], w, TABLE_CELL_SIZE);
      r2CellLines.push(lines);
      r2Height = Math.max(r2Height, cellHeight(lines.length, TABLE_CELL_SIZE, padV));
    }
    const recordHeight = r1Height + r2Height;

    addPageIfNeeded(ctx, recordHeight, drawTwoRowHeader);
    const rowY = ctx.y;

    if (highlightRecord?.(recIdx)) {
      page.drawRectangle({
        x: tableLeft,
        y: rowY - recordHeight,
        width: tableWidth,
        height: recordHeight,
        color: colors.accentTint,
      });
      page.drawRectangle({
        x: tableLeft,
        y: rowY - recordHeight,
        width: 4,
        height: recordHeight,
        color: colors.risk,
      });
    } else if (recIdx % 2 === 1) {
      page.drawRectangle({
        x: tableLeft,
        y: rowY - recordHeight,
        width: tableWidth,
        height: recordHeight,
        color: colors.tableZebra,
      });
    }

    let x = tableLeft;
    for (let j = 0; j < r1.length; j++) {
      drawBodyCell(ctx, x, rowY, colWidths[j], r1CellLines[j], r1Height);
      x += colWidths[j];
    }
    const row2Y = rowY - r1Height;
    page.drawLine({
      start: { x: tableLeft, y: row2Y },
      end: { x: tableLeft + tableWidth, y: row2Y },
      thickness: 0.5,
      color: colors.divider,
    });
    x = tableLeft;
    for (let j = 0; j < r2.length; j++) {
      drawBodyCell(ctx, x, row2Y, colWidths[j], r2CellLines[j], r2Height);
      x += colWidths[j];
    }
    page.drawLine({
      start: { x: tableLeft, y: rowY - recordHeight },
      end: { x: tableLeft + tableWidth, y: rowY - recordHeight },
      thickness: 0.5,
      color: colors.divider,
    });
    ctx.setY(ctx.y - recordHeight);
  }
}
