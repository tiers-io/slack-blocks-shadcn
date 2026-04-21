import type { InlineCodeSubElement } from "../ast-types";

export function InlineCode({ element }: { element: InlineCodeSubElement }) {
  return (
    <code className="rounded bg-muted px-1 font-mono text-[0.85em]">
      {element.value}
    </code>
  );
}
