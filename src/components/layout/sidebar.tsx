import { useState } from 'react'
import { Link, useRouterState, useNavigate } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  Package,
  PenLine,
  Wand2,
  Link2,
  GitBranch,
  Plus,
  Search,
  Bell,
  Users,
  CreditCard,
  Image,
  Clock,
  Globe,
  TrendingUp,
  Sparkles,
} from 'lucide-react'
import ThemeToggle from '#/components/layout/theme-toggle'
import {
  Sidebar as AppSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarMenuBadge,
  SidebarRail,
  SidebarTrigger,
  SidebarSeparator,
} from '#/components/ui/sidebar'
import { Button } from '#/components/ui/button'
import { cn } from '#/shared/utils'

interface NavItem {
  id: string
  label: string
  to?: string
  icon: React.ReactNode
  disabled?: boolean
  children?: { id: string; label: string; to: string; disabled?: boolean }[]
}

interface NavSection {
  id: string
  label: string
  items: NavItem[]
}

const NAV_SECTIONS: NavSection[] = [
  {
    id: 'workspace',
    label: '',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        to: '/dash',
        icon: <LayoutDashboard size={18} />,
      },
    ],
  },
  {
    id: 'create',
    label: 'Create',
    items: [
      {
        id: 'posts',
        label: 'Posts',
        icon: <FileText size={18} />,
        children: [
          { id: 'posts-all', label: 'All posts', to: '/dash/posts' },
          { id: 'posts-new', label: 'Create post', to: '/dash/posts/new' },
          {
            id: 'posts-scheduled',
            label: 'Scheduled',
            to: '/dash/posts/scheduled',
          },
        ],
      },
      {
        id: 'content',
        label: 'Content Library',
        to: '/dash/content',
        icon: <PenLine size={18} />,
      },
      {
        id: 'prompts',
        label: 'AI Prompts',
        to: '/dash/prompts',
        icon: <Wand2 size={18} />,
      },
    ],
  },
  {
    id: 'automations',
    label: 'Automations',
    items: [
      {
        id: 'workflow',
        label: 'Workflows',
        to: '/dash/workflows',
        icon: <GitBranch size={18} />,
      },
      {
        id: 'schedule',
        label: 'Schedules',
        to: '/dash/schedule',
        icon: <Calendar size={18} />,
      },
    ],
  },
  {
    id: 'distribution',
    label: 'Distribution',
    items: [
      {
        id: 'publish-queue',
        label: 'Publish Queue',
        to: '/dash/schedule',
        icon: <Clock size={18} />,
      },
      {
        id: 'platforms',
        label: 'Platforms',
        to: '/dash/integrations',
        icon: <Globe size={18} />,
      },
    ],
  },
  {
    id: 'intelligence',
    label: 'Intelligence',
    items: [
      {
        id: 'analytics',
        label: 'Analytics',
        to: '/dash/analytics',
        icon: <BarChart3 size={18} />,
      },
      {
        id: 'performance',
        label: 'Performance',
        icon: <TrendingUp size={18} />,
        disabled: true,
      },
    ],
  },
  {
    id: 'assets',
    label: 'Assets',
    items: [
      {
        id: 'products',
        label: 'Products',
        icon: <Package size={18} />,
        children: [
          { id: 'products-all', label: 'All products', to: '/dash/products' },
          {
            id: 'products-manual-import',
            label: 'Manual Import',
            to: '/dash/products/manual-import',
          },
        ],
      },
      {
        id: 'media',
        label: 'Media',
        icon: <Image size={18} />,
        disabled: true,
      },
    ],
  },
]

const SYSTEM_ITEMS: NavItem[] = [
  {
    id: 'integrations',
    label: 'Integrations',
    to: '/dash/integrations',
    icon: <Link2 size={18} />,
  },
  {
    id: 'team',
    label: 'Team',
    icon: <Users size={18} />,
    disabled: true,
  },
  {
    id: 'billing',
    label: 'Billing',
    icon: <CreditCard size={18} />,
    disabled: true,
  },
  {
    id: 'settings',
    label: 'Settings',
    to: '/dash/settings',
    icon: <Settings size={18} />,
  },
]

export default function Sidebar() {
  const location = useRouterState({ select: (s) => s.location })
  const navigate = useNavigate()
  const activePath = location.pathname

  const initialExpanded = new Set(['posts'])
  if (activePath.startsWith('/dash/products')) initialExpanded.add('products')
  const [expandedGroups, setExpandedGroups] =
    useState<Set<string>>(initialExpanded)

  const isActive = (to?: string) => {
    if (!to) return false
    if (activePath === to) return true
    if (to !== '/dash' && activePath.startsWith(to)) return true
    return false
  }

  const toggleGroup = (id: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const itemClasses = cn(
    'text-[var(--color-muted)]',
    'hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-ink)]',
    'data-[active=true]:bg-accent-orange-dim data-[active=true]:text-accent-orange',
    'transition-colors',
  )

  const renderNavItem = (item: NavItem) => {
    const hasChildren = !!item.children?.length
    const isExpanded = expandedGroups.has(item.id)
    const isItemActive =
      isActive(item.to) ||
      (hasChildren && item.children!.some((child) => isActive(child.to)))

    if (item.disabled) {
      return (
        <SidebarMenuItem key={item.id}>
          <SidebarMenuButton
            disabled
            tooltip={item.label}
            className="text-[var(--color-muted-soft)] opacity-50 cursor-not-allowed"
          >
            {item.icon}
            <span>{item.label}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )
    }

    if (hasChildren) {
      return (
        <SidebarMenuItem key={item.id}>
          <SidebarMenuButton
            onClick={() => toggleGroup(item.id)}
            isActive={isItemActive}
            tooltip={item.label}
            className={itemClasses}
          >
            {item.icon}
            <span>{item.label}</span>
            <ChevronDown
              size={14}
              className={cn(
                'ml-auto transition-transform duration-200 group-data-[collapsible=icon]:hidden',
                isExpanded && 'rotate-180',
              )}
            />
          </SidebarMenuButton>
          {isExpanded && (
            <SidebarMenuSub>
              {item.children!.map((child) => (
                <SidebarMenuSubItem key={child.id}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={isActive(child.to)}
                    className={itemClasses}
                  >
                    <Link to={child.to}>
                      <span>{child.label}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          )}
        </SidebarMenuItem>
      )
    }

    return (
      <SidebarMenuItem key={item.id}>
        <SidebarMenuButton
          asChild
          isActive={isActive(item.to)}
          tooltip={item.label}
          className={itemClasses}
        >
          <Link
            to={item.to!}
            activeOptions={{ exact: item.to === '/dash' }}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <>
      <SidebarTrigger className="fixed top-4 left-4 z-50 lg:hidden bg-[var(--color-canvas)] border border-[var(--color-hairline)] text-[var(--color-ink)] hover:bg-[var(--color-surface-soft)]" />
      <AppSidebar
        collapsible="icon"
        className="border-r border-[var(--color-hairline)] bg-[var(--color-canvas)]"
      >
        {/* ── Header: Brand + Utilities ── */}
        <SidebarHeader className="border-b border-[var(--color-hairline)] px-3 py-4">
          <div className="flex items-center justify-between gap-2">
            <Link to="/" className="flex items-center gap-2.5 no-underline">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-accent-orange">
                <svg
                  viewBox="0 0 18 18"
                  fill="none"
                  className="h-[18px] w-[18px]"
                >
                  <path
                    d="M4 9h10M4 6h7M4 12h5"
                    style={{ stroke: 'var(--t-accent-on)' }}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span className="font-display text-lg font-bold tracking-tight text-[var(--color-ink)] group-data-[collapsible=icon]:hidden">
                Poko
              </span>
            </Link>
            <div className="hidden items-center gap-2 group-data-[collapsible=icon]:hidden lg:flex">
              <ThemeToggle />
              <SidebarTrigger className="text-[var(--color-muted)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-ink)]" />
            </div>
          </div>

          {/* Quick actions */}
          <div className="mt-3 space-y-1 group-data-[collapsible=icon]:hidden">
            <Button
              size="sm"
              color="orange"
              className="w-full justify-start gap-2"
              onClick={() => navigate({ to: '/dash/posts/new' })}
            >
              <Plus size={15} />
              Create
            </Button>
            <div className="flex gap-1">
              <button
                className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-[var(--radius-xs)] text-xs text-[var(--color-muted)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-ink)] transition-colors"
                title="Search (⌘K)"
              >
                <Search size={14} />
                <span className="hidden sm:inline">Search</span>
              </button>
              <button
                className="flex items-center justify-center gap-1.5 h-8 px-2 rounded-[var(--radius-xs)] text-xs text-[var(--color-muted)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-ink)] transition-colors relative"
                title="Notifications"
              >
                <Bell size={14} />
              </button>
            </div>
          </div>
        </SidebarHeader>

        {/* ── Main navigation ── */}
        <SidebarContent className="px-3 py-2">
          {NAV_SECTIONS.map((section) => (
            <SidebarGroup key={section.id} className="p-0">
              {section.label ? (
                <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted-soft)] px-2 pt-3 pb-1">
                  {section.label}
                </SidebarGroupLabel>
              ) : null}
              <SidebarGroupContent>
                <SidebarMenu className="gap-0.5">
                  {section.items.map(renderNavItem)}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>

        {/* ── System zone (bottom, muted) ── */}
        <SidebarFooter className="border-t border-[var(--color-hairline)] p-2">
          <SidebarMenu>
            {SYSTEM_ITEMS.map((item) => {
              if (item.disabled) {
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      disabled
                      tooltip={item.label}
                      className="text-[var(--color-muted-soft)] opacity-50 cursor-not-allowed"
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              }
              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.to)}
                    tooltip={item.label}
                    className={itemClasses}
                  >
                    <Link to={item.to!}>
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}

            <SidebarSeparator className="my-1" />

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="Log out"
                className="text-[var(--color-muted)] hover:bg-accent-red/10 hover:text-accent-red"
              >
                <a href="/logout">
                  <LogOut size={18} />
                  <span>Log out</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </AppSidebar>
    </>
  )
}
