import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";

import registry from "../registry.json";
import { createBasemapMarkdown, type RegistryItem } from "@/lib/llm-content";

// SKILL.md and references/patterns.md are hand-written. This script fills the
// generated sections of SKILL.md and rewrites the generated reference files.
const ROOT = process.cwd();
const SKILL_DIR = path.join(ROOT, "skills", "mapcn");
const REFERENCES_DIR = path.join(SKILL_DIR, "references");
const DOCS_DIR = path.join(ROOT, "src/app/(main)/docs");
const SITE = "https://mapcn.dev";
const EXAMPLES_PATH = "src/app/(main)/docs/_components/examples";
const EXAMPLES_RAW = `https://raw.githubusercontent.com/AnmolSaini16/mapcn/${getExamplesCommit()}/${EXAMPLES_PATH}`;

const groups: {
  title: string;
  docs: string;
  exports: Record<string, string>;
}[] = [
  {
    title: "Map",
    docs: "/docs/basic-map",
    exports: {
      Map: "The map itself. Fills its parent, takes `center` ([lng, lat]), `zoom`, `theme`, `styles`, `blank`, `projection`, controlled `viewport`, `loading`, plus any MapLibre map option.",
      useMap:
        "Hook for children of `<Map>`: returns `{ map, isLoaded }` for raw MapLibre access.",
    },
  },
  {
    title: "Controls",
    docs: "/docs/controls",
    exports: {
      MapControls:
        "Zoom, compass, locate and fullscreen buttons. Pick with `showZoom`, `showCompass`, `showLocate`, `showFullscreen` and place with `position`.",
    },
  },
  {
    title: "Markers",
    docs: "/docs/markers",
    exports: {
      MapMarker:
        "A DOM marker at `longitude`/`latitude`. Supports `draggable` and click, hover and drag handlers.",
      MarkerContent:
        "Custom marker visuals. Any React content; defaults to a dot.",
      MarkerPopup: "Popup that opens when its marker is clicked.",
      MarkerTooltip: "Tooltip shown while hovering its marker.",
      MarkerLabel: "Text label above or below its marker (`position`).",
    },
  },
  {
    title: "Popups",
    docs: "/docs/popups",
    exports: {
      MapPopup:
        "Standalone popup at any coordinate, controlled by your state. Use it for clicks on layers, clusters or arcs.",
    },
  },
  {
    title: "Routes",
    docs: "/docs/routes",
    exports: {
      MapRoute:
        "Line through `coordinates` ([lng, lat][]), with `progress` (0–1) for tracking. Render-only: fetch directions in the parent.",
      RouteProgress:
        "Inside `MapRoute`: styles the travelled part of the route, up to the route's `progress`.",
      RouteMarker:
        'Inside `MapRoute`: a marker pinned along the route with `at` (`"start"`, `"end"`, `"progress"` or a 0–1 fraction), such as a courier.',
    },
  },
  {
    title: "Arcs",
    docs: "/docs/arcs",
    exports: {
      MapArc:
        "Curved lines between origin/destination pairs (flights, trade lanes), with hover and click events.",
    },
  },
  {
    title: "GeoJSON",
    docs: "/docs/geojson",
    exports: {
      MapGeoJSON:
        "Fill and outline layers from a GeoJSON object or URL, with `fillPaint`, `linePaint`, `fillHoverPaint` and hover and click events. Pair with `<Map blank>` for choropleths.",
    },
  },
  {
    title: "Clusters",
    docs: "/docs/clusters",
    exports: {
      MapClusterLayer:
        "GPU-clustered points from GeoJSON (object or URL) for large datasets, with point and cluster click handlers.",
    },
  },
];

// Pin example links to the last commit that touched them, so an installed
// skill keeps working when examples are renamed or moved on main.
function getExamplesCommit() {
  const git = (...args: string[]) =>
    execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim();
  try {
    if (git("status", "--porcelain", "--", EXAMPLES_PATH)) {
      console.warn(
        "Docs examples have uncommitted changes: commit them and rebuild, or example links will point at the previous versions.",
      );
    }
    return git("log", "-1", "--format=%H", "--", EXAMPLES_PATH) || "main";
  } catch {
    return "main";
  }
}

function getMapExports() {
  const source = fs.readFileSync(
    path.join(ROOT, "src/registry/map.tsx"),
    "utf8",
  );
  const block = source.match(/^export \{([^}]+)\};/m);
  if (!block) throw new Error("Couldn't find the export block in map.tsx");
  return block[1]
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);
}

function checkExportsCovered() {
  const documented = new Set(groups.flatMap((g) => Object.keys(g.exports)));
  const exported = getMapExports();
  const missing = exported.filter((name) => !documented.has(name));
  const stale = [...documented].filter((name) => !exported.includes(name));
  if (missing.length || stale.length) {
    throw new Error(
      [
        missing.length && `Undocumented exports: ${missing.join(", ")}`,
        stale.length && `Documented but not exported: ${stale.join(", ")}`,
      ]
        .filter(Boolean)
        .join("\n") + "\nUpdate `groups` in scripts/build-skill.ts.",
    );
  }
}

function fillSection(source: string, name: string, content: string) {
  const pattern = new RegExp(
    `(<!-- generated:${name} -->)[\\s\\S]*?(<!-- /generated:${name} -->)`,
  );
  if (!pattern.test(source)) {
    throw new Error(`SKILL.md is missing the generated:${name} markers`);
  }
  return source.replace(
    pattern,
    (_, open, close) => `${open}\n${content.trim()}\n${close}`,
  );
}

function createComponentList() {
  return groups
    .map(
      (g) =>
        `- **${g.title}:** ${Object.keys(g.exports)
          .map((name) => `\`${name}\``)
          .join(", ")}`,
    )
    .join("\n");
}

function createComponentsMarkdown() {
  const sections = groups.map((g) =>
    [
      `## ${g.title}`,
      "",
      `Docs: ${SITE}${g.docs}`,
      "",
      ...Object.entries(g.exports).map(
        ([name, description]) => `- \`${name}\`: ${description}`,
      ),
      ...formatExamples(g.docs),
    ].join("\n"),
  );

  return [
    "# Components",
    "",
    "All exports come from `@/components/ui/map`, installed by `npx shadcn@latest add @mapcn/map`. Every prop is typed and commented in that file, so read it for exact props. Prop types are exported too (`MapProps`, `MapMarkerProps`, …), along with `MapRef` for `<Map ref>` and `MapViewport`.\n\nExamples link to the source of the demos in the docs. Fetch one only when you need a full working version. If a link fails, the docs page above shows the same example. They import from `@/registry/map`, which is `@/components/ui/map` in an installed project.",
    "",
    ...sections.flatMap((s) => [s, ""]),
    "## Advanced",
    "",
    `Docs: ${SITE}/docs/advanced-usage`,
    ...formatExamples("/docs/advanced-usage"),
    "",
  ].join("\n");
}

// Examples shown on a docs page, read from its getExampleSource() calls.
function formatExamples(docs: string) {
  const page = path.join(DOCS_DIR, docs.replace(/^\/docs\/?/, ""), "page.tsx");
  const source = fs.readFileSync(page, "utf8");
  const files = [...source.matchAll(/getExampleSource\("([^"]+)"\)/g)].map(
    (match) => match[1],
  );
  if (!files.length) return [];
  return ["", "Examples:", ...files.map((file) => `- ${EXAMPLES_RAW}/${file}`)];
}

function usesNextThemes(block: RegistryItem) {
  return (block.files ?? []).some((file) =>
    fs.readFileSync(path.join(ROOT, file.path), "utf8").includes("next-themes"),
  );
}

function createBlocksMarkdown() {
  const blocks = (registry.items as RegistryItem[]).filter(
    (item) => item.type === "registry:block",
  );

  const sections = blocks.map((block) => {
    const page = block.files?.find((file) => file.type === "registry:page");
    return [
      `## ${block.title ?? block.name}`,
      "",
      block.description ?? "",
      "",
      "```bash",
      `npx shadcn@latest add @mapcn/${block.name}`,
      "```",
      "",
      page?.target ? `- Adds the page at \`${page.target}\`` : null,
      `- Files: ${(block.files ?? []).map((file) => `\`${file.target ?? file.path}\``).join(", ")}`,
      usesNextThemes(block)
        ? "- Reads the theme with `useTheme` from `next-themes`. Without next-themes, use the project's own theme hook, or remove it and let the map follow the theme itself."
        : null,
      block.registryDependencies?.length
        ? `- Pulls in: ${block.registryDependencies.map((dep) => `\`${dep}\``).join(", ")}`
        : null,
      `- Preview: ${SITE}/blocks/${block.name}`,
    ]
      .filter((line) => line !== null)
      .join("\n");
  });

  return [
    "# Blocks",
    "",
    "Full pages built from the map components, installed into the user's app with the shadcn CLI. Most ship with sample data (usually `data.ts`): swap in the user's data.",
    "",
    "## Routes outside the Next.js App Router",
    "",
    'Block files install to App Router paths (`app/<route>/page.tsx`, with `data.ts` and `components/` beside it). Every block page is a `"use client"` component with `export default function Page`. Check the project\'s router and move the files to match:',
    "",
    "- **Next.js App Router:** keep the paths. Rename the route folder if it clashes with an existing page.",
    "- **Remix or React Router (framework mode):** `app/` is the app's own source folder. Move the page into `app/routes/` (for example `app/routes/store-locator.tsx`), or register it in `app/routes.ts` if the project uses config routes. Keep `data.ts` and `components/` outside `app/routes/`.",
    "- **Next.js Pages Router:** move the page to `pages/<route>.tsx`, or `pages/<route>/index.tsx`, and keep `data.ts` and `components/` outside `pages/` so they don't become routes.",
    "- **Vite, React Router, TanStack Router and others:** move the folder to where the project keeps pages (for example `src/pages/<route>/`), rename `page.tsx` and `Page` to something like `StoreLocatorPage`, and register it in the router config.",
    "- **No router:** render the page component where the user wants it.",
    "",
    "After moving, fix the relative imports (`./data`, `./components/...`) and delete only the emptied `app/<route>/` folder the block created. Never delete `app/` itself: in Next.js, Remix and React Router it holds the rest of the app.",
    "",
    ...sections.flatMap((s) => [s, ""]),
  ].join("\n");
}

function main() {
  checkExportsCovered();

  const skillPath = path.join(SKILL_DIR, "SKILL.md");
  let skill = fs.readFileSync(skillPath, "utf8");
  skill = fillSection(skill, "basemap", createBasemapMarkdown());
  skill = fillSection(skill, "components", createComponentList());
  fs.writeFileSync(skillPath, skill);

  fs.writeFileSync(
    path.join(REFERENCES_DIR, "components.md"),
    createComponentsMarkdown(),
  );
  fs.writeFileSync(
    path.join(REFERENCES_DIR, "blocks.md"),
    createBlocksMarkdown(),
  );
  console.log("Built skills/mapcn: SKILL.md, components.md, blocks.md");
}

main();
