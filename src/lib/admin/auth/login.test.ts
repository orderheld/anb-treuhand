import { describe, expect, it } from "vitest";
import { safeAdminTarget } from "./login";

describe("safeAdminTarget", () => {
  it("keeps admin paths", () => {
    expect(safeAdminTarget("/admin")).toBe("/admin");
    expect(safeAdminTarget("/admin/tarife/treuhand")).toBe("/admin/tarife/treuhand");
    expect(safeAdminTarget("/admin/anfragen?status=neu")).toBe("/admin/anfragen?status=neu");
  });

  it("refuses everything else", () => {
    for (const value of ["https://evil.example", "//evil.example", "/", "/kontakt", "/administrator", "/admin/../kontakt", "/admin\\evil", "/admin/login", "/admin/einrichtung", null, 42]) {
      expect(safeAdminTarget(value)).toBe("/admin");
    }
  });
});
