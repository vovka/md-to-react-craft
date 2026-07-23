import { Link } from "react-router-dom";
import { analyticsConfig } from "@/config/analytics";
import type { ConsentValue } from "@/analytics/types";

interface ConsentBannerProps {
  current: ConsentValue;
  gpcActive: boolean;
  onChoose: (value: "accepted" | "rejected") => void;
  onClose: () => void;
}

const ConsentBanner = ({ current, gpcActive, onChoose, onClose }: ConsentBannerProps) => (
  <section
    role="dialog"
    aria-label="Analytics preferences"
    className="fixed inset-x-4 bottom-4 z-[1000] mx-auto max-w-3xl rounded-xl border bg-background p-4 shadow-2xl"
  >
    <p className="mb-3">
      {gpcActive
        ? "Your browser's Global Privacy Control signal is active, so optional analytics stays disabled."
        : "We use optional analytics to understand traffic and improve the blog. Nothing loads before consent."}
    </p>
    <div className="flex flex-wrap items-center gap-3">
      {!gpcActive && <button type="button" onClick={() => onChoose("accepted")}>Accept analytics</button>}
      {!gpcActive && <button type="button" onClick={() => onChoose("rejected")}>Reject analytics</button>}
      <Link className="underline" to={analyticsConfig.consent.privacyPagePath}>Privacy</Link>
      {current !== "unknown" && <button type="button" onClick={onClose}>Close</button>}
    </div>
  </section>
);

export default ConsentBanner;
