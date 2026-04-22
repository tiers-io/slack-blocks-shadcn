import { useEffect, useRef, useState } from "react";

// Loads Slack's extracted webpack bundle (+ state snapshot + scoped CSS)
// and mounts their real BlockKitRenderer for any blocks array.

declare global {
  interface Window {
    __slackBundle?: SlackBundle;
    __slackReduxStore?: ReduxStore;
  }
}

type SlackBundle = {
  (id: string | number): unknown;
  m: Record<string, unknown>;
  c: Record<string, unknown>;
};
type ReduxStore = {
  dispatch: (a: unknown) => void;
  getState: () => unknown;
  subscribe: (f: () => void) => () => void;
  replaceReducer?: (r: unknown) => void;
  [k: string]: unknown;
};

const MODULE_IDS = {
  blockKit: "4732800308",
  react: "6898708842",
  reactDom: "7209311370",
  reactRedux: "6122756707",
} as const;

let bundlePromise: Promise<SlackBundle> | null = null;

async function loadBundle(): Promise<SlackBundle> {
  if (window.__slackBundle) return window.__slackBundle;
  if (bundlePromise) return bundlePromise;
  bundlePromise = (async () => {
    // Inject stubs a few modules expect before bundle eval
    (window as unknown as { TS?: unknown }).TS = {};
    await new Promise<void>((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "/slack/bundle.js";
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("Failed to load /slack/bundle.js"));
      document.head.appendChild(s);
    });
    if (!window.__slackBundle) throw new Error("Bundle loaded but __slackBundle missing");
    return window.__slackBundle;
  })();
  return bundlePromise;
}

async function loadStylesheet(): Promise<void> {
  if (document.querySelector('link[data-slack-styles="true"]')) return;
  await new Promise<void>((resolve, reject) => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "/slack/styles.css";
    l.setAttribute("data-slack-styles", "true");
    l.onload = () => resolve();
    l.onerror = () => reject(new Error("Failed to load /slack/styles.css"));
    document.head.appendChild(l);
  });
}

async function ensureStore(bundle: SlackBundle): Promise<ReduxStore> {
  if (window.__slackReduxStore) return window.__slackReduxStore;
  const state = await fetch("/slack/state.json").then((r) => r.json());
  // Build a minimal store that just returns our captured state. Many Slack
  // Connect wrappers only read; dispatches are no-ops in preview mode.
  const listeners = new Set<() => void>();
  const store: ReduxStore = {
    dispatch: () => {},
    getState: () => state,
    subscribe: (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
  window.__slackReduxStore = store;
  return store;
}

interface SlackRealRendererProps {
  blocks: unknown[];
  theme?: "light" | "dark";
}

type MountResult = { unmount: () => void } | null;

export function SlackRealRenderer({ blocks, theme = "light" }: SlackRealRendererProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<MountResult>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errMsg, setErrMsg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [bundle] = await Promise.all([loadBundle(), loadStylesheet()]);
        if (cancelled) return;
        setStatus("ready");
        // Mount happens in a second effect driven by `blocks`
        void bundle;
      } catch (e) {
        if (cancelled) return;
        setErrMsg((e as Error).message);
        setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (status !== "ready") return;
    const host = hostRef.current;
    if (!host) return;
    const bundle = window.__slackBundle;
    if (!bundle) return;
    void theme;

    let disposed = false;
    (async () => {
      try {
        const React = bundle(MODULE_IDS.react) as {
          createElement: (type: unknown, props: unknown, ...children: unknown[]) => unknown;
        };
        const ReactDOM = bundle(MODULE_IDS.reactDom) as {
          createRoot: (
            container: Element,
            options?: unknown,
          ) => { render: (el: unknown) => void; unmount: () => void };
        };
        const ReduxLib = bundle(MODULE_IDS.reactRedux) as { Kq: unknown };
        const Renderer = (bundle(MODULE_IDS.blockKit) as { A: unknown }).A;
        const store = await ensureStore(bundle);
        if (disposed) return;

        // Unmount prior root
        rootRef.current?.unmount();

        host.innerHTML = "";
        // createRoot renders into an inner container so the sk-client-theme--*
        // class sits as a DESCENDANT (cascade + scoped selector require it).
        const themed = document.createElement("div");
        themed.className =
          theme === "dark" ? "sk-client-theme--dark" : "sk-client-theme--light";
        host.appendChild(themed);
        const root = ReactDOM.createRoot(themed);
        root.render(
          React.createElement(
            ReduxLib.Kq as never,
            { store } as never,
            React.createElement(Renderer as never, {
              blocksContainerContext: {},
              renderBlock: (el: unknown) => el,
              clogger: () => {},
              blockKitLogPayload: {},
              teamId: "T00000",
              enterpriseId: "",
              appId: "APP",
              logger: { log: () => {}, info: () => {}, warn: () => {}, error: () => {} },
              containerActionsPayload: {},
              serviceId: "B_PLAYGROUND",
              containerId: "playground_mount",
              onAction: () => {},
              blocks,
            } as never),
          ),
        );
        rootRef.current = root as MountResult;
      } catch (e) {
        setErrMsg((e as Error).message);
        setStatus("error");
      }
    })();

    return () => {
      disposed = true;
    };
  }, [status, blocks, theme]);

  useEffect(() => {
    return () => {
      try {
        rootRef.current?.unmount();
      } catch {}
      rootRef.current = null;
    };
  }, []);

  if (status === "error") {
    return (
      <div className="text-sm text-destructive">
        Slack renderer failed to load: {errMsg}
      </div>
    );
  }
  if (status === "loading") {
    return (
      <div className="text-sm text-muted-foreground">
        Loading Slack's real renderer (~15 MB, one-time)…
      </div>
    );
  }
  return (
    <div
      ref={hostRef}
      className="slack-real-renderer"
      style={{
        background: theme === "dark" ? "#1a1d21" : "#fff",
        color: theme === "dark" ? "#d1d2d3" : "#1d1c1d",
        padding: "12px 16px",
        borderRadius: 6,
        minHeight: 200,
      }}
    />
  );
}
