"use client";

import { Locate, Maximize, Minus, Plus, Loader2, X } from "lucide-react";
import MapLibreGL, { type MarkerOptions, type PopupOptions } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useTheme } from "next-themes";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

type MapContextValue = {
  map: MapLibreGL.Map | null;
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

type MapStyleOption = string | MapLibreGL.StyleSpecification;

type MapProps = {
  children?: ReactNode;
  styles?: {
    light?: MapStyleOption;
    dark?: MapStyleOption;
  };
} & Omit<MapLibreGL.MapOptions, "container" | "style">;

const DefaultLoader = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="flex gap-1">
      <span className="bg-muted-foreground/60 size-1.5 animate-pulse rounded-full" />
      <span className="bg-muted-foreground/60 size-1.5 animate-pulse rounded-full [animation-delay:150ms]" />
      <span className="bg-muted-foreground/60 size-1.5 animate-pulse rounded-full [animation-delay:300ms]" />
    </div>
  </div>
);

function Map({ children, styles, ...props }: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreGL.Map | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [isStyleLoaded, setIsStyleLoaded] = useState(false);
  const { resolvedTheme } = useTheme();

  const mapStyles = useMemo(
    () => ({
      dark: styles?.dark ?? defaultStyles.dark,
      light: styles?.light ?? defaultStyles.light,
    }),
    [styles]
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const mapStyle =
      resolvedTheme === "dark" ? mapStyles.dark : mapStyles.light;

    const mapInstance = new MapLibreGL.Map({
      container: containerRef.current,
      style: mapStyle,
      renderWorldCopies: false,
      attributionControl: {
        compact: true,
      },
      ...props,
    });

    const styleDataHandler = () => setIsStyleLoaded(true);
    const loadHandler = () => setIsLoaded(true);

    mapInstance.on("load", loadHandler);
    mapInstance.on("styledata", styleDataHandler);
    mapRef.current = mapInstance;

    return () => {
      mapInstance.off("load", loadHandler);
      mapInstance.off("styledata", styleDataHandler);
      mapInstance.remove();
      mapRef.current = null;
      setIsLoaded(false);
      setIsStyleLoaded(false);
    };
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      // If the map style is satellite, we do not need to invalidate style loaded state
      const style = mapRef.current.getStyle();
      if (
        style?.name === "satellite" ||
        style?.name === "ocean" ||
        style?.name === "natgeo"
      ) {
        return;
      }
      // When theme changes, we invalidate style loaded state
      setIsStyleLoaded(false);
      mapRef.current.setStyle(
        resolvedTheme === "dark" ? mapStyles.dark : mapStyles.light,
        { diff: true }
      );
    }
  }, [resolvedTheme, mapStyles]);

  const isLoading = !isLoaded || !isStyleLoaded;

  const contextValue = useMemo(
    () => ({
      map: mapRef.current,
      // We expose the map even if style isn't fully loaded yet to allow listeners to attach
      isLoaded: isLoaded,
    }),
    [isLoaded, isStyleLoaded]
  );

  return (
    <MapContext.Provider value={contextValue}>
      <div ref={containerRef} className="relative h-full w-full">
        {isLoading && <DefaultLoader />}
        {mapRef.current && children}
      </div>
    </MapContext.Provider>
  );
}

type MarkerContextValue = {
  markerRef: React.RefObject<MapLibreGL.Marker | null>;
  markerElementRef: React.RefObject<HTMLDivElement | null>;
  map: MapLibreGL.Map | null;
  isReady: boolean;
};

const MarkerContext = createContext<MarkerContextValue | null>(null);

function useMarkerContext() {
  const context = useContext(MarkerContext);
  if (!context) {
    throw new Error("Marker components must be used within MapMarker");
  }
  return context;
}

type MapMarkerProps = {
  /** Longitude coordinate for marker position */
  longitude: number;
  /** Latitude coordinate for marker position */
  latitude: number;
  /** Marker subcomponents (MarkerContent, MarkerPopup, MarkerTooltip, MarkerLabel) */
  children: ReactNode;
  /** Callback when marker is clicked */
  onClick?: (e: MouseEvent) => void;
  /** Callback when mouse enters marker */
  onMouseEnter?: (e: MouseEvent) => void;
  /** Callback when mouse leaves marker */
  onMouseLeave?: (e: MouseEvent) => void;
  /** Callback when marker drag starts (requires draggable: true) */
  onDragStart?: (lngLat: { lng: number; lat: number }) => void;
  /** Callback during marker drag (requires draggable: true) */
  onDrag?: (lngLat: { lng: number; lat: number }) => void;
  /** Callback when marker drag ends (requires draggable: true) */
  onDragEnd?: (lngLat: { lng: number; lat: number }) => void;
} & Omit<MarkerOptions, "element">;

function MapMarker({
  longitude,
  latitude,
  children,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onDragStart,
  onDrag,
  onDragEnd,
  draggable = false,
  ...markerOptions
}: MapMarkerProps) {
  const { map, isLoaded } = useMap();
  const markerRef = useRef<MapLibreGL.Marker | null>(null);
  const markerElementRef = useRef<HTMLDivElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const markerOptionsRef = useRef(markerOptions);

  useEffect(() => {
    if (!isLoaded || !map) return;

    const container = document.createElement("div");
    markerElementRef.current = container;

    const marker = new MapLibreGL.Marker({
      ...markerOptions,
      element: container,
      draggable,
    })
      .setLngLat([longitude, latitude])
      .addTo(map);

    markerRef.current = marker;

    const handleClick = (e: MouseEvent) => onClick?.(e);
    const handleMouseEnter = (e: MouseEvent) => onMouseEnter?.(e);
    const handleMouseLeave = (e: MouseEvent) => onMouseLeave?.(e);

    container.addEventListener("click", handleClick);
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    const handleDragStart = () => {
      const lngLat = marker.getLngLat();
      onDragStart?.({ lng: lngLat.lng, lat: lngLat.lat });
    };
    const handleDrag = () => {
      const lngLat = marker.getLngLat();
      onDrag?.({ lng: lngLat.lng, lat: lngLat.lat });
    };
    const handleDragEnd = () => {
      const lngLat = marker.getLngLat();
      onDragEnd?.({ lng: lngLat.lng, lat: lngLat.lat });
    };

    marker.on("dragstart", handleDragStart);
    marker.on("drag", handleDrag);
    marker.on("dragend", handleDragEnd);

    setIsReady(true);

    return () => {
      container.removeEventListener("click", handleClick);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);

      marker.off("dragstart", handleDragStart);
      marker.off("drag", handleDrag);
      marker.off("dragend", handleDragEnd);

      marker.remove();
      markerRef.current = null;
      markerElementRef.current = null;
      setIsReady(false);
    };
  }, [map, isLoaded]);

  useEffect(() => {
    markerRef.current?.setLngLat([longitude, latitude]);
  }, [longitude, latitude]);

  useEffect(() => {
    markerRef.current?.setDraggable(draggable);
  }, [draggable]);

  useEffect(() => {
    if (!markerRef.current) return;
    const prev = markerOptionsRef.current;

    if (prev.offset !== markerOptions.offset) {
      markerRef.current.setOffset(markerOptions.offset ?? [0, 0]);
    }
    if (prev.rotation !== markerOptions.rotation) {
      markerRef.current.setRotation(markerOptions.rotation ?? 0);
    }
    if (prev.rotationAlignment !== markerOptions.rotationAlignment) {
      markerRef.current.setRotationAlignment(
        markerOptions.rotationAlignment ?? "auto"
      );
    }
    if (prev.pitchAlignment !== markerOptions.pitchAlignment) {
      markerRef.current.setPitchAlignment(
        markerOptions.pitchAlignment ?? "auto"
      );
    }

    markerOptionsRef.current = markerOptions;
  }, [markerOptions]);

  return (
    <MarkerContext.Provider
      value={{ markerRef, markerElementRef, map, isReady }}
    >
      {children}
    </MarkerContext.Provider>
  );
}

type MarkerContentProps = {
  /** Custom marker content. Defaults to a blue dot if not provided */
  children?: ReactNode;
  /** Additional CSS classes for the marker container */
  className?: string;
};

function MarkerContent({ children, className }: MarkerContentProps) {
  const { markerElementRef, isReady } = useMarkerContext();

  if (!isReady || !markerElementRef.current) return null;

  return createPortal(
    <div className={cn("relative cursor-pointer", className)}>
      {children || <DefaultMarkerIcon />}
    </div>,
    markerElementRef.current
  );
}

function DefaultMarkerIcon() {
  return (
    <div className="relative h-4 w-4 rounded-full border-2 border-white bg-blue-500 shadow-lg" />
  );
}

type MarkerPopupProps = {
  /** Popup content */
  children: ReactNode;
  /** Additional CSS classes for the popup container */
  className?: string;
  /** Show a close button in the popup (default: false) */
  closeButton?: boolean;
} & Omit<PopupOptions, "className" | "closeButton">;

function MarkerPopup({
  children,
  className,
  closeButton = false,
  ...popupOptions
}: MarkerPopupProps) {
  const { markerRef, isReady } = useMarkerContext();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<MapLibreGL.Popup | null>(null);
  const [mounted, setMounted] = useState(false);
  const popupOptionsRef = useRef(popupOptions);

  useEffect(() => {
    if (!isReady || !markerRef.current) return;

    const container = document.createElement("div");
    containerRef.current = container;

    const popup = new MapLibreGL.Popup({
      offset: 16,
      ...popupOptions,
      closeButton: false,
    })
      .setMaxWidth("none")
      .setDOMContent(container);

    popupRef.current = popup;
    markerRef.current.setPopup(popup);
    setMounted(true);

    return () => {
      popup.remove();
      popupRef.current = null;
      containerRef.current = null;
      setMounted(false);
    };
  }, [isReady]);

  useEffect(() => {
    if (!popupRef.current) return;
    const prev = popupOptionsRef.current;

    if (prev.offset !== popupOptions.offset) {
      popupRef.current.setOffset(popupOptions.offset ?? 16);
    }
    if (prev.maxWidth !== popupOptions.maxWidth && popupOptions.maxWidth) {
      popupRef.current.setMaxWidth(popupOptions.maxWidth ?? "none");
    }

    popupOptionsRef.current = popupOptions;
  }, [popupOptions]);

  const handleClose = () => popupRef.current?.remove();

  if (!mounted || !containerRef.current) return null;

  return createPortal(
    <div
      className={cn(
        "bg-popover text-popover-foreground animate-in fade-in-0 zoom-in-95 relative rounded-md border p-3 shadow-md",
        className
      )}
    >
      {closeButton && (
        <button
          type="button"
          onClick={handleClose}
          className="ring-offset-background focus:ring-ring absolute right-1 top-1 z-10 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2"
          aria-label="Close popup"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      )}
      {children}
    </div>,
    containerRef.current
  );
}

type MarkerTooltipProps = {
  /** Tooltip content */
  children: ReactNode;
  /** Additional CSS classes for the tooltip container */
  className?: string;
} & Omit<PopupOptions, "className" | "closeButton" | "closeOnClick">;

function MarkerTooltip({
  children,
  className,
  ...popupOptions
}: MarkerTooltipProps) {
  const { markerRef, markerElementRef, map, isReady } = useMarkerContext();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<MapLibreGL.Popup | null>(null);
  const [mounted, setMounted] = useState(false);
  const popupOptionsRef = useRef(popupOptions);

  useEffect(() => {
    if (!isReady || !markerRef.current || !markerElementRef.current || !map)
      return;

    const container = document.createElement("div");
    containerRef.current = container;

    const popup = new MapLibreGL.Popup({
      offset: 16,
      ...popupOptions,
      closeOnClick: true,
      closeButton: false,
    })
      .setMaxWidth("none")
      .setDOMContent(container);

    popupRef.current = popup;

    const markerElement = markerElementRef.current;
    const marker = markerRef.current;

    const handleMouseEnter = () => {
      popup.setLngLat(marker.getLngLat()).addTo(map);
    };
    const handleMouseLeave = () => popup.remove();

    markerElement.addEventListener("mouseenter", handleMouseEnter);
    markerElement.addEventListener("mouseleave", handleMouseLeave);
    setMounted(true);

    return () => {
      markerElement.removeEventListener("mouseenter", handleMouseEnter);
      markerElement.removeEventListener("mouseleave", handleMouseLeave);
      popup.remove();
      popupRef.current = null;
      containerRef.current = null;
      setMounted(false);
    };
  }, [isReady, map]);

  useEffect(() => {
    if (!popupRef.current) return;
    const prev = popupOptionsRef.current;

    if (prev.offset !== popupOptions.offset) {
      popupRef.current.setOffset(popupOptions.offset ?? 16);
    }
    if (prev.maxWidth !== popupOptions.maxWidth && popupOptions.maxWidth) {
      popupRef.current.setMaxWidth(popupOptions.maxWidth ?? "none");
    }

    popupOptionsRef.current = popupOptions;
  }, [popupOptions]);

  if (!mounted || !containerRef.current) return null;

  return createPortal(
    <div
      className={cn(
        "bg-foreground text-background animate-in fade-in-0 zoom-in-95 rounded-md px-2 py-1 text-xs shadow-md",
        className
      )}
    >
      {children}
    </div>,
    containerRef.current
  );
}

type MarkerLabelProps = {
  /** Label text content */
  children: ReactNode;
  /** Additional CSS classes for the label */
  className?: string;
  /** Position of the label relative to the marker (default: "top") */
  position?: "top" | "bottom";
};

function MarkerLabel({
  children,
  className,
  position = "top",
}: MarkerLabelProps) {
  const positionClasses = {
    top: "bottom-full mb-1",
    bottom: "top-full mt-1",
  };

  return (
    <div
      className={cn(
        "absolute left-1/2 -translate-x-1/2 whitespace-nowrap",
        "text-foreground text-[10px] font-medium",
        positionClasses[position],
        className
      )}
    >
      {children}
    </div>
  );
}

type MapControlsProps = {
  /** Position of the controls on the map (default: "bottom-right") */
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  /** Show zoom in/out buttons (default: true) */
  showZoom?: boolean;
  /** Show compass button to reset bearing (default: false) */
  showCompass?: boolean;
  /** Show locate button to find user's location (default: false) */
  showLocate?: boolean;
  /** Show fullscreen toggle button (default: false) */
  showFullscreen?: boolean;
  /** Additional CSS classes for the controls container */
  className?: string;
  /** Callback with user coordinates when located */
  onLocate?: (coords: { longitude: number; latitude: number }) => void;
};

const positionClasses = {
  "top-left": "top-2 left-2",
  "top-right": "top-2 right-2",
  "bottom-left": "bottom-2 left-2",
  "bottom-right": "bottom-10 right-2",
};

function ControlGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-border bg-background [&>button:not(:last-child)]:border-border flex w-fit flex-col overflow-hidden rounded-md border shadow-sm [&>button:not(:last-child)]:border-b">
      {children}
    </div>
  );
}

function ControlButton({
  onClick,
  label,
  children,
  disabled = false,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      type="button"
      className={cn(
        "hover:bg-accent dark:hover:bg-accent/40 flex size-8 items-center justify-center transition-colors disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
      )}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

function MapControls({
  position = "bottom-right",
  showZoom = true,
  showCompass = false,
  showLocate = false,
  showFullscreen = false,
  className,
  onLocate,
}: MapControlsProps) {
  const { map, isLoaded } = useMap();
  const [waitingForLocation, setWaitingForLocation] = useState(false);

  const handleZoomIn = useCallback(() => {
    map?.zoomTo(map.getZoom() + 1, { duration: 300 });
  }, [map]);

  const handleZoomOut = useCallback(() => {
    map?.zoomTo(map.getZoom() - 1, { duration: 300 });
  }, [map]);

  const handleResetBearing = useCallback(() => {
    map?.resetNorthPitch({ duration: 300 });
  }, [map]);

  const handleLocate = useCallback(() => {
    setWaitingForLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            longitude: pos.coords.longitude,
            latitude: pos.coords.latitude,
          };
          map?.flyTo({
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
  }, [map, onLocate]);

  const handleFullscreen = useCallback(() => {
    const container = map?.getContainer();
    if (!container) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      container.requestFullscreen();
    }
  }, [map]);

  if (!isLoaded) return null;

  return (
    <div
      className={cn(
        "absolute z-10 flex flex-col items-end justify-end gap-1.5",
        positionClasses[position],
        className
      )}
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
  const { isLoaded, map } = useMap();
  const compassRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!isLoaded || !map || !compassRef.current) return;

    const compass = compassRef.current;

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
  }, [isLoaded, map]);

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

type MapPopupProps = {
  /** Longitude coordinate for popup position */
  longitude: number;
  /** Latitude coordinate for popup position */
  latitude: number;
  /** Callback when popup is closed */
  onClose?: () => void;
  /** Popup content */
  children: ReactNode;
  /** Additional CSS classes for the popup container */
  className?: string;
  /** Show a close button in the popup (default: false) */
  closeButton?: boolean;
} & Omit<PopupOptions, "className" | "closeButton">;

function MapPopup({
  longitude,
  latitude,
  onClose,
  children,
  className,
  closeButton = false,
  ...popupOptions
}: MapPopupProps) {
  const { map } = useMap();
  const popupRef = useRef<MapLibreGL.Popup | null>(null);
  const popupOptionsRef = useRef(popupOptions);

  const container = useMemo(() => document.createElement("div"), []);

  useEffect(() => {
    if (!map) return;

    const popup = new MapLibreGL.Popup({
      offset: 16,
      ...popupOptions,
      closeButton: false,
    })
      .setMaxWidth("none")
      .setDOMContent(container)
      .setLngLat([longitude, latitude])
      .addTo(map);

    const onCloseProp = () => onClose?.();

    popup.on("close", onCloseProp);

    popupRef.current = popup;

    return () => {
      popup.off("close", onCloseProp);
      if (popup.isOpen()) {
        popup.remove();
      }
      popupRef.current = null;
    };
  }, [map]);

  useEffect(() => {
    popupRef.current?.setLngLat([longitude, latitude]);
  }, [longitude, latitude]);

  useEffect(() => {
    if (!popupRef.current) return;
    const prev = popupOptionsRef.current;

    if (prev.offset !== popupOptions.offset) {
      popupRef.current.setOffset(popupOptions.offset ?? 16);
    }
    if (prev.maxWidth !== popupOptions.maxWidth && popupOptions.maxWidth) {
      popupRef.current.setMaxWidth(popupOptions.maxWidth ?? "none");
    }

    popupOptionsRef.current = popupOptions;
  }, [popupOptions]);

  const handleClose = () => {
    popupRef.current?.remove();
    onClose?.();
  };

  return createPortal(
    <div
      className={cn(
        "bg-popover text-popover-foreground animate-in fade-in-0 zoom-in-95 relative rounded-md border p-3 shadow-md",
        className
      )}
    >
      {closeButton && (
        <button
          type="button"
          onClick={handleClose}
          className="ring-offset-background focus:ring-ring absolute right-1 top-1 z-10 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2"
          aria-label="Close popup"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      )}
      {children}
    </div>,
    container
  );
}

type MapRouteProps = {
  /** Array of [longitude, latitude] coordinate pairs defining the route */
  coordinates: [number, number][];
  /** Line color as CSS color value (default: "#4285F4") */
  color?: string;
  /** Line width in pixels (default: 3) */
  width?: number;
  /** Line opacity from 0 to 1 (default: 0.8) */
  opacity?: number;
  /** Dash pattern [dash length, gap length] for dashed lines */
  dashArray?: [number, number];
};

function MapRoute({
  coordinates,
  color = "#4285F4",
  width = 3,
  opacity = 0.8,
  dashArray,
}: MapRouteProps) {
  const { map, isLoaded } = useMap();
  const id = useId();
  const sourceId = `route-source-${id}`;
  const layerId = `route-layer-${id}`;

  // Add source and layer on mount
  useEffect(() => {
    if (!isLoaded || !map) return;

    map.addSource(sourceId, {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: { type: "LineString", coordinates: [] },
      },
    });

    map.addLayer({
      id: layerId,
      type: "line",
      source: sourceId,
      layout: { "line-join": "round", "line-cap": "round" },
      paint: {
        "line-color": color,
        "line-width": width,
        "line-opacity": opacity,
        ...(dashArray && { "line-dasharray": dashArray }),
      },
    });

    return () => {
      try {
        if (map.getLayer(layerId)) map.removeLayer(layerId);
        if (map.getSource(sourceId)) map.removeSource(sourceId);
      } catch {
        // ignore
      }
    };
  }, [isLoaded, map, sourceId, layerId]);

  // When coordinates change, update the source data
  useEffect(() => {
    if (!isLoaded || !map || coordinates.length < 2) return;

    const source = map.getSource(sourceId) as MapLibreGL.GeoJSONSource;
    if (source) {
      source.setData({
        type: "Feature",
        properties: {},
        geometry: { type: "LineString", coordinates },
      });
    }
  }, [isLoaded, map, coordinates, sourceId]);

  useEffect(() => {
    if (!isLoaded || !map || !map.getLayer(layerId)) return;

    map.setPaintProperty(layerId, "line-color", color);
    map.setPaintProperty(layerId, "line-width", width);
    map.setPaintProperty(layerId, "line-opacity", opacity);
    if (dashArray) {
      map.setPaintProperty(layerId, "line-dasharray", dashArray);
    }
  }, [isLoaded, map, layerId, color, width, opacity, dashArray]);

  return null;
}

type RenderPointProps<P extends GeoJSON.GeoJsonProperties> = {
  feature: GeoJSON.Feature<GeoJSON.Point, P>;
  coordinates: [number, number];
};

type MapClusterLayerProps<
  P extends GeoJSON.GeoJsonProperties = GeoJSON.GeoJsonProperties
> = {
  data: string | GeoJSON.FeatureCollection<GeoJSON.Point, P>;
  clusterMaxZoom?: number;
  clusterRadius?: number;
  clusterColors?: [string, string, string];
  clusterThresholds?: [number, number];
  pointColor?: string;
  pointRadius?: number;
  pointStrokeColor?: string;
  pointStrokeWidth?: number;
  renderPoint?: (props: RenderPointProps<P>) => ReactNode;
  onPointClick?: (
    feature: GeoJSON.Feature<GeoJSON.Point, P>,
    coordinates: [number, number]
  ) => void;
  onClusterClick?: (
    clusterId: number,
    coordinates: [number, number],
    pointCount: number
  ) => void;
};

type MarkerEntry = {
  marker: MapLibreGL.Marker;
  element: HTMLDivElement;
  feature: GeoJSON.Feature<GeoJSON.Point>;
};

function MapClusterLayer<
  P extends GeoJSON.GeoJsonProperties = GeoJSON.GeoJsonProperties
>({
  data,
  clusterMaxZoom = 14,
  clusterRadius = 50,
  clusterColors = ["#51bbd6", "#f1f075", "#f28cb1"],
  clusterThresholds = [100, 750],
  pointColor = "#3b82f6",
  pointRadius = 6,
  pointStrokeColor,
  pointStrokeWidth = 0,
  renderPoint,
  onPointClick,
  onClusterClick,
}: MapClusterLayerProps<P>) {
  const { map, isLoaded } = useMap();
  const id = useId();
  const sourceId = `cluster-source-${id}`;
  const clusterLayerId = `clusters-${id}`;
  const clusterCountLayerId = `cluster-count-${id}`;
  const unclusteredLayerId = `unclustered-point-${id}`;

  const markersRef = useRef(new globalThis.Map<string, MarkerEntry>());
  const [visibleFeatures, setVisibleFeatures] = useState<
    GeoJSON.Feature<GeoJSON.Point, P>[]
  >([]);

  const stylePropsRef = useRef({
    clusterColors,
    clusterThresholds,
    pointColor,
  });

  const hasCustomRenderer = Boolean(renderPoint);

  const addLayers = useCallback(() => {
    if (!map) return;

    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: "geojson",
        data: typeof data === "string" ? data : data,
        cluster: true,
        clusterMaxZoom,
        clusterRadius,
      });
    }

    if (!map.getLayer(clusterLayerId)) {
      map.addLayer({
        id: clusterLayerId,
        type: "circle",
        source: sourceId,
        filter: ["has", "point_count"],
        paint: {
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
        },
      });
    }

    if (!map.getLayer(clusterCountLayerId)) {
      map.addLayer({
        id: clusterCountLayerId,
        type: "symbol",
        source: sourceId,
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-size": 12,
        },
        paint: {
          "text-color": "#fff",
        },
      });
    }

    if (!map.getLayer(unclusteredLayerId)) {
      map.addLayer({
        id: unclusteredLayerId,
        type: "circle",
        source: sourceId,
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": pointColor,
          "circle-radius": pointRadius,
          "circle-stroke-width": pointStrokeWidth,
          "circle-stroke-color": pointStrokeColor || "transparent",
          // Use opacity to hide the layer if we have custom markers
          "circle-opacity": hasCustomRenderer ? 0 : 1,
          "circle-stroke-opacity": hasCustomRenderer ? 0 : 1,
        },
      });
    }
  }, [map]);

  useEffect(() => {
    if (!isLoaded || !map) return;

    addLayers();

    const handleStyleData = () => {
      if (!map.getSource(sourceId)) {
        addLayers();
      }
    };

    map.on("styledata", handleStyleData);

    return () => {
      map.off("styledata", handleStyleData);
      try {
        if (map.getLayer(clusterCountLayerId))
          map.removeLayer(clusterCountLayerId);
        if (map.getLayer(unclusteredLayerId))
          map.removeLayer(unclusteredLayerId);
        if (map.getLayer(clusterLayerId)) map.removeLayer(clusterLayerId);
        if (map.getSource(sourceId)) map.removeSource(sourceId);
      } catch {
        // ignore
      }
    };
  }, [
    isLoaded,
    map,
    addLayers,
    sourceId,
    clusterCountLayerId,
    unclusteredLayerId,
    clusterLayerId,
  ]);

  useEffect(() => {
    if (!isLoaded || !map || typeof data === "string") return;

    const source = map.getSource(sourceId) as MapLibreGL.GeoJSONSource;
    if (source) {
      source.setData(data);
    }
  }, [isLoaded, map, data, sourceId]);

  // Update styles dynamically
  useEffect(() => {
    if (!isLoaded || !map) return;

    const prev = stylePropsRef.current;

    // Cluster colors update logic...
    const colorsChanged =
      prev.clusterColors !== clusterColors ||
      prev.clusterThresholds !== clusterThresholds;

    if (map.getLayer(clusterLayerId) && colorsChanged) {
      map.setPaintProperty(clusterLayerId, "circle-color", [
        "step",
        ["get", "point_count"],
        clusterColors[0],
        clusterThresholds[0],
        clusterColors[1],
        clusterThresholds[1],
        clusterColors[2],
      ]);
      map.setPaintProperty(clusterLayerId, "circle-radius", [
        "step",
        ["get", "point_count"],
        20,
        clusterThresholds[0],
        30,
        clusterThresholds[1],
        40,
      ]);
    }

    if (map.getLayer(unclusteredLayerId)) {
      map.setPaintProperty(unclusteredLayerId, "circle-color", pointColor);
      map.setPaintProperty(
        unclusteredLayerId,
        "circle-opacity",
        hasCustomRenderer ? 0 : 1
      );
      map.setPaintProperty(
        unclusteredLayerId,
        "circle-stroke-opacity",
        hasCustomRenderer ? 0 : 1
      );
    }

    stylePropsRef.current = { clusterColors, clusterThresholds, pointColor };
  }, [
    isLoaded,
    map,
    clusterLayerId,
    unclusteredLayerId,
    clusterColors,
    clusterThresholds,
    pointColor,
    hasCustomRenderer,
  ]);

  const getFeatureKey = useCallback(
    (feature: GeoJSON.Feature<GeoJSON.Point>): string => {
      const coords = feature.geometry.coordinates;
      const id = feature.id ?? feature.properties?.id;
      return id ? String(id) : `${coords[0]}_${coords[1]}`;
    },
    []
  );

  const syncMarkers = useCallback(() => {
    if (!map || !hasCustomRenderer) return;

    const source = map.getSource(sourceId) as MapLibreGL.GeoJSONSource;
    if (!source) return;

    // querySourceFeatures will now work because the layer exists (even if invisible)
    const rawFeatures = map.querySourceFeatures(sourceId, {
      filter: ["!", ["has", "point_count"]],
    });

    const features = rawFeatures as unknown as GeoJSON.Feature<
      GeoJSON.Point,
      P
    >[];

    const uniqueFeatures = new globalThis.Map<
      string,
      GeoJSON.Feature<GeoJSON.Point, P>
    >();
    for (const feature of features) {
      const key = getFeatureKey(feature);
      if (!uniqueFeatures.has(key)) {
        uniqueFeatures.set(key, feature);
      }
    }

    const currentKeys = new globalThis.Set(uniqueFeatures.keys());
    const existingKeys = new globalThis.Set(markersRef.current.keys());

    for (const key of existingKeys) {
      if (!currentKeys.has(key)) {
        const entry = markersRef.current.get(key);
        if (entry) {
          entry.marker.remove();
          markersRef.current.delete(key);
        }
      }
    }

    for (const [key, feature] of uniqueFeatures) {
      if (!markersRef.current.has(key)) {
        const coords = feature.geometry.coordinates as [number, number];
        const element = document.createElement("div");
        element.style.cursor = onPointClick ? "pointer" : "default";

        // IMPORTANT: Prevent map clicks from firing when clicking the marker
        element.onclick = (e) => e.stopPropagation();

        const marker = new MapLibreGL.Marker({ element })
          .setLngLat(coords)
          .addTo(map);

        if (onPointClick) {
          element.addEventListener("click", (e) => {
            e.stopPropagation();
            onPointClick(feature, coords);
          });
        }

        markersRef.current.set(key, { marker, element, feature });
      }
    }

    setVisibleFeatures(Array.from(uniqueFeatures.values()));
  }, [map, sourceId, hasCustomRenderer, getFeatureKey, onPointClick]);

  useEffect(() => {
    if (!isLoaded || !map || !hasCustomRenderer) return;

    const handleUpdate = () => {
      requestAnimationFrame(syncMarkers);
    };

    map.on("moveend", handleUpdate);
    map.on("zoomend", handleUpdate);
    // sourcedata is crucial for loading new tiles
    map.on("sourcedata", handleUpdate);

    handleUpdate();

    return () => {
      map.off("moveend", handleUpdate);
      map.off("zoomend", handleUpdate);
      map.off("sourcedata", handleUpdate);

      markersRef.current.forEach((entry) => entry.marker.remove());
      markersRef.current.clear();
      setVisibleFeatures([]);
    };
  }, [isLoaded, map, hasCustomRenderer, syncMarkers]);

  useEffect(() => {
    if (!isLoaded || !map) return;

    const handleClusterClick = async (e: MapLibreGL.MapMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: [clusterLayerId],
      });
      const feature = features[0];
      if (!feature) return;

      const clusterId = feature.properties?.cluster_id as number;
      const pointCount = feature.properties?.point_count as number;
      const coordinates = (feature.geometry as GeoJSON.Point).coordinates as [
        number,
        number
      ];

      if (onClusterClick) {
        onClusterClick(clusterId, coordinates, pointCount);
      } else {
        const source = map.getSource(sourceId) as MapLibreGL.GeoJSONSource;
        const zoom = await source.getClusterExpansionZoom(clusterId);
        map.easeTo({ center: coordinates, zoom });
      }
    };

    const handlePointClick = (
      e: MapLibreGL.MapMouseEvent & {
        features?: MapLibreGL.MapGeoJSONFeature[];
      }
    ) => {
      if (!onPointClick || hasCustomRenderer) return;

      const feature = e.features?.[0];
      if (!feature) return;

      const coordinates = (
        feature.geometry as GeoJSON.Point
      ).coordinates.slice() as [number, number];
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      onPointClick(
        feature as unknown as GeoJSON.Feature<GeoJSON.Point, P>,
        coordinates
      );
    };

    const setPointer = () => (map.getCanvas().style.cursor = "pointer");
    const resetPointer = () => (map.getCanvas().style.cursor = "");

    if (map.getLayer(clusterLayerId)) {
      map.on("click", clusterLayerId, handleClusterClick);
      map.on("mouseenter", clusterLayerId, setPointer);
      map.on("mouseleave", clusterLayerId, resetPointer);
    }

    if (map.getLayer(unclusteredLayerId)) {
      map.on("click", unclusteredLayerId, handlePointClick);
      map.on("mouseenter", unclusteredLayerId, () => {
        if (onPointClick && !hasCustomRenderer) setPointer();
      });
      map.on("mouseleave", unclusteredLayerId, resetPointer);
    }

    return () => {
      try {
        if (map.getLayer(clusterLayerId)) {
          map.off("click", clusterLayerId, handleClusterClick);
          map.off("mouseenter", clusterLayerId, setPointer);
          map.off("mouseleave", clusterLayerId, resetPointer);
        }
        if (map.getLayer(unclusteredLayerId)) {
          map.off("click", unclusteredLayerId, handlePointClick);
          map.off("mouseenter", unclusteredLayerId, setPointer);
          map.off("mouseleave", unclusteredLayerId, resetPointer);
        }
      } catch {
        // ignore
      }
    };
  }, [
    isLoaded,
    map,
    clusterLayerId,
    unclusteredLayerId,
    sourceId,
    onClusterClick,
    onPointClick,
    hasCustomRenderer,
  ]);

  if (!hasCustomRenderer) {
    return null;
  }

  return (
    <>
      {visibleFeatures.map((feature) => {
        const key = getFeatureKey(feature);
        const entry = markersRef.current.get(key);
        if (!entry) return null;

        const coords = feature.geometry.coordinates as [number, number];
        return createPortal(
          renderPoint!({ feature, coordinates: coords }),
          entry.element,
          key
        );
      })}
    </>
  );
}

export {
  Map,
  useMap,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MarkerTooltip,
  MarkerLabel,
  MapPopup,
  MapControls,
  MapRoute,
  MapClusterLayer,
};

export type { RenderPointProps };
