"use client";

import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/events";
import { sponsorMailto, type SponsorAction } from "@/lib/sponsors";

interface SponsorContactButtonProps extends Omit<
  React.ComponentProps<typeof Button>,
  "asChild" | "onClick"
> {
  action?: SponsorAction;
}

export function SponsorContactButton({
  action,
  children,
  ...props
}: SponsorContactButtonProps) {
  const { kind, href } = action ?? { kind: "contact", href: sponsorMailto() };

  return (
    <Button asChild {...props}>
      <a
        href={href}
        target={kind === "checkout" ? "_blank" : undefined}
        rel={kind === "checkout" ? "noopener noreferrer" : undefined}
        onClick={() =>
          trackEvent({
            name:
              kind === "checkout"
                ? "click_sponsor_checkout"
                : "click_sponsor_contact",
            properties: { tier: action ? "sponsorship" : "custom" },
          })
        }
      >
        {children}
      </a>
    </Button>
  );
}
