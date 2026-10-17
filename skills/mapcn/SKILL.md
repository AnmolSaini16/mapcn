---
name: mapcn
description: Build maps in React with mapcn, themeable shadcn-style map components on MapLibre GL and Tailwind CSS. Use when the user wants to add, customize or theme a map: markers, popups, tooltips, routes, arcs, GeoJSON or choropleth layers, clusters, a globe, custom basemap styles or light/dark theming, or a full map page (analytics dashboard, delivery tracker, store locator) in a React, Next.js or Vite project using shadcn/ui or Tailwind. Also use when they ask where a map would fit in their app.
---

# mapcn

Map components for React that you install with the shadcn CLI. Everything lives in one file, `components/ui/map.tsx`, built on MapLibre GL and styled with the project's shadcn theme. Blocks are full pages (dashboards, trackers, locators) built from those components.

## When the user hasn't named a map

If they ask what mapcn could do for their app, or where a map would fit:

1. Read the stack (`package.json`, `components.json`) and skim the pages and data models.
2. Suggest 2–4 places a map fits, most noticeable first. Tie each one to something real in their code and name what you'd use, for example:
   - addresses or locations, leading to a **Store Locator** or markers with popups
   - orders or shipments, leading to **Delivery Tracker** (`MapRoute` + `RouteProgress`)
   - per-country or per-region stats, leading to **Choropleth** or **Analytics Map**
   - links between places (flights, traffic, supply chains), leading to `MapArc` or **Logistics Network**
3. Install and build only what the user picks.

## Before you start

1. **shadcn/ui and Tailwind CSS.** Look for `components.json`. If there isn't one, tell the user mapcn needs shadcn/ui and offer to run `npx shadcn@latest init` first.
2. **Already installed?** Check `aliases.ui` in `components.json` (usually `@/components/ui`) for `map.tsx`. If it's there, don't reinstall. Read it instead.

## Install

```bash
npx shadcn@latest add @mapcn/map
```

That adds `components/ui/map.tsx`, installs `maplibre-gl` and adds a few popup and attribution styles to the global CSS. Blocks install the same way, `npx shadcn@latest add @mapcn/<block>`, and pull in the map component themselves. Block files install to Next.js App Router paths (`app/<route>/page.tsx`). In any other setup, move them and register the route: see `references/blocks.md`.

Never write or paste `map.tsx` by hand. If the CLI fails, read https://mapcn.dev/r/map.json, install the dependencies it lists, and report what went wrong.

## Rules

- **Give the map a height.** `<Map>` fills its parent, and a parent without a height shows nothing. Wrap it: `<div className="h-[400px]">` or `<Card className="h-[320px] overflow-hidden p-0">`.
- **Coordinates are `[longitude, latitude]`.** `center={[-74.006, 40.7128]}` is New York. Markers take `longitude` and `latitude` props. Swapping them is the most common bug.
- **Client components only.** `map.tsx` is already `"use client"`. Any component that uses `useMap`, refs or map event handlers needs it too. In Next.js, keep data fetching in a server component and pass the data down.
- **Props are documented in the installed `map.tsx`.** Every prop has a JSDoc comment. Read the types there and don't guess. Don't edit the file unless the user asks.
- **Routes don't fetch.** `MapRoute` only draws the coordinates it's given; `RouteProgress` and `RouteMarker` go inside it and work from that same line. Fetch directions (OSRM, Mapbox, Google) in the parent and pass `[lng, lat][]` down. See the OSRM example linked under Routes in `references/components.md`. `MapGeoJSON` and `MapClusterLayer` take a GeoJSON object or a URL.
- **Use theme colors in your own UI.** Marker content, popups and overlays are plain React, so use `bg-background`, `text-muted-foreground`, `border` and so on. Data colors on lines and fills (`MapRoute color`, paint props) can be real colors.
- **Theme follows the app.** The basemap switches light/dark from a `dark` or `light` class or a `data-theme` attribute on `<html>` (next-themes works out of the box), falling back to the system preference. Pass `theme` only to force one.
- **Raw MapLibre when you need it:** `useMap()` inside `<Map>` returns `{ map, isLoaded }`, or pass a `ref` (`MapRef`) to `<Map>`. Wait for `isLoaded` before adding sources or layers, and remove them on cleanup.

<!-- generated:basemap -->
## Basemap Selection

- Use `<Map>` without `blank` for the default free CARTO basemap tiles. This is best for store locators, delivery tracking, logistics maps, address maps, and any UI where users need streets, place labels, or geographic context.
- Use `<Map blank>` for a transparent, tile-less canvas. Used alone it renders nothing; add your own layers such as `MapGeoJSON`, `MapArc`, markers, clusters, or custom MapLibre layers. This is best for choropleths, arc maps, dot maps, dashboards, and data visualizations where the data should define the geography.
- If the user wants a blank map with only countries or country borders, use `<Map blank>` with `<MapGeoJSON data={WORLD_GEOJSON} />`. For world countries, a Natural Earth GeoJSON source works well: `https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@v5.1.2/geojson/ne_110m_admin_0_countries.geojson`. Users can also provide their own GeoJSON URL or GeoJSON object to `MapGeoJSON`.
- Use the `styles` prop for custom MapLibre-compatible style URLs or style objects, for example MapTiler, OpenFreeMap, CARTO, or a self-hosted style. Explicit `styles` override `blank`.
<!-- /generated:basemap -->

## Components

Everything is imported from `@/components/ui/map`:

<!-- generated:components -->
- **Map:** `Map`, `useMap`
- **Controls:** `MapControls`
- **Markers:** `MapMarker`, `MarkerContent`, `MarkerPopup`, `MarkerTooltip`, `MarkerLabel`
- **Popups:** `MapPopup`
- **Routes:** `MapRoute`, `RouteProgress`, `RouteMarker`
- **Arcs:** `MapArc`
- **GeoJSON:** `MapGeoJSON`
- **Clusters:** `MapClusterLayer`
<!-- /generated:components -->

## References

Read only what the task needs. Reading this from a URL instead of an installed skill? The same files are at https://raw.githubusercontent.com/AnmolSaini16/mapcn/main/skills/mapcn/references/.

- `references/components.md`: every export with what it's for, its docs page and links to example source
- `references/blocks.md`: each block, what it shows, the files it adds and its install command
- `references/patterns.md`: controlled viewport, fly-to, route fetching, custom layers, large datasets, Web Worker and CSP
