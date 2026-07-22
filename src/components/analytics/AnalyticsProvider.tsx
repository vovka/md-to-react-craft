import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { analyticsConfig } from "@/config/analytics";

const validGa4 = (id: string) => /^G-[A-Z0-9]+$/i.test(id);
const validClarity = (id: string) => /^[a-z0-9]+$/i.test(id);
const hostAllowed = () => analyticsConfig.allowedHosts.includes(window.location.hostname as never);

const readConsent = (): "unknown" | "accepted" | "rejected" => {
  if (navigator.globalPrivacyControl === true) return "rejected";
  try {
    const stored = JSON.parse(localStorage.getItem(analyticsConfig.consent.storageKey) || "null");
    if (stored?.policyVersion !== analyticsConfig.consent.policyVersion) return "unknown";
    return stored?.analytics === "accepted" ? "accepted" : stored?.analytics === "rejected" ? "rejected" : "unknown";
  } catch {
    return "unknown";
  }
};

const saveConsent = (analytics: "accepted" | "rejected") => localStorage.setItem(
  analyticsConfig.consent.storageKey,
  JSON.stringify({ analytics, policyVersion: analyticsConfig.consent.policyVersion, updatedAt: new Date().toISOString() }),
);

const loadScript = (id: string, src: string) => {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.id = id;
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
};

const initialize = () => {
  if (!analyticsConfig.enabled || !hostAllowed()) return false;
  if (validGa4(analyticsConfig.ga4MeasurementId)) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag(...args: unknown[]) { window.dataLayer.push(args); };
    window.gtag("js", new Date());
    window.gtag("config", analyticsConfig.ga4MeasurementId, { send_page_view: false, anonymize_ip: true });
    loadScript("blog-ga4", `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(analyticsConfig.ga4MeasurementId)}`);
  }
  if (validClarity(analyticsConfig.clarityProjectId)) {
    window.clarity = window.clarity || function clarity(...args: unknown[]) { (window.clarity.q = window.clarity.q || []).push(args); };
    window.clarity("consentv2", { ad_Storage: "denied", analytics_Storage: "granted" });
    loadScript("blog-clarity", `https://www.clarity.ms/tag/${encodeURIComponent(analyticsConfig.clarityProjectId)}`);
    window.clarity("set", "environment", analyticsConfig.environment);
  }
  return true;
};

export default function AnalyticsProvider() {
  const location = useLocation();
  const previousPath = useRef("");
  const [consent, setConsent] = useState(readConsent);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (consent === "accepted") setActive(initialize());
  }, [consent]);

  useEffect(() => {
    if (!active) return;
    const path = `${location.pathname}${location.search}`;
    if (previousPath.current === path) return;
    previousPath.current = path;
    queueMicrotask(() => window.gtag?.("event", "page_view", {
      page_path: path,
      page_location: window.location.href,
      page_title: document.title,
    }));
  }, [active, location.pathname, location.search]);

  const choose = (value: "accepted" | "rejected") => {
    saveConsent(value);
    setConsent(value);
    if (value === "rejected") {
      window.clarity?.("consentv2", { ad_Storage: "denied", analytics_Storage: "denied" });
      setActive(false);
    }
  };

  if (!analyticsConfig.enabled || consent !== "unknown") return null;

  return <section role="dialog" aria-label="Analytics preferences" style={{ position: "fixed", zIndex: 1000, left: 16, right: 16, bottom: 16, maxWidth: 760, margin: "0 auto", padding: 16, border: "1px solid #d1d5db", borderRadius: 12, background: "white", boxShadow: "0 12px 36px rgba(0,0,0,.18)" }}>
    <p style={{ marginBottom: 12 }}>We use optional analytics to understand traffic and improve the blog. Nothing is loaded until you choose.</p>
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      <button type="button" onClick={() => choose("accepted")}>Accept analytics</button>
      <button type="button" onClick={() => choose("rejected")}>Reject non-essential analytics</button>
      <a href={analyticsConfig.consent.privacyPagePath}>Privacy</a>
    </div>
  </section>;
}

declare global {
  interface Navigator { globalPrivacyControl?: boolean }
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: ((...args: unknown[]) => void) & { q?: unknown[] };
  }
}
