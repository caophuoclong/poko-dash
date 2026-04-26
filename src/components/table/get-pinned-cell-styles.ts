import type { CSSProperties } from "react";
import type { Table } from "@tanstack/react-table";
import type { PinnedOffsetInfo } from "./types";

interface PinnedStyleOptions {
  isPinned: "left" | "right" | false;
  offset: number;
  backgroundColor?: string;
}

export function getPinnedCellStyles(options: PinnedStyleOptions): CSSProperties | undefined {
  const { isPinned, offset, backgroundColor = "var(--t-surface)" } = options;

  if (isPinned === "left") {
    return { position: "sticky", left: offset, zIndex: 1, backgroundColor };
  }
  if (isPinned === "right") {
    return { position: "sticky", right: offset, zIndex: 1, backgroundColor };
  }
  return undefined;
}

export function calculatePinnedOffsets<TData>(
  table: Table<TData>,
): Map<string, PinnedOffsetInfo> {
  const map = new Map<string, PinnedOffsetInfo>();
  const headers = table.getHeaderGroups()[0]?.headers ?? [];

  let leftOffset = 0;
  for (const h of headers) {
    if (h.column.getIsPinned() === "left") {
      map.set(h.column.id, { side: "left", offset: leftOffset });
      leftOffset += h.getSize();
    }
  }

  let rightOffset = 0;
  for (let i = headers.length - 1; i >= 0; i--) {
    const h = headers[i]!;
    if (h.column.getIsPinned() === "right") {
      map.set(h.column.id, { side: "right", offset: rightOffset });
      rightOffset += h.getSize();
    }
  }

  return map;
}
