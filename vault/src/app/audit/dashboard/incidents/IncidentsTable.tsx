"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { auditPath } from "@/lib/constants";
import listStyles from "../list.module.css";

export type IncidentRiskLevel = "low" | "medium" | "high";

export type IncidentRow = {
  _id: unknown;
  discoveredAt?: Date | string | null;
  title: string;
  riskLevel?: IncidentRiskLevel | string;
  status?: string;
  notification?: { dpcNotified?: boolean } | null;
};

const RISK_LABELS: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

function getRiskLabel(risk: string | undefined): string {
  if (!risk) return "—";
  return RISK_LABELS[risk] ?? risk;
}

type Props = { list: IncidentRow[]; canEdit?: boolean };

export function IncidentsTable({ list, canEdit = true }: Props) {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dpcFilter, setDpcFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    return list.filter((i) => {
      if (statusFilter !== "all") {
        if (i.status !== statusFilter) return false;
      }
      if (dpcFilter !== "all") {
        const notified = i.notification?.dpcNotified ?? false;
        if (dpcFilter === "yes" && !notified) return false;
        if (dpcFilter === "no" && notified) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const title = (i.title ?? "").toLowerCase();
        if (!title.includes(q)) return false;
      }
      return true;
    });
  }, [list, statusFilter, dpcFilter, searchQuery]);

  const summary = useMemo(() => {
    const open = filtered.filter((i) => i.status === "open").length;
    const closed = filtered.filter((i) => i.status === "closed").length;
    const dpcInformed = filtered.filter((i) => i.notification?.dpcNotified === true).length;
    return { open, closed, dpcInformed };
  }, [filtered]);

  return (
    <>
      <section
        className={`${listStyles.panel} ${listStyles.filtersSummaryPanel}`}
        aria-labelledby="incidents-summary-heading"
      >
        <h2 id="incidents-summary-heading" className={listStyles.summaryHeading}>
          Summary
        </h2>
        <div className={listStyles.summaryCards}>
          <div className={listStyles.summaryCard}>
            <span className={listStyles.summaryValue}>{summary.open}</span>
            <span className={listStyles.summaryLabel}>Open</span>
          </div>
          <div className={listStyles.summaryCard}>
            <span className={listStyles.summaryValue}>{summary.closed}</span>
            <span className={listStyles.summaryLabel}>Closed</span>
          </div>
          <div className={listStyles.summaryCard}>
            <span className={listStyles.summaryValue}>{summary.dpcInformed}</span>
            <span className={listStyles.summaryLabel}>DPC informed</span>
          </div>
        </div>

        <div className={listStyles.searchAndFiltersWrap}>
          <div className={`${listStyles.searchAndFilters} ${listStyles.searchAndFiltersGrid3}`}>
            <div className={listStyles.searchWrap}>
              <label htmlFor="incidents-search" className={listStyles.searchLabel}>
                Search incidents
              </label>
              <input
                id="incidents-search"
                type="search"
                className={listStyles.filterSearch}
                placeholder="Search incidents (e.g. email sent to wrong person)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search incidents"
              />
            </div>
            <div className={listStyles.filterGroup}>
              <label htmlFor="incidents-status-filter">Status</label>
              <select
                id="incidents-status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by status"
              >
                <option value="all">All</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div className={listStyles.filterGroup}>
              <label htmlFor="incidents-dpc-filter">DPC informed</label>
              <select
                id="incidents-dpc-filter"
                value={dpcFilter}
                onChange={(e) => setDpcFilter(e.target.value)}
                aria-label="Filter by DPC informed"
              >
                <option value="all">All</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section
        className={`${listStyles.panel} ${listStyles.tablePanel}`}
        aria-labelledby="incidents-table-caption"
      >
        <h2 id="incidents-table-caption" className={listStyles.tableCaption}>
          Incidents
        </h2>
        <div className={listStyles.tableWrap}>
          <table className={listStyles.table} aria-labelledby="incidents-table-caption">
            <thead>
              <tr>
                <th scope="col" title="Your best judgement at the time. You can update later.">
                  Found on
                </th>
                <th scope="col">Title</th>
                <th scope="col" title="Your best judgement at the time. You can update later.">
                  How serious?
                </th>
                <th scope="col">Status</th>
                <th scope="col">DPC informed?</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ color: "var(--theme-text-muted)", padding: "var(--theme-space-6)" }}>
                    {list.length === 0
                      ? "No incidents recorded."
                      : "No incidents match your filters."}
                  </td>
                </tr>
              )}
              {filtered.map((i) => {
                const isOpen = i.status === "open";
                const dpcNotified = i.notification?.dpcNotified ?? false;
                const showReviewBadge = isOpen && !dpcNotified;

                return (
                  <tr key={String(i._id)}>
                    <td>{i.discoveredAt ? new Date(i.discoveredAt as string).toLocaleDateString() : "—"}</td>
                    <td>
                      {i.title}
                      {showReviewBadge && (
                        <span
                          className={listStyles.badgeReview}
                          style={{ marginLeft: "var(--theme-space-2)" }}
                          title="Open incident with DPC not yet notified"
                        >
                          Review decision
                        </span>
                      )}
                    </td>
                    <td>{getRiskLabel(i.riskLevel as string)}</td>
                    <td>
                      <span
                        className={
                          isOpen ? listStyles.badgeSoon : listStyles.pillInactive
                        }
                      >
                        {isOpen ? "Open" : "Closed"}
                      </span>
                    </td>
                    <td>{dpcNotified ? "Yes" : "No"}</td>
                    <td>
                      <Link
                        href={auditPath(`/dashboard/incidents/${i._id}`)}
                        className={listStyles.link}
                        aria-label={canEdit ? `View or edit ${i.title}` : `View ${i.title}`}
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
    </>
  );
}
