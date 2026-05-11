import { lazy, Suspense, useEffect, useRef } from 'react'
import { Loader2 } from 'lucide-react'
import { FieldLabel } from './field-label'
import type { PropertyEditorProps } from './property-editor'

const MonacoEditor = lazy(() => import('@monaco-editor/react'))

export function JsonFieldEditor({
  schema,
  value,
  onChange,
}: PropertyEditorProps) {
  const editorRef = useRef<any>(null)

  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (!editorRef.current) return
      const isDark = document.documentElement.classList.contains('dark')
      const monaco = (window as any).monaco
      monaco?.editor?.setTheme(isDark ? 'poko-dark' : 'poko-light')
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
    return () => observer.disconnect()
  }, [])

  const jsonString =
    typeof value === 'string'
      ? value
      : value != null
        ? JSON.stringify(value, null, 2)
        : ''

  const handleChange = (newValue: string | undefined) => {
    if (newValue === undefined) return
    try {
      const parsed = JSON.parse(newValue)
      onChange(schema.key, parsed)
    } catch {
      onChange(schema.key, newValue)
    }
  }

  return (
    <div className="space-y-1">
      <FieldLabel required={schema.required}>{schema.label}</FieldLabel>
      <div className="border border-frost rounded-lg overflow-hidden bg-void">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-40 bg-void">
              <Loader2 size={16} className="animate-spin text-muted-text" />
            </div>
          }
        >
          <MonacoEditor
            height="160px"
            language="json"
            value={jsonString}
            onChange={handleChange}
            theme="vs"
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 12,
              lineNumbers: 'off',
              folding: false,
              glyphMargin: false,
              lineDecorationsWidth: 0,
              lineNumbersMinChars: 0,
              automaticLayout: true,
              wordWrap: 'on',
              padding: { top: 10 },
            }}
            beforeMount={(monaco) => {
              const styles = getComputedStyle(document.documentElement)
              const isDark = document.documentElement.classList.contains('dark')

              monaco.editor.defineTheme('poko-dark', {
                base: 'vs-dark',
                inherit: true,
                rules: [],
                colors: {
                  'editor.background': styles
                    .getPropertyValue('--t-void')
                    .trim(),
                  'editor.foreground': styles
                    .getPropertyValue('--t-foreground')
                    .trim(),
                  'editorLineNumber.foreground': styles
                    .getPropertyValue('--t-muted-text')
                    .trim(),
                  'editorLineNumber.activeForeground': styles
                    .getPropertyValue('--t-silver')
                    .trim(),
                  'editorCursor.foreground': styles
                    .getPropertyValue('--t-accent-blue')
                    .trim(),
                  'editor.selectionBackground': `${styles.getPropertyValue('--t-accent-blue').trim()}33`,
                  'editor.inactiveSelectionBackground': `${styles.getPropertyValue('--t-accent-blue').trim()}22`,
                },
              })

              monaco.editor.defineTheme('poko-light', {
                base: 'vs',
                inherit: true,
                rules: [],
                colors: {
                  'editor.background': styles
                    .getPropertyValue('--t-void')
                    .trim(),
                  'editor.foreground': styles
                    .getPropertyValue('--t-foreground')
                    .trim(),
                  'editorLineNumber.foreground': styles
                    .getPropertyValue('--t-muted-text')
                    .trim(),
                  'editorLineNumber.activeForeground': styles
                    .getPropertyValue('--t-silver')
                    .trim(),
                  'editorCursor.foreground': styles
                    .getPropertyValue('--t-accent-blue')
                    .trim(),
                  'editor.selectionBackground': `${styles.getPropertyValue('--t-accent-blue').trim()}33`,
                  'editor.inactiveSelectionBackground': `${styles.getPropertyValue('--t-accent-blue').trim()}22`,
                },
              })

              monaco.editor.setTheme(isDark ? 'poko-dark' : 'poko-light')
            }}
          />
        </Suspense>
      </div>
      {schema.helperText && (
        <p className="text-[10px] text-muted-text/70">{schema.helperText}</p>
      )}
    </div>
  )
}
