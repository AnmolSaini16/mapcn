"use client";

import { Analytics } from "@vercel/analytics/next";

// Block previews embed /view pages in iframes. Count only top-level pages so a
// visit to /blocks doesn't also log a pageview for every preview it loads.
export function SiteAnalytics() {
  return (
    <Analytics
      beforeSend={(event) => (window.self === window.top ? event : null)}
    />
  );
}
