import { useComponent } from "../../components-registry";
import type { LinkSubElement } from "../ast-types";
import { Delete } from "./delete";
import { Emphasis } from "./emphasis";
import { SlackEmoji } from "./slack_emoji";
import { Strong } from "./strong";
import { Text } from "./text";

export function Link({ element }: { element: LinkSubElement }) {
  const InlineLink = useComponent("InlineLink");
  const children = element.children.map((child, i) => {
    if (child.type === "delete") return <Delete key={i} element={child} />;
    if (child.type === "emphasis") return <Emphasis key={i} element={child} />;
    if (child.type === "strong") return <Strong key={i} element={child} />;
    if (child.type === "slack_emoji") return <SlackEmoji key={i} element={child} />;
    return <Text key={i} element={child} />;
  });
  return <InlineLink href={element.url}>{children}</InlineLink>;
}
