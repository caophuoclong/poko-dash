import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

interface SortIndicatorProps {
  sorted: false | "asc" | "desc";
}

export function SortIndicator({ sorted }: SortIndicatorProps) {
  if (sorted === "asc") return <ArrowUp size={11} className="text-near-white" />;
  if (sorted === "desc") return <ArrowDown size={11} className="text-near-white" />;
  return <ArrowUpDown size={11} className="text-dark-muted" />;
}
