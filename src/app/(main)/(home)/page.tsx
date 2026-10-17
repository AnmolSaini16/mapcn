import Link from "next/link";
import { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";

import { HeroInstallCommand } from "./_components/hero-install-command";
import { MapWall } from "./_components/map-wall";
import { Footer } from "@/components/footer";
import {
  PageHeader,
  PageHeaderHeading,
  PageHeaderDescription,
  PageActions,
} from "@/components/page-header";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <>
      <div className="flex-1">
        <PageHeader animated className="pt-7 md:pt-12 lg:pt-18 lg:pb-16">
          <Link
            href="/docs/skill"
            style={{ "--stagger": 1 } as CSSProperties}
            className="animate-fade-up animate-stagger text-muted-foreground hover:text-foreground -mb-1 inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors"
          >
            Agent skill for mapcn
            <ArrowRight className="size-3" />
          </Link>
          <PageHeaderHeading>Beautiful maps, made simple</PageHeaderHeading>
          <PageHeaderDescription>
            Ready to use, customizable map components for React.{" "}
            <br className="hidden sm:block" />
            Built on MapLibre. Styled with Tailwind.
          </PageHeaderDescription>
          <PageActions>
            <HeroInstallCommand className="max-w-full" />
            <Button asChild size="lg" className="min-w-36 justify-center">
              <Link href="/docs">Get Started</Link>
            </Button>
          </PageActions>
        </PageHeader>

        <section
          className="animate-fade-up animate-stagger relative"
          style={
            {
              "--stagger": 4.5,
            } as CSSProperties
          }
        >
          <div className="relative h-[34rem] overflow-hidden mask-b-from-65% max-md:mask-r-from-85% max-md:mask-l-from-85% md:h-[44rem] lg:h-[clamp(52rem,calc(100svh-28.5rem),90rem)]">
            <div className="absolute inset-0 [background-image:radial-gradient(var(--color-border)_1px,transparent_0)] mask-t-from-0% [background-size:24px_24px]" />
            <MapWall className="pt-6" />
          </div>

          <p className="text-muted-foreground absolute inset-x-0 bottom-4 container text-right text-xs">
            Map data ©{" "}
            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              OpenStreetMap
            </a>{" "}
            contributors · ©{" "}
            <a
              href="https://carto.com/attributions"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              CARTO
            </a>
          </p>
        </section>
      </div>

      <Footer className="mt-0!" />
    </>
  );
}
