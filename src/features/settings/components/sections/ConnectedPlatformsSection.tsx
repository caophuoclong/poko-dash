import { useState } from 'react'
import { Badge } from '#/components/ui/badge'
import { Switch } from '#/components/ui/switch'
import { SectionCard, SectionCardBody } from '#/components/ui/section-card'
import { Button } from '#/components/ui/button'

function PlatformCard({
  name,
  connected,
  syncedAt,
  onToggle,
}: {
  name: string
  connected: boolean
  syncedAt: string
  onToggle: (v: boolean) => void
}) {
  return (
    <SectionCard>
      <SectionCardBody className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-title-sm text-near-white">{name}</p>
          <p className="text-caption-sm text-muted-text">
            Last synced: {syncedAt}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge tone={connected ? 'green' : 'neutral'}>
            {connected ? 'Connected' : 'Not connected'}
          </Badge>
          <Switch checked={connected} onCheckedChange={onToggle} />
        </div>
      </SectionCardBody>
    </SectionCard>
  )
}

export function ConnectedPlatformsSection() {
  const [facebook, setFacebook] = useState(true)
  const [tiktok, setTiktok] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      <SectionCard padded>
        <SectionCardBody className="space-y-4 !px-0 !pt-0 !pb-0">
          <PlatformCard
            name="Facebook"
            connected={facebook}
            syncedAt="2026-05-12 10:41"
            onToggle={setFacebook}
          />
          <PlatformCard
            name="TikTok"
            connected={tiktok}
            syncedAt="2026-05-11 22:14"
            onToggle={setTiktok}
          />
        </SectionCardBody>
      </SectionCard>
      <Button className="self-end">Save Changes</Button>
    </div>
  )
}
