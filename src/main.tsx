import { createRoot } from "react-dom/client";
import { prepareGoogleConsent } from "@/analytics/googleAnalytics";
import App from "./App.tsx";
import "./index.css";

prepareGoogleConsent();
createRoot(document.getElementById("root")!).render(<App />);
