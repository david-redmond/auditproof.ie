import type { PDFDocument, PDFFont, PDFPage } from "pdf-lib";
import type { getColors } from "./tokens";

/**
 * Mutable context passed through PDF drawing functions.
 * Updated in place (page, y) as content is drawn.
 * When on a landscape table page, pageWidth/pageHeight/margin reflect landscape dimensions.
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
  /** Current page width (portrait or landscape); used by table and addPageIfNeeded */
  pageWidth: number;
  /** Current page height */
  pageHeight: number;
  /** Current margin (portrait or table margin) */
  margin: number;
  /** When true, addPageIfNeeded adds a landscape page for table continuation */
  nextPageLandscape?: boolean;
}
