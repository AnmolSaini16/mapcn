import { Metadata } from "next";
import Link from "next/link";

import { CodeCopyButton } from "@/components/code-copy-button";
import { Footer } from "@/components/footer";
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TextLink } from "@/components/text-link";
import { Button } from "@/components/ui/button";
import {
  checkoutEnabled,
  githubSponsorsUrl,
  sponsorEmail,
  sponsors,
  xProfileUrl,
} from "@/lib/sponsors";
import { PlacementPreviews } from "./_components/placement-preview";
import { SponsorContactButton } from "./_components/sponsor-contact-button";
import { SponsorStats } from "./_components/sponsor-stats";
import { SponsorTiers } from "./_components/sponsor-tiers";
import { SponsorWall } from "./_components/sponsor-wall";

export const metadata: Metadata = {
  title: "Sponsor",
  description:
    "Sponsor mapcn and put your product in front of developers building maps with React.",
};

export default function Page() {
  return (
    <>
      <div className="flex-1">
        <PageHeader size="sm">
          <PageHeaderHeading>Sponsor mapcn</PageHeaderHeading>
          <PageHeaderDescription>
            mapcn is free and open source. Sponsors help keep it that way while
            reaching developers who use mapcn to build their projects.
          </PageHeaderDescription>
          <PageActions className="max-sm:flex-row max-sm:gap-3">
            <Button asChild size="lg" className="rounded-lg">
              <Link href="#tiers">See tiers</Link>
            </Button>
            <SponsorContactButton
              variant="outline"
              size="lg"
              className="rounded-lg"
            >
              Email us
            </SponsorContactButton>
          </PageActions>
        </PageHeader>

        <div className="container pb-24">
          <div className="mx-auto max-w-6xl space-y-24 md:space-y-36">
            <SponsorStats />

            {sponsors.length > 0 && (
              <Section id="sponsors" label="Sponsors" title="Backed by">
                <SponsorWall />
              </Section>
            )}

            <Section
              id="placements"
              label="Placements"
              title="Seen where developers build"
            >
              <PlacementPreviews />
            </Section>

            <Section id="tiers" label="Pricing" title="Pick a tier">
              <SponsorTiers />
              <p className="text-muted-foreground text-center text-sm text-balance">
                {checkoutEnabled
                  ? "Billed monthly in USD through Dodo Payments."
                  : "Billed monthly in USD once your sponsorship is approved."}{" "}
                Cancel anytime. See the{" "}
                <TextLink href="/terms#sponsorships">terms</TextLink>.
                Supporting as an individual?{" "}
                <TextLink href={githubSponsorsUrl}>Sponsor on GitHub</TextLink>
              </p>
            </Section>

            <Section id="faq" label="FAQ" title="Common questions">
              <Accordion
                type="single"
                collapsible
                className="mx-auto max-w-2xl border-y"
              >
                {faqs.map((faq) => (
                  <AccordionItem key={faq.question} value={faq.question}>
                    <AccordionTrigger className="py-5 text-base hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-5 text-[15px] leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Section>

            <section className="bg-muted ring-foreground/5 dark:bg-muted/30 flex flex-col items-center gap-8 rounded-2xl px-6 py-14 text-center ring-1 md:py-20">
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold tracking-tight text-balance md:text-3xl">
                  Need something custom?
                </h2>
                <p className="text-muted-foreground mx-auto max-w-sm text-[15px] leading-relaxed text-pretty md:text-base">
                  A launch campaign, a different placement, or just a question
                  first. Happy to put something together.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <div className="bg-background ring-foreground/10 flex h-10 items-center gap-1 rounded-lg pr-1 pl-4 shadow-xs ring-1">
                  <span className="text-foreground/80 text-sm">
                    {sponsorEmail}
                  </span>
                  <CodeCopyButton
                    text={sponsorEmail}
                    label="Copy email"
                    className="bg-transparent"
                  />
                </div>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-lg"
                  asChild
                >
                  <a
                    href={xProfileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    DM on X
                  </a>
                </Button>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

function Section({
  id,
  label,
  title,
  children,
}: {
  id: string;
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="scroll-m-24 space-y-10 md:space-y-12"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-muted-foreground text-sm font-medium">{label}</p>
        <h2
          id={`${id}-heading`}
          className="text-foreground text-3xl font-semibold tracking-tight text-balance md:text-4xl"
        >
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

const faqs = [
  {
    question: "How does booking work?",
    answer: checkoutEnabled
      ? "Pick a tier with an open slot and pay through Dodo Payments, which handles invoices and tax. You land back on mapcn with a short list of what to send."
      : "Pick a tier with an open slot and reserve your spot by email. Once your sponsorship is approved, we send payment instructions and a short list of what to send.",
  },
  {
    question: "What do I need to send?",
    answer:
      "An SVG logo (plus a dark-mode version if it needs one), the link it should point to, and, for Platinum, a one-line tagline. A monochrome logo works best. Colour is fine too: it shows in grey to match the site, and in full colour on hover.",
  },
  {
    question: "When does my logo go live?",
    answer:
      "Within three business days of receiving all your assets and confirming payment.",
  },
  {
    question: "Can I cancel?",
    answer: checkoutEnabled
      ? "Yes. Sponsorships are month to month. Cancel from the link in your Dodo Payments receipt and your logo comes down at the end of your current billing period."
      : "Yes. Sponsorships are month to month. Email to cancel and your logo comes down at the end of your current billing period.",
  },
  {
    question: "How do I measure results?",
    answer:
      "Every sponsor link carries ref=mapcn.dev and UTM tags, so visits from mapcn show up in your own analytics.",
  },
];
