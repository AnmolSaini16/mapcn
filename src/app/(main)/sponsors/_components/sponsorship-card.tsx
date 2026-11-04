import { Check } from "lucide-react";

import { TextLink } from "@/components/text-link";
import {
  checkoutEnabled,
  getSponsorAction,
  githubSponsorsUrl,
  openSlots,
  sponsorActionLabels,
  sponsorship,
} from "@/lib/sponsors";
import { SponsorContactButton } from "./sponsor-contact-button";

export function SponsorshipCard() {
  const action = getSponsorAction();

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
      <div className="bg-muted ring-foreground/5 dark:bg-muted/30 rounded-2xl p-2 ring-1">
        <div className="bg-background ring-foreground/10 dark:ring-foreground/5 grid overflow-hidden rounded-lg shadow-xs ring-1 md:grid-cols-2">
          <div className="flex flex-col p-6 sm:p-8 md:p-10">
            <p className="flex items-baseline gap-1">
              <span className="text-4xl font-semibold tracking-tight tabular-nums">
                ${sponsorship.price}
              </span>
              <span className="text-muted-foreground text-base">/month</span>
            </p>
            <p className="text-muted-foreground mt-3 max-w-xs text-sm leading-relaxed text-pretty">
              One sponsorship with every placement. Month to month, cancel
              anytime.
            </p>
            <div className="mt-8 space-y-3 md:mt-auto md:pt-8">
              <SponsorContactButton
                action={action}
                variant={action.kind === "waitlist" ? "outline" : "default"}
                size="lg"
                className="w-full rounded-lg"
              >
                {sponsorActionLabels[action.kind]}
              </SponsorContactButton>
              <p className="text-muted-foreground text-center text-sm tabular-nums">
                {openSlots === 0
                  ? "Fully booked"
                  : `${openSlots} of ${sponsorship.slots} spots open`}
              </p>
            </div>
          </div>

          <div className="flex flex-col border-t p-6 sm:p-8 md:border-t-0 md:border-l md:p-10">
            <p className="text-muted-foreground text-sm">What you get</p>
            <ul className="mt-5 space-y-4 text-[15px]">
              {sponsorship.perks.map((perk) => (
                <li key={perk} className="flex gap-3">
                  <Check className="text-muted-foreground mt-1 size-4 shrink-0" />
                  <span className="text-pretty">{perk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <p className="text-muted-foreground text-center text-sm text-balance">
        {checkoutEnabled
          ? "Billed monthly in USD through Dodo Payments."
          : "Billed monthly in USD once your sponsorship is approved."}{" "}
        See the <TextLink href="/terms#sponsorships">terms</TextLink>.
        Supporting as an individual?{" "}
        <TextLink href={githubSponsorsUrl}>Sponsor on GitHub</TextLink>
      </p>
    </div>
  );
}
