import * as React from "react";
import { cn } from "../utils/cn";

// Lightweight inline popover primitive. We keep our own so the library
// has zero Radix peer-dep requirement. Trigger clicks toggle open;
// clicks outside the popover close it. Escape closes.

interface PopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  contentClassName?: string;
}

export function Popover({
  open,
  onOpenChange,
  trigger,
  children,
  align = "start",
  contentClassName,
}: PopoverProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current) return;
      if (rootRef.current.contains(e.target as Node)) return;
      onOpenChange(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onOpenChange(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onOpenChange]);
  return (
    <div ref={rootRef} className="relative inline-block">
      {trigger}
      {open ? (
        <div
          role="dialog"
          className={cn(
            "absolute z-40 mt-1 min-w-full rounded-md border bg-popover text-popover-foreground shadow-md",
            align === "center" && "left-1/2 -translate-x-1/2",
            align === "end" && "right-0",
            contentClassName,
          )}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
