import { useEffect, useMemo, useRef, useState } from "react";
import { Message as UpstreamMessage } from "slack-blocks-to-jsx";
import { Message as TiersMessage } from "@tiers-io/slack-blocks-shadcn";
import { FIXTURES, type Fixture } from "./fixtures";
import { SlackRealRenderer } from "./SlackRealRenderer";

type Size = "sm" | "default" | "lg";

function parseBlocks(raw: string): { blocks: unknown[] | null; error?: string } {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return { blocks: null, error: "Top-level JSON must be an array of blocks." };
    }
    return { blocks: parsed };
  } catch (e) {
    return { blocks: null, error: (e as Error).message };
  }
}

function stripPrefix(name: string, prefix: string): string {
  const head = `${prefix}:`;
  return name.startsWith(head) ? name.slice(head.length).trim() : name;
}

export function App() {
  const [fixtureIndex, setFixtureIndex] = useState(0);
  const initial = FIXTURES[fixtureIndex]!;
  const [json, setJson] = useState(() => JSON.stringify(initial.blocks, null, 2));
  const [size, setSize] = useState<Size>("default");
  const [dark, setDark] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [actionLog, setActionLog] = useState<string[]>([]);
  const [useRealSlack, setUseRealSlack] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const filteredFixtures = useMemo(() => {
    if (!search.trim()) {
      return FIXTURES.map((fixture, index) => ({ fixture, index }));
    }
    const q = search.toLowerCase();
    return FIXTURES.map((fixture, index) => ({ fixture, index })).filter(
      ({ fixture }) =>
        fixture.name.toLowerCase().includes(q) ||
        fixture.description.toLowerCase().includes(q),
    );
  }, [search]);

  const groupedFiltered = useMemo(() => {
    const groups = new Map<string, typeof filteredFixtures>();
    for (const item of filteredFixtures) {
      const [head] = item.fixture.name.split(":");
      const label =
        head && item.fixture.name.includes(":") ? head.trim() : "Custom";
      const bucket = groups.get(label) ?? [];
      bucket.push(item);
      groups.set(label, bucket);
    }
    return [...groups.entries()].map(([label, items]) => ({ label, items }));
  }, [filteredFixtures]);

  const loadFixture = (i: number) => {
    const clamped = Math.max(0, Math.min(FIXTURES.length - 1, i));
    const fx = FIXTURES[clamped];
    if (!fx) return;
    setFixtureIndex(clamped);
    setJson(JSON.stringify(fx.blocks, null, 2));
    setActionLog([]);
  };

  const step = (delta: number) => {
    if (filteredFixtures.length === 0) return;
    const current = filteredFixtures.findIndex((f) => f.index === fixtureIndex);
    const base = current >= 0 ? current : 0;
    const len = filteredFixtures.length;
    const next = ((base + delta) % len + len) % len;
    const target = filteredFixtures[next];
    if (target) loadFixture(target.index);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (!typing) {
        if (e.key === "ArrowRight" || e.key === "j") {
          e.preventDefault();
          step(1);
          return;
        }
        if (e.key === "ArrowLeft" || e.key === "k") {
          e.preventDefault();
          step(-1);
          return;
        }
        if (e.key === "/") {
          e.preventDefault();
          searchRef.current?.focus();
          return;
        }
      }
      if (e.key === "Escape") {
        if (document.activeElement === searchRef.current) {
          searchRef.current?.blur();
          setSearch("");
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const { blocks, error } = useMemo(() => parseBlocks(json), [json]);
  const activeFixture = FIXTURES[fixtureIndex]!;
  const position =
    filteredFixtures.findIndex((f) => f.index === fixtureIndex) + 1;

  const logAction = (payload: unknown) => {
    setActionLog((prev) =>
      [
        `${new Date().toLocaleTimeString()}  ${JSON.stringify(payload)}`,
        ...prev,
      ].slice(0, 10),
    );
  };

  return (
    <div className={dark ? "dark" : ""}>
      <div className="flex h-screen flex-col bg-background text-foreground">
        <TopBar
          position={position}
          total={filteredFixtures.length}
          absoluteTotal={FIXTURES.length}
          onPrev={() => step(-1)}
          onNext={() => step(1)}
          size={size}
          onSizeChange={setSize}
          dark={dark}
          onDarkChange={setDark}
          editorOpen={editorOpen}
          onEditorToggle={() => setEditorOpen((v) => !v)}
          searchRef={searchRef}
          search={search}
          onSearchChange={setSearch}
        />

        <div className="flex min-h-0 flex-1">
          <Sidebar
            groups={groupedFiltered}
            activeIndex={fixtureIndex}
            onPick={loadFixture}
          />
          <main className="flex min-w-0 flex-1 flex-col">
            <Breadcrumb fixture={activeFixture} />
            <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-hidden p-4 xl:grid-cols-2">
              <Pane
                label={useRealSlack ? "Slack" : "Upstream"}
                title={
                  useRealSlack
                    ? "Real Slack engine (extracted bundle)"
                    : "slack-blocks-to-jsx@1.0.4"
                }
                tone="muted"
                right={
                  <button
                    onClick={() => setUseRealSlack((v) => !v)}
                    className="rounded-md border border-border bg-background px-2 py-1 text-[10px] font-medium hover:bg-accent"
                    title={
                      useRealSlack
                        ? "Switch left pane back to the lightweight upstream fork"
                        : "Switch left pane to Slack's real renderer (loads a 15 MB bundle once)"
                    }
                  >
                    {useRealSlack ? "Using: real Slack" : "Switch to real Slack"}
                  </button>
                }
              >
                {blocks ? (
                  useRealSlack ? (
                    <SlackRealRenderer
                      blocks={blocks}
                      theme={dark ? "dark" : "light"}
                    />
                  ) : (
                    <UpstreamMessage
                      name="Tiers bot"
                      logo="https://placehold.co/72x72/ea580c/fff?text=T"
                      blocks={blocks as never}
                      theme={dark ? "dark" : "light"}
                    />
                  )
                ) : (
                  <EmptyState />
                )}
              </Pane>
              <Pane
                label="Ours"
                title="@tiers-io/slack-blocks-shadcn@0.2.0"
                tone="accent"
              >
                {blocks ? (
                  <TiersMessage
                    size={size}
                    blocks={blocks as never}
                    onAction={logAction}
                  />
                ) : (
                  <EmptyState />
                )}
              </Pane>
            </div>
            {editorOpen ? (
              <Editor
                value={json}
                onChange={setJson}
                error={error}
                log={actionLog}
                onClose={() => setEditorOpen(false)}
              />
            ) : null}
          </main>
        </div>
      </div>
    </div>
  );
}

function TopBar({
  position,
  total,
  absoluteTotal,
  onPrev,
  onNext,
  size,
  onSizeChange,
  dark,
  onDarkChange,
  editorOpen,
  onEditorToggle,
  searchRef,
  search,
  onSearchChange,
}: {
  position: number;
  total: number;
  absoluteTotal: number;
  onPrev: () => void;
  onNext: () => void;
  size: Size;
  onSizeChange: (s: Size) => void;
  dark: boolean;
  onDarkChange: (v: boolean) => void;
  editorOpen: boolean;
  onEditorToggle: () => void;
  searchRef: React.RefObject<HTMLInputElement | null>;
  search: string;
  onSearchChange: (v: string) => void;
}) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-card/60 px-4 backdrop-blur">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-orange-500 to-rose-500 text-xs font-bold text-white shadow-sm">
          SB
        </div>
        <div className="flex flex-col leading-tight">
          <div className="text-sm font-semibold">Slack Blocks Playground</div>
          <div className="text-[11px] text-muted-foreground">
            Upstream vs. tiers-io side-by-side
          </div>
        </div>
      </div>

      <div className="mx-4 flex h-8 items-center rounded-md border border-border bg-background">
        <IconButton label="Prev (←)" onClick={onPrev}>
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </IconButton>
        <div className="min-w-[84px] whitespace-nowrap border-x border-border px-3 text-center font-mono text-xs tabular-nums text-muted-foreground">
          {total === 0 ? "0 / 0" : `${position} / ${total}`}
          {total !== absoluteTotal ? (
            <span className="ml-1 text-[10px] opacity-60">
              of {absoluteTotal}
            </span>
          ) : null}
        </div>
        <IconButton label="Next (→)" onClick={onNext}>
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </IconButton>
      </div>

      <div className="relative">
        <input
          ref={searchRef}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search fixtures…   /"
          className="h-8 w-56 rounded-md border border-border bg-background px-2.5 pr-8 text-sm outline-none placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-ring"
        />
        {search ? (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-1 top-1 h-6 w-6 rounded text-muted-foreground hover:bg-accent"
            aria-label="Clear search"
          >
            ×
          </button>
        ) : null}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="flex items-center gap-1 rounded-md border border-border bg-background p-0.5 text-xs">
          {(["sm", "default", "lg"] as const).map((s) => (
            <button
              key={s}
              onClick={() => onSizeChange(s)}
              className={
                "rounded-[5px] px-2 py-1 transition-colors " +
                (size === s
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground")
              }
              title={`Size: ${s} (ours only)`}
            >
              {s}
            </button>
          ))}
        </div>

        <button
          onClick={onEditorToggle}
          className={
            "flex h-8 items-center gap-1.5 rounded-md border border-border px-2.5 text-xs font-medium transition-colors " +
            (editorOpen
              ? "bg-foreground text-background"
              : "bg-background hover:bg-accent")
          }
        >
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          JSON
        </button>

        <button
          onClick={() => onDarkChange(!dark)}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background hover:bg-accent"
          title={dark ? "Switch to light" : "Switch to dark"}
          aria-label="Toggle theme"
        >
          {dark ? (
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="12" cy="12" r="4" />
              <path
                d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
    >
      {children}
    </button>
  );
}

function Sidebar({
  groups,
  activeIndex,
  onPick,
}: {
  groups: { label: string; items: { fixture: Fixture; index: number }[] }[];
  activeIndex: number;
  onPick: (i: number) => void;
}) {
  const activeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeIndex]);
  const total = groups.reduce((s, g) => s + g.items.length, 0);
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card/30 md:flex">
      <div className="border-b border-border px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {total} {total === 1 ? "fixture" : "fixtures"}
      </div>
      <nav className="flex-1 overflow-y-auto py-2">
        {total === 0 ? (
          <div className="px-4 py-8 text-center text-xs text-muted-foreground">
            No matches
          </div>
        ) : (
          groups.map((g) => (
            <div key={g.label} className="mb-2">
              <div className="sticky top-0 z-[1] bg-card/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground backdrop-blur">
                {g.label}
              </div>
              <ul className="px-1">
                {g.items.map(({ fixture, index }) => {
                  const active = index === activeIndex;
                  return (
                    <li key={index}>
                      <button
                        ref={active ? activeRef : undefined}
                        onClick={() => onPick(index)}
                        className={
                          "w-full truncate rounded-md px-2 py-1.5 text-left text-[13px] transition-colors " +
                          (active
                            ? "bg-accent font-medium text-accent-foreground"
                            : "text-foreground/80 hover:bg-accent/60")
                        }
                      >
                        {stripPrefix(fixture.name, g.label)}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))
        )}
      </nav>
      <div className="border-t border-border px-3 py-2 text-[10px] leading-relaxed text-muted-foreground">
        <kbd className="mr-1 rounded border border-border bg-background px-1 font-mono">
          ←
        </kbd>
        <kbd className="mr-2 rounded border border-border bg-background px-1 font-mono">
          →
        </kbd>
        cycle ·{" "}
        <kbd className="mx-1 rounded border border-border bg-background px-1 font-mono">
          /
        </kbd>
        search
      </div>
    </aside>
  );
}

function Breadcrumb({ fixture }: { fixture: Fixture }) {
  return (
    <div className="flex shrink-0 items-center gap-2 border-b border-border bg-background px-4 py-2">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Now showing
      </span>
      <span className="text-sm font-medium">{fixture.name}</span>
      <span className="text-xs text-muted-foreground">·</span>
      <span className="text-xs text-muted-foreground">{fixture.description}</span>
    </div>
  );
}

function Pane({
  label,
  title,
  tone,
  right,
  children,
}: {
  label: string;
  title: string;
  tone: "muted" | "accent";
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <header
        className={
          "flex shrink-0 items-center justify-between border-b border-border px-4 py-2.5 " +
          (tone === "accent" ? "bg-accent/30" : "bg-muted/30")
        }
      >
        <div className="flex items-center gap-2">
          <span
            className={
              "inline-flex h-5 items-center rounded-full px-2 text-[10px] font-bold uppercase tracking-wide " +
              (tone === "accent"
                ? "bg-orange-500/15 text-orange-500"
                : "bg-muted-foreground/20 text-muted-foreground")
            }
          >
            {label}
          </span>
          <span className="text-xs font-medium text-foreground/90">{title}</span>
        </div>
        {right}
      </header>
      <div className="flex-1 overflow-auto p-4 text-sm">{children}</div>
    </section>
  );
}

function Editor({
  value,
  onChange,
  error,
  log,
  onClose,
}: {
  value: string;
  onChange: (v: string) => void;
  error: string | undefined;
  log: string[];
  onClose: () => void;
}) {
  return (
    <aside className="grid h-72 shrink-0 grid-cols-1 gap-0 border-t border-border bg-card lg:grid-cols-[2fr_1fr]">
      <div className="flex min-h-0 flex-col border-r border-border">
        <div className="flex shrink-0 items-center justify-between border-b border-border px-3 py-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Blocks JSON
          </span>
          <button
            onClick={onClose}
            className="rounded px-2 py-0.5 text-xs text-muted-foreground hover:bg-accent"
          >
            Close
          </button>
        </div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          className="min-h-0 flex-1 resize-none bg-background p-3 font-mono text-[11px] leading-5 outline-none"
        />
        {error ? (
          <div className="shrink-0 border-t border-destructive/30 bg-destructive/10 px-3 py-1 font-mono text-[11px] text-destructive">
            {error}
          </div>
        ) : null}
      </div>
      <div className="flex min-h-0 flex-col">
        <div className="shrink-0 border-b border-border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          onAction log (ours)
        </div>
        <div className="flex-1 overflow-auto bg-background p-3 font-mono text-[11px] leading-5 text-muted-foreground">
          {log.length === 0 ? (
            <span className="italic opacity-60">No actions yet — click in the right pane.</span>
          ) : (
            log.map((line, i) => (
              <div key={i} className="whitespace-pre-wrap break-all">
                {line}
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
      Waiting for valid JSON…
    </div>
  );
}
