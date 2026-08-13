import { useState } from "react";
import { View } from "react-native";

import { CodeBlock } from "../../CodeBlock";

import { WebMapPreviewPlaceholder } from "@/atoms/WebMapPreviewPlaceholder";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

interface ComponentPreviewClientProps {
  children: React.ReactNode;
  code: string;
  className?: string;
  previewImage?: string;
  previewImageDark?: string;
}

export function ComponentPreviewClient({
  code,
  className,
  previewImage,
  previewImageDark,
}: ComponentPreviewClientProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View className="gap-4">
      <WebMapPreviewPlaceholder
        previewImage={previewImage}
        previewImageDark={previewImageDark}
        layout="aside"
        className={className}
      />

      <View className="relative w-full overflow-hidden">
        <View className={cn(!expanded && "max-h-42 overflow-hidden")}>
          <CodeBlock code={code} />
        </View>
        {!expanded ? (
          <View className="from-surface to-surface/0 absolute inset-x-0 bottom-0 w-full items-center justify-center bg-linear-to-t pt-16 pb-6">
            <Button
              variant="outline"
              size="sm"
              onPress={() => {
                setExpanded(true);
              }}
              accessibilityLabel="View code"
              className="bg-background dark:bg-background"
            >
              <Text>View Code</Text>
            </Button>
          </View>
        ) : null}
      </View>
    </View>
  );
}
