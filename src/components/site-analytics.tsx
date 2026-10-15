"use client";

import { Analytics } from "@vercel/analytics/next";

export function SiteAnalytics() {
  return (
    <Analytics
      beforeSend={(event) => (window.self === window.top ? event : null)}
    />
  );
}
