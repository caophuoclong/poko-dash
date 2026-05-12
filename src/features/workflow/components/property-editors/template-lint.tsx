import { AlertCircle } from 'lucide-react'
import { useMemo } from 'react'
import { validateTemplateExpression } from '../../utils/variable-system-utils'
import type {
  VariableRef,
  TemplateValidationIssue,
} from '../../utils/variable-system-utils'

interface TemplateLintProps {
  value: string
  availableVars: VariableRef[]
}

export function TemplateLint({ value, availableVars }: TemplateLintProps) {
  const issues = useMemo(
    () => validateTemplateExpression(value, availableVars),
    [value, availableVars],
  )

  if (issues.length === 0) return null

  return (
    <div className="space-y-1 mt-1">
      {issues.map((issue: TemplateValidationIssue, idx: number) => (
        <div
          key={idx}
          className={
            issue.severity === 'error'
              ? 'flex items-start gap-1.5 text-[10px] text-accent-red'
              : 'flex items-start gap-1.5 text-[10px] text-accent-yellow'
          }
        >
          <AlertCircle size={10} className="shrink-0 mt-0.5" />
          <span>{issue.message}</span>
        </div>
      ))}
    </div>
  )
}
