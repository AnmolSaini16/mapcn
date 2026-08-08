import { Link } from "expo-router";
import { MapPin } from "lucide-react-native";
import { Pressable, View } from "react-native";

import { Icon } from "@/components/ui/icon";
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
      <Icon
        as={MapPin}
        size={16}
      />
      <Text className="text-lg font-bold leading-none">{SITE_NAME}</Text>
    </>
  );

  const logoClassName = cn(
    "inline-flex flex-row items-center gap-1.5",
    className,
  );

  if (isLink) {
    return (
      <Link
        href="/"
        asChild
        onPress={onPress}
      >
        <Pressable className={cn(logoClassName, "h-8")}>{content}</Pressable>
      </Link>
    );
  }

  return <View className={logoClassName}>{content}</View>;
}
