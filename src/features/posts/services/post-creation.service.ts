import type { ContentPostCreateFormData } from '../schemas/content-post.schema'
import type { PlatformTargetConfig } from '../types/publication'
import { contentPostsControllerCreate } from '#/api/client'
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
  ): Promise<Awaited<ReturnType<typeof contentPostsControllerCreate>>> {
    const payload = this.transformFormDataToPayload(data)
    return contentPostsControllerCreate(payload)
  }

  transformFormDataToPayload(data: CreatePayloadInput): CreatePayloadOutput {
    const { platformTargets, ...rest } = data
    return {
      ...rest,
      primaryProductId: rest.primaryProductId,
      platformTargets,
    }
  }
}

export const postCreationService = new PostCreationService()
