/* eslint-disable max-lines */
import * as DialogPrimitive from "@rn-primitives/dialog";
import { Slot } from "@rn-primitives/slot";
import { cva, type VariantProps } from "class-variance-authority";
import { PanelLeftIcon } from "lucide-react-native";
import * as React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  View,
  type DimensionValue,
  type ViewStyle,
} from "react-native";
import {
  FadeIn,
  FadeOut,
  ReduceMotion,
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { NativeOnlyAnimatedView } from "@/components/ui/native-only-animated-view";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = 256;
const SIDEBAR_WIDTH_MOBILE = 288;
const SIDEBAR_WIDTH_ICON = 48;
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

const FullWindowOverlay = Platform.OS === "ios" ? RNFullWindowOverlay : View;

type SidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<typeof View> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const isMobileBreakpoint = useIsMobile();
  const isMobile = Platform.OS !== "web" || isMobileBreakpoint;
  const [openMobile, setOpenMobile] = React.useState(false);

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }

      // This sets the cookie to keep the sidebar state.
      if (Platform.OS === "web" && typeof document !== "undefined") {
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${String(openState)}; path=/; max-age=${String(SIDEBAR_COOKIE_MAX_AGE)}`;
      }
    },
    [setOpenProp, open],
  );

  // Helper to toggle the sidebar.
  const toggleSidebar = React.useCallback(() => {
    if (isMobile) {
      setOpenMobile((open) => !open);
    } else {
      setOpen((open) => !open);
    }
  }, [isMobile, setOpen, setOpenMobile]);

  // Adds a keyboard shortcut to toggle the sidebar.
  React.useEffect(() => {
    if (Platform.OS !== "web") {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [toggleSidebar]);

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = open ? "expanded" : "collapsed";

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <View
        data-slot="sidebar-wrapper"
        style={[
          Platform.select({
            web: {
              ["--sidebar-width" as string]: `${String(SIDEBAR_WIDTH)}px`,
              ["--sidebar-width-icon" as string]: `${String(SIDEBAR_WIDTH_ICON)}px`,
            } as ViewStyle,
          }),
          style,
        ]}
        className={cn(
          "group/sidebar-wrapper flex min-h-svh w-full flex-row",
          Platform.select({
            web: "has-data-[variant=inset]:bg-sidebar",
          }),
          className,
        )}
        {...props}
      >
        {children}
      </View>
    </SidebarContext.Provider>
  );
}

function SidebarMobileSheet({
  side,
  children,
}: {
  side: "left" | "right";
  children: React.ReactNode;
}) {
  const { openMobile, setOpenMobile } = useSidebar();
  const insets = useSafeAreaInsets();
  const isLeft = side === "left";

  return (
    <DialogPrimitive.Root
      open={openMobile}
      onOpenChange={setOpenMobile}
    >
      <DialogPrimitive.Portal>
        <FullWindowOverlay className="absolute inset-0">
          <NativeOnlyAnimatedView
            entering={FadeIn.duration(200).reduceMotion(ReduceMotion.System)}
            exiting={FadeOut.duration(150).reduceMotion(ReduceMotion.System)}
            className={cn(
              "absolute inset-0 flex-row bg-black/50",
              !isLeft && "flex-row-reverse",
            )}
          >
            <DialogPrimitive.Content
              data-sidebar="sidebar"
              data-slot="sidebar"
              data-mobile="true"
              className={cn(
                "bg-sidebar h-full border-sidebar-border shadow-lg shadow-black/5",
                isLeft ? "border-r" : "border-l",
                Platform.select({
                  web: cn(
                    "animate-in duration-300",
                    isLeft ? "slide-in-from-left" : "slide-in-from-right",
                  ),
                }),
              )}
              style={{ width: SIDEBAR_WIDTH_MOBILE }}
            >
              <NativeOnlyAnimatedView
                entering={(isLeft ? SlideInLeft : SlideInRight)
                  .duration(250)
                  .reduceMotion(ReduceMotion.System)}
                exiting={(isLeft ? SlideOutLeft : SlideOutRight)
                  .duration(200)
                  .reduceMotion(ReduceMotion.System)}
                className="flex-1"
              >
                <View
                  className="flex h-full w-full flex-col"
                  style={{
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                    paddingLeft: isLeft ? insets.left : 0,
                    paddingRight: isLeft ? 0 : insets.right,
                  }}
                >
                  <DialogPrimitive.Title className="sr-only">
                    Sidebar
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Description className="sr-only">
                    Displays the mobile sidebar.
                  </DialogPrimitive.Description>
                  {children}
                </View>
              </NativeOnlyAnimatedView>
            </DialogPrimitive.Content>

            <Pressable
              className="flex-1"
              onPress={() => {
                setOpenMobile(false);
              }}
              accessibilityLabel="Close sidebar"
            />
          </NativeOnlyAnimatedView>
        </FullWindowOverlay>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  style,
  children,
  ...props
}: React.ComponentProps<typeof View> & {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
}) {
  const { isMobile, state } = useSidebar();

  if (collapsible === "none") {
    return (
      <View
        data-slot="sidebar"
        className={cn(
          "bg-sidebar flex h-full flex-col text-sidebar-foreground",
          className,
        )}
        style={[{ width: SIDEBAR_WIDTH }, style]}
        {...props}
      >
        {children}
      </View>
    );
  }

  if (isMobile) {
    return <SidebarMobileSheet side={side}>{children}</SidebarMobileSheet>;
  }

  return (
    <View
      className={cn(
        "group peer text-sidebar-foreground",
        Platform.select({
          web: "hidden md:flex",
          native: "flex",
        }),
      )}
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
    >
      {/* This is what handles the sidebar gap on desktop */}
      <View
        data-slot="sidebar-gap"
        className={cn(
          "relative bg-transparent",
          Platform.select({
            web: "w-(--sidebar-width) transition-[width] duration-200 ease-linear group-data-[collapsible=offcanvas]:w-0 group-data-[side=right]:rotate-180",
          }),
          variant === "floating" || variant === "inset"
            ? Platform.select({
                web: "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]",
              })
            : Platform.select({
                web: "group-data-[collapsible=icon]:w-(--sidebar-width-icon)",
              }),
        )}
        style={
          state === "collapsed" && collapsible === "offcanvas"
            ? { width: 0 }
            : state === "collapsed" && collapsible === "icon"
              ? {
                  width:
                    variant === "floating" || variant === "inset"
                      ? SIDEBAR_WIDTH_ICON + 16
                      : SIDEBAR_WIDTH_ICON,
                }
              : { width: SIDEBAR_WIDTH }
        }
      />
      <View
        data-slot="sidebar-container"
        className={cn(
          "z-10 h-svh",
          Platform.select({
            web: cn(
              "fixed inset-y-0 hidden w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",
              side === "left"
                ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
                : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
              variant === "floating" || variant === "inset"
                ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]"
                : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
            ),
            native: cn(
              "absolute inset-y-0 flex",
              side === "left" ? "left-0" : "right-0",
              (variant === "floating" || variant === "inset") && "p-2",
              variant !== "floating" &&
                variant !== "inset" &&
                (side === "left" ? "border-r" : "border-l"),
            ),
          }),
          className,
        )}
        style={{
          width:
            state === "collapsed" && collapsible === "icon"
              ? variant === "floating" || variant === "inset"
                ? SIDEBAR_WIDTH_ICON + 18
                : SIDEBAR_WIDTH_ICON
              : SIDEBAR_WIDTH,
          ...(state === "collapsed" && collapsible === "offcanvas"
            ? side === "left"
              ? { left: -SIDEBAR_WIDTH }
              : { right: -SIDEBAR_WIDTH }
            : null),
        }}
        {...props}
      >
        <View
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          className={cn(
            "bg-sidebar flex h-full w-full flex-col",
            Platform.select({
              web: "group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow-sm",
              native:
                variant === "floating"
                  ? "rounded-lg border border-sidebar-border shadow-sm"
                  : undefined,
            }),
          )}
        >
          {children}
        </View>
      </View>
    </View>
  );
}

function SidebarTrigger({
  className,
  onPress,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      className={cn("size-7", className)}
      onPress={(event) => {
        onPress?.(event);
        toggleSidebar();
      }}
      accessibilityLabel="Toggle Sidebar"
      {...props}
    >
      <Icon
        as={PanelLeftIcon}
        size={16}
      />
      <Text className="sr-only">Toggle Sidebar</Text>
    </Button>
  );
}

function SidebarRail({
  className,
  ...props
}: React.ComponentProps<typeof Pressable>) {
  const { toggleSidebar } = useSidebar();

  return (
    <Pressable
      data-sidebar="rail"
      data-slot="sidebar-rail"
      accessibilityLabel="Toggle Sidebar"
      tabIndex={-1}
      onPress={toggleSidebar}
      className={cn(
        "absolute inset-y-0 z-20 w-4",
        Platform.select({
          web: cn(
            "hidden -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border sm:flex",
            "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
            "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
            "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full hover:group-data-[collapsible=offcanvas]:bg-sidebar",
            "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
            "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
          ),
          native: "hidden",
        }),
        className,
      )}
      {...props}
    />
  );
}

function SidebarInset({
  className,
  ...props
}: React.ComponentProps<typeof View>) {
  return (
    <View
      data-slot="sidebar-inset"
      className={cn(
        "bg-background relative flex w-full flex-1 flex-col",
        Platform.select({
          web: "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2",
        }),
        className,
      )}
      {...props}
    />
  );
}

function SidebarInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      data-slot="sidebar-input"
      data-sidebar="input"
      className={cn("bg-background h-8 w-full shadow-none", className)}
      {...props}
    />
  );
}

function SidebarHeader({
  className,
  ...props
}: React.ComponentProps<typeof View>) {
  return (
    <View
      data-slot="sidebar-header"
      data-sidebar="header"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  );
}

function SidebarFooter({
  className,
  ...props
}: React.ComponentProps<typeof View>) {
  return (
    <View
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  );
}

function SidebarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="sidebar-separator"
      data-sidebar="separator"
      className={cn("bg-sidebar-border mx-2 w-auto", className)}
      {...props}
    />
  );
}

function SidebarContent({
  className,
  contentContainerClassName,
  ...props
}: React.ComponentProps<typeof ScrollView>) {
  return (
    <ScrollView
      data-slot="sidebar-content"
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1",
        Platform.select({
          web: "overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        }),
        className,
      )}
      contentContainerClassName={cn(
        "flex flex-col gap-2",
        contentContainerClassName,
      )}
      showsVerticalScrollIndicator={false}
      {...props}
    />
  );
}

function SidebarGroup({
  className,
  ...props
}: React.ComponentProps<typeof View>) {
  return (
    <View
      data-slot="sidebar-group"
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
      {...props}
    />
  );
}

function SidebarGroupLabel({
  className,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<typeof View> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : View;
  const content =
    typeof children === "string" || typeof children === "number" ? (
      <Text className="text-sidebar-foreground/70 text-xs font-medium">
        {children}
      </Text>
    ) : (
      children
    );

  return (
    <Comp
      data-slot="sidebar-group-label"
      data-sidebar="group-label"
      className={cn(
        "flex h-8 shrink-0 flex-row items-center rounded-md px-2",
        Platform.select({
          web: "text-sidebar-foreground/70 ring-sidebar-ring outline-hidden text-xs font-medium transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0 group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        }),
        className,
      )}
      {...props}
    >
      {content}
    </Comp>
  );
}

function SidebarGroupAction({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<typeof Pressable> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : Pressable;

  return (
    <Comp
      data-slot="sidebar-group-action"
      data-sidebar="group-action"
      className={cn(
        "text-sidebar-foreground absolute top-3.5 right-3 flex aspect-square w-5 flex-row items-center justify-center rounded-md p-0",
        Platform.select({
          web: "ring-sidebar-ring outline-hidden transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0 after:absolute after:-inset-2 md:after:hidden group-data-[collapsible=icon]:hidden",
          native: "active:bg-sidebar-accent",
        }),
        className,
      )}
      {...props}
    />
  );
}

function SidebarGroupContent({
  className,
  ...props
}: React.ComponentProps<typeof View>) {
  return (
    <View
      data-slot="sidebar-group-content"
      data-sidebar="group-content"
      className={cn("w-full text-sm", className)}
      {...props}
    />
  );
}

function SidebarMenu({
  className,
  ...props
}: React.ComponentProps<typeof View>) {
  return (
    <View
      data-slot="sidebar-menu"
      data-sidebar="menu"
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      role="list"
      {...props}
    />
  );
}

function SidebarMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof View>) {
  return (
    <View
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className={cn("group/menu-item relative", className)}
      role="listitem"
      {...props}
    />
  );
}

const sidebarMenuButtonVariants = cva(
  cn(
    "peer/menu-button flex w-full flex-row items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm",
    Platform.select({
      web: "ring-sidebar-ring outline-hidden transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
      native: "active:bg-sidebar-accent data-[active=true]:bg-sidebar-accent",
    }),
  ),
  {
    variants: {
      variant: {
        default: Platform.select({
          web: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          native: "",
        }),
        outline: cn(
          "bg-background",
          Platform.select({
            web: "shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
            native: "border-sidebar-border border",
          }),
        ),
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: cn(
          "h-12 text-sm",
          Platform.select({
            web: "group-data-[collapsible=icon]:p-0!",
          }),
        ),
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function SidebarMenuButton({
  asChild = false,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  ...props
}: React.ComponentProps<typeof Pressable> & {
  asChild?: boolean;
  isActive?: boolean;
  tooltip?: string | React.ComponentProps<typeof TooltipContent>;
} & VariantProps<typeof sidebarMenuButtonVariants>) {
  const Comp = asChild ? Slot : Pressable;
  const { isMobile, state } = useSidebar();

  const button = (
    <Comp
      data-slot="sidebar-menu-button"
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        sidebarMenuButtonVariants({ variant, size }),
        isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
        className,
      )}
      {...props}
    />
  );

  if (!tooltip) {
    return button;
  }

  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip,
    };
  }

  if (state !== "collapsed" || isMobile) {
    return button;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent
        side="right"
        {...tooltip}
      />
    </Tooltip>
  );
}

function SidebarMenuAction({
  className,
  asChild = false,
  showOnHover = false,
  ...props
}: React.ComponentProps<typeof Pressable> & {
  asChild?: boolean;
  showOnHover?: boolean;
}) {
  const Comp = asChild ? Slot : Pressable;

  return (
    <Comp
      data-slot="sidebar-menu-action"
      data-sidebar="menu-action"
      className={cn(
        "text-sidebar-foreground absolute top-1.5 right-1 flex aspect-square w-5 flex-row items-center justify-center rounded-md p-0",
        Platform.select({
          web: cn(
            "ring-sidebar-ring outline-hidden transition-transform peer-hover/menu-button:text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
            "after:absolute after:-inset-2 md:after:hidden",
            "peer-data-[size=sm]/menu-button:top-1",
            "peer-data-[size=default]/menu-button:top-1.5",
            "peer-data-[size=lg]/menu-button:top-2.5",
            "group-data-[collapsible=icon]:hidden",
            showOnHover &&
              "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground data-[state=open]:opacity-100 md:opacity-0",
          ),
          native: "active:bg-sidebar-accent",
        }),
        className,
      )}
      {...props}
    />
  );
}

function SidebarMenuBadge({
  className,
  ...props
}: React.ComponentProps<typeof View>) {
  return (
    <View
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      className={cn(
        "text-sidebar-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 flex-row items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none",
        Platform.select({
          web: cn(
            "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
            "peer-data-[size=sm]/menu-button:top-1",
            "peer-data-[size=default]/menu-button:top-1.5",
            "peer-data-[size=lg]/menu-button:top-2.5",
            "group-data-[collapsible=icon]:hidden",
          ),
        }),
        className,
      )}
      {...props}
    />
  );
}

function SidebarMenuSkeleton({
  className,
  showIcon = false,
  ...props
}: React.ComponentProps<typeof View> & {
  showIcon?: boolean;
}) {
  // Random width between 50 to 90%.
  const [width] = React.useState(
    () => `${String(Math.floor(Math.random() * 40) + 50)}%` as DimensionValue,
  );

  return (
    <View
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      className={cn(
        "flex h-8 flex-row items-center gap-2 rounded-md px-2",
        className,
      )}
      {...props}
    >
      {showIcon ? (
        <Skeleton
          className="size-4 rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      ) : null}
      <Skeleton
        className="h-4 flex-1"
        data-sidebar="menu-skeleton-text"
        style={{ maxWidth: width }}
      />
    </View>
  );
}

function SidebarMenuSub({
  className,
  ...props
}: React.ComponentProps<typeof View>) {
  return (
    <View
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      className={cn(
        "border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5",
        Platform.select({
          web: "group-data-[collapsible=icon]:hidden",
        }),
        className,
      )}
      {...props}
    />
  );
}

function SidebarMenuSubItem({
  className,
  ...props
}: React.ComponentProps<typeof View>) {
  return (
    <View
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      className={cn("group/menu-sub-item relative", className)}
      {...props}
    />
  );
}

function SidebarMenuSubButton({
  asChild = false,
  size = "md",
  isActive = false,
  className,
  ...props
}: React.ComponentProps<typeof Pressable> & {
  asChild?: boolean;
  size?: "sm" | "md";
  isActive?: boolean;
}) {
  const Comp = asChild ? Slot : Pressable;

  return (
    <Comp
      data-slot="sidebar-menu-sub-button"
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "text-sidebar-foreground flex h-7 min-w-0 translate-x-px flex-row items-center gap-2 overflow-hidden rounded-md px-2",
        Platform.select({
          web: "ring-sidebar-ring outline-hidden hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground group-data-[collapsible=icon]:hidden",
          native: "active:bg-sidebar-accent",
        }),
        isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        className,
      )}
      {...props}
    />
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};
