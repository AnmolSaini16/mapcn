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
  <MapClusterLayer data={...} />
  <MapGeoJSON data={...} />
</Map>`;

const useMapCode = `const { map, isLoaded } = useMap();`;

export default function ApiReferencePage() {
  return (
    <DocsLayout
      title="API Reference"
      description="Complete reference for all map components and their props."
      prev={{ title: "Installation", href: "/docs/installation" }}
      next={{ title: "Basic Map", href: "/docs/basic-map" }}
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
              name: "styles",
              type: "{ light?: string | StyleSpecification; dark?: string | StyleSpecification }",
              description:
                "Custom map styles for light and dark themes. Overrides the default Carto base map tiles.",
            },
          ]}
        />
      </DocsSection>

      {/* useMap */}
      <DocsSection title="useMap">
        <p>
          A hook that provides access to the MapLibre map instance and loading
          state. Must be used within a <DocsCode>Map</DocsCode> component.
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
          ) and <DocsCode>isLoaded</DocsCode> (boolean) tells you if the map is
          loaded and ready to use.
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
              default: "true",
              description:
                "Whether the route is interactive (shows pointer cursor on hover).",
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
              default: '["#51bbd6", "#f1f075", "#f28cb1"]',
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

      {/* MapGeoJSON */}
      <DocsSection title="MapGeoJSON">
        <p>
          Parses and displays GeoJSON data (as a string or parsed object) on the
          map. Automatically detects geometry types and applies appropriate
          styling. Supports all GeoJSON geometry types: Point, LineString,
          Polygon, and their Multi- variants. Must be used inside{" "}
          <DocsCode>Map</DocsCode>.
        </p>
        <DocsPropTable
          props={[
            {
              name: "data",
              type: "string | GeoJSON.GeoJSON",
              description:
                "GeoJSON data as a string or parsed object. Supports Feature, FeatureCollection, and all geometry types.",
            },
            {
              name: "id",
              type: "string",
              description:
                "Optional unique identifier for the GeoJSON layer. Useful when using multiple GeoJSON layers.",
            },
            {
              name: "pointStyle",
              type: "{ color?: string; radius?: number; opacity?: number }",
              default: '{ color: "#3b82f6", radius: 6, opacity: 1 }',
              description: "Styling options for point geometries.",
            },
            {
              name: "lineStyle",
              type: "{ color?: string; width?: number; opacity?: number; dashArray?: [number, number] }",
              default: '{ color: "#4285F4", width: 3, opacity: 0.8 }',
              description: "Styling options for line geometries.",
            },
            {
              name: "polygonStyle",
              type: "{ fillColor?: string; fillOpacity?: number; outlineColor?: string; outlineWidth?: number; outlineOpacity?: number }",
              default: '{ fillColor: "#4285F4", fillOpacity: 0.3, outlineColor: "#4285F4", outlineWidth: 2, outlineOpacity: 1 }',
              description: "Styling options for polygon geometries.",
            },
            {
              name: "onClick",
              type: "(feature: GeoJSON.Feature, coordinates: [number, number]) => void",
              description: "Callback when a feature is clicked.",
            },
            {
              name: "onMouseEnter",
              type: "(feature: GeoJSON.Feature) => void",
              description: "Callback when mouse enters a feature.",
            },
            {
              name: "onMouseLeave",
              type: "() => void",
              description: "Callback when mouse leaves a feature.",
            },
            {
              name: "interactive",
              type: "boolean",
              default: "true",
              description:
                "Whether the GeoJSON is interactive - shows pointer cursor on hover.",
            },
          ]}
        />
      </DocsSection>
    </DocsLayout>
  );
}
