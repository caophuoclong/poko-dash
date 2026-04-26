export interface ScheduledPost {
  id: string;
  title: string;
  page: string;
  channel: "facebook" | "instagram" | "tiktok" | "youtube";
  priority: "high" | "medium" | "low";
  scheduledAt: string;
  status: "queued" | "ready";
}

export const scheduledPosts: ScheduledPost[] = [
  {
    id: "sp-001",
    title: "Hướng dẫn sử dụng Poko cho người mới",
    page: "Poko Blog",
    channel: "facebook",
    priority: "medium",
    scheduledAt: "2026-04-18T14:00:00",
    status: "ready",
  },
  {
    id: "sp-002",
    title: "Cập nhật tính năng mới - Lịch đăng thông minh",
    page: "Poko Shop",
    channel: "facebook",
    priority: "high",
    scheduledAt: "2026-04-18T18:00:00",
    status: "queued",
  },
  {
    id: "sp-003",
    title: "Review sản phẩm tháng 4",
    page: "Poko Shop",
    channel: "tiktok",
    priority: "high",
    scheduledAt: "2026-04-20T09:00:00",
    status: "queued",
  },
  {
    id: "sp-004",
    title: "Tips tăng tương tác Facebook Page",
    page: "Poko Blog",
    channel: "facebook",
    priority: "low",
    scheduledAt: "2026-04-22T10:00:00",
    status: "ready",
  },
  {
    id: "sp-005",
    title: "Flash sale cuối tuần",
    page: "Poko Shop",
    channel: "instagram",
    priority: "high",
    scheduledAt: "2026-04-25T08:00:00",
    status: "queued",
  },
  {
    id: "sp-006",
    title: "Top 5 deal dưới 200k",
    page: "Poko Community",
    channel: "facebook",
    priority: "medium",
    scheduledAt: "2026-04-25T16:30:00",
    status: "queued",
  },
  {
    id: "sp-007",
    title: "Behind the scenes: đóng gói đơn hàng",
    page: "Poko Shop",
    channel: "youtube",
    priority: "low",
    scheduledAt: "2026-04-27T20:00:00",
    status: "ready",
  },
];
