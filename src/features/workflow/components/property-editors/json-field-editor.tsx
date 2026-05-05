import { lazy, Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import { FieldLabel } from './field-label'
import type { PropertyEditorProps } from './property-editor'

const MonacoEditor = lazy(() => import('@monaco-editor/react'))

export function JsonFieldEditor({ schema, value, onChange }: PropertyEditorProps) {
  const jsonString = typeof value === 'string'
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
            theme="vs-dark"
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
              monaco.editor.defineTheme('poko-dark', {
                base: 'vs-dark',
                inherit: true,
                rules: [],
                colors: {
                  'editor.background': '#000000',
                  'editor.foreground': '#f0f0f0',
                  'editorLineNumber.foreground': '#888780',
                  'editorLineNumber.activeForeground': '#a1a4a5',
                  'editorCursor.foreground': '#3b9eff',
                  'editor.selectionBackground': '#3b9eff33',
                  'editor.inactiveSelectionBackground': '#3b9eff22',
                },
              })
            }}
            onMount={(editor, monaco) => {
              monaco.editor.setTheme('poko-dark')
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
