import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { getSessionUserId } from "@/lib/auth";
import { getOrgContext } from "@/lib/org";
import { connectToDatabase } from "@/lib/mongoose";
import { EvidenceDocumentModel } from "@/lib/models";

const UPLOAD_DIR = path.join(process.cwd(), "data", "uploads");

export async function GET(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const ctx = await getOrgContext(userId);
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await connectToDatabase();
  const doc = await EvidenceDocumentModel.findOne({ _id: id, orgId: ctx.orgId }).lean();
  if (!doc || !doc.storage?.key) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const rawKey = doc.storage.key;
  const normalized = path.normalize(rawKey).replace(/^(\.\.(\/|\\|$))+/, "");
  const absPath = path.resolve(UPLOAD_DIR, normalized);
  if (!absPath.startsWith(path.resolve(UPLOAD_DIR))) {
    return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
  }
  try {
    const buf = await readFile(absPath);
    const contentType = doc.storage.contentType || "application/octet-stream";
    return new NextResponse(buf, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${(doc.title || "document").replace(/"/g, "%22")}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
