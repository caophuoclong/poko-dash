import { useState } from 'react'
import { Select } from '#/components/ui/select'
import { SectionCard, SectionCardBody } from '#/components/ui/section-card'
import { Button } from '#/components/ui/button'

export function AiPromptsSection() {
  const [model, setModel] = useState('claude-sonnet-4-6')
  const [tokens, setTokens] = useState(2048)
  const [language, setLanguage] = useState('en')

  return (
    <div className="flex flex-col gap-4">
      <SectionCard padded>
        <SectionCardBody className="space-y-4 !px-0 !pt-0 !pb-0">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-text">
              Default AI Model
            </label>
            <Select
              value={model}
              onValueChange={setModel}
            >
              <option value="claude-sonnet-4-6">Claude Sonnet 4.6</option>
              <option value="claude-opus-4-7">Claude Opus 4.7</option>
            </Select>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-text">
                Max Tokens
              </label>
              <span className="text-caption text-muted-text">{tokens}</span>
            </div>
            <input
              type="range"
              min={256}
              max={8192}
              step={128}
              value={tokens}
              onChange={(e) => setTokens(Number(e.target.value))}
              className="w-full accent-[var(--color-accent-orange)]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-text">
              Language Preference
            </label>
            <Select
              value={language}
              onValueChange={setLanguage}
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
