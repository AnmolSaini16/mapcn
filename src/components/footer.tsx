import { type Href, Link } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import type { LucideProps } from "lucide-react-native";
import { Pressable, useColorScheme, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import { Logo } from "./logo";

import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { cn } from "@/lib/utils";

function GitHubIcon({ size = 16, color = "currentColor" }: LucideProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
    >
      <Path d="M12 0.296997c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.082 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.296997c0-6.627-5.373-12-12-12" />
    </Svg>
  );
}

function XIcon({ size = 16, color = "currentColor" }: LucideProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
    >
      <Path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </Svg>
  );
}

/* TODO: add social links */
const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/AnmolSaini16/mapcn",
    icon: GitHubIcon,
  },
  { label: "X", href: "https://x.com/anmold_s", icon: XIcon },
] as const;

const footerLinks: Record<string, FooterLinkItem[]> = {
  product: [
    { label: "Documentation", href: "/docs" },
    { label: "Components", href: "/docs/basic-map" },
    { label: "Blocks", href: "/blocks" },
  ],
  community: [
    {
      label: "GitHub",
      href: "https://github.com/AnmolSaini16/mapcn",
      external: true,
    },
    {
      label: "Sponsor",
      href: "https://github.com/sponsors/AnmolSaini16",
      external: true,
    },
  ],
  resources: [
    {
      label: "MapLibre React Native",
      href: "https://maplibre.org/maplibre-react-native/",
      external: true,
    },
    {
      label: "React Native Reusables",
      href: "https://reactnativereusables.com/",
      external: true,
    },
    {
      label: "NativeWind",
      href: "https://www.nativewind.dev/",
      external: true,
    },
  ],
} as const;

type FooterLinkItem = {
  label: string;
  href: Href;
  external?: boolean;
};

function FooterLink({ label, href, external }: FooterLinkItem) {
  const linkClassName = "text-muted-foreground active:text-foreground text-sm";

  if (external ?? (typeof href === "string" && href.startsWith("http"))) {
    return (
      <Pressable
        accessibilityLabel={label}
        onPress={() => {
          void WebBrowser.openBrowserAsync(href as string);
        }}
      >
        <Text className={linkClassName}>{label}</Text>
      </Pressable>
    );
  }

  return (
    <Link
      href={href}
      asChild
    >
      <Pressable accessibilityLabel={label}>
        <Text className={linkClassName}>{label}</Text>
      </Pressable>
    </Link>
  );
}

function FooterLinkSection({
  title,
  links,
}: {
  title: string;
  links: FooterLinkItem[];
}) {
  return (
    <View className="min-w-35 flex-1 gap-2.5">
      <Text className="text-sm font-semibold">{title}</Text>
      <View className="gap-2.5">
        {links.map((link) => (
          <FooterLink
            key={link.label}
            {...link}
          />
        ))}
      </View>
    </View>
  );
}

type FooterProps = {
  className?: string;
};

export function Footer({ className }: FooterProps) {
  const colorScheme = useColorScheme() === "dark" ? "dark" : "light";
  const iconColor = THEME[colorScheme].mutedForeground;

  return (
    <View
      className={cn(
        "bg-muted/30 mt-24 border-t border-border md:mt-40",
        className,
      )}
    >
      <View className="container gap-8 py-12 md:py-16">
        <View className="gap-8">
          <View className="gap-4">
            <Logo className="w-fit" />
            <Text className="text-muted-foreground max-w-xs text-sm leading-relaxed">
              Free & open-source, ready-to-use, customizable map components for
              React Native.
            </Text>
            <View className="flex-row items-center gap-4">
              {socialLinks.map((social) => (
                <Pressable
                  key={social.href}
                  accessibilityLabel={social.label}
                  onPress={() => {
                    void WebBrowser.openBrowserAsync(social.href);
                  }}
                  className="active:opacity-80"
                >
                  <social.icon
                    size={16}
                    color={iconColor}
                  />
                </Pressable>
              ))}
            </View>
          </View>

          <View className="flex-row flex-wrap gap-8">
            <FooterLinkSection
              title="Product"
              links={[...footerLinks.product]}
            />
            <FooterLinkSection
              title="Community"
              links={[...footerLinks.community]}
            />
            <FooterLinkSection
              title="Resources"
              links={[...footerLinks.resources]}
            />
          </View>
        </View>

        <View className="border-t border-border pt-6">
          <Text className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} mapcn react native. All rights
            reserved.
          </Text>
        </View>
      </View>
    </View>
  );
}
