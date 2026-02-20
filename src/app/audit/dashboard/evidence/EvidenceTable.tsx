"use client";

import { useEffect, useMemo, useState } from "react";
import listStyles from "../list.module.css";
import { EvidenceUpload } from "./EvidenceUpload";

export type EvidenceRow = {
  _id: unknown;
  type: string;
  title: string;
  uploadedAt?: string | null;
  reviewDueAt?: string | null;
  tags?: string[];
  storage?: { key?: string } | null;
};

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

/** Start of today in ms (UTC date only for comparison with stored dates). */
function startOfTodayMs(now: number): number {
  const d = new Date(now);
  d.setUTCHours(0, 0, 0, 0);
  return d.getTime();
}

function getReviewBadge(
  reviewDueAt: string | null | undefined,
  now: number
): { label: string; className: string } | null {
  if (!reviewDueAt) return null;
  const due = new Date(reviewDueAt).getTime();
  const startToday = startOfTodayMs(now);
  if (due < startToday) return { label: "Overdue", className: listStyles.badgeOverdue };
  if (due - now <= THIRTY_DAYS_MS) return { label: "Review due", className: listStyles.badgeReviewDue };
  return { label: "Up to date", className: listStyles.badgeUpToDate };
}

type Props = {
  list: EvidenceRow[];
  typeLabels: Record<string, string>;
  canEdit?: boolean;
};

export function EvidenceTable({ list, typeLabels, canEdit = true }: Props) {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [reviewFilter, setReviewFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(t);
  }, []);

  const filtered = useMemo(() => {
    return list.filter((doc) => {
      if (typeFilter !== "all" && doc.type !== typeFilter) return false;
      if (reviewFilter !== "all") {
        const due = doc.reviewDueAt ? new Date(doc.reviewDueAt).getTime() : null;
        const startToday = startOfTodayMs(now);
        if (reviewFilter === "review_due") {
          if (!due) return false;
          if (due >= startToday && due - now > THIRTY_DAYS_MS) return false;
        } else if (reviewFilter === "up_to_date") {
          if (!due || due < startToday || due - now <= THIRTY_DAYS_MS) return false;
        }
      }
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const title = (doc.title ?? "").toLowerCase();
        const tagsStr = (doc.tags ?? []).join(" ").toLowerCase();
        if (!title.includes(q) && !tagsStr.includes(q)) return false;
      }
      return true;
    });
  }, [list, typeFilter, reviewFilter, searchQuery, now]);

  const uniqueTypes = useMemo(() => {
    const set = new Set(list.map((d) => d.type));
    return Array.from(set).sort();
  }, [list]);

  return (
    <>
      <section
        className={`${listStyles.panel} ${listStyles.filtersSummaryPanel}`}
        aria-labelledby="evidence-filters-heading"
      >
        <h2 id="evidence-filters-heading" className={listStyles.summaryHeading}>
          Search & filters
        </h2>
        <div className={listStyles.searchAndFiltersWrap}>
          <div className={`${listStyles.searchAndFilters} ${listStyles.searchAndFiltersGrid3}`}>
            <div className={listStyles.filterGroup}>
              <label htmlFor="evidence-type-filter">Document type</label>
              <select
                id="evidence-type-filter"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                aria-label="Filter by document type"
              >
                <option value="all">All</option>
                {uniqueTypes.map((t) => (
                  <option key={t} value={t}>
                    {typeLabels[t] ?? t}
                  </option>
                ))}
              </select>
            </div>
            <div className={listStyles.filterGroup}>
              <label htmlFor="evidence-review-filter">Review status</label>
              <select
                id="evidence-review-filter"
                value={reviewFilter}
                onChange={(e) => setReviewFilter(e.target.value)}
                aria-label="Filter by review status"
              >
                <option value="all">All</option>
                <option value="review_due">Review due</option>
                <option value="up_to_date">Up to date</option>
              </select>
            </div>
            <div className={listStyles.searchWrap}>
              <label htmlFor="evidence-search" className={listStyles.searchLabel}>
                Search documents
              </label>
              <input
                id="evidence-search"
                type="search"
                className={listStyles.filterSearch}
                placeholder="e.g. privacy policy, contract"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search documents"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        className={`${listStyles.panel} ${listStyles.tablePanel}`}
        aria-labelledby="evidence-table-caption"
      >
        <div className={listStyles.tableHeaderRow}>
          <h2 id="evidence-table-caption" className={listStyles.tableCaption}>
            Your documents
          </h2>
          {canEdit && <EvidenceUpload initialOpen={false} variant="secondary" />}
        </div>
        <div className={listStyles.tableWrap}>
          <table className={listStyles.table} aria-labelledby="evidence-table-caption">
            <thead>
              <tr>
                <th scope="col">What this is</th>
                <th scope="col">Title</th>
                <th scope="col">Added on</th>
                <th scope="col">Review by</th>
                <th scope="col">Review status</th>
                <th scope="col">Tags</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ color: "var(--theme-text-muted)", padding: "var(--theme-space-6)" }}>
                    {list.length === 0 ? "No documents yet." : "No documents match your filters."}
                  </td>
                </tr>
              )}
              {filtered.map((doc) => {
                const badge = getReviewBadge(doc.reviewDueAt, now);
                const tagsDisplay = (doc.tags ?? []).length > 0
                  ? (doc.tags ?? []).join(", ")
                  : null;
                return (
                  <tr key={String(doc._id)}>
                    <td>
                      <span className={listStyles.categoryPill}>
                        {typeLabels[doc.type] ?? doc.type}
                      </span>
                    </td>
                    <td>{doc.title}</td>
                    <td>{doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : "—"}</td>
                    <td>
                      {doc.reviewDueAt ? new Date(doc.reviewDueAt).toLocaleDateString() : "—"}
                    </td>
                    <td>
                      {badge ? (
                        <span className={badge.className}>{badge.label}</span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      {tagsDisplay !== null ? (
                        tagsDisplay
                      ) : (
                        <span className={listStyles.muted}>No tags</span>
                      )}
                    </td>
                    <td>
                      <span className={listStyles.muted}>
                        {doc.storage?.key ? "Stored" : "—"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
