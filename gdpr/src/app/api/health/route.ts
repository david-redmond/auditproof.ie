import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongoose";

export async function GET() {
  await connectToDatabase();
  return NextResponse.json({ status: "ok" });
}
