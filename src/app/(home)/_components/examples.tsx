"use client";

import { useState } from "react";
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerLabel,
  MarkerTooltip,
  MapRoute,
} from "@/registry/map";
import { Truck, Flame, TrendingUp, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const analyticsData = [
  { lng: -74.006, lat: 40.7128, city: "New York", users: 847, size: 14 },
  { lng: -0.1276, lat: 51.5074, city: "London", users: 623, size: 12 },
  { lng: 139.6917, lat: 35.6895, city: "Tokyo", users: 412, size: 10 },
  { lng: -122.4194, lat: 37.7749, city: "San Francisco", users: 298, size: 9 },
  { lng: 2.3522, lat: 48.8566, city: "Paris", users: 187, size: 8 },
  { lng: 77.209, lat: 28.6139, city: "Delhi", users: 156, size: 7 },
  { lng: 151.2093, lat: -33.8688, city: "Sydney", users: 134, size: 7 },
  { lng: -43.1729, lat: -22.9068, city: "Rio", users: 89, size: 6 },
  { lng: 4.9041, lat: 52.3676, city: "Amsterdam", users: 76, size: 5 },
  { lng: 126.978, lat: 37.5665, city: "Seoul", users: 45, size: 5 },
];

function ExampleCard({
  label,
  className,
  delay = "delay-500",
  children,
}: {
  label: string;
  className?: string;
  delay?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl overflow-hidden border border-border/50 shadow bg-card relative animate-scale-in",
        delay,
        className
      )}
    >
      {label && (
        <div className="uppercase absolute top-2 left-2 z-10 tracking-wider text-[10px] text-muted-foreground bg-background/90 backdrop-blur-sm rounded px-2 py-1">
          {label}
        </div>
      )}
      {children}
    </div>
  );
}

export function Examples() {
  const [userLocation, setUserLocation] = useState<{
    longitude: number;
    latitude: number;
  } | null>(null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in delay-400">
      {/* Widget 1: Analytics */}
      <ExampleCard
        label=""
        className="aspect-square sm:col-span-2 sm:aspect-video lg:aspect-auto"
        delay="delay-400"
      >
        {/* Stats Panel */}
        <div className="absolute top-3 left-3 z-10 bg-background/95 backdrop-blur-md rounded-lg p-3 border border-border/50 shadow-lg">
          <div className="tracking-wider text-[10px] text-muted-foreground uppercase mb-1">
            Active Users
          </div>
          <div className="text-2xl font-semibold leading-tight">2,847</div>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="size-3 text-emerald-500" />
            <span className="text-xs text-emerald-500">+12.5%</span>
            <span className="text-xs text-muted-foreground">vs last hour</span>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-3 left-3 z-10 bg-background/95 backdrop-blur-md rounded-lg px-3 py-2 border border-border/50 shadow-lg">
          <div className="flex items-center gap-4 text-[10px]">
            <div className="flex items-center gap-1.5">
              <div className="size-3 rounded-full bg-emerald-500" />
              <span className="text-muted-foreground">High</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-2 rounded-full bg-emerald-500" />
              <span className="text-muted-foreground">Medium</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-1.5 rounded-full bg-emerald-500" />
              <span className="text-muted-foreground">Low</span>
            </div>
          </div>
        </div>

        <Map center={[0, 30]} zoom={0.5}>
          {analyticsData.map((loc) => (
            <MapMarker key={loc.city} longitude={loc.lng} latitude={loc.lat}>
              <MarkerContent>
                <div className="relative flex items-center justify-center">
                  <div
                    className="absolute rounded-full bg-emerald-500/20"
                    style={{
                      width: loc.size * 2.5,
                      height: loc.size * 2.5,
                    }}
                  />
                  <div
                    className="absolute rounded-full bg-emerald-500/40 animate-ping"
                    style={{
                      width: loc.size * 1.5,
                      height: loc.size * 1.5,
                      animationDuration: "2s",
                    }}
                  />
                  <div
                    className="relative rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"
                    style={{ width: loc.size, height: loc.size }}
                  />
                </div>
              </MarkerContent>
              <MarkerTooltip>
                <div className="text-center">
                  <div className="font-medium">{loc.city}</div>
                  <div className="text-emerald-500 font-semibold">
                    {loc.users}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    active users
                  </div>
                </div>
              </MarkerTooltip>
            </MapMarker>
          ))}
        </Map>
      </ExampleCard>

      {/* Widget 2: Delivery */}
      <ExampleCard label="Delivery" className="aspect-square" delay="delay-500">
        <Map center={[-0.1076, 51.517]} zoom={12}>
          <MapRoute
            coordinates={[
              [-0.1276, 51.5074],
              [-0.12, 51.512],
              [-0.105, 51.518],
              [-0.095, 51.522],
              [-0.0876, 51.5274],
            ]}
            width={4}
            color="#4285F4"
          />
          <MapMarker longitude={-0.1276} latitude={51.5074}>
            <MarkerContent>
              <div className="size-3.5 rounded-full bg-blue-500 border-2 border-white shadow-lg" />
              <MarkerLabel>Store</MarkerLabel>
            </MarkerContent>
          </MapMarker>
          <MapMarker longitude={-0.105} latitude={51.518}>
            <MarkerContent>
              <div className="bg-blue-500 rounded-full p-1.5 shadow-lg">
                <Truck className="size-3 text-white" />
              </div>
            </MarkerContent>
            <MarkerTooltip>On the way</MarkerTooltip>
          </MapMarker>
          <MapMarker longitude={-0.0876} latitude={51.5274}>
            <MarkerContent>
              <div className="size-3.5 rounded-full bg-blue-500 border-2 border-white shadow-lg" />
              <MarkerLabel>Home</MarkerLabel>
            </MarkerContent>
          </MapMarker>
        </Map>
      </ExampleCard>

      {/* Widget 3: Trending */}
      <ExampleCard label="Trending" className="aspect-square" delay="delay-600">
        <Map center={[-73.99, 40.735]} zoom={9.5}>
          <MapMarker longitude={-73.9857} latitude={40.7484}>
            <MarkerContent>
              <div className="relative flex items-center justify-center">
                <div className="absolute size-12 rounded-full bg-orange-500/30" />
                <div className="absolute size-7 rounded-full bg-orange-500/40" />
                <div className="bg-linear-to-br from-orange-500 to-red-500 rounded-full p-1.5 shadow-lg shadow-orange-500/50">
                  <Flame className="size-3.5 text-white" />
                </div>
              </div>
            </MarkerContent>
            <MarkerTooltip>
              <div className="text-center">
                <div className="font-medium">Times Square</div>
                <div className="flex items-center justify-center gap-1 text-muted-foreground">
                  <TrendingUp className="size-3 text-green-500" />
                  <span className="text-xs text-green-500">2.4k visitors</span>
                </div>
              </div>
            </MarkerTooltip>
          </MapMarker>
          <MapMarker longitude={-73.9654} latitude={40.7829}>
            <MarkerContent>
              <div className="relative flex items-center justify-center">
                <div className="absolute size-10 rounded-full bg-rose-500/30" />
                <div className="bg-linear-to-br from-rose-500 to-pink-500 rounded-full p-1.5 shadow-lg shadow-rose-500/50">
                  <Flame className="size-3 text-white" />
                </div>
              </div>
            </MarkerContent>
            <MarkerTooltip>
              <div className="text-center">
                <div className="font-medium">Central Park</div>
                <div className="flex items-center justify-center gap-1 text-muted-foreground">
                  <TrendingUp className="size-3 text-green-500" />
                  <span className="text-xs text-green-500">1.8k visitors</span>
                </div>
              </div>
            </MarkerTooltip>
          </MapMarker>
          <MapMarker longitude={-74.0445} latitude={40.6892}>
            <MarkerContent>
              <div className="relative flex items-center justify-center">
                <div className="absolute size-8 rounded-full bg-amber-500/30" />
                <div className="bg-linear-to-br from-amber-500 to-yellow-500 rounded-full p-1 shadow-lg shadow-amber-500/50">
                  <Flame className="size-2.5 text-white" />
                </div>
              </div>
            </MarkerContent>
            <MarkerTooltip>
              <div className="text-center">
                <div className="font-medium">Statue of Liberty</div>
                <div className="flex items-center justify-center gap-1 text-muted-foreground">
                  <TrendingUp className="size-3 text-green-500" />
                  <span className="text-xs text-green-500">890 visitors</span>
                </div>
              </div>
            </MarkerTooltip>
          </MapMarker>
        </Map>
      </ExampleCard>

      {/* Widget 4: EV Charging */}
      <ExampleCard
        label="EV Charging"
        className="aspect-square"
        delay="delay-700"
      >
        <Map center={[-122.425, 37.777]} zoom={11.5}>
          <MapMarker longitude={-122.4194} latitude={37.7749}>
            <MarkerContent>
              <div className="bg-emerald-500 rounded-full p-1.5 shadow-lg shadow-emerald-500/30">
                <Zap className="size-3 text-white fill-white" />
              </div>
            </MarkerContent>
            <MarkerTooltip>
              <div className="text-xs space-y-0.5">
                <div className="font-medium">Market St Station</div>
                <div className="flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  <span className="text-emerald-500">Available</span>
                </div>
                <div className="text-muted-foreground">150 kW • $0.35/kWh</div>
              </div>
            </MarkerTooltip>
          </MapMarker>

          <MapMarker longitude={-122.4094} latitude={37.7849}>
            <MarkerContent>
              <div className="bg-emerald-500 rounded-full p-1.5 shadow-lg shadow-emerald-500/30">
                <Zap className="size-3 text-white fill-white" />
              </div>
            </MarkerContent>
            <MarkerTooltip>
              <div className="text-xs space-y-0.5">
                <div className="font-medium">Union Square</div>
                <div className="flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  <span className="text-emerald-500">2 Available</span>
                </div>
                <div className="text-muted-foreground">50 kW • $0.28/kWh</div>
              </div>
            </MarkerTooltip>
          </MapMarker>

          <MapMarker longitude={-122.4294} latitude={37.7689}>
            <MarkerContent>
              <div className="bg-amber-500 rounded-full p-1.5 shadow-lg shadow-amber-500/30">
                <Zap className="size-3 text-white fill-white" />
              </div>
            </MarkerContent>
            <MarkerTooltip>
              <div className="text-xs space-y-0.5">
                <div className="font-medium">Castro Station</div>
                <div className="flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-amber-500" />
                  <span className="text-amber-500">In Use</span>
                </div>
                <div className="text-muted-foreground">~15 min remaining</div>
              </div>
            </MarkerTooltip>
          </MapMarker>

          <MapMarker longitude={-122.4394} latitude={37.7809}>
            <MarkerContent>
              <div className="bg-zinc-400 rounded-full p-1.5 shadow-lg">
                <Zap className="size-3 text-white fill-white" />
              </div>
            </MarkerContent>
            <MarkerTooltip>
              <div className="text-xs space-y-0.5">
                <div className="font-medium">Hayes Valley</div>
                <div className="flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-zinc-400" />
                  <span className="text-muted-foreground">Offline</span>
                </div>
              </div>
            </MarkerTooltip>
          </MapMarker>
        </Map>
      </ExampleCard>

      {/* Widget 5: Locate Me */}
      <ExampleCard
        label="Locate Me"
        className="aspect-square"
        delay="delay-800"
      >
        <Map center={[77.5946, 12.9716]} zoom={10.5}>
          <MapControls showZoom={false} showLocate onLocate={setUserLocation} />
          {userLocation && (
            <MapMarker
              longitude={userLocation.longitude}
              latitude={userLocation.latitude}
            >
              <MarkerContent>
                <div className="relative flex items-center justify-center">
                  <div className="absolute size-5 rounded-full bg-blue-500/30 animate-ping" />
                  <div className="size-3 rounded-full bg-blue-500 border-2 border-white shadow-lg" />
                </div>
              </MarkerContent>
              <MarkerTooltip>Your Location</MarkerTooltip>
            </MapMarker>
          )}
        </Map>
      </ExampleCard>
    </div>
  );
}
