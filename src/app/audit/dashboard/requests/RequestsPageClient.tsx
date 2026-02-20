"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

import { auditPath } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import { getRequestTypeLabel } from "./labels";
import listStyles from "../list.module.css";
import { RequestsEmptyState } from "./RequestsEmptyState";

const OUTCOME_LABELS: Record<string, string> = {
  completed_full: "Completed",
  completed_partial: "Partial",
  refused: "Refused",
  withdrawn: "Withdrawn",
};

export type DsrRow = {
  id: string;
  requestType: string;
  receivedAtIso: string | null;
  dueAtIso: string | null;
  subjectRefScheme: string;
  subjectRefValue: string;
  outcome: string | null;
  outcomeLabel: string;
};

const now = () => Date.now();
const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

function dueStatus(dueAtIso: string | null): "overdue" | "soon" | null {
  if (!dueAtIso) return null;
  const d = new Date(dueAtIso).getTime();
  const t = now();
  if (d < t) return "overdue";
  if (d - t <= sevenDaysMs) return "soon";
  return null;
}

function isOpen(row: DsrRow): boolean {
  return !row.outcome;
}

type Props = {
  initialList: DsrRow[];
  canEdit: boolean;
};

export function RequestsPageClient({ initialList, canEdit }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const pageViewFired = useRef(false);
  const summaryViewFired = useRef(false);

  const filteredList = useMemo(() => {
    let list = initialList;
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((r) => {
        const who = `${r.subjectRefScheme} ${r.subjectRefValue}`.toLowerCase();
        return who.includes(q) || (r.subjectRefValue && r.subjectRefValue.toLowerCase().includes(q));
      });
    }
    if (statusFilter === "open") list = list.filter(isOpen);
    if (statusFilter === "closed") list = list.filter((r) => !isOpen(r));
    if (typeFilter) list = list.filter((r) => r.requestType === typeFilter);
    return list;
  }, [initialList, searchQuery, statusFilter, typeFilter]);

  const summary = useMemo(() => {
    const open = filteredList.filter(isOpen);
    const today = now();
    let overdue = 0;
    let dueSoon = 0;
    for (const r of open) {
      if (!r.dueAtIso) continue;
      const d = new Date(r.dueAtIso).getTime();
      if (d < today) overdue += 1;
      else if (d - today <= sevenDaysMs) dueSoon += 1;
    }
    const closed = filteredList.length - open.length;
    return {
      open: open.length,
      overdue,
      dueSoon,
      closed,
    };
  }, [filteredList]);

  useEffect(() => {
    if (pageViewFired.current) return;
    pageViewFired.current = true;
    trackEvent("dsar_page_view", { page: "requests" });
  }, []);

  useEffect(() => {
    if (summaryViewFired.current) return;
    summaryViewFired.current = true;
    trackEvent("dsar_summary_view", { page: "requests" });
  }, []);

  const handleHelpToggle = useCallback((e: React.SyntheticEvent<HTMLDetailsElement>) => {
    const details = e.currentTarget;
    trackEvent(details.open ? "dsar_help_open" : "dsar_help_close");
  }, []);

  const isEmpty = filteredList.length === 0;
  const requestTypes = useMemo(() => {
    const set = new Set(initialList.map((r) => r.requestType));
    return Array.from(set).sort();
  }, [initialList]);

  return (
    <>
      <section className={`${listStyles.panel} ${listStyles.introPanel}`} aria-labelledby="dsar-page-title">
        <div className={listStyles.titleRow}>
          <div className={listStyles.titleCol}>
            <h1 id="dsar-page-title" className={listStyles.title}>
              Customer Data Requests
            </h1>
            <p className={listStyles.subtitle}>
              When someone asks to see, change, or delete their personal data.
            </p>
            <details className={listStyles.whyBlock} onToggle={handleHelpToggle}>
              <summary className={listStyles.whySummary}>What is this?</summary>
              <p className={listStyles.whyText}>
                This is a simple log of personal data requests. Keeping a record helps you demonstrate GDPR accountability.
              </p>
            </details>
          </div>
          {canEdit && (
            <div className={listStyles.ctaGroup}>
              <Link
                href={auditPath("/dashboard/requests/new")}
                className={`${listStyles.btn} ${listStyles.btnPrimary}`}
              >
                Log customer request
              </Link>
            </div>
          )}
        </div>
      </section>

      <section
        className={`${listStyles.panel} ${listStyles.filtersSummaryPanel}`}
        aria-labelledby="dsar-summary-heading"
      >
        <h2 id="dsar-summary-heading" className={listStyles.summaryHeading}>
          Summary
        </h2>
        <div className={listStyles.summaryCards}>
          <div className={listStyles.summaryCard}>
            <span className={listStyles.summaryValue}>{summary.open}</span>
            <span className={listStyles.summaryLabel}>Open</span>
          </div>
          <div className={listStyles.summaryCard}>
            <span className={listStyles.summaryValue}>{summary.overdue}</span>
            <span className={listStyles.summaryLabel}>Overdue</span>
            <span className={listStyles.summaryCardHelper}>Reply by date passed</span>
          </div>
          <div className={listStyles.summaryCard}>
            <span className={listStyles.summaryValue}>{summary.dueSoon}</span>
            <span className={listStyles.summaryLabel}>Due soon</span>
            <span className={listStyles.summaryCardHelper}>Next 7 days</span>
          </div>
          <div className={listStyles.summaryCard}>
            <span className={listStyles.summaryValue}>{summary.closed}</span>
            <span className={listStyles.summaryLabel}>Closed</span>
          </div>
        </div>

        <div className={listStyles.searchAndFiltersWrap}>
          <div className={listStyles.searchAndFilters}>
            <div className={listStyles.searchWrap}>
              <label htmlFor="dsar-search" className={listStyles.searchLabel}>
                Search requests
              </label>
              <input
                id="dsar-search"
                type="search"
                className={listStyles.filterSearch}
                placeholder="Search by requester / customer_id…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-describedby="dsar-search-desc"
              />
              <span id="dsar-search-desc" className={listStyles.searchHelper}>
                Matches who asked and identifier
              </span>
            </div>
            <div className={listStyles.filters}>
              <div className={listStyles.filterGroup}>
                <label htmlFor="dsar-filter-status">Status</label>
                <select
                  id="dsar-filter-status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div className={listStyles.filterGroup}>
                <label htmlFor="dsar-filter-type">Type</label>
                <select
                  id="dsar-filter-type"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="">All</option>
                  {requestTypes.map((t) => (
                    <option key={t} value={t}>
                      {getRequestTypeLabel(t)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isEmpty ? (
        <RequestsEmptyState canEdit={canEdit} />
      ) : (
        <section
          className={`${listStyles.panel} ${listStyles.tablePanel}`}
          aria-labelledby="dsar-table-caption"
        >
          <h2 id="dsar-table-caption" className={listStyles.tableCaption}>
            Customer data requests
          </h2>
          <div className={listStyles.tableWrap}>
            <table className={listStyles.table} aria-labelledby="dsar-table-caption">
              <thead>
                <tr>
                  <th scope="col">Received date</th>
                  <th scope="col">Type</th>
                  <th scope="col">Who asked</th>
                  <th scope="col">Reply by</th>
                  <th scope="col">Status</th>
                  <th scope="col">How it was handled</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((r) => {
                  const open = isOpen(r);
                  const status = dueStatus(r.dueAtIso);
                  return (
                    <tr key={r.id}>
                      <td>{r.receivedAtIso ? new Date(r.receivedAtIso).toLocaleDateString() : "—"}</td>
                      <td>{getRequestTypeLabel(r.requestType)}</td>
                      <td>{r.subjectRefValue ? `${r.subjectRefScheme}: ${r.subjectRefValue}` : "—"}</td>
                      <td>
                        {r.dueAtIso ? new Date(r.dueAtIso).toLocaleDateString() : "—"}
                        {status && (
                          <span className={`${listStyles.badge} ${status === "overdue" ? listStyles.badgeOverdue : listStyles.badgeSoon}`}>
                            {status === "overdue" ? "Overdue" : "Due soon"}
                          </span>
                        )}
                      </td>
                      <td>{open ? "Open" : "Completed"}</td>
                      <td>{r.outcome ? r.outcomeLabel : "—"}</td>
                      <td>
                        <Link
                          href={auditPath(`/dashboard/requests/${r.id}`)}
                          className={listStyles.link}
                          aria-label={canEdit ? `View or edit request ${r.subjectRefValue || r.id}` : `View request ${r.subjectRefValue || r.id}`}
                        >
                          {canEdit ? "View / Edit" : "View"}
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  );
}
