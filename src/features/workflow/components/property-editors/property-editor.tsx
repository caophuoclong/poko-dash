import type { PropertySchema, ValidationError } from '../../node-types.old.abcd'
import type { VariableRef } from '../../utils/variable-system-utils'
import { TextFieldEditor } from './text-field-editor'
import { TextareaFieldEditor } from './textarea-field-editor'
import { NumberFieldEditor } from './number-field-editor'
import { SelectFieldEditor } from './select-field-editor'
import { MultiSelectFieldEditor } from './multi-select-field-editor'
import { ToggleFieldEditor } from './toggle-field-editor'
import { SliderFieldEditor } from './slider-field-editor'
import { TagInputFieldEditor } from './tag-input-field-editor'
import { CronFieldEditor } from './cron-field-editor'
import { RuleBuilderEditor } from './rule-builder-editor'
import { FieldPickerEditor } from './field-picker-editor'
import { UrlFieldEditor } from './url-field-editor'
import { JsonFieldEditor } from './json-field-editor'
import { CodeFieldEditor } from './code-field-editor'
import { KeyValueFieldEditor } from './key-value-field-editor'
import { AssignmentsFieldEditor } from './assignments-field-editor'
import { ConditionsFieldEditor } from './conditions-field-editor'

export interface PropertyEditorProps {
  schema: PropertySchema
  value: unknown
  onChange: (key: string, value: unknown) => void
  allProps: Record<string, unknown>
  errors: ValidationError[]
  availableVars?: VariableRef[]
}

const EDITOR_MAP: Record<string, React.ComponentType<PropertyEditorProps>> = {
  text: TextFieldEditor,
  string: TextFieldEditor,
  textarea: TextareaFieldEditor,
  number: NumberFieldEditor,
  select: SelectFieldEditor,
  'multi-select': MultiSelectFieldEditor,
  multiselect: MultiSelectFieldEditor,
  toggle: ToggleFieldEditor,
  boolean: ToggleFieldEditor,
  slider: SliderFieldEditor,
  'tag-input': TagInputFieldEditor,
  cron: CronFieldEditor,
  'rule-builder': RuleBuilderEditor,
  'field-picker': FieldPickerEditor,
  url: UrlFieldEditor,
  json: JsonFieldEditor,
  code: CodeFieldEditor,
  keyValue: KeyValueFieldEditor,
  assignments: AssignmentsFieldEditor,
  conditions: ConditionsFieldEditor,
  enum: SelectFieldEditor,
  date: TextFieldEditor,
  datetime: TextFieldEditor,
}

export function PropertyEditor({
  schema,
  value,
  onChange,
  allProps,
  errors,
  availableVars,
}: PropertyEditorProps) {
  if (
    schema.showWhen &&
    allProps[schema.showWhen.field] !== schema.showWhen.equals
  ) {
    return null
  }
  if (schema.visibleWhen && !schema.visibleWhen(allProps)) {
    return null
  }

  const Editor = EDITOR_MAP[schema.type]
  if (!Editor) {
    console.warn(`[PropertyEditor] No editor for type: ${schema.type}`)
    return null
  }

  const fieldErrors = errors.filter((e) => e.propertyKey === schema.key)
  return (
    <div className="space-y-1.5">
      <Editor
        schema={schema}
        value={value}
        onChange={onChange}
        allProps={allProps}
        errors={fieldErrors}
        availableVars={availableVars}
      />
      {fieldErrors.length > 0 && (
        <div className="space-y-0.5">
          {fieldErrors.map((err, i) => (
            <p
              key={i}
              className={
                err.severity === 'error'
                  ? 'text-[11px] text-accent-red'
                  : 'text-[11px] text-accent-yellow'
              }
            >
              {err.message}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

export { FieldLabel } from './field-label'
