"use client";

import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getCopyLabel, useCopy } from "@/hooks/use-copy";

interface CodeCopyButtonProps {
  text: string;
  /** Accessible label while idle */
  label?: string;
  onCopy?: () => void;
  className?: string;
}

export function CodeCopyButton({
  text,
  label = "Copy code",
  onCopy,
  className,
}: CodeCopyButtonProps) {
  const { status, copy } = useCopy();

  const copyText = async () => {
    if (await copy(text)) onCopy?.();
  };

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={copyText}
      aria-label={getCopyLabel(status, label)}
      className={cn("text-muted-foreground bg-code", className)}
    >
      {status === "copied" ? <Check /> : <Copy />}
    </Button>
  );
}
