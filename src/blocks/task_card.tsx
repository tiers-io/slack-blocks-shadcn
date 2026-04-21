import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { RenderTextObject } from "../composition/TextObject";
import { cn } from "../utils/cn";
import { sizing } from "../sizing";
import { useSize } from "../context";
import type { TextObject } from "../types";

export type TaskStatus =
  | "todo"
  | "in_progress"
  | "blocked"
  | "done"
  | "cancelled";

export interface TaskCardBlockData {
  type: "task_card";
  block_id?: string;
  title: TextObject;
  body?: TextObject;
  status?: TaskStatus;
  assignee?: string;
  priority?: "low" | "medium" | "high" | "urgent";
  due?: string;
}

// Maps Slack's task status → a dotted Badge variant + colour token. Keeps
// the card's framing neutral so the badge carries the status signal.

const STATUS_DOT: Record<TaskStatus, string> = {
  todo: "bg-muted-foreground",
  in_progress: "bg-amber-500",
  blocked: "bg-destructive",
  done: "bg-emerald-500",
  cancelled: "bg-muted",
};

const STATUS_LABEL: Record<TaskStatus, string> = {
  todo: "To do",
  in_progress: "In progress",
  blocked: "Blocked",
  done: "Done",
  cancelled: "Cancelled",
};

const PRIORITY_COLOR: Record<NonNullable<TaskCardBlockData["priority"]>, string> = {
  low: "text-muted-foreground",
  medium: "text-foreground",
  high: "text-amber-600 dark:text-amber-400",
  urgent: "text-destructive",
};

export function TaskCardBlock({ block }: { block: TaskCardBlockData }) {
  const size = useSize();
  const status = block.status ?? "todo";
  return (
    <Card data-block="task_card" data-status={status}>
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className={cn("font-medium text-foreground", sizing[size].body)}>
            <RenderTextObject text={block.title} />
          </div>
        </div>
        <Badge variant="outline" className="gap-1.5">
          <span
            aria-hidden
            data-status-dot={status}
            className={cn("h-2 w-2 rounded-full", STATUS_DOT[status])}
          />
          {STATUS_LABEL[status]}
        </Badge>
      </CardHeader>
      {block.body ? (
        <CardContent
          className={cn("text-muted-foreground", sizing[size].secondary)}
        >
          <RenderTextObject text={block.body} />
        </CardContent>
      ) : null}
      {(block.assignee || block.priority || block.due) ? (
        <CardContent
          className={cn(
            "flex flex-wrap items-center gap-3 text-muted-foreground",
            sizing[size].secondary,
          )}
        >
          {block.assignee ? <span>@{block.assignee}</span> : null}
          {block.priority ? (
            <span className={PRIORITY_COLOR[block.priority]}>
              ↑ {block.priority}
            </span>
          ) : null}
          {block.due ? <span>due {block.due}</span> : null}
        </CardContent>
      ) : null}
    </Card>
  );
}
