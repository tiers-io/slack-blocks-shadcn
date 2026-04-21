# @tiers-io/slack-blocks-shadcn

Slack Block Kit → React, rendered with shadcn/ui primitives and design tokens. Configurable `size` (`sm | default | lg`) threads through every block via context.

**This is an internal fork of [`slack-blocks-to-jsx`](https://github.com/themashcodee/slack-blocks-to-jsx) by Manish Panwar (@themashcodee)** — all credit for the original architecture, block/element type coverage, and mrkdwn parsing goes upstream. We hard-forked at `v1.0.4` to rewrite the rendering layer against our own design system.

## Design-token contract

Consumers must expose these Tailwind v4 `@theme` tokens (shadcn/ui convention):

```
--background / --foreground
--card / --card-foreground
--primary / --primary-foreground
--secondary / --secondary-foreground
--muted / --muted-foreground
--accent / --accent-foreground
--destructive
--border / --input / --ring
--radius (+ derived --radius-sm / --radius-md / --radius-lg)
--font-sans / --font-mono
```

## Usage

```tsx
import { Message } from "@tiers-io/slack-blocks-shadcn";

<Message blocks={blocks} withoutWrapper size="default" theme="dark" />
```

## Development

```
pnpm install
pnpm test
pnpm storybook
pnpm build
```

## License

MIT. See `LICENSE` — keeps themashcodee's original copyright alongside tiers-io's.
