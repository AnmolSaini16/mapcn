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
      <LogoMark />
      mapcn
    </Link>
  ) : (
    <div className={cn(logoClasses, className)}>
      <LogoMark />
      mapcn
    </div>
  );
}

function LogoMark() {
  return (
    <svg viewBox="9 6 14 20" aria-hidden="true" className="h-4 w-auto shrink-0">
      <path
        d="M16 6C12.134 6 9 9.134 9 13C9 18.25 16 26 16 26C16 26 23 18.25 23 13C23 9.134 19.866 6 16 6Z"
        className="fill-foreground"
      />
      <circle cx="16" cy="13" r="2.5" className="fill-background" />
    </svg>
  );
}
