/**
 * Derived summary stats for the executive summary and status lines.
 * No extra data storage; computed from existing lists.
 */

export interface SummaryStats {
  ropaCount: number;
  dsrCount: number;
  dsrOpenCount: number;
  dsrOverdueCount: number;
  incidentCount: number;
  incidentOpenCount: number;
  evidenceCount: number;
}

export interface DsrItem {
  outcome?: string | null;
  dueAt?: Date | string | null;
}

export interface IncidentItem {
  status?: string | null;
}

/**
 * Compute open and overdue DSR counts.
 * Overdue = due date < today and status is open (no outcome).
 */
export function getSummaryStats(
  ropaCount: number,
  dsrList: DsrItem[],
  incidentList: IncidentItem[],
  evidenceCount: number
): SummaryStats {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let dsrOpenCount = 0;
  let dsrOverdueCount = 0;
  for (const d of dsrList) {
    const isOpen = !d.outcome;
    if (isOpen) dsrOpenCount++;
    if (isOpen && d.dueAt) {
      const due = new Date(d.dueAt);
      due.setHours(0, 0, 0, 0);
      if (due < today) dsrOverdueCount++;
    }
  }

  let incidentOpenCount = 0;
  for (const i of incidentList) {
    if (i.status !== "closed") incidentOpenCount++;
  }

  return {
    ropaCount,
    dsrCount: dsrList.length,
    dsrOpenCount,
    dsrOverdueCount,
    incidentCount: incidentList.length,
    incidentOpenCount,
    evidenceCount,
  };
}
