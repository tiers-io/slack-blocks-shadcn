import { createContext, useContext, type ReactNode } from "react";
import type { BlockSize } from "./types";

// Three contexts thread through the whole render tree so deeply-nested
// blocks/elements inherit size, hooks, and ambient data without prop
// drilling. Consumers pass overrides at the <Message> root; anything
// omitted falls back to sensible defaults.

export interface HookUser {
  user_id: string;
  name?: string;
  avatar?: string | null;
}
export interface HookChannel {
  channel_id: string;
  name?: string;
}
export interface HookUsergroup {
  usergroup_id: string;
  name?: string;
}
export interface HookLinkInput {
  href: string;
  children: ReactNode;
  className?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: string;
}
export interface HookEmoji {
  name: string;
  unicode?: string;
  skin_tone?: 1 | 2 | 3 | 4 | 5 | 6;
}
export interface HookDate {
  timestamp: string;
  format: string;
  link: string | null;
  fallback: string;
}

export interface Hooks {
  user?: (data: HookUser) => ReactNode;
  channel?: (data: HookChannel) => ReactNode;
  usergroup?: (data: HookUsergroup) => ReactNode;
  atChannel?: () => ReactNode;
  atEveryone?: () => ReactNode;
  atHere?: () => ReactNode;
  emoji?: (data: HookEmoji, parse: (data: HookEmoji) => string) => ReactNode;
  date?: (data: HookDate) => ReactNode;
  link?: (input: HookLinkInput) => ReactNode;
}

export interface DataUser {
  id: string;
  name: string;
  avatar?: string;
}
export interface DataChannel {
  id: string;
  name: string;
}
export interface DataUserGroup {
  id: string;
  name: string;
}
export interface Data {
  users?: DataUser[];
  channels?: DataChannel[];
  user_groups?: DataUserGroup[];
}

export const SizeContext = createContext<BlockSize>("default");
export const HooksContext = createContext<Hooks>({});
export const DataContext = createContext<Data>({});

export function useSize(): BlockSize {
  return useContext(SizeContext);
}
export function useHooks(): Hooks {
  return useContext(HooksContext);
}
export function useData(): Data {
  return useContext(DataContext);
}
