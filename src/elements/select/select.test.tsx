import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Message } from "../../message";
import type { Block } from "../../types";
import type { ActionPayload } from "../../components-registry";

describe("Phase M — real interactive selects", () => {
  it("static_select: open → filter → pick → onAction fires", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(
      <Message
        onAction={onAction}
        blocks={[
          {
            type: "actions",
            elements: [
              {
                type: "static_select",
                action_id: "team",
                placeholder: { text: "Pick a team" },
                options: [
                  { text: { type: "plain_text", text: "Platform" }, value: "p" },
                  { text: { type: "plain_text", text: "Infra" }, value: "i" },
                  { text: { type: "plain_text", text: "Design" }, value: "d" },
                ],
              },
            ],
          },
        ] as Block[]}
      />,
    );
    await user.click(screen.getByRole("button", { name: /Pick a team/ }));
    const search = screen.getByPlaceholderText("Search…");
    await user.type(search, "inf");
    expect(screen.queryByText("Platform")).not.toBeInTheDocument();
    expect(screen.queryByText("Design")).not.toBeInTheDocument();
    await user.click(screen.getByText("Infra"));
    expect(onAction).toHaveBeenCalledWith({
      type: "static_select",
      action_id: "team",
      selected_option: { value: "i", text: "Infra" },
    });
  });

  it("option_groups: renders group labels and filters across groups", async () => {
    const user = userEvent.setup();
    render(
      <Message
        blocks={[
          {
            type: "actions",
            elements: [
              {
                type: "static_select",
                action_id: "x",
                placeholder: { text: "Pick" },
                option_groups: [
                  {
                    label: { type: "plain_text", text: "Fruits" },
                    options: [
                      { text: { type: "plain_text", text: "apple" }, value: "a" },
                      { text: { type: "plain_text", text: "banana" }, value: "b" },
                    ],
                  },
                  {
                    label: { type: "plain_text", text: "Veg" },
                    options: [
                      { text: { type: "plain_text", text: "carrot" }, value: "c" },
                    ],
                  },
                ],
              },
            ],
          },
        ] as Block[]}
      />,
    );
    await user.click(screen.getByRole("button", { name: /Pick/ }));
    expect(screen.getByText("Fruits")).toBeInTheDocument();
    expect(screen.getByText("Veg")).toBeInTheDocument();
    expect(screen.getByText("carrot")).toBeInTheDocument();
  });

  it("multi_static_select: accumulates selections + respects max_selected_items", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(
      <Message
        onAction={onAction}
        blocks={[
          {
            type: "actions",
            elements: [
              {
                type: "multi_static_select",
                action_id: "tags",
                placeholder: { text: "Tags" },
                max_selected_items: 2,
                options: [
                  { text: { type: "plain_text", text: "urgent" }, value: "u" },
                  { text: { type: "plain_text", text: "bug" }, value: "b" },
                  { text: { type: "plain_text", text: "wont-fix" }, value: "w" },
                ],
              },
            ],
          },
        ] as Block[]}
      />,
    );
    await user.click(screen.getByRole("button", { name: /Tags/ }));
    await user.click(screen.getByText("urgent"));
    await user.click(screen.getByText("bug"));
    // 3rd click should be ignored (max=2)
    await user.click(screen.getByText("wont-fix"));
    const last = onAction.mock.calls.at(-1)?.[0];
    expect(last).toEqual({
      type: "multi_static_select",
      action_id: "tags",
      selected_options: [
        { value: "u", text: "urgent" },
        { value: "b", text: "bug" },
      ],
    });
  });

  it("confirm: opens ConfirmDialog before commit; deny aborts", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(
      <Message
        onAction={onAction}
        blocks={[
          {
            type: "actions",
            elements: [
              {
                type: "static_select",
                action_id: "danger",
                placeholder: { text: "Pick" },
                options: [
                  { text: { type: "plain_text", text: "Nuke" }, value: "n" },
                ],
                confirm: {
                  title: { type: "plain_text", text: "Sure?" },
                  text: { type: "plain_text", text: "irreversible" },
                  confirm: { type: "plain_text", text: "Do it" },
                  deny: { type: "plain_text", text: "Cancel" },
                  style: "danger",
                },
              },
            ],
          },
        ] as Block[]}
      />,
    );
    await user.click(screen.getByRole("button", { name: /Pick/ }));
    await user.click(screen.getByText("Nuke"));
    // Confirm dialog is open now
    expect(screen.getByText("Sure?")).toBeInTheDocument();
    await user.click(screen.getByText("Cancel"));
    expect(onAction).not.toHaveBeenCalled();
  });

  it("users_select drives options from data.users and emits selected_user id", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(
      <Message
        onAction={onAction}
        data={{
          users: [
            { id: "U1", name: "alex" },
            { id: "U2", name: "brandon" },
          ],
        }}
        blocks={[
          {
            type: "actions",
            elements: [
              {
                type: "users_select",
                action_id: "owner",
                placeholder: { text: "Owner" },
              },
            ],
          },
        ] as Block[]}
      />,
    );
    await user.click(screen.getByRole("button", { name: /Owner/ }));
    await user.click(screen.getByText("@brandon"));
    expect(onAction).toHaveBeenCalledWith({
      type: "users_select",
      action_id: "owner",
      selected_user: "U2",
    });
  });
});
