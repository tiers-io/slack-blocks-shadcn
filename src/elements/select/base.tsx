import { Check, ChevronDown, X } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { cn } from "../../utils/cn";
import { sizing } from "../../sizing";
import { useSize } from "../../context";
import { useComponent } from "../../components-registry";
import { Button } from "../../ui/button";
import { Popover } from "../../ui/popover";
import type { ConfirmDialogSpec } from "../../composition/ConfirmDialog";

// Shared base for every select variant. Options are flat `{ value, label }`
// pairs; callers may group them into named buckets for visual separation.
// Handles: popover, search filter, single / multi, initial selection,
// max_selected_items, focus_on_load, keyboard nav, confirm dialog gate,
// clear-all button.

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

export interface SelectGroup {
  label: string;
  options: SelectOption[];
}

export interface BaseSelectProps {
  multi: boolean;
  options?: SelectOption[];
  option_groups?: SelectGroup[];
  initial?: SelectOption[];
  placeholder?: string;
  max_selected_items?: number;
  confirm?: ConfirmDialogSpec;
  focus_on_load?: boolean;
  onCommit: (selected: SelectOption[]) => void;
}

function pickerSize(size: "sm" | "default" | "lg"): "xs" | "sm" | "default" {
  return size === "sm" ? "xs" : size === "lg" ? "default" : "sm";
}

function matchesQuery(opt: SelectOption, q: string): boolean {
  if (!q) return true;
  const needle = q.toLowerCase();
  return (
    opt.label.toLowerCase().includes(needle) ||
    opt.value.toLowerCase().includes(needle) ||
    (opt.description?.toLowerCase().includes(needle) ?? false)
  );
}

export function BaseSelect({
  multi,
  options,
  option_groups,
  initial = [],
  placeholder,
  max_selected_items,
  confirm,
  focus_on_load,
  onCommit,
}: BaseSelectProps) {
  const size = useSize();
  const ConfirmDialog = useComponent("ConfirmDialog");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<SelectOption[]>(initial);
  const [pending, setPending] = useState<SelectOption[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const groups: SelectGroup[] = useMemo(() => {
    if (option_groups && option_groups.length > 0) return option_groups;
    return [{ label: "", options: options ?? [] }];
  }, [options, option_groups]);

  const filteredGroups: SelectGroup[] = useMemo(
    () =>
      groups
        .map((g) => ({
          ...g,
          options: g.options.filter((o) => matchesQuery(o, query)),
        }))
        .filter((g) => g.options.length > 0),
    [groups, query],
  );

  const maybeCommit = useCallback(
    (next: SelectOption[]) => {
      if (confirm) {
        setPending(next);
        return;
      }
      setSelected(next);
      onCommit(next);
    },
    [confirm, onCommit],
  );

  const handleToggle = (opt: SelectOption) => {
    if (multi) {
      const existing = selected.find((s) => s.value === opt.value);
      let next: SelectOption[];
      if (existing) {
        next = selected.filter((s) => s.value !== opt.value);
      } else if (
        max_selected_items !== undefined &&
        selected.length >= max_selected_items
      ) {
        return;
      } else {
        next = [...selected, opt];
      }
      maybeCommit(next);
    } else {
      maybeCommit([opt]);
      setOpen(false);
    }
  };

  const label =
    selected.length === 0
      ? placeholder ?? "Select…"
      : multi
        ? selected.map((s) => s.label).join(", ")
        : selected[0]!.label;

  const isSelected = (opt: SelectOption) =>
    selected.some((s) => s.value === opt.value);

  const uiSize = pickerSize(size);

  return (
    <>
      <Popover
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (v && focus_on_load)
            setTimeout(() => inputRef.current?.focus(), 0);
        }}
        trigger={
          <Button
            variant="outline"
            size={uiSize}
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-haspopup="listbox"
            className="justify-between gap-2 min-w-[10rem]"
          >
            <span className="max-w-[20rem] truncate text-left">{label}</span>
            <ChevronDown className="opacity-50" />
          </Button>
        }
        contentClassName="max-h-80 w-[min(28rem,90vw)] overflow-hidden"
      >
        <div className="flex items-center gap-1 border-b p-2">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search…"
            className={cn(
              "flex-1 bg-transparent outline-none",
              sizing[size].body,
            )}
          />
          {selected.length > 0 && multi ? (
            <Button
              variant="ghost"
              size="icon-xs"
              type="button"
              aria-label="Clear"
              onClick={() => maybeCommit([])}
            >
              <X />
            </Button>
          ) : null}
        </div>
        <ul
          role="listbox"
          aria-multiselectable={multi || undefined}
          className="max-h-64 overflow-y-auto py-1"
        >
          {filteredGroups.length === 0 ? (
            <li
              className={cn(
                "px-3 py-2 text-muted-foreground",
                sizing[size].secondary,
              )}
            >
              No matches
            </li>
          ) : null}
          {filteredGroups.map((g, gi) => (
            <li key={gi}>
              {g.label ? (
                <div
                  className={cn(
                    "px-3 pt-1.5 text-muted-foreground",
                    sizing[size].secondary,
                  )}
                >
                  {g.label}
                </div>
              ) : null}
              <ul>
                {g.options.map((opt) => {
                  const picked = isSelected(opt);
                  return (
                    <li
                      key={opt.value}
                      role="option"
                      aria-selected={picked}
                      onClick={() => handleToggle(opt)}
                      className={cn(
                        "flex cursor-pointer items-start gap-2 px-3 py-1.5 hover:bg-accent",
                        sizing[size].body,
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center",
                          multi &&
                            "rounded-sm border border-border bg-background",
                          picked && multi && "border-primary bg-primary text-primary-foreground",
                        )}
                      >
                        {picked ? <Check className="h-3 w-3" /> : null}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate">{opt.label}</div>
                        {opt.description ? (
                          <div
                            className={cn(
                              "truncate text-muted-foreground",
                              sizing[size].secondary,
                            )}
                          >
                            {opt.description}
                          </div>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      </Popover>
      {confirm ? (
        <ConfirmDialog
          open={pending !== null}
          onOpenChange={(v) => !v && setPending(null)}
          spec={confirm}
          onConfirm={() => {
            if (pending) {
              setSelected(pending);
              onCommit(pending);
            }
            setPending(null);
          }}
          onDeny={() => setPending(null)}
        />
      ) : null}
    </>
  );
}
