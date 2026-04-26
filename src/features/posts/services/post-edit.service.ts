import { updateContentPost } from '../api/content-post-api'
import {
  fetchScheduledJobForPost,
  createScheduledJob,
  updateScheduledJob,
} from '@/features/scheduler/api/scheduler-api'
import type { ContentPostEditFormData } from '../schemas/content-post.schema'
import type {
  GetContentPostsByPostIdResponse,
  PatchContentPostsByPostIdRequest,
} from '#/dtos'

export class PostEditService {
  async updatePost(postId: string, data: ContentPostEditFormData) {
    // 1. Save post fields (no scheduling fields)
    const post = await updateContentPost(
      postId,
      this.transformFormDataToPayload(data),
    )

    // 2. Handle scheduling separately
    if (data.publishMode === 'schedule' && data.scheduledAt) {
      const scheduledAt = new Date(data.scheduledAt).toISOString()
      const existingJob = await fetchScheduledJobForPost(postId)
      if (existingJob) {
        await updateScheduledJob(existingJob.jobId, { scheduledAt })
      } else {
        await createScheduledJob({
          postId,
          platform: data.platform,
          scheduledAt,
        })
      }
    }

    return post
  }

  transformFormDataToPayload(
    data: ContentPostEditFormData,
  ): PatchContentPostsByPostIdRequest {
    return {
      title: data.title,
      body: data.body,
      hashtags: data.hashtags,
      status: data.status,
      platform: data.platform,
      contentType: data.contentType,
      primaryProductId: data.primaryProductId,
      supportingProductIds: data.supportingProductIds,
      // No scheduledAt — scheduling is handled by scheduler API
    }
  }

  transformPostToFormData(
    post: GetContentPostsByPostIdResponse,
  ): Partial<ContentPostEditFormData> {
    return {
      title: post.title,
      body: post.body,
      hashtags: Array.isArray(post.hashtags)
        ? post.hashtags
        : post.hashtags
          ? [post.hashtags]
          : [],
      status: post.status,
      platform: post.platform,
      contentType: post.contentType,
      primaryProductId: post.primaryProductId,
      supportingProductIds:
        post.supportingProducts?.map((p) => p.productId) ?? [],
      // scheduledAt comes from ScheduledJob, not post — caller fetches separately
      scheduledAt: '',
      publishMode: 'now',
    }
  }
}

export const postEditService = new PostEditService()
