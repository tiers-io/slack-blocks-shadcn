import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import type { PlainTextObject, TextObject } from "../types";

// Slack's ConfirmDialog object lives on interactive elements (buttons,
// selects, pickers, checkboxes, etc.). Upstream renders a modal with
// `title / text / confirm / deny` and a `style` of "primary"|"danger"
// that changes only the confirm button's variant. We match that
// exactly — headless primitives from src/ui/dialog.tsx, shadcn Button.

export interface ConfirmDialogSpec {
  title: PlainTextObject;
  text: TextObject;
  confirm: PlainTextObject;
  deny: PlainTextObject;
  style?: "primary" | "danger";
}

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  spec: ConfirmDialogSpec;
  onConfirm: () => void;
  onDeny?: () => void;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  spec,
  onConfirm,
  onDeny,
}: ConfirmDialogProps) {
  const confirmVariant =
    spec.style === "danger"
      ? "destructive"
      : spec.style === "primary"
        ? "default"
        : "default";
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-confirm-dialog
        onClose={() => {
          onDeny?.();
          onOpenChange(false);
        }}
      >
        <DialogHeader>
          <DialogTitle>{spec.title.text}</DialogTitle>
          <DialogDescription>
            {spec.text.type === "plain_text"
              ? spec.text.text
              : spec.text.text}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onDeny?.();
              onOpenChange(false);
            }}
          >
            {spec.deny.text}
          </Button>
          <Button
            variant={confirmVariant}
            size="sm"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {spec.confirm.text}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
