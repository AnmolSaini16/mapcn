"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { CarFront, Footprints, Bike, Bus } from "lucide-react";
import { type MapMarkerProps, MapMarker, MarkerContent, MapRoute } from "@/registry/map";
import { fetchGoogleRoute, type GoogleRouteResult } from "@/lib/google-maps";
import { cn } from "@/lib/utils";

export interface GoogleProximityPoint {
    lat: number;
    lng: number;
    label?: string;
    color?: string;
    props?: Partial<MapMarkerProps>;
}

export interface GoogleProximityMapProps {
    points: GoogleProximityPoint[];
    unit?: "metric" | "imperial";
    labels?: "always" | "hover" | "none";
    mode?: "driving" | "walking" | "bicycling" | "transit";
}

interface RouteSegment {
    start: GoogleProximityPoint;
    end: GoogleProximityPoint;
    key: string;
    data: GoogleRouteResult | null;
    loading: boolean;
    error: string | null;
}

export function GoogleProximityMap({
    points,
    unit = "metric",
    labels = "always",
    mode = "driving",
}: GoogleProximityMapProps) {
    const { resolvedTheme } = useTheme();
    const [hoveredKey, setHoveredKey] = useState<string | null>(null);
    const [cursorPos, setCursorPos] = useState<{ lat: number; lng: number } | null>(null);
    const [routes, setRoutes] = useState<Record<string, RouteSegment>>({});

    const ModeIcon = {
        driving: CarFront,
        walking: Footprints,
        bicycling: Bike,
        transit: Bus,
    }[mode];

    const isDark = resolvedTheme === "dark";
    const lineColor = isDark ? "#ffffff" : "#64748b"; // White (Dark Mode) vs Slate 500 (Light Mode)

    const pairs = useMemo(() => {
        const p: { start: GoogleProximityPoint; end: GoogleProximityPoint; key: string }[] = [];
        for (let i = 0; i < points.length; i++) {
            for (let j = i + 1; j < points.length; j++) {
                p.push({
                    start: points[i],
                    end: points[j],
                    key: `${i}-${j}`
                });
            }
        }
        return p;
    }, [points]);

    useEffect(() => {
        pairs.forEach(pair => {
            setRoutes(prev => {
                if (prev[pair.key]) return prev;
                return {
                    ...prev,
                    [pair.key]: { ...pair, data: null, loading: true, error: null }
                };
            });

            fetchGoogleRoute({
                origin: { lat: pair.start.lat, lng: pair.start.lng },
                destination: { lat: pair.end.lat, lng: pair.end.lng },
                mode,
                units: unit,
            })
                .then(result => {
                    setRoutes(prev => ({
                        ...prev,
                        [pair.key]: { ...prev[pair.key], data: result, loading: false, error: null }
                    }));
                })
                .catch(err => {
                    console.error("Failed to fetch route", pair.key, err);
                    setRoutes(prev => ({
                        ...prev,
                        [pair.key]: { ...prev[pair.key], loading: false, error: "Failed" } // simple error state
                    }));
                });
        });
    }, [pairs, mode, unit]);

    if (points.length < 2) return null;

    return (
        <>
            {/* 1. Render routes */}
            {Object.values(routes).map((segment) => {
                if (!segment.data) return null;

                // data.path is already the decoded array of coordinates
                const coordinates = segment.data.path;
                const isHovered = hoveredKey === segment.key;

                return (
                    <MapRoute
                        key={`route-${segment.key}`}
                        coordinates={coordinates}
                        color={isHovered ? "#3b82f6" : lineColor}
                        width={isHovered ? 4 : 3}
                        opacity={isHovered ? 1 : 0.8}
                        onMouseEnter={() => setHoveredKey(segment.key)}
                        onMouseMove={(e) => setCursorPos(e.lngLat)}
                        onMouseLeave={() => {
                            setHoveredKey(null);
                            setCursorPos(null);
                        }}
                    />
                );
            })}

            {/* 2. Render points */}
            {points.map((point, i) => (
                <MapMarker
                    key={`point-${i}`}
                    longitude={point.lng}
                    latitude={point.lat}
                    {...point.props}
                >
                    <MarkerContent>
                        <div
                            className={cn(
                                "relative flex items-center justify-center size-3 rounded-full border border-background shadow-sm",
                                "bg-indigo-500",
                                point.color && `bg-[${point.color}]`
                            )}
                        >
                            <div className="size-1.5 rounded-full bg-background" />
                        </div>
                        {point.label && (
                            <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium bg-background/80 px-1.5 py-0.5 rounded shadow-sm border border-border">
                                {point.label}
                            </div>
                        )}
                    </MarkerContent>
                </MapMarker>
            ))}

            {labels !== "none" &&
                Object.values(routes).map((segment) => {
                    if (!segment.data) return null;

                    const isHovered = hoveredKey === segment.key;
                    const showLabel = labels === "always" || (labels === "hover" && isHovered);

                    if (!showLabel) return null;

                    const leg = segment.data.leg;

                    // Determine label position: cursor if hovering, otherwise midpoint
                    let labelLat, labelLng;

                    if (labels === "hover" && cursorPos && isHovered) {
                        labelLat = cursorPos.lat;
                        labelLng = cursorPos.lng;
                    } else {
                        // Midpoint fallback (for 'always' mode or if cursor is missing)
                        labelLat = (segment.start.lat + segment.end.lat) / 2;
                        labelLng = (segment.start.lng + segment.end.lng) / 2;
                    }

                    return (
                        <MapMarker
                            key={`label-${segment.key}`}
                            longitude={labelLng}
                            latitude={labelLat}
                        >
                            <MarkerContent className="pointer-events-none z-50">
                                <div className={cn(
                                    "bg-background/95 text-[10px] text-foreground px-2 py-1 rounded-full border border-border shadow-md whitespace-nowrap flex items-center gap-1",
                                    "transform -translate-y-8", // Offset slightly above cursor/line
                                    labels === "hover" && "animate-in fade-in zoom-in duration-200"
                                )}>
                                    <ModeIcon className="size-3 text-muted-foreground" />
                                    <span className="font-semibold">{leg.distance.text}</span>
                                    <span className="text-muted-foreground">• {leg.duration.text}</span>
                                </div>
                            </MarkerContent>
                        </MapMarker>
                    );
                })}
        </>
    );
}
