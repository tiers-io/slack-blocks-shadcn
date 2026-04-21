import { useRef, useState } from "react";
import { Paperclip } from "lucide-react";
import { Button } from "../ui/button";
import { useSize } from "../context";
import { useOnAction } from "../components-registry";
import { cn } from "../utils/cn";

export interface FileInputData {
  type: "file_input";
  action_id: string;
  filetypes?: string[];
  max_files?: number;
}

export interface UrlSourceData {
  type: "url_source";
  action_id?: string;
  url?: string;
}

function pickerSize(size: "sm" | "default" | "lg") {
  return size === "sm" ? "xs" : size === "lg" ? "default" : "sm";
}

function buildAccept(filetypes?: string[]): string | undefined {
  if (!filetypes || filetypes.length === 0) return undefined;
  return filetypes
    .map((t) => (t.startsWith(".") || t.includes("/") ? t : `.${t}`))
    .join(",");
}

export function FileInputElement({ element }: { element: FileInputData }) {
  const size = useSize();
  const onAction = useOnAction();
  const inputRef = useRef<HTMLInputElement>(null);
  const [picked, setPicked] = useState<File[]>([]);
  const multiple = (element.max_files ?? 1) > 1;
  const accept = buildAccept(element.filetypes);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = Array.from(e.target.files ?? []);
    const limited = element.max_files ? list.slice(0, element.max_files) : list;
    setPicked(limited);
    onAction?.({
      type: "file_input",
      action_id: element.action_id,
      files: limited.map((f) => ({
        name: f.name,
        size: f.size,
        type: f.type,
      })),
    });
  };

  const label =
    picked.length === 0
      ? "Attach file"
      : picked.length === 1
        ? (picked[0]?.name ?? "1 file")
        : `${picked.length} files`;

  const typeHint = element.filetypes?.length
    ? element.filetypes.join(", ")
    : undefined;

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size={pickerSize(size)}
        data-element="file_input"
        className="gap-2"
        onClick={() => inputRef.current?.click()}
      >
        <Paperclip />
        {label}
        {typeHint ? (
          <span className={cn("ml-1 text-muted-foreground")}>({typeHint})</span>
        ) : null}
      </Button>
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
        multiple={multiple}
        accept={accept}
        onChange={onChange}
        data-element="file_input_hidden"
        data-action-id={element.action_id}
      />
    </>
  );
}

export function UrlSourceElement({ element }: { element: UrlSourceData }) {
  const size = useSize();
  return (
    <Button
      variant="outline"
      size={pickerSize(size)}
      disabled
      aria-disabled="true"
      data-element="url_source"
      title="Open in Slack to change"
    >
      {element.url ?? "URL source"}
    </Button>
  );
}
