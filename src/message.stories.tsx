import type { Meta, StoryObj } from "@storybook/react-vite";
import { Message } from "./message";

const meta: Meta<typeof Message> = {
  title: "Scaffold/Message",
  component: Message,
};

export default meta;

export const Empty: StoryObj<typeof Message> = {
  args: {
    blocks: [],
    size: "default",
  },
};
