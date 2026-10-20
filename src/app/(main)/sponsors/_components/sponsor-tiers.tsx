import { Check } from "lucide-react";

import {
  getOpenSlots,
  getSponsorAction,
  sponsorTiers,
  type SponsorTier,
} from "@/lib/sponsors";
import { SponsorContactButton } from "./sponsor-contact-button";

export function SponsorTiers() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {sponsorTiers.map((tier) => (
        <TierCard key={tier.id} tier={tier} />
      ))}
    </div>
  );
}

function TierCard({ tier }: { tier: SponsorTier }) {
  const openSlots = getOpenSlots(tier);
  const action = getSponsorAction(tier);
  const label = {
    checkout: `Sponsor as ${tier.name}`,
    waitlist: "Join the waitlist",
    contact: "Reserve a spot",
  }[action.kind];

  return (
    <div className="bg-muted ring-foreground/5 dark:bg-muted/30 flex flex-col rounded-2xl p-2 ring-1">
      <div className="bg-background ring-foreground/10 dark:ring-foreground/5 flex flex-1 flex-col rounded-lg p-6 shadow-xs ring-1 md:p-7">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-lg font-medium">{tier.name}</h3>
          <span className="text-muted-foreground text-sm tabular-nums">
            {openSlots === undefined
              ? "Open"
              : `${openSlots} of ${tier.slots} open`}
          </span>
        </div>
        <p className="mt-4 flex items-baseline gap-1">
          <span className="text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl">
            ${tier.price}
          </span>
          <span className="text-muted-foreground text-base">/month</span>
        </p>
        <ul className="mt-6 mb-7 space-y-2.5 text-[15px]">
          {tier.perks.map((perk) => (
            <li key={perk} className="flex gap-2.5">
              <Check className="text-muted-foreground mt-1 size-4 shrink-0" />
              <span>{perk}</span>
            </li>
          ))}
        </ul>
        <SponsorContactButton
          tier={tier}
          variant={
            tier.id === "platinum" && action.kind !== "waitlist"
              ? "default"
              : "outline"
          }
          size="lg"
          className="mt-auto w-full rounded-lg"
        >
          {label}
        </SponsorContactButton>
      </div>
    </div>
  );
}
