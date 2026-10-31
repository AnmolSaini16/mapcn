"use client";

import { useEffect, useRef } from "react";
import { Moon } from "lucide-react";

import type { Member } from "../data";
import { MemberAvatar } from "./member-avatar";

interface MemberListProps {
  members: Member[];
  selectedId?: string;
  onSelect: (member: Member) => void;
}

export function MemberList({ members, selectedId, onSelect }: MemberListProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);
  const memberCount = members.length;

  useEffect(() => {
    const list = listRef.current;
    const row = selectedRef.current;
    if (!list || !row) return;

    const listRect = list.getBoundingClientRect();
    const rowRect = row.getBoundingClientRect();
    if (rowRect.top < listRect.top) {
      list.scrollTop -= listRect.top - rowRect.top;
    } else if (rowRect.bottom > listRect.bottom) {
      list.scrollTop += rowRect.bottom - listRect.bottom;
    }
  }, [selectedId, memberCount]);

  return (
    <ul
      ref={listRef}
      className="flex flex-1 flex-col gap-1 overflow-y-auto p-2"
    >
      {members.map((member) => (
        <li key={member.id}>
          <button
            ref={member.id === selectedId ? selectedRef : undefined}
            type="button"
            onClick={() => onSelect(member)}
            aria-pressed={member.id === selectedId}
            className="hover:bg-muted aria-pressed:bg-muted flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left"
          >
            <MemberAvatar member={member} dimmed={!member.awake} />
            <div className="min-w-0 flex-1">
              <p className="text-foreground truncate text-xs font-medium">
                {member.name}
              </p>
              <p className="text-muted-foreground truncate text-[11px]">
                {member.city}
              </p>
            </div>
            <div className="text-muted-foreground flex shrink-0 items-center gap-1.5 text-[11px] tabular-nums">
              {!member.awake && <Moon className="size-2.5" />}
              {member.localTime}
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}
