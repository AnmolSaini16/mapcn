import { useMemo, useState } from "react";
import { type MapMarkerProps, MapMarker, MarkerContent, MapRoute } from "@/registry/map";
import { calculateDistance, calculateMidpoint } from "@/lib/geo-utils";
import { cn } from "@/lib/utils";

export interface ProximityPoint {
    lat: number;
    lng: number;
    label?: string;
    color?: string;
    props?: Partial<MapMarkerProps>;
}

export interface ProximityMapProps {
    points: ProximityPoint[];
    unit?: "metric" | "imperial";
    labels?: "always" | "hover" | "none";
}

export function ProximityMap({
    points,
    unit = "metric",
    labels = "always",
}: ProximityMapProps) {
    const [hoveredKey, setHoveredKey] = useState<string | null>(null);

    const connections = useMemo(() => {
        const lines: Array<{
            start: ProximityPoint;
            end: ProximityPoint;
            distance: number;
            midpoint: { lat: number; lng: number };
            key: string;
        }> = [];

        for (let i = 0; i < points.length; i++) {
            for (let j = i + 1; j < points.length; j++) {
                const p1 = points[i];
                const p2 = points[j];
                if (!p1 || !p2) continue;

                const distance = calculateDistance(p1.lat, p1.lng, p2.lat, p2.lng, unit);
                const midpoint = calculateMidpoint(p1.lat, p1.lng, p2.lat, p2.lng);

                lines.push({
                    start: p1,
                    end: p2,
                    distance,
                    midpoint,
                    key: `${i}-${j}`
                });
            }
        }
        return lines;
    }, [points, unit]);

    if (points.length < 2) return null;

    return (
        <>
            {/* 1. Render connecting lines FIRST (so they appear below markers) */}
            {connections.map((conn) => (
                <MapRoute
                    key={`line-${conn.key}`}
                    coordinates={[
                        [conn.start.lng, conn.start.lat],
                        [conn.end.lng, conn.end.lat],
                    ]}
                    color={hoveredKey === conn.key ? "#3b82f6" : "#94a3b8"} // Highlight on hover
                    width={hoveredKey === conn.key ? 3 : 2}
                    dashArray={[2, 2]} // Dotted style
                    onMouseEnter={() => setHoveredKey(conn.key)}
                    onMouseLeave={() => setHoveredKey(null)}
                />
            ))}

            {/* 2. Render all points */}
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
                                "bg-blue-500",
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

            {/* 3. Render distance labels at midpoints */}
            {labels !== "none" &&
                connections.map((conn) => {
                    const isVisible = labels === "always" || (labels === "hover" && hoveredKey === conn.key);

                    if (!isVisible) return null;

                    return (
                        <MapMarker
                            key={`label-${conn.key}`}
                            longitude={conn.midpoint.lng}
                            latitude={conn.midpoint.lat}
                        >
                            <MarkerContent className="pointer-events-none">
                                <div className={cn(
                                    "bg-background/90 text-[10px] text-muted-foreground px-1.5 py-0.5 rounded-full border border-border shadow-sm whitespace-nowrap",
                                    labels === "hover" && "animate-in fade-in zoom-in duration-200"
                                )}>
                                    {conn.distance} {unit === "metric" ? "km" : "mi"}
                                </div>
                            </MarkerContent>
                        </MapMarker>
                    );
                })}
        </>
    );
}
