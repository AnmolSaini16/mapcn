import registry from "../../registry.json";

import { mapInstallCommand } from "@/lib/llm-prompts";

interface ComponentDoc {
  title: string;
  href: string;
  description: string;
}

interface RegistryFile {
  path: string;
  target?: string;
  type?: string;
}

export interface RegistryItem {
  name: string;
  type: string;
  title?: string;
  description?: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files?: RegistryFile[];
  categories?: string[];
  meta?: {
    components?: ComponentDoc[];
  };
}

interface RegistrySchema {
  name: string;
  homepage?: string;
  items: RegistryItem[];
}

const typedRegistry = registry as RegistrySchema;

function code(value: string) {
  return `\`${value}\``;
}

function formatList(items: string[] | undefined, fallback = "None") {
  if (!items?.length) return fallback;
  return items.map((item) => `- ${item}`).join("\n");
}

function formatFiles(files: RegistryFile[] | undefined) {
  if (!files?.length) return "None";

  return files
    .map((file) => {
      const target = file.target ? ` -> ${file.target}` : "";
      const type = file.type ? ` (${file.type})` : "";
      return `- ${file.path}${target}${type}`;
    })
    .join("\n");
}

function createBasemapMarkdown() {
  return `## Basemap Selection

- Use ${code("<Map>")} without ${code("blank")} for the default free CARTO basemap tiles. This is best for store locators, delivery tracking, logistics maps, address maps, and any UI where users need streets, place labels, or geographic context.
- Use ${code("<Map blank>")} for a transparent, tile-less canvas. Used alone it renders nothing; add your own layers such as ${code("MapGeoJSON")}, ${code("MapArc")}, markers, clusters, or custom MapLibre layers. This is best for choropleths, arc maps, dot maps, dashboards, and data visualizations where the data should define the geography.
- If the user wants a blank map with only countries or country borders, use ${code("<Map blank>")} with ${code("<MapGeoJSON data={WORLD_GEOJSON} />")}. For world countries, a Natural Earth GeoJSON source works well: ${code("https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@v5.1.2/geojson/ne_110m_admin_0_countries.geojson")}. Users can also provide their own GeoJSON URL or GeoJSON object to ${code("MapGeoJSON")}.
- Use the ${code("styles")} prop for custom MapLibre-compatible style URLs or style objects, for example MapTiler, OpenFreeMap, CARTO, or a self-hosted style. Explicit ${code("styles")} override ${code("blank")}.
`;
}

function getComponentDocs() {
  return typedRegistry.items.flatMap((item) => {
    if (item.type !== "registry:ui") return [];

    const components = item.meta?.components ?? [
      {
        title: item.title ?? item.name,
        href: `/llm/${item.name}`,
        description: item.description ?? "No description.",
      },
    ];

    return components;
  });
}

export function getRegistryItem(name: string) {
  return typedRegistry.items.find((entry) => entry.name === name);
}

export function getRegistryItemNames() {
  return typedRegistry.items.map((item) => item.name);
}

export function createLlmIndexMarkdown() {
  const components = getComponentDocs();
  const blocks = typedRegistry.items.filter(
    (item) => item.type === "registry:block",
  );

  return `# mapcn

mapcn is a free, open-source shadcn-style registry of ready-to-use React map components and blocks. It is built on MapLibre GL, styled with Tailwind CSS, and intended for projects that already use shadcn/ui.

Website: ${typedRegistry.homepage ?? "https://mapcn.dev"}
Registry index: https://mapcn.dev/r/registry.json

## Install the base map component

Run:

\`\`\`bash
${mapInstallCommand}
\`\`\`

Then import from ${code("@/components/ui/map")}:

\`\`\`tsx
import { Map, MapControls } from "@/components/ui/map";

export function MyMap() {
  return (
    <div className="h-[320px] overflow-hidden rounded-lg">
      <Map center={[-74.006, 40.7128]} zoom={11}>
        <MapControls />
      </Map>
    </div>
  );
}
\`\`\`

${createBasemapMarkdown()}

## Components

Install once with ${code(mapInstallCommand)}, then import these APIs from ${code("@/components/ui/map")}:

${components.map((item) => `- [${item.title}](${item.href}) - ${item.description}`).join("\n")}

## Blocks

${blocks.map((item) => `- [${item.title ?? item.name}](/llm/${item.name}) - install with ${code(`npx shadcn@latest add @mapcn/${item.name}`)}`).join("\n")}
`;
}

export function createLlmItemMarkdown(item: RegistryItem) {
  const installCommand = `npx shadcn@latest add @mapcn/${item.name}`;

  return `# ${item.title ?? item.name}

${item.description ?? "No description available."}

Type: ${code(item.type)}
Registry item: https://mapcn.dev/r/${item.name}.json

## Install

\`\`\`bash
${installCommand}
\`\`\`

## Dependencies

${formatList(item.dependencies)}

## Registry Dependencies

${formatList(item.registryDependencies)}

## Files

${formatFiles(item.files)}

${item.name === "map" ? createBasemapMarkdown() : ""}
`;
}
