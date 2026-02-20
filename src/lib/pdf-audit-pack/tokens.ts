import { rgb, RGB } from "pdf-lib";

/**
 * Design tokens for the GDPR Audit Pack PDF (Go Solutions Ireland).
 * Professional compliance report: balanced layout, modern typography, clear hierarchy.
 *
 * Branding: To change accent colour, edit getColors().accent and any tint derived from it.
 * Fonts: pdf-lib uses embedded fonts; Inter/Source Sans require .ttf/.otf in public/fonts
 * and embedding via pdf.embedFont(readFileSync('...')). StandardFonts.Helvetica used as fallback.
 */

/** A4 portrait (ISO 216): 595.28 × 841.89 pt */
export const PAGE_W = 595.28;
export const PAGE_H = 841.89;

/** A4 landscape: width × height in pt */
export const PAGE_W_LANDSCAPE = 841.89;
export const PAGE_H_LANDSCAPE = 595.28;

/** Portrait: minimum 18mm margin (18 * 2.83465 ≈ 51 pt) */
export const MARGIN = 51;
/** Table pages: 20–25mm margin for printable audit doc (≈ 60 pt ≈ 21mm) */
export const MARGIN_TABLE = 60;
export const HEADER_H = 40;
export const FOOTER_H = 28;
export const CONTENT_TOP = PAGE_H - MARGIN - HEADER_H - 12;
export const CONTENT_BOTTOM = MARGIN + FOOTER_H + 12;

/**
 * Spacing scale (vertical rhythm). Use only these values; no ad-hoc spacing.
 * 4 / 8 / 12 / 16 / 24 / 32 pt.
 */
export const SPACE_4 = 4;
export const SPACE_6 = 6;
export const SPACE_8 = 8;
export const SPACE_12 = 12;
export const SPACE_16 = 16;
export const SPACE_24 = 24;
export const SPACE_32 = 32;
export const SPACE_20 = 20;

export const LINE = 14;
export const LINE_SMALL = 11;
export const SECTION_GAP = 20;
export const PARAGRAPH_MAX_WIDTH = PAGE_W - 2 * MARGIN;

/** Section rhythm: consistent spacing between H2, subtitle, metrics, guidance, table */
export const SPACE_AFTER_SECTION_TITLE = SPACE_12;
export const SPACE_AFTER_SUBTITLE = SPACE_8;
export const SPACE_AFTER_METRIC_ROW = SPACE_12;
export const SPACE_BEFORE_TABLE = SPACE_24;
export const SPACE_AFTER_CARD = SPACE_16;
/** Line height for guidance paragraphs (72h notice, callouts) */
export const GUIDANCE_LINE_HEIGHT = 1.35;

/** Typography: Title 22–26pt, Section 14–16pt, Body 10.5–11pt, Tables 9.5–10pt */
export const TITLE_SIZE = 24;
export const COVER_TITLE_SIZE = 24;
export const SUBTITLE_SIZE = 12;
export const SECTION_TITLE_SIZE = 15;
export const H2_SIZE = 15;
export const BODY_SIZE = 10.5;
export const TABLE_HEADER_SIZE = 9.5;
export const TABLE_CELL_SIZE = 9.5;
export const SMALL_SIZE = 9.5;
export const FOOTER_SIZE = 8;

/** Line height: body 1.25–1.35, tables 1.15 */
export const LINE_HEIGHT_BODY = 1.3;
export const LINE_HEIGHT_TABLE = 1.15;
export const BODY_LINE = BODY_SIZE * LINE_HEIGHT_BODY;
export const TABLE_LINE = TABLE_CELL_SIZE * LINE_HEIGHT_TABLE;

/** Table: row padding (baseline); variable row height when wrapping */
export const TABLE_ROW_HEIGHT = 20;
/** Cell padding: 12pt horizontal, 10pt vertical for enterprise audit layout */
export const TABLE_CELL_PAD_H = 12;
export const TABLE_CELL_PAD_V = 10;
export const TABLE_CELL_PAD = 12;

/** Cards: subtle rounded corners */
export const BOX_PAD = 12;
export const BOX_RADIUS = 3;

/** 12-column grid: column width = (PAGE_W - 2*MARGIN) / 12 */
export const GRID_COLUMNS = 12;
export const GRID_COL_WIDTH = (PAGE_W - 2 * MARGIN) / GRID_COLUMNS;

export interface PdfColors {
  text: RGB;
  muted: RGB;
  divider: RGB;
  tableHeaderBg: RGB;
  tableZebra: RGB;
  boxBorder: RGB;
  boxBg: RGB;
  footerMuted: RGB;
  /** Single accent (e.g. Go Solutions blue); use for badges, key numbers */
  accent: RGB;
  /** Subtle tint for callouts / highlighted rows */
  accentTint: RGB;
  /** Overdue / risk highlight */
  risk: RGB;
  /** Resolved / success (e.g. Closed) */
  success: RGB;
}

/**
 * Colours: one accent (blue), neutral greys, subtle tints.
 * Change accent for branding (e.g. Go Solutions brand blue).
 */
export function getColors(): PdfColors {
  return {
    text: rgb(0.1, 0.12, 0.18),
    muted: rgb(0.4, 0.45, 0.55),
    divider: rgb(0.88, 0.9, 0.92),
    tableHeaderBg: rgb(0.94, 0.95, 0.97),
    tableZebra: rgb(0.98, 0.98, 0.99),
    boxBorder: rgb(0.82, 0.85, 0.9),
    boxBg: rgb(0.98, 0.985, 0.99),
    footerMuted: rgb(0.45, 0.5, 0.58),
    accent: rgb(0.2, 0.4, 0.7),
    accentTint: rgb(0.93, 0.95, 0.99),
    risk: rgb(0.7, 0.35, 0.2),
    success: rgb(0.2, 0.55, 0.4),
  };
}
