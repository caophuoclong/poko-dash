import {
  createContext,
  useContext,
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from 'react'
import { ChevronLeft } from 'lucide-react'

export interface PageHeaderConfig {
  title: ReactNode
  subtitle?: ReactNode
  eyebrow?: ReactNode
  backHref?: string
  backLabel?: ReactNode
  actions?: ReactNode
  custom?: ReactNode
}

interface PageHeaderContextValue {
  config: PageHeaderConfig | null
  setConfig: (config: PageHeaderConfig | null) => void
}

const PageHeaderContext = createContext<PageHeaderContextValue | null>(null)

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
  const prevKeyRef = useRef<string | null>(null)

  useLayoutEffect(() => {
    const key = config
      ? `${config.title ?? ''}|${config.subtitle ?? ''}|${config.backHref ?? ''}|${config.eyebrow ?? ''}`
      : null
    if (prevKeyRef.current !== key) {
      prevKeyRef.current = key
      setConfig(config)
    }
  }, [config, setConfig])

  useEffect(() => {
    return () => setConfig(null)
  }, [setConfig])
}

export function PageHeaderSlot() {
  const ctx = useContext(PageHeaderContext)
  if (!ctx?.config) return null

  const {
    title,
    subtitle,
    eyebrow,
    backHref,
    backLabel = 'Quay lại',
    actions,
    custom,
  } = ctx.config

  if (custom) {
    return (
      <div
        data-slot="page-header"
        className="sticky top-0 z-10 bg-surface -mx-4 -mt-4"
      >
        {custom}
      </div>
    )
  }

  return (
    <div
      data-slot="page-header"
      className="sticky top-0 z-10 bg-surface -mx-4 -mt-4 pt-4 px-4 mb-6 space-y-3 pb-4"
    >
      {backHref ? (
        <a
          href={backHref}
          className="inline-flex items-center gap-1 text-xs text-muted-text transition-colors hover:text-near-white"
        >
          <ChevronLeft className="size-3.5" />
          <span>{backLabel}</span>
        </a>
      ) : null}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          {eyebrow ? (
            <div className="text-xs font-medium uppercase tracking-wide text-muted-text">
              {eyebrow}
            </div>
          ) : null}
          <h1 className="font-display text-2xl font-bold tracking-tight text-near-white">
            {title}
          </h1>
          {subtitle ? (
            <p className="text-sm text-muted-text">{subtitle}</p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        ) : null}
      </div>
    </div>
  )
}
