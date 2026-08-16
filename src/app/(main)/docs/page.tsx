import { Zap, Moon, Puzzle, Code, Box, Layers } from "lucide-react";
import { DocsLayout, DocsSection, DocsLink } from "./_components/docs";
import { Metadata } from "next";

const features = [
  {
    icon: Zap,
    title: "Zero Config",
    description:
      "Works out of the box with free map tiles. No API keys needed.",
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
    description: "Own your code. No dependencies, just copy into your project.",
  },
  {
    icon: Layers,
    title: "Any Map Style",
    description:
      "Use any MapLibre-compatible tiles: MapTiler, Carto, OpenStreetMap, and more.",
  },
];

export const metadata: Metadata = {
  title: "Introduction",
};

export default function IntroductionPage() {
  return (
    <DocsLayout
      title="Introduction"
      description="Copy-paste map components for React."
      next={{ title: "Installation", href: "/docs/installation" }}
    >
      <DocsSection>
        <p>
          <strong>mapcn</strong> provides beautifully designed, accessible, and
          customizable map components. Built on{" "}
          <DocsLink href="https://maplibre.org" external>
            MapLibre GL
          </DocsLink>
          , styled with{" "}
          <DocsLink href="https://tailwindcss.com" external>
            Tailwind CSS
          </DocsLink>
          , and designed to work with{" "}
          <DocsLink href="https://ui.shadcn.com" external>
            shadcn/ui
          </DocsLink>
          .
        </p>
      </DocsSection>

      <DocsSection title="Philosophy">
        <p>
          mapcn follows the shadcn model for maps: copy-paste components you can
          own, with zero lock-in and sensible defaults that work immediately.
        </p>
        <p>
          Maps are often treated as black boxes hidden behind wrapper libraries
          and configuration-heavy SDKs. mapcn takes a different approach. It
          stays close to MapLibre, keeps the API familiar, and lets you drop
          down to the raw map instance whenever you need more control.
        </p>
        <p>
          The goal is simple: make maps feel like the rest of your UI stack -
          composable, themeable, accessible, and easy to customize with Tailwind
          and shadcn patterns.
        </p>
      </DocsSection>

      <DocsSection title="Why mapcn?">
        <p>
          Most React map setups are either too opinionated or too heavy. mapcn
          is built for teams that want to ship quickly without giving up
          control:
        </p>
        <ul>
          <li>
            <strong>Own Your Code:</strong> Copy the components into your
            project and customize everything.
          </li>
          <li>
            <strong>Start Fast:</strong> Run one command and render your first
            map with production-ready defaults.
          </li>
          <li>
            <strong>Scale Safely:</strong> Build on top of MapLibre directly,
            then drop to raw APIs when needed.
          </li>
          <li>
            <strong>Design-System Friendly:</strong> Styled with Tailwind and
            made to fit naturally with shadcn/ui patterns.
          </li>
        </ul>
      </DocsSection>

      <DocsSection title="Any Map Style">
        <p>
          mapcn works with any{" "}
          <DocsLink href="https://maplibre.org/maplibre-style-spec/" external>
            MapLibre-compatible tiles
          </DocsLink>
          . This means you can use tiles from virtually any provider:
        </p>
        <ul>
          <li>
            <DocsLink href="https://www.openstreetmap.org" external>
              OpenStreetMap
            </DocsLink>{" "}
            - Community-driven, open-source map data
          </li>
          <li>
            <DocsLink href="https://carto.com/basemaps" external>
              Carto
            </DocsLink>{" "}
            - Clean, minimal basemaps perfect for data visualization
          </li>
          <li>
            <DocsLink href="https://www.maptiler.com" external>
              MapTiler
            </DocsLink>{" "}
            - Beautiful vector tiles with extensive customization options
          </li>
          <li>
            <DocsLink href="https://stadiamaps.com" external>
              Stadia Maps
            </DocsLink>{" "}
            - Fast, reliable tile hosting with multiple styles
          </li>
          <li>
            <DocsLink href="https://www.thunderforest.com" external>
              Thunderforest
            </DocsLink>{" "}
            - Specialized maps for outdoors, cycling, and transport
          </li>
          <li>And any other provider that supports the MapLibre style spec</li>
        </ul>
      </DocsSection>

      <DocsSection title="Features">
        <div className="not-prose mt-4 grid gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-surface space-y-3 rounded-lg p-4"
            >
              <div className="flex items-center gap-2.5">
                <feature.icon className="text-muted-foreground size-4" />
                <h3 className="text-foreground text-base font-medium">
                  {feature.title}
                </h3>
              </div>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </DocsSection>
    </DocsLayout>
  );
}
