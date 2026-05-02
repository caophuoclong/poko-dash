export async function exportWorkflow(workflowId: string): Promise<void> {
  const res = await fetch(`/api/workflows/${workflowId}/export`)
  if (!res.ok) throw new Error(`Export failed: ${res.status}`)
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `workflow-${workflowId}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export async function importWorkflow(
  file: File,
): Promise<{ id: string; name: string }> {
  const text = await file.text()
  let body: unknown
  try {
    body = JSON.parse(text)
  } catch {
    throw new Error('Invalid JSON file')
  }
  const res = await fetch('/api/workflows/import', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json() as Promise<{ id: string; name: string }>
}
