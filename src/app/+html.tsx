import { ScrollViewStyleReset } from "expo-router/html";

import { SITE_TITLE } from "@/lib/site-metadata";

export default function Root({ children }: { children: React.ReactNode }) {
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
          name="google-site-verification"
          content="cH47f26Aum_laijHEyap49vo-K8AKoUP5WvWuhzfOeM"
        />
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
