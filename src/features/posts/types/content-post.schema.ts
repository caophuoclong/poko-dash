import type {
  GetContentPostsByPostIdResponse,
  GetContentPostsResponse,
  PatchContentPostsByPostIdRequest,
  PostContentPostsRequest,
} from '#/dtos'
import { ProductSchema } from '#/features/products/schemas/product.schema'
import { z } from 'zod'

// ── Response parsing schemas ──────────────────────────────────────

const ContentIdeaSchema = z.object({
  ideaId: z.string(),
  ideaType: z.enum([
    'review',
    'comparison',
    'roundup',
    'tutorial',
    'deal',
    'trending',
  ]),
  category: z.string(),
  targetPlatform: z.enum([
    'facebook',
    'tiktok',
    'instagram',
    'youtube',
    'blog',
  ]),
  hook: z.string(),
  angle: z.string().optional(),
  sourceRefs: z.array(z.string()).optional(),
  priority: z.number(),
  status: z.enum(['draft', 'approved', 'queued', 'produced', 'rejected']),
  owner: z.string().optional(),
  productIds: z.array(z.string()).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

const ContentPostResponseBaseSchema = z.object({
  postId: z.string(),
  ideaId: z.string().optional(),
  contentType: z.enum([
    'review',
    'comparison',
    'roundup',
    'tutorial',
    'deal',
    'trending',
  ]),
  platform: z.string(),
  title: z.string(),
  status: z.enum(['draft', 'approved', 'queued', 'published', 'archived']),
  approvalStatus: z.enum(['pending', 'approved', 'rejected']).optional(),
  publishStatus: z
    .enum(['draft', 'scheduled', 'published', 'failed'])
    .optional(),
  scheduledAt: z.string().optional(),
  publishedAt: z.string().optional(),
  priority: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const ContentPostSummarySchema = ContentPostResponseBaseSchema.extend({
  _type: z.literal('summary'),
  primaryProductId: z.string().optional(),
  supportingProductIds: z.array(z.string()).optional(),
  primaryProduct: ProductSchema.pick({
    productId: true,
    canonicalTitle: true,
    imageCover: true,
  }).optional(),
}) satisfies z.ZodType<GetContentPostsResponse[number]>

export const ContentPostDetailSchema = ContentPostResponseBaseSchema.extend({
  _type: z.literal('detail'),
  primaryProductId: z.string(),
  body: z.string(),
  hashtags: z.array(z.string()).optional(),
  postUrl: z.string().optional(),
  utmCode: z.string().optional(),
  primaryProduct: ProductSchema.optional(),
  supportingProducts: z.array(ProductSchema).optional(),
  idea: ContentIdeaSchema.optional(),
}) satisfies z.ZodType<GetContentPostsByPostIdResponse>

export const ContentPostSchema = z.discriminatedUnion('_type', [
  ContentPostSummarySchema,
  ContentPostDetailSchema,
])

export type ContentPostSummaryParsed = z.infer<typeof ContentPostSummarySchema>
export type ContentPostDetailParsed = z.infer<typeof ContentPostDetailSchema>
export type ContentPostParsed = z.infer<typeof ContentPostSchema>

// ── Form schemas ──────────────────────────────────────────────────

const ContentPostBaseSchema = z.object({
  ideaId: z.uuid('ideaId phải là UUID hợp lệ').optional(),
  primaryProductId: z.uuid('primaryProductId phải là UUID hợp lệ'),
  supportingProductIds: z
    .array(z.uuid('Mỗi supportingProductId phải là UUID hợp lệ'))
    .optional(),
  contentType: z.string(),
  platform: z.string(),
  title: z
    .string()
    .min(3, 'Tiêu đề phải có ít nhất 3 ký tự')
    .max(300, 'Tiêu đề không được vượt quá 300 ký tự'),
  body: z.string().min(10, 'Nội dung phải có ít nhất 10 ký tự'),
  hashtags: z.array(z.string()).optional(),
  status: z.string(),
  approvalStatus: z.string().optional(),
  // Scheduling fields kept as form-only fields (not sent to content-posts API)
  scheduledAt: z.string().optional(),
  publishMode: z.enum(['now', 'schedule']).optional(),
  generationSource: z.string().optional(),
  generationModel: z.string().optional(),
})

export const ContentPostCreateSchema = ContentPostBaseSchema.extend({
  primaryProductId: z.uuid('primaryProductId phải là UUID hợp lệ'),
  contentType: z.string().min(1, 'Loại nội dung không được để trống'),
  platform: z.string().min(1, 'Nền tảng không được để trống'),
  status: z.string().min(1, 'Trạng thái không được để trống'),
}) satisfies z.ZodType<PostContentPostsRequest>

export type ContentPostCreateFormData = z.infer<typeof ContentPostCreateSchema>

export const ContentPostEditSchema: z.ZodType<PatchContentPostsByPostIdRequest> =
  ContentPostBaseSchema

export type ContentPostEditFormData = z.infer<typeof ContentPostEditSchema>
