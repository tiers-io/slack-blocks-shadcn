import type { Preview } from "@storybook/react-vite";

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "tiers-dark",
      values: [
        { name: "tiers-dark", value: "oklch(0.13 0 0)" },
        { name: "tiers-light", value: "oklch(1 0 0)" },
      ],
    },
  },
};

export default preview;
