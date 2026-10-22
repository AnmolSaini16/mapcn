import { Metadata } from "next";
import { Footer } from "@/components/footer";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { TextLink } from "@/components/text-link";
import { githubRepoUrl } from "@/lib/site-navigation";
import {
  checkoutEnabled,
  githubSponsorsUrl,
  sponsorEmail,
  xProfileUrl,
} from "@/lib/sponsors";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "Terms of service, privacy policy, and refund and cancellation policy for mapcn.",
};

export default function Page() {
  return (
    <>
      <div className="flex-1">
        <PageHeader size="sm">
          <PageHeaderHeading>Terms</PageHeaderHeading>
          <PageHeaderDescription>
            The terms for using mapcn, how sponsorships work, what data the site
            collects, and how refunds and cancellations are handled.
          </PageHeaderDescription>
          <nav
            aria-label="Sections"
            className="text-muted-foreground mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm"
          >
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="hover:text-foreground transition-colors"
              >
                {section.title}
              </a>
            ))}
          </nav>
        </PageHeader>

        <div className="container pb-24">
          <div className="mx-auto max-w-2xl space-y-16">
            <Section id="terms" title="Terms of Service">
              <p>
                These terms cover your use of mapcn.dev and sponsorships. mapcn
                is run by Anmoldeep Singh, an independent developer. By using
                the site or sponsoring, you agree to them. Using the mapcn code
                is covered only by its license, below.
              </p>

              <h3>Open-source license</h3>
              <p>
                mapcn is free and open source under the MIT License. The{" "}
                <TextLink href={`${githubRepoUrl}/blob/main/LICENSE`}>
                  LICENSE file
                </TextLink>{" "}
                governs your use of the code, and these terms don&apos;t add any
                restrictions to it. The code is provided as is, without warranty
                of any kind. The license covers the code, not the mapcn name or
                logo.
              </p>

              <h3>Basemaps</h3>
              <p>
                The default map styles use CARTO basemaps, built on
                OpenStreetMap data. If you use them in your own app,
                CARTO&apos;s{" "}
                <TextLink href="https://carto.com/legal/basemap-terms/">
                  basemap terms
                </TextLink>
                , usage limits and attribution requirements apply to you. These
                can change, so check CARTO&apos;s{" "}
                <TextLink href="https://docs.carto.com/faqs/carto-basemaps">
                  current limits
                </TextLink>{" "}
                before relying on them in production.
              </p>

              <h3 id="sponsorships">Sponsorships</h3>
              <p>
                A sponsorship is a monthly placement of your logo and link on
                mapcn.dev and in the README, depending on the tier. Tiers,
                prices and what each includes are listed on the{" "}
                <TextLink href="/sponsors">sponsors page</TextLink>.
              </p>
              <p>
                {checkoutEnabled ? (
                  <>
                    You pay at checkout through Dodo Payments, which sells the
                    sponsorship as our reseller (merchant of record) under its{" "}
                    <TextLink href="https://dodopayments.com/legal/buyer-terms">
                      Buyer Terms
                    </TextLink>
                    . Sponsorships are billed monthly in USD and renew until
                    cancelled.
                  </>
                ) : (
                  "Sponsorships are currently arranged by email. Once a sponsorship is approved, we send payment instructions. Sponsorships are billed monthly in USD and renew until cancelled, under the payment arrangement we agree with you."
                )}
              </p>
              <p>
                We aim to publish approved sponsor assets within three business
                days after receiving all required materials (your logo, link
                and, for Platinum, a tagline) and confirming payment. Your logo
                stays up for as long as your sponsorship is active. Traffic
                figures on the sponsors page describe past traffic and
                aren&apos;t a guarantee of future views or clicks.
              </p>
              <p>
                Individual sponsorships through{" "}
                <TextLink href={githubSponsorsUrl}>GitHub Sponsors</TextLink>{" "}
                are handled by GitHub under its own terms.
              </p>

              <h3>Sponsor approval</h3>
              <p>
                We review every sponsorship. We may decline a sponsorship, or
                remove a live one, for example if the product is unrelated to
                mapcn, misleading, or harmful. What you get back in each case is
                set out in the{" "}
                <TextLink href="#refunds">refund policy</TextLink>.
              </p>

              <h3>Sponsor content</h3>
              <p>
                You confirm you have the right to use the logo, name and tagline
                you send, and you allow us to show them on mapcn.dev and in the
                README while your sponsorship is active. Logos are shown in grey
                to match the site, and in full colour on hover.
              </p>

              <h3>Changes</h3>
              <p>
                We may update these terms from time to time. Changes apply from
                when they&apos;re published on this page.
              </p>
            </Section>

            <Section id="privacy" title="Privacy Policy">
              <p>
                mapcn.dev has no accounts or sign-up. This section explains what
                data the site collects and who handles it.
              </p>

              <h3>Analytics</h3>
              <p>
                We use{" "}
                <TextLink href="https://vercel.com/docs/analytics/privacy-policy">
                  Vercel Web Analytics
                </TextLink>{" "}
                to count page views and a few actions, like copying an install
                command or clicking a sponsor link. It doesn&apos;t set cookies,
                and the events we send don&apos;t include personal information.
                Sponsor links carry ref and UTM tags so sponsors can see a visit
                came from mapcn. Nothing about you is added to them.
              </p>

              <h3>Hosting and third-party services</h3>
              <p>
                The site is hosted on Vercel, which processes standard request
                data such as your IP address and browser details to serve pages.
                Maps and examples load tiles, styles and images from third-party
                services such as CARTO, which receive the same kind of request
                data.
              </p>

              <h3>Preferences</h3>
              <p>
                Your light or dark theme choice is saved in your browser&apos;s
                local storage, and the docs sidebar may save its open state in a
                cookie. Neither is used for tracking.
              </p>

              {checkoutEnabled && (
                <>
                  <h3>Payments</h3>
                  <p>
                    Sponsorship payments are processed by Dodo Payments, which
                    collects your payment details to process them under its own{" "}
                    <TextLink href="https://dodopayments.com/legal/privacy-policy">
                      privacy policy
                    </TextLink>
                    . We never see or store your full card details. We receive
                    your contact and billing details, such as your name and
                    email address, and your payment status to run your
                    sponsorship.
                  </p>
                </>
              )}

              <h3>Emails and sponsorships</h3>
              <p>
                If you email us or sponsor mapcn, we keep your messages and the
                details you send, such as your name, company, logo, link and X
                handle, to arrange and run your sponsorship. We don&apos;t sell
                your personal data or use it for targeted advertising. The site
                shows sponsor logos, but they&apos;re the same for every visitor
                and don&apos;t use your data.
              </p>
              <p>
                To ask what we hold about you, or to have it corrected or
                deleted, email{" "}
                <TextLink href={`mailto:${sponsorEmail}`}>
                  {sponsorEmail}
                </TextLink>
                .
              </p>
            </Section>

            <Section id="refunds" title="Refund & Cancellation Policy">
              <h3>Cancelling</h3>
              <p>
                Sponsorships are month to month, and you can cancel anytime{" "}
                {checkoutEnabled
                  ? "from the link in your Dodo Payments receipt or by email"
                  : "by email"}
                . Your sponsorship remains active until the end of your current
                paid billing period, and you won&apos;t be charged again.
              </p>

              <h3>Refunds</h3>
              <p>
                Partial billing periods are not refunded for voluntary
                cancellations. Exceptions apply to undelivered placements and
                sponsorships terminated by mapcn without sponsor misconduct.
              </p>
              <p>
                If mapcn is unable to deliver an agreed sponsorship placement, a
                refund will be provided for the undelivered portion.
              </p>
              <p>
                We reserve the right to remove sponsorships that materially
                violate our terms. Such removals do not automatically qualify
                for a refund. Refund requests may be reviewed individually.
              </p>
              <p>
                If mapcn ends a sponsorship for reasons unrelated to a
                sponsor&apos;s conduct, a prorated refund will be provided for
                the unused portion of the paid period.
              </p>
              <p>
                To request a refund, email us from the address you used to
                sponsor. Joining the waitlist is free and doesn&apos;t commit
                you to anything.
              </p>
              <p>
                Refunds remain subject to applicable law and payment-provider
                requirements.
              </p>
            </Section>

            <Section id="contact" title="Contact">
              <p>
                For questions about these terms, your data, or a sponsorship,
                email{" "}
                <TextLink href={`mailto:${sponsorEmail}`}>
                  {sponsorEmail}
                </TextLink>{" "}
                or <TextLink href={xProfileUrl}>DM on X</TextLink>.
              </p>
            </Section>
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
      className="text-foreground/85 [&_h3]:text-foreground scroll-m-24 space-y-4 text-[15px] leading-relaxed [&_h3]:scroll-m-24 [&_h3]:pt-4 [&_h3]:text-base [&_h3]:font-medium"
    >
      <h2
        id={`${id}-heading`}
        className="text-foreground text-2xl font-semibold tracking-tight"
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

const sections = [
  { id: "terms", title: "Terms" },
  { id: "sponsorships", title: "Sponsorships" },
  { id: "privacy", title: "Privacy" },
  { id: "refunds", title: "Refunds" },
  { id: "contact", title: "Contact" },
];
