import { usePathname } from "expo-router";
import Head from "expo-router/head";
import { Platform } from "react-native";

import {
  formatPageTitle,
  getAbsoluteUrl,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_OG_IMAGE,
  SITE_TWITTER_CREATOR,
} from "@/lib/site-metadata";

type PageHeadProps = {
  title?: string;
  description?: string;
};

export function PageHead({ title, description }: PageHeadProps) {
  const pathname = usePathname();

  if (Platform.OS !== "web") {
    return null;
  }

  const pageTitle = formatPageTitle(title);
  const pageDescription = description ?? SITE_DESCRIPTION;
  const pageUrl = getAbsoluteUrl(pathname);

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta
        name="description"
        content={pageDescription}
      />
      <link
        rel="canonical"
        href={pageUrl}
      />
      <meta
        property="og:type"
        content="website"
      />
      <meta
        property="og:locale"
        content="en_US"
      />
      <meta
        property="og:url"
        content={pageUrl}
      />
      <meta
        property="og:site_name"
        content={SITE_NAME}
      />
      <meta
        property="og:title"
        content={pageTitle}
      />
      <meta
        property="og:description"
        content={pageDescription}
      />
      <meta
        property="og:image"
        content={getAbsoluteUrl(SITE_OG_IMAGE.url)}
      />
      <meta
        property="og:image:width"
        content={String(SITE_OG_IMAGE.width)}
      />
      <meta
        property="og:image:height"
        content={String(SITE_OG_IMAGE.height)}
      />
      <meta
        property="og:image:alt"
        content={SITE_OG_IMAGE.alt}
      />
      <meta
        name="twitter:card"
        content="summary_large_image"
      />
      <meta
        name="twitter:title"
        content={pageTitle}
      />
      <meta
        name="twitter:description"
        content={pageDescription}
      />
      <meta
        name="twitter:creator"
        content={SITE_TWITTER_CREATOR}
      />
      <meta
        name="twitter:image"
        content={getAbsoluteUrl(SITE_OG_IMAGE.url)}
      />
    </Head>
  );
}
