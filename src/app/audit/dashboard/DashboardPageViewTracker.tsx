"use client";

import { useEffect } from "react";
import { trackEvent, tagRecording } from "@/lib/analytics";

/**
 * Fires dashboard landing page view for GA4 and tags the Hotjar recording.
 * Used on the main dashboard index only.
 */
export default function DashboardPageViewTracker() {
  useEffect(() => {
    trackEvent("dashboard_page_view", { page: "dashboard" });
    tagRecording(["dashboard"]);
  }, []);
  return null;
}
