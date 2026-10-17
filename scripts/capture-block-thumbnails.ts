import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { chromium, type Locator, type Page } from "playwright";
import registry from "../registry.json";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const blocksDir = path.join(process.cwd(), "public", "blocks");
const showcaseDir = path.join(process.cwd(), "public", "showcase");
const sizesFile = path.join(
  process.cwd(),
  "src/app/(main)/(home)/_components/showcase-sizes.json",
);
const viewport = { width: 1280, height: 800 };
const schemes = ["light", "dark"] as const;

// Smaller than the default, so block UI matches the docs maps in scale.
const blockViewport = { width: 960, height: 640 };

// Home page wall tiles. `click` presses something first (and hides it if it is
// a button), `zoom` and `pan` (in pixels) reframe the map, and `trim` cuts
// pixels off the top and bottom.
const showcaseMaps: ShowcaseMap[] = [
  { name: "globe", path: "/docs/arcs" },
  { name: "arcs", path: "/docs/arcs", index: 1 },
  { name: "clusters", path: "/docs/clusters", zoom: -0.4 },
  { name: "geojson-overlay", path: "/docs/geojson", index: 1 },
  {
    name: "marker-popup",
    path: "/docs/markers",
    index: 1,
    click: '.maplibregl-marker:has-text("Museum") .bg-rose-500',
    zoom: -0.6,
    pan: [-120, 40],
  },
  { name: "popup", path: "/docs/popups" },
  { name: "route", path: "/docs/routes" },
  { name: "route-progress", path: "/docs/routes", index: 1 },
  { name: "route-alternatives", path: "/docs/routes", index: 2 },
  {
    name: "custom-layer",
    path: "/docs/advanced-usage",
    index: 1,
    click: 'button:has-text("Show Parks")',
  },
  { name: "analytics-card", path: "/view/analytics-card" },
  {
    name: "delivery-tracker",
    path: "/view/delivery-tracker",
    zoom: -0.55,
    trim: [90, 95],
  },
  { name: "uptime-monitor", path: "/view/uptime-monitor", trim: [25, 65] },
  { name: "analytics-map", path: "/view/analytics-map" },
  {
    name: "choropleth",
    path: "/view/choropleth",
    viewport: blockViewport,
    zoom: -0.4,
    pan: [-45, -35],
  },
  {
    name: "heatmap",
    path: "/view/heatmap",
    viewport: blockViewport,
    zoom: -0.4,
  },
  {
    name: "logistics-network",
    path: "/view/logistics-network",
    viewport: { width: 1100, height: 600 },
    zoom: -0.8,
    trim: [0, 70],
  },
];

// The page credits the map data once, so tiles leave out map chrome.
const hideControls = `
  .maplibregl-ctrl,
  .maplibregl-map div:has(> div > button:is(
    [aria-label="Zoom in"],
    [aria-label="Find my location"],
    [aria-label="Toggle fullscreen"],
    [aria-label="Reset bearing to north"]
  )) { display: none !important; }
`;

// Names limit the run to those blocks and tiles; `--blocks` or `--showcase`
// limits it to one set.
const args = process.argv.slice(2);
const names = args.filter((arg) => !arg.startsWith("--"));
const include = (name: string) => names.length === 0 || names.includes(name);

const blocks = args.includes("--showcase")
  ? []
  : registry.items
      .filter((item) => item.type === "registry:block")
      .map((item) => item.name)
      .filter(include);

// Maps sharing a page and viewport are captured from one page load.
const showcasePages = new Map<string, ShowcaseMap[]>();
if (!args.includes("--blocks")) {
  for (const map of showcaseMaps.filter((map) => include(map.name))) {
    const key = JSON.stringify([map.path, map.viewport ?? viewport]);
    showcasePages.set(key, [...(showcasePages.get(key) ?? []), map]);
  }
}

async function main() {
  await mkdir(blocksDir, { recursive: true });
  await mkdir(showcaseDir, { recursive: true });
  const browser = await chromium.launch();
  const sizes: Sizes = {};

  for (const scheme of schemes) {
    const context = await browser.newContext({
      viewport,
      colorScheme: scheme,
    });
    const page = await context.newPage();

    for (const name of blocks) {
      await open(page, `/view/${name}`);
      const file = path.join(blocksDir, `${name}-${scheme}.jpg`);
      await page.screenshot({ path: file, type: "jpeg", quality: 85 });
      logSaved(file);
    }

    for (const maps of showcasePages.values()) {
      await page.setViewportSize(maps[0].viewport ?? viewport);
      await open(page, maps[0].path);
      await page.addStyleTag({ content: hideControls });

      for (const map of maps) {
        const element = page.locator(".maplibregl-map").nth(map.index ?? 0);
        await element.scrollIntoViewIfNeeded();
        if (map.zoom || map.pan) await adjustView(element, map.zoom, map.pan);
        if (map.click) {
          const target = await page.locator(map.click).elementHandle();
          await target?.click();
          await target?.evaluate((node) => {
            if (node.tagName === "BUTTON") node.style.visibility = "hidden";
          });
        }
        await page.waitForTimeout(2_000);
        sizes[map.name] = await captureMap(
          page,
          element,
          path.join(showcaseDir, `${map.name}-${scheme}.jpg`),
          map.trim,
        );
      }
    }

    await context.close();
  }

  await browser.close();
  if (Object.keys(sizes).length > 0) await saveSizes(sizes);
}

async function open(page: Page, route: string) {
  await page.goto(`${baseUrl}${route}`, { waitUntil: "load" });
  await page.addStyleTag({
    content: "nextjs-portal { display: none !important; }",
  });
  await page.waitForSelector(".maplibregl-canvas", { timeout: 15_000 });
  await page
    .waitForLoadState("networkidle", { timeout: 10_000 })
    .catch(() => {});
  await page.waitForTimeout(1_500);
}

// The Map component keeps its MapLibre instance in React state, so this walks
// React's internals to reach it. It throws if a React upgrade moves them.
async function adjustView(
  element: Locator,
  zoom = 0,
  [x, y]: [number, number] = [0, 0],
) {
  await element.evaluate(
    async (node, { zoom, x, y }) => {
      type MapInstance = {
        getZoom(): number;
        setMinZoom(zoom: number | null): void;
        unproject(point: [number, number]): unknown;
        jumpTo(options: { zoom: number; center: unknown }): void;
        once(event: string, listener: () => void): void;
      };
      type Hook = { memoizedState: unknown; next: Hook | null };
      type Fiber = { memoizedState: Hook | null; return: Fiber | null };

      const key = Object.keys(node).find((key) =>
        key.startsWith("__reactFiber"),
      );
      let map: MapInstance | undefined;
      for (
        let fiber = (node as unknown as Record<string, Fiber>)[key ?? ""];
        fiber && !map;
        fiber = fiber.return!
      ) {
        for (let hook = fiber.memoizedState; hook && !map; hook = hook.next) {
          const state = hook.memoizedState as Partial<MapInstance> | null;
          if (typeof state?.getZoom === "function") map = state as MapInstance;
        }
      }
      if (!map) throw new Error("Map instance not found");

      const idle = new Promise<void>((resolve) => map.once("idle", resolve));
      const { clientWidth: width, clientHeight: height } = node as HTMLElement;
      map.setMinZoom(null);
      map.jumpTo({
        zoom: map.getZoom() + zoom,
        center: map.unproject([width / 2 + x, height / 2 + y]),
      });
      await idle;
    },
    { zoom, x, y },
  );
}

// Clips to whole pixels so both themes, and the recorded size, always match.
async function captureMap(
  page: Page,
  element: Locator,
  file: string,
  [top, bottom]: [number, number] = [0, 0],
) {
  await element.scrollIntoViewIfNeeded();
  const box = await element.boundingBox();
  if (!box) throw new Error(`Map for ${file} is not visible`);

  const clip = {
    x: Math.round(box.x),
    y: Math.round(box.y) + top,
    width: Math.round(box.width),
    height: Math.round(box.height) - top - bottom,
  };
  await page.screenshot({ path: file, type: "jpeg", quality: 85, clip });
  logSaved(file);
  return { width: clip.width, height: clip.height };
}

// A partial run keeps the other tiles' sizes; tiles no longer listed in
// `showcaseMaps` are dropped.
async function saveSizes(sizes: Sizes) {
  const existing: Sizes = await readFile(sizesFile, "utf8")
    .then((text) => JSON.parse(text))
    .catch(() => ({}));
  const merged = { ...existing, ...sizes };
  const sorted = Object.fromEntries(
    showcaseMaps
      .map((map) => map.name)
      .filter((name) => name in merged)
      .sort()
      .map((name) => [name, merged[name]]),
  );
  await writeFile(sizesFile, `${JSON.stringify(sorted, null, 2)}\n`);
  logSaved(sizesFile);
}

function logSaved(file: string) {
  console.log(`✓ ${path.relative(process.cwd(), file)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

type ShowcaseMap = {
  name: string;
  path: string;
  index?: number;
  click?: string;
  zoom?: number;
  pan?: [number, number];
  viewport?: typeof viewport;
  trim?: [number, number];
};

type Sizes = Record<string, { width: number; height: number }>;
