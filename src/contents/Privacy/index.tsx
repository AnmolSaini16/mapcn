import * as WebBrowser from "expo-web-browser";
import { PropsWithChildren } from "react";
import { Platform, ScrollView, View } from "react-native";

import { Footer } from "@/components/footer";
import { PageHead } from "@/components/page-head";
import { Text } from "@/components/ui/text";
import { SITE_GITHUB_REPO, SITE_NAME } from "@/lib/site-metadata";

const EFFECTIVE_DATE = "August 8, 2026";
const APP_NAME = "mapcn-react-native";
const ANDROID_PACKAGE = "com.unkn0wnd.fbx.mapcnreactnative";
const DEVELOPER_NAME = "THDev";
const CONTACT_URL = `${SITE_GITHUB_REPO}/issues`;

function openExternalUrl(url: string) {
  if (Platform.OS === "web") {
    window.open(url, "_blank");
    return;
  }

  void WebBrowser.openBrowserAsync(url);
}

function PrivacySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View className="gap-3">
      <Text className="text-foreground text-xl font-semibold tracking-tight">
        {title}
      </Text>
      <View className="gap-3">{children}</View>
    </View>
  );
}

function PrivacyParagraph({ children }: PropsWithChildren) {
  return (
    <Text className="text-muted-foreground text-base leading-relaxed">
      {children}
    </Text>
  );
}

function PrivacyListItem({ children }: PropsWithChildren) {
  return (
    <View className="flex-row items-start gap-2 pl-1">
      <Text className="text-muted-foreground leading-7">{"\u2022"}</Text>
      <View className="min-w-0 flex-1">
        <Text className="text-muted-foreground leading-7">{children}</Text>
      </View>
    </View>
  );
}

export function PrivacyPage() {
  return (
    <>
      <PageHead
        title="Privacy Policy"
        description={`Privacy policy for the ${APP_NAME} mobile app and website.`}
      />
      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="flex-grow"
        showsVerticalScrollIndicator={false}
      >
        <View className="container mx-auto w-full max-w-3xl flex-1 px-4 py-10 md:py-16">
          <View className="gap-3">
            <Text className="text-foreground text-3xl font-semibold tracking-tight">
              Privacy Policy
            </Text>
            <Text className="text-muted-foreground text-base leading-relaxed">
              Effective date: {EFFECTIVE_DATE}
            </Text>
          </View>

          <View className="mt-12 gap-10">
            <PrivacySection title="Introduction">
              <PrivacyParagraph>
                This Privacy Policy describes how {DEVELOPER_NAME}{" "}
                (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) handles
                information when you use {APP_NAME} (the &quot;App&quot;) and
                the related website at {SITE_NAME}. The App is a demo and
                documentation companion for React Native map components built on
                MapLibre.
              </PrivacyParagraph>
              <PrivacyParagraph>
                This policy is designed to match the data practices declared in
                Google Play&apos;s Data safety section for the Android app.
              </PrivacyParagraph>
            </PrivacySection>

            <PrivacySection title="Summary of Data Practices">
              <PrivacyParagraph>
                The App collects a limited amount of data to provide map and
                documentation features. We do not sell personal information, do
                not show ads, and do not require you to create an account.
              </PrivacyParagraph>
              <PrivacyListItem>
                <Text className="text-muted-foreground leading-7">
                  <Text className="text-foreground font-medium">
                    Approximate location
                  </Text>{" "}
                  - collected when map tiles are loaded over the internet.
                </Text>
              </PrivacyListItem>
              <PrivacyListItem>
                <Text className="text-muted-foreground leading-7">
                  <Text className="text-foreground font-medium">
                    Precise location
                  </Text>{" "}
                  - collected only if you tap the locate control and grant
                  location permission.
                </Text>
              </PrivacyListItem>
              <PrivacyListItem>
                <Text className="text-muted-foreground leading-7">
                  <Text className="text-foreground font-medium">
                    No data sharing with third parties
                  </Text>{" "}
                  - location-related network data is processed by service
                  providers acting on our behalf to deliver map tiles.
                </Text>
              </PrivacyListItem>
            </PrivacySection>

            <PrivacySection title="Approximate Location">
              <PrivacyParagraph>
                When you use map features, the App sends network requests to
                load map styles and tiles from third-party content delivery
                networks, including CARTO (
                <Text
                  accessibilityRole="link"
                  className="text-foreground underline"
                  onPress={() => {
                    openExternalUrl("https://carto.com/legal/privacy-policy");
                  }}
                >
                  basemaps.cartocdn.com
                </Text>
                ) and, in some demos, OpenFreeMap (
                <Text
                  accessibilityRole="link"
                  className="text-foreground underline"
                  onPress={() => {
                    openExternalUrl("https://openfreemap.org/");
                  }}
                >
                  tiles.openfreemap.org
                </Text>
                ).
              </PrivacyParagraph>
              <PrivacyParagraph>
                These requests may include your IP address, which can be used to
                infer your approximate location. This data is collected to
                provide core app functionality (displaying maps) and is required
                for map features to work.
              </PrivacyParagraph>
              <PrivacyParagraph>
                We treat these map tile providers as service providers that
                process data on our behalf. We do not share location data with
                third parties for advertising, marketing, or profiling.
              </PrivacyParagraph>
            </PrivacySection>

            <PrivacySection title="Precise Location">
              <PrivacyParagraph>
                Some map demos include a &quot;Find my location&quot; control.
                If you tap it, the App requests location permission through
                MapLibre&apos;s location APIs. If you grant permission, the App
                reads your device&apos;s current GPS coordinates to center the
                map on your position.
              </PrivacyParagraph>
              <PrivacyParagraph>
                Precise location is optional. You can deny the permission and
                continue using the rest of the App. Location data is processed
                on your device in real time to move the map camera and is not
                stored on our servers or shared with third parties.
              </PrivacyParagraph>
              <PrivacyParagraph>
                You can revoke location permission at any time in your device
                settings.
              </PrivacyParagraph>
            </PrivacySection>

            <PrivacySection title="Data We Do Not Collect">
              <PrivacyParagraph>
                The App does not collect the following types of data:
              </PrivacyParagraph>
              <PrivacyListItem>
                Personal information such as name, email address, phone number,
                or mailing address
              </PrivacyListItem>
              <PrivacyListItem>
                Financial or payment information
              </PrivacyListItem>
              <PrivacyListItem>
                Health, fitness, contacts, calendar, photos, videos, audio, or
                files
              </PrivacyListItem>
              <PrivacyListItem>
                Messages, in-app search history, or web browsing history
              </PrivacyListItem>
              <PrivacyListItem>
                Crash logs, diagnostics, or device identifiers for advertising
              </PrivacyListItem>
              <PrivacyListItem>
                App interaction analytics on the Android app
              </PrivacyListItem>
            </PrivacySection>

            <PrivacySection title="Website-Only Practices">
              <PrivacyParagraph>
                The website version of {APP_NAME} may use{" "}
                <Text
                  accessibilityRole="link"
                  className="text-foreground underline"
                  onPress={() => {
                    openExternalUrl("https://vercel.com/legal/privacy-policy");
                  }}
                >
                  Vercel Analytics
                </Text>{" "}
                to collect anonymized page views and basic interaction events
                (such as copying install commands). These analytics practices
                apply to the website only and are not part of the Android app
                distributed on Google Play.
              </PrivacyParagraph>
            </PrivacySection>

            <PrivacySection title="Permissions">
              <PrivacyParagraph>
                The App may request the following permissions:
              </PrivacyParagraph>
              <PrivacyListItem>
                <Text className="text-muted-foreground leading-7">
                  <Text className="text-foreground font-medium">
                    Location (optional)
                  </Text>{" "}
                  - used only when you activate the locate control in a map
                  demo.
                </Text>
              </PrivacyListItem>
              <PrivacyListItem>
                <Text className="text-muted-foreground leading-7">
                  <Text className="text-foreground font-medium">
                    Internet access
                  </Text>{" "}
                  - required to load documentation, map tiles, and related
                  assets.
                </Text>
              </PrivacyListItem>
            </PrivacySection>

            <PrivacySection title="Security">
              <PrivacyParagraph>
                Data transmitted off your device (such as map tile requests) is
                sent over encrypted connections (HTTPS/TLS). We do not operate
                user accounts and do not intentionally store personal
                information on our own servers.
              </PrivacyParagraph>
            </PrivacySection>

            <PrivacySection title="Data Retention and Deletion">
              <PrivacyParagraph>
                We do not maintain user profiles or persist personal data on our
                servers. Precise location is used ephemerally on-device and is
                not retained by us. Map tile providers may retain network
                request data according to their own policies.
              </PrivacyParagraph>
              <PrivacyParagraph>
                Because we do not store personal data, the primary way to stop
                data processing is to uninstall the App or stop using the
                website. You may also contact us through GitHub if you have
                questions about your data.
              </PrivacyParagraph>
            </PrivacySection>

            <PrivacySection title="Children's Privacy">
              <PrivacyParagraph>
                The App is not directed at children under 13, and we do not
                knowingly collect personal information from children.
              </PrivacyParagraph>
            </PrivacySection>

            <PrivacySection title="Changes to This Policy">
              <PrivacyParagraph>
                We may update this Privacy Policy from time to time. When we do,
                we will revise the effective date at the top of this page.
              </PrivacyParagraph>
            </PrivacySection>

            <PrivacySection title="Contact Us">
              <PrivacyParagraph>
                If you have questions about this Privacy Policy, contact us by
                opening an issue on GitHub:
              </PrivacyParagraph>
              <Text
                accessibilityRole="link"
                className="text-foreground text-base underline"
                onPress={() => {
                  openExternalUrl(CONTACT_URL);
                }}
              >
                {CONTACT_URL}
              </Text>
              <PrivacyParagraph>
                Android package name: {ANDROID_PACKAGE}
              </PrivacyParagraph>
            </PrivacySection>
          </View>
        </View>

        <Footer />
      </ScrollView>
    </>
  );
}
