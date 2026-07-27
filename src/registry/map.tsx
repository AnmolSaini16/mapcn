import {
  Camera,
  GeoJSONSource,
  Layer,
  Map as MapLibreMap,
  Marker,
  type CameraRef,
  type FillLayerSpecification,
  type LineLayerSpecification,
  type MapRef as NativeMapRef,
  type StyleSpecification,
} from "@maplibre/maplibre-react-native";
import type * as GeoJSON from "geojson";
import { Locate, Minus, Plus } from "lucide-react-native";
import type * as React from "react";
import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  useColorScheme,
  View,
} from "react-native";

import { cn } from "@/lib/utils";

const styles = {
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
};

const blankMapStyle: StyleSpecification = {
  version: 8,
  sources: {},
  layers: [
    {
      id: "background",
      type: "background",
      paint: { "background-color": "rgba(0, 0, 0, 0)" },
    },
  ],
};

type Theme = "light" | "dark";
type MapRef = NativeMapRef;
type MapViewport = {
  center: [number, number];
  zoom: number;
  bearing: number;
  pitch: number;
};
type MapStyleOption = string | StyleSpecification;

type MapContextValue = {
  camera: CameraRef | null;
  map: MapRef | null;
  isLoaded: boolean;
  resolvedTheme: Theme;
  viewport: MapViewport;
};

const MapContext = createContext<MapContextValue | null>(null);

function useMap() {
  const context = useContext(MapContext);
  if (!context) throw new Error("useMap must be used within a Map component");
  return context;
}

type MapProps = Omit<
  React.ComponentProps<typeof MapLibreMap>,
  "children" | "mapStyle" | "onRegionIsChanging" | "onDidFinishLoadingMap"
> & {
  children?: ReactNode;
  theme?: Theme;
  styles?: Partial<Record<Theme, MapStyleOption>>;
  blank?: boolean;
  viewport?: Partial<MapViewport>;
  onViewportChange?: (viewport: MapViewport) => void;
  loading?: boolean;
};

const Map = forwardRef<MapRef, MapProps>(function Map(
  {
    children,
    theme,
    styles: customStyles,
    blank,
    viewport,
    onViewportChange,
    loading,
    style,
    ...props
  },
  ref,
) {
  const systemTheme = useColorScheme() === "dark" ? "dark" : "light";
  const resolvedTheme = theme ?? systemTheme;
  const nativeMapRef = useRef<MapRef>(null);
  const cameraRef = useRef<CameraRef>(null);
  const [map, setMap] = useState<MapRef | null>(null);
  const [camera, setCamera] = useState<CameraRef | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentViewport, setCurrentViewport] = useState<MapViewport>({
    center: [0, 0],
    zoom: 1,
    bearing: 0,
    pitch: 0,
  });

  useImperativeHandle(ref, () => {
    if (!nativeMapRef.current)
      throw new Error("Map ref is not available before mount");
    return nativeMapRef.current;
  });

  const mapStyle =
    customStyles?.[resolvedTheme] ??
    (blank ? blankMapStyle : styles[resolvedTheme]);
  const cameraState = {
    center: viewport?.center ?? currentViewport.center,
    zoom: viewport?.zoom ?? currentViewport.zoom,
    bearing: viewport?.bearing ?? currentViewport.bearing,
    pitch: viewport?.pitch ?? currentViewport.pitch,
  };

  const contextValue = useMemo(
    () => ({ camera, map, isLoaded, resolvedTheme, viewport: currentViewport }),
    [camera, currentViewport, isLoaded, map, resolvedTheme],
  );

  return (
    <MapContext.Provider value={contextValue}>
      <View className="relative flex-1">
        <MapLibreMap
          {...props}
          ref={(instance) => {
            nativeMapRef.current = instance;
            setMap(instance);
          }}
          mapStyle={mapStyle}
          onDidFinishLoadingMap={() => {
            setIsLoaded(true);
          }}
          onRegionIsChanging={(event) => {
            const nextViewport: MapViewport = {
              center: event.nativeEvent.center,
              zoom: event.nativeEvent.zoom,
              bearing: event.nativeEvent.bearing,
              pitch: event.nativeEvent.pitch,
            };
            setCurrentViewport(nextViewport);
            onViewportChange?.(nextViewport);
          }}
          style={[{ flex: 1 }, style]}
        >
          <Camera
            ref={(instance) => {
              cameraRef.current = instance;
              setCamera(instance);
            }}
            {...cameraState}
          />
          {children}
        </MapLibreMap>
        {loading ? <MapLoader /> : null}
      </View>
    </MapContext.Provider>
  );
});

function MapLoader() {
  return (
    <View className="bg-background/50 absolute inset-0 items-center justify-center">
      <ActivityIndicator />
    </View>
  );
}

type MapMarkerProps = Omit<
  React.ComponentProps<typeof Marker>,
  "children" | "lngLat" | "onPress"
> & {
  longitude: number;
  latitude: number;
  children: ReactNode;
  onClick?: React.ComponentProps<typeof Marker>["onPress"];
};

function MapMarker({
  longitude,
  latitude,
  children,
  onClick,
  ...props
}: MapMarkerProps) {
  const content = getMarkerContent(children);

  if (!content) return null;

  return (
    <Marker
      {...props}
      lngLat={[longitude, latitude]}
      onPress={onClick}
    >
      {content}
    </Marker>
  );
}

function getMarkerContent(children: ReactNode) {
  for (const child of Children.toArray(children)) {
    if (isValidElement(child) && child.type === MarkerContent) {
      return child;
    }
  }

  return null;
}

type MarkerContentProps = React.ComponentProps<typeof View>;

function MarkerContent({ className, ...props }: MarkerContentProps) {
  return (
    <View
      {...props}
      className={cn("items-center justify-center", className)}
    />
  );
}

function DefaultMarkerIcon() {
  return (
    <View className="size-4 rounded-full border-2 border-white bg-blue-500" />
  );
}

type MarkerLabelProps = React.ComponentProps<typeof Text> & {
  position?: "top" | "bottom" | "left" | "right";
};

function MarkerLabel({ className, ...props }: MarkerLabelProps) {
  return (
    <Text
      {...props}
      className={cn(
        "bg-background text-foreground rounded px-1.5 py-0.5 text-xs font-medium",
        className,
      )}
    />
  );
}

type MarkerPopupProps = React.ComponentProps<typeof View>;

function MarkerPopup({ className, ...props }: MarkerPopupProps) {
  return (
    <View
      {...props}
      className={cn(
        "bg-popover border-border rounded-md border p-3",
        className,
      )}
    />
  );
}

function MarkerTooltip({ className, ...props }: MarkerPopupProps) {
  return (
    <View
      {...props}
      className={cn(
        "bg-popover border-border rounded-md border px-2 py-1",
        className,
      )}
    />
  );
}

type MapPopupProps = MarkerPopupProps & { longitude: number; latitude: number };

function MapPopup({ longitude, latitude, className, ...props }: MapPopupProps) {
  return (
    <MapMarker
      latitude={latitude}
      longitude={longitude}
    >
      <MarkerContent
        className={className}
        {...props}
      />
    </MapMarker>
  );
}

type MapControlsProps = {
  className?: string;
  showZoom?: boolean;
  showCompass?: boolean;
  showLocate?: boolean;
  showFullscreen?: boolean;
};

function MapControls({
  className,
  showZoom = true,
  showCompass = true,
  showLocate = false,
}: MapControlsProps) {
  const { camera, viewport } = useMap();
  const zoomIn = useCallback(
    () => camera?.zoomTo(viewport.zoom + 1, { duration: 200 }),
    [camera, viewport.zoom],
  );
  const zoomOut = useCallback(
    () => camera?.zoomTo(viewport.zoom - 1, { duration: 200 }),
    [camera, viewport.zoom],
  );
  const resetNorth = useCallback(
    () =>
      camera?.easeTo({
        center: viewport.center,
        zoom: viewport.zoom,
        bearing: 0,
        pitch: 0,
        duration: 200,
      }),
    [camera, viewport],
  );

  return (
    <View
      className={cn(
        "bg-background border-border absolute bottom-3 right-3 overflow-hidden rounded-md border",
        className,
      )}
    >
      {showZoom ? (
        <ControlButton
          label="Zoom in"
          onPress={zoomIn}
        >
          <Plus size={16} />
        </ControlButton>
      ) : null}
      {showZoom ? (
        <ControlButton
          label="Zoom out"
          onPress={zoomOut}
        >
          <Minus size={16} />
        </ControlButton>
      ) : null}
      {showCompass ? (
        <ControlButton
          label="Reset bearing"
          onPress={resetNorth}
        >
          <Text className="text-foreground">N</Text>
        </ControlButton>
      ) : null}
      {showLocate ? (
        <ControlButton
          label="Location unavailable"
          onPress={() => undefined}
        >
          <Locate size={16} />
        </ControlButton>
      ) : null}
    </View>
  );
}

function ControlButton({
  children,
  label,
  onPress,
}: {
  children: ReactNode;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityLabel={label}
      className="border-border items-center border-b p-2.5 last:border-b-0"
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
}

type MapRouteProps = {
  coordinates: [number, number][];
  color?: string;
  width?: number;
  opacity?: number;
  linePaint?: LineLayerSpecification["paint"];
  lineLayout?: LineLayerSpecification["layout"];
};

function MapRoute({
  coordinates,
  color = "#3b82f6",
  width = 4,
  opacity = 1,
  linePaint,
  lineLayout,
}: MapRouteProps) {
  const id = useId();
  const data = useMemo<GeoJSON.Feature<GeoJSON.LineString>>(
    () => ({
      type: "Feature",
      properties: {},
      geometry: { type: "LineString", coordinates },
    }),
    [coordinates],
  );

  return (
    <GeoJSONSource
      data={data}
      id={`route-${id}`}
    >
      <Layer
        id={`route-line-${id}`}
        layout={lineLayout}
        paint={{
          "line-color": color,
          "line-width": width,
          "line-opacity": opacity,
          ...linePaint,
        }}
        type="line"
      />
    </GeoJSONSource>
  );
}

type MapGeoJSONFeature<
  P extends GeoJSON.GeoJsonProperties = GeoJSON.GeoJsonProperties,
> = GeoJSON.Feature<GeoJSON.Geometry, P>;
type MapGeoJSONEvent<
  P extends GeoJSON.GeoJsonProperties = GeoJSON.GeoJsonProperties,
> = { feature: MapGeoJSONFeature<P> };
type MapGeoJSONProps<
  P extends GeoJSON.GeoJsonProperties = GeoJSON.GeoJsonProperties,
> = {
  data: GeoJSON.FeatureCollection<GeoJSON.Geometry, P> | MapGeoJSONFeature<P>;
  fillPaint?: FillLayerSpecification["paint"] | false;
  linePaint?: LineLayerSpecification["paint"] | false;
  onClick?: (event: MapGeoJSONEvent<P>) => void;
};

function MapGeoJSON<
  P extends GeoJSON.GeoJsonProperties = GeoJSON.GeoJsonProperties,
>({
  data,
  fillPaint = { "fill-color": "#3b82f6", "fill-opacity": 0.35 },
  linePaint = { "line-color": "#2563eb", "line-width": 1 },
}: MapGeoJSONProps<P>) {
  const id = useId();
  return (
    <GeoJSONSource
      data={data}
      id={`geojson-${id}`}
    >
      {fillPaint ? (
        <Layer
          id={`geojson-fill-${id}`}
          paint={fillPaint}
          type="fill"
        />
      ) : null}
      {linePaint ? (
        <Layer
          id={`geojson-line-${id}`}
          paint={linePaint}
          type="line"
        />
      ) : null}
    </GeoJSONSource>
  );
}

type MapArcDatum = {
  from: [number, number];
  to: [number, number];
  id?: string;
};
type MapArcEvent<T extends MapArcDatum = MapArcDatum> = { datum: T };
type MapArcProps<T extends MapArcDatum = MapArcDatum> = {
  data: T[];
  color?: string;
  width?: number;
  opacity?: number;
  curvature?: number;
  samples?: number;
  paint?: LineLayerSpecification["paint"];
  layout?: LineLayerSpecification["layout"];
};

function MapArc<T extends MapArcDatum = MapArcDatum>({
  data,
  color = "#3b82f6",
  width = 2,
  opacity = 0.8,
  curvature = 0.2,
  samples = 64,
  paint,
  layout,
}: MapArcProps<T>) {
  const id = useId();
  const geojson = useMemo<GeoJSON.FeatureCollection<GeoJSON.LineString>>(
    () => ({
      type: "FeatureCollection",
      features: data.map((arc) => ({
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: buildArcCoordinates(
            arc.from,
            arc.to,
            curvature,
            samples,
          ),
        },
      })),
    }),
    [curvature, data, samples],
  );
  return (
    <GeoJSONSource
      data={geojson}
      id={`arc-${id}`}
    >
      <Layer
        id={`arc-line-${id}`}
        layout={layout}
        paint={{
          "line-color": color,
          "line-width": width,
          "line-opacity": opacity,
          ...paint,
        }}
        type="line"
      />
    </GeoJSONSource>
  );
}

function buildArcCoordinates(
  from: [number, number],
  to: [number, number],
  curvature: number,
  samples: number,
) {
  const count = Math.max(samples, 2);
  const [fromLongitude, fromLatitude] = from;
  const [toLongitude, toLatitude] = to;
  const midpointLongitude = (fromLongitude + toLongitude) / 2;
  const midpointLatitude = (fromLatitude + toLatitude) / 2;
  const distance = Math.hypot(
    toLongitude - fromLongitude,
    toLatitude - fromLatitude,
  );
  const controlLongitude =
    midpointLongitude - (toLatitude - fromLatitude) * curvature;
  const controlLatitude =
    midpointLatitude + (toLongitude - fromLongitude) * curvature;

  return Array.from({ length: count }, (_, index) => {
    const progress = index / (count - 1);
    const inverse = 1 - progress;
    return [
      inverse ** 2 * fromLongitude +
        2 * inverse * progress * controlLongitude +
        progress ** 2 * toLongitude,
      inverse ** 2 * fromLatitude +
        2 * inverse * progress * controlLatitude +
        progress ** 2 * toLatitude,
    ];
  });
}

type MapClusterLayerProps<
  P extends GeoJSON.GeoJsonProperties = GeoJSON.GeoJsonProperties,
> = {
  data: GeoJSON.FeatureCollection<GeoJSON.Point, P>;
  clusterRadius?: number;
  clusterMaxZoom?: number;
};

function MapClusterLayer<
  P extends GeoJSON.GeoJsonProperties = GeoJSON.GeoJsonProperties,
>({ data, clusterRadius = 50, clusterMaxZoom = 14 }: MapClusterLayerProps<P>) {
  const id = useId();
  return (
    <GeoJSONSource
      cluster
      clusterMaxZoom={clusterMaxZoom}
      clusterRadius={clusterRadius}
      data={data}
      id={`clusters-${id}`}
    >
      <Layer
        filter={["has", "point_count"]}
        id={`clusters-circle-${id}`}
        paint={{ "circle-color": "#2563eb", "circle-radius": 18 }}
        type="circle"
      />
      <Layer
        filter={["!", ["has", "point_count"]]}
        id={`clusters-point-${id}`}
        paint={{ "circle-color": "#3b82f6", "circle-radius": 6 }}
        type="circle"
      />
    </GeoJSONSource>
  );
}

export {
  DefaultMarkerIcon,
  Map,
  MapArc,
  MapClusterLayer,
  MapControls,
  MapGeoJSON,
  MapMarker,
  MapPopup,
  MapRoute,
  MarkerContent,
  MarkerLabel,
  MarkerPopup,
  MarkerTooltip,
  useMap,
};
export type {
  MapArcDatum,
  MapArcEvent,
  MapArcProps,
  MapClusterLayerProps,
  MapControlsProps,
  MapGeoJSONEvent,
  MapGeoJSONFeature,
  MapGeoJSONProps,
  MapMarkerProps,
  MapPopupProps,
  MapProps,
  MapRef,
  MapRouteProps,
  MapStyleOption,
  MapViewport,
  MarkerContentProps,
  MarkerLabelProps,
  MarkerPopupProps,
};
