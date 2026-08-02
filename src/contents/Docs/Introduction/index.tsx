import { Box, Code, Layers, Moon, Puzzle, Zap } from "lucide-react-native";
import { View } from "react-native";

import { DocsLayout, DocsLink, DocsSection } from "../Common/Layout";

import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

const features = [
  {
    icon: Zap,
    title: "Expo Ready",
    description:
      "Built for Expo projects and development builds with native MapLibre maps.",
  },
  {
    icon: Moon,
    title: "Theme Aware",
    description: "Automatically switches between light and dark map styles.",
  },
  {
    icon: Puzzle,
    title: "Composable",
    description: "Build complex UIs with simple, composable components.",
  },
  {
    icon: Code,
    title: "TypeScript",
    description: "Full type safety with comprehensive TypeScript support.",
  },
  {
    icon: Box,
    title: "Copy & Paste",
    description:
      "Install source code into your app and customize it without a wrapper API.",
  },
  {
    icon: Layers,
    title: "Any Map Style",
    description:
      "Use any MapLibre-compatible tiles: MapTiler, Carto, OpenStreetMap, and more.",
  },
];

function DocsListItem({ children }: { children: React.ReactNode }) {
  return (
    <View className="flex-row gap-2 pl-1">
      <Text className="leading-7">{"\u2022"}</Text>
      <Text className="flex-1 leading-0.5">{children}</Text>
    </View>
  );
}

export function IntroductionPage() {
  return (
    <DocsLayout
      title="Introduction"
      description="Copy-paste map components for React Native and Expo."
      next={{ title: "Installation", href: "/docs/installation" }}
      toc={[
        { title: "Philosophy", slug: "philosophy" },
        { title: "Why mapcn?", slug: "why-mapcn" },
        { title: "Any Map Style", slug: "any-map-style" },
        { title: "Features", slug: "features" },
      ]}
    >
      <DocsSection>
        <Text className="leading-0.5">
          <Text className="font-medium">mapcn react native</Text> provides
          customizable map components for Expo and React Native. Built on{" "}
          <DocsLink
            href="https://maplibre.org/maplibre-react-native/"
            external
          >
            MapLibre React Native
          </DocsLink>
          , styled with{" "}
          <DocsLink
            href="https://www.nativewind.dev/"
            external
          >
            NativeWind
          </DocsLink>
          , and designed to work with{" "}
          <DocsLink
            href="https://reactnativereusables.com/"
            external
          >
            React Native Reusables
          </DocsLink>
          .
        </Text>
      </DocsSection>

      <DocsSection title="Philosophy">
        <Text className="leading-7">
          mapcn follows the shadcn model for native maps: install components
          into your app, own the source code, and adapt it to your product.
        </Text>
        <Text className="leading-7">
          Native maps are often hidden behind large SDKs or a thin wrapper with
          limited escape hatches. mapcn stays close to MapLibre React Native,
          keeps the API composable, and lets you use the underlying map APIs
          when your app needs more control.
        </Text>
        <Text className="leading-7">
          The goal is simple: make maps feel like the rest of your mobile UI
          stack - composable, theme-aware, and easy to customize with NativeWind
          and React Native Reusables patterns.
        </Text>
      </DocsSection>

      <DocsSection title="Why mapcn?">
        <Text className="leading-7">
          Most React Native map setups are either too opinionated or leave you
          to assemble every interaction yourself. mapcn is for teams that want
          to move quickly without giving up control:
        </Text>
        <View className="gap-2">
          <DocsListItem>
            <Text className="font-medium">Own Your Code:</Text> Copy the
            components into your project and customize everything.
          </DocsListItem>
          <DocsListItem>
            <Text className="font-medium">Start Fast:</Text> Run one command and
            render your first map with production-ready defaults.
          </DocsListItem>
          <DocsListItem>
            <Text className="font-medium">Scale Safely:</Text> Build on top of
            MapLibre React Native directly, then drop to raw APIs when needed.
          </DocsListItem>
          <DocsListItem>
            <Text className="font-medium">Design-System Friendly:</Text> Styled
            with NativeWind and made to fit naturally with React Native
            Reusables patterns.
          </DocsListItem>
        </View>
      </DocsSection>

      <DocsSection title="Any Map Style">
        <Text className="leading-7">
          mapcn works with any{" "}
          <DocsLink
            href="https://maplibre.org/maplibre-style-spec/"
            external
          >
            MapLibre-compatible tiles
          </DocsLink>
          . This means you can use tiles from virtually any provider:
        </Text>
        <View className="gap-2">
          <DocsListItem>
            <DocsLink
              href="https://www.openstreetmap.org"
              external
            >
              OpenStreetMap
            </DocsLink>{" "}
            - Community-driven, open-source map data
          </DocsListItem>
          <DocsListItem>
            <DocsLink
              href="https://carto.com/basemaps"
              external
            >
              Carto
            </DocsLink>{" "}
            - Clean, minimal basemaps perfect for data visualization
          </DocsListItem>
          <DocsListItem>
            <DocsLink
              href="https://www.maptiler.com"
              external
            >
              MapTiler
            </DocsLink>{" "}
            - Beautiful vector tiles with extensive customization options
          </DocsListItem>
          <DocsListItem>
            <DocsLink
              href="https://stadiamaps.com"
              external
            >
              Stadia Maps
            </DocsLink>{" "}
            - Fast, reliable tile hosting with multiple styles
          </DocsListItem>
          <DocsListItem>
            <DocsLink
              href="https://www.thunderforest.com"
              external
            >
              Thunderforest
            </DocsLink>{" "}
            - Specialized maps for outdoors, cycling, and transport
          </DocsListItem>
          <DocsListItem>
            And any other provider that supports the MapLibre style spec
          </DocsListItem>
        </View>
      </DocsSection>

      <DocsSection title="Features">
        <View className="mt-4 flex-row flex-wrap gap-4">
          {features.map((feature) => (
            <View
              key={feature.title}
              className="bg-surface w-full gap-3 rounded-lg p-4 sm:w-[48%]"
            >
              <View className="flex-row items-center gap-2.5">
                <Icon
                  as={feature.icon}
                  className="text-muted-foreground size-4"
                />
                <Text className="text-foreground text-base font-medium">
                  {feature.title}
                </Text>
              </View>
              <Text className="text-muted-foreground text-sm">
                {feature.description}
              </Text>
            </View>
          ))}
        </View>
      </DocsSection>
    </DocsLayout>
  );
}
