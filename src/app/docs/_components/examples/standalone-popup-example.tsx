"use client";

import { useState } from "react";
import { Map, MapPopup } from "@/registry/map-gl";
import { Button } from "@/components/ui/button";

export function StandalonePopupExample() {
  const [showPopup, setShowPopup] = useState(true);

  return (
    <div className="h-[400px] w-full relative">
      <Map
        initialViewState={{ longitude: -74.006, latitude: 40.7128, zoom: 13 }}
      >
        {showPopup && (
          <MapPopup
            longitude={-74.006}
            latitude={40.7128}
            onClose={() => setShowPopup(false)}
            closeButton
            focusAfterOpen={false}
            closeOnClick={false}
            className="w-62"
          >
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">New York City</h3>
              <p className="text-sm text-muted-foreground">
                The city that never sleeps. Population: 8.3 million
              </p>
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={() => setShowPopup(false)}
              >
                Close
              </Button>
            </div>
          </MapPopup>
        )}
      </Map>

      {!showPopup && (
        <Button
          size="sm"
          className="absolute bottom-4 left-4 z-10"
          onClick={() => setShowPopup(true)}
        >
          Show Popup
        </Button>
      )}
    </div>
  );
}
