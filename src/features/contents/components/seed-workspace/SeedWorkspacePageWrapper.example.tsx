import { useProducts } from '#/features/products/hooks/use-products'
import { useGenerateFromIdea } from '#/features/posts/hooks/use-content-posts'
import { useNavigate } from '@tanstack/react-router'
import { SeedWorkspacePage } from './SeedWorkspacePage'
import { useUpdateContentIdea } from '../../hooks/use-content-ideas'
import type { ContentIdeaEntity } from '../../schemas/content.schema'

interface SeedWorkspacePageWrapperProps {
  idea: ContentIdeaEntity
}

export function SeedWorkspacePageWrapper({
  idea,
}: SeedWorkspacePageWrapperProps) {
  const ideaId = idea.ideaId
  const updateIdea = useUpdateContentIdea()
  const { data: products = [] } = useProducts()
  const generateFromIdea = useGenerateFromIdea()
  const navigate = useNavigate()

  // Mock generated posts data - replace with actual data fetching
  const generatedPosts = [
    {
      postId: 'post-1',
      title: 'Review of Product A',
      productId: 'prod-1',
      productName: 'Product A',
      status: 'draft' as const,
      createdAt: idea.createdAt,
    },
    {
      postId: 'post-2',
      title: 'Review of Product B',
      productId: 'prod-2',
      productName: 'Product B',
      status: 'published' as const,
      createdAt: idea.updatedAt,
    },
  ]

  const handleUpdate = async (data: any) => {
    await updateIdea.mutateAsync({ ideaId, data })
  }

  const handleApprove = async () => {
    await updateIdea.mutateAsync({ ideaId, data: { status: 'approved' } })
  }

  const handleUnapprove = async () => {
    await updateIdea.mutateAsync({ ideaId, data: { status: 'draft' } })
  }

  const handleGenerateAll = async () => {
    // Generate posts for all linked products
    const productIds = idea.ideaProducts ?? []
    for (const productId of productIds) {
      await generateFromIdea.mutateAsync(ideaId)
    }
  }

  const handleGenerateProduct = async (productId: string) => {
    // Generate post for specific product
    await generateFromIdea.mutateAsync(ideaId)
  }

  const handleViewPost = (postId: string) => {
    navigate({ to: '/dash/posts/$postId', params: { postId } })
  }

  const handleViewAllPosts = () => {
    navigate({ to: '/dash/posts', search: { ideaId } })
  }

  const handleViewProductPosts = (productId: string) => {
    navigate({ to: '/dash/posts', search: { ideaId } })
  }

  return (
    <SeedWorkspacePage
      idea={idea}
      allProducts={products}
      onUpdate={handleUpdate}
      onApprove={handleApprove}
      onUnapprove={handleUnapprove}
      onGenerateAll={handleGenerateAll}
      onGenerateProduct={handleGenerateProduct}
      onViewPost={handleViewPost}
      onViewAllPosts={handleViewAllPosts}
      onViewProductPosts={handleViewProductPosts}
      generatedPosts={generatedPosts}
    />
  )
}
