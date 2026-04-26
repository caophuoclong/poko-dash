export function parseDelimitedList(raw?: string, delimiter: string = ";"): string[] {
  if (!raw || !raw.trim()) return [];
  return raw
    .split(delimiter)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function parsePrice(raw?: string): number {
  if (!raw || !raw.trim()) return 0;
  const cleaned = raw
    .replace(/[dDđĐ₫]/g, "")
    .replace(/\./g, "")
    .replace(/\s/g, "")
    .replace(/\[.*?\]/g, "");
  const n = Number(cleaned);
  return isNaN(n) ? 0 : n;
}

export function formatPriceNum(n: number): string {
  if (n === 0) return "—";
  return n.toLocaleString("vi-VN") + "đ";
}

export function parsePriceRange(raw?: string): { min: number; max: number } {
  if (!raw || !raw.trim()) return { min: 0, max: 0 };
  const bracketMatch = raw.match(/\[(.*?)\]\s*-\s*\[(.*?)\]/);
  if (bracketMatch) {
    return {
      min: parsePrice(bracketMatch[1]),
      max: parsePrice(bracketMatch[2]),
    };
  }
  const dashMatch = raw.match(/(.*?)\s*-\s*(.*)/);
  if (dashMatch) {
    return {
      min: parsePrice(dashMatch[1]),
      max: parsePrice(dashMatch[2]),
    };
  }
  const single = parsePrice(raw);
  return { min: single, max: single };
}

export function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  try {
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

export function dash(value?: string | null): string {
  if (value === undefined || value === null || value === "") return "—";
  return value;
}

export function truncateUrl(url: string, maxLen: number = 60): string {
  if (url.length <= maxLen) return url;
  return url.slice(0, maxLen - 3) + "...";
}

export function scoreColor(score: number): string {
  if (score >= 80) return "text-accent-green";
  if (score >= 50) return "text-accent-yellow";
  return "text-accent-red";
}

export function scoreBg(score: number): string {
  if (score >= 80) return "bg-accent-green-dim";
  if (score >= 50) return "bg-accent-yellow/10";
  return "bg-accent-red/10";
}
