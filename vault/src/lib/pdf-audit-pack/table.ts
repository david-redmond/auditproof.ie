import type { PDFFont } from "pdf-lib";
import type { PdfContext } from "./types";
import {
  MARGIN,
  PAGE_W,
  TABLE_ROW_HEIGHT,
  TABLE_HEADER_SIZE,
  TABLE_CELL_SIZE,
  TABLE_CELL_PAD,
} from "./tokens";
import { addPageIfNeeded } from "./layout";

const tableLeft = MARGIN;
const tableWidth = PAGE_W - 2 * MARGIN;

/**
 * Truncate string to fit width at given font size.
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

/** Draw only the table header row (used for first page and when continuing on a new page). */
function drawTableHeaderRow(
  ctx: PdfContext,
  headers: string[],
  colWidths: number[]
): void {
  const { page, font, bold, colors } = ctx;
  const headerY = ctx.y;
  page.drawRectangle({
    x: tableLeft,
    y: headerY - TABLE_ROW_HEIGHT,
    width: tableWidth,
    height: TABLE_ROW_HEIGHT,
    color: colors.tableHeaderBg,
  });
  page.drawLine({
    start: { x: tableLeft, y: headerY },
    end: { x: tableLeft + tableWidth, y: headerY },
    thickness: 0.5,
    color: colors.divider,
  });
  let x = tableLeft;
  for (let i = 0; i < headers.length; i++) {
    page.drawText(truncateCell(bold, headers[i], colWidths[i] - TABLE_CELL_PAD, TABLE_HEADER_SIZE), {
      x: x + TABLE_CELL_PAD,
      y: headerY - TABLE_ROW_HEIGHT + (TABLE_ROW_HEIGHT - TABLE_HEADER_SIZE) / 2 - 2,
      size: TABLE_HEADER_SIZE,
      font: bold,
      color: colors.text,
    });
    x += colWidths[i];
  }
  page.drawLine({
    start: { x: tableLeft, y: headerY - TABLE_ROW_HEIGHT },
    end: { x: tableLeft + tableWidth, y: headerY - TABLE_ROW_HEIGHT },
    thickness: 0.5,
    color: colors.divider,
  });
  ctx.setY(ctx.y - TABLE_ROW_HEIGHT);
}

/**
 * Draw a styled table: header with light background, rows with optional zebra striping.
 * On page break, redraws table header for continuity.
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
  }
): void {
  const { page, font, colors } = ctx;
  let { headers, colWidths, rows, zebraStriping = true } = opts;
  if (rows.length === 0 && opts.emptyMessage) {
    const emptyRow = Array(headers.length).fill("—");
    emptyRow[0] = opts.emptyMessage;
    rows = [emptyRow];
  }

  addPageIfNeeded(ctx, TABLE_ROW_HEIGHT);
  drawTableHeaderRow(ctx, headers, colWidths);

  const redrawHeader = () => drawTableHeaderRow(ctx, headers, colWidths);
  for (let i = 0; i < rows.length; i++) {
    addPageIfNeeded(ctx, TABLE_ROW_HEIGHT, redrawHeader);
    const rowY = ctx.y;
    if (zebraStriping && i % 2 === 1) {
      page.drawRectangle({
        x: tableLeft,
        y: rowY - TABLE_ROW_HEIGHT,
        width: tableWidth,
        height: TABLE_ROW_HEIGHT,
        color: colors.tableZebra,
      });
    }
    let x = tableLeft;
    const cells = rows[i];
    for (let j = 0; j < cells.length; j++) {
      const cell = truncateCell(font, cells[j], colWidths[j] - TABLE_CELL_PAD, TABLE_CELL_SIZE);
      page.drawText(cell, {
        x: x + TABLE_CELL_PAD,
        y: rowY - TABLE_ROW_HEIGHT + (TABLE_ROW_HEIGHT - TABLE_CELL_SIZE) / 2 - 2,
        size: TABLE_CELL_SIZE,
        font,
        color: colors.text,
      });
      x += colWidths[j];
    }
    page.drawLine({
      start: { x: tableLeft, y: rowY - TABLE_ROW_HEIGHT },
      end: { x: tableLeft + tableWidth, y: rowY - TABLE_ROW_HEIGHT },
      thickness: 0.5,
      color: colors.divider,
    });
    ctx.setY(ctx.y - TABLE_ROW_HEIGHT);
  }
}
