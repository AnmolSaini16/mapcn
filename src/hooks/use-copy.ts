"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type CopyStatus = "idle" | "copied" | "failed";

export function useCopy(resetAfter = 2000) {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = useCallback(
    async (text: string) => {
      window.clearTimeout(timer.current);
      const copied = await navigator.clipboard.writeText(text).then(
        () => true,
        () => false,
      );
      setStatus(copied ? "copied" : "failed");
      timer.current = window.setTimeout(() => setStatus("idle"), resetAfter);
      return copied;
    },
    [resetAfter],
  );

  return { status, copy };
}
