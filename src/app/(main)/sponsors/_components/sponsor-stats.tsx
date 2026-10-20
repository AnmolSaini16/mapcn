import { Suspense } from "react";

import { getStarCount } from "@/components/github-button";
import { Skeleton } from "@/components/ui/skeleton";
import { siteStats } from "@/lib/sponsors";

export function SponsorStats() {
  return (
    <div className="bg-muted ring-foreground/5 dark:bg-muted/30 mx-auto w-full max-w-4xl rounded-2xl p-2 ring-1">
      <dl className="bg-background ring-foreground/10 dark:ring-foreground/5 grid grid-cols-2 rounded-lg text-left shadow-xs ring-1 sm:grid-cols-4 sm:divide-x max-sm:[&>*:nth-child(-n+2)]:border-b max-sm:[&>*:nth-child(even)]:border-l">
        {siteStats.map((stat) => (
          <Stat key={stat.label} label={stat.label}>
            {stat.value}
          </Stat>
        ))}
        <Stat label="GitHub stars">
          <Suspense
            fallback={
              <Skeleton className="h-8 w-14 sm:h-10 sm:w-20 md:h-12 md:w-24" />
            }
          >
            <Stars />
          </Suspense>
        </Stat>
      </dl>
    </div>
  );
}

function Stat({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col-reverse justify-end gap-1.5 p-4 sm:p-6 md:gap-3 md:px-8 md:py-9">
      <dt className="text-muted-foreground text-xs sm:text-sm">{label}</dt>
      <dd className="text-2xl font-semibold tracking-tight tabular-nums sm:text-4xl md:text-5xl">
        {children}
      </dd>
    </div>
  );
}

async function Stars() {
  return (await getStarCount())?.toUpperCase() ?? "—";
}
