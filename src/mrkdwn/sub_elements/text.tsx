import { Fragment } from "react";
import type { TextSubElement } from "../ast-types";

// Section fields (and other single-paragraph mrkdwn text objects) carry
// literal `\n` separators that Slack renders as line breaks.
// Inside a <p>, the default behaviour is to collapse them to whitespace;
// we emit a <br> between each line so the intended layout survives.

export function Text({ element }: { element: TextSubElement }) {
  const parts = element.value.split(/\n/);
  if (parts.length === 1) return <>{element.value}</>;
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {i > 0 ? <br /> : null}
          {part}
        </Fragment>
      ))}
    </>
  );
}
