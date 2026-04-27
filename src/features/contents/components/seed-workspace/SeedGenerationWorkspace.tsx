import { Sparkles, Info, CheckCircle, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '#/shared/utils'

type GenerationMode = 'standard' | 'creative' | 'performance'

interface SeedGenerationWorkspaceProps {
  linkedProductsCount: number
  approved: boolean
  onGenerateAll?: () => void
  isGenerating?: boolean
  currentMode?: GenerationMode
  onModeChange?: (mode: GenerationMode) => void
}

const GENERATION_MODES: {
  value: GenerationMode
  label: string
  description: string
  icon: React.ReactNode
}[] = [
  {
    value: 'standard',
    label: 'Standard',
    description: 'Balanced approach with clear structure and engaging content',
    icon: <CheckCircle size={18} />,
  },
  {
    value: 'creative',
    label: 'Creative',
    description: 'More innovative and experimental content with unique angles',
    icon: <Sparkles size={18} />,
  },
  {
    value: 'performance',
    label: 'Performance',
    description: 'Optimized for engagement and conversion metrics',
    icon: <AlertTriangle size={18} />,
  },
]

export function SeedGenerationWorkspace({
  linkedProductsCount,
  approved,
  onGenerateAll,
  isGenerating = false,
  currentMode = 'standard',
  onModeChange,
}: SeedGenerationWorkspaceProps) {
  const canGenerate = approved && linkedProductsCount > 0

  const getEligibilityStatus = () => {
    if (!approved) {
      return {
        isValid: false,
        message: 'Seed must be approved before generating posts',
        color: 'text-accent-yellow',
      }
    }
    if (linkedProductsCount === 0) {
      return {
        isValid: false,
        message: 'Link at least one product to generate posts',
        color: 'text-accent-yellow',
      }
    }
    return {
      isValid: true,
      message: `Ready to generate ${linkedProductsCount} post${linkedProductsCount !== 1 ? 's' : ''} from ${linkedProductsCount} product${linkedProductsCount !== 1 ? 's' : ''}`,
      color: 'text-accent-green',
    }
  }

  const eligibility = getEligibilityStatus()

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-near-white">
          Generation Workspace
        </h2>
        <p className="text-sm text-muted-text mt-1">
          Configure how posts should be generated from this seed across all
          linked products.
        </p>
      </div>

      <div
        className={cn(
          'border rounded-xl p-5 transition-all',
          canGenerate
            ? 'bg-surface-2/50 border-accent-green/30'
            : 'bg-surface-2/30 border-frost',
        )}
      >
        <div className="flex items-start gap-3 mb-4">
          <Info
            size={20}
            className={cn(
              'shrink-0 mt-0.5',
              canGenerate ? 'text-accent-green' : 'text-muted-text',
            )}
          />
          <div className="flex-1">
            <p className={cn('text-sm font-medium', eligibility.color)}>
              {eligibility.message}
            </p>
            {!canGenerate && (
              <p className="text-xs text-muted-text mt-1">
                Complete the requirements above to enable generation.
              </p>
            )}
          </div>
        </div>

        {canGenerate && (
          <div className="border-t border-frost/50 pt-4 mt-4">
            <h3 className="text-sm font-medium text-near-white mb-3">
              Generation Mode
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {GENERATION_MODES.map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => onModeChange?.(mode.value)}
                  disabled={isGenerating}
                  className={cn(
                    'text-left p-3 rounded-lg border transition-all',
                    currentMode === mode.value
                      ? 'bg-accent-blue/10 border-accent-blue'
                      : 'bg-surface border-frost hover:border-frost/70',
                    !onModeChange && 'cursor-default opacity-70',
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={cn(
                        currentMode === mode.value
                          ? 'text-accent-blue'
                          : 'text-muted-text',
                      )}
                    >
                      {mode.icon}
                    </span>
                    <span
                      className={cn(
                        'text-sm font-medium',
                        currentMode === mode.value
                          ? 'text-near-white'
                          : 'text-muted-text',
                      )}
                    >
                      {mode.label}
                    </span>
                    {currentMode === mode.value && (
                      <Badge tone="blue" size="sm" className="ml-auto">
                        Active
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-text leading-relaxed">
                    {mode.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div
        className={cn(
          'flex items-center justify-between p-4 rounded-lg border',
          canGenerate
            ? 'bg-accent-orange/10 border-accent-orange/30'
            : 'bg-surface-2/30 border-frost opacity-60',
        )}
      >
        <div>
          <h3 className="text-sm font-medium text-near-white">
            Batch Generation
          </h3>
          <p className="text-xs text-muted-text mt-0.5">
            Generate posts for all linked products in one operation
          </p>
        </div>
        {onGenerateAll && (
          <Button
            size="sm"
            onClick={onGenerateAll}
            disabled={!canGenerate || isGenerating}
            className={cn(
              'bg-accent-orange hover:bg-accent-orange-light text-accent-on',
              !canGenerate && 'opacity-50 cursor-not-allowed',
            )}
          >
            {isGenerating ? (
              <>
                <Sparkles size={16} className="mr-1.5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={16} className="mr-1.5" />
                Generate All
              </>
            )}
          </Button>
        )}
      </div>

      {canGenerate && (
        <div className="text-xs text-muted-text space-y-1">
          <p className="font-medium">What will happen:</p>
          <ul className="space-y-0.5 ml-4 list-disc">
            <li>
              {linkedProductsCount} post{linkedProductsCount !== 1 ? 's' : ''}{' '}
              will be generated (one per linked product)
            </li>
            <li>
              Each post will adapt the seed direction to the specific product
            </li>
            <li>
              Posts will be created as drafts for review before publishing
            </li>
            <li>
              You can view and edit each generated post in the Posts section
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}
