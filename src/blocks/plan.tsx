import { Check, Clock, Circle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { RenderTextObject } from "../composition/TextObject";
import { cn } from "../utils/cn";
import { sizing } from "../sizing";
import { useSize } from "../context";
import type { TextObject } from "../types";

export type PlanItemStatus = "done" | "in_progress" | "todo";

export interface PlanItem {
  title: TextObject;
  status?: PlanItemStatus;
  description?: TextObject;
}

export interface PlanBlockData {
  type: "plan";
  block_id?: string;
  title?: TextObject;
  items: PlanItem[];
}

const STATUS_ICON: Record<PlanItemStatus, LucideIcon> = {
  done: Check,
  in_progress: Clock,
  todo: Circle,
};

const STATUS_COLOR: Record<PlanItemStatus, string> = {
  done: "text-emerald-600 dark:text-emerald-400",
  in_progress: "text-amber-600 dark:text-amber-400",
  todo: "text-muted-foreground",
};

export function PlanBlock({ block }: { block: PlanBlockData }) {
  const size = useSize();
  const done = block.items.filter((it) => it.status === "done").length;
  return (
    <div
      data-block="plan"
      className={cn(
        "rounded-md border border-border bg-card/50",
        sizing[size].padding,
      )}
    >
      {block.title ? (
        <div className="flex items-center justify-between gap-2">
          <div className={cn("font-semibold text-foreground", sizing[size].body)}>
            <RenderTextObject text={block.title} />
          </div>
          <Badge variant="outline">
            {done}/{block.items.length}
          </Badge>
        </div>
      ) : null}
      {block.title && block.items.length > 0 ? (
        <Separator className="my-2" />
      ) : null}
      <ul className={cn("flex flex-col", sizing[size].gap)}>
        {block.items.map((item, i) => {
          const status = item.status ?? "todo";
          const Icon = STATUS_ICON[status];
          return (
            <li
              key={i}
              data-plan-status={status}
              className="flex items-start gap-2"
            >
              <Icon
                className={cn(
                  "mt-0.5 shrink-0",
                  sizing[size].icon,
                  STATUS_COLOR[status],
                )}
              />
              <div className="min-w-0 flex-1">
                <div
                  className={cn(
                    status === "done" && "line-through text-muted-foreground",
                    sizing[size].body,
                  )}
                >
                  <RenderTextObject text={item.title} />
                </div>
                {item.description ? (
                  <div
                    className={cn(
                      "text-muted-foreground",
                      sizing[size].secondary,
                    )}
                  >
                    <RenderTextObject text={item.description} />
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
