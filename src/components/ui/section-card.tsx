import * as React from 'react'
import { cn } from '#/shared/utils'

interface SectionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: 'default' | 'danger'
  padded?: boolean
}

function SectionCard({
  className,
  tone = 'default',
  padded = false,
  ...props
}: SectionCardProps) {
  return (
    <div
      data-slot="section-card"
      data-tone={tone}
      className={cn(
        'rounded-2xl border bg-surface',
        tone === 'default' && 'border-frost',
        tone === 'danger' && 'border-accent-red/20',
        padded && 'p-5 md:p-6',
        className,
      )}
      {...props}
    />
  )
}

interface SectionCardHeaderProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'title'
> {
  title?: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
}

function SectionCardHeader({
  title,
  description,
  actions,
  className,
  children,
  ...props
}: SectionCardHeaderProps) {
  return (
    <div
      data-slot="section-card-header"
      className={cn(
        'flex items-start justify-between gap-3 border-b border-frost px-5 py-4',
        className,
      )}
      {...props}
    >
      {children ?? (
        <>
          <div className="min-w-0 space-y-1">
            {title ? (
              <h2 className="font-display text-base font-semibold text-near-white">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="text-xs text-muted-text">{description}</p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          ) : null}
        </>
      )}
    </div>
  )
}

function SectionCardBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="section-card-body"
      className={cn('p-5 md:p-6', className)}
      {...props}
    />
  )
}

export { SectionCard, SectionCardHeader, SectionCardBody }
