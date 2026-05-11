import { lazy, Suspense, useRef, useCallback, useState, useEffect } from 'react'
import { Loader2, Variable } from 'lucide-react'
import { FieldLabel } from './field-label'
import { VariablePicker } from '../variable-picker'
import { TemplateLint } from './template-lint'
import type { PropertyEditorProps } from './property-editor'
import type { Monaco } from '@monaco-editor/react'

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

export function CodeFieldEditor({ schema, value, onChange, availableVars }: PropertyEditorProps) {
  const codeSchema = schema as unknown as CodeSchema
  const language = codeSchema.language ?? 'javascript'
  const codeValue = typeof value === 'string' ? value : ''
  const editorRef = useRef<any>(null)
  const completionRef = useRef<any>(null)
  const [pickerOpen, setPickerOpen] = useState(false)

  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (!editorRef.current) return
      const isDark = document.documentElement.classList.contains('dark')
      const monaco = (window as any).monaco
      monaco?.editor?.setTheme(isDark ? 'poko-dark' : 'poko-light')
    })

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const handleInsert = useCallback((varRef: string) => {
    const editor = editorRef.current
    if (!editor) return
    const position = editor.getPosition()
    if (!position) return
    const insert = `{{${varRef}}}`
    editor.executeEdits('variable-insert', [
      {
        range: {
          startLineNumber: position.lineNumber,
          startColumn: position.column,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        },
        text: insert,
      },
    ])
    editor.focus()
    setPickerOpen(false)
  }, [])

  const handleEditorMount = useCallback(
    (ed: any, monaco: Monaco) => {
      const isDark = document.documentElement.classList.contains('dark')
      monaco.editor.setTheme(isDark ? 'poko-dark' : 'poko-light')
      editorRef.current = ed

      // Dispose previous provider if remounting
      completionRef.current?.dispose()

      if (!availableVars || availableVars.length === 0) return

      completionRef.current = monaco.languages.registerCompletionItemProvider(language, {
        triggerCharacters: ['{', '.'],
        provideCompletionItems(model: any, position: any) {
          const textUntil = model.getValueInRange({
            startLineNumber: position.lineNumber,
            startColumn: 1,
            endLineNumber: position.lineNumber,
            endColumn: position.column,
          })

          // Only trigger inside {{ or after {{ prefix
          const match = textUntil.match(/\{\{([a-zA-Z_$][a-zA-Z0-9_.$]*)$/)
          if (!match && !textUntil.endsWith('{{')) return { suggestions: [] }

          const prefix = match ? match[1] : ''
          const word = model.getWordUntilPosition(position)
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          }

          const filtered = prefix
            ? availableVars.filter((v) => v.id.startsWith(prefix))
            : availableVars

          return {
            suggestions: filtered.map((v) => ({
              label: v.id,
              kind: monaco.languages.CompletionItemKind.Variable,
              detail: v.description,
              documentation: v.sampleValue ? `Sample: ${v.sampleValue}` : undefined,
              insertText: textUntil.endsWith('{{') ? `${v.id}}}` : `${v.id.slice(prefix.length)}}}`,
              range,
            })),
          }
        },
      })
    },
    [availableVars, language],
  )

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <FieldLabel required={schema.required}>
          {schema.label}
          <span className="ml-1.5 text-muted-text/50 normal-case font-mono text-[9px]">
            {LANG_MAP[language]}
          </span>
        </FieldLabel>
        {availableVars && availableVars.length > 0 && (
          <button
            type="button"
            onClick={() => setPickerOpen((v) => !v)}
            className="w-5 h-5 flex items-center justify-center rounded text-muted-text hover:text-accent-blue hover:bg-accent-blue/10 transition-colors"
            title="Insert variable"
          >
            <Variable size={12} />
          </button>
        )}
      </div>
      {pickerOpen && availableVars && (
        <div className="mb-2">
          <VariablePicker
            variables={availableVars}
            onInsert={handleInsert}
            onClose={() => setPickerOpen(false)}
          />
        </div>
      )}
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
            theme="vs"
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
              const styles = getComputedStyle(document.documentElement)

              monaco.editor.defineTheme('poko-dark', {
                base: 'vs-dark',
                inherit: true,
                rules: [],
                colors: {
                  'editor.background': styles.getPropertyValue('--t-void').trim(),
                  'editor.foreground': styles.getPropertyValue('--t-foreground').trim(),
                  'editorLineNumber.foreground': styles.getPropertyValue('--t-muted-text').trim(),
                  'editorLineNumber.activeForeground': styles.getPropertyValue('--t-silver').trim(),
                  'editorCursor.foreground': styles.getPropertyValue('--t-accent-blue').trim(),
                  'editor.selectionBackground': `${styles.getPropertyValue('--t-accent-blue').trim()}33`,
                  'editor.inactiveSelectionBackground': `${styles.getPropertyValue('--t-accent-blue').trim()}22`,
                },
              })

              monaco.editor.defineTheme('poko-light', {
                base: 'vs',
                inherit: true,
                rules: [],
                colors: {
                  'editor.background': styles.getPropertyValue('--t-void').trim(),
                  'editor.foreground': styles.getPropertyValue('--t-foreground').trim(),
                  'editorLineNumber.foreground': styles.getPropertyValue('--t-muted-text').trim(),
                  'editorLineNumber.activeForeground': styles.getPropertyValue('--t-silver').trim(),
                  'editorCursor.foreground': styles.getPropertyValue('--t-accent-blue').trim(),
                  'editor.selectionBackground': `${styles.getPropertyValue('--t-accent-blue').trim()}33`,
                  'editor.inactiveSelectionBackground': `${styles.getPropertyValue('--t-accent-blue').trim()}22`,
                },
              })
            }}
            onMount={handleEditorMount}
          />
        </Suspense>
      </div>
      <p className="text-[10px] text-muted-text/60 font-mono">
        Available: $input — type <code>{'{{'}  </code> for variable suggestions
      </p>
      {availableVars && codeValue && (
        <TemplateLint value={codeValue} availableVars={availableVars} />
      )}
      {schema.helperText && (
        <p className="text-[10px] text-muted-text/70">{schema.helperText}</p>
      )}
    </div>
  )
}
