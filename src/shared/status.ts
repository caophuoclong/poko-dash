import type { BadgeTone } from "@/components/ui/badge";

export interface StatusMeta {
  label: string;
  tone: BadgeTone;
}

export const POST_STATUS: Record<string, StatusMeta> = {
  draft: { label: "Nháp", tone: "neutral" },
  approved: { label: "Đã duyệt", tone: "green" },
  queued: { label: "Trong hàng đợi", tone: "blue" },
  published: { label: "Đã đăng", tone: "green" },
  archived: { label: "Lưu trữ", tone: "neutral" },
};

export const PRODUCT_STATUS: Record<string, StatusMeta> = {
  active: { label: "Đang hoạt động", tone: "green" },
  processing: { label: "Đang xử lý", tone: "yellow" },
  done: { label: "Hoàn tất", tone: "blue" },
  failed: { label: "Thất bại", tone: "red" },
};

export const EXECUTION_STATUS: Record<string, StatusMeta> = {
  pending: { label: "Đang chờ", tone: "neutral" },
  running: { label: "Đang chạy", tone: "blue" },
  success: { label: "Thành công", tone: "green" },
  completed: { label: "Hoàn tất", tone: "green" },
  failed: { label: "Thất bại", tone: "red" },
  cancelled: { label: "Đã huỷ", tone: "neutral" },
};

export const WORKFLOW_TRIGGER: Record<string, StatusMeta> = {
  manual: { label: "Manual", tone: "orange" },
  cron: { label: "Cron", tone: "blue" },
  webhook: { label: "Webhook", tone: "green" },
  db_event: { label: "DB Event", tone: "purple" },
};

export function getStatusMeta(
  map: Record<string, StatusMeta>,
  key: string | null | undefined,
  fallback: StatusMeta = { label: key ?? "Unknown", tone: "neutral" },
): StatusMeta {
  if (!key) return fallback;
  return map[key] ?? { ...fallback, label: key };
}
