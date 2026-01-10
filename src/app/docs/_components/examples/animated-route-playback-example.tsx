"use client";

import { AnimatedRoutePlayback, Map } from "@/registry/map";

// A realistic delivery route through New York City
const deliveryRoute = [
    [-74.006, 40.7128], // Start: NYC City Hall
    [-74.0, 40.72], // Moving north
    [-73.995, 40.725], // Continue
    [-73.99, 40.73], // Continue
    [-73.9857, 40.7484], // Stop 1: Empire State Building
    [-73.98, 40.75], // Continue
    [-73.9772, 40.7527], // Stop 2: Grand Central Terminal
    [-73.975, 40.755], // Continue
    [-73.97, 40.76], // Continue
    [-73.9654, 40.7829], // Stop 3: Central Park South
    [-73.96, 40.785], // Continue into park
    [-73.958, 40.79], // Continue
    [-73.955, 40.795], // End: Central Park
] as [number, number][];

export function AnimatedRouteExample() {
    return (
        <div className="h-[500px] w-full">
            <Map center={[-73.98, 40.76]} zoom={12}>
                <AnimatedRoutePlayback
                    coordinates={deliveryRoute}
                    routeColor="#10b981"
                    routeWidth={4}
                    routeOpacity={0.7}
                    markerColor="#10b981"
                    speed={2}
                    autoStart={true}
                    loop={true}
                    showControls={true}
                    onProgress={(progress, index) => {
                        console.log(
                            `Progress: ${(progress * 100).toFixed(1)}%, Index: ${index}`,
                        );
                    }}
                    onComplete={() => {
                        console.log("Route playback complete!");
                    }}
                />
            </Map>
        </div>
    );
}
