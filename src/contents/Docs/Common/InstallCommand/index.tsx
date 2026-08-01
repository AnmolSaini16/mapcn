import { Check, Copy } from "lucide-react-native";
import { useCallback, useState } from "react";
import { ScrollView, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";
import { copyText } from "@/lib/clipboard";
import { trackEvent } from "@/lib/events";

interface InstallCommandProps {
  name: string;
}

const PACKAGE_MANAGERS = [
  { manager: "pnpm", exec: "pnpm dlx" },
  { manager: "npm", exec: "npx" },
  { manager: "yarn", exec: "yarn dlx" },
  { manager: "bun", exec: "bunx --bun" },
] as const;

export function InstallCommand({ name }: InstallCommandProps) {
  const tabs = PACKAGE_MANAGERS.map(({ manager, exec }) => ({
    manager,
    command: `${exec} shadcn@latest add ${name}`,
  }));

  const [active, setActive] = useState<string>(tabs[0].manager);
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    const manager = PACKAGE_MANAGERS.find((item) => item.manager === active);
    if (!manager) {
      return;
    }

    const command = `${manager.exec} shadcn@latest add ${name}`;

    try {
      await copyText(command);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
      trackEvent({
        name: "copy_install_command",
        properties: { name, packageManager: active },
      });
    } catch (error) {
      console.error("Failed to copy install command:", error);
    }
  }, [active, name]);

  return (
    <View className="bg-surface relative w-full overflow-hidden rounded-lg">
      <Tabs
        value={active}
        onValueChange={setActive}
        className="gap-0"
      >
        <View className="flex-row items-center justify-between border-b border-border pr-2 pl-2">
          <TabsList className="h-9 rounded-none bg-transparent p-0">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.manager}
                value={tab.manager}
                className={`rounded-none border-b-2 border-b-transparent bg-transparent font-mono text-xs shadow-none ${
                  tab.manager === active ? "border-b-foreground" : ""
                }`}
              >
                <Text className="font-mono text-xs">{tab.manager}</Text>
              </TabsTrigger>
            ))}
          </TabsList>
          <Button
            variant="ghost"
            size="icon"
            onPress={() => {
              void copy();
            }}
            accessibilityLabel={copied ? "Copied" : "Copy command"}
            className="h-9 w-9 text-muted-foreground"
          >
            <Icon
              as={copied ? Check : Copy}
              size={14}
            />
          </Button>
        </View>
        {tabs.map((tab) => (
          <TabsContent
            key={tab.manager}
            value={tab.manager}
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="p-4"
            >
              <Text className="font-mono text-sm">{tab.command}</Text>
            </ScrollView>
          </TabsContent>
        ))}
      </Tabs>
    </View>
  );
}
