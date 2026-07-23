import { createContext, useContext } from "react";
import type { ConsentValue } from "@/analytics/types";

export interface AnalyticsContextValue {
  available: boolean;
  consent: ConsentValue;
  openPreferences: () => void;
}

export const AnalyticsContext = createContext<AnalyticsContextValue>({
  available: false,
  consent: "unknown",
  openPreferences: () => undefined,
});

export const useAnalyticsPreferences = () => useContext(AnalyticsContext);
