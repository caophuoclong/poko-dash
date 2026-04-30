import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'

import { SeedHeader } from './SeedHeader'
import { SeedContentForm } from './SeedContentForm'
import { SeedProductsWorkspace } from './SeedProductsWorkspace'
import { SeedGenerationWorkspace } from './SeedGenerationWorkspace'
import { SeedOutputsPanel } from './SeedOutputsPanel'
import { SeedMetadataPanel } from './SeedMetadataPanel'
import type { Product } from '#/features/products/types/product'
import { ContentSchema, IdeaStatus } from '../../schemas/content.schema'
import type {
  ContentIdeaEntity,
  ContentSchemaFormData,
} from '../../schemas/content.schema'

interface LinkedProduct {
  productId: string
  product: Product
  generatedCount: number
  lastGenerated?: string
  status: 'none' | 'generating' | 'success' | 'error'
}

interface GeneratedPost {
  postId: string
  title: string
  productId: string
  productName: string
  status: 'draft' | 'scheduled' | 'published'
  createdAt: string
}

interface ProductOutputGroup {
  productId: string
  productName: string
  posts: GeneratedPost[]
}

interface SeedWorkspacePageProps {
  idea: ContentIdeaEntity
  allProducts: Product[]
  onUpdate: (data: ContentSchemaFormData) => Promise<void>
  onApprove?: () => void
  onUnapprove?: () => void
  onDelete?: () => void
  onGenerateAll?: () => Promise<void>
  onGenerateProduct?: (productId: string) => Promise<void>
  onViewPost?: (postId: string) => void
  onViewAllPosts?: () => void
  onViewProductPosts?: (productId: string) => void
  generatedPosts?: GeneratedPost[]
  isLoading?: boolean
}

export function SeedWorkspacePage({
  idea,
  allProducts,
  onUpdate,
  onApprove,
  onUnapprove,
  onDelete,
  onGenerateAll,
  onGenerateProduct,
  onViewPost,
  onViewAllPosts,
  onViewProductPosts,
  generatedPosts = [],
  isLoading: _isLoading = false,
}: SeedWorkspacePageProps) {
  const navigate = useNavigate()
  const [isSaving, setIsSaving] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatingProductId, setGeneratingProductId] = useState<string | null>(
    null,
  )
  const [generationMode, setGenerationMode] = useState<
    'standard' | 'creative' | 'performance'
  >('standard')

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
    reset,
  } = useForm<ContentSchemaFormData>({
    resolver: zodResolver(ContentSchema),
    values: {
      ideaType: idea.ideaType,
      category: idea.category,
      targetPlatform: idea.targetPlatform,
      hook: idea.hook,
      angle: idea.angle ?? '',
      priority: idea.priority,
      ideaProducts: idea.ideaProducts ?? [],
      status: idea.status,
    },
  })

  const handleSave = useCallback(
    async (data: ContentSchemaFormData) => {
      if (!isDirty) return

      setIsSaving(true)
      try {
        await onUpdate(data)
        reset(data)
      } finally {
        setIsSaving(false)
      }
    },
    [isDirty, onUpdate, reset],
  )

  const handleApprove = useCallback(() => {
    onApprove?.()
  }, [onApprove])

  const handleUnapprove = useCallback(() => {
    onUnapprove?.()
  }, [onUnapprove])

  const handleGenerateAll = useCallback(async () => {
    if (!onGenerateAll) return

    setIsGenerating(true)
    try {
      await onGenerateAll()
    } finally {
      setIsGenerating(false)
    }
  }, [onGenerateAll])

  const handleGenerateProduct = useCallback(
    async (productId: string) => {
      if (!onGenerateProduct) return

      setGeneratingProductId(productId)
      try {
        await onGenerateProduct(productId)
      } finally {
        setGeneratingProductId(null)
      }
    },
    [onGenerateProduct],
  )

  const ideaProducts = watch('ideaProducts') ?? []

  const linkedProducts: LinkedProduct[] = ideaProducts.map(
    (productId) => {
      const product = allProducts.find((p) => p.productId === productId)
      const productPosts = generatedPosts.filter(
        (p) => p.productId === productId,
      )

      return {
        productId,
        product: product ?? ({ productId, canonicalTitle: 'Unknown Product' } as Product),
        generatedCount: productPosts.length,
        status: generatingProductId === productId ? 'generating' : 'none',
      }
    },
  )

  const productOutputGroups: ProductOutputGroup[] = ideaProducts.map((productId) => {
    const product = allProducts.find((p) => p.productId === productId)
    const posts = generatedPosts.filter((p) => p.productId === productId)

    return {
      productId,
      productName: product?.canonicalTitle || 'Unknown Product',
      posts,
    }
  })

  const isApproved = idea.status === IdeaStatus.Approved
  const canGenerate = isApproved && linkedProducts.length > 0

  return (
    <form
      onSubmit={handleSubmit(handleSave)}
      className="min-h-screen flex flex-col"
    >
      <SeedHeader
        idea={idea}
        isDirty={isDirty}
        isSaving={isSaving}
        onSave={handleSubmit(handleSave)}
        onBack={() => navigate({ to: '/dash/content' })}
        onApprove={handleApprove}
        onUnapprove={handleUnapprove}
        onDelete={onDelete}
        onGenerateAll={handleGenerateAll}
        isGenerating={isGenerating}
      />

      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-surface-2/30 border border-frost rounded-xl p-6">
                <SeedContentForm
                  control={control}
                  register={register}
                  errors={errors}
                />
              </div>

              <SeedProductsWorkspace
                control={control}
                allProducts={allProducts}
                linkedProducts={linkedProducts}
                onGenerateProduct={handleGenerateProduct}
                onViewPosts={(productId) => onViewProductPosts?.(productId)}
                isGenerating={generatingProductId}
                canGenerate={canGenerate}
                isApproved={isApproved}
              />

              <SeedGenerationWorkspace
                linkedProductsCount={linkedProducts.length}
                approved={isApproved}
                onGenerateAll={handleGenerateAll}
                isGenerating={isGenerating}
                currentMode={generationMode}
                onModeChange={setGenerationMode}
              />
            </div>

            <div className="space-y-8">
              <div className="bg-surface-2/30 border border-frost rounded-xl p-6">
                <SeedOutputsPanel
                  totalPosts={generatedPosts.length}
                  posts={generatedPosts}
                  groups={productOutputGroups}
                  onViewPost={(postId) => onViewPost?.(postId)}
                  onViewAllPosts={() => onViewAllPosts?.()}
                />
              </div>

              <div className="bg-surface-2/30 border border-frost rounded-xl p-6">
                <SeedMetadataPanel
                  ideaId={idea.ideaId}
                  createdAt={idea.createdAt}
                  updatedAt={idea.updatedAt}
                  owner={idea.owner}
                  sourceRefs={idea.sourceRefs}
                  postCount={idea.postIds?.length}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
