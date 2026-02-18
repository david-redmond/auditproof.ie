import { describe, it, expect } from "vitest";
import { canEditData, canGenerateReports, canManageUsers } from "./permissions";

describe("permissions", () => {
  describe("canEditData", () => {
    it("returns true for editor, admin, owner", () => {
      expect(canEditData("editor")).toBe(true);
      expect(canEditData("admin")).toBe(true);
      expect(canEditData("owner")).toBe(true);
    });

    it("returns false for viewer and unknown", () => {
      expect(canEditData("viewer")).toBe(false);
      expect(canEditData("")).toBe(false);
      expect(canEditData("unknown")).toBe(false);
    });
  });

  describe("canGenerateReports", () => {
    it("returns true for admin and owner", () => {
      expect(canGenerateReports("admin")).toBe(true);
      expect(canGenerateReports("owner")).toBe(true);
    });

    it("returns false for viewer, editor and unknown", () => {
      expect(canGenerateReports("viewer")).toBe(false);
      expect(canGenerateReports("editor")).toBe(false);
      expect(canGenerateReports("")).toBe(false);
    });
  });

  describe("canManageUsers", () => {
    it("returns true for admin and owner", () => {
      expect(canManageUsers("admin")).toBe(true);
      expect(canManageUsers("owner")).toBe(true);
    });

    it("returns false for viewer, editor and unknown", () => {
      expect(canManageUsers("viewer")).toBe(false);
      expect(canManageUsers("editor")).toBe(false);
      expect(canManageUsers("")).toBe(false);
    });
  });
});
