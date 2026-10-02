import { Fragment, type ReactNode } from "react";
import { t } from "./t.ts";
import type { Translation } from "./en.ts";

type TagsOf<S extends string> =
  S extends `${string}[${infer Tag}:${string}]${infer Rest}`
    ? Tag | TagsOf<Rest>
    : S extends `${string}[${infer Tag}]${infer Rest}`
      ? Tag | TagsOf<Rest>
      : never;

type ChunkRenderer = (text: string) => ReactNode;

export function td<K extends keyof Translation & string>(
  key: K,
  tags: Record<TagsOf<Translation[K]>, ChunkRenderer>,
): ReactNode {
  const template = t(key);
  const parts = template.split(/(\[[a-zA-Z_]+(?::[^\]]*)?\])/g);

  return parts.map((part, i) => {
    const match = part.match(/^\[([a-zA-Z_]+)(?::([^\]]*))?\]$/);
    if (!match) return part;
    const [, tag, content = ""] = match;
    const render = tags[tag as TagsOf<Translation[K]>];
    if (!render) return content;
    return <Fragment key={i}>{render(content)}</Fragment>;
  });
}
