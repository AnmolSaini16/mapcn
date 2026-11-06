import { siteUrl } from "@/lib/metadata";

export const sponsorEmail = "sainianmol16@gmail.com";
export const githubSponsorsUrl = "https://github.com/sponsors/AnmolSaini16";
export const xProfileUrl = "https://x.com/anmold_s";
export const dodoCheckoutBase = "https://checkout.dodopayments.com";

export interface Sponsorship {
  price: number;
  slots: number;
  perks: string[];
  /** Dodo Payments product ID. Falls back to email when unset. */
  productId?: string;
}

export interface Sponsor {
  name: string;
  href: string;
  /** Monochrome SVG in `public/sponsors/`. */
  logo: string;
  /** Optional dark-mode variant of `logo`. */
  logoDark?: string;
}

export interface SiteStat {
  label: string;
  value: string;
}

export const sponsorship: Sponsorship = {
  price: 249,
  slots: 4,
  productId: "pdt_0NrCHKLSFIlwdqu4AKpL4",
  perks: [
    "Logo on the homepage, below the showcase",
    "Logo on every docs page",
    "Logo on the sponsors page and in the README",
    "One-time shoutout on X",
  ],
};

export const sponsors: Sponsor[] = [
  {
    name: "UIAble",
    href: "https://links.codedthemes.com/DNWBc",
    logo: "/sponsors/uiable.svg",
    logoDark: "/sponsors/uiable-dark.svg",
  },
];

export const openSlots = Math.max(sponsorship.slots - sponsors.length, 0);

export const checkoutEnabled = Boolean(sponsorship.productId);

/** Rounded down so they stay true without monthly updates. */
export const pageviewsSinceLaunch = "1M+";

export const siteStats: SiteStat[] = [
  { label: "Pageviews since launch", value: pageviewsSinceLaunch },
  { label: "Visitors since launch", value: "225K+" },
  { label: "Monthly pageviews", value: "50K+" },
];

export function sponsorHref(href: string) {
  try {
    const url = new URL(href);
    url.searchParams.set("ref", "mapcn.dev");
    return url.toString();
  } catch {
    return href;
  }
}

export type SponsorAction = ReturnType<typeof getSponsorAction>;

export const sponsorActionLabels: Record<SponsorAction["kind"], string> = {
  checkout: "Continue to checkout",
  waitlist: "Join the waitlist",
  contact: "Reserve a spot",
};

export function getSponsorAction() {
  const checkoutUrl = sponsorCheckoutUrl();
  if (checkoutUrl) return { kind: "checkout", href: checkoutUrl } as const;
  if (openSlots === 0) {
    return { kind: "waitlist", href: sponsorMailto("waitlist") } as const;
  }
  return { kind: "contact", href: sponsorMailto() } as const;
}

export function sponsorCheckoutUrl() {
  if (!sponsorship.productId || openSlots === 0) return undefined;

  const redirect = `${siteUrl}/sponsors/thank-you`;
  return `${dodoCheckoutBase}/buy/${sponsorship.productId}?quantity=1&redirect_url=${encodeURIComponent(redirect)}`;
}

export function sponsorMailto(intent?: "waitlist") {
  const subject = `mapcn sponsorship${intent ? " waitlist" : ""}`;
  const body = [
    "Hi Anmol,",
    "",
    intent
      ? "I'd like to join the sponsorship waitlist."
      : "I'd like to sponsor mapcn.",
    "",
    "Company:",
    "Website:",
  ].join("\n");

  return `mailto:${sponsorEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function sponsorAssetsMailto() {
  return `mailto:${sponsorEmail}?subject=${encodeURIComponent("mapcn sponsorship assets")}`;
}
