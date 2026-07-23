import { describe, expect, it } from "vitest";
import { isClarityIdValid, isGa4IdValid } from "@/config/analytics";

describe("analytics ID validation", () => {
  it("accepts GA4 measurement IDs and rejects placeholders", () => {
    expect(isGa4IdValid("G-ABC123XYZ")).toBe(true);
    expect(isGa4IdValid("G-YOUR_TEST_ID")).toBe(false);
    expect(isGa4IdValid("")).toBe(false);
  });

  it("accepts alphanumeric Clarity project IDs only", () => {
    expect(isClarityIdValid("abc123xyz")).toBe(true);
    expect(isClarityIdValid("your-project-id")).toBe(false);
    expect(isClarityIdValid("")).toBe(false);
  });
});
