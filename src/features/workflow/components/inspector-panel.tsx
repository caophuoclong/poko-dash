import {
  GitBranch,
  Zap,
  Clock,
  Target,
  TrendingUp,
  Trash2,
  X,
  Globe,
  PenLine,
  Users,
  Link2,
  Mail,
  Sparkles,
  Send,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import type { WorkflowDetail, WorkflowNodeData } from '../types'

interface InspectorPanelProps {
  workflow: WorkflowDetail
  selectedNodeId: string | null
  onNodeDeselect: () => void
}

export function InspectorPanel({
  workflow,
  selectedNodeId,
  onNodeDeselect,
}: InspectorPanelProps) {
  const selectedNode = selectedNodeId
    ? workflow.nodes.find((n) => n.id === selectedNodeId)
    : null
  const nodeData = selectedNode?.data as WorkflowNodeData | undefined

  if (selectedNode && nodeData) {
    return (
      <NodeEditor
        nodeId={selectedNode.id}
        data={nodeData}
        selectedNode={selectedNode}
        onClose={onNodeDeselect}
      />
    )
  }

  return <WorkflowOverview workflow={workflow} />
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-text">
      {children}
    </label>
  )
}

function TextInput({
  label,
  defaultValue,
  placeholder,
}: {
  label: string
  defaultValue?: string
  placeholder?: string
}) {
  return (
    <div className="space-y-1.5">
      <FieldLabel>{label}</FieldLabel>
      <input
        type="text"
        defaultValue={defaultValue ?? ''}
        placeholder={placeholder}
        className="w-full h-8 px-2.5 rounded-lg border border-frost bg-void text-[13px] text-near-white placeholder:text-muted-text/50 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue/30"
      />
    </div>
  )
}

function NumberInput({
  label,
  defaultValue,
  min,
}: {
  label: string
  defaultValue?: number
  min?: number
}) {
  return (
    <div className="space-y-1.5">
      <FieldLabel>{label}</FieldLabel>
      <input
        type="number"
        defaultValue={defaultValue ?? ''}
        min={min}
        className="w-full h-8 px-2.5 rounded-lg border border-frost bg-void text-[13px] text-near-white placeholder:text-muted-text/50 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue/30"
      />
    </div>
  )
}

function SelectInput({
  label,
  defaultValue,
  options,
}: {
  label: string
  defaultValue?: string
  options: { value: string; label: string }[]
}) {
  return (
    <div className="space-y-1.5">
      <FieldLabel>{label}</FieldLabel>
      <select
        defaultValue={defaultValue}
        className="w-full h-8 px-2.5 rounded-lg border border-frost bg-void text-[13px] text-near-white focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue/30"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}

function TextareaInput({
  label,
  defaultValue,
  placeholder,
}: {
  label: string
  defaultValue?: string
  placeholder?: string
}) {
  return (
    <div className="space-y-1.5">
      <FieldLabel>{label}</FieldLabel>
      <textarea
        defaultValue={defaultValue ?? ''}
        placeholder={placeholder}
        rows={3}
        className="w-full px-2.5 py-1.5 rounded-lg border border-frost bg-void text-[13px] text-near-white placeholder:text-muted-text/50 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue/30 resize-none"
      />
    </div>
  )
}

function ConfigSection({
  label,
  icon: Icon,
  children,
}: {
  label: string
  icon: LucideIcon
  children: React.ReactNode
}) {
  return (
    <div className="space-y-3 pt-1">
      <div className="flex items-center gap-1.5">
        <Icon size={12} className="text-muted-text" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-text">
          {label}
        </span>
      </div>
      {children}
    </div>
  )
}

function CheckboxGroup({
  label,
  options,
  defaults,
}: {
  label: string
  options: { id: string; label: string }[]
  defaults?: string[]
}) {
  return (
    <div className="space-y-1.5">
      <FieldLabel>{label}</FieldLabel>
      <div className="space-y-1">
        {options.map((o) => (
          <label key={o.id} className="flex items-center gap-2 py-1 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked={defaults?.includes(o.id)}
              className="rounded border-frost bg-void text-accent-blue focus:ring-accent-blue/20 h-3.5 w-3.5"
            />
            <span className="text-[12px] text-near-white">{o.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

function NodeEditor({
  nodeId,
  data,
  selectedNode,
  onClose,
}: {
  nodeId: string
  data: WorkflowNodeData
  selectedNode: { position: { x: number; y: number } }
  onClose: () => void
}) {
  const icon = data.icon ?? ''
  const config = (data.config ?? {}) as Record<string, unknown>

  return (
    <aside className="w-[300px] shrink-0 border-l border-frost bg-surface flex flex-col overflow-y-auto">
      <div className="flex items-center justify-between px-4 py-3 border-b border-frost">
        <h2 className="text-[13px] font-semibold text-near-white">
          Node Settings
        </h2>
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center rounded-md text-muted-text hover:text-near-white hover:bg-surface-2 transition-colors"
        >
          <X size={13} />
        </button>
      </div>

      <div className="p-4 space-y-4">
        <TextInput label="Label" defaultValue={data.title} />
        <TextInput label="Description" defaultValue={data.subtitle ?? ''} />

        <SelectInput
          label="Status"
          defaultValue={data.status ?? 'active'}
          options={[
            { value: 'active', label: 'Active' },
            { value: 'pending', label: 'Pending' },
            { value: 'completed', label: 'Completed' },
            { value: 'error', label: 'Error' },
          ]}
        />

        <div className="border-t border-frost" />

        {icon === 'Rss' && <ContentSourceConfig config={config} />}
        {icon === 'Webhook' && <WebhookConfig config={config} />}
        {icon === 'Sparkles' && <AIEnrichmentConfig config={config} />}
        {icon === 'Calendar' && <SchedulerConfig config={config} />}
        {icon === 'Replace' && <TransformConfig config={config} />}
        {icon === 'ShieldCheck' && <ValidationConfig config={config} />}
        {icon === 'UserCheck' && <ManualReviewConfig config={config} />}
        {icon === 'Send' && <DistributionConfig config={config} />}
        {icon === 'BarChart3' && <AnalyticsConfig config={config} />}
        {icon === 'Mail' && <EmailConfig config={config} />}

        <div className="border-t border-frost" />

        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-text">ID</span>
            <span className="text-near-white font-mono text-[11px]">{nodeId}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-text">Position</span>
            <span className="text-near-white text-[11px]">
              ({selectedNode.position.x.toFixed(0)}, {selectedNode.position.y.toFixed(0)})
            </span>
          </div>
        </div>

        <Button variant="ghost" size="xs" className="w-full text-accent-red hover:bg-accent-red/10">
          <Trash2 size={13} />
          Delete Node
        </Button>
      </div>
    </aside>
  )
}

function ContentSourceConfig({ config }: { config: Record<string, unknown> }) {
  return (
    <ConfigSection label="Source Config" icon={Globe}>
      <TextInput
        label="Source URL"
        defaultValue={typeof config.url === 'string' ? config.url : ''}
        placeholder="https://api.example.com/feed"
      />
      <NumberInput
        label="Refresh Interval (s)"
        defaultValue={typeof config.interval === 'number' ? config.interval : 300}
        min={10}
      />
      <TextInput
        label="Auth Header"
        defaultValue={typeof config.authHeader === 'string' ? config.authHeader : ''}
        placeholder="Bearer token"
      />
    </ConfigSection>
  )
}

function WebhookConfig({ config }: { config: Record<string, unknown> }) {
  return (
    <ConfigSection label="Webhook Config" icon={Link2}>
      <TextInput
        label="Path"
        defaultValue={typeof config.path === 'string' ? config.path : '/webhook/incoming'}
        placeholder="/webhook/incoming"
      />
      <TextInput
        label="Secret"
        defaultValue={typeof config.secret === 'string' ? config.secret : ''}
        placeholder="whsec_..."
      />
      <TextInput
        label="Event Filter"
        defaultValue={typeof config.eventFilter === 'string' ? config.eventFilter : ''}
        placeholder="content.created,content.updated"
      />
    </ConfigSection>
  )
}

function AIEnrichmentConfig({ config }: { config: Record<string, unknown> }) {
  return (
    <ConfigSection label="AI Enrichment" icon={Sparkles}>
      <SelectInput
        label="Model"
        defaultValue={typeof config.model === 'string' ? config.model : 'gpt-4o'}
        options={[
          { value: 'gpt-4o', label: 'GPT-4o' },
          { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
          { value: 'claude-3.5', label: 'Claude 3.5 Sonnet' },
          { value: 'gemini-1.5', label: 'Gemini 1.5 Pro' },
        ]}
      />
      <TextareaInput
        label="System Prompt"
        defaultValue={typeof config.systemPrompt === 'string' ? config.systemPrompt : ''}
        placeholder="Generate tags and summaries..."
      />
      <div className="grid grid-cols-2 gap-3">
        <NumberInput
          label="Max Tokens"
          defaultValue={typeof config.maxTokens === 'number' ? config.maxTokens : 1024}
          min={1}
        />
        <TextInput
          label="Temperature"
          defaultValue={typeof config.temperature === 'string' ? config.temperature : '0.7'}
          placeholder="0.7"
        />
      </div>
    </ConfigSection>
  )
}

function SchedulerConfig({ config }: { config: Record<string, unknown> }) {
  return (
    <ConfigSection label="Schedule" icon={Clock}>
      <SelectInput
        label="Mode"
        defaultValue={typeof config.mode === 'string' ? config.mode : 'cron'}
        options={[
          { value: 'interval', label: 'Interval' },
          { value: 'cron', label: 'Cron Expression' },
          { value: 'best-time', label: 'Best Time (AI)' },
        ]}
      />
      <TextInput
        label="Expression"
        defaultValue={typeof config.expression === 'string' ? config.expression : '0 */6 * * *'}
        placeholder="0 */6 * * *"
      />
      <SelectInput
        label="Timezone"
        defaultValue={typeof config.timezone === 'string' ? config.timezone : 'UTC'}
        options={[
          { value: 'UTC', label: 'UTC' },
          { value: 'Asia/Ho_Chi_Minh', label: 'Asia/Ho Chi Minh' },
          { value: 'America/New_York', label: 'America/New York' },
          { value: 'Europe/London', label: 'Europe/London' },
        ]}
      />
    </ConfigSection>
  )
}

function TransformConfig({ config }: { config: Record<string, unknown> }) {
  return (
    <ConfigSection label="Transform Rules" icon={Target}>
      <TextInput
        label="Input Field"
        defaultValue={typeof config.inputField === 'string' ? config.inputField : ''}
        placeholder="source.title"
      />
      <TextInput
        label="Output Field"
        defaultValue={typeof config.outputField === 'string' ? config.outputField : ''}
        placeholder="target.headline"
      />
      <SelectInput
        label="Transform Type"
        defaultValue={typeof config.transformType === 'string' ? config.transformType : 'map'}
        options={[
          { value: 'map', label: 'Direct Map' },
          { value: 'template', label: 'Template' },
          { value: 'ai', label: 'AI Transform' },
        ]}
      />
    </ConfigSection>
  )
}

function ValidationConfig({ config }: { config: Record<string, unknown> }) {
  return (
    <ConfigSection label="Validation Rules" icon={Target}>
      <NumberInput
        label="Min Content Score"
        defaultValue={typeof config.minScore === 'number' ? config.minScore : 70}
        min={0}
      />
      <NumberInput
        label="Max Duplicates"
        defaultValue={typeof config.maxDuplicates === 'number' ? config.maxDuplicates : 3}
        min={0}
      />
      <SelectInput
        label="On Failure"
        defaultValue={typeof config.onFailure === 'string' ? config.onFailure : 'flag'}
        options={[
          { value: 'skip', label: 'Skip' },
          { value: 'flag', label: 'Flag for Review' },
          { value: 'reject', label: 'Reject' },
        ]}
      />
    </ConfigSection>
  )
}

function ManualReviewConfig({ config }: { config: Record<string, unknown> }) {
  return (
    <ConfigSection label="Review Settings" icon={Users}>
      <TextInput
        label="Reviewer Group"
        defaultValue={typeof config.reviewerGroup === 'string' ? config.reviewerGroup : 'editors'}
        placeholder="editors"
      />
      <NumberInput
        label="Auto-Approve (hours)"
        defaultValue={typeof config.autoApproveHours === 'number' ? config.autoApproveHours : 24}
        min={0}
      />
      <CheckboxGroup
        label="Notifications"
        defaults={Array.isArray(config.notifications) ? (config.notifications as string[]) : ['email']}
        options={[
          { id: 'email', label: 'Email' },
          { id: 'slack', label: 'Slack' },
          { id: 'in-app', label: 'In-App' },
        ]}
      />
    </ConfigSection>
  )
}

function DistributionConfig({ config }: { config: Record<string, unknown> }) {
  return (
    <ConfigSection label="Distribution" icon={Send}>
      <CheckboxGroup
        label="Platforms"
        defaults={
          Array.isArray(config.platforms) ? (config.platforms as string[]) : ['facebook', 'twitter']
        }
        options={[
          { id: 'facebook', label: 'Facebook' },
          { id: 'twitter', label: 'Twitter / X' },
          { id: 'linkedin', label: 'LinkedIn' },
          { id: 'tiktok', label: 'TikTok' },
          { id: 'instagram', label: 'Instagram' },
        ]}
      />
      <NumberInput
        label="Max Posts / Day"
        defaultValue={typeof config.maxPerDay === 'number' ? config.maxPerDay : 12}
        min={1}
      />
      <div className="grid grid-cols-2 gap-3">
        <TextInput
          label="Window Start"
          defaultValue={typeof config.windowStart === 'string' ? config.windowStart : '08:00'}
          placeholder="08:00"
        />
        <TextInput
          label="Window End"
          defaultValue={typeof config.windowEnd === 'string' ? config.windowEnd : '22:00'}
          placeholder="22:00"
        />
      </div>
    </ConfigSection>
  )
}

function AnalyticsConfig({ config }: { config: Record<string, unknown> }) {
  return (
    <ConfigSection label="Analytics Config" icon={TrendingUp}>
      <CheckboxGroup
        label="Tracked Metrics"
        defaults={
          Array.isArray(config.metrics) ? (config.metrics as string[]) : ['impressions', 'engagement']
        }
        options={[
          { id: 'impressions', label: 'Impressions' },
          { id: 'engagement', label: 'Engagement Rate' },
          { id: 'clicks', label: 'Link Clicks' },
          { id: 'shares', label: 'Shares' },
          { id: 'comments', label: 'Comments' },
          { id: 'conversions', label: 'Conversions' },
        ]}
      />
      <NumberInput
        label="Sync Interval (min)"
        defaultValue={typeof config.syncIntervalMinutes === 'number' ? config.syncIntervalMinutes : 15}
        min={1}
      />
      <NumberInput
        label="Retention (days)"
        defaultValue={typeof config.retentionDays === 'number' ? config.retentionDays : 90}
        min={1}
      />
    </ConfigSection>
  )
}

function EmailConfig({ config }: { config: Record<string, unknown> }) {
  return (
    <ConfigSection label="Email Settings" icon={Mail}>
      <TextInput
        label="Recipients"
        defaultValue={typeof config.recipients === 'string' ? config.recipients : ''}
        placeholder="team@example.com, boss@example.com"
      />
      <TextInput
        label="Subject"
        defaultValue={typeof config.subject === 'string' ? config.subject : 'Weekly Content Report'}
        placeholder="Weekly Content Report"
      />
      <TextareaInput
        label="Body Template"
        defaultValue={typeof config.bodyTemplate === 'string' ? config.bodyTemplate : ''}
        placeholder="Hello {{name}}, here's your report..."
      />
    </ConfigSection>
  )
}

function WorkflowOverview({ workflow }: { workflow: WorkflowDetail }) {
  const summaryBlocks = [
    {
      label: 'Total Nodes',
      value: String(workflow.nodes.length),
      icon: GitBranch,
    },
    {
      label: 'Status',
      value: workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1),
      icon: Zap,
    },
    {
      label: 'Connections',
      value: String(workflow.edges.length),
      icon: Clock,
    },
    {
      label: 'Last Updated',
      value: new Date(workflow.updatedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      icon: Target,
    },
  ]

  return (
    <aside className="w-[300px] shrink-0 border-l border-frost bg-surface flex flex-col overflow-y-auto">
      <div className="px-4 py-4 border-b border-frost">
        <h2 className="text-[13px] font-semibold text-near-white uppercase tracking-wide">
          Workflow Overview
        </h2>
      </div>

      <div className="p-4 space-y-3">
        {summaryBlocks.map((block) => (
          <div
            key={block.label}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-frost bg-void"
          >
            <div className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center shrink-0 text-muted-text">
              <block.icon size={15} />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] text-muted-text leading-tight">{block.label}</div>
              <div className="text-sm font-semibold text-near-white leading-tight">
                {block.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 py-3 border-t border-frost border-b">
        <div className="flex items-center gap-2">
          <PenLine size={14} className="text-muted-text" />
          <span className="text-[12px] font-medium text-near-white">
            Description
          </span>
        </div>
      </div>

      <div className="p-4">
        <p className="text-xs text-muted-text leading-relaxed">
          {workflow.description}
        </p>
      </div>

      <div className="px-4 py-3 border-t border-frost mt-auto">
        <div className="text-[11px] text-muted-text">
          Created {new Date(workflow.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </div>
      </div>
    </aside>
  )
}
