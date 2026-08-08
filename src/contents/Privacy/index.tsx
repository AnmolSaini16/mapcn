import * as WebBrowser from "expo-web-browser";
import { PropsWithChildren } from "react";
import { Platform, ScrollView, View } from "react-native";

import { Footer } from "@/components/footer";
import { PageHead } from "@/components/page-head";
import { Text } from "@/components/ui/text";
import { SITE_GITHUB_REPO, SITE_NAME } from "@/lib/site-metadata";

const EFFECTIVE_DATE = "August 8, 2026";
const APP_NAME = "mapcn-react-native";
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
                (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects,
                uses, and shares information when you use {APP_NAME} (the
                &quot;App&quot;) and the related website at {SITE_NAME}. The App
                is a demo and documentation companion for React Native map
                components built on MapLibre.
              </PrivacyParagraph>
              <PrivacyParagraph>
                By using the App or website, you agree to the collection and use
                of information in accordance with this policy. If you do not
                agree, please do not use the App or website.
              </PrivacyParagraph>
            </PrivacySection>

            <PrivacySection title="Information We Collect">
              <PrivacyParagraph>
                We designed {APP_NAME} to collect as little personal information
                as possible. Depending on how you use the App or website, the
                following information may be processed:
              </PrivacyParagraph>
              <PrivacyListItem>
                <Text className="text-muted-foreground leading-7">
                  <Text className="text-foreground font-medium">
                    Device information
                  </Text>{" "}
                  - such as device model, operating system version, and app
                  version, which may be included in diagnostic or analytics
                  data.
                </Text>
              </PrivacyListItem>
              <PrivacyListItem>
                <Text className="text-muted-foreground leading-7">
                  <Text className="text-foreground font-medium">
                    Usage information
                  </Text>{" "}
                  - such as pages or screens viewed, interactions with map
                  demos, and feature usage (for example, copying install
                  commands).
                </Text>
              </PrivacyListItem>
              <PrivacyListItem>
                <Text className="text-muted-foreground leading-7">
                  <Text className="text-foreground font-medium">
                    Location information
                  </Text>{" "}
                  - only if you explicitly enable the locate control in a map
                  demo and grant location permission on your device. Location
                  data is used locally to center the map and is not stored on
                  our servers.
                </Text>
              </PrivacyListItem>
              <PrivacyListItem>
                <Text className="text-muted-foreground leading-7">
                  <Text className="text-foreground font-medium">
                    Network information
                  </Text>{" "}
                  - such as IP address, which may be processed by third-party
                  services that provide map tiles, hosting, or analytics.
                </Text>
              </PrivacyListItem>
              <PrivacyParagraph>
                We do not require you to create an account, and we do not
                knowingly collect names, email addresses, phone numbers, or
                payment information through the App.
              </PrivacyParagraph>
            </PrivacySection>

            <PrivacySection title="How We Use Information">
              <PrivacyParagraph>
                We use the information described above to:
              </PrivacyParagraph>
              <PrivacyListItem>
                Provide, operate, and improve the App and website
              </PrivacyListItem>
              <PrivacyListItem>
                Display interactive map demos and documentation
              </PrivacyListItem>
              <PrivacyListItem>
                Understand aggregate usage patterns and fix technical issues
              </PrivacyListItem>
              <PrivacyListItem>
                Respond to support requests when you contact us
              </PrivacyListItem>
              <PrivacyParagraph>
                We do not sell your personal information and we do not use your
                data for targeted advertising.
              </PrivacyParagraph>
            </PrivacySection>

            <PrivacySection title="Third-Party Services">
              <PrivacyParagraph>
                The App and website rely on third-party services that may
                collect information according to their own privacy policies:
              </PrivacyParagraph>
              <PrivacyListItem>
                <Text className="text-muted-foreground leading-7">
                  <Text className="text-foreground font-medium">MapLibre</Text>{" "}
                  - powers native map rendering. When you use map features, map
                  tile providers may receive requests that include your IP
                  address and general location derived from network data.
                </Text>
              </PrivacyListItem>
              <PrivacyListItem>
                <Text className="text-muted-foreground leading-7">
                  <Text className="text-foreground font-medium">
                    Map tile providers
                  </Text>{" "}
                  - such as OpenStreetMap-based or other MapLibre-compatible
                  tile sources configured in demos. These providers process
                  network requests needed to load map imagery.
                </Text>
              </PrivacyListItem>
              <PrivacyListItem>
                <Text className="text-muted-foreground leading-7">
                  <Text className="text-foreground font-medium">
                    Vercel Analytics
                  </Text>{" "}
                  - used on the website to collect anonymized page views and
                  basic interaction events. See{" "}
                  <Text
                    accessibilityRole="link"
                    className="text-foreground underline"
                    onPress={() => {
                      openExternalUrl(
                        "https://vercel.com/legal/privacy-policy",
                      );
                    }}
                  >
                    Vercel&apos;s Privacy Policy
                  </Text>
                  .
                </Text>
              </PrivacyListItem>
              <PrivacyListItem>
                <Text className="text-muted-foreground leading-7">
                  <Text className="text-foreground font-medium">
                    Google Play
                  </Text>{" "}
                  - if you install the App from Google Play, Google may collect
                  information about your device, purchases, and app usage as
                  described in Google&apos;s policies.
                </Text>
              </PrivacyListItem>
              <PrivacyParagraph>
                We encourage you to review the privacy policies of these
                third-party services for more details.
              </PrivacyParagraph>
            </PrivacySection>

            <PrivacySection title="Permissions">
              <PrivacyParagraph>
                The App may request the following device permissions:
              </PrivacyParagraph>
              <PrivacyListItem>
                <Text className="text-muted-foreground leading-7">
                  <Text className="text-foreground font-medium">
                    Location (optional)
                  </Text>{" "}
                  - requested only when you use the locate control in a map
                  demo. You can deny this permission and continue using other
                  features.
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

            <PrivacySection title="Data Retention">
              <PrivacyParagraph>
                We do not operate user accounts and do not intentionally store
                personal information on our own servers. Analytics and hosting
                providers may retain data for a limited period according to
                their own retention policies.
              </PrivacyParagraph>
            </PrivacySection>

            <PrivacySection title="Children's Privacy">
              <PrivacyParagraph>
                The App is not directed at children under 13, and we do not
                knowingly collect personal information from children. If you
                believe a child has provided us with personal information,
                please contact us and we will take steps to delete it.
              </PrivacyParagraph>
            </PrivacySection>

            <PrivacySection title="Your Choices and Rights">
              <PrivacyParagraph>
                Depending on your location, you may have rights to access,
                correct, delete, or restrict the processing of your personal
                information. Because we collect minimal personal data and do not
                maintain user accounts, most requests can be addressed by
                uninstalling the App or stopping use of the website.
              </PrivacyParagraph>
              <PrivacyParagraph>
                You can also manage location permissions in your device settings
                at any time.
              </PrivacyParagraph>
            </PrivacySection>

            <PrivacySection title="Security">
              <PrivacyParagraph>
                We take reasonable measures to protect information processed
                through the App and website. However, no method of transmission
                over the internet or electronic storage is completely secure.
              </PrivacyParagraph>
            </PrivacySection>

            <PrivacySection title="Changes to This Policy">
              <PrivacyParagraph>
                We may update this Privacy Policy from time to time. When we do,
                we will revise the effective date at the top of this page.
                Continued use of the App or website after changes become
                effective constitutes acceptance of the updated policy.
              </PrivacyParagraph>
            </PrivacySection>

            <PrivacySection title="Contact Us">
              <PrivacyParagraph>
                If you have questions about this Privacy Policy or our data
                practices, contact us by opening an issue on GitHub:
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
                App package name: com.unkn0wnd.fbx.mapcnreactnative
              </PrivacyParagraph>
            </PrivacySection>
          </View>
        </View>

        <Footer />
      </ScrollView>
    </>
  );
}
