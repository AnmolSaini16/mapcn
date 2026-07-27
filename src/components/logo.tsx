import { MapPin } from "lucide-react-native";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  onClick?: () => void;
  isLink?: boolean;
}

export function Logo({ className, onClick, isLink = true }: LogoProps) {
  const logoClasses =
    "inline-flex items-center gap-1.5 text-lg leading-none font-bold";

  return isLink ? (
    <Link
      href="/"
      onClick={onClick}
      className={cn(logoClasses, "h-8", className)}
    >
      <MapPin className="size-4" />
      mapcn
    </Link>
  ) : (
    <div className={cn(logoClasses, className)}>
      <MapPin className="size-4" />
      mapcn
    </div>
  );
}
