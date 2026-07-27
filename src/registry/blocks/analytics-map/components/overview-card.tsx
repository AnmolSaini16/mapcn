"use client";

import { TrendingUp } from "lucide-react-native";
import { Area, AreaChart, Pie, PieChart } from "recharts";

import {
  deviceCategoryChartConfig,
  deviceCategoryData,
  usersPerDay,
  usersPerDayChartConfig,
} from "../data";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";

function MetricChart() {
  return (
    <ChartContainer
      config={usersPerDayChartConfig}
      className="aspect-auto h-14 w-full"
    >
      <AreaChart data={usersPerDay}>
        <defs>
          <linearGradient
            id="usersGradient"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="var(--color-users)"
              stopOpacity={0.4}
            />
            <stop
              offset="100%"
              stopColor="var(--color-users)"
              stopOpacity={0}
            />
          </linearGradient>
        </defs>

        <Area
          type="natural"
          dataKey="users"
          stroke="var(--color-users)"
          strokeWidth={1.5}
          fill="url(#usersGradient)"
        />
      </AreaChart>
    </ChartContainer>
  );
}

export function OverviewCard() {
  return (
    <Card className="bg-card/80 absolute top-4 left-4 z-10 w-60 gap-1 backdrop-blur-sm">
      <CardHeader>
        <div>
          <p className="text-muted-foreground pb-2 text-[10px] tracking-wider uppercase">
            Users in last 30 days
          </p>
          <p className="text-3xl leading-none font-semibold">17,234</p>
        </div>
      </CardHeader>

      <CardContent>
        <MetricChart />
        <div className="mt-2 flex items-center gap-1.5 text-xs">
          <TrendingUp className="text-foreground size-3" />
          <span className="text-foreground font-medium">+12.5%</span>
          <span className="text-muted-foreground">vs previous 30 days</span>
        </div>

        <div className="border-border/60 mt-4 border-t pt-4">
          <p className="text-muted-foreground text-[10px] tracking-wider uppercase">
            Device category in last 30 days
          </p>

          <ChartContainer
            config={deviceCategoryChartConfig}
            className="mx-auto mt-3 aspect-square h-32 w-32"
          >
            <PieChart>
              <Pie
                data={deviceCategoryData}
                dataKey="value"
                nameKey="name"
                innerRadius={32}
                outerRadius={52}
                strokeWidth={2}
              />
            </PieChart>
          </ChartContainer>

          <div className="mt-3 grid grid-cols-3 gap-2">
            {deviceCategoryData.map((device) => (
              <div
                key={device.name}
                className="text-center"
              >
                <p className="text-muted-foreground flex items-center justify-center gap-1.5 text-[10px] tracking-wide uppercase">
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: device.fill }}
                  />
                  {device.name}
                </p>
                <p className="text-foreground mt-1 leading-none font-medium tabular-nums">
                  {device.value}%
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
