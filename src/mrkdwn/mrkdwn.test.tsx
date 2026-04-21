import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Message } from "../message";
import type { Block, Data } from "../index";

function renderThrough(text: string, data?: Data): string {
  const { container } = render(
    <Message
      blocks={[
        { type: "section", text: { type: "mrkdwn", text } },
      ] as Block[]}
      data={data}
    />,
  );
  return container.innerHTML;
}

describe("renderMrkdwn (Yozora-backed)", () => {
  it("renders plain text unchanged", () => {
    expect(renderThrough("hello world")).toContain("hello world");
  });

  it("renders *bold* as <strong>", () => {
    expect(renderThrough("this is *important*")).toMatch(
      /<strong[^>]*>important<\/strong>/,
    );
  });

  it("renders _italic_ as <em>", () => {
    expect(renderThrough("and _slanted_ too")).toMatch(
      /<em[^>]*>slanted<\/em>/,
    );
  });

  it("renders ~strike~ as <del>", () => {
    expect(renderThrough("~nope~")).toMatch(/<del[^>]*>nope<\/del>/);
  });

  it("renders `code` as inline <code>", () => {
    expect(renderThrough("use `foo()`")).toMatch(
      /<code[^>]*>foo\(\)<\/code>/,
    );
  });

  it("renders triple-backtick blocks as <pre>", () => {
    expect(renderThrough("```const x = 1```")).toMatch(
      /<pre[^>]*>const x = 1\s*<\/pre>/,
    );
  });

  it("resolves user mentions against data.users", () => {
    const out = renderThrough("hi <@U07J6UD0MQ8>", {
      users: [{ id: "U07J6UD0MQ8", name: "alex" }],
    });
    expect(out).toMatch(/data-variant="user"[^>]*>@alex</);
  });

  it("falls back to id when data.users is empty", () => {
    expect(renderThrough("hi <@U07J6UD0MQ8>")).toMatch(
      /data-variant="user"[^>]*>@U07J6UD0MQ8</,
    );
  });

  it("resolves channel mentions against data.channels", () => {
    const out = renderThrough("see <#C0X>", {
      channels: [{ id: "C0X", name: "platform" }],
    });
    expect(out).toMatch(/data-variant="channel"[^>]*>#platform</);
  });

  it("renders @here broadcasts as destructive pills", () => {
    expect(renderThrough("<!here>")).toMatch(
      /data-variant="broadcast"[^>]*>@here</,
    );
  });

  it("renders <url|label> as anchor", () => {
    expect(renderThrough("<https://example.com|example>")).toMatch(
      /<a[^>]*href="https:\/\/example\.com"[^>]*>example<\/a>/,
    );
  });

  it("renders bare <url> as anchor with url as label", () => {
    expect(renderThrough("<https://example.com>")).toMatch(
      /<a[^>]*href="https:\/\/example\.com"[^>]*>https:\/\/example\.com<\/a>/,
    );
  });

  it("converts :wave: emoji to its unicode glyph", () => {
    expect(renderThrough(":wave:")).toContain("👋");
  });

  it("preserves newlines literally inside a paragraph (CSS whitespace-pre-wrap handles display)", () => {
    expect(renderThrough("line 1\nline 2")).toMatch(/line 1\nline 2/);
  });
});
