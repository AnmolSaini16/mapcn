import { CodeBlock } from "../Common/CodeBlock";
import { InstallCommand } from "../Common/InstallCommand";
import {
  DocsCode,
  DocsLayout,
  DocsLink,
  DocsNote,
  DocsSection,
} from "../Common/Layout";

import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Map, MapControls } from "@/registry/map";

const usageCode = `import { Map, MapControls } from "@/components/ui/map";
import { View } from "react-native";

export function MyMap() {
  return (
    <View className="h-80 overflow-hidden rounded-lg">
      <Map
        viewport={{
          center: [-74.006, 40.7128],
          zoom: 11,
        }}
      >
        <MapControls />
      </Map>
    </View>
  );
}`;

export function InstallationPage() {
  return (
    <DocsLayout
      title="Installation"
      description="How to install and set up mapcn in your project."
      prev={{ title: "Introduction", href: "/docs" }}
      next={{ title: "API Reference", href: "/docs/api-reference" }}
      toc={[
        { title: "Prerequisites", slug: "prerequisites" },
        { title: "Installation", slug: "installation" },
        { title: "Native setup", slug: "native-setup" },
        { title: "Usage", slug: "usage" },
      ]}
    >
      <DocsSection title="Prerequisites">
        <Text className="leading-7">
          An Expo or React Native project with{" "}
          <DocsLink
            href="https://www.nativewind.dev/"
            external
          >
            NativeWind
          </DocsLink>{" "}
          and{" "}
          <DocsLink
            href="https://reactnativereusables.com/"
            external
          >
            React Native Reusables
          </DocsLink>{" "}
          set up. The map component uses the native{" "}
          <DocsLink
            href="https://maplibre.org/maplibre-react-native/"
            external
          >
            MapLibre React Native
          </DocsLink>{" "}
          module.
        </Text>
      </DocsSection>

      <DocsSection title="Installation">
        <Text className="leading-7">
          Run the following command to add the map component:
        </Text>
        <InstallCommand name="unkn0wndfbx/mapcn-react-native/map" />
        <Text className="leading-7">
          This adds the map component,{" "}
          <DocsCode>@maplibre/maplibre-react-native</DocsCode>, and the
          supporting native dependencies to your project.
        </Text>
      </DocsSection>

      <DocsSection title="Native Setup">
        <Text className="leading-7">
          Because MapLibre is a native module, run the app in an Expo
          development build or a bare React Native build. It does not run in
          Expo Go. After installing the component, rebuild the native app before
          testing the map on iOS or Android.
        </Text>
        <DocsNote>
          <Text className="font-medium">Web:</Text> This registry is designed
          for native iOS and Android maps. Use a web-specific map library when
          your primary target is the browser.
        </DocsNote>
      </DocsSection>

      <DocsSection title="Usage">
        <Text className="leading-7">Import and use the map component:</Text>
        <CodeBlock code={usageCode} />
        <Card className="h-80 overflow-hidden rounded-lg p-0">
          <Map
            viewport={{
              center: [-74.006, 40.7128],
              zoom: 11,
            }}
          >
            <MapControls />
          </Map>
        </Card>
      </DocsSection>

      <DocsNote>
        <Text className="font-medium">Note:</Text> The map uses free CARTO
        basemap tiles by default and switches between light and dark styles with
        the device color scheme. Review your tile provider&apos;s terms before
        shipping a production app.
      </DocsNote>
    </DocsLayout>
  );
}
