import type { Meta, StoryObj } from "@storybook/react-vite";
import { Message } from "../message";
import sectionBasic from "../../fixtures/section-basic.json";
import sectionFields from "../../fixtures/section-fields.json";
import headerDivider from "../../fixtures/header-and-divider.json";
import contextMixed from "../../fixtures/context-mixed.json";
import imageCaptioned from "../../fixtures/image-captioned.json";
import type { Block, BlockSize } from "../types";

const meta: Meta<typeof Message> = {
  title: "Blocks/Core (Phase B)",
  component: Message,
  argTypes: {
    size: {
      control: "radio",
      options: ["sm", "default", "lg"] satisfies BlockSize[],
    },
  },
};

export default meta;

const kitchenSink = [
  ...(headerDivider as Block[]),
  ...(sectionBasic as Block[]),
  ...(sectionFields as Block[]),
  ...(contextMixed as Block[]),
  ...(imageCaptioned as Block[]),
];

export const SectionBasic: StoryObj<typeof Message> = {
  args: { blocks: sectionBasic as Block[], size: "default" },
};

export const SectionFields: StoryObj<typeof Message> = {
  args: { blocks: sectionFields as Block[], size: "default" },
};

export const HeaderAndDivider: StoryObj<typeof Message> = {
  args: { blocks: headerDivider as Block[], size: "default" },
};

export const ContextMixed: StoryObj<typeof Message> = {
  args: { blocks: contextMixed as Block[], size: "default" },
};

export const ImageCaptioned: StoryObj<typeof Message> = {
  args: { blocks: imageCaptioned as Block[], size: "default" },
};

export const KitchenSinkSm: StoryObj<typeof Message> = {
  args: { blocks: kitchenSink, size: "sm" },
};

export const KitchenSinkDefault: StoryObj<typeof Message> = {
  args: { blocks: kitchenSink, size: "default" },
};

export const KitchenSinkLg: StoryObj<typeof Message> = {
  args: { blocks: kitchenSink, size: "lg" },
};
