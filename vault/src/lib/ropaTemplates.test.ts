import { describe, it, expect } from "vitest";
import {
  ROPA_TEMPLATES,
  validateTemplateIds,
  getTemplateById,
} from "./ropaTemplates";

describe("ropaTemplates", () => {
  it("exports exactly 12 templates", () => {
    expect(ROPA_TEMPLATES).toHaveLength(12);
  });

  it("each template has stable templateId, title, description, and defaults", () => {
    for (const t of ROPA_TEMPLATES) {
      expect(t.templateId).toBeDefined();
      expect(typeof t.templateId).toBe("string");
      expect(t.templateId.length).toBeGreaterThan(0);
      expect(t.title).toBeDefined();
      expect(t.description).toBeDefined();
      expect(t.defaults).toBeDefined();
      expect(t.defaults.processingActivityName).toBeDefined();
      expect(t.defaults.purposeOfProcessing).toBeDefined();
      expect(Array.isArray(t.defaults.dataSubjectCategories)).toBe(true);
      expect(Array.isArray(t.defaults.personalDataCategories)).toBe(true);
      expect(t.defaults.lawfulBasis).toBeDefined();
      expect(t.defaults.retentionPeriod).toBeDefined();
      expect(Array.isArray(t.defaults.processorsRecipients)).toBe(true);
    }
  });

  it("validateTemplateIds returns invalid for unknown ids", () => {
    const { valid, invalid } = validateTemplateIds(["customer-enquiries-contact-forms", "unknown-id", "fake"]);
    expect(valid).toEqual(["customer-enquiries-contact-forms"]);
    expect(invalid).toEqual(["unknown-id", "fake"]);
  });

  it("validateTemplateIds returns all valid for known ids", () => {
    const ids = ROPA_TEMPLATES.map((t) => t.templateId);
    const { valid, invalid } = validateTemplateIds(ids);
    expect(valid).toHaveLength(12);
    expect(invalid).toHaveLength(0);
  });

  it("getTemplateById returns template for existing id", () => {
    const t = getTemplateById("customer-enquiries-contact-forms");
    expect(t).toBeDefined();
    expect(t?.templateId).toBe("customer-enquiries-contact-forms");
    expect(t?.title).toBe("Customer Enquiries & Contact Forms");
  });

  it("getTemplateById returns undefined for non-existent id", () => {
    expect(getTemplateById("non-existent")).toBeUndefined();
  });
});
