import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { checkEnvReadiness } from "@/lib/env";

/**
 * Readiness probe: returns 200 when required env vars are set and DB is reachable.
 * Returns 503 when not ready (missing env or DB connection failed).
 */
export async function GET() {
  const env = checkEnvReadiness();
  if (!env.ready) {
    return NextResponse.json(
      { status: "not ready", missing: env.missing },
      { status: 503 }
    );
  }
  try {
    await connectToDatabase();
    return NextResponse.json({ status: "ok" });
  } catch {
    return NextResponse.json(
      { status: "not ready", error: "Database unreachable" },
      { status: 503 }
    );
  }
}
