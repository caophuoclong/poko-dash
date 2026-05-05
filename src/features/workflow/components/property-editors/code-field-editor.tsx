import { lazy, Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import { FieldLabel } from './field-label'
import type { PropertyEditorProps } from './property-editor'

const MonacoEditor = lazy(() => import('@monaco-editor/react'))

interface CodeSchema {
  key: string
  label: string
  required?: boolean
  helperText?: string
  language?: 'javascript' | 'python' | 'sql'
}

const LANG_MAP: Record<string, string> = {
  javascript: 'js',
  python: 'py',
  sql: 'sql',
}

export function CodeFieldEditor({ schema, value, onChange }: PropertyEditorProps) {
  const codeSchema = schema as unknown as CodeSchema
  const language = codeSchema.language ?? 'javascript'
  const codeValue = typeof value === 'string' ? value : ''

  return (
    <div className="space-y-1">
      <FieldLabel required={schema.required}>
        {schema.label}
        <span className="ml-1.5 text-muted-text/50 normal-case font-mono text-[9px]">
          {LANG_MAP[language]}
        </span>
      </FieldLabel>
      <div className="border border-frost rounded-lg overflow-hidden bg-void">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-60 bg-void">
              <Loader2 size={16} className="animate-spin text-muted-text" />
            </div>
          }
        >
          <MonacoEditor
            height="240px"
            language={language}
            value={codeValue}
            onChange={(val) => onChange(schema.key, val ?? '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 12,
              lineNumbers: 'on',
              folding: true,
              glyphMargin: false,
              tabSize: 2,
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
      <p className="text-[10px] text-muted-text/60 font-mono">Available: $input</p>
      {schema.helperText && (
        <p className="text-[10px] text-muted-text/70">{schema.helperText}</p>
      )}
    </div>
  )
}
