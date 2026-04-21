import {
  File as FileIcon,
  FileText,
  Image as ImageIcon,
  Video as VideoIcon,
  FileAudio,
  FileArchive,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "../ui/card";
import { sizing } from "../sizing";
import { useSize } from "../context";
import { cn } from "../utils/cn";

// Slack's `file` block is an opaque reference to an uploaded Slack file.
// We don't have mime locally so infer from the filename extension.

export interface FileBlockData {
  type: "file";
  block_id?: string;
  external_id?: string;
  file_id?: string;
  source?: string;
  // Commonly attached via `beeper_slack_file` extras — fall back to either.
  file?: {
    name?: string;
    title?: string;
    mimetype?: string;
    size?: number;
    url_private?: string;
    permalink?: string;
  };
}

const EXT_TO_ICON: Record<string, LucideIcon> = {
  png: ImageIcon,
  jpg: ImageIcon,
  jpeg: ImageIcon,
  gif: ImageIcon,
  webp: ImageIcon,
  svg: ImageIcon,
  mp4: VideoIcon,
  mov: VideoIcon,
  webm: VideoIcon,
  mp3: FileAudio,
  wav: FileAudio,
  zip: FileArchive,
  tar: FileArchive,
  gz: FileArchive,
  txt: FileText,
  md: FileText,
  pdf: FileText,
  doc: FileText,
  docx: FileText,
};

function iconFor(name?: string, mime?: string): LucideIcon {
  if (mime?.startsWith("image/")) return ImageIcon;
  if (mime?.startsWith("video/")) return VideoIcon;
  if (mime?.startsWith("audio/")) return FileAudio;
  if (!name) return FileIcon;
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  return EXT_TO_ICON[ext] ?? FileIcon;
}

function formatSize(bytes?: number): string | null {
  if (bytes == null || Number.isNaN(bytes)) return null;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
}

export function FileBlock({ block }: { block: FileBlockData }) {
  const size = useSize();
  const meta = block.file ?? {};
  const name = meta.title ?? meta.name ?? "File";
  const Icon = iconFor(meta.name, meta.mimetype);
  const sizeStr = formatSize(meta.size);
  const href = meta.permalink ?? meta.url_private;
  return (
    <Card data-block="file" className="flex-row items-center gap-3 p-3">
      <Icon className={cn("shrink-0 text-muted-foreground", sizing[size].icon)} />
      <div className="min-w-0 flex-1">
        <div className={cn("truncate font-medium", sizing[size].body)}>
          {name}
        </div>
        <div
          className={cn(
            "flex items-center gap-2 text-muted-foreground",
            sizing[size].secondary,
          )}
        >
          {meta.mimetype ? <span>{meta.mimetype}</span> : null}
          {sizeStr ? <span>· {sizeStr}</span> : null}
        </div>
      </div>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className={cn(
            "text-primary hover:underline",
            sizing[size].secondary,
          )}
        >
          Open in Slack
        </a>
      ) : null}
    </Card>
  );
}
