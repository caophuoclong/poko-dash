import type { ContentPostCreateFormData } from '../schemas/content-post.schema'
import { createContentPost } from '../api/content-post-api'
import type { PostContentPostsRequest } from '#/dtos'

export class PostCreationService {
  async createPost(
    data: ContentPostCreateFormData,
  ): Promise<ReturnType<typeof createContentPost>> {
    const payload = this.transformFormDataToPayload(data)
    return createContentPost(payload)
  }

  transformFormDataToPayload(
    data: ContentPostCreateFormData,
  ): PostContentPostsRequest {
    return {
      ideaId: data.ideaId,
      primaryProductId: data.primaryProductId ?? '',
      supportingProductIds: data.supportingProductIds,
      title: data.title,
      body: data.body,
      hashtags: data.hashtags,
      status: data.status,
      platform: data.platform,
      contentType: data.contentType,
      // scheduledAt removed — scheduling is handled via the Scheduler API after post creation
    }
  }
}

export const postCreationService = new PostCreationService()
