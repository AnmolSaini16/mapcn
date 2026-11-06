import Link from "next/link";
import { Plus } from "lucide-react";

import { SponsorLink } from "@/components/sponsor-link";
import { SponsorImage } from "@/components/sponsor-logos";
import { openSlots, sponsors } from "@/lib/sponsors";

export function SponsorWall() {
  return (
    <div className="mx-auto grid w-full max-w-4xl grid-cols-2 gap-2 sm:grid-cols-4">
      {sponsors.map((sponsor) => (
        <SponsorLink
          key={sponsor.name}
          sponsor={sponsor}
          placement="sponsors"
          className="bg-muted/50 ring-foreground/5 hover:bg-muted dark:bg-muted/30 dark:hover:bg-muted/50 flex h-24 items-center justify-center rounded-xl ring-1 transition-colors"
        >
          <SponsorImage sponsor={sponsor} className="h-1/2 w-2/3" />
        </SponsorLink>
      ))}
      {Array.from({ length: openSlots }, (_, i) => (
        <Link
          key={i}
          href="#sponsorship"
          className="text-muted-foreground hover:text-foreground ring-foreground/10 hover:bg-muted/30 flex h-24 items-center justify-center gap-1.5 rounded-xl text-sm ring-1 transition-colors ring-inset"
        >
          <Plus className="size-3.5" />
          <span>Your logo here</span>
        </Link>
      ))}
    </div>
  );
}
