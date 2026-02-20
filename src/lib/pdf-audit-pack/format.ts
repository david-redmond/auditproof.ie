/**
 * Consistent date/time formatting for the audit pack PDF.
 * Dates in tables: "08 Feb 2026"
 * Timestamps (e.g. generated): "08 Feb 2026 14:03"
 */

const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "short",
  year: "numeric",
};

const DATE_TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};

/** Format for use in tables and short labels: 08 Feb 2026 */
export function formatDate(date: Date | string | number | null | undefined): string {
  if (date == null) return "—";
  const d = typeof date === "object" && "getTime" in date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", DATE_OPTIONS);
}

/** Format for generated timestamp in header/footer: 08 Feb 2026 14:03 */
export function formatDateTime(date: Date | string | number | null | undefined): string {
  if (date == null) return "—";
  const d = typeof date === "object" && "getTime" in date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", DATE_TIME_OPTIONS);
}
