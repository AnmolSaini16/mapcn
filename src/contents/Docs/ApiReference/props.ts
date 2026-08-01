export const mapProps = [
  {
    name: "children",
    type: "ReactNode",
    description: "Child components (markers, popups, controls, routes).",
  },
  {
    name: "className",
    type: "string",
    description: "Additional NativeWind classes for the map container.",
  },
  {
    name: "theme",
    type: '"light" | "dark"',
    description:
      "Theme for the map. If not provided, follows the device color scheme (useColorScheme).",
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
      "Use a transparent, tile-less basemap instead of the default Carto street basemap. This is a blank canvas - used alone it renders nothing, so you must add your own layers (e.g. MapGeoJSON, MapArc, markers) on top. Ideal for data visualizations (choropleths, arcs, dot maps). Ignored when an explicit styles prop is provided.",
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
];

export const mapControlsProps = [
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
    description:
      "Show fullscreen toggle button. Requires onFullscreenRequest - there is no browser Fullscreen API on native.",
  },
  {
    name: "className",
    type: "string",
    description: "Additional NativeWind classes for the controls container.",
  },
  {
    name: "onLocate",
    type: "(coords: { longitude: number; latitude: number }) => void",
    description: "Callback with user coordinates when located.",
  },
  {
    name: "onFullscreenRequest",
    type: "() => void",
    description:
      "Called when the fullscreen control is pressed. Wire this to your own full-screen UI (e.g. a modal or navigation).",
  },
];

export const mapMarkerProps = [
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
    description: "Marker subcomponents (MarkerContent, MarkerPopup, etc).",
  },
  {
    name: "onClick",
    type: "(e: PressEvent) => void",
    description:
      "Callback when the marker is pressed. If omitted, pressing toggles MarkerTooltip when present.",
  },
  {
    name: "draggable",
    type: "boolean",
    default: "false",
    description:
      "Enable dragging. Uses MapLibre ViewAnnotation. On iOS, long-press the marker to start dragging; a normal pan still moves the map.",
  },
  {
    name: "onDragStart",
    type: "(lngLat: { lng: number; lat: number }) => void",
    description: "Fired when a drag starts (requires draggable).",
  },
  {
    name: "onDrag",
    type: "(lngLat: { lng: number; lat: number }) => void",
    description: "Fired continuously while dragging (requires draggable).",
  },
  {
    name: "onDragEnd",
    type: "(lngLat: { lng: number; lat: number }) => void",
    description: "Fired when a drag ends (requires draggable).",
  },
  {
    name: "offset",
    type: "[number, number]",
    description:
      "Pixel offset for the marker. Adjusted automatically when top overlays (popups) are present.",
  },
];

export const markerContentProps = [
  {
    name: "children",
    type: "ReactNode",
    description: "Custom marker content. Defaults to a blue dot.",
  },
  {
    name: "className",
    type: "string",
    description: "Additional NativeWind classes for the marker container.",
  },
];

export const markerPopupProps = [
  {
    name: "children",
    type: "ReactNode",
    description: "Popup content.",
  },
  {
    name: "className",
    type: "string",
    description: "Additional NativeWind classes for the popup container.",
  },
  {
    name: "position",
    type: '"top" | "bottom"',
    default: '"top"',
    description: "Place the popup above or below the marker.",
  },
  {
    name: "closeButton",
    type: "boolean",
    default: "false",
    description: "Show a close button in the popup.",
  },
  {
    name: "closeOnClick",
    type: "boolean",
    default: "true",
    description: "Close the popup when the map is pressed outside the marker.",
  },
  {
    name: "onClose",
    type: "() => void",
    description: "Callback when the popup should close.",
  },
];

export const markerTooltipProps = [
  {
    name: "children",
    type: "ReactNode",
    description: "Tooltip content.",
  },
  {
    name: "className",
    type: "string",
    description: "Additional NativeWind classes for the tooltip container.",
  },
  {
    name: "position",
    type: '"top" | "bottom"',
    default: '"top"',
    description: "Place the tooltip above or below the marker.",
  },
];

export const markerLabelProps = [
  {
    name: "children",
    type: "ReactNode",
    description: "Label text content.",
  },
  {
    name: "className",
    type: "string",
    description: "Additional NativeWind classes for the label.",
  },
  {
    name: "position",
    type: '"top" | "bottom"',
    default: '"top"',
    description: "Position of the label relative to the marker.",
  },
];

export const mapPopupProps = [
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
    description: "Additional NativeWind classes for the popup container.",
  },
  {
    name: "position",
    type: '"top" | "bottom"',
    default: '"top"',
    description: "Place the popup above or below the anchor point.",
  },
  {
    name: "closeButton",
    type: "boolean",
    default: "false",
    description: "Show a close button in the popup.",
  },
  {
    name: "closeOnClick",
    type: "boolean",
    default: "true",
    description: "Close the popup when the map is pressed outside the popup.",
  },
];

export const mapRouteProps = [
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
    description: "Line color.",
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
    description: "Dash pattern [dash length, gap length] for dashed lines.",
  },
  {
    name: "linePaint",
    type: "LineLayerSpecification['paint']",
    description:
      "Extra paint props merged over color / width / opacity / dashArray.",
  },
  {
    name: "lineLayout",
    type: "LineLayerSpecification['layout']",
    description: "Layout props for the line layer.",
  },
  {
    name: "onClick",
    type: "() => void",
    description: "Callback when the route line is pressed.",
  },
  {
    name: "interactive",
    type: "boolean",
    default: "true",
    description: "Respond to press events on the route line.",
  },
  {
    name: "beforeId",
    type: "string",
    description: "Insert the route layer before this layer id.",
  },
];

export const mapArcProps = [
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
    name: "color",
    type: "string",
    description: "Shorthand for line-color when paint is not provided.",
  },
  {
    name: "width",
    type: "number",
    description: "Shorthand for line-width when paint is not provided.",
  },
  {
    name: "opacity",
    type: "number",
    description: "Shorthand for line-opacity when paint is not provided.",
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
    name: "selectedPaint",
    type: "LineLayerSpecification['paint']",
    description:
      "Paint overrides for the selected arc. Pair with selectedId from press selection.",
  },
  {
    name: "selectedId",
    type: "string | number | null",
    description: "Currently selected arc id used with selectedPaint.",
  },
  {
    name: "onClick",
    type: "(e: MapArcEvent) => void",
    description: "Fired when an arc is pressed.",
  },
  {
    name: "interactive",
    type: "boolean",
    default: "true",
    description: "Respond to press events on arcs.",
  },
  {
    name: "beforeId",
    type: "string",
    description: "Insert the arc layers before this layer id.",
  },
];

export const mapGeoJSONProps = [
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
    default: '"id"',
    description:
      "Feature property used to match selectedId for press-driven selection styling.",
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
    name: "selectedPaint",
    type: "FillLayerSpecification['paint']",
    description:
      "Paint merged onto the selected feature. Requires promoteId and selectedId. Use with press selection instead of web hover paint.",
  },
  {
    name: "selectedId",
    type: "string | number | null",
    description: "Currently selected feature id from press interaction.",
  },
  {
    name: "onClick",
    type: "(e: MapGeoJSONEvent) => void",
    description: "Fired when a feature is pressed.",
  },
  {
    name: "interactive",
    type: "boolean",
    default: "false",
    description: "Respond to press events on features.",
  },
  {
    name: "beforeId",
    type: "string",
    description: "Insert the layers before this layer id.",
  },
];

export const mapClusterLayerProps = [
  {
    name: "data",
    type: "string | GeoJSON.FeatureCollection",
    description:
      "GeoJSON FeatureCollection of Point features, or a URL to fetch GeoJSON from.",
  },
  {
    name: "id",
    type: "string",
    default: "auto",
    description: "Id prefix for the underlying source/layers.",
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
    description: "Radius of each cluster when clustering points (in pixels).",
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
    description: "Callback when an unclustered point is pressed.",
  },
  {
    name: "onClusterClick",
    type: "(clusterId: number, coordinates: [number, number], pointCount: number) => void",
    description:
      "Callback when a cluster is pressed. If not provided, zooms into the cluster.",
  },
];
