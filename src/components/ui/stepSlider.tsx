import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ControlButton } from "@/registry/map";

type Value = -1 | 0 | 1;

interface Props {
  orientation?: "vertical" | "horizontal";
  onChange?: (value: Value) => void;
  onIncrement: () => void;
  onDecrement: () => void;
}

export default function StepSlider({
  orientation = "vertical",
  onChange,
  onIncrement,
  onDecrement,
}: Props) {
  const [value, setValue] = useState<Value>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isActiveRef = useRef(false);

  const isVertical = orientation === "vertical";

  const setSafeValue = (next: Value) => {
    if (next !== value) {
      setValue(next);
      onChange?.(next);
    }
  };

  const evaluatePosition = (clientX: number, clientY: number) => {
    const rect = containerRef.current!.getBoundingClientRect();
    const deadZoneRatio = 0.2;

    if (isVertical) {
      const y = clientY - rect.top;
      const deadZone = rect.height * deadZoneRatio;

      if (y < rect.height / 2 - deadZone) { setSafeValue(1); onIncrement() }
      else if (y > rect.height / 2 + deadZone) { setSafeValue(-1); onDecrement() }
      else setSafeValue(0);
    } else {
      const x = clientX - rect.left;
      const deadZone = rect.width * deadZoneRatio;

      if (x > rect.width / 2 + deadZone) { setSafeValue(1); onIncrement() }
      else if (x < rect.width / 2 - deadZone) { setSafeValue(-1); onDecrement() }
      else setSafeValue(0);
    }
  };


  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isActiveRef.current) return;
      evaluatePosition(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
      if (!isActiveRef.current) return;
      isActiveRef.current = false;
      setSafeValue(0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [orientation, value]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isActiveRef.current = true;
    evaluatePosition(e.clientX, e.clientY);
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      className={`
        relative select-none cursor-grab
        flex items-center justify-between gap-6
        ${isVertical ? "flex-col" : "flex-row"}
      `}
    >
      <ControlButton
        onClick={onIncrement}
        label="Pitch Up"
      >
        {isVertical ? <ChevronUp className="size-4" /> : <ChevronRight className="size-4" />}
      </ControlButton>

      <div
        className={`
          absolute rounded bg-background p-1
          transition-all duration-100 ease-out
          flex justify-center items-center
          ${isVertical
            ? value === 1
              ? "top-1 left-1/2 -translate-x-1/2"
              : value === -1
                ? "bottom-1 left-1/2 -translate-x-1/2"
                : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            : value === 1
              ? "right-1 top-1/2 -translate-y-1/2"
              : value === -1
                ? "left-1 top-1/2 -translate-y-1/2"
                : "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          }
        `}
      >
        <Menu className="size-4" />
      </div>
      <ControlButton
        onClick={onDecrement}
        label={isVertical ? "Pitch Down" : "Pitch Left"}
      >
        {isVertical ? <ChevronDown className="size-4" /> : <ChevronLeft className="size-4" />}
      </ControlButton>
    </div>
  );
}
