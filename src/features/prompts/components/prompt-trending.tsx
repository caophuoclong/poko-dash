import * as React from 'react'
import { Star, Flame, Loader2 } from 'lucide-react'
import { Button } from '#/components/ui/button'
import {
  useMostUsedPrompts,
  useHighestRatedPrompts,
} from '../hooks/use-prompts'
import type { Prompt } from '../types/prompt'
import { cn } from '#/shared/utils'

interface PromptTrendingProps {
  onUse: (prompt: Prompt) => void
}

export default function PromptTrending({ onUse }: PromptTrendingProps) {
  const [tab, setTab] = React.useState<'most-used' | 'highest-rated'>(
    'most-used',
  )

  const mostUsed = useMostUsedPrompts(10)
  const highestRated = useHighestRatedPrompts(10)

  const { data = [], isLoading } = tab === 'most-used' ? mostUsed : highestRated

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab('most-used')}
          className={cn(
            'flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg font-medium transition-colors',
            tab === 'most-used'
              ? 'bg-accent-orange-dim text-accent-orange border border-accent-orange-border'
              : 'text-muted-text hover:text-near-white hover:bg-surface-2',
          )}
        >
          <Flame className="size-3.5" /> Most Used
        </button>
        <button
          onClick={() => setTab('highest-rated')}
          className={cn(
            'flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg font-medium transition-colors',
            tab === 'highest-rated'
              ? 'bg-accent-yellow/10 text-accent-yellow border border-accent-yellow/20'
              : 'text-muted-text hover:text-near-white hover:bg-surface-2',
          )}
        >
          <Star className="size-3.5" /> Highest Rated
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-6 animate-spin text-accent-blue" />
        </div>
      ) : data.length === 0 ? (
        <div className="bg-surface border border-frost rounded-2xl p-12 text-center">
          <p className="text-muted-text">No trending prompts yet</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {data.map((prompt, idx) => (
            <div
              key={prompt.promptId}
              className="bg-surface border border-frost rounded-xl px-4 py-3 flex items-center gap-4 hover:border-accent-blue/40 transition-colors"
            >
              <span className="text-lg font-bold text-muted-text w-7 shrink-0 text-center">
                #{idx + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-near-white truncate">
                  {prompt.name}
                </p>
                {prompt.description && (
                  <p className="text-xs text-muted-text truncate">
                    {prompt.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-text shrink-0">
                {prompt.avgRating !== undefined && (
                  <span className="flex items-center gap-1">
                    <Star className="size-3 text-accent-yellow fill-accent-yellow" />
                    {prompt.avgRating.toFixed(1)}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Flame className="size-3 text-accent-orange" />
                  {prompt.usageCount}
                </span>
              </div>
              <Button size="sm" color="blue-dim" onClick={() => onUse(prompt)}>
                Use
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
