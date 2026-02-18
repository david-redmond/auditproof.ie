import { NextResponse } from "next/server";

const VAULT_URL = process.env.VAULT_URL?.trim() ?? "";

/**
 * Proxies sign-in to the vault app's existing sign-in handler.
 * On success returns redirectUrl so the client can navigate to the vault dashboard.
 * Note: Session cookie is set by vault; for cross-origin deployments the browser
 * must post to vault (e.g. same-domain or CORS) for the cookie to be set.
 */
export async function POST(req: Request) {
  if (!VAULT_URL) {
    return NextResponse.json(
      { message: "Sign-in is not configured." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid request." },
      { status: 400 }
    );
  }

  const signinUrl = `${VAULT_URL.replace(/\/$/, "")}/api/auth/signin`;
  const res = await fetch(signinUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const status = res.status;
    const message =
      status === 401 || data?.error === "Invalid credentials"
        ? "Incorrect email or password."
        : (data?.message as string) || (data?.error as string) || "Sign-in failed.";
    return NextResponse.json({ message, error: data?.error }, { status });
  }

  const redirectUrl = `${VAULT_URL.replace(/\/$/, "")}/audit/dashboard`;
  return NextResponse.json({ ok: true, redirectUrl });
}
