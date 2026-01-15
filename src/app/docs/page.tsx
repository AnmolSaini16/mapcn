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
      description="Beautiful, accessible map components."
      next={{ title: "Installation", href: "/docs/installation" }}
      toc={[
        { title: "Why mapcn?", slug: "why-mapcn" },
        { title: "Why MapLibre Directly?", slug: "why-maplibre-directly" },
        { title: "Any Map Style", slug: "any-map-style" },
        { title: "Features", slug: "features" },
      ]}
    >
      <DocsSection>
        <p>
          <strong className="text-foreground">mapcn</strong> provides
          beautifully designed, accessible, and customizable map components.
          Built on{" "}
          <DocsLink href="https://visgl.github.io/react-map-gl/" external>
            react-map-gl
          </DocsLink>{" "}
          and{" "}
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

      <DocsSection title="Why mapcn?">
        <p>
          There&apos;s no proper copy-paste, easy-to-use map integration for
          React. Most solutions require complex configurations, API keys, or
          heavy wrapper libraries. mapcn solves this:
        </p>
        <ul>
          <li>
            <strong className="text-foreground">One Command:</strong> Run the
            install, get a working map. No config files, no API keys, no setup.
          </li>
          <li>
            <strong className="text-foreground">Own Your Code:</strong> Copy the
            components into your project. Modify anything.
          </li>
          <li>
            <strong className="text-foreground">No Wrapper Overhead:</strong>{" "}
            Built directly on MapLibre. Drop to the raw API whenever you need.
          </li>
          <li>
            <strong className="text-foreground">Looks Good Already:</strong>{" "}
            Thoughtful defaults with dark mode. Style with Tailwind as needed.
          </li>
          <li>
            <strong className="text-foreground">Works Anywhere:</strong> Bring
            your own tiles — MapTiler, Carto, OSM, or any MapLibre-compatible
            source.
          </li>
        </ul>
      </DocsSection>

      <DocsSection title="Why MapLibre Directly?">
        <p>
          mapcn uses{" "}
          <DocsLink href="https://maplibre.org" external>
            MapLibre
          </DocsLink>{" "}
          directly instead of wrapper libraries like{" "}
          <DocsLink href="https://visgl.github.io/react-map-gl" external>
            react-map-gl
          </DocsLink>
          . This keeps components close to the underlying API — when you copy a
          mapcn component, you fully own the map instance without extra
          framework dependencies.
        </p>
        <p>
          UI elements like markers, popups, and tooltips are rendered via React
          portals, giving you complete styling freedom. You can drop down to raw
          MapLibre APIs anytime without &quot;escaping&quot; a wrapper.
        </p>
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
            <DocsLink href="https://www.maptiler.com" external>
              MapTiler
            </DocsLink>{" "}
            - Beautiful vector tiles with extensive customization options
          </li>
          <li>
            <DocsLink href="https://carto.com/basemaps" external>
              Carto
            </DocsLink>{" "}
            - Clean, minimal basemaps perfect for data visualization
          </li>
          <li>
            <DocsLink href="https://www.openstreetmap.org" external>
              OpenStreetMap
            </DocsLink>{" "}
            - Community-driven, open-source map data
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
        <div className="grid gap-4 sm:grid-cols-2 mt-4 not-prose">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-lg border bg-card p-4 space-y-2"
            >
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-md bg-primary/10">
                  <feature.icon className="size-4 text-primary" />
                </div>
                <h3 className="font-medium text-foreground">{feature.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </DocsSection>
    </DocsLayout>
  );
}
