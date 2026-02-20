"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { auditPath } from "@/lib/constants";
import listStyles from "../list.module.css";

export function RopaFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status") ?? "";
  const basis = searchParams.get("basis") ?? "";
  const international = searchParams.get("international") ?? "";

  function update(key: string, value: string) {
    const p = new URLSearchParams(searchParams.toString());
    if (value) p.set(key, value);
    else p.delete(key);
    router.push(`${auditPath("/dashboard/ropa")}${p.toString() ? `?${p.toString()}` : ""}`);
  }

  return (
    <div className={listStyles.filters}>
      <div className={listStyles.filterGroup}>
        <label htmlFor="filter-status">Status</label>
        <select id="filter-status" value={status} onChange={(e) => update("status", e.target.value)}>
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div className={listStyles.filterGroup}>
        <label htmlFor="filter-basis">Lawful basis</label>
        <select id="filter-basis" value={basis} onChange={(e) => update("basis", e.target.value)}>
          <option value="">All</option>
          <option value="consent">Consent</option>
          <option value="contract">Contract</option>
          <option value="legal_obligation">Legal obligation</option>
          <option value="legitimate_interests">Legitimate interests</option>
          <option value="public_task">Public task</option>
          <option value="vital_interests">Vital interests</option>
        </select>
      </div>
      <div className={listStyles.filterGroup}>
        <label htmlFor="filter-intl">International transfers</label>
        <select id="filter-intl" value={international} onChange={(e) => update("international", e.target.value)}>
          <option value="">All</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>
    </div>
  );
}
