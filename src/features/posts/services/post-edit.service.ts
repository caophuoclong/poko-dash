import {
  contentPostsControllerPatch,
  schedulerControllerList,
  schedulerControllerCreate,
  schedulerControllerPatch,
} from '#/api/client'
import type { ContentPostEditFormData } from '../schemas/content-post.schema'
import type {
  GetContentPostsByPostIdResponse,
  PatchContentPostsByPostIdRequest,
} from '#/dtos'

export class PostEditService {
  async updatePost(postId: string, data: ContentPostEditFormData) {
    const post = await contentPostsControllerPatch(
      postId,
      this.transformFormDataToPayload(data),
    )

    if (data.publishMode === 'schedule' && data.scheduledAt) {
      const scheduledAt = new Date(data.scheduledAt).toISOString()
      const existingJobsRes = await schedulerControllerList()
      const existingJob = ((existingJobsRes.data as unknown) as any[])?.find(
        (j: any) => j.postId === postId,
      )
      if (existingJob) {
        await schedulerControllerPatch(existingJob.jobId, {
          scheduledAt,
        } as any)
      } else {
        await schedulerControllerCreate({
          postId,
          platform: data.platform,
          scheduledAt,
        } as any)
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
      scheduledAt: '',
      publishMode: 'now',
    }
  }
}

export const postEditService = new PostEditService()
