import { Link } from "expo-router";
import { Pressable, View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";

import { Text } from "@/components/ui/text";
import { SITE_NAME } from "@/lib/site-metadata";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  onPress?: () => void;
  isLink?: boolean;
};

export function Logo({ className, onPress, isLink = true }: LogoProps) {
  const content = (
    <>
      <Svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        className="size-4 md:size-6"
      >
        <Rect
          width="32"
          height="32"
          rx="8"
          fill="#000"
        />
        <Path
          d="M16 6C12.134 6 9 9.134 9 13C9 18.25 16 26 16 26C16 26 23 18.25 23 13C23 9.134 19.866 6 16 6Z"
          fill="#fff"
        />
        <Circle
          cx="16"
          cy="13"
          r="3"
          fill="#000"
        />
      </Svg>

      <Text className="text-lg font-bold leading-none">{SITE_NAME}</Text>
    </>
  );

  const logoClassName = cn("flex flex-row items-center gap-1.5", className);

  if (isLink) {
    return (
      <Link
        href="/"
        asChild
        onPress={onPress}
      >
        <Pressable className={logoClassName}>{content}</Pressable>
      </Link>
    );
  }

  return <View className={logoClassName}>{content}</View>;
}
