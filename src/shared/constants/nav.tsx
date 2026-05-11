import {
  LayoutDashboard,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  Package,
  PenLine,
  Wand2,
  Link2,
  GitBranch,
  Users,
  CreditCard,
  Image,
  TrendingUp,
} from 'lucide-react'

export interface NavItem {
  id: string
  label: string
  to?: string
  icon: React.ReactNode
  disabled?: boolean
  children?: { id: string; label: string; to: string; disabled?: boolean }[]
}

export interface NavSection {
  id: string
  label: string
  items: NavItem[]
}

export const NAV_SECTIONS: NavSection[] = [
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
    id: 'intelligence',
    label: 'Intelligence',
    items: [
      {
        id: 'analytics',
        label: 'Analytics',
        to: '/dash',
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

export const SYSTEM_ITEMS: NavItem[] = [
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
