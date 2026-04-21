import * as React from "react";
import { X } from "lucide-react";
import { cn } from "../utils/cn";

// Minimal headless-less dialog. For a read-only message renderer we
// don't need Radix's full portal / focus-trap apparatus — plain DOM +
// an overlay is enough, and keeps our peer-dep footprint light (no
// `radix-ui` pulled in from a viewer library).

export function Dialog({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  children: React.ReactNode;
}) {
  React.useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onOpenChange(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div
        data-dialog-overlay
        onClick={() => onOpenChange(false)}
        className="absolute inset-0 bg-black/50"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function DialogContent({
  className,
  onClose,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { onClose?: () => void }) {
  return (
    <div
      data-slot="dialog-content"
      className={cn(
        "relative w-[min(28rem,90vw)] rounded-lg border bg-background p-4 shadow-lg",
        className,
      )}
      {...props}
    >
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
      {children}
    </div>
  );
}

export function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("mb-2 flex flex-col gap-1", className)}
      {...props}
    />
  );
}

export function DialogTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      data-slot="dialog-title"
      className={cn("text-base font-semibold", className)}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export function DialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("mt-4 flex justify-end gap-2", className)}
      {...props}
    />
  );
}
