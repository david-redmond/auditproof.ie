import { rgb } from "pdf-lib";

/**
 * Central styling tokens for the GDPR Audit Pack PDF.
 * Invoice-style: strong header, boxed metadata, clear tables, totals.
 * A4, consistent vertical rhythm (8/12/16).
 */
export const PAGE_W = 612;
export const PAGE_H = 792;
export const MARGIN = 50;
export const HEADER_H = 36;
export const FOOTER_H = 24;
export const CONTENT_TOP = PAGE_H - MARGIN - HEADER_H - 12;
export const CONTENT_BOTTOM = MARGIN + FOOTER_H + 12;

/** Vertical rhythm (invoice-style) */
export const SPACE_8 = 8;
export const SPACE_12 = 12;
export const SPACE_16 = 16;
export const LINE = 14;
export const LINE_SMALL = 11;
export const SECTION_GAP = 20;
export const PARAGRAPH_MAX_WIDTH = PAGE_W - 2 * MARGIN;

/** Typography: H1, H2, body, small, table */
export const H1_SIZE = 22;
export const H2_SIZE = 16;
export const COVER_TITLE_SIZE = 22;
export const SECTION_TITLE_SIZE = 16;
export const BODY_SIZE = 11;
export const TABLE_HEADER_SIZE = 10;
export const TABLE_CELL_SIZE = 10;
export const SMALL_SIZE = 9;
export const FOOTER_SIZE = 7;

/** Row height for tables */
export const TABLE_ROW_HEIGHT = 20;
export const TABLE_CELL_PAD = 6;

/** Box padding (meta grid, callout, section card, totals) */
export const BOX_PAD = 12;
export const BOX_RADIUS = 0;

/** Colours (calm, professional, invoice-like) */
export function getColors() {
  return {
    text: rgb(0.1, 0.12, 0.18),
    muted: rgb(0.4, 0.45, 0.55),
    divider: rgb(0.88, 0.9, 0.92),
    tableHeaderBg: rgb(0.94, 0.95, 0.97),
    tableZebra: rgb(0.98, 0.98, 0.99),
    boxBorder: rgb(0.82, 0.85, 0.9),
    boxBg: rgb(0.98, 0.985, 0.99),
    footerMuted: rgb(0.45, 0.5, 0.58),
  };
}
