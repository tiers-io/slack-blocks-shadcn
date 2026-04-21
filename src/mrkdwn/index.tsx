import { Fragment, type ReactNode } from "react";
import { get as getEmoji } from "node-emoji";
import { useHooks, useData } from "../context";
import { useComponent } from "../components-registry";

// Slack mrkdwn → React nodes. Non-goals: fidelity to CommonMark. Goal:
// cover everything Slack actually emits in `type: "mrkdwn"` text objects
// (section text, context elements, markdown block) with correct styling.
//
// Grammar handled here:
//   <@U123|name>              → user mention   → <MentionPill variant="user">
//   <#C456|name>              → channel mention → <MentionPill variant="channel">
//   <!subteam^S123|name>       → usergroup      → <MentionPill variant="usergroup">
//   <!here|here> / <!channel> → broadcast      → <MentionPill variant="broadcast">
//   <!date^ts^format|fallback> → date           → hooks.date fallback
//   <https://url|label>        → link           → <InlineLink>
//   <https://url>              → link           → <InlineLink>
//   *bold*                     → <strong>
//   _italic_                   → <em>
//   ~strike~                   → <del>
//   `code`                     → <code>         → inline code token
//   ```code```                → <pre>          → code fence
//   :emoji:                    → emoji glyph    → node-emoji lookup
//
// Emphasis markers are only consumed when they pair and don't span
// whitespace boundaries awkwardly — this matches Slack's behaviour of
// showing `a*b*c` as `a<strong>b</strong>c` but `2 * 3 * 4` as plain.

const TOKEN_SOURCE =
  "(```[\\s\\S]*?```)|(<[^>\\s][^>]*>)|(`[^`\\n]+`)|(\\*[^*\\n]+\\*)|(__[^_\\n]+__)|(_[^_\\n]+_)|(~[^~\\n]+~)|(:[a-z0-9_+-]+:)";

type RenderedFrag = ReactNode;

function RenderMentionOrLink({ raw }: { raw: string }): ReactNode {
  const InlineLink = useComponent("InlineLink");
  const inner = raw.slice(1, -1);
  if (inner.startsWith("@")) {
    const [id, name] = inner.slice(1).split("|", 2);
    return (
      <UserMention user_id={id ?? ""} label={name ?? id ?? ""} />
    );
  }
  if (inner.startsWith("#")) {
    const [id, name] = inner.slice(1).split("|", 2);
    return (
      <ChannelMention channel_id={id ?? ""} label={name ?? id ?? ""} />
    );
  }
  if (inner.startsWith("!")) {
    const body = inner.slice(1);
    if (body.startsWith("subteam^")) {
      const rest = body.slice("subteam^".length);
      const [id, name] = rest.split("|", 2);
      return (
        <UsergroupMention usergroup_id={id ?? ""} label={name ?? id ?? ""} />
      );
    }
    if (body.startsWith("date^")) {
      const parts = body.split("^");
      const timestamp = parts[1] ?? "";
      const format = parts[2]?.split("|")[0] ?? "";
      const fallback = body.split("|")[1] ?? timestamp;
      return <DateMention timestamp={timestamp} format={format} fallback={fallback} />;
    }
    // broadcast
    const [key, label] = body.split("|", 2);
    const kind = key?.toLowerCase();
    const display = label ?? (kind === "everyone" ? "@everyone" : kind === "channel" ? "@channel" : "@here");
    return <Broadcast kind={kind ?? "here"} label={display} />;
  }
  if (/^https?:\/\//i.test(inner)) {
    const pipe = inner.indexOf("|");
    if (pipe === -1)
      return <InlineLink href={inner}>{inner}</InlineLink>;
    return (
      <InlineLink href={inner.slice(0, pipe)}>{inner.slice(pipe + 1)}</InlineLink>
    );
  }
  // mailto / tel / custom — treat as link
  if (inner.includes("://") || inner.startsWith("mailto:") || inner.startsWith("tel:")) {
    const pipe = inner.indexOf("|");
    if (pipe === -1)
      return <InlineLink href={inner}>{inner}</InlineLink>;
    return (
      <InlineLink href={inner.slice(0, pipe)}>{inner.slice(pipe + 1)}</InlineLink>
    );
  }
  return null;
}

function UserMention({ user_id, label }: { user_id: string; label: string }) {
  const hooks = useHooks();
  const data = useData();
  const MentionPill = useComponent("MentionPill");
  const resolved = data.users?.find((u) => u.id === user_id);
  const display = resolved?.name ?? label;
  if (hooks.user) {
    return <>{hooks.user({ user_id, name: display, avatar: resolved?.avatar })}</>;
  }
  return <MentionPill variant="user">@{display}</MentionPill>;
}

function ChannelMention({
  channel_id,
  label,
}: {
  channel_id: string;
  label: string;
}) {
  const hooks = useHooks();
  const data = useData();
  const MentionPill = useComponent("MentionPill");
  const resolved = data.channels?.find((c) => c.id === channel_id);
  const display = resolved?.name ?? label;
  if (hooks.channel) {
    return <>{hooks.channel({ channel_id, name: display })}</>;
  }
  return <MentionPill variant="channel">#{display}</MentionPill>;
}

function UsergroupMention({
  usergroup_id,
  label,
}: {
  usergroup_id: string;
  label: string;
}) {
  const hooks = useHooks();
  const data = useData();
  const MentionPill = useComponent("MentionPill");
  const resolved = data.user_groups?.find((g) => g.id === usergroup_id);
  const display = resolved?.name ?? label;
  if (hooks.usergroup) {
    return <>{hooks.usergroup({ usergroup_id, name: display })}</>;
  }
  return <MentionPill variant="usergroup">@{display}</MentionPill>;
}

function Broadcast({ kind, label }: { kind: string; label: string }) {
  const hooks = useHooks();
  const MentionPill = useComponent("MentionPill");
  if (kind === "everyone" && hooks.atEveryone) return <>{hooks.atEveryone()}</>;
  if (kind === "channel" && hooks.atChannel) return <>{hooks.atChannel()}</>;
  if (kind === "here" && hooks.atHere) return <>{hooks.atHere()}</>;
  return <MentionPill variant="broadcast">{label}</MentionPill>;
}

function DateMention({
  timestamp,
  format,
  fallback,
}: {
  timestamp: string;
  format: string;
  fallback: string;
}) {
  const hooks = useHooks();
  if (hooks.date)
    return <>{hooks.date({ timestamp, format, link: null, fallback })}</>;
  return <>{fallback}</>;
}

function EmojiToken({ raw }: { raw: string }) {
  const hooks = useHooks();
  const name = raw.slice(1, -1);
  const parse = (d: { name: string }) => getEmoji(d.name) ?? `:${d.name}:`;
  if (hooks.emoji) return <>{hooks.emoji({ name }, parse)}</>;
  return <>{parse({ name })}</>;
}

function renderInline(text: string): RenderedFrag[] {
  const out: RenderedFrag[] = [];
  let last = 0;
  let key = 0;
  // Fresh regex per call — sharing one /g regex across recursive calls
  // clobbers lastIndex and produces an infinite loop on nested emphasis.
  const re = new RegExp(TOKEN_SOURCE, "gi");
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const raw = m[0];
    if (raw.startsWith("```")) {
      const inner = raw.slice(3, -3);
      out.push(
        <pre
          key={`cb-${key++}`}
          className="my-1 overflow-x-auto rounded-md bg-muted px-3 py-2 font-mono text-[0.85em]"
        >
          {inner}
        </pre>,
      );
    } else if (raw.startsWith("<")) {
      out.push(
        <Fragment key={`mt-${key++}`}>
          <RenderMentionOrLink raw={raw} />
        </Fragment>,
      );
    } else if (raw.startsWith("`")) {
      out.push(
        <code
          key={`ic-${key++}`}
          className="rounded bg-muted px-1 font-mono text-[0.85em]"
        >
          {raw.slice(1, -1)}
        </code>,
      );
    } else if (raw.startsWith("*")) {
      out.push(
        <strong key={`b-${key++}`} className="font-semibold">
          {renderInline(raw.slice(1, -1))}
        </strong>,
      );
    } else if (raw.startsWith("_")) {
      out.push(
        <em key={`i-${key++}`} className="italic">
          {renderInline(raw.slice(1, -1))}
        </em>,
      );
    } else if (raw.startsWith("__")) {
      out.push(
        <span key={`u-${key++}`} className="underline">
          {renderInline(raw.slice(2, -2))}
        </span>,
      );
    } else if (raw.startsWith("~")) {
      out.push(
        <del key={`s-${key++}`} className="line-through">
          {renderInline(raw.slice(1, -1))}
        </del>,
      );
    } else if (raw.startsWith(":") && raw.endsWith(":")) {
      out.push(<EmojiToken key={`e-${key++}`} raw={raw} />);
    }
    last = m.index + raw.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function renderMrkdwn(text: string): ReactNode {
  if (!text) return null;
  const lines = text.split("\n");
  const out: ReactNode[] = [];
  lines.forEach((line, i) => {
    if (i > 0) out.push(<br key={`br-${i}`} />);
    renderInline(line).forEach((node, j) =>
      out.push(
        typeof node === "string" ? (
          <Fragment key={`t-${i}-${j}`}>{node}</Fragment>
        ) : (
          node
        ),
      ),
    );
  });
  return <>{out}</>;
}
