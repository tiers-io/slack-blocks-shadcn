import { RenderTextObject } from "../composition/TextObject";
import { cn } from "../utils/cn";
import { sizing } from "../sizing";
import { useSize } from "../context";
import { TaskCardBlock, type TaskCardBlockData } from "./task_card";
import type { TextObject } from "../types";

// Upstream shape: `{ title, tasks: TaskCard[] }`. A plan is just a
// titled list of task cards — rendered in a stack.

export interface PlanBlockData {
  type: "plan";
  block_id?: string;
  title?: TextObject;
  tasks: TaskCardBlockData[];
}

export function PlanBlock({ block }: { block: PlanBlockData }) {
  const size = useSize();
  return (
    <div data-block="plan" className={cn(sizing[size].gap)}>
      {block.title ? (
        <div className={cn("font-semibold text-foreground", sizing[size].header)}>
          <RenderTextObject text={block.title} />
        </div>
      ) : null}
      <div className={cn("flex flex-col", sizing[size].gap)}>
        {block.tasks.map((task, i) => (
          <TaskCardBlock key={i} block={task} />
        ))}
      </div>
    </div>
  );
}
