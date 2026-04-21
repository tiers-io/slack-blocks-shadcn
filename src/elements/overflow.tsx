import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { Popover } from "../ui/popover";
import { useComponent, useOnAction } from "../components-registry";
import { cn } from "../utils/cn";
import type { ConfirmDialogSpec } from "../composition/ConfirmDialog";
import type { TextObject } from "../types";

export interface OverflowOption {
  text: TextObject;
  value: string;
  url?: string;
  description?: TextObject;
}

export interface OverflowData {
  type: "overflow";
  action_id: string;
  options: OverflowOption[];
  confirm?: ConfirmDialogSpec;
}

function textOf(t: TextObject): string {
  return t.text;
}

export function OverflowMenu({ element }: { element: OverflowData }) {
  const onAction = useOnAction();
  const ConfirmDialog = useComponent("ConfirmDialog");
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<OverflowOption | null>(null);

  const emit = (opt: OverflowOption) => {
    if (opt.url) {
      window.open(opt.url, "_blank", "noopener,noreferrer");
      return;
    }
    onAction?.({
      type: "overflow",
      action_id: element.action_id,
      selected_option: { value: opt.value, text: textOf(opt.text) },
    });
  };

  const commit = (opt: OverflowOption) => {
    setOpen(false);
    if (element.confirm && !opt.url) {
      setPending(opt);
      return;
    }
    emit(opt);
  };

  return (
    <>
      <Popover
        open={open}
        onOpenChange={setOpen}
        align="end"
        contentClassName="min-w-[10rem] p-1"
        trigger={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Overflow menu"
            aria-haspopup="menu"
            aria-expanded={open}
            data-element="overflow"
            onClick={() => setOpen(!open)}
          >
            <MoreHorizontal />
          </Button>
        }
      >
        <ul role="menu" className="flex flex-col">
          {element.options.map((opt, i) => (
            <li key={i} role="none">
              <button
                type="button"
                role="menuitem"
                onClick={() => commit(opt)}
                className={cn(
                  "flex w-full cursor-pointer items-start gap-2 rounded-sm px-2 py-1.5 text-left text-sm outline-none",
                  "hover:bg-accent focus-visible:bg-accent",
                )}
              >
                <span className="flex-1">
                  <span className="block text-foreground">
                    {textOf(opt.text)}
                  </span>
                  {opt.description ? (
                    <span className="block text-xs text-muted-foreground">
                      {textOf(opt.description)}
                    </span>
                  ) : null}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Popover>
      {element.confirm ? (
        <ConfirmDialog
          open={pending !== null}
          onOpenChange={(v) => !v && setPending(null)}
          spec={element.confirm}
          onConfirm={() => {
            if (pending) emit(pending);
            setPending(null);
          }}
          onDeny={() => setPending(null)}
        />
      ) : null}
    </>
  );
}
