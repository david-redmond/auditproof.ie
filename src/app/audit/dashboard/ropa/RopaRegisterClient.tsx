"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

import { auditPath } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import { RopaFilters } from "./RopaFilters";
import { DeleteRopaButton } from "./DeleteRopaButton";
import listStyles from "../list.module.css";

export type RopaRecordRow = {
  id: string;
  name: string;
  purpose: string;
  lawfulBasis: string;
  retentionPeriod: string;
  processorsCount: number;
  lastReviewedAt: string | null;
  status: "active" | "inactive";
  internationalTransfers: boolean;
};

type CompletenessStatus = "complete" | "missing_retention" | "missing_suppliers" | "not_reviewed";

function getCompleteness(r: RopaRecordRow): CompletenessStatus {
  if (!r.lastReviewedAt) return "not_reviewed";
  if (!r.retentionPeriod?.trim()) return "missing_retention";
  if (r.processorsCount === 0) return "missing_suppliers";
  return "complete";
}

function getQueryLengthBucket(len: number): string {
  if (len <= 3) return "1-3";
  if (len <= 10) return "4-10";
  return "10+";
}

const DEBOUNCE_MS = 250;

type Props = {
  initialList: RopaRecordRow[];
  lawfulBasisLabel: Record<string, string>;
  canEdit: boolean;
};

export function RopaRegisterClient({ initialList, lawfulBasisLabel, canEdit }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const summaryViewedRef = useRef(false);
  const emptyStateViewedRef = useRef(false);
  const searchTrackedRef = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const filteredList = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return initialList;
    return initialList.filter(
      (r) =>
        r.name.toLowerCase().includes(q) || (r.purpose && r.purpose.toLowerCase().includes(q))
    );
  }, [initialList, debouncedQuery]);

  const summary = useMemo(() => {
    const total = filteredList.length;
    const needReview = filteredList.filter((r) => !r.lastReviewedAt).length;
    const highRiskTransfers = filteredList.filter((r) => r.internationalTransfers).length;
    return { total, needReview, highRiskTransfers };
  }, [filteredList]);

  useEffect(() => {
    if (summaryViewedRef.current) return;
    summaryViewedRef.current = true;
    trackEvent("ropa_summary_view", { page: "register" });
  }, []);

  useEffect(() => {
    if (filteredList.length > 0) return;
    if (emptyStateViewedRef.current) return;
    emptyStateViewedRef.current = true;
    trackEvent("ropa_empty_state_view", { page: "register" });
  }, [filteredList.length]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setSearchQuery(v);
      if (v.trim() && !searchTrackedRef.current) {
        searchTrackedRef.current = true;
        trackEvent("ropa_search_used", {
          query_length_bucket: getQueryLengthBucket(v.trim().length),
        });
      }
    },
    []
  );

  const isEmpty = filteredList.length === 0;

  return (
    <>
      <section
        className={`${listStyles.panel} ${listStyles.filtersSummaryPanel}`}
        aria-labelledby="ropa-summary-heading"
      >
        <h2 id="ropa-summary-heading" className={listStyles.summaryHeading}>
          Summary
        </h2>
        <div className={listStyles.summaryCards}>
          <div className={listStyles.summaryCard}>
            <span className={listStyles.summaryValue}>{summary.total}</span>
            <span className={listStyles.summaryLabel}>Total data uses</span>
          </div>
          <div className={listStyles.summaryCard}>
            <span className={listStyles.summaryValue}>{summary.needReview}</span>
            <span className={listStyles.summaryLabel}>Need review</span>
            <span className={listStyles.summaryCardHelper}>Not reviewed or overdue</span>
          </div>
          <div className={listStyles.summaryCard}>
            <span className={listStyles.summaryValue}>{summary.highRiskTransfers}</span>
            <span className={listStyles.summaryLabel}>International transfers</span>
          </div>
        </div>
        <div className={listStyles.searchAndFiltersWrap}>
          <div className={listStyles.searchAndFilters}>
            <div className={listStyles.searchWrap}>
              <label htmlFor="ropa-search" className={listStyles.searchLabel}>
                Search data uses
              </label>
              <input
                id="ropa-search"
                type="search"
                className={listStyles.filterSearch}
                placeholder="Search data uses… (e.g. payroll, CCTV, marketing)"
                value={searchQuery}
                onChange={handleSearchChange}
                aria-describedby="ropa-search-desc"
              />
              <span id="ropa-search-desc" className={listStyles.searchHelper}>
                Matches data use name and description
              </span>
            </div>
            <RopaFilters />
          </div>
        </div>
      </section>

      {isEmpty ? (
        <section
          className={listStyles.emptyState}
          aria-labelledby="ropa-empty-heading"
        >
          <div className={listStyles.emptyStateIcon} aria-hidden>
            📋
          </div>
          <h2 id="ropa-empty-heading" className={listStyles.emptyStateTitle}>
            No RoPA records yet
          </h2>
          <p className={listStyles.emptyStateText}>
            Add data uses to build your register. Start with templates for common activities, or create a blank record and fill it in.
          </p>
          <div className={listStyles.emptyStateActions}>
            <Link
              href={auditPath("/dashboard/ropa/templates")}
              className={`${listStyles.btn} ${listStyles.btnPrimary}`}
              onClick={() => {
                trackEvent("ropa_empty_state_click", { action: "templates" });
                trackEvent("ropa_cta_click", { action: "templates" });
              }}
            >
              Start with templates (recommended)
            </Link>
            <Link
              href={auditPath("/dashboard/ropa/new")}
              className={`${listStyles.btn} ${listStyles.btnSecondary}`}
              onClick={() => {
                trackEvent("ropa_empty_state_click", { action: "blank" });
                trackEvent("ropa_cta_click", { action: "add_blank" });
              }}
            >
              Create blank record
            </Link>
          </div>
        </section>
      ) : (
        <section
          className={`${listStyles.panel} ${listStyles.tablePanel}`}
          aria-labelledby="ropa-table-caption"
        >
          <div className={listStyles.tableHeaderRow}>
            <h2 id="ropa-table-caption" className={listStyles.tableCaption}>
              Data processing register
            </h2>
          </div>
          <div className={listStyles.tableWrap}>
            <table
              className={listStyles.table}
              aria-labelledby="ropa-table-caption"
              aria-label="Data processing register"
            >
              <thead>
                <tr>
                  <th scope="col">Data use</th>
                  <th scope="col">
                    <span className={listStyles.thWithHelp}>
                      Lawful basis
                      <details className={listStyles.helpDetails}>
                        <summary className={listStyles.helpSummary} aria-label="What is lawful basis?">
                          <span aria-hidden>?</span>
                        </summary>
                        <p className={listStyles.helpTooltip}>
                          Lawful reason under GDPR for processing this data.
                        </p>
                      </details>
                    </span>
                  </th>
                  <th scope="col">How long we keep it</th>
                  <th scope="col">Suppliers involved</th>
                  <th scope="col">Last checked</th>
                  <th scope="col">Status</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((r) => (
                  <RopaRow
                    key={r.id}
                    row={r}
                    lawfulBasisLabel={lawfulBasisLabel}
                    canEdit={canEdit}
                    getCompleteness={getCompleteness}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  );
}

function RopaRow({
  row,
  lawfulBasisLabel,
  canEdit,
  getCompleteness,
}: {
  row: RopaRecordRow;
  lawfulBasisLabel: Record<string, string>;
  canEdit: boolean;
  getCompleteness: (r: RopaRecordRow) => CompletenessStatus;
}) {
  const status = getCompleteness(row);
  const detailUrl = auditPath(`/dashboard/ropa/${row.id}`);

  const handleRowClick = (e: React.MouseEvent<HTMLTableRowElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest("a") || target.closest("button") || target.closest("form")) return;
    window.location.href = detailUrl;
  };

  return (
    <tr
      onClick={handleRowClick}
      className={listStyles.tableRowClickable}
    >
      <td>
        <div className={listStyles.dataUseCell}>
          <span>{row.name}</span>
          <CompletenessBadge status={status} />
        </div>
      </td>
      <td>{lawfulBasisLabel[row.lawfulBasis] ?? row.lawfulBasis}</td>
      <td>{row.retentionPeriod || "—"}</td>
      <td>
        {row.processorsCount === 0
          ? "0 suppliers"
          : row.processorsCount === 1
            ? "1 supplier"
            : `${row.processorsCount} suppliers`}
      </td>
      <td>
        {row.lastReviewedAt ? (
          new Date(row.lastReviewedAt).toLocaleDateString()
        ) : (
          <span className={listStyles.notReviewedText}>Not reviewed yet</span>
        )}
      </td>
      <td>
        <span
          className={
            row.status === "active"
              ? listStyles.pillActive
              : listStyles.pillInactive
          }
        >
          {row.status === "active" ? "Active" : "Inactive"}
        </span>
      </td>
      <td>
        <Link
          href={detailUrl}
          className={listStyles.link}
          aria-label={canEdit ? `View or edit ${row.name}` : `View ${row.name}`}
          onClick={(e) => e.stopPropagation()}
        >
          {canEdit ? "View / Edit" : "View"}
        </Link>
        {canEdit && (
          <>
            <span className={listStyles.muted} style={{ margin: "0 0.5rem" }} aria-hidden>
              ·
            </span>
            <DeleteRopaButton id={row.id} name={row.name} />
          </>
        )}
      </td>
    </tr>
  );
}

function CompletenessBadge({ status }: { status: CompletenessStatus }) {
  if (status === "complete") {
    return (
      <span className={listStyles.badgeComplete} aria-label="Complete">
        <span aria-hidden>✓</span> Complete
      </span>
    );
  }
  if (status === "missing_retention") {
    return (
      <span className={listStyles.badgeWarning}>Missing retention</span>
    );
  }
  if (status === "missing_suppliers") {
    return (
      <span className={listStyles.badgeWarning}>Missing suppliers</span>
    );
  }
  return (
    <span className={listStyles.badgeWarning}>Not reviewed yet</span>
  );
}
