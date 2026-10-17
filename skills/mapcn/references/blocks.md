# Blocks

Full pages built from the map components, installed into the user's app with the shadcn CLI. Most ship with sample data (usually `data.ts`): swap in the user's data.

## Routes outside the Next.js App Router

Block files install to App Router paths (`app/<route>/page.tsx`, with `data.ts` and `components/` beside it). Every block page is a `"use client"` component with `export default function Page`. Check the project's router and move the files to match:

- **Next.js App Router:** keep the paths. Rename the route folder if it clashes with an existing page.
- **Remix or React Router (framework mode):** `app/` is the app's own source folder. Move the page into `app/routes/` (for example `app/routes/store-locator.tsx`), or register it in `app/routes.ts` if the project uses config routes. Keep `data.ts` and `components/` outside `app/routes/`.
- **Next.js Pages Router:** move the page to `pages/<route>.tsx`, or `pages/<route>/index.tsx`, and keep `data.ts` and `components/` outside `pages/` so they don't become routes.
- **Vite, React Router, TanStack Router and others:** move the folder to where the project keeps pages (for example `src/pages/<route>/`), rename `page.tsx` and `Page` to something like `StoreLocatorPage`, and register it in the router config.
- **No router:** render the page component where the user wants it.

After moving, fix the relative imports (`./data`, `./components/...`) and delete only the emptied `app/<route>/` folder the block created. Never delete `app/` itself: in Next.js, Remix and React Router it holds the rest of the app.

## Analytics Map

Real-time analytics overview with a world map, breakdown cards, and device stats.

```bash
npx shadcn@latest add @mapcn/analytics-map
```

- Adds the page at `app/analytics/page.tsx`
- Files: `app/analytics/page.tsx`, `app/analytics/data.ts`, `app/analytics/components/overview-card.tsx`, `app/analytics/components/breakdown-card.tsx`
- Pulls in: `@mapcn/map`, `card`, `chart`
- Preview: https://mapcn.dev/blocks/analytics-map

## Choropleth

World choropleth map shading countries by a metric, with a hover tooltip and legend.

```bash
npx shadcn@latest add @mapcn/choropleth
```

- Adds the page at `app/choropleth/page.tsx`
- Files: `app/choropleth/page.tsx`, `app/choropleth/data.ts`, `@lib/use-world-data.ts`
- Reads the theme with `useTheme` from `next-themes`. Without next-themes, use the project's own theme hook, or remove it and let the map follow the theme itself.
- Pulls in: `@mapcn/map`
- Preview: https://mapcn.dev/blocks/choropleth

## Analytics Card

Compact analytics card with a headline metric over a world map.

```bash
npx shadcn@latest add @mapcn/analytics-card
```

- Adds the page at `app/analytics-card/page.tsx`
- Files: `app/analytics-card/page.tsx`, `app/analytics-card/data.ts`
- Pulls in: `@mapcn/map`, `card`, `badge`
- Preview: https://mapcn.dev/blocks/analytics-card

## Delivery Tracker

Live order tracking with route progress, courier position, and order details.

```bash
npx shadcn@latest add @mapcn/delivery-tracker
```

- Adds the page at `app/delivery/page.tsx`
- Files: `app/delivery/page.tsx`, `app/delivery/data.ts`
- Reads the theme with `useTheme` from `next-themes`. Without next-themes, use the project's own theme hook, or remove it and let the map follow the theme itself.
- Pulls in: `@mapcn/map`, `card`, `badge`, `button`
- Preview: https://mapcn.dev/blocks/delivery-tracker

## Uptime Monitor

Status-page style map of edge network locations with live health, latency, and uptime.

```bash
npx shadcn@latest add @mapcn/uptime-monitor
```

- Adds the page at `app/uptime-monitor/page.tsx`
- Files: `app/uptime-monitor/page.tsx`, `app/uptime-monitor/data.ts`, `app/uptime-monitor/components/edge-node-marker.tsx`, `app/uptime-monitor/components/status-sidebar.tsx`
- Pulls in: `@mapcn/map`
- Preview: https://mapcn.dev/blocks/uptime-monitor

## Heatmap

Globe-projected heatmap visualizing earthquake density with zoom-dependent styling.

```bash
npx shadcn@latest add @mapcn/heatmap
```

- Adds the page at `app/heatmap/page.tsx`
- Files: `app/heatmap/page.tsx`
- Pulls in: `@mapcn/map`
- Preview: https://mapcn.dev/blocks/heatmap

## Logistics Network

Domestic logistics map with a sidebar of stats.

```bash
npx shadcn@latest add @mapcn/logistics-network
```

- Adds the page at `app/logistics/page.tsx`
- Files: `app/logistics/page.tsx`, `app/logistics/data.ts`, `app/logistics/components/filter-sidebar.tsx`, `app/logistics/components/network-map.tsx`
- Pulls in: `@mapcn/map`, `sidebar`, `separator`
- Preview: https://mapcn.dev/blocks/logistics-network

## Store Locator

Searchable store list synced with map markers.

```bash
npx shadcn@latest add @mapcn/store-locator
```

- Adds the page at `app/store-locator/page.tsx`
- Files: `app/store-locator/page.tsx`, `app/store-locator/data.ts`, `app/store-locator/components/store-list.tsx`, `app/store-locator/components/locator-map.tsx`
- Pulls in: `@mapcn/map`, `input`, `sidebar`
- Preview: https://mapcn.dev/blocks/store-locator
