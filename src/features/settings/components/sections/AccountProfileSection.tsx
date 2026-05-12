import { useState, type ChangeEvent } from 'react'
import { FormField } from '#/components/ui/form-field'
import { Select } from '#/components/ui/select'
import { SectionCard, SectionCardBody } from '#/components/ui/section-card'
import { Button } from '#/components/ui/button'

export function AccountProfileSection() {
  const [form, setForm] = useState({
    fullName: 'Long Cao',
    email: 'long@example.com',
    role: 'Owner',
    locale: 'en',
  })

  return (
    <div className="flex flex-col gap-4">
      <SectionCard padded>
        <SectionCardBody className="space-y-4 !px-0 !pt-0 !pb-0">
          <FormField
            label="Full Name"
            value={form.fullName}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setForm((f) => ({ ...f, fullName: e.target.value }))
            }
          />
          <FormField label="Email" value={form.email} disabled />
          <FormField
            label="Company Role"
            value={form.role}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setForm((f) => ({ ...f, role: e.target.value }))
            }
          />
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-text">
              Profile Locale
            </label>
            <Select
              value={form.locale}
              onValueChange={(v) => setForm((f) => ({ ...f, locale: v }))}
            >
              <option value="en">English</option>
              <option value="vi">Tiếng Việt</option>
            </Select>
          </div>
        </SectionCardBody>
      </SectionCard>
      <Button className="self-end">Save Changes</Button>
    </div>
  )
}
