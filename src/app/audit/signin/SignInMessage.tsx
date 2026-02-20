type Props = { deleted?: string; orgDeleted?: string };

export function SignInMessage({ deleted, orgDeleted }: Props) {
  if (deleted === "1") {
    return (
      <p className="signin-message" role="status" aria-live="polite" style={{ marginBottom: "1rem", padding: "0.75rem 1rem", background: "var(--theme-bg-alt, #f1f5f9)", border: "1px solid var(--theme-border)", borderRadius: "var(--theme-radius-sm)", fontSize: "0.9375rem" }}>
        Account deleted. You have been signed out.
      </p>
    );
  }
  if (orgDeleted === "1") {
    return (
      <p className="signin-message" role="status" aria-live="polite" style={{ marginBottom: "1rem", padding: "0.75rem 1rem", background: "var(--theme-bg-alt, #f1f5f9)", border: "1px solid var(--theme-border)", borderRadius: "var(--theme-radius-sm)", fontSize: "0.9375rem" }}>
        Organisation and all its data have been deleted. You have been signed out.
      </p>
    );
  }
  return null;
}
