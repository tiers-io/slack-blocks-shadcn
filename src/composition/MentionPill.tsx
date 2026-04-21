import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";
import { useSize } from "../context";
import type { BlockSize } from "../types";

// Pill used for every inline mention kind — user, channel, usergroup,
// @here/@channel/@everyone broadcasts. Colour variant comes from the
// kind of mention; size comes from the ambient <SizeContext>.

const mentionVariants = cva(
  "inline-flex items-center rounded font-medium whitespace-nowrap align-baseline",
  {
    variants: {
      variant: {
        user: "bg-primary/10 text-primary",
        channel: "bg-muted text-foreground",
        usergroup: "bg-secondary text-secondary-foreground",
        broadcast: "bg-destructive/10 text-destructive",
      },
      size: {
        sm: "px-1 text-[11px]",
        default: "px-1.5 text-xs",
        lg: "px-2 text-sm",
      },
    },
    defaultVariants: { variant: "user", size: "default" },
  },
);

export type MentionVariant = NonNullable<
  VariantProps<typeof mentionVariants>["variant"]
>;

export interface MentionPillProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    Omit<VariantProps<typeof mentionVariants>, "size"> {
  /** Override the ambient size from context. */
  size?: BlockSize;
}

export function MentionPill({
  className,
  variant,
  size: sizeProp,
  ...props
}: MentionPillProps) {
  const ambient = useSize();
  const size = sizeProp ?? ambient;
  return (
    <span
      data-slot="mention"
      data-variant={variant}
      className={cn(mentionVariants({ variant, size }), className)}
      {...props}
    />
  );
}
