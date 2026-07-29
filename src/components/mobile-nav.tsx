import * as DialogPrimitive from "@rn-primitives/dialog";
import { type Href, useRouter } from "expo-router";
import { Menu, X } from "lucide-react-native";
import { useState } from "react";
import { Platform, Pressable, ScrollView, View } from "react-native";
import {
  FadeIn,
  FadeOut,
  ReduceMotion,
  SlideInLeft,
  SlideOutLeft,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens";

import { Logo } from "./logo";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { NativeOnlyAnimatedView } from "@/components/ui/native-only-animated-view";
import { Text } from "@/components/ui/text";
import { siteNavigation } from "@/lib/site-navigation";
import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const FullWindowOverlay = Platform.OS === "ios" ? RNFullWindowOverlay : View;

function MobileNavSheet({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <DialogPortal>
      <FullWindowOverlay className="absolute inset-0">
        <NativeOnlyAnimatedView
          entering={FadeIn.duration(200).reduceMotion(ReduceMotion.System)}
          exiting={FadeOut.duration(150).reduceMotion(ReduceMotion.System)}
          className="absolute inset-0 flex-row bg-black/50"
        >
          <DialogPrimitive.Content
            className={cn(
              "bg-background border-border h-full w-3/4 max-w-sm border-r shadow-lg shadow-black/5",
              Platform.select({
                web: "animate-in slide-in-from-left duration-300",
              }),
            )}
          >
            <NativeOnlyAnimatedView
              entering={SlideInLeft.duration(250).reduceMotion(
                ReduceMotion.System,
              )}
              exiting={SlideOutLeft.duration(200).reduceMotion(
                ReduceMotion.System,
              )}
              className="flex-1"
            >
              <View
                className="flex-1"
                style={{
                  paddingTop: insets.top,
                  paddingBottom: insets.bottom,
                  paddingLeft: insets.left,
                }}
              >
                <View className="flex-row items-center justify-between p-4">
                  <DialogPrimitive.Title asChild>
                    <View>
                      <Logo isLink={false} />
                    </View>
                  </DialogPrimitive.Title>
                  <DialogClose asChild>
                    <Pressable
                      className="rounded-md p-2 opacity-70 active:opacity-100"
                      hitSlop={12}
                      accessibilityLabel="Close menu"
                    >
                      <Icon
                        as={X}
                        size={16}
                      />
                    </Pressable>
                  </DialogClose>
                </View>

                <ScrollView
                  className="px-2"
                  contentContainerClassName="gap-6 pb-4"
                  showsVerticalScrollIndicator={false}
                >
                  {siteNavigation.map((group) => (
                    <View key={group.title}>
                      <Text className="text-muted-foreground mb-2 px-2 text-sm font-medium">
                        {group.title}
                      </Text>
                      <View>
                        {group.items.map((item) => (
                          <Pressable
                            key={item.title}
                            className="active:bg-accent flex-row items-center rounded-md px-3 py-2"
                            onPress={() => {
                              onClose();
                              router.push(item.href as Href);
                            }}
                          >
                            <Text className="text-lg">{item.title}</Text>
                          </Pressable>
                        ))}
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </NativeOnlyAnimatedView>
          </DialogPrimitive.Content>

          <Pressable
            className="flex-1"
            onPress={onClose}
            accessibilityLabel="Close menu"
          />
        </NativeOnlyAnimatedView>
      </FullWindowOverlay>
    </DialogPortal>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <Button
        variant="ghost"
        size="icon"
        accessibilityLabel="Open docs menu"
        className="shrink-0"
        onPress={() => {
          setOpen(true);
        }}
      >
        <Icon
          as={Menu}
          size={20}
        />
      </Button>

      <MobileNavSheet onClose={closeMenu} />
    </Dialog>
  );
}
