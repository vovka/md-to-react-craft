import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { hasGlobalPrivacyControl, readConsent, saveConsent } from "@/analytics/consent";
import { trackPageView } from "@/analytics/events";
import { disableAnalytics, initializeAnalytics } from "@/analytics/runtime";
import type { ConsentValue } from "@/analytics/types";
import { isAnalyticsEligible } from "@/config/analytics";
import { AnalyticsContext } from "./AnalyticsContext";
import ConsentBanner from "./ConsentBanner";

const AnalyticsProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const available = isAnalyticsEligible();
  const previousPath = useRef("");
  const [consent, setConsent] = useState<ConsentValue>(readConsent);
  const [active, setActive] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(consent === "unknown");

  useEffect(() => {
    if (available && consent === "accepted") setActive(initializeAnalytics());
    else { disableAnalytics(); setActive(false); }
  }, [available, consent]);

  useEffect(() => {
    if (!active) { previousPath.current = ""; return; }
    const path = `${location.pathname}${location.search}`;
    if (previousPath.current === path) return;
    previousPath.current = path;
    queueMicrotask(() => trackPageView(path));
  }, [active, location.pathname, location.search]);

  const choose = (value: "accepted" | "rejected") => {
    const choice = hasGlobalPrivacyControl() ? "rejected" : value;
    saveConsent(choice);
    if (choice === "rejected") disableAnalytics();
    setConsent(choice);
    setPreferencesOpen(false);
  };

  const context = useMemo(() => ({
    available,
    consent,
    openPreferences: () => setPreferencesOpen(true),
  }), [available, consent]);

  return (
    <AnalyticsContext.Provider value={context}>
      {children}
      {available && preferencesOpen && (
        <ConsentBanner
          current={consent}
          gpcActive={hasGlobalPrivacyControl()}
          onChoose={choose}
          onClose={() => setPreferencesOpen(false)}
        />
      )}
    </AnalyticsContext.Provider>
  );
};

export default AnalyticsProvider;
