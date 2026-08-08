import { ScrollViewStyleReset } from "expo-router/html";
import { PropsWithChildren } from "react";

import {
  getAbsoluteUrl,
  SITE_AUTHORS,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_OG_IMAGE,
  SITE_TITLE,
  SITE_TWITTER_CREATOR,
  SITE_URL,
} from "@/lib/site-metadata";

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <title>{SITE_TITLE.default}</title>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <meta
          name="description"
          content={SITE_DESCRIPTION}
        />
        <meta
          name="keywords"
          content={SITE_KEYWORDS.join(", ")}
        />
        <meta
          name="author"
          content={SITE_AUTHORS[0].name}
        />
        <meta
          name="creator"
          content={SITE_AUTHORS[0].name}
        />
        <meta
          name="publisher"
          content={SITE_NAME}
        />
        <meta
          name="robots"
          content="index, follow"
        />
        <meta
          name="googlebot"
          content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1"
        />
        <meta
          name="category"
          content="technology"
        />
        <link
          rel="canonical"
          href={SITE_URL}
        />
        <link
          rel="icon"
          href="/icon.svg"
          type="image/svg+xml"
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
          content={SITE_URL}
        />
        <meta
          property="og:site_name"
          content={SITE_NAME}
        />
        <meta
          property="og:title"
          content={SITE_TITLE.default}
        />
        <meta
          property="og:description"
          content={SITE_DESCRIPTION}
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
          content={SITE_TITLE.default}
        />
        <meta
          name="twitter:description"
          content={SITE_DESCRIPTION}
        />
        <meta
          name="twitter:creator"
          content={SITE_TWITTER_CREATOR}
        />
        <meta
          name="twitter:image"
          content={getAbsoluteUrl(SITE_OG_IMAGE.url)}
        />
        <meta
          name="google-site-verification"
          content="cH47f26Aum_laijHEyap49vo-K8AKoUP5WvWuhzfOeM"
        />
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
