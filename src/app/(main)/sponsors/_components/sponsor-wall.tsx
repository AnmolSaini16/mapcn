import Link from "next/link";
import { Plus } from "lucide-react";

import { SponsorLink } from "@/components/sponsor-link";
import { SponsorImage } from "@/components/sponsor-logos";
import {
  getOpenSlots,
  getSponsorsByTier,
  sponsorTiers,
  type SponsorTier,
  type SponsorTierId,
} from "@/lib/sponsors";
import { cn } from "@/lib/utils";

export function SponsorWall() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-10 text-left">
      {sponsorTiers.map((tier) => (
        <TierRow key={tier.id} tier={tier} />
      ))}
    </div>
  );
}

function TierRow({ tier }: { tier: SponsorTier }) {
  const sponsors = getSponsorsByTier(tier.id);
  const layout = tierLayouts[tier.id];
  const openSlots = getOpenSlots(tier);
  const emptySlots = openSlots ?? 1;

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between gap-4 text-sm">
        <h3 className="text-foreground font-medium">{tier.name}</h3>
        <span className="text-muted-foreground">
          {openSlots === undefined
            ? "Open"
            : `${openSlots} of ${tier.slots} open`}
        </span>
      </div>
      <div className={cn("grid gap-2", layout.grid)}>
        {sponsors.map((sponsor) => (
          <SponsorLink
            key={sponsor.name}
            sponsor={sponsor}
            placement="sponsors"
            className={cn(
              "bg-muted/50 ring-foreground/5 hover:bg-muted dark:bg-muted/30 dark:hover:bg-muted/50 flex items-center justify-center rounded-xl ring-1 transition-colors",
              layout.tile,
            )}
          >
            <SponsorImage sponsor={sponsor} className="h-1/2 w-2/3" />
          </SponsorLink>
        ))}
        {Array.from({ length: emptySlots }, (_, i) => (
          <Link
            key={i}
            href="#tiers"
            aria-label={`Sponsor mapcn at ${tier.name}`}
            className={cn(
              "text-muted-foreground hover:text-foreground ring-foreground/10 hover:bg-muted/30 flex items-center justify-center gap-1.5 rounded-xl text-sm ring-1 transition-colors ring-inset",
              layout.tile,
            )}
          >
            <Plus className="size-3.5" />
            {tier.id !== "silver" && <span>Your logo here</span>}
          </Link>
        ))}
      </div>
    </div>
  );
}

const tierLayouts: Record<SponsorTierId, { grid: string; tile: string }> = {
  platinum: { grid: "grid-cols-2", tile: "h-20 sm:h-28" },
  gold: { grid: "grid-cols-2 sm:grid-cols-4", tile: "h-20" },
  silver: { grid: "grid-cols-3 sm:grid-cols-6", tile: "h-14" },
};
