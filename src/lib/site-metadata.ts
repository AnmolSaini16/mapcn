export const SITE_URL =
  process.env.EXPO_PUBLIC_SITE_URL ?? "http://localhost:8081";

export const SITE_NAME = "mapcn for react native";

export const SITE_GITHUB_REPO =
  "https://github.com/unkn0wndfbx/mapcn-react-native";

export const SITE_TWITTER_CREATOR = "@thdev_web";

export const SITE_DESCRIPTION =
  "Free, open-source, ready-to-use, customizable map components for React Native and Expo. Built on MapLibre. Styled with NativeWind.";

export const SITE_TITLE = {
  default: "mapcn for react native - Beautiful maps, made simple",
  template: "%s - mapcn for react native",
} as const;

export const SITE_KEYWORDS = [
  "react native map",
  "expo map",
  "maplibre react native",
  "nativewind map",
  "expo router map",
  "map components",
  "react native map library",
  "typescript map",
  "interactive maps",
  "map markers",
  "map controls",
];

export const SITE_AUTHORS = [
  { name: "unkn0wndfbx", url: "https://github.com/unkn0wndfbx" },
] as const;

export const SITE_OG_IMAGE = {
  url: "/banner.png",
  width: 1200,
  height: 630,
  alt: "mapcn for react native - Beautiful maps, made simple",
} as const;

export const SITE_APP_STORE_URL = ""; // TODO: Add App Store URL

export const SITE_PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.unkn0wnd.fbx.mapcnreactnative&pcampaignid=web_share";

export const PRIVACY_POLICY_PATH = "/privacy";

export function formatPageTitle(pageTitle?: string): string {
  if (!pageTitle) {
    return SITE_TITLE.default;
  }

  return SITE_TITLE.template.replace("%s", pageTitle);
}

export function getAbsoluteUrl(path = ""): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalizedPath, SITE_URL).toString();
}

export function getPrivacyPolicyUrl(): string {
  return getAbsoluteUrl(PRIVACY_POLICY_PATH);
}
