import type { HTMLSubElement } from "../ast-types";

export function HTML({ element }: { element: HTMLSubElement }) {
  return <>{element.value}</>;
}
