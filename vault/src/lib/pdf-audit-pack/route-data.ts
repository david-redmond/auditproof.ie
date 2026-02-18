/**
 * Shared types for PDF audit pack data (used by cover, executive summary, route).
 * No DB schema changes; these mirror the pack includes and counts.
 */
export interface AuditPackIncludes {
  ropa: boolean;
  dsrs: boolean;
  incidents: boolean;
  evidenceIndex: boolean;
  evidenceFiles: boolean;
}
