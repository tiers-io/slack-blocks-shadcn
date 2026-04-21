import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { sizing } from "../sizing";
import { useSize } from "../context";
import { cn } from "../utils/cn";

// Slack `alert` blocks carry a level + message. Match shadcn's Alert
// aesthetic: border + soft background + leading icon.

export type AlertLevel = "info" | "warning" | "error" | "success";

export interface AlertBlockData {
  type: "alert";
  block_id?: string;
  alert_level: AlertLevel;
  message: string;
  title?: string;
}

const MAP: Record<
  AlertLevel,
  { icon: LucideIcon; accent: string; bg: string; border: string }
> = {
  info: {
    icon: Info,
    accent: "text-foreground",
    bg: "bg-muted/40",
    border: "border-border",
  },
  success: {
    icon: CheckCircle2,
    accent: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
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
  const { icon: Icon, accent, bg, border } =
    MAP[block.alert_level] ?? MAP.info;
  return (
    <div
      data-block="alert"
      data-level={block.alert_level}
      role={block.alert_level === "error" ? "alert" : "status"}
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
        <div className={cn("text-foreground/90", sizing[size].body)}>
          {block.message}
        </div>
      </div>
    </div>
  );
}
