import type { CodeElement } from "../ast-types";

export function Code({ element }: { element: CodeElement }) {
  return (
    <pre
      data-language={element.lang ?? undefined}
      className="my-1 overflow-x-auto rounded-md bg-muted px-3 py-2 font-mono text-xs whitespace-pre-wrap"
    >
      {element.value}
    </pre>
  );
}
