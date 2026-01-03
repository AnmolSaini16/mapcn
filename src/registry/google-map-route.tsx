"use client";

import { useEffect, useState, ReactNode } from "react";
import { type MapRouteProps, MapRoute, MapMarker, MarkerContent } from "@/registry/map";
import { cn } from "@/lib/utils";
import {
    fetchGoogleRoute,
    type GoogleRouteOptions,
    type GoogleRouteLeg,
} from "@/lib/google-maps";

export function useGoogleRoute({
    origin,
    destination,
    mode = "driving",
    units = "metric",
}: GoogleRouteOptions): {
    route: [number, number][];
    leg: GoogleRouteLeg | null;
    isLoading: boolean;
    error: string | null;
} {
    const [route, setRoute] = useState<[number, number][]>([]);
    const [leg, setLeg] = useState<GoogleRouteLeg | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchRoute() {
            try {
                setIsLoading(true);
                const result = await fetchGoogleRoute({
                    origin,
                    destination,
                    mode,
                    units,
                });
                if (isMounted) {
                    setRoute(result.path);
                    setLeg(result.leg);
                    setError(null);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : "Unknown error occurred");
                    console.error("Error fetching Google Route:", err);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        if (origin && destination) {
            fetchRoute();
        }

        return () => {
            isMounted = false;
        };
    }, [
        typeof origin === "string" ? origin : `${origin.lat},${origin.lng}`,
        typeof destination === "string"
            ? destination
            : `${destination.lat},${destination.lng}`,
        mode,
        units,
    ]);

    return { route, leg, isLoading, error };
}

import { CarFront, Footprints, Bike, Bus } from "lucide-react";

// ... previous code ...

interface GoogleMapRouteProps extends Omit<MapRouteProps, "coordinates">, GoogleRouteOptions {
    tooltip?: boolean | ReactNode;
}

export function GoogleMapRoute({
    origin,
    destination,
    mode = "driving",
    units,
    tooltip,
    ...props
}: GoogleMapRouteProps) {
    const { route, leg, isLoading } = useGoogleRoute({
        origin,
        destination,
        mode,
        units,
    });
    const [isHovered, setIsHovered] = useState(false);

    if (isLoading || route.length === 0) return null;

    const midPointIndex = Math.floor(route.length / 2);
    const midPoint = route[midPointIndex];

    const ModeIcon = {
        driving: CarFront,
        walking: Footprints,
        bicycling: Bike,
        transit: Bus,
    }[mode];

    return (
        <>
            <MapRoute
                coordinates={route}
                {...props}
                onMouseEnter={(e) => {
                    setIsHovered(true);
                    props.onMouseEnter?.(e);
                }}
                onMouseLeave={(e) => {
                    setIsHovered(false);
                    props.onMouseLeave?.(e);
                }}
            />
            {tooltip && leg && midPoint && isHovered && (
                <MapMarker longitude={midPoint[0]} latitude={midPoint[1]}>
                    <MarkerContent>
                        <div
                            className={cn(
                                "flex items-center gap-1.5 rounded-md bg-foreground px-2 py-1 text-xs text-background shadow-md animate-in fade-in-0 zoom-in-95",
                                "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap pointer-events-none"
                            )}
                        >
                            {typeof tooltip === "boolean" ? (
                                <>
                                    <ModeIcon className="size-3" />
                                    <span className="font-semibold">{leg.duration.text}</span>
                                    <span className="opacity-70">·</span>
                                    <span>{leg.distance.text}</span>
                                </>
                            ) : (
                                tooltip
                            )}
                        </div>
                    </MarkerContent>
                </MapMarker>
            )}
        </>
    );
}
