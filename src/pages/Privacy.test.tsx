import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { AnalyticsContext } from "@/components/analytics/AnalyticsContext";
import Privacy from "./Privacy";

describe("Privacy", () => {
  afterEach(cleanup);

  it("keeps analytics preferences available through the shared layout", () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AnalyticsContext.Provider
          value={{ available: true, consent: "accepted", openPreferences: vi.fn() }}
        >
          <Privacy />
        </AnalyticsContext.Provider>
      </MemoryRouter>,
    );

    expect(screen.getByRole("button", { name: "Analytics preferences" })).toBeTruthy();
    expect(screen.getByText("Data controller: Volodymyr Shcherbyna")).toBeTruthy();
  });
});
