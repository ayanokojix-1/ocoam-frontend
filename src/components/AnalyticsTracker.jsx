import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// GA4's gtag.js only fires an automatic page_view on the very first script
// load — it has no idea when React Router changes the URL client-side.
// This sends one page_view per route change instead.
export default function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.gtag !== "function") return;

    window.gtag("event", "page_view", {
      page_path: location.pathname + location.search,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [location.pathname, location.search]);

  return null;
}
