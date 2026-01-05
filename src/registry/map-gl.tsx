"use client";

import "maplibre-gl/dist/maplibre-gl.css";

import { useTheme } from "next-themes";

import { Loader2, Locate, Maximize, Minus, Plus, X } from "lucide-react";
import React, {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import type {
  GeoJSONSource,
  LngLat,
  MapGeoJSONFeature,
  MapLibreEvent,
  MapMouseEvent,
  MapStyleDataEvent,
  Marker,
  Popup,
} from "maplibre-gl";
import type { MapRef } from "react-map-gl/maplibre";
import {
  Layer as MapLibreGLLayer,
  Map as MapLibreGLMap,
  Marker as MapLibreGLMarker,
  Popup as MapLibreGLPopup,
  Source as MapLibreGLSource,
} from "react-map-gl/maplibre";

import { cn } from "@/lib/utils";

type MapContextValue = {
  mapRef: React.RefObject<MapRef | null>;
  isLoaded: boolean;
};

const MapContext = createContext<MapContextValue | null>(null);

function useMap() {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMap must be used within a Map component");
  }
  return context;
}

const defaultStyles = {
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
};

const DefaultLoader = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="flex gap-1">
      <span className="size-1.5 animate-pulse rounded-full bg-muted-foreground/60" />
      <span className="size-1.5 animate-pulse rounded-full bg-muted-foreground/60 [animation-delay:150ms]" />
      <span className="size-1.5 animate-pulse rounded-full bg-muted-foreground/60 [animation-delay:300ms]" />
    </div>
  </div>
);

function Map({
  children,
  mapStyle,
  renderWorldCopies = false,
  attributionControl = {
    compact: true,
  },
  onLoad,
  onStyleData,
  ...props
}: React.ComponentProps<typeof MapLibreGLMap>) {
  const { resolvedTheme } = useTheme();

  const mapRef = useRef<MapRef | null>(null);

  const isClient = typeof window !== "undefined";
  const [isLoaded, setIsLoaded] = useState(false);
  const [isStyleLoaded, setIsStyleLoaded] = useState(false);

  const isLoading = !isClient || !isLoaded || !isStyleLoaded;

  const handleLoad = (e: MapLibreEvent) => {
    setIsLoaded(true);
    onLoad?.(e);
  };

  const handleStyleData = (e: MapStyleDataEvent) => {
    setIsStyleLoaded(true);
    onStyleData?.(e);
  };

  return (
    <MapContext.Provider
      value={{
        mapRef,
        isLoaded: isClient && isLoaded && isStyleLoaded,
      }}
    >
      <MapLibreGLMap
        data-slot="map"
        ref={mapRef}
        mapStyle={
          mapStyle ??
          (resolvedTheme === "dark" ? defaultStyles.dark : defaultStyles.light)
        }
        renderWorldCopies={renderWorldCopies}
        attributionControl={attributionControl}
        onLoad={handleLoad}
        onStyleData={handleStyleData}
        {...props}
      >
        {isLoading && <DefaultLoader />}
        {/* SSR-safe: children render only when map is loaded on client */}
        {isClient && children}
      </MapLibreGLMap>
    </MapContext.Provider>
  );
}

type MarkerContextValue = {
  markerRef: React.RefObject<Marker | null>;
};

const MarkerContext = createContext<MarkerContextValue | null>(null);

function useMarkerContext() {
  const context = useContext(MarkerContext);
  if (!context) {
    throw new Error("Marker components must be used within MapMarker");
  }
  return context;
}

function MapMarker({
  // Default to empty fragment, matches mapcn behavior.
  children = <></>,
  ...props
}: React.ComponentProps<typeof MapLibreGLMarker>) {
  const markerRef = useRef<Marker>(null);

  return (
    <MarkerContext.Provider value={{ markerRef }}>
      <MapLibreGLMarker data-slot="map-marker" ref={markerRef} {...props}>
        {children}
      </MapLibreGLMarker>
    </MarkerContext.Provider>
  );
}

function MarkerContent({
  children = <DefaultMarkerIcon />,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="marker-content"
      className={cn("relative cursor-pointer", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function DefaultMarkerIcon() {
  return (
    <div className="relative size-4 rounded-full border-2 border-white bg-blue-500 shadow-lg" />
  );
}

interface MarkerLabelProps extends React.ComponentProps<"div"> {
  position?: "top" | "bottom";
}

function MarkerPopup({
  offset = 16,
  maxWidth = "none",
  closeButton = false,
  className,
  children,
  ...props
}: Omit<
  React.ComponentProps<typeof MapLibreGLPopup>,
  "latitude" | "longitude"
>) {
  const { markerRef } = useMarkerContext();

  const [lngLat, setLngLat] = useState<LngLat | null>(null);

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) {
      return;
    }

    const markerElement = marker.getElement();

    const handleClick = (e: MouseEvent) => {
      // If we let the click event propagates to the map, it will immediately close the popup
      // with `closeOnClick: true`
      e.stopPropagation();
      setLngLat(marker.getLngLat());
    };

    markerElement.addEventListener("click", handleClick);

    return () => {
      markerElement.removeEventListener("click", handleClick);
    };
  }, [markerRef]);

  const handleClose = () => setLngLat(null);

  if (!lngLat) {
    return null;
  }

  return (
    <MapLibreGLPopup
      data-slot="marker-popup"
      latitude={lngLat.lat}
      longitude={lngLat.lng}
      offset={offset}
      maxWidth={maxWidth}
      // We are replacing the close button with our own.
      closeButton={false}
      {...props}
    >
      <div
        className={cn(
          "relative animate-in rounded-md border bg-popover p-3 text-popover-foreground shadow-md fade-in-0 zoom-in-95",
          className
        )}
      >
        {closeButton && (
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-1 right-1 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none"
            aria-label="Close popup"
          >
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </button>
        )}
        {children}
      </div>
    </MapLibreGLPopup>
  );
}

function MarkerTooltip({
  offset = 16,
  maxWidth = "none",
  closeOnClick = true,
  closeButton = false,
  className,
  children,
  ...props
}: Omit<
  React.ComponentProps<typeof MapLibreGLPopup>,
  "latitude" | "longitude"
>) {
  const { markerRef } = useMarkerContext();

  const [lngLat, setLngLat] = useState<LngLat | null>(null);

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) {
      return;
    }

    const markerElement = marker.getElement();

    const handleMouseEnter = () => setLngLat(marker.getLngLat());
    const handleMouseLeave = () => setLngLat(null);

    markerElement.addEventListener("mouseenter", handleMouseEnter);
    markerElement.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      markerElement.removeEventListener("mouseenter", handleMouseEnter);
      markerElement.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [markerRef]);

  if (!lngLat) {
    return null;
  }

  return (
    <MapLibreGLPopup
      data-slot="marker-tooltip"
      latitude={lngLat.lat}
      longitude={lngLat.lng}
      offset={offset}
      maxWidth={maxWidth}
      closeOnClick={closeOnClick}
      closeButton={closeButton}
      {...props}
    >
      <div
        className={cn(
          "animate-in rounded-md bg-foreground px-2 py-1 text-xs text-background shadow-md fade-in-0 zoom-in-95",
          className
        )}
      >
        {children}
      </div>
    </MapLibreGLPopup>
  );
}

function MarkerLabel({
  className,
  position = "top",
  ...props
}: MarkerLabelProps) {
  const positionClasses = {
    top: "bottom-full mb-1",
    bottom: "top-full mt-1",
  };

  return (
    <div
      className={cn(
        "absolute left-1/2 -translate-x-1/2 whitespace-nowrap",
        "text-[10px] font-medium text-foreground",
        positionClasses[position],
        className
      )}
      {...props}
    />
  );
}

function ControlGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="control-group"
      className={cn(
        "flex flex-col overflow-hidden rounded-md border border-border bg-background shadow-sm [&>button:not(:last-child)]:border-b [&>button:not(:last-child)]:border-border",
        className
      )}
      {...props}
    />
  );
}

interface ControlButtonProps extends React.ComponentProps<"button"> {
  label: string;
}

function ControlButton({
  label,
  type = "button",
  className,
  ...props
}: ControlButtonProps) {
  return (
    <button
      data-slot="control-button"
      aria-label={label}
      type={type}
      className={cn(
        "flex size-8 items-center justify-center transition-colors hover:bg-accent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-accent/40",
        className
      )}
      {...props}
    />
  );
}

interface MapControlsProps extends React.ComponentProps<"div"> {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  showZoom?: boolean;
  showCompass?: boolean;
  showLocate?: boolean;
  showFullscreen?: boolean;
  onLocate?: (coords: { longitude: number; latitude: number }) => void;
}

function MapControls({
  position = "bottom-right",
  showZoom = true,
  showCompass = false,
  showLocate = false,
  showFullscreen = false,
  className,
  onLocate,
  ...props
}: MapControlsProps) {
  const { mapRef } = useMap();
  const [waitingForLocation, setWaitingForLocation] = useState(false);

  const positionClasses = {
    "top-left": "top-2 left-2",
    "top-right": "top-2 right-2",
    "bottom-left": "bottom-2 left-2",
    "bottom-right": "bottom-10 right-2",
  };

  const handleZoomIn = () => {
    const map = mapRef.current;
    map?.zoomTo(map.getZoom() + 1, { duration: 300 });
  };

  const handleZoomOut = () => {
    const map = mapRef.current;
    map?.zoomTo(map.getZoom() - 1, { duration: 300 });
  };

  const handleResetBearing = () => {
    const map = mapRef.current;
    map?.resetNorthPitch({ duration: 300 });
  };

  const handleLocate = () => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    setWaitingForLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            longitude: pos.coords.longitude,
            latitude: pos.coords.latitude,
          };
          map.flyTo({
            center: [coords.longitude, coords.latitude],
            zoom: 14,
            duration: 1500,
          });
          onLocate?.(coords);
          setWaitingForLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setWaitingForLocation(false);
        }
      );
    }
  };

  const handleFullscreen = () => {
    const map = mapRef.current;

    const container = map?.getContainer();
    if (!container) {
      return;
    }

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      container.requestFullscreen();
    }
  };

  return (
    <div
      data-slot="map-controls"
      className={cn(
        "absolute z-10 flex flex-col gap-1.5",
        positionClasses[position],
        className
      )}
      {...props}
    >
      {showZoom && (
        <ControlGroup>
          <ControlButton onClick={handleZoomIn} label="Zoom in">
            <Plus className="size-4" />
          </ControlButton>
          <ControlButton onClick={handleZoomOut} label="Zoom out">
            <Minus className="size-4" />
          </ControlButton>
        </ControlGroup>
      )}
      {showCompass && (
        <ControlGroup>
          <CompassButton onClick={handleResetBearing} />
        </ControlGroup>
      )}
      {showLocate && (
        <ControlGroup>
          <ControlButton
            onClick={handleLocate}
            label="Find my location"
            disabled={waitingForLocation}
          >
            {waitingForLocation ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Locate className="size-4" />
            )}
          </ControlButton>
        </ControlGroup>
      )}
      {showFullscreen && (
        <ControlGroup>
          <ControlButton onClick={handleFullscreen} label="Toggle fullscreen">
            <Maximize className="size-4" />
          </ControlButton>
        </ControlGroup>
      )}
    </div>
  );
}

function CompassButton({ onClick }: { onClick: () => void }) {
  const { mapRef } = useMap();

  const compassRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    const compass = compassRef.current;
    if (!compass) {
      return;
    }

    const updateRotation = () => {
      const bearing = map.getBearing();
      const pitch = map.getPitch();
      compass.style.transform = `rotateX(${pitch}deg) rotateZ(${-bearing}deg)`;
    };

    map.on("rotate", updateRotation);
    map.on("pitch", updateRotation);

    updateRotation();

    return () => {
      map.off("rotate", updateRotation);
      map.off("pitch", updateRotation);
    };
  }, []);

  return (
    <ControlButton onClick={onClick} label="Reset bearing to north">
      <svg
        ref={compassRef}
        viewBox="0 0 24 24"
        className="size-5 transition-transform duration-200"
        style={{ transformStyle: "preserve-3d" }}
      >
        <path d="M12 2L16 12H12V2Z" className="fill-red-500" />
        <path d="M12 2L8 12H12V2Z" className="fill-red-300" />
        <path d="M12 22L16 12H12V22Z" className="fill-muted-foreground/60" />
        <path d="M12 22L8 12H12V22Z" className="fill-muted-foreground/30" />
      </svg>
    </ControlButton>
  );
}

function MapPopup({
  offset = 16,
  closeButton = false,
  maxWidth = "none",
  className,
  children,
  onClose,
  ...props
}: React.ComponentProps<typeof MapLibreGLPopup>) {
  const popupRef = useRef<Popup | null>(null);

  return (
    <MapLibreGLPopup
      data-slot="map-popup"
      ref={popupRef}
      offset={offset}
      maxWidth={maxWidth}
      // We are replacing the close button with our own.
      closeButton={false}
      onClose={onClose}
      {...props}
    >
      <div
        className={cn(
          "relative animate-in rounded-md border bg-popover p-3 text-popover-foreground shadow-md fade-in-0 zoom-in-95",
          className
        )}
      >
        {closeButton && (
          <button
            type="button"
            // Emulate Popup close event.
            onClick={() =>
              onClose?.({ type: "close", target: popupRef.current! })
            }
            className="absolute top-1 right-1 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none"
            aria-label="Close popup"
          >
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </button>
        )}
        {children}
      </div>
    </MapLibreGLPopup>
  );
}

interface MapRouteProps {
  /** Optional unique identifier for the route layer */
  id?: string;
  /** Array of [longitude, latitude] coordinate pairs defining the route */
  coordinates: GeoJSON.Position[];
  /** Line color as CSS color value (default: "#4285F4") */
  color?: string;
  /** Line width in pixels (default: 3) */
  width?: number;
  /** Line opacity from 0 to 1 (default: 0.8) */
  opacity?: number;
  /** Dash pattern [dash length, gap length] for dashed lines */
  dashArray?: [number, number];
  /** Callback when the route line is clicked */
  onClick?: () => void;
  /** Callback when mouse enters the route line */
  onMouseEnter?: () => void;
  /** Callback when mouse leaves the route line */
  onMouseLeave?: () => void;
  /** Whether the route is interactive - shows pointer cursor on hover (default: true) */
  interactive?: boolean;
}

function MapRoute({
  id: idProp,
  coordinates,
  color = "#4285F4",
  width = 3,
  opacity = 0.8,
  dashArray,
  onClick,
  onMouseEnter,
  onMouseLeave,
  interactive = true,
}: MapRouteProps) {
  const { mapRef } = useMap();

  const autoId = useId();
  const id = idProp ?? autoId;

  const sourceId = `route-source-${id}`;
  const layerId = `route-layer-${id}`;

  useEffect(() => {
    if (!interactive) {
      return;
    }

    const map = mapRef.current;
    if (!map) {
      return;
    }

    const handleClick = () => {
      onClick?.();
    };

    const handleMouseEnter = () => {
      if (interactive) {
        map.getCanvas().style.cursor = "pointer";
      }
      onMouseEnter?.();
    };

    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = "";
      onMouseLeave?.();
    };

    map.on("click", layerId, handleClick);
    map.on("mouseenter", layerId, handleMouseEnter);
    map.on("mouseleave", layerId, handleMouseLeave);

    return () => {
      map.off("click", layerId, handleClick);
      map.off("mouseenter", layerId, handleMouseEnter);
      map.off("mouseleave", layerId, handleMouseLeave);
    };
  }, [mapRef, layerId, onClick, onMouseEnter, onMouseLeave, interactive]);

  return (
    <MapLibreGLSource
      id={sourceId}
      type="geojson"
      data={{
        type: "Feature",
        properties: {},
        geometry: { type: "LineString", coordinates },
      }}
    >
      <MapLibreGLLayer
        id={layerId}
        type="line"
        layout={{
          "line-join": "round",
          "line-cap": "round",
        }}
        paint={{
          "line-color": color,
          "line-width": width,
          "line-opacity": opacity,
          ...(dashArray && { "line-dasharray": dashArray }),
        }}
      />
    </MapLibreGLSource>
  );
}

interface MapClusterLayerProps<
  P extends GeoJSON.GeoJsonProperties = GeoJSON.GeoJsonProperties
> {
  /** Optional unique identifier for the cluster layer */
  id?: string;
  /** GeoJSON FeatureCollection data or URL to fetch GeoJSON from */
  data: string | GeoJSON.FeatureCollection<GeoJSON.Point, P>;
  /** Maximum zoom level to cluster points on (default: 14) */
  clusterMaxZoom?: number;
  /** Radius of each cluster when clustering points in pixels (default: 50) */
  clusterRadius?: number;
  /** Colors for cluster circles: [small, medium, large] based on point count (default: ["#51bbd6", "#f1f075", "#f28cb1"]) */
  clusterColors?: [string, string, string];
  /** Point count thresholds for color/size steps: [medium, large] (default: [100, 750]) */
  clusterThresholds?: [number, number];
  /** Color for unclustered individual points (default: "#3b82f6") */
  pointColor?: string;
  /** Callback when an unclustered point is clicked */
  onPointClick?: (
    feature: GeoJSON.Feature<GeoJSON.Point, P>,
    coordinates: [number, number]
  ) => void;
  /** Callback when a cluster is clicked. If not provided, zooms into the cluster */
  onClusterClick?: (
    clusterId: number,
    coordinates: [number, number],
    pointCount: number
  ) => void;
}

function MapClusterLayer<
  P extends GeoJSON.GeoJsonProperties = GeoJSON.GeoJsonProperties
>({
  id: idProp,
  data,
  clusterMaxZoom = 14,
  clusterRadius = 50,
  clusterColors = ["#51bbd6", "#f1f075", "#f28cb1"],
  clusterThresholds = [100, 750],
  pointColor = "#3b82f6",
  onPointClick,
  onClusterClick,
}: MapClusterLayerProps<P>) {
  const { mapRef } = useMap();

  const autoId = useId();
  const id = idProp ?? autoId;

  const sourceId = `cluster-source-${id}`;
  const clusterLayerId = `clusters-${id}`;
  const clusterCountLayerId = `cluster-count-${id}`;
  const unclusteredLayerId = `unclustered-point-${id}`;

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    // Cluster click handler - zoom into cluster
    const handleClusterClick = async (e: MapMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: [clusterLayerId],
      });
      if (!features.length) {
        return;
      }

      const feature = features[0];
      const clusterId = feature.properties.cluster_id as number;
      const pointCount = feature.properties?.point_count as number;
      const coordinates = (feature.geometry as GeoJSON.Point).coordinates as [
        number,
        number
      ];

      if (onClusterClick) {
        onClusterClick(clusterId, coordinates, pointCount);
      } else {
        // Default behavior: zoom to cluster expansion zoom
        const source = map.getSource(sourceId) as GeoJSONSource;
        const zoom = await source.getClusterExpansionZoom(clusterId);
        map.easeTo({
          center: coordinates,
          zoom,
        });
      }
    };

    // Unclustered point click handler
    const handlePointClick = (
      e: MapMouseEvent & {
        features?: MapGeoJSONFeature[];
      }
    ) => {
      if (!onPointClick || !e.features?.length) {
        return;
      }

      const feature = e.features[0];
      const coordinates = (
        feature.geometry as GeoJSON.Point
      ).coordinates.slice() as [number, number];

      // Handle world copies
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      onPointClick(
        feature as unknown as GeoJSON.Feature<GeoJSON.Point, P>,
        coordinates
      );
    };

    const handleMouseEnterCluster = () => {
      map.getCanvas().style.cursor = "pointer";
    };
    const handleMouseLeaveCluster = () => {
      map.getCanvas().style.cursor = "";
    };
    const handleMouseEnterPoint = () => {
      if (onPointClick) {
        map.getCanvas().style.cursor = "pointer";
      }
    };
    const handleMouseLeavePoint = () => {
      map.getCanvas().style.cursor = "";
    };

    map.on("click", clusterLayerId, handleClusterClick);
    map.on("click", unclusteredLayerId, handlePointClick);
    map.on("mouseenter", clusterLayerId, handleMouseEnterCluster);
    map.on("mouseleave", clusterLayerId, handleMouseLeaveCluster);
    map.on("mouseenter", clusterLayerId, handleMouseEnterCluster);
    map.on("mouseleave", clusterLayerId, handleMouseLeaveCluster);
    map.on("mouseenter", unclusteredLayerId, handleMouseEnterPoint);
    map.on("mouseleave", unclusteredLayerId, handleMouseLeavePoint);

    return () => {
      map.off("click", clusterLayerId, handleClusterClick);
      map.off("click", unclusteredLayerId, handlePointClick);
      map.off("mouseenter", clusterLayerId, handleMouseEnterCluster);
      map.off("mouseleave", clusterLayerId, handleMouseLeaveCluster);
      map.off("mouseenter", clusterLayerId, handleMouseEnterCluster);
      map.off("mouseleave", clusterLayerId, handleMouseLeaveCluster);
      map.off("mouseenter", unclusteredLayerId, handleMouseEnterPoint);
      map.off("mouseleave", unclusteredLayerId, handleMouseLeavePoint);
    };
  }, [
    mapRef,
    clusterLayerId,
    unclusteredLayerId,
    sourceId,
    onClusterClick,
    onPointClick,
  ]);

  return (
    <MapLibreGLSource
      id={sourceId}
      type="geojson"
      data={data}
      cluster
      clusterMaxZoom={clusterMaxZoom}
      clusterRadius={clusterRadius}
    >
      <MapLibreGLLayer
        id={clusterLayerId}
        type="circle"
        source={sourceId}
        filter={["has", "point_count"]}
        paint={{
          "circle-color": [
            "step",
            ["get", "point_count"],
            clusterColors[0],
            clusterThresholds[0],
            clusterColors[1],
            clusterThresholds[1],
            clusterColors[2],
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            20,
            clusterThresholds[0],
            30,
            clusterThresholds[1],
            40,
          ],
        }}
      />
      <MapLibreGLLayer
        id={clusterCountLayerId}
        type="symbol"
        source={sourceId}
        filter={["has", "point_count"]}
        layout={{
          "text-field": "{point_count_abbreviated}",
          "text-size": 12,
        }}
        paint={{
          "text-color": "#fff",
        }}
      />
      <MapLibreGLLayer
        id={unclusteredLayerId}
        type="circle"
        source={sourceId}
        filter={["!", ["has", "point_count"]]}
        paint={{
          "circle-color": pointColor,
          "circle-radius": 6,
        }}
      />
    </MapLibreGLSource>
  );
}

export {
  Map,
  MapClusterLayer,
  MapControls,
  MapMarker,
  MapPopup,
  MapRoute,
  MarkerContent,
  MarkerLabel,
  MarkerPopup,
  MarkerTooltip,
  useMap,
};
