import { LoadingState } from '#/components/ui/loading-state'
import { EmptyState } from '#/components/ui/empty-state'
import { Button } from '#/components/ui/button'
import { AlertCircle } from 'lucide-react'

type CallbackPhase = 'exchanging' | 'error' | 'ready'

interface OAuthCallbackHandlerProps {
  phase: CallbackPhase
  error?: string | null
  providerLabel: string
  onRetry: () => void
  onCancel: () => void
}

export function OAuthCallbackHandler({
  phase,
  error,
  providerLabel,
  onRetry,
  onCancel,
}: OAuthCallbackHandlerProps) {
  if (phase === 'exchanging') {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <LoadingState
          variant="block"
          label={`Completing connection to ${providerLabel}...`}
        />
        <p className="text-xs text-muted-text">
          Please wait while we verify your authorization.
        </p>
      </div>
    )
  }

  if (phase === 'error') {
    return (
      <EmptyState
        variant="card"
        icon={<AlertCircle />}
        title="Authorization Failed"
        description={
          error ??
          `Could not complete the connection to ${providerLabel}. Please try again.`
        }
        primaryAction={
          <Button color="blue" onClick={onRetry}>
            Try Again
          </Button>
        }
        secondaryAction={
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        }
      />
    )
  }

  return null
}
