# Components

All exports come from `@/components/ui/map`, installed by `npx shadcn@latest add @mapcn/map`. Every prop is typed and commented in that file, so read it for exact props. Prop types are exported too (`MapProps`, `MapMarkerProps`, …), along with `MapRef` for `<Map ref>` and `MapViewport`.

Examples link to the source of the demos in the docs. Fetch one only when you need a full working version. If a link fails, the docs page above shows the same example. They import from `@/registry/map`, which is `@/components/ui/map` in an installed project.

## Map

Docs: https://mapcn.dev/docs/basic-map

- `Map`: The map itself. Fills its parent, takes `center` ([lng, lat]), `zoom`, `theme`, `styles`, `blank`, `projection`, controlled `viewport`, `loading`, plus any MapLibre map option.
- `useMap`: Hook for children of `<Map>`: returns `{ map, isLoaded }` for raw MapLibre access.

Examples:
- https://raw.githubusercontent.com/AnmolSaini16/mapcn/752906803fbba96490914adc760ab0efdab69457/src/app/(main)/docs/_components/examples/basic-map-example.tsx
- https://raw.githubusercontent.com/AnmolSaini16/mapcn/752906803fbba96490914adc760ab0efdab69457/src/app/(main)/docs/_components/examples/controlled-map-example.tsx
- https://raw.githubusercontent.com/AnmolSaini16/mapcn/752906803fbba96490914adc760ab0efdab69457/src/app/(main)/docs/_components/examples/custom-style-example.tsx
- https://raw.githubusercontent.com/AnmolSaini16/mapcn/752906803fbba96490914adc760ab0efdab69457/src/app/(main)/docs/_components/examples/blank-map-example.tsx

## Controls

Docs: https://mapcn.dev/docs/controls

- `MapControls`: Zoom, compass, locate and fullscreen buttons. Pick with `showZoom`, `showCompass`, `showLocate`, `showFullscreen` and place with `position`.

Examples:
- https://raw.githubusercontent.com/AnmolSaini16/mapcn/752906803fbba96490914adc760ab0efdab69457/src/app/(main)/docs/_components/examples/map-controls-example.tsx

## Markers

Docs: https://mapcn.dev/docs/markers

- `MapMarker`: A DOM marker at `longitude`/`latitude`. Supports `draggable` and click, hover and drag handlers.
- `MarkerContent`: Custom marker visuals. Any React content; defaults to a dot.
- `MarkerPopup`: Popup that opens when its marker is clicked.
- `MarkerTooltip`: Tooltip shown while hovering its marker.
- `MarkerLabel`: Text label above or below its marker (`position`).

Examples:
- https://raw.githubusercontent.com/AnmolSaini16/mapcn/752906803fbba96490914adc760ab0efdab69457/src/app/(main)/docs/_components/examples/markers-example.tsx
- https://raw.githubusercontent.com/AnmolSaini16/mapcn/752906803fbba96490914adc760ab0efdab69457/src/app/(main)/docs/_components/examples/popup-example.tsx

## Popups

Docs: https://mapcn.dev/docs/popups

- `MapPopup`: Standalone popup at any coordinate, controlled by your state. Use it for clicks on layers, clusters or arcs.

Examples:
- https://raw.githubusercontent.com/AnmolSaini16/mapcn/752906803fbba96490914adc760ab0efdab69457/src/app/(main)/docs/_components/examples/standalone-popup-example.tsx

## Routes

Docs: https://mapcn.dev/docs/routes

- `MapRoute`: Line through `coordinates` ([lng, lat][]), with `progress` (0–1) for tracking. Render-only: fetch directions in the parent.
- `RouteProgress`: Inside `MapRoute`: styles the travelled part of the route, up to the route's `progress`.
- `RouteMarker`: Inside `MapRoute`: a marker pinned along the route with `at` (`"start"`, `"end"`, `"progress"` or a 0–1 fraction), such as a courier.

Examples:
- https://raw.githubusercontent.com/AnmolSaini16/mapcn/752906803fbba96490914adc760ab0efdab69457/src/app/(main)/docs/_components/examples/route-example.tsx
- https://raw.githubusercontent.com/AnmolSaini16/mapcn/752906803fbba96490914adc760ab0efdab69457/src/app/(main)/docs/_components/examples/route-progress-example.tsx
- https://raw.githubusercontent.com/AnmolSaini16/mapcn/752906803fbba96490914adc760ab0efdab69457/src/app/(main)/docs/_components/examples/osrm-route-example.tsx

## Arcs

Docs: https://mapcn.dev/docs/arcs

- `MapArc`: Curved lines between origin/destination pairs (flights, trade lanes), with hover and click events.

Examples:
- https://raw.githubusercontent.com/AnmolSaini16/mapcn/752906803fbba96490914adc760ab0efdab69457/src/app/(main)/docs/_components/examples/arc-example.tsx
- https://raw.githubusercontent.com/AnmolSaini16/mapcn/752906803fbba96490914adc760ab0efdab69457/src/app/(main)/docs/_components/examples/interactive-arc-example.tsx

## GeoJSON

Docs: https://mapcn.dev/docs/geojson

- `MapGeoJSON`: Fill and outline layers from a GeoJSON object or URL, with `fillPaint`, `linePaint`, `fillHoverPaint` and hover and click events. Pair with `<Map blank>` for choropleths.

Examples:
- https://raw.githubusercontent.com/AnmolSaini16/mapcn/752906803fbba96490914adc760ab0efdab69457/src/app/(main)/docs/_components/examples/geojson-example.tsx
- https://raw.githubusercontent.com/AnmolSaini16/mapcn/752906803fbba96490914adc760ab0efdab69457/src/app/(main)/docs/_components/examples/map-overlay-example.tsx

## Clusters

Docs: https://mapcn.dev/docs/clusters

- `MapClusterLayer`: GPU-clustered points from GeoJSON (object or URL) for large datasets, with point and cluster click handlers.

Examples:
- https://raw.githubusercontent.com/AnmolSaini16/mapcn/752906803fbba96490914adc760ab0efdab69457/src/app/(main)/docs/_components/examples/cluster-example.tsx

## Advanced

Docs: https://mapcn.dev/docs/advanced-usage

Examples:
- https://raw.githubusercontent.com/AnmolSaini16/mapcn/752906803fbba96490914adc760ab0efdab69457/src/app/(main)/docs/_components/examples/advanced-usage-example.tsx
- https://raw.githubusercontent.com/AnmolSaini16/mapcn/752906803fbba96490914adc760ab0efdab69457/src/app/(main)/docs/_components/examples/custom-layer-example.tsx
- https://raw.githubusercontent.com/AnmolSaini16/mapcn/752906803fbba96490914adc760ab0efdab69457/src/app/(main)/docs/_components/examples/layer-markers-example.tsx
