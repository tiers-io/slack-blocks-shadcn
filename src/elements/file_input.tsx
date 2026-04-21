import { Paperclip } from "lucide-react";
import { Button } from "../ui/button";
import { useSize } from "../context";
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

export function FileInputElement({ element }: { element: FileInputData }) {
  const size = useSize();
  const filetypes = element.filetypes?.length
    ? element.filetypes.join(", ")
    : "any file";
  return (
    <Button
      variant="outline"
      size={pickerSize(size)}
      disabled
      aria-disabled="true"
      data-element="file_input"
      title="Open in Slack to upload"
      className="gap-2"
    >
      <Paperclip />
      Attach file
      <span className={cn("ml-1 text-muted-foreground")}>({filetypes})</span>
    </Button>
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
