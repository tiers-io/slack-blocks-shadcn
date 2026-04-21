import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Message } from "../../message";
import type { Block } from "../../types";

function inActions(el: Record<string, unknown>) {
  return (
    <Message
      blocks={[{ type: "actions", elements: [el] }] as Block[]}
    />
  );
}

describe("Phase N — real interactive pickers", () => {
  it("datepicker: click opens calendar, pick day → onAction fires ISO date", async () => {
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
                type: "datepicker",
                action_id: "due",
                initial_date: "2026-04-15",
              },
            ],
          },
        ] as Block[]}
      />,
    );
    await user.click(screen.getByRole("button", { name: /2026-04-15/ }));
    // Calendar is visible — grid cells are day numbers. Pick 20.
    const cells = screen.getAllByRole("gridcell");
    const twentieth = cells.find((c) => c.textContent === "20");
    expect(twentieth).toBeDefined();
    await user.click(twentieth!);
    expect(onAction).toHaveBeenCalledWith({
      type: "datepicker",
      action_id: "due",
      selected_date: "2026-04-20",
    });
  });

  it("timepicker: open + set steppers + Set commits HH:mm", async () => {
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
                type: "timepicker",
                action_id: "start",
                initial_time: "09:30",
                timezone: "America/Los_Angeles",
              },
            ],
          },
        ] as Block[]}
      />,
    );
    // Timezone label surfaces
    expect(screen.getByText("America/Los_Angeles")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /09:30/ }));
    const hh = screen.getByLabelText("HH") as HTMLInputElement;
    const mm = screen.getByLabelText("MM") as HTMLInputElement;
    await user.clear(hh);
    await user.type(hh, "14");
    await user.clear(mm);
    await user.type(mm, "05");
    await user.click(screen.getByRole("button", { name: /Set time/ }));
    expect(onAction).toHaveBeenCalledWith({
      type: "timepicker",
      action_id: "start",
      selected_time: "14:05",
    });
  });

  it("datetimepicker: renders label and opens popover with calendar + steppers", async () => {
    const user = userEvent.setup();
    render(inActions({
      type: "datetimepicker",
      action_id: "due",
      initial_date_time: 1776240000,
    }));
    const trigger = document.querySelector('[data-element="datetimepicker"]')!;
    expect(trigger.textContent).toMatch(/2026-/);
    expect(trigger).not.toBeDisabled();
    await user.click(trigger);
    // Calendar grid + HH/MM inputs appear
    expect(screen.getAllByRole("gridcell").length).toBeGreaterThan(0);
    expect(screen.getByLabelText("HH")).toBeInTheDocument();
    expect(screen.getByLabelText("MM")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Set date & time/ })).toBeInTheDocument();
  });

  it("confirm: datepicker opens ConfirmDialog before emit when confirm is present", async () => {
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
                type: "datepicker",
                action_id: "d",
                initial_date: "2026-04-15",
                confirm: {
                  title: { type: "plain_text", text: "Sure?" },
                  text: { type: "plain_text", text: "this freezes the ship date" },
                  confirm: { type: "plain_text", text: "Freeze" },
                  deny: { type: "plain_text", text: "Cancel" },
                  style: "danger",
                },
              },
            ],
          },
        ] as Block[]}
      />,
    );
    await user.click(screen.getByRole("button", { name: /2026-04-15/ }));
    const cells = screen.getAllByRole("gridcell");
    const tenth = cells.find((c) => c.textContent === "10")!;
    await user.click(tenth);
    expect(screen.getByText("Sure?")).toBeInTheDocument();
    expect(onAction).not.toHaveBeenCalled();
    await user.click(screen.getByText("Cancel"));
    expect(onAction).not.toHaveBeenCalled();
  });
});
