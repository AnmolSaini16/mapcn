export const SITE_TITLE = {
  default: "mapcn for react native",
  template: "%s - mapcn for react native",
} as const;

export function formatPageTitle(pageTitle?: string): string {
  if (!pageTitle) {
    return SITE_TITLE.default;
  }

  return SITE_TITLE.template.replace("%s", pageTitle);
}
