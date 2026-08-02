import { useEffect, useRef, useState } from "react";
import { View } from "react-native";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Text } from "@/components/ui/text";
import { Map, useMap } from "@/registry/map";

const styles = {
  default: undefined,
  openstreetmap: "https://tiles.openfreemap.org/styles/bright",
  openstreetmap3d: "https://tiles.openfreemap.org/styles/liberty",
} as const;

type StyleKey = keyof typeof styles;

const STYLE_OPTIONS: { value: StyleKey; label: string }[] = [
  { value: "default", label: "Default (Carto)" },
  { value: "openstreetmap", label: "OpenStreetMap" },
  { value: "openstreetmap3d", label: "OpenStreetMap 3D" },
];

function PitchAnimator({ is3D }: { is3D: boolean }) {
  const { camera, viewport } = useMap();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    camera?.easeTo({
      center: viewport.center,
      zoom: viewport.zoom,
      bearing: viewport.bearing,
      pitch: is3D ? 60 : 0,
      duration: 500,
    });
  }, [camera, is3D, viewport.bearing, viewport.center, viewport.zoom]);

  return null;
}

export function CustomStyleExample() {
  const [style, setStyle] = useState<StyleKey>("default");
  const selectedStyle = styles[style];
  const is3D = style === "openstreetmap3d";
  const selectedLabel =
    STYLE_OPTIONS.find((option) => option.value === style)?.label ??
    "Default (Carto)";

  return (
    <View className="relative h-full w-full">
      <Map
        viewport={{
          center: [-0.1276, 51.5074],
          zoom: 15,
          bearing: 0,
          pitch: 0,
        }}
        styles={
          selectedStyle
            ? { light: selectedStyle, dark: selectedStyle }
            : undefined
        }
        style={{ flex: 1 }}
      >
        <PitchAnimator is3D={is3D} />
      </Map>
      <View className="absolute top-2 right-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="bg-background shadow-sm"
            >
              <Text>{selectedLabel}</Text>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup
              value={style}
              onValueChange={(value) => {
                setStyle(value as StyleKey);
              }}
            >
              {STYLE_OPTIONS.map((option) => (
                <DropdownMenuRadioItem
                  key={option.value}
                  value={option.value}
                >
                  <Text>{option.label}</Text>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </View>
    </View>
  );
}
