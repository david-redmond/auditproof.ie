import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { RopaRecordModel } from "@/lib/models";
import { getSessionUserId } from "@/lib/auth";
import { getOrgContext } from "@/lib/org";
import { canEditData } from "@/lib/permissions";
import { logAuditEvent } from "@/lib/audit";
import { getTemplateById, validateTemplateIds } from "@/lib/ropaTemplates";

const MAX_TEMPLATES = 12;

export type ImportTemplatesResponse =
  | { importedCount: number; skippedCount: number; importedIds: string[]; skippedIds: string[] }
  | { error: string; code?: string };

/** POST /api/ropa/import-templates – import selected templates as RoPA records for the current org. */
export async function POST(request: NextRequest): Promise<NextResponse<ImportTemplatesResponse>> {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
  }

  const ctx = await getOrgContext(userId);
  if (!ctx) {
    return NextResponse.json({ error: "Organisation context required", code: "NO_ORG" }, { status: 401 });
  }
  if (!canEditData(ctx.role)) {
    return NextResponse.json({ error: "You don't have permission to add or edit data.", code: "FORBIDDEN" }, { status: 403 });
  }

  let body: { templateIds?: string[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body. Expected { templateIds: string[] }." },
      { status: 400 }
    );
  }

  const templateIds = Array.isArray(body.templateIds)
    ? (body.templateIds as string[]).filter((id) => typeof id === "string")
    : [];

  if (templateIds.length === 0) {
    return NextResponse.json(
      { error: "templateIds is required, non-empty, and must be an array of strings." },
      { status: 400 }
    );
  }

  if (templateIds.length > MAX_TEMPLATES) {
    return NextResponse.json(
      { error: `Maximum ${MAX_TEMPLATES} templates per request.` },
      { status: 400 }
    );
  }

  const { valid, invalid } = validateTemplateIds(templateIds);
  if (invalid.length > 0) {
    return NextResponse.json(
      { error: `Invalid template IDs: ${invalid.join(", ")}.` },
      { status: 400 }
    );
  }

  await connectToDatabase();

  const orgId = ctx.orgId;
  const existingByTemplateId = await RopaRecordModel.find({
    orgId,
    source: "template",
    templateId: { $in: valid },
  })
    .select("templateId")
    .lean();

  const alreadyImported = new Set(existingByTemplateId.map((r) => r.templateId).filter(Boolean));

  const toImport = valid.filter((id) => !alreadyImported.has(id));
  const skippedIds = valid.filter((id) => alreadyImported.has(id));

  const importedIds: string[] = [];

  for (const templateId of toImport) {
    const template = getTemplateById(templateId);
    if (!template) continue;

    const d = template.defaults;
    const doc = await RopaRecordModel.create({
      orgId,
      source: "template",
      templateId,
      name: d.processingActivityName,
      purpose: d.purposeOfProcessing,
      dataSubjects: d.dataSubjectCategories,
      personalDataCategories: d.personalDataCategories,
      lawfulBasis: d.lawfulBasis,
      lawfulBasisNotes: d.notes ?? undefined,
      retention: { period: d.retentionPeriod, rationale: undefined },
      lastReviewedAt: null,
      recipients: d.processorsRecipients,
      internationalTransfers: { occurs: false, countries: [], safeguards: undefined },
      processors: [],
      security: {
        accessControls: true,
        encryptionAtRest: false,
        encryptionInTransit: true,
        backups: true,
        notes: undefined,
      },
      status: "active",
    });

    importedIds.push(String(doc._id));
    await logAuditEvent({
      orgId,
      entity: "ropa",
      entityId: doc._id,
      action: "create",
      summary: d.processingActivityName,
      actorUserId: userId,
    });
  }

  return NextResponse.json({
    importedCount: importedIds.length,
    skippedCount: skippedIds.length,
    importedIds,
    skippedIds,
  });
}
