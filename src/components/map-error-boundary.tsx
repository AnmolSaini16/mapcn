"use client";

import { Component, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MapErrorBoundaryProps {
  children: ReactNode;
  className?: string;
}

interface MapErrorBoundaryState {
  failed: boolean;
}

export class MapErrorBoundary extends Component<
  MapErrorBoundaryProps,
  MapErrorBoundaryState
> {
  state: MapErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): MapErrorBoundaryState {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;

    return (
      <div
        className={cn(
          "text-muted-foreground flex size-full items-center justify-center text-sm",
          this.props.className,
        )}
      >
        Map failed to load
      </div>
    );
  }
}
