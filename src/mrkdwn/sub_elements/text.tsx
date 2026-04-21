import type { TextSubElement } from "../ast-types";

export function Text({ element }: { element: TextSubElement }) {
  return <>{element.value}</>;
}
