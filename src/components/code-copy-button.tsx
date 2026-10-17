"use client";

import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/hooks/use-copy";

interface CodeCopyButtonProps {
  text: string;
  onCopy?: () => void;
  className?: string;
}

export function CodeCopyButton({
  text,
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
      aria-label={COPY_LABELS[status]}
      className={cn("text-muted-foreground bg-code", className)}
    >
      {status === "copied" ? <Check /> : <Copy />}
    </Button>
  );
}

const COPY_LABELS = {
  idle: "Copy code",
  copied: "Copied",
  failed: "Couldn't copy",
};
