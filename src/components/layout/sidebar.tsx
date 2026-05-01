import { useState, useCallback, useRef, useEffect } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Package,
  PenLine,
  Wand2,
  Link2,
  GitBranch,
} from 'lucide-react'
import ThemeToggle from '#/components/layout/theme-toggle'
import { cn } from '#/shared/utils'

interface NavItem {
  id: string
  label: string
  to?: string
  icon: React.ReactNode
  children?: { id: string; label: string; to: string }[]
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    to: '/dash',
    icon: <LayoutDashboard size={18} />,
  },
  {
    id: 'posts',
    label: 'Bài viết',
    icon: <FileText size={18} />,
    children: [
      { id: 'posts-all', label: 'Tất cả bài viết', to: '/dash/posts' },
      { id: 'posts-new', label: 'Tạo bài viết', to: '/dash/posts/new' },
      {
        id: 'posts-scheduled',
        label: 'Đã lên lịch',
        to: '/dash/posts/scheduled',
      },
    ],
  },
  {
    id: 'products',
    label: 'Sản phẩm',
    icon: <Package size={18} />,
    children: [
      { id: 'products-all', label: 'Tất cả sản phẩm', to: '/dash/products' },
      {
        id: 'products-manual-import',
        label: 'Manual Import',
        to: '/dash/products/manual-import',
      },
    ],
  },
  {
    id: 'content',
    label: 'Nội dung',
    to: '/dash/content',
    icon: <PenLine size={18} />,
  },
  {
    id: 'prompts',
    label: 'Prompts',
    to: '/dash/prompts',
    icon: <Wand2 size={18} />,
  },
  {
    id: 'schedule',
    label: 'Lịch đăng',
    to: '/dash/schedule',
    icon: <Calendar size={18} />,
  },
  {
    id: 'workflow',
    label: 'Workflow',
    to: '/dash/workflows',
    icon: <GitBranch size={18} />,
  },
  {
    id: 'analytics',
    label: 'Thống kê',
    to: '/dash/analytics',
    icon: <BarChart3 size={18} />,
  },
  {
    id: 'integrations',
    label: 'Integrations',
    to: '/dash/integrations',
    icon: <Link2 size={18} />,
  },
  {
    id: 'settings',
    label: 'Cài đặt',
    to: '/dash/settings',
    icon: <Settings size={18} />,
  },
]

export default function Sidebar() {
  const location = useRouterState({ select: (s) => s.location })
  const activePath = location.pathname

  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const initialExpanded = new Set(['posts'])
  if (activePath.startsWith('/dash/products')) initialExpanded.add('products')
  const [expandedGroups, setExpandedGroups] =
    useState<Set<string>>(initialExpanded)
  const navRef = useRef<HTMLElement>(null)
  const [focusIndex, setFocusIndex] = useState(0)

  const allFocusable = useCallback(() => {
    if (!navRef.current) return []
    return Array.from(
      navRef.current.querySelectorAll<HTMLElement>(
        '[role="menuitem"]:not([hidden])',
      ),
    )
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const items = allFocusable()
      if (!items.length) return

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault()
          const next = (focusIndex + 1) % items.length
          setFocusIndex(next)
          items[next]?.focus()
          break
        }
        case 'ArrowUp': {
          e.preventDefault()
          const prev = (focusIndex - 1 + items.length) % items.length
          setFocusIndex(prev)
          items[prev]?.focus()
          break
        }
        case 'Home': {
          e.preventDefault()
          setFocusIndex(0)
          items[0]?.focus()
          break
        }
        case 'End': {
          e.preventDefault()
          const last = items.length - 1
          setFocusIndex(last)
          items[last]?.focus()
          break
        }
      }
    },
    [focusIndex, allFocusable],
  )

  const toggleGroup = useCallback((id: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const isActive = useCallback(
    (to?: string) => {
      if (!to) return false
      if (activePath === to) return true
      if (to === '/dash') return false
      return false
    },
    [activePath],
  )

  useEffect(() => {
    if (!mobileOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [mobileOpen])

  const renderNavItem = (item: NavItem, _index: number) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedGroups.has(item.id)
    const isItemActive =
      isActive(item.to) ||
      (hasChildren && item.children!.some((c) => isActive(c.to)))

    if (hasChildren) {
      return (
        <li key={item.id} role="none">
          <button
            role="menuitem"
            aria-expanded={isExpanded}
            onClick={() => toggleGroup(item.id)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-void',
              isItemActive
                ? 'bg-accent-orange-dim text-accent-orange'
                : 'text-muted-text hover:text-near-white hover:bg-surface-2',
            )}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {!collapsed && (
              <>
                <span className="flex-1 text-left">{item.label}</span>
                <ChevronDown
                  size={14}
                  className={cn(
                    'transition-transform duration-200',
                    isExpanded && 'rotate-180',
                  )}
                />
              </>
            )}
          </button>
          {!collapsed && isExpanded && (
            <ul role="menu" className="mt-1 ml-7 space-y-0.5">
              {item.children!.map((child) => (
                <li key={child.id} role="none">
                  <Link
                    role="menuitem"
                    to={child.to}
                    onClick={() => setMobileOpen(false)}
                    activeProps={{
                      className: 'text-accent-orange bg-accent-orange-dim',
                    }}
                    inactiveProps={{
                      className:
                        'text-muted-text hover:text-near-white hover:bg-surface-2',
                    }}
                    className="block px-3 py-2 rounded-lg text-[13px] transition-all duration-150 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-void"
                  >
                    {child.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      )
    }

    return (
      <li key={item.id} role="none">
        <Link
          role="menuitem"
          to={item.to}
          onClick={() => setMobileOpen(false)}
          activeProps={{
            className: 'bg-accent-orange-dim text-accent-orange',
          }}
          inactiveProps={{
            className:
              'text-muted-text hover:text-near-white hover:bg-surface-2',
          }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-void"
          activeOptions={{ exact: item.to === '/dash' }}
        >
          <span className="flex-shrink-0">{item.icon}</span>
          {!collapsed && <span>{item.label}</span>}
        </Link>
      </li>
    )
  }

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between px-4 py-5 border-b border-frost">
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-8 h-8 rounded-lg bg-accent-orange flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 18 18" fill="none" className="w-[18px] h-[18px]">
              <path
                d="M4 9h10M4 6h7M4 12h5"
                style={{ stroke: 'var(--t-accent-on)' }}
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
          {!collapsed && (
            <span className="font-display font-bold text-lg text-near-white tracking-tight">
              Poko
            </span>
          )}
        </Link>
        <div className="flex items-center gap-2">
          {!collapsed && <ThemeToggle />}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-md text-muted-text hover:text-near-white hover:bg-surface-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
            aria-label={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </div>

      <nav
        ref={navRef}
        role="menu"
        aria-label="Sidebar navigation"
        onKeyDown={handleKeyDown}
        className="flex-1 overflow-y-auto px-3 py-4"
      >
        <ul role="menu" className="space-y-1">
          {NAV_ITEMS.map((item, i) => renderNavItem(item, i))}
        </ul>
      </nav>

      <div className="border-t border-frost px-3 py-4">
        <a
          href="/logout"
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 no-underline',
            'text-muted-text hover:text-accent-red hover:bg-accent-red/10',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-void',
          )}
        >
          <LogOut size={18} />
          {!collapsed && <span>Đăng xuất</span>}
        </a>
      </div>
    </>
  )

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-lg bg-surface border border-frost text-near-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
        aria-label="Mở menu"
      >
        <Menu size={20} />
      </button>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-screen bg-void border-r border-frost flex flex-col transition-all duration-300',
          'lg:relative lg:z-auto',
          collapsed ? 'w-[68px]' : 'w-[260px]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
        aria-label="Sidebar"
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden absolute top-4 right-3 w-8 h-8 flex items-center justify-center rounded-md text-muted-text hover:text-near-white hover:bg-surface-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
          aria-label="Đóng menu"
        >
          <X size={18} />
        </button>
        {sidebarContent}
      </aside>
    </>
  )
}
