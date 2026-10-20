import { Metadata } from "next";
import Link from "next/link";

import { Footer } from "@/components/footer";
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { TextLink } from "@/components/text-link";
import { Button } from "@/components/ui/button";
import {
  checkoutEnabled,
  getSponsorTier,
  sponsorAssetsMailto,
  sponsorEmail,
  xProfileUrl,
  type SponsorTierId,
} from "@/lib/sponsors";

export const metadata: Metadata = {
  title: "Thank you",
  description: "Your mapcn sponsorship is confirmed.",
  robots: { index: false, follow: false },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const tier = getSponsorTier(params.tier);

  if (
    params.status !== undefined &&
    !paidStatuses.includes(`${params.status}`)
  ) {
    return <PaymentPending />;
  }

  const items = assetChecklist.filter(
    (item) => !item.tiers || !tier || item.tiers.includes(tier.id),
  );

  return (
    <>
      <div className="flex-1">
        <PageHeader size="sm">
          <PageHeaderHeading>
            {tier
              ? `You're a ${tier.name} sponsor`
              : "Thanks for sponsoring mapcn"}
          </PageHeaderHeading>
          <PageHeaderDescription>
            Your sponsorship is confirmed. Thank you for helping keep mapcn free
            and open source.
          </PageHeaderDescription>
        </PageHeader>

        <div className="container pb-24">
          <div className="mx-auto max-w-2xl space-y-10">
            <section className="space-y-6">
              <div className="space-y-1.5">
                <h2 className="text-xl font-semibold tracking-tight">
                  What to send next
                </h2>
                <p className="text-muted-foreground text-[15px]">
                  Send these over and your logo goes live within three business
                  days.
                </p>
              </div>

              <div className="bg-muted ring-foreground/5 dark:bg-muted/30 rounded-2xl p-2 ring-1">
                <ol className="bg-background ring-foreground/10 dark:ring-foreground/5 divide-y rounded-lg shadow-xs ring-1">
                  {items.map((item, index) => (
                    <li
                      key={item.title}
                      className="flex items-baseline gap-4 px-5 py-4"
                    >
                      <span className="text-muted-foreground text-sm tabular-nums">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="space-y-1">
                        <p className="text-[15px] font-medium">{item.title}</p>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {item.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button asChild size="lg" className="rounded-lg">
                  <a href={sponsorAssetsMailto(tier)}>Email your assets</a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-lg"
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

            <section className="text-muted-foreground space-y-3 border-t pt-8 text-sm leading-relaxed">
              <p>
                Your sponsorship renews monthly until you cancel.{" "}
                {checkoutEnabled
                  ? "You can cancel or update your card from the link in your Dodo Payments receipt,"
                  : "Email to cancel or change your billing details,"}{" "}
                and your sponsorship remains active until the end of your
                current paid billing period.
              </p>
              <p>
                Questions? Email{" "}
                <TextLink href={`mailto:${sponsorEmail}`}>
                  {sponsorEmail}
                </TextLink>{" "}
                or head back to the{" "}
                <TextLink href="/sponsors">sponsors page</TextLink>.
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

function PaymentPending() {
  return (
    <>
      <div className="flex-1">
        <PageHeader size="sm">
          <PageHeaderHeading>Payment not confirmed</PageHeaderHeading>
          <PageHeaderDescription>
            Your payment hasn&apos;t gone through. Try again from the tiers, or
            email us if you were charged and we&apos;ll sort it out.
          </PageHeaderDescription>
          <PageActions className="max-sm:flex-row max-sm:gap-3">
            <Button asChild size="lg" className="rounded-lg">
              <Link href="/sponsors#tiers">Back to tiers</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-lg">
              <a href={`mailto:${sponsorEmail}`}>Email us</a>
            </Button>
          </PageActions>
        </PageHeader>
      </div>

      <Footer />
    </>
  );
}

const paidStatuses = ["active", "succeeded"];

const assetChecklist: {
  title: string;
  detail: string;
  tiers?: SponsorTierId[];
}[] = [
  {
    title: "Your logo",
    detail:
      "An SVG, monochrome if you have one. Colour works too: it shows in grey to match the site, and in full colour on hover.",
  },
  {
    title: "A dark mode version",
    detail:
      "Only if your logo needs one to stay readable on a dark background.",
  },
  {
    title: "Your link",
    detail:
      "Where your logo should point. ref=mapcn.dev and UTM tags are added for you.",
  },
  {
    title: "A one-line tagline",
    detail: "Shown under your logo on the homepage and every docs page.",
    tiers: ["platinum"],
  },
  {
    title: "Your X handle",
    detail: "For your one-time shoutout on X.",
    tiers: ["platinum", "gold"],
  },
];
