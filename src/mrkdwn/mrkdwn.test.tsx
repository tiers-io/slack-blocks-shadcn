import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { renderMrkdwn } from "./index";

function html(text: string): string {
  const { container } = render(<div>{renderMrkdwn(text)}</div>);
  return container.innerHTML;
}

describe("renderMrkdwn", () => {
  it("renders plain text unchanged", () => {
    expect(html("hello world")).toContain("hello world");
  });

  it("renders *bold* as <strong>", () => {
    expect(html("this is *important*")).toMatch(
      /<strong[^>]*>important<\/strong>/,
    );
  });

  it("renders _italic_ as <em>", () => {
    expect(html("and _slanted_ too")).toMatch(
      /<em[^>]*>slanted<\/em>/,
    );
  });

  it("renders ~strike~ as <del>", () => {
    expect(html("~nope~")).toMatch(/<del[^>]*>nope<\/del>/);
  });

  it("renders `code` as <code>", () => {
    expect(html("use `foo()`")).toMatch(/<code[^>]*>foo\(\)<\/code>/);
  });

  it("renders triple-backtick blocks as <pre>", () => {
    expect(html("```const x = 1```")).toMatch(
      /<pre[^>]*>const x = 1<\/pre>/,
    );
  });

  it("renders user mentions as pills", () => {
    expect(html("hi <@U07J6UD0MQ8|alex>")).toMatch(
      /data-variant="user"[^>]*>@alex</,
    );
  });

  it("renders channel mentions as pills", () => {
    expect(html("see <#C0X|platform>")).toMatch(
      /data-variant="channel"[^>]*>#platform</,
    );
  });

  it("renders @here broadcasts as destructive pills", () => {
    expect(html("<!here>")).toMatch(/data-variant="broadcast"[^>]*>@here</);
  });

  it("renders <url|label> as anchor", () => {
    expect(html("<https://example.com|example>")).toMatch(
      /<a[^>]*href="https:\/\/example\.com"[^>]*>example<\/a>/,
    );
  });

  it("renders bare <url> as anchor with url as label", () => {
    expect(html("<https://example.com>")).toMatch(
      /<a[^>]*href="https:\/\/example\.com"[^>]*>https:\/\/example\.com<\/a>/,
    );
  });

  it("converts :wave: emoji to its unicode glyph", () => {
    expect(html(":wave:")).toContain("👋");
  });

  it("handles newlines as <br>", () => {
    expect(html("line 1\nline 2")).toMatch(/line 1<br>line 2/);
  });
});
