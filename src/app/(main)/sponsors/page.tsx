import { Metadata } from "next";
import Link from "next/link";

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
import { Button } from "@/components/ui/button";
import { checkoutEnabled, sponsors } from "@/lib/sponsors";
import { PlacementPreviews } from "./_components/placement-preview";
import { SponsorContactButton } from "./_components/sponsor-contact-button";
import { SponsorCustom } from "./_components/sponsor-custom";
import { SponsorStats } from "./_components/sponsor-stats";
import { SponsorWall } from "./_components/sponsor-wall";
import { SponsorshipCard } from "./_components/sponsorship-card";

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
              <Link href="#sponsorship">Become a sponsor</Link>
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
          <div className="mx-auto max-w-7xl space-y-24 md:space-y-36">
            <SponsorStats />

            {sponsors.length > 0 && (
              <Section id="sponsors" title="Backed by">
                <SponsorWall />
              </Section>
            )}

            <Section id="placements" title="Seen where developers build">
              <PlacementPreviews />
            </Section>

            <Section id="sponsorship" title="One sponsorship, every placement">
              <SponsorshipCard />
            </Section>

            <Section id="faq" title="Common questions">
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

            <SponsorCustom />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="scroll-m-24 space-y-10 md:space-y-12"
    >
      <h2
        id={`${id}-heading`}
        className="text-foreground text-center text-3xl font-semibold tracking-tight text-balance md:text-4xl"
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

const faqs = [
  {
    question: "How does booking work?",
    answer: checkoutEnabled
      ? "Pick an open spot and pay through Dodo Payments, which handles invoices and tax. You land back on mapcn with a short list of what to send. We review every sponsorship, and if we can't place yours, you get a full refund."
      : "Reserve an open spot by email. Once your sponsorship is approved, we send payment instructions and a short list of what to send.",
  },
  {
    question: "What do I need to send?",
    answer:
      "Your company name exactly as you want it written, an SVG logo (plus a dark-mode version if it needs one), and the link it should point to. A monochrome logo works best. Colour is fine too: it shows in grey to match the site, and in full colour on hover.",
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
