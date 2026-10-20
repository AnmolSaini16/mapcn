import { siteUrl } from "@/lib/metadata";

export const sponsorEmail = "sainianmol16@gmail.com";
export const githubSponsorsUrl = "https://github.com/sponsors/AnmolSaini16";
export const xProfileUrl = "https://x.com/anmold_s";
export const dodoCheckoutBase = "https://checkout.dodopayments.com";

export type SponsorTierId = "platinum" | "gold" | "silver";

export interface SponsorTier {
  id: SponsorTierId;
  name: string;
  price: number;
  /** Max concurrent sponsors. Omit for unlimited. */
  slots?: number;
  perks: string[];
  /** Dodo Payments product ID. Falls back to email when unset. */
  productId?: string;
}

export interface Sponsor {
  name: string;
  tier: SponsorTierId;
  href: string;
  /** Monochrome SVG in `public/sponsors/`. */
  logo: string;
  /** Optional dark-mode variant of `logo`. */
  logoDark?: string;
  tagline?: string;
}

export interface SiteStat {
  label: string;
  value: string;
}

export const sponsorTiers: SponsorTier[] = [
  {
    id: "platinum",
    name: "Platinum",
    price: 500,
    slots: 2,
    productId: "",
    perks: [
      "Largest logo on the homepage, below the showcase",
      "Top logo with tagline on every docs page",
      "Largest logo on the sponsors page and README",
      "One-time shoutout on X",
    ],
  },
  {
    id: "gold",
    name: "Gold",
    price: 250,
    slots: 4,
    productId: "",
    perks: [
      "Logo on the homepage, below the showcase",
      "Logo on every docs page",
      "Logo on the sponsors page and README",
      "One-time shoutout on X",
    ],
  },
  {
    id: "silver",
    name: "Silver",
    price: 100,
    productId: "",
    perks: ["Logo on the sponsors page", "Logo in the README"],
  },
];

export const sponsors: Sponsor[] = [];

export const checkoutEnabled = sponsorTiers.some((tier) => tier.productId);

/** Rounded down so they stay true without monthly updates. */
export const pageviewsSinceLaunch = "1M+";

export const siteStats: SiteStat[] = [
  { label: "Pageviews since launch", value: pageviewsSinceLaunch },
  { label: "Visitors since launch", value: "225K+" },
  { label: "Monthly pageviews", value: "50K+" },
];

export function getSponsorsByTier(tier: SponsorTierId) {
  return sponsors.filter((sponsor) => sponsor.tier === tier);
}

export function getFeaturedSponsors() {
  return {
    platinum: getSponsorsByTier("platinum"),
    gold: getSponsorsByTier("gold"),
  };
}

export function hasFeaturedSponsors() {
  const { platinum, gold } = getFeaturedSponsors();
  return platinum.length + gold.length > 0;
}

export function getOpenSlots(tier: SponsorTier) {
  if (tier.slots === undefined) return undefined;
  return Math.max(tier.slots - getSponsorsByTier(tier.id).length, 0);
}

export function sponsorHref(href: string, placement: string) {
  try {
    const url = new URL(href);
    url.searchParams.set("ref", "mapcn.dev");
    url.searchParams.set("utm_source", "mapcn.dev");
    url.searchParams.set("utm_medium", placement);
    return url.toString();
  } catch {
    return href;
  }
}

export function getSponsorTier(id: unknown) {
  if (typeof id !== "string") return undefined;
  const tierId = id.split("?")[0];
  return sponsorTiers.find((tier) => tier.id === tierId);
}

export function getSponsorAction(tier?: SponsorTier) {
  const checkoutUrl = tier && sponsorCheckoutUrl(tier);
  if (checkoutUrl) return { kind: "checkout", href: checkoutUrl } as const;
  if (tier && getOpenSlots(tier) === 0) {
    return { kind: "waitlist", href: sponsorMailto(tier, "waitlist") } as const;
  }
  return { kind: "contact", href: sponsorMailto(tier) } as const;
}

export function sponsorCheckoutUrl(tier: SponsorTier) {
  if (!tier.productId || getOpenSlots(tier) === 0) return undefined;

  const redirect = `${siteUrl}/sponsors/thank-you?tier=${tier.id}`;
  return `${dodoCheckoutBase}/buy/${tier.productId}?quantity=1&redirect_url=${encodeURIComponent(redirect)}`;
}

export function sponsorMailto(tier?: SponsorTier, intent?: "waitlist") {
  const subject = tier
    ? `mapcn sponsorship - ${tier.name}${intent ? " waitlist" : ""}`
    : "mapcn sponsorship";
  const body = [
    "Hi Anmol,",
    "",
    intent && tier
      ? `I'd like to join the waitlist for the ${tier.name} tier.`
      : `I'd like to sponsor mapcn${tier ? ` at the ${tier.name} tier` : ""}.`,
    "",
    "Company:",
    "Website:",
  ].join("\n");

  return `mailto:${sponsorEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function sponsorAssetsMailto(tier?: SponsorTier) {
  const subject = `mapcn ${tier ? `${tier.name} ` : ""}sponsorship assets`;
  return `mailto:${sponsorEmail}?subject=${encodeURIComponent(subject)}`;
}
