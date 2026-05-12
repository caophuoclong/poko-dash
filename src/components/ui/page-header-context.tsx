import {
  createContext,
  useContext,
  useState,
  useLayoutEffect,
  useRef,
  useMemo,
} from 'react'
import type { ReactNode } from 'react'
import { ChevronLeft } from 'lucide-react'

export interface PageHeaderConfig {
  title: ReactNode
  description?: ReactNode
  breadcrumb?: ReactNode
  primaryAction?: ReactNode
  secondaryActions?: ReactNode
  subtitle?: ReactNode
  eyebrow?: ReactNode
  backHref?: string
  backLabel?: ReactNode
  actions?: ReactNode
  center?: ReactNode
  custom?: ReactNode
}

function normalizePageHeaderConfig(
  config: PageHeaderConfig | null,
): PageHeaderConfig | null {
  if (!config) return null

  const description = config.description ?? config.subtitle
  const breadcrumb = config.breadcrumb ?? config.eyebrow
  const primaryAction = config.primaryAction
  const secondaryActions = config.secondaryActions

  let actions = config.actions
  if (!actions && (primaryAction || secondaryActions)) {
    actions = (
      <>
        {secondaryActions}
        {primaryAction}
      </>
    )
  }

  return {
    ...config,
    description,
    subtitle: description,
    breadcrumb,
    eyebrow: breadcrumb,
    primaryAction,
    secondaryActions,
    actions,
  }
}

interface PageHeaderContextValue {
  config: PageHeaderConfig | null
  setConfig: (config: PageHeaderConfig | null) => void
}

export const PageHeaderContext = createContext<PageHeaderContextValue | null>(
  null,
)

export function PageHeaderProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<PageHeaderConfig | null>(null)

  return (
    <PageHeaderContext.Provider value={{ config, setConfig }}>
      {children}
    </PageHeaderContext.Provider>
  )
}

export function usePageHeader(config: PageHeaderConfig | null) {
  const ctx = useContext(PageHeaderContext)
  if (!ctx)
    throw new Error('usePageHeader must be used within PageHeaderProvider')

  const { setConfig } = ctx

  const normalizedConfig = useMemo(
    () => normalizePageHeaderConfig(config),
    [config],
  )

  const stableKey = useMemo(() => {
    if (!normalizedConfig) return null
    return [
      String(normalizedConfig.title ?? ''),
      String(normalizedConfig.description ?? ''),
      normalizedConfig.backHref ?? '',
      String(normalizedConfig.breadcrumb ?? ''),
      String(normalizedConfig.primaryAction ?? ''),
      String(normalizedConfig.secondaryActions ?? ''),
      String(normalizedConfig.actions ?? ''),
      String(normalizedConfig.center ?? ''),
    ].join('|')
  }, [
    normalizedConfig?.title,
    normalizedConfig?.description,
    normalizedConfig?.backHref,
    normalizedConfig?.breadcrumb,
    normalizedConfig?.primaryAction,
    normalizedConfig?.secondaryActions,
    normalizedConfig?.actions,
    normalizedConfig?.center,
  ])

  const configRef = useRef(normalizedConfig)
  configRef.current = normalizedConfig

  useLayoutEffect(() => {
    setConfig(configRef.current)
  }, [stableKey, setConfig])

  useLayoutEffect(() => {
    return () => {
      setConfig(null)
    }
  }, [setConfig])
}

export function PageHeaderSlot() {
  const ctx = useContext(PageHeaderContext)
  if (!ctx?.config) return null

  const {
    title,
    description,
    backHref,
    backLabel = 'Quay lại',
    actions,
    custom,
  } = ctx.config

  if (custom) {
    return (
      <div
        data-slot="page-header"
        className="sticky top-0 z-10 bg-[var(--color-canvas)] -mx-4 -mt-4"
      >
        {custom}
      </div>
    )
  }

  return (
    <div
      data-slot="page-header"
      className="sticky top-0 z-10 bg-[var(--color-canvas)] -mx-4 -mt-4 pt-4 px-4 mb-6 space-y-3 pb-4"
    >
      {backHref ? (
        <a
          href={backHref}
          className="inline-flex items-center gap-1 text-xs text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)]"
        >
          <ChevronLeft className="size-3.5" />
          <span>{backLabel}</span>
        </a>
      ) : null}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--color-ink)]">
            {title}
          </h1>
          {description ? (
            <p className="text-sm text-[var(--color-muted)]">{description}</p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        ) : null}
      </div>
    </div>
  )
}
