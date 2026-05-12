import { useState } from 'react'
import { Switch } from '#/components/ui/switch'
import { SectionCard, SectionCardBody } from '#/components/ui/section-card'
import { Button } from '#/components/ui/button'

const EVENTS = [
  {
    key: 'workflow-failed',
    label: 'Workflow failed',
    description: 'Notify when an automation run fails.',
  },
  {
    key: 'platform-disconnected',
    label: 'Platform disconnected',
    description: 'Notify when a connected account disconnects.',
  },
  {
    key: 'content-ready',
    label: 'Content generation completed',
    description: 'Notify when AI finishes content generation.',
  },
  {
    key: 'weekly-digest',
    label: 'Weekly performance digest',
    description: 'Receive weekly KPI summary.',
  },
]

export function NotificationsSection() {
  const [state, setState] = useState<
    Record<string, { email: boolean; inApp: boolean }>
  >({
    'workflow-failed': { email: true, inApp: true },
    'platform-disconnected': { email: true, inApp: true },
    'content-ready': { email: false, inApp: true },
    'weekly-digest': { email: true, inApp: false },
  })

  return (
    <div className="flex flex-col gap-4">
      <SectionCard padded>
        <SectionCardBody className="space-y-3 !px-0 !pt-0 !pb-0">
          {EVENTS.map((event) => (
            <div
              key={event.key}
              className="grid grid-cols-[1fr_auto_auto] items-center gap-4 rounded-[var(--radius-sm)] border border-frost p-3"
            >
              <div>
                <p className="text-body-sm text-near-white">{event.label}</p>
                <p className="text-caption-sm text-muted-text">
                  {event.description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-caption text-muted-text">Email</span>
                <Switch
                  checked={state[event.key].email}
                  onCheckedChange={(checked) =>
                    setState((prev) => ({
                      ...prev,
                      [event.key]: { ...prev[event.key], email: checked },
                    }))
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-caption text-muted-text">In-app</span>
                <Switch
                  checked={state[event.key].inApp}
                  onCheckedChange={(checked) =>
                    setState((prev) => ({
                      ...prev,
                      [event.key]: { ...prev[event.key], inApp: checked },
                    }))
                  }
                />
              </div>
            </div>
          ))}
        </SectionCardBody>
      </SectionCard>
      <Button className="self-end">Save Changes</Button>
    </div>
  )
}
