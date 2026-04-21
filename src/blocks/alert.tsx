import { AlertCircle, Info, Lightbulb, TriangleAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { sizing } from "../sizing";
import { useSize } from "../context";
import { cn } from "../utils/cn";

// Slack `alert` blocks carry a level + description. Upstream supports
// `default | info | warning | error` (no `success`). Field names
// aligned 1:1 with upstream: `level` / `title` / `description`.

export type AlertLevel = "default" | "info" | "warning" | "error";

export interface AlertBlockData {
  type: "alert";
  block_id?: string;
  level: AlertLevel;
  title?: string;
  description?: string;
}

const MAP: Record<
  AlertLevel,
  { icon: LucideIcon; accent: string; bg: string; border: string }
> = {
  default: {
    icon: Lightbulb,
    accent: "text-foreground",
    bg: "bg-muted/40",
    border: "border-border",
  },
  info: {
    icon: Info,
    accent: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/30",
  },
  warning: {
    icon: TriangleAlert,
    accent: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
  },
  error: {
    icon: AlertCircle,
    accent: "text-destructive",
    bg: "bg-destructive/10",
    border: "border-destructive/30",
  },
};

export function AlertBlock({ block }: { block: AlertBlockData }) {
  const size = useSize();
  const { icon: Icon, accent, bg, border } = MAP[block.level] ?? MAP.default;
  return (
    <div
      data-block="alert"
      data-level={block.level}
      role={block.level === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-3 rounded-md border",
        bg,
        border,
        sizing[size].padding,
      )}
    >
      <Icon className={cn("mt-0.5 shrink-0", accent, sizing[size].icon)} />
      <div className="min-w-0 flex-1">
        {block.title ? (
          <div className={cn("font-semibold", accent, sizing[size].body)}>
            {block.title}
          </div>
        ) : null}
        {block.description ? (
          <div className={cn("text-foreground/90", sizing[size].body)}>
            {block.description}
          </div>
        ) : null}
      </div>
    </div>
  );
}
