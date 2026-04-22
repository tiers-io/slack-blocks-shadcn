# Slack real-renderer assets (not committed)

Three files go in this directory; together they let the playground's left
pane mount Slack's actual `BlockKitRenderer`:

- `bundle.js` — serialized webpack factory map extracted from
  `app.slack.com/block-kit-builder/…`. ~58 MB raw (~8 MB gzipped).
- `styles.css` — concatenation of Slack's three stylesheets
  (`slack-kit-gantry-v2`, `block-kit-builder-boot`,
  `helper-gantry-v2`), post-processed so every rule is scoped under
  `.slack-real-renderer`. ~4.5 MB.
- `state.json` — snapshot of Slack's Redux store so Connect HOCs have
  something to read from. ~450 KB.

All three are Slack's intellectual property and are gitignored. To
regenerate:

1. Open `https://app.slack.com/block-kit-builder/<WORKSPACE>` in Chrome
   (signed in).
2. Open DevTools → Console and steal the webpack runtime:
   ```js
   window.webpackChunkwebapp.push([["x"], {}, (r) => { window.__wreq = r; }]);
   ```
3. Run the extraction scripts documented in the repo history (see
   commits touching `SlackRealRenderer.tsx`). The three files land in
   this directory.
4. Reload the playground — the "Switch to real Slack" button in the
   left pane will find them.
