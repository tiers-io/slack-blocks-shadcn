import { Fragment } from "react";
import { cn } from "../utils/cn";
import { renderMrkdwn } from "../mrkdwn";
import { RichTextBlock } from "./rich_text";
import type { RichTextBlockData } from "./rich_text/types";

// Ported from upstream `/tmp/upstream-sbtj/src/components/blocks/table.tsx`.
// Cells are either `raw_text` (rendered through the mrkdwn pipeline
// with a pre-decode of `&lt;` / `&gt;`) or a full `rich_text` block.
// Row 0 is treated as a header row (bold). Per-column alignment +
// wrapping come from `column_settings[colIndex]`.

export type TableCellRawText = {
  type: "raw_text";
  text: string;
};

export type TableCellRichText = RichTextBlockData;

export type TableCell = TableCellRawText | TableCellRichText;

export interface TableColumnSetting {
  align?: "left" | "center" | "right";
  is_wrapped?: boolean;
}

export interface TableBlockData {
  type: "table";
  block_id?: string;
  rows: TableCell[][];
  column_settings?: TableColumnSetting[];
}

export function TableBlock({ block }: { block: TableBlockData }) {
  const { rows, column_settings } = block;
  if (!rows || rows.length === 0) return null;
  return (
    <div
      data-block="table"
      className="inline-block overflow-hidden rounded-md border border-border"
    >
      <table>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              data-row={ri === 0 ? "header" : "body"}
              className={cn(
                ri !== rows.length - 1 && "border-b border-border",
              )}
            >
              {row.map((cell, ci) => {
                const settings = column_settings?.[ci];
                const align = settings?.align ?? "left";
                const isWrapped = settings?.is_wrapped ?? false;
                const isHeader = ri === 0;
                return (
                  <td
                    key={ci}
                    data-align={align}
                    data-wrapped={isWrapped || undefined}
                    className={cn(
                      "border-r border-border px-3 py-2 last:border-r-0",
                      align === "center" && "text-center",
                      align === "right" && "text-right",
                      align === "left" && "text-left",
                      isWrapped
                        ? "break-words"
                        : "overflow-hidden text-ellipsis whitespace-nowrap",
                      isHeader && "font-semibold",
                    )}
                  >
                    {cell.type === "raw_text" ? (
                      <Fragment>
                        {renderMrkdwn(
                          cell.text
                            .replace(/&gt;/g, "> ")
                            .replace(/&lt;/g, "<"),
                        )}
                      </Fragment>
                    ) : (
                      <RichTextBlock block={cell} />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
