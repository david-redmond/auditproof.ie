import type { PDFDocument, PDFFont, PDFPage } from "pdf-lib";
import type { getColors } from "./tokens";

/**
 * Mutable context passed through PDF drawing functions.
 * Updated in place (page, y) as content is drawn.
 */
export interface PdfContext {
  pdf: PDFDocument;
  page: PDFPage;
  y: number;
  font: PDFFont;
  bold: PDFFont;
  colors: ReturnType<typeof getColors>;
  headerOpts: { orgName: string; versionLabel: string };
  setPage: (p: PDFPage) => void;
  setY: (val: number) => void;
}
