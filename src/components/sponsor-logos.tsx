import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Plus } from "lucide-react";

import { SponsorLink } from "@/components/sponsor-link";
import { openSlots, sponsors, type Sponsor } from "@/lib/sponsors";
import { cn } from "@/lib/utils";

const stripCellClassName =
  "bg-background flex h-18 min-w-[calc(50%-1px)] flex-1 items-center justify-center px-4 transition-colors sm:min-w-[calc(25%-1px)] duration-200 hover:bg-[color-mix(in_oklab,var(--muted)_35%,var(--background))] md:h-20";

export function SponsorStrip({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-muted ring-foreground/5 dark:bg-muted/30 mx-auto w-full max-w-3xl rounded-2xl p-2 ring-1",
        className,
      )}
    >
      <div className="bg-border ring-foreground/10 dark:ring-foreground/5 flex flex-wrap gap-px overflow-hidden rounded-lg ring-1">
        {sponsors.map((sponsor) => (
          <SponsorLink
            key={sponsor.name}
            sponsor={sponsor}
            placement="home"
            className={stripCellClassName}
          >
            <SponsorImage sponsor={sponsor} className="h-8 w-full sm:h-10" />
          </SponsorLink>
        ))}
        {Array.from({ length: openSlots }, (_, i) => (
          <Link
            key={i}
            href="/sponsors"
            className={cn(
              stripCellClassName,
              "text-muted-foreground/60 hover:text-foreground gap-1.5 text-sm",
            )}
          >
            <Plus className="size-3.5" />
            <span>Your logo here</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function DocsSponsors({ className }: { className?: string }) {
  if (sponsors.length === 0) {
    return (
      <Link
        href="/sponsors"
        className={cn(
          "bg-muted/60 hover:bg-muted dark:bg-muted/30 dark:hover:bg-muted/50 -ml-3 block rounded-xl px-3 py-3 transition-colors focus-visible:-outline-offset-2",
          className,
        )}
      >
        <span className="block text-sm font-medium">Sponsor mapcn</span>
        <span className="text-muted-foreground mt-1.5 block text-xs leading-relaxed">
          Reach developers building with mapcn.
        </span>
      </Link>
    );
  }

  return (
    <div className={cn("flex flex-col", className)}>
      <p className="text-muted-foreground mb-3 text-xs font-medium">Sponsors</p>
      <div className="-mx-3 flex flex-col gap-2">
        {sponsors.map((sponsor) => (
          <SponsorLink
            key={sponsor.name}
            sponsor={sponsor}
            placement="docs"
            className="bg-muted/60 hover:bg-muted dark:bg-muted/30 dark:hover:bg-muted/50 block rounded-xl px-3 py-3.5 transition-colors focus-visible:-outline-offset-2"
          >
            <SponsorImage
              sponsor={sponsor}
              className="h-7.5 w-full"
              imageClassName="object-left"
            />
          </SponsorLink>
        ))}
      </div>
      <Link
        href="/sponsors"
        className="text-muted-foreground/75 hover:text-foreground mt-4 flex items-center gap-1 text-xs transition-colors"
      >
        Become a sponsor
        <ChevronRight className="size-3" />
      </Link>
    </div>
  );
}

export function SponsorImage({
  sponsor,
  className,
  imageClassName,
}: {
  sponsor: Sponsor;
  className?: string;
  imageClassName?: string;
}) {
  const baseClassName = cn("object-contain", imageClassName);

  return (
    <span className={cn("relative block", className)}>
      <Image
        src={sponsor.logo}
        alt=""
        fill
        sizes="208px"
        className={cn(baseClassName, sponsor.logoDark && "dark:hidden")}
      />
      {sponsor.logoDark && (
        <Image
          src={sponsor.logoDark}
          alt=""
          fill
          sizes="208px"
          className={cn(baseClassName, "hidden dark:block")}
        />
      )}
    </span>
  );
}
