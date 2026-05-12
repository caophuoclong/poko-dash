import { SectionCard, SectionCardBody } from '#/components/ui/section-card'
import { Button } from '#/components/ui/button'

export function BillingPlanSection() {
  return (
    <div className="flex flex-col gap-4">
      <SectionCard padded>
        <SectionCardBody className="space-y-4 !px-0 !pt-0 !pb-0">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[var(--radius-sm)] border border-frost p-4">
              <p className="text-caption-sm text-muted-text">Plan</p>
              <p className="mt-1 text-title-sm text-near-white">Pro</p>
            </div>
            <div className="rounded-[var(--radius-sm)] border border-frost p-4">
              <p className="text-caption-sm text-muted-text">AI Credits</p>
              <p className="mt-1 text-title-sm text-near-white">
                12,400 / 20,000
              </p>
            </div>
            <div className="rounded-[var(--radius-sm)] border border-frost p-4">
              <p className="text-caption-sm text-muted-text">Renewal Date</p>
              <p className="mt-1 text-title-sm text-near-white">2026-06-01</p>
            </div>
          </div>
          <Button variant="secondary">Manage Billing</Button>
        </SectionCardBody>
      </SectionCard>
      <Button className="self-end">Save Changes</Button>
    </div>
  )
}
