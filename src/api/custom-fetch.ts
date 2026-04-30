const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return ''
  }
  return process.env.BACKEND_URL ?? 'http://localhost:3000'
}

export const customFetch = async <T>(
  url: string,
  options?: RequestInit,
): Promise<T> => {
  const base = getBaseUrl()
  const fullUrl = `${base}${url}`
  const res = await fetch(fullUrl, options)
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`)
  }
  const body = [204, 205, 304].includes(res.status)
    ? null
    : await res.text()
  return (body ? JSON.parse(body) : undefined) as T
}
