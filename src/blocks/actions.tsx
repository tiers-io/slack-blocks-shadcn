import { ElementDispatch } from "../elements/dispatch";

type AnyElement = { type: string; [k: string]: unknown };

export interface ActionsBlockData {
  type: "actions";
  block_id?: string;
  elements: AnyElement[];
}

export function ActionsBlock({ block }: { block: ActionsBlockData }) {
  return (
    <div
      data-block="actions"
      className="flex flex-wrap items-center gap-2"
    >
      {block.elements.map((el, i) => (
        <ElementDispatch key={i} element={el} />
      ))}
    </div>
  );
}
