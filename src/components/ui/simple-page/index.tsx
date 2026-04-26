// layer: component
import { ComponentType } from 'react'

interface SimplePageProps {
  title: string
  subtitle?: string
  icon?: ComponentType<{ className?: string }>
}

export function SimplePage({ title, subtitle, icon: Icon }: SimplePageProps) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-near-white flex items-center gap-3">
        {Icon && <Icon className="size-6" />}
        {title}
      </h1>
      {subtitle && <p className="text-sm text-muted-text mt-2">{subtitle}</p>}
    </div>
  )
}
