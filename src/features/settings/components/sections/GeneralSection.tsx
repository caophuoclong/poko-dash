import { useState, type ChangeEvent } from 'react'
import { FormField } from '#/components/ui/form-field'
import { Select } from '#/components/ui/select'
import { SectionCard, SectionCardBody } from '#/components/ui/section-card'
import { Button } from '#/components/ui/button'

export function GeneralSection() {
  const [form, setForm] = useState({
    businessName: 'Poko Affiliate',
    language: 'en',
    timezone: 'Asia/Ho_Chi_Minh',
    defaultPlatform: 'auto',
  })

  return (
    <div className="flex flex-col gap-4">
      <SectionCard padded>
        <SectionCardBody className="space-y-4 !px-0 !pt-0 !pb-0">
          <FormField
            label="Business Name"
            value={form.businessName}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setForm((f) => ({ ...f, businessName: e.target.value }))
            }
          />

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-text">
              Display Language
            </label>
            <Select
              value={form.language}
              onValueChange={(v) => setForm((f) => ({ ...f, language: v }))}
            >
              <option value="en">English</option>
              <option value="vi">Tiếng Việt</option>
              <option value="zh">中文</option>
              <option value="ja">日本語</option>
            </Select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-text">
              Timezone
            </label>
            <Select
              value={form.timezone}
              onValueChange={(v) => setForm((f) => ({ ...f, timezone: v }))}
            >
              <option value="Asia/Ho_Chi_Minh">Asia/Ho Chi Minh (GMT+7)</option>
              <option value="Asia/Bangkok">Asia/Bangkok (GMT+7)</option>
              <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
              <option value="America/New_York">America/New York (GMT-5)</option>
              <option value="America/Los_Angeles">
                America/Los Angeles (GMT-8)
              </option>
              <option value="Europe/London">Europe/London (GMT+0)</option>
              <option value="UTC">UTC</option>
            </Select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-text">
              Default Platform
            </label>
            <Select
              value={form.defaultPlatform}
              onValueChange={(v) =>
                setForm((f) => ({ ...f, defaultPlatform: v }))
              }
            >
              <option value="auto">Auto-detect</option>
              <option value="facebook">Facebook</option>
              <option value="tiktok">TikTok</option>
            </Select>
          </div>
        </SectionCardBody>
      </SectionCard>

      <Button className="self-end">Save Changes</Button>
    </div>
  )
}
