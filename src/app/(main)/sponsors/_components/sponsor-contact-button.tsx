"use client";

import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/events";
import { getSponsorAction, type SponsorTier } from "@/lib/sponsors";

interface SponsorContactButtonProps extends Omit<
  React.ComponentProps<typeof Button>,
  "asChild" | "onClick"
> {
  tier?: SponsorTier;
}

export function SponsorContactButton({
  tier,
  children,
  ...props
}: SponsorContactButtonProps) {
  const action = getSponsorAction(tier);

  return (
    <Button asChild {...props}>
      <a
        href={action.href}
        target={action.kind === "checkout" ? "_blank" : undefined}
        rel={action.kind === "checkout" ? "noopener noreferrer" : undefined}
        onClick={() =>
          trackEvent({
            name:
              action.kind === "checkout"
                ? "click_sponsor_checkout"
                : "click_sponsor_contact",
            properties: { tier: tier?.id ?? "custom" },
          })
        }
      >
        {children}
      </a>
    </Button>
  );
}
