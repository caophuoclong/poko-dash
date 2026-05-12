import { AlertTriangle } from 'lucide-react'
import { SectionCard, SectionCardBody } from '#/components/ui/section-card'
import { Button } from '#/components/ui/button'

export function DangerZoneSection() {
  return (
    <div className="flex flex-col gap-4">
      <SectionCard tone="danger" padded>
        <SectionCardBody className="space-y-3 !px-0 !pt-0 !pb-0">
          <p className="text-body-sm text-muted-text">
            Deleting your account removes all workflows, generated content, and
            connected platform data. This action is permanent and cannot be
            undone.
          </p>
          <Button
            variant="destructive"
            className="inline-flex items-center gap-2"
          >
            <AlertTriangle size={16} />
            Delete Account
          </Button>
        </SectionCardBody>
      </SectionCard>
    </div>
  )
}
