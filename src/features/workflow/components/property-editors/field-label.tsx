export function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode
  required?: boolean
}) {
  return (
    <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-text">
      {children}
      {required && <span className="text-accent-red ml-0.5">*</span>}
    </label>
  )
}
