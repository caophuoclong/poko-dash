import type { ContentPostCreateFormData } from '../schemas/content-post.schema'
import type { PlatformTargetConfig } from '../types/publication'
import { createContentPost } from '../api/content-post-api'
import type { PostContentPostsRequest } from '#/dtos'

interface CreatePayloadInput extends ContentPostCreateFormData {
  platformTargets?: PlatformTargetConfig[]
}

interface CreatePayloadOutput extends PostContentPostsRequest {
  platformTargets?: PlatformTargetConfig[]
}

export class PostCreationService {
  async createPost(
    data: CreatePayloadInput,
  ): Promise<ReturnType<typeof createContentPost>> {
    const payload = this.transformFormDataToPayload(data)
    return createContentPost(payload)
  }

  transformFormDataToPayload(
    data: CreatePayloadInput,
  ): CreatePayloadOutput {
    const { platformTargets, ...rest } = data
    return {
      ...rest,
      primaryProductId: rest.primaryProductId,
      platformTargets,
    }
  }
}

export const postCreationService = new PostCreationService()
