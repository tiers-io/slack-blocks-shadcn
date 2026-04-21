import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { RenderTextObject } from "../composition/TextObject";
import { cn } from "../utils/cn";
import { sizing } from "../sizing";
import { useSize } from "../context";
import type { TextObject } from "../types";

// Upstream TaskCard status: `pending | in_progress | complete | error`.
// We match exactly.

export type TaskStatus = "pending" | "in_progress" | "complete" | "error";

export interface TaskCardSource {
  title?: string;
  url?: string;
}

export interface TaskCardBlockData {
  type: "task_card";
  block_id?: string;
  task_id?: string;
  title: TextObject;
  details?: TextObject;
  output?: TextObject;
  sources?: TaskCardSource[];
  status?: TaskStatus;
}

const STATUS_DOT: Record<TaskStatus, string> = {
  pending: "bg-muted-foreground",
  in_progress: "bg-amber-500",
  complete: "bg-emerald-500",
  error: "bg-destructive",
};

const STATUS_LABEL: Record<TaskStatus, string> = {
  pending: "Pending",
  in_progress: "In progress",
  complete: "Complete",
  error: "Error",
};

export function TaskCardBlock({ block }: { block: TaskCardBlockData }) {
  const size = useSize();
  const status = block.status ?? "pending";
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
      {block.details ? (
        <CardContent
          className={cn("text-muted-foreground", sizing[size].secondary)}
        >
          <RenderTextObject text={block.details} />
        </CardContent>
      ) : null}
      {block.output ? (
        <CardContent className={cn("text-foreground/90", sizing[size].body)}>
          <RenderTextObject text={block.output} />
        </CardContent>
      ) : null}
      {block.sources && block.sources.length > 0 ? (
        <CardContent
          className={cn(
            "flex flex-wrap items-center gap-3 text-muted-foreground",
            sizing[size].secondary,
          )}
        >
          {block.sources.map((s, i) =>
            s.url ? (
              <a
                key={i}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline"
              >
                {s.title ?? s.url}
              </a>
            ) : (
              <span key={i}>{s.title}</span>
            ),
          )}
        </CardContent>
      ) : null}
    </Card>
  );
}
