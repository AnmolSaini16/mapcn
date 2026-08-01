import { TrendingUp } from "lucide-react-native";
import { useId } from "react";
import { useColorScheme, View } from "react-native";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";

import { buildAreaPaths, buildDonutSlices } from "../chart-geometry";
import { deviceCategoryData, usersPerDay } from "../data";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

const AREA_STROKE = {
  light: "#737373",
  dark: "#8a8a8a",
} as const;

function MetricChart({ color }: { color: string }) {
  const gradientId = useId().replace(/:/g, "");
  const width = 200;
  const height = 56;
  const { line, area } = buildAreaPaths(
    usersPerDay.map((day) => day.users),
    width,
    height,
  );

  return (
    <View className="h-14 w-full">
      <Svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${String(width)} ${String(height)}`}
        preserveAspectRatio="none"
      >
        <Defs>
          <LinearGradient
            id={gradientId}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <Stop
              offset="0%"
              stopColor={color}
              stopOpacity={0.4}
            />
            <Stop
              offset="100%"
              stopColor={color}
              stopOpacity={0}
            />
          </LinearGradient>
        </Defs>
        <Path
          d={area}
          fill={`url(#${gradientId})`}
        />
        <Path
          d={line}
          stroke={color}
          strokeWidth={1.5}
          fill="none"
        />
      </Svg>
    </View>
  );
}

function DeviceCategoryChart() {
  const size = 128;
  const paths = buildDonutSlices(
    deviceCategoryData.map((device) => device.value),
    size / 2,
    size / 2,
    32,
    52,
  );

  return (
    <View className="mx-auto mt-3 h-32 w-32">
      <Svg
        width={size}
        height={size}
        viewBox={`0 0 ${String(size)} ${String(size)}`}
      >
        {deviceCategoryData.map((device, index) => (
          <Path
            key={device.name}
            d={paths[index]}
            fill={device.fill}
            strokeWidth={2}
          />
        ))}
      </Svg>
    </View>
  );
}

export function OverviewCard() {
  const colorScheme = useColorScheme() === "dark" ? "dark" : "light";

  return (
    <Card className="bg-card/80 absolute top-4 left-4 z-10 w-60 gap-1">
      <CardHeader>
        <View>
          <Text className="text-muted-foreground pb-2 text-[10px] tracking-wider uppercase">
            Users in last 30 days
          </Text>
          <Text className="text-3xl leading-none font-semibold">17,234</Text>
        </View>
      </CardHeader>

      <CardContent>
        <MetricChart color={AREA_STROKE[colorScheme]} />
        <View className="mt-2 flex-row items-center gap-1.5">
          <Icon
            as={TrendingUp}
            size={12}
            className="text-foreground"
          />
          <Text className="text-foreground text-xs font-medium">+12.5%</Text>
          <Text className="text-muted-foreground text-xs">
            vs previous 30 days
          </Text>
        </View>

        <View className="border-border/60 mt-4 border-t pt-4">
          <Text className="text-muted-foreground text-[10px] tracking-wider uppercase">
            Device category in last 30 days
          </Text>

          <DeviceCategoryChart />

          <View className="mt-3 flex-row gap-2">
            {deviceCategoryData.map((device) => (
              <View
                key={device.name}
                className="flex-1 items-center"
              >
                <View className="flex-row items-center justify-center gap-1.5">
                  <View
                    className="size-2 rounded-full"
                    style={{ backgroundColor: device.fill }}
                  />
                  <Text className="text-muted-foreground text-[10px] tracking-wide uppercase">
                    {device.name}
                  </Text>
                </View>
                <Text className="text-foreground mt-1 leading-none font-medium tabular-nums">
                  {device.value}%
                </Text>
              </View>
            ))}
          </View>
        </View>
      </CardContent>
    </Card>
  );
}
