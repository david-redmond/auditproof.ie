/**
 * Role-based permissions for the dashboard.
 * - Viewer: view only. No edit, no reports, no user management.
 * - Editor: view + edit/add data (RoPA, requests, incidents, evidence). No reports, no user management.
 * - Admin / Owner: full access, including generate reports and manage users (invite, remove).
 */

export function canEditData(role: string): boolean {
  return role === "editor" || role === "admin" || role === "owner";
}

export function canGenerateReports(role: string): boolean {
  return role === "admin" || role === "owner";
}

export function canManageUsers(role: string): boolean {
  return role === "admin" || role === "owner";
}
