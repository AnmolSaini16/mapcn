import { type Href, Link } from "expo-router";
import { Pressable } from "react-native";

import { Text } from "@/components/ui/text";
import { PRIVACY_POLICY_PATH } from "@/lib/site-metadata";
import { cn } from "@/lib/utils";

type PrivacyPolicyLinkProps = {
  className?: string;
  label?: string;
};

export function PrivacyPolicyLink({
  className,
  label = "Privacy Policy",
}: PrivacyPolicyLinkProps) {
  return (
    <Link
      href={PRIVACY_POLICY_PATH as Href}
      asChild
    >
      <Pressable accessibilityRole="link">
        <Text
          className={cn(
            "text-muted-foreground text-sm underline underline-offset-4",
            className,
          )}
        >
          {label}
        </Text>
      </Pressable>
    </Link>
  );
}
