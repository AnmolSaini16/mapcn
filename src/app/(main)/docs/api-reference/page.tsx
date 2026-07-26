import {
  DocsLayout,
  DocsSection,
  DocsCode,
  DocsLink,
  DocsNote,
  DocsPropTable,
} from "../_components/docs";
import { CodeBlock } from "../_components/code-block";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Reference",
};

const anatomyCode = `<Map>
  <MapMarker longitude={...} latitude={...}>
    <MarkerContent>
      <MarkerLabel />
    </MarkerContent>
    <MarkerPopup />
    <MarkerTooltip />
  </MapMarker>

  <MapPopup longitude={...} latitude={...} />
  <MapControls />
  <MapRoute coordinates={...} />
  <MapArc data={...} />
  <MapGeoJSON data={...} />
  <MapClusterLayer data={...} />
</Map>`;

const useMapCode = `const { map, isLoaded, styleEpoch } = useMap();`;

export default function ApiReferencePage() {
  return (
    <DocsLayout
      title="API Reference"
      description="Complete reference for all map components and their props."
      prev={{ title: "Installation", href: "/docs/installation" }}
      next={{ title: "Map", href: "/docs/basic-map" }}
      toc={[
        { title: "Component Anatomy", slug: "component-anatomy" },
        { title: "Map", slug: "map" },
        { title: "useMap", slug: "usemap" },
        { title: "MapControls", slug: "mapcontrols" },
        { title: "MapMarker", slug: "mapmarker" },
        { title: "MarkerContent", slug: "markercontent" },
        { title: "MarkerPopup", slug: "markerpopup" },
        { title: "MarkerTooltip", slug: "markertooltip" },
        { title: "MarkerLabel", slug: "markerlabel" },
        { title: "MapPopup", slug: "mappopup" },
        { title: "MapRoute", slug: "maproute" },
        { title: "MapArc", slug: "maparc" },
        { title: "MapGeoJSON", slug: "mapgeojson" },
        { title: "MapClusterLayer", slug: "mapclusterlayer" },
      ]}
    >
      <DocsNote>
        <strong>Note:</strong> This library is built on top of{" "}
        <DocsLink href="https://maplibre.org/maplibre-gl-js/docs/API/" external>
          MapLibre GL JS
        </DocsLink>
        . Most components extend the native MapLibre options. Refer to the{" "}
        <DocsLink
          href="https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/"
          external
        >
          MapLibre Map API
        </DocsLink>{" "}
        for additional options not listed here.
      </DocsNote>

      <DocsSection title="Component Anatomy">
        <p>
          All parts of the component that you can use and combine to build your
          map.
        </p>
        <CodeBlock code={anatomyCode} showCopyButton={false} />
      </DocsSection>

      {/* Map */}
      <DocsSection title="Map">
        <p>
          The root container component that initializes MapLibre GL and provides
          context to child components. Automatically handles theme switching
          between light and dark modes.
        </p>
        <p>
          Extends{" "}
          <DocsLink
            href="https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/MapOptions/"
            external
          >
            MapOptions
          </DocsLink>{" "}
          from MapLibre GL (excluding <DocsCode>container</DocsCode> and{" "}
          <DocsCode>style</DocsCode>).
        </p>
        <DocsPropTable
          props={[
            {
              name: "children",
              type: "ReactNode",
              description:
                "Child components (markers, popups, controls, routes).",
            },
            {
              name: "className",
              type: "string",
              description: "Additional CSS classes for the map container.",
            },
            {
              name: "theme",
              type: '"light" | "dark"',
              description:
                "Theme for the map. If not provided, automatically detects from document class or system preference.",
            },
            {
              name: "styles",
              type: "{ light?: string | StyleSpecification; dark?: string | StyleSpecification }",
              description:
                "Custom map styles for light and dark themes. Overrides the default Carto base map tiles.",
            },
            {
              name: "blank",
              type: "boolean",
              default: "false",
              description:
                "Use a transparent, tile-less basemap instead of the default Carto street basemap. This is a blank canvas — used alone it renders nothing, so you must add your own layers (e.g. MapGeoJSON, MapArc, markers) on top. Ideal for data visualizations (choropleths, arcs, dot maps). Ignored when an explicit styles prop is provided.",
            },
            {
              name: "projection",
              type: "ProjectionSpecification",
              description:
                'Map projection type. Use { type: "globe" } for 3D globe view.',
            },
            {
              name: "viewport",
              type: "Partial<MapViewport>",
              description:
                "Controlled viewport state. When used with onViewportChange, enables controlled mode. Can also be used alone for initial viewport.",
            },
            {
              name: "onViewportChange",
              type: "(viewport: MapViewport) => void",
              description:
                "Callback fired continuously as the viewport changes (during pan, zoom, rotate). Can be used alone to observe changes, or with viewport prop to enable controlled mode.",
            },
            {
              name: "loading",
              type: "boolean",
              default: "false",
              description: "Show a loading indicator on the map.",
            },
          ]}
        />
      </DocsSection>

      {/* useMap */}
      <DocsSection title="useMap">
        <p>
          A hook that provides access to the MapLibre map instance and loading
          state. Must be used within a <DocsCode>Map</DocsCode> component.
          Built-in layer components recreate on <DocsCode>styleEpoch</DocsCode>{" "}
          so theme style swaps stay correct without a separate readiness path.
        </p>
        <CodeBlock code={useMapCode} language="tsx" showCopyButton={false} />
        <p>
          Returns <DocsCode>map</DocsCode> (
          <DocsLink
            href="https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/"
            external
          >
            MapLibre.Map
          </DocsLink>
          ), <DocsCode>isLoaded</DocsCode> (boolean — map exists and the current
          style is safe to touch), <DocsCode>resolvedTheme</DocsCode>, and{" "}
          <DocsCode>styleEpoch</DocsCode> (number — increments once per ready
          style, including the initial load and each completed theme/style
          change).
        </p>
      </DocsSection>

      {/* MapControls */}
      <DocsSection title="MapControls">
        <p>
          Renders map control buttons (zoom, compass, locate, fullscreen). Must
          be used inside <DocsCode>Map</DocsCode>.
        </p>
        <DocsPropTable
          props={[
            {
              name: "position",
              type: '"top-left" | "top-right" | "bottom-left" | "bottom-right"',
              default: '"bottom-right"',
              description: "Position of the controls on the map.",
            },
            {
              name: "showZoom",
              type: "boolean",
              default: "true",
              description: "Show zoom in/out buttons.",
            },
            {
              name: "showCompass",
              type: "boolean",
              default: "false",
              description: "Show compass button to reset bearing.",
            },
            {
              name: "showLocate",
              type: "boolean",
              default: "false",
              description: "Show locate button to find user's location.",
            },
            {
              name: "showFullscreen",
              type: "boolean",
              default: "false",
              description: "Show fullscreen toggle button.",
            },
            {
              name: "className",
              type: "string",
              description: "Additional CSS classes for the controls container.",
            },
            {
              name: "onLocate",
              type: "(coords: { longitude: number; latitude: number }) => void",
              description: "Callback with user coordinates when located.",
            },
          ]}
        />
      </DocsSection>

      {/* MapMarker */}
      <DocsSection title="MapMarker">
        <p>
          A container for marker-related components. Provides context for its
          children and handles marker positioning.
        </p>
        <p>
          Extends{" "}
          <DocsLink
            href="https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/MarkerOptions/"
            external
          >
            MarkerOptions
          </DocsLink>{" "}
          from MapLibre GL (excluding <DocsCode>element</DocsCode>).
        </p>
        <DocsPropTable
          props={[
            {
              name: "longitude",
              type: "number",
              description: "Longitude coordinate for marker position.",
            },
            {
              name: "latitude",
              type: "number",
              description: "Latitude coordinate for marker position.",
            },
            {
              name: "children",
              type: "ReactNode",
              description:
                "Marker subcomponents (MarkerContent, MarkerPopup, etc).",
            },
            {
              name: "onClick",
              type: "(e: MouseEvent) => void",
              description: "Callback when marker is clicked.",
            },
            {
              name: "onMouseEnter",
              type: "(e: MouseEvent) => void",
              description: "Callback when mouse enters marker.",
            },
            {
              name: "onMouseLeave",
              type: "(e: MouseEvent) => void",
              description: "Callback when mouse leaves marker.",
            },
            {
              name: "onDragStart",
              type: "(lngLat: {lng, lat}) => void",
              description:
                "Callback when marker drag starts (requires draggable: true).",
            },
            {
              name: "onDrag",
              type: "(lngLat: {lng, lat}) => void",
              description:
                "Callback during marker drag (requires draggable: true).",
            },
            {
              name: "onDragEnd",
              type: "(lngLat: {lng, lat}) => void",
              description:
                "Callback when marker drag ends (requires draggable: true).",
            },
          ]}
        />
      </DocsSection>

      {/* MarkerContent */}
      <DocsSection title="MarkerContent">
        <p>
          Renders the visual content of a marker. Must be used inside{" "}
          <DocsCode>MapMarker</DocsCode>. If no children provided, renders a
          default blue dot marker.
        </p>
        <DocsPropTable
          props={[
            {
              name: "children",
              type: "ReactNode",
              description: "Custom marker content. Defaults to a blue dot.",
            },
            {
              name: "className",
              type: "string",
              description: "Additional CSS classes for the marker container.",
            },
          ]}
        />
      </DocsSection>

      {/* MarkerPopup */}
      <DocsSection title="MarkerPopup">
        <p>
          Renders a popup attached to the marker that opens on click. Must be
          used inside <DocsCode>MapMarker</DocsCode>.
        </p>
        <p>
          Extends{" "}
          <DocsLink
            href="https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/PopupOptions/"
            external
          >
            PopupOptions
          </DocsLink>{" "}
          from MapLibre GL (excluding <DocsCode>className</DocsCode> and{" "}
          <DocsCode>closeButton</DocsCode>).
        </p>
        <DocsNote>
          The <DocsCode>className</DocsCode> and{" "}
          <DocsCode>closeButton</DocsCode> from MapLibre&apos;s PopupOptions are
          excluded to prevent style conflicts. Use the component&apos;s own
          props to style the popup. MapLibre&apos;s default popup styles are
          reset via CSS.
        </DocsNote>
        <DocsPropTable
          props={[
            {
              name: "children",
              type: "ReactNode",
              description: "Popup content.",
            },
            {
              name: "className",
              type: "string",
              description: "Additional CSS classes for the popup container.",
            },
            {
              name: "closeButton",
              type: "boolean",
              default: "false",
              description: "Show a close button in the popup.",
            },
          ]}
        />
      </DocsSection>

      {/* MarkerTooltip */}
      <DocsSection title="MarkerTooltip">
        <p>
          Renders a tooltip that appears on hover. Must be used inside{" "}
          <DocsCode>MapMarker</DocsCode>.
        </p>
        <p>
          Extends{" "}
          <DocsLink
            href="https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/PopupOptions/"
            external
          >
            PopupOptions
          </DocsLink>{" "}
          from MapLibre GL (excluding <DocsCode>className</DocsCode>,{" "}
          <DocsCode>closeButton</DocsCode>, and{" "}
          <DocsCode>closeOnClick</DocsCode> as tooltips auto-dismiss on hover
          out).
        </p>
        <DocsNote>
          The <DocsCode>className</DocsCode> from MapLibre&apos;s PopupOptions
          is excluded to prevent style conflicts. Use the component&apos;s own{" "}
          <DocsCode>className</DocsCode> prop to style the tooltip content.
          MapLibre&apos;s default popup styles are reset via CSS.
        </DocsNote>
        <DocsPropTable
          props={[
            {
              name: "children",
              type: "ReactNode",
              description: "Tooltip content.",
            },
            {
              name: "className",
              type: "string",
              description: "Additional CSS classes for the tooltip container.",
            },
          ]}
        />
      </DocsSection>

      {/* MarkerLabel */}
      <DocsSection title="MarkerLabel">
        <p>
          Renders a text label above or below the marker. Must be used inside{" "}
          <DocsCode>MarkerContent</DocsCode>.
        </p>
        <DocsPropTable
          props={[
            {
              name: "children",
              type: "ReactNode",
              description: "Label text content.",
            },
            {
              name: "className",
              type: "string",
              description: "Additional CSS classes for the label.",
            },
            {
              name: "position",
              type: '"top" | "bottom"',
              default: '"top"',
              description: "Position of the label relative to the marker.",
            },
          ]}
        />
      </DocsSection>

      {/* MapPopup */}
      <DocsSection title="MapPopup">
        <p>
          A standalone popup component that can be placed anywhere on the map
          without a marker. Must be used inside <DocsCode>Map</DocsCode>.
        </p>
        <p>
          Extends{" "}
          <DocsLink
            href="https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/PopupOptions/"
            external
          >
            PopupOptions
          </DocsLink>{" "}
          from MapLibre GL (excluding <DocsCode>className</DocsCode> and{" "}
          <DocsCode>closeButton</DocsCode>).
        </p>
        <DocsNote>
          The <DocsCode>className</DocsCode> and{" "}
          <DocsCode>closeButton</DocsCode> from MapLibre&apos;s PopupOptions are
          excluded to prevent style conflicts. Use the component&apos;s own
          props to style the popup. MapLibre&apos;s default popup styles are
          reset via CSS.
        </DocsNote>
        <DocsPropTable
          props={[
            {
              name: "longitude",
              type: "number",
              description: "Longitude coordinate for popup position.",
            },
            {
              name: "latitude",
              type: "number",
              description: "Latitude coordinate for popup position.",
            },
            {
              name: "onClose",
              type: "() => void",
              description: "Callback when popup is closed.",
            },
            {
              name: "children",
              type: "ReactNode",
              description: "Popup content.",
            },
            {
              name: "className",
              type: "string",
              description: "Additional CSS classes for the popup container.",
            },
            {
              name: "closeButton",
              type: "boolean",
              default: "false",
              description: "Show a close button in the popup.",
            },
          ]}
        />
      </DocsSection>

      {/* MapRoute */}
      <DocsSection title="MapRoute">
        <p>
          Renders a line/route on the map connecting coordinate points. Must be
          used inside <DocsCode>Map</DocsCode>. Supports click and hover
          interactions for building route selection UIs.
        </p>
        <DocsPropTable
          props={[
            {
              name: "id",
              type: "string",
              default: "undefined (auto-generated)",
              description:
                "Optional unique identifier for the route layer. Auto-generated if not provided.",
            },
            {
              name: "coordinates",
              type: "[number, number][]",
              description: "Array of [longitude, latitude] coordinate pairs.",
            },
            {
              name: "color",
              type: "string",
              default: '"#4285F4"',
              description: "Line color (CSS color value).",
            },
            {
              name: "width",
              type: "number",
              default: "3",
              description: "Line width in pixels.",
            },
            {
              name: "opacity",
              type: "number",
              default: "0.8",
              description: "Line opacity (0 to 1).",
            },
            {
              name: "dashArray",
              type: "[number, number]",
              description:
                "Dash pattern [dash length, gap length] for dashed lines.",
            },
            {
              name: "onClick",
              type: "() => void",
              description: "Callback when the route line is clicked.",
            },
            {
              name: "onMouseEnter",
              type: "() => void",
              description: "Callback when mouse enters the route line.",
            },
            {
              name: "onMouseLeave",
              type: "() => void",
              description: "Callback when mouse leaves the route line.",
            },
            {
              name: "interactive",
              type: "boolean",
              default: "false",
              description:
                "Respond to mouse events (hover, cursor, callbacks).",
            },
          ]}
        />
      </DocsSection>

      {/* MapArc */}
      <DocsSection title="MapArc">
        <p>
          Renders curved lines between coordinate pairs using a quadratic Bézier
          in longitude/latitude space. Must be used inside{" "}
          <DocsCode>Map</DocsCode>. Supports click and hover interactions for
          building arc selection UIs.
        </p>
        <p>
          Built on a MapLibre{" "}
          <DocsLink
            href="https://maplibre.org/maplibre-style-spec/layers/#line"
            external
          >
            line layer
          </DocsLink>{" "}
          — the <DocsCode>paint</DocsCode> and <DocsCode>layout</DocsCode> props
          accept any field from <DocsCode>LineLayerSpecification</DocsCode>{" "}
          (e.g. <DocsCode>line-color</DocsCode>, <DocsCode>line-width</DocsCode>
          , <DocsCode>line-opacity</DocsCode>,{" "}
          <DocsCode>line-dasharray</DocsCode>, <DocsCode>line-blur</DocsCode>).
        </p>
        <p>
          Style per arc by passing a{" "}
          <DocsLink
            href="https://maplibre.org/maplibre-style-spec/expressions/"
            external
          >
            MapLibre expression
          </DocsLink>{" "}
          as any paint value. Reference fields on each datum with{" "}
          <DocsCode>{`["get", "fieldName"]`}</DocsCode>.
        </p>

        <DocsPropTable
          props={[
            {
              name: "data",
              type: "MapArcDatum[]",
              description:
                "Arcs to render. Each needs a unique id and from / to as [lng, lat]. Extra fields are forwarded to feature properties.",
            },
            {
              name: "id",
              type: "string",
              default: "auto",
              description: "Id prefix for the underlying source/layers.",
            },
            {
              name: "curvature",
              type: "number",
              default: "0.2",
              description:
                "How far the arc bows away from a straight line. 0 renders a straight line, higher values bend more, negative values bend to the opposite side.",
            },
            {
              name: "samples",
              type: "number",
              default: "64",
              description: "Points per arc. Higher = smoother.",
            },
            {
              name: "paint",
              type: "LineLayerSpecification['paint']",
              default:
                '{ "line-color": "#4285F4", "line-width": 2, "line-opacity": 0.85 }',
              description:
                "Paint props merged over defaults. Values may be MapLibre expressions for per-feature styling.",
            },
            {
              name: "layout",
              type: "LineLayerSpecification['layout']",
              default: '{ "line-join": "round", "line-cap": "round" }',
              description: "Layout props merged over defaults.",
            },
            {
              name: "hoverPaint",
              type: 'Pick<NonNullable<LineLayerSpecification["paint"]>, "line-opacity" | "line-color" | "line-width" | "line-gap-width" | "line-offset" | "line-blur">',
              description:
                "Feature-state-capable paint overrides for the hovered arc. line-gap-width, line-offset, and line-blur must also have a base value in paint.",
            },
            {
              name: "onClick",
              type: "(e: MapArcEvent) => void",
              description: "Fired when an arc is clicked.",
            },
            {
              name: "onHover",
              type: "(e: MapArcEvent | null) => void",
              description:
                "Fired when the hovered arc changes, with the cursor's lng/lat at entry. Receives null when the cursor leaves all arcs.",
            },
            {
              name: "interactive",
              type: "boolean",
              default: "true",
              description:
                "Respond to mouse events (hover, cursor, callbacks).",
            },
            {
              name: "beforeId",
              type: "string",
              description: "Insert the arc layers before this layer id.",
            },
          ]}
        />
      </DocsSection>

      {/* MapGeoJSON */}
      <DocsSection title="MapGeoJSON">
        <p>
          Renders arbitrary GeoJSON as fill + outline layers. Must be used
          inside <DocsCode>Map</DocsCode> — typically with the{" "}
          <DocsCode>blank</DocsCode> prop for choropleths and region/data maps.
          Accepts a <DocsCode>FeatureCollection</DocsCode>,{" "}
          <DocsCode>Feature</DocsCode>, <DocsCode>Geometry</DocsCode>, or a URL
          string to fetch from. Supports a generic type parameter for typed
          feature properties: <DocsCode>{"MapGeoJSON<MyProperties>"}</DocsCode>.
        </p>
        <p>
          Fill and outline default to a theme-aware monochrome surface tone, so
          shapes read clearly on light/dark out of the box. Override either
          layer via <DocsCode>fillPaint</DocsCode> /{" "}
          <DocsCode>linePaint</DocsCode> (pass <DocsCode>false</DocsCode> to
          omit a layer), and pass{" "}
          <DocsLink
            href="https://maplibre.org/maplibre-style-spec/expressions/"
            external
          >
            MapLibre expressions
          </DocsLink>{" "}
          as paint values for data-driven styling. Hover highlighting via{" "}
          <DocsCode>fillHoverPaint</DocsCode> requires{" "}
          <DocsCode>promoteId</DocsCode>. For hover-only properties without a
          built-in mapcn default, set the normal value in{" "}
          <DocsCode>fillPaint</DocsCode> as well.
        </p>
        <DocsPropTable
          props={[
            {
              name: "data",
              type: "FeatureCollection | Feature | Geometry | string",
              description:
                "GeoJSON data (FeatureCollection, Feature, or Geometry) or a URL string to fetch it from.",
            },
            {
              name: "id",
              type: "string",
              default: "auto",
              description: "Id prefix for the underlying source/layers.",
            },
            {
              name: "promoteId",
              type: "string",
              description:
                "Feature property to promote to the feature id. Required for hover feature-state (fillHoverPaint) and stable onHover / onClick payloads.",
            },
            {
              name: "fillPaint",
              type: "FillLayerSpecification['paint'] | false",
              description:
                "Paint for the polygon fill layer, merged over a theme-aware fill-color default. Pass false to omit the fill layer (e.g. outlines only).",
            },
            {
              name: "linePaint",
              type: "LineLayerSpecification['paint'] | false",
              description:
                "Paint for the outline layer, merged over a theme-aware hairline default. Pass false to omit the outline layer.",
            },
            {
              name: "fillHoverPaint",
              type: 'Pick<NonNullable<FillLayerSpecification["paint"]>, "fill-opacity" | "fill-color" | "fill-outline-color">',
              description:
                "Feature-state-capable fill overrides for the hovered feature. Requires promoteId; fill-outline-color must also have a base value in fillPaint.",
            },
            {
              name: "onClick",
              type: "(e: MapGeoJSONEvent) => void",
              description: "Fired when a feature is clicked.",
            },
            {
              name: "onHover",
              type: "(e: MapGeoJSONEvent | null) => void",
              description:
                "Fired when the hovered feature changes. Receives null when the cursor leaves all features.",
            },
            {
              name: "interactive",
              type: "boolean",
              default: "false",
              description:
                "Respond to mouse events (hover, cursor, callbacks).",
            },
            {
              name: "beforeId",
              type: "string",
              description: "Insert the layers before this layer id.",
            },
          ]}
        />
      </DocsSection>

      {/* MapClusterLayer */}
      <DocsSection title="MapClusterLayer">
        <p>
          Renders clustered point data using MapLibre GL&apos;s native
          clustering. Automatically groups nearby points into clusters that
          expand on click. Must be used inside <DocsCode>Map</DocsCode>.
          Supports a generic type parameter for typed feature properties:{" "}
          <DocsCode>{"MapClusterLayer<MyProperties>"}</DocsCode>.
        </p>
        <DocsPropTable
          props={[
            {
              name: "data",
              type: "string | GeoJSON.FeatureCollection",
              description:
                "GeoJSON FeatureCollection data or URL to fetch GeoJSON from.",
            },
            {
              name: "clusterMaxZoom",
              type: "number",
              default: "14",
              description: "Maximum zoom level to cluster points on.",
            },
            {
              name: "clusterRadius",
              type: "number",
              default: "50",
              description:
                "Radius of each cluster when clustering points (in pixels).",
            },
            {
              name: "clusterColors",
              type: "[string, string, string]",
              default: '["#3b82f6", "#1d4ed8", "#1e3a8a"]',
              description:
                "Colors for cluster circles: [small, medium, large] based on point count.",
            },
            {
              name: "clusterThresholds",
              type: "[number, number]",
              default: "[100, 750]",
              description:
                "Point count thresholds for color/size steps: [medium, large].",
            },
            {
              name: "pointColor",
              type: "string",
              default: '"#3b82f6"',
              description: "Color for unclustered individual points.",
            },
            {
              name: "onPointClick",
              type: "(feature: GeoJSON.Feature, coordinates: [number, number]) => void",
              description: "Callback when an unclustered point is clicked.",
            },
            {
              name: "onClusterClick",
              type: "(clusterId: number, coordinates: [number, number], pointCount: number) => void",
              description:
                "Callback when a cluster is clicked. If not provided, zooms into the cluster.",
            },
          ]}
        />
      </DocsSection>
    </DocsLayout>
  );
}
