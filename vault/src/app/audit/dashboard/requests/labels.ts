/** Human-readable labels for request types (UI only; stored values unchanged). */
export function getRequestTypeLabel(value: string): string {
  const labels: Record<string, string> = {
    erasure: "Delete my data",
    rectification: "Correct my data",
    access: "Show me my data",
    restriction: "Limit use of my data",
    objection: "Stop using my data",
    portability: "Send my data to me",
  };
  return labels[value] ?? value;
}

export const OUTCOME_LABELS: Record<string, string> = {
  completed_full: "Completed",
  completed_partial: "Partial",
  refused: "Refused",
  withdrawn: "Withdrawn",
};
