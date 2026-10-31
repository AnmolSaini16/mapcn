"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { getAvatarUrl, type Member } from "../data";

interface MemberAvatarProps {
  member: Member;
  alt?: string;
  dimmed?: boolean;
  className?: string;
}

export function MemberAvatar({
  member,
  alt = "",
  dimmed,
  className,
}: MemberAvatarProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={cn(
        "bg-muted text-muted-foreground flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full text-xs font-medium",
        dimmed && "opacity-70",
        className,
      )}
    >
      {failed ? (
        getInitials(member.name)
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={getAvatarUrl(member.id)}
          alt={alt}
          draggable={false}
          onError={() => setFailed(true)}
          className="size-full object-cover"
        />
      )}
    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
}
