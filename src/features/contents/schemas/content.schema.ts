import { z } from 'zod'

export enum IdeaType {
  Review = 'review',
  Comparison = 'comparison',
  Roundup = 'roundup',
  Tutorial = 'tutorial',
  Deal = 'deal',
  Trending = 'trending',
}

export enum IdeaStatus {
  Draft = 'draft',
  Approved = 'approved',
  Queued = 'queued',
  Produced = 'produced',
  Rejected = 'rejected',
}
export enum TargetPlatform {
  Facebook = 'facebook',
  TikTok = 'tiktok',
  Instagram = 'instagram',
  YouTube = 'youtube',
  Blog = 'blog',
}

export const ContentSchema = z.object({
  ideaType: z.enum(IdeaType),
  category: z.string().min(1, 'Danh mục không được để trống'),
  targetPlatform: z.nativeEnum(TargetPlatform),
  hook: z
    .string()
    .min(5, 'Hook phải có ít nhất 5 ký tự')
    .max(200, 'Hook không được vượt quá 200 ký tự'),
  angle: z
    .string()
    .max(500, 'Góc nhìn không được vượt quá 500 ký tự')
    .optional(),
  sourceRefs: z.array(z.string()).optional(),
  priority: z.number().min(1).max(10),
  status: z.enum(IdeaStatus),
  owner: z.string().optional().nullable(),
  ideaProducts: z.array(z.string()).optional(),
})
export const ContentSchemaEntity = ContentSchema.extend({
  ideaId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  postIds: z.array(z.string()).optional(),
})
export const contentIdeasSchema = z.array(ContentSchemaEntity)
export type ContentIdeaEntity = z.infer<typeof contentIdeasSchema>[number]
export type ContentSchemaFormData = z.infer<typeof ContentSchema>
