# Patterns

Recipes the components don't spell out. All imports come from `@/components/ui/map`.

## Controlled viewport

Pass `viewport` and `onViewportChange` together and the map follows your state. Use `onViewportChange` alone just to observe.

```tsx
const [viewport, setViewport] = useState<MapViewport>({
  center: [-74.006, 40.7128],
  zoom: 8,
  bearing: 0,
  pitch: 0,
});

<Map viewport={viewport} onViewportChange={setViewport} />
```

## Fly to a place

To move the camera from outside the map, for example from a list item, pass a ref:

```tsx
const mapRef = useRef<MapRef>(null);

<Map ref={mapRef} center={[-74.006, 40.7128]} zoom={11} />

mapRef.current?.flyTo({ center: [store.lng, store.lat], zoom: 14 });
```

Inside `<Map>`, use `useMap()`:

```tsx
function FlyButton({ to }: { to: [number, number] }) {
  const { map } = useMap();
  return <Button onClick={() => map?.flyTo({ center: to, zoom: 14 })}>Go</Button>;
}
```

To show a set of points, fit their bounds: `map.fitBounds([[minLng, minLat], [maxLng, maxLat]], { padding: 48 })`.

## Routes from a directions API

`MapRoute` only draws. Fetch in the parent and pass coordinates down. OSRM's demo server is free and needs no key, which makes it fine for prototypes. Use a real provider in production.

```tsx
const res = await fetch(
  `https://router.project-osrm.org/route/v1/driving/${a.lng},${a.lat};${b.lng},${b.lat}?overview=full&geometries=geojson`,
);
const { routes } = await res.json();
const coordinates: [number, number][] = routes[0].geometry.coordinates;

<Map loading={!coordinates}>
  <MapRoute coordinates={coordinates} />
</Map>
```

For live tracking (a courier moving along the route), use `RouteProgress` and `RouteMarker` inside `MapRoute`. Drive the progress from your own state. See the route progress example in `components.md` and the `delivery-tracker` block.

## Custom MapLibre layers

For anything the components don't cover, such as heatmaps, 3D buildings or raster overlays, add sources and layers yourself:

```tsx
function Heat({ data }: { data: GeoJSON.FeatureCollection }) {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded) return;
    map.addSource("heat", { type: "geojson", data });
    map.addLayer({ id: "heat", type: "heatmap", source: "heat" });
    return () => {
      if (map.getLayer("heat")) map.removeLayer("heat");
      if (map.getSource("heat")) map.removeSource("heat");
    };
  }, [map, isLoaded, data]);

  return null;
}
```

When the theme changes, the basemap style reloads and `isLoaded` drops to `false` until the new style is ready. Keying the effect on `isLoaded`, as above, re-adds the layers on their own. Keep the `getLayer`/`getSource` guards in cleanup. See the custom layer example under Advanced in `components.md`.

## Large datasets

- From a few hundred points up: use `MapClusterLayer` instead of many `MapMarker`s. Each marker is a DOM node, but clusters render on the GPU.
- For thousands of styled points or shapes, use a `MapGeoJSON` layer or a custom `circle` layer. Keep DOM markers for the handful that need rich content.
- Memoize the data you pass in (`useMemo`), so React doesn't rebuild the source on every render.

## Choropleth or data-only maps

Use `<Map blank>` with `MapGeoJSON`. Join your metric onto feature properties and color with a MapLibre expression in the fill paint, for example `["interpolate", ["linear"], ["get", "value"], 0, "#e5e7eb", 100, "#1d4ed8"]`. The `choropleth` block is a complete version with a legend and hover tooltip.

## Globe

`<Map projection={{ type: "globe" }} />`. It pairs well with arcs and heatmaps at low zoom.

## Next.js

- Pages can stay server components. Put the map in its own client component, then import and render it.
- If the map must never server-render, for example because it reads `window` at import time, load it with `dynamic(() => import("./my-map"), { ssr: false })` from a client component.

## Web Worker and CSP

MapLibre loads its tile worker from unpkg, pinned to the installed version, so no setup is needed. Under a strict Content Security Policy, allow:

```
script-src 'self' https://unpkg.com;
worker-src 'self' blob:;
```

Add your basemap host too. To self-host the worker, copy `maplibre-gl-worker.mjs` and `maplibre-gl-shared.mjs` from `node_modules/maplibre-gl/dist/` into `public/`, side by side. Then change the worker URL near the top of `map.tsx` to `MapLibreGL.setWorkerUrl("/maplibre-gl-worker.mjs")`.
