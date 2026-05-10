import { useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
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
} from 'lucide-react'
import ThemeToggle from '#/components/layout/theme-toggle'
import {
  Sidebar as AppSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
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
} from '#/components/ui/sidebar'
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
  const initialExpanded = new Set(['posts'])
  if (activePath.startsWith('/dash/products')) initialExpanded.add('products')
  const [expandedGroups, setExpandedGroups] =
    useState<Set<string>>(initialExpanded)

  const isActive = (to?: string) => {
    if (!to) return false
    if (activePath === to) return true
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

  return (
    <>
      <SidebarTrigger className="fixed top-4 left-4 z-50 lg:hidden bg-surface border border-frost text-near-white hover:bg-surface-2" />
      <AppSidebar collapsible="icon" className="border-r border-frost bg-void">
        <SidebarHeader className="border-b border-frost px-3 py-4">
          <div className="flex items-center justify-between gap-2">
            <Link to="/" className="flex items-center gap-2.5 no-underline">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-accent-orange">
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
              <span className="font-display text-lg font-bold tracking-tight text-near-white group-data-[collapsible=icon]:hidden">
                Poko
              </span>
            </Link>
            <div className="hidden items-center gap-2 group-data-[collapsible=icon]:hidden lg:flex">
              <ThemeToggle />
              <SidebarTrigger className="text-muted-text hover:bg-surface-2 hover:text-near-white" />
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-3 py-4">
          <SidebarGroup className="p-0">
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {NAV_ITEMS.map((item) => {
                  const hasChildren = !!item.children?.length
                  const isExpanded = expandedGroups.has(item.id)
                  const isItemActive =
                    isActive(item.to) ||
                    (hasChildren &&
                      item.children!.some((child) => isActive(child.to)))

                  if (hasChildren) {
                    return (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          onClick={() => toggleGroup(item.id)}
                          isActive={isItemActive}
                          tooltip={item.label}
                          className="text-muted-text hover:bg-surface-2 hover:text-near-white data-[active=true]:bg-accent-orange-dim data-[active=true]:text-accent-orange"
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
                                  className="text-muted-text hover:bg-surface-2 hover:text-near-white data-[active=true]:bg-accent-orange-dim data-[active=true]:text-accent-orange"
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
                        className="text-muted-text hover:bg-surface-2 hover:text-near-white data-[active=true]:bg-accent-orange-dim data-[active=true]:text-accent-orange"
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
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-frost p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="Đăng xuất"
                className="text-muted-text hover:bg-accent-red/10 hover:text-accent-red"
              >
                <a href="/logout">
                  <LogOut size={18} />
                  <span>Đăng xuất</span>
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
