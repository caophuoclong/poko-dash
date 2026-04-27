import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'

const STORAGE_KEY = 'theme'

function isDark(): boolean {
  return document.documentElement.classList.contains('dark')
}

function applyTheme(dark: boolean) {
  localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light')
  document.documentElement.classList.toggle('dark', dark)
}

export default function ThemeToggle({ className }: { className?: string }) {
  const [dark, setDark] = useState(true)

  useEffect(() => {
    setDark(isDark())
  }, [])

  const toggle = () => {
    const next = !dark
    applyTheme(next)
    setDark(next)
  }

  return (
    <button
      onClick={toggle}
      className={
        className ??
        'flex items-center justify-center w-8 h-8 rounded-lg text-muted-text hover:text-near-white hover:bg-surface-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue'
      }
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}
