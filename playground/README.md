# playground

Side-by-side parity harness. Left pane renders blocks with
[`slack-blocks-to-jsx@1.0.4`](https://github.com/themashcodee/slack-blocks-to-jsx)
(upstream); right pane renders the same blocks with our fork
`@tiers-io/slack-blocks-shadcn` (aliased to `../src/index.ts` via Vite).

## Run

```
pnpm install
pnpm dev     # http://localhost:5180
```

## What's in it

- Live JSON editor of the `blocks[]` array
- Built-in fixture picker (welcome / rich text / fields / interactive /
  image / markdown GFM / inputs)
- Size toggle (`sm` / `default` / `lg`) — ours only
- Dark-mode toggle (applies to both panes)
- `onAction` log (ours) — click a button / pick a date / toggle a
  checkbox and watch the payload stream in

## Adding fixtures

Drop a new entry in `src/fixtures/index.ts`. Each fixture is just a
name, description, and a raw `blocks[]` array.
