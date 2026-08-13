import { PropsWithChildren } from "react";
import { View } from "react-native";

import { cn } from "@/lib/utils";

type ExampleCardProps = {
  className?: string;
  previewImage?: string;
};

export function ExampleCard({
  className,
  children,
}: PropsWithChildren<ExampleCardProps>) {
  return (
    <View
      className={cn(
        "bg-card border-border relative w-full overflow-hidden rounded-xl border shadow-sm",
        className,
      )}
    >
      {children}
    </View>
  );
}
