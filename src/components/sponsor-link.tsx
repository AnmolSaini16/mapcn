"use client";

import { trackEvent } from "@/lib/events";
import { sponsorHref, type Sponsor } from "@/lib/sponsors";
import { cn } from "@/lib/utils";

export function SponsorLink({
  sponsor,
  placement,
  className,
  children,
}: {
  sponsor: Sponsor;
  placement: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={sponsorHref(sponsor.href, placement)}
      target="_blank"
      rel="sponsored noopener"
      aria-label={sponsor.name}
      onClick={() =>
        trackEvent({
          name: "click_sponsor",
          properties: { sponsor: sponsor.name, placement },
        })
      }
      className={cn("group", className)}
    >
      {children}
    </a>
  );
}
