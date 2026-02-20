/**
 * Readiness check: required env vars for the app to run.
 * Used by GET /api/ready so deployers can verify config before traffic.
 */

const REQUIRED = ["MONGODB_URI", "AUTH_SECRET"] as const;

export type ReadinessResult = {
  ready: boolean;
  missing?: string[];
};

export function checkEnvReadiness(): ReadinessResult {
  const missing: string[] = REQUIRED.filter((key) => {
    const v = process.env[key];
    return v === undefined || (typeof v === "string" && v.trim() === "");
  });

  if (process.env.NODE_ENV === "production") {
    const hasBaseUrl =
      (process.env.VAULT_BASE_URL?.trim()?.length ?? 0) > 0 ||
      (process.env.NEXT_PUBLIC_BASE_URL?.trim()?.length ?? 0) > 0;
    if (!hasBaseUrl) {
      missing.push(
        "VAULT_BASE_URL or NEXT_PUBLIC_BASE_URL (required in production for invite links)"
      );
    }
  }

  return missing.length === 0 ? { ready: true } : { ready: false, missing: [...missing] };
}
