import Link from "next/link";
import { CSSProperties } from "react";
import { ChevronRight } from "lucide-react";

import { HeroInstallCommand } from "./_components/hero-install-command";
import { MapWall } from "./_components/map-wall";
import { Footer } from "@/components/footer";
import { SponsorStrip } from "@/components/sponsor-logos";
import {
  PageHeader,
  PageHeaderHeading,
  PageHeaderDescription,
  PageActions,
} from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { openSlots, sponsors } from "@/lib/sponsors";

export default function Page() {
  return (
    <>
      <div className="flex-1">
        <PageHeader animated className="pt-7 pb-12 md:pt-12 md:pb-14 lg:pt-16">
          <Badge
            asChild
            variant="secondary"
            style={{ "--stagger": 1 } as CSSProperties}
            className="animate-fade-up animate-stagger bg-muted/50 text-foreground/80 ring-foreground/5 dark:bg-muted/30 [a&]:hover:bg-muted [a&]:hover:text-foreground dark:[a&]:hover:bg-muted/50 -mb-1 gap-0.5 py-1 pr-1.5 pl-2.5 ring-1"
          >
            <Link href="/docs/skill">
              Agent skill for mapcn
              <ChevronRight className="size-3.5" />
            </Link>
          </Badge>
          <PageHeaderHeading>Beautiful maps, made simple</PageHeaderHeading>
          <PageHeaderDescription className="sm:text-wrap">
            Ready to use, customizable map components for React.{" "}
            <br className="hidden sm:block" />
            Built on MapLibre. Styled with Tailwind.
          </PageHeaderDescription>
          <PageActions>
            <HeroInstallCommand className="max-w-full" />
            <Button asChild size="lg" className="rounded-lg">
              <Link href="/docs">Get Started</Link>
            </Button>
          </PageActions>
        </PageHeader>

        <section
          className="animate-fade-up animate-stagger"
          style={
            {
              "--stagger": 4.5,
            } as CSSProperties
          }
        >
          <div className="relative h-[34rem] overflow-hidden mask-b-from-65% max-md:mask-r-from-85% max-md:mask-l-from-85% md:h-[44rem] lg:h-[clamp(52rem,calc(100svh-28.5rem),90rem)]">
            <MapWall className="pt-6" />
          </div>
        </section>

        {sponsors.length > 0 && (
          <section className="container flex flex-col items-center gap-6 pt-16 pb-24 md:pt-20 md:pb-28">
            <h2 className="text-muted-foreground text-center text-sm text-balance">
              Backed by the teams keeping mapcn free and open source
            </h2>
            <SponsorStrip />
            {openSlots === 0 && (
              <Link
                href="/sponsors"
                className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm transition-colors"
              >
                Become a sponsor
                <ChevronRight className="size-3.5" />
              </Link>
            )}
          </section>
        )}
      </div>

      <Footer className="mt-0!" />
    </>
  );
}
