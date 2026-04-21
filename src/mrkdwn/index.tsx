// Public re-export. The Yozora-based `renderMrkdwn` lives in ./parser
// and carries the exact same signature the old regex tokenizer did, so
// every call site (TextObject, section/markdown blocks, rich_text date
// sub-element) keeps working without changes.

export { renderMrkdwn } from "./parser";
