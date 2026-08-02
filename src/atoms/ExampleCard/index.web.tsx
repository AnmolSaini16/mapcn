import { PropsWithChildren } from "react";
import { View } from "react-native";

import { WebMapPreviewPlaceholder } from "@/atoms/WebMapPreviewPlaceholder";
import { cn } from "@/lib/utils";

type ExampleCardProps = {
  className?: string;
};

export function ExampleCard({
  className,
}: PropsWithChildren<ExampleCardProps>) {
  return (
    <View
      className={cn(
        "bg-card border-border/50 relative w-full overflow-hidden rounded-xl border shadow-sm",
        className,
      )}
    >
      <WebMapPreviewPlaceholder className="absolute inset-0" />
    </View>
  );
}
