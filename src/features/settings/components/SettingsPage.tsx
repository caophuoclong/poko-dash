import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from '#/components/ui/tabs'
import { GeneralSection } from './sections/GeneralSection'
import { AccountProfileSection } from './sections/AccountProfileSection'
import { ConnectedPlatformsSection } from './sections/ConnectedPlatformsSection'
import { AiPromptsSection } from './sections/AiPromptsSection'
import { NotificationsSection } from './sections/NotificationsSection'
import { BillingPlanSection } from './sections/BillingPlanSection'
import { DangerZoneSection } from './sections/DangerZoneSection'
import { usePageHeader } from '#/components/ui/page-header-context'

export type SettingsSection =
  | 'general'
  | 'account'
  | 'connected-platforms'
  | 'ai-prompts'
  | 'notifications'
  | 'billing'
  | 'danger-zone'

const TABS: { id: SettingsSection; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'account', label: 'Account & Profile' },
  { id: 'connected-platforms', label: 'Connected Platforms' },
  { id: 'ai-prompts', label: 'AI & Prompts' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'billing', label: 'Billing & Plan' },
  { id: 'danger-zone', label: 'Danger Zone' },
]

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('general')
  usePageHeader({
    title: 'Settings',
    description:
      'Manage workspace defaults, integrations, AI behavior, and account preferences.',
  })
  return (
    <div className="space-y-4">
      <Tabs
        value={activeSection}
        onValueChange={(v) => setActiveSection(v as SettingsSection)}
      >
        <div className="overflow-x-auto">
          <TabsList className="min-w-max w-full justify-start">
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="data-[state=active]:text-accent-orange data-[state=active]:shadow-[inset_0_-2px_0_0_var(--color-accent-orange)]"
              >
                <p className="text-xs">{tab.label}</p>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>
      <main className="w-full">
        {activeSection === 'general' && <GeneralSection />}
        {activeSection === 'account' && <AccountProfileSection />}
        {activeSection === 'connected-platforms' && (
          <ConnectedPlatformsSection />
        )}
        {activeSection === 'ai-prompts' && <AiPromptsSection />}
        {activeSection === 'notifications' && <NotificationsSection />}
        {activeSection === 'billing' && <BillingPlanSection />}
        {activeSection === 'danger-zone' && <DangerZoneSection />}
      </main>
    </div>
  )
}
