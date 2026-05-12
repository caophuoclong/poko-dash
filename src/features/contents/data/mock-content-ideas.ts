import type { ContentIdeaEntity } from '../schemas/content.schema'
import { IdeaType, IdeaStatus, TargetPlatform } from '../schemas/content.schema'

const HOOKS = [
  '5 sai lầm khi mua tai nghe Bluetooth dưới 500K',
  'So sánh AirPods Pro vs Galaxy Buds FE: Đáng tiền nhất?',
  'Top 7 máy hút bụi mini giá rẻ cho sinh viên 2024',
  'Review Realme Note 50 sau 30 ngày sử dụng thực tế',
  'Combo đồ gia dụng thông minh tiết kiệm điện tháng 7',
  'Xu hướng fashion rental đang bùng nổ tại Việt Nam',
  'Hướng dẫn chọn serum Vitamin C phù hợp mọi loại da',
  'Deal hời: Bộ dumbbelladjustable giảm 40% hôm nay',
  'Tổng hợp 10 phụ kiện xe hơi bán chạy nhất Shopee',
  'Camera hành trình nào tốt dưới 2 triệu? So sánh top 5',
  'Đánh giá Xiaomi Robot Vacuum S10+ tự đổ rác',
  'Top 3 áo khoác gió trending mùa mưa cho Gen Z',
  'Review sạc dự án Anker 737 PowerCore 24000mAh',
  'Bí quyết mix đồ với oversized blazer cho nàng công sở',
  'So sánh DJI Mini 4 Pro vs Autel EVO Lite+',
  'Hướng dẫn setup góc quay TikTok sản phẩm tại nhà',
  '5 sản phẩm làm sạch da best-seller trên TikTok Shop',
  'Deal Flash Sale 7/7: iPad Gen 10 giá tốt nhất năm',
  'Trending: Bàn phím cơ custom Artisan keycap handmade',
  'Review lò nướng khí nén Philips HD6975 sau 2 tháng',
  'So sánh các dòng tã quần cho bé: Huggies vs Moony vs Bobby',
  'Hướng dẫn chọn giày chạy bộ phù hợp cho người mới',
  'Top 5 máy xay sinh tố đa năng dưới 1 triệu',
  'Deal tuần lễ vàng: Tivi Samsung 55 inch giảm sốc',
  'Xu hướng dùng tẩy trang dầu Cleansing Oil năm nay',
  'Review bạt ngủ tự bơm hơi cho chuyến cắm trại',
  'So sánh bàn chải điện Oral-B vs Philips Sonicare',
  'Hướng dẫn chọn balo laptop chống sốc cho dev',
  'Tổng hợp deal back-to-school: Laptop, tablet, phụ kiện',
  '5 món đồ home gym nhỏ gọn tập hiệu quả tại nhà',
]

const ANGLES = [
  'Tập trung vào giá trị thực tế, không bị mê hoặc bởi thông số marketing',
  'So sánh trực tiếp với đối thủ cùng tầm giá, nêu rõ ưu/nhược điểm',
  'Đóng vai người dùng phổ thông, review chân thật không được tài trợ',
  'Nhấn mạnh vào tính năng độc quyền mà đối thủ không có',
  'Tập trung vào bài toán tiết kiệm chi phí dài hạn cho người dùng',
  'Góc nhìn từ cộng đồng review độc lập, tổng hợp feedback thực tế',
  'Nhấn mạnh thiết kế và tính thẩm mỹ phù hợp với Gen Z',
  'Tập trung vào trải nghiệm unpacking và first impression',
  'So sánh hiệu năng thực tế qua bài test benchmark',
  'Nhấn mạnh tính bền bỉ và bảo hành dài hạn',
]

const CATEGORIES = [
  'Điện tử',
  'Phụ kiện',
  'Gia dụng',
  'Thời trang',
  'Làm đẹp',
  'Thể thao',
]

const PLATFORMS = [
  TargetPlatform.TikTok,
  TargetPlatform.Facebook,
  TargetPlatform.Instagram,
  TargetPlatform.YouTube,
  TargetPlatform.Blog,
]

const STATUSES = [
  IdeaStatus.Draft,
  IdeaStatus.Draft,
  IdeaStatus.Approved,
  IdeaStatus.Approved,
  IdeaStatus.Queued,
  IdeaStatus.Produced,
  IdeaStatus.Produced,
  IdeaStatus.Rejected,
]

const TYPES = [
  IdeaType.Review,
  IdeaType.Comparison,
  IdeaType.Roundup,
  IdeaType.Tutorial,
  IdeaType.Deal,
  IdeaType.Trending,
]

const PRODUCT_ID_POOL = [
  'prod_001',
  'prod_002',
  'prod_003',
  'prod_004',
  'prod_005',
  'prod_006',
  'prod_007',
  'prod_008',
]

const POST_ID_POOL = [
  'post_001',
  'post_002',
  'post_003',
  'post_004',
  'post_005',
  'post_006',
  'post_007',
  'post_008',
  'post_009',
  'post_010',
]

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function pickN<T>(arr: T[], min: number, max: number): T[] {
  const count = min + Math.floor(Math.random() * (max - min + 1))
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

function randomDate(startDaysAgo: number): string {
  const now = Date.now()
  const offset = Math.floor(Math.random() * startDaysAgo * 86_400_000)
  return new Date(now - offset).toISOString()
}

let idCounter = 1
function nextId(): string {
  return `idea_${String(idCounter++).padStart(3, '0')}`
}

export function generateMockContentIdeas(count = 25): ContentIdeaEntity[] {
  const ideas: ContentIdeaEntity[] = []
  for (let i = 0; i < count; i++) {
    const ideaId = nextId()
    const status = pick(STATUSES)
    const hasProducts = Math.random() > 0.15
    const ideaProducts = hasProducts ? pickN(PRODUCT_ID_POOL, 1, 4) : undefined
    const hasPosts =
      status === IdeaStatus.Produced || status === IdeaStatus.Queued
    const postIds = hasPosts ? pickN(POST_ID_POOL, 1, 5) : undefined

    ideas.push({
      ideaId,
      ideaType: pick(TYPES),
      category: pick(CATEGORIES),
      targetPlatform: pick(PLATFORMS),
      hook: HOOKS[i % HOOKS.length],
      angle: pick(ANGLES),
      priority: 1 + Math.floor(Math.random() * 10),
      status,
      owner: Math.random() > 0.3 ? 'user_001' : null,
      ideaProducts,
      postIds,
      createdAt: randomDate(60),
      updatedAt: randomDate(14),
    })
  }
  return ideas
}

export const MOCK_CONTENT_IDEAS = generateMockContentIdeas(25)
