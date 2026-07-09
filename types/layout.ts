// Tipos de Layout

export interface MenuItem {
  label: string
  href: string
  icon: string
  badge?: number
  children?: MenuItem[]
}

export interface SidebarState {
  isOpen: boolean
  isCollapsed: boolean
}

export interface NavigationItem extends MenuItem {
  active: boolean
}

export interface BreadcrumbItem {
  label: string
  href?: string
}
