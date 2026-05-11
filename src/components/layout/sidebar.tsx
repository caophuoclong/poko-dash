import { useState } from 'react'
import { Link, useRouterState, useNavigate } from '@tanstack/react-router'
import { ChevronDown, LogOut } from 'lucide-react'
import ThemeToggle from '#/components/layout/theme-toggle'
import { NAV_SECTIONS, SYSTEM_ITEMS } from '#/shared/constants/nav'
import type { NavItem } from '#/shared/constants/nav'
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
  SidebarRail,
  SidebarTrigger,
  SidebarSeparator,
} from '#/components/ui/sidebar'
import { cn } from '#/shared/utils'
import { Button } from '../ui/button'

export default function Sidebar() {
  const location = useRouterState({ select: (s) => s.location })

  const activePath = location.pathname

  const initialExpanded = new Set(['posts'])
  if (activePath.startsWith('/dash/products')) initialExpanded.add('products')
  const [expandedGroups, setExpandedGroups] =
    useState<Set<string>>(initialExpanded)

  const isActive = (to?: string) => {
    if (!to) return false
    if (activePath === to) return true
    // if (to !== '/dash' && activePath.startsWith(to)) return true
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
          <Link to={item.to} activeOptions={{ exact: item.to === '/dash' }}>
            {item.icon}
            <span>{item.label}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <>
      <SidebarTrigger className="fixed top-4 sm:hidden left-4 z-50 bg-[var(--color-canvas)] border border-[var(--color-hairline)] text-[var(--color-ink)] hover:bg-[var(--color-surface-soft)]" />
      <AppSidebar
        collapsible="icon"
        className="border-r border-[var(--color-hairline)] bg-[var(--color-canvas)]"
      >
        {/* ── Header: Brand + Utilities ── */}
        <SidebarHeader className="border-b border-(--color-hairline) px-3 py-0 h-12 justify-center">
          <div className="flex items-center justify-between gap-2">
            <Button
              size={'xs'}
              className="rounded-sm flex shrink-0 items-center justify-center"
            >
              <svg viewBox="0 0 18 18" fill="none" className="h-4.5 w-4.5">
                <path
                  d="M4 9h10M4 6h7M4 12h5"
                  style={{ stroke: 'var(--color-ink)' }}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
              <span className="font-display text-lg font-bold tracking-tight text-(--color-ink) group-data-[collapsible=icon]:hidden">
                Poko
              </span>
            </Button>
            <div className="hidden items-center gap-2 group-data-[collapsible=icon]:hidden lg:flex">
              <ThemeToggle />
              <SidebarTrigger className="text-[var(--color-muted)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-ink)]" />
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
                    <Link to={item.to}>
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
