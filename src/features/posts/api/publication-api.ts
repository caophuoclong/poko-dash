import { apiRequest } from '#/shared/api'
import type { PublicationRecord } from '../types/publication'

export function fetchPublications(postId: string): Promise<PublicationRecord[]> {
  return apiRequest<PublicationRecord[]>(
    `/content-posts/${postId}/publications`,
  )
}

export function retryPublication(
  publicationId: string,
): Promise<PublicationRecord> {
  return apiRequest<PublicationRecord>(
    `/publications/${publicationId}/retry`,
    { method: 'POST' },
  )
}
