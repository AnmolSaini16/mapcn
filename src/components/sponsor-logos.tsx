import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { SponsorLink } from "@/components/sponsor-link";
import {
  getFeaturedSponsors,
  hasFeaturedSponsors,
  type Sponsor,
} from "@/lib/sponsors";
import { cn } from "@/lib/utils";

export function SponsorStrip({ className }: { className?: string }) {
  const { platinum, gold } = getFeaturedSponsors();

  return (
    <div
      className={cn(
        "bg-muted ring-foreground/5 dark:bg-muted/30 mx-auto w-full max-w-3xl rounded-2xl p-2 ring-1",
        className,
      )}
    >
      <div className="bg-border ring-foreground/10 dark:ring-foreground/5 flex flex-col gap-px overflow-hidden rounded-lg shadow-xs ring-1">
        {platinum.length > 0 && (
          <div
            className={cn(
              "grid gap-px",
              platinum.length > 1 && "sm:grid-cols-2",
            )}
          >
            {platinum.map((sponsor) => (
              <SponsorLink
                key={sponsor.name}
                sponsor={sponsor}
                placement="home"
                className={cn(
                  stripCellClassName,
                  "flex-col gap-2.5 px-6 py-8 text-center md:py-10",
                )}
              >
                <SponsorImage sponsor={sponsor} className="h-8 w-36" />
                {sponsor.tagline && (
                  <span className="text-muted-foreground group-hover:text-foreground/80 text-sm transition-colors">
                    {sponsor.tagline}
                  </span>
                )}
              </SponsorLink>
            ))}
          </div>
        )}
        {gold.length > 0 && (
          <div
            className={cn(
              "grid gap-px max-sm:[&>*:last-child:nth-child(odd)]:col-span-2",
              gold.length > 1 ? "grid-cols-2" : "grid-cols-1",
              goldColumns[Math.min(gold.length, 4)],
            )}
          >
            {gold.map((sponsor) => (
              <SponsorLink
                key={sponsor.name}
                sponsor={sponsor}
                placement="home"
                className={cn(stripCellClassName, "h-16 md:h-20")}
              >
                <SponsorImage sponsor={sponsor} className="h-6 w-24" />
              </SponsorLink>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function DocsSponsors({ className }: { className?: string }) {
  const { platinum, gold } = getFeaturedSponsors();

  if (!hasFeaturedSponsors()) {
    return (
      <Link
        href="/sponsors"
        className={cn(
          "bg-muted/60 hover:bg-muted dark:bg-muted/30 dark:hover:bg-muted/50 -ml-3 block rounded-xl px-3 py-3 transition-colors",
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
        {platinum.map((sponsor) => (
          <SponsorLink
            key={sponsor.name}
            sponsor={sponsor}
            placement="docs"
            className={cn(
              docsTileClassName,
              "flex flex-col gap-2 rounded-xl p-3",
            )}
          >
            <SponsorImage
              sponsor={sponsor}
              className="h-6 w-full"
              imageClassName="object-left"
            />
            {sponsor.tagline && (
              <span className="text-muted-foreground group-hover:text-foreground/80 text-xs leading-relaxed transition-colors">
                {sponsor.tagline}
              </span>
            )}
          </SponsorLink>
        ))}
        {gold.length > 0 && (
          <div
            className={cn(
              "grid grid-cols-2 gap-x-4 gap-y-3 px-3",
              platinum.length > 0 && "pt-2",
            )}
          >
            {gold.map((sponsor) => (
              <SponsorLink
                key={sponsor.name}
                sponsor={sponsor}
                placement="docs"
                className="flex items-center"
              >
                <SponsorImage
                  sponsor={sponsor}
                  className="h-5 w-full"
                  imageClassName="object-left"
                />
              </SponsorLink>
            ))}
          </div>
        )}
      </div>
      <Link
        href="/sponsors"
        className="group text-muted-foreground/70 hover:text-foreground mt-4 flex items-center gap-1 text-xs transition-colors"
      >
        Become a sponsor
        <ChevronRight className="size-3 transition-transform group-hover:translate-x-0.5" />
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
  const baseClassName = cn(
    "object-contain opacity-70 grayscale transition-[opacity,filter] duration-200 group-hover:opacity-100 group-hover:grayscale-0 group-focus-visible:opacity-100 group-focus-visible:grayscale-0",
    imageClassName,
  );

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

const docsTileClassName =
  "bg-muted/60 hover:bg-muted dark:bg-muted/30 dark:hover:bg-muted/50 transition-colors";

const stripCellClassName =
  "bg-background hover:bg-[color-mix(in_oklab,var(--muted)_35%,var(--background))] flex items-center justify-center transition-colors duration-200";

const goldColumns: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
};
