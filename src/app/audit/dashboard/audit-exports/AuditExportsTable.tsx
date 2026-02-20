"use client";

import { useMemo, useState } from "react";
import listStyles from "../list.module.css";
import { GenerateAuditPack } from "./GenerateAuditPack";
import { DeleteAuditPackButton } from "./DeleteAuditPackButton";
import { ExportDownloadLinks } from "./ExportDownloadLinks";
import styles from "./audit-exports.module.css";

export type SerializedPack = {
  _id: string;
  generatedAt?: string | null;
  generatedByUserId?: string;
  versionLabel?: string | null;
  includes?: {
    ropa?: boolean;
    dsrs?: boolean;
    incidents?: boolean;
    evidenceIndex?: boolean;
    evidenceFiles?: boolean;
  } | null;
  artifacts?: { pdf?: { key?: string | null }; zip?: { key?: string | null } } | null;
};

function getContentChips(includes: SerializedPack["includes"]): string[] {
  if (!includes) return [];
  const chips: string[] = [];
  if (includes.ropa) chips.push("RoPA");
  if (includes.dsrs) chips.push("Requests");
  if (includes.incidents) chips.push("Incidents");
  if (includes.evidenceIndex) chips.push("Evidence");
  if (includes.evidenceFiles) chips.push("ZIP");
  return chips;
}

type Props = {
  list: SerializedPack[];
  userMap: Record<string, string>;
  allowGenerate: boolean;
  hasActiveSubscription: boolean;
  priceAnnual?: number;
  priceMonthly?: number;
};

export function AuditExportsTable({ list, userMap, allowGenerate, hasActiveSubscription, priceAnnual, priceMonthly }: Props) {
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const sorted = useMemo(() => {
    const arr = [...list];
    if (sortOrder === "oldest") {
      arr.reverse();
    }
    return arr;
  }, [list, sortOrder]);

  return (
    <>
      <section
        className={`${listStyles.panel} ${listStyles.filtersSummaryPanel}`}
        aria-labelledby="audit-exports-sort-heading"
      >
        <h2 id="audit-exports-sort-heading" className={listStyles.summaryHeading}>
          Search & filters
        </h2>
        <div className={styles.sortWrap}>
          <label htmlFor="audit-exports-sort" className={listStyles.searchLabel}>
            Sort
          </label>
          <select
            id="audit-exports-sort"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
            aria-label="Sort audit packs"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>
      </section>

      <section
        className={`${listStyles.panel} ${listStyles.tablePanel}`}
        aria-labelledby="audit-packs-table-caption"
      >
        <div className={listStyles.tableHeaderRow}>
          <h2 id="audit-packs-table-caption" className={listStyles.tableCaption}>
            Audit packs
          </h2>
          {allowGenerate && (
            <GenerateAuditPack
              initialOpen={false}
              triggerLabel="Generate new audit pack"
              variant="secondary"
              hasActiveSubscription={hasActiveSubscription}
              priceAnnual={priceAnnual}
              priceMonthly={priceMonthly}
            />
          )}
        </div>
        <div className={listStyles.tableWrap}>
          <table className={listStyles.table} aria-labelledby="audit-packs-table-caption">
            <thead>
              <tr>
                <th scope="col">Created on</th>
                <th scope="col">Created by</th>
                <th scope="col">Version</th>
                <th scope="col">Contents</th>
                <th scope="col">Download</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((e) => {
                const chips = getContentChips(e.includes);
                return (
                  <tr key={String(e._id)}>
                    <td>{e.generatedAt ? new Date(e.generatedAt).toLocaleString() : "—"}</td>
                    <td>{userMap[String(e.generatedByUserId)] ?? "—"}</td>
                    <td>{e.versionLabel ?? "—"}</td>
                    <td className={styles.includes}>
                      {chips.length > 0 ? (
                        chips.map((label) => (
                          <span key={label} className={styles.contentChip}>
                            {label}
                          </span>
                        ))
                      ) : (
                        <span className={listStyles.muted}>—</span>
                      )}
                    </td>
                    <td>
                      <ExportDownloadLinks
                        packId={String(e._id)}
                        versionLabel={e.versionLabel ?? "—"}
                        hasPdf={!!e.artifacts?.pdf?.key}
                        hasZip={!!e.artifacts?.zip?.key}
                        priceAnnual={priceAnnual}
                        priceMonthly={priceMonthly}
                      />
                    </td>
                    <td>
                      {allowGenerate ? <DeleteAuditPackButton id={String(e._id)} /> : null}
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
