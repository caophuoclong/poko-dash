import type { Product } from '../types/product'
import type { AffiliateLink } from '../types/product'

export const MOCK_PRODUCT: Product = {
  productId: 'prod_mock123abc456',
  canonicalTitle: 'Tai nghe Bluetooth Sony WH-1000XM5 — Chính hãng',
  brand: 'Sony',
  category: 'Điện tử',
  subCategory: 'Tai nghe',
  specsKeyFacts:
    'Noise Cancelling hàng đầu; Bluetooth 5.2; Pin 30 giờ; Trọng lượng 250g; Hỗ trợ LDAC/AAC/SBC; Foldable design',
  priceCurrent: '5.490.000d',
  priceSale: '4.990.000d',
  currency: 'VND',
  rating: 4.8,
  reviewCount: 1253,
  sourceBestUrl:
    'https://shopee.vn/tai-nghe-bluetooth-sony-wh-1000xm5-chinh-hang-i.123456.78901234',
  imageCover: 'https://picsum.photos/seed/sony-xm5-cover/800/800',
  imageVariants:
    'https://picsum.photos/seed/sony-xm5-black/600/600;https://picsum.photos/seed/sony-xm5-white/600/600;https://picsum.photos/seed/sony-xm5-blue/600/600',
  videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  descriptionImages:
    'https://picsum.photos/seed/sony-desc1/800/400;https://picsum.photos/seed/sony-desc2/800/400;https://picsum.photos/seed/sony-desc3/800/400',
  notes:
    'Sản phẩm chính hãng Sony Việt Nam, bảo hành 12 tháng. Freeship toàn quốc. Hoàn tiền 30 ngày nếu lỗi.',
  variants: 'Trắng;Đen;Xanh Navy',
  availability: 'Còn hàng',
  sellerName: 'Sony Official Store',
  dealScore: 85,
  publishScore: 78,
  freshUntil: '2026-05-15T00:00:00Z',
  status: 'active',
  createdAt: '2026-04-10T08:30:00Z',
  updatedAt: '2026-04-15T14:20:00Z',
}

export const MOCK_AFFILIATE_LINK: AffiliateLink = {
  linkId: 'lnk_aff789xyz012',
  productId: 'prod_mock123abc456',
  merchant: 'shopee',
  originalUrl:
    'https://shopee.vn/tai-nghe-bluetooth-sony-wh-1000xm5-chinh-hang-i.123456.78901234',
  affiliateUrl:
    'https://shope.ee/aff/4Kx8mZ9qR?ulp=https%3A%2F%2Fshopee.vn%2Fsony-wh1000xm5-i.123456.78901234&utm_campaign=affiliate&utm_medium=poko',
  shortUrl: 'https://poko.work/s/abc123',
  platform: 'shopee',
  commissionRate: 4.5,
  couponCode: 'SONY2026',
  deeplinkStatus: 'valid',
  active: true,
  createdAt: '2026-04-10T08:30:00Z',
}
