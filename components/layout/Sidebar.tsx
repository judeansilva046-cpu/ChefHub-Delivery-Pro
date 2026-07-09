'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSidebar } from '@/lib/hooks/useSidebar'
import { cn } from '@/lib/utils'
import { MenuItem } from '@/types/layout'
import {
  LayoutDashboard,
  ChefHat,
  Utensils,
  Package,
  ShoppingCart,
  DollarSign,
  BarChart3,
  Settings,
  Menu,
  X,
} from 'lucide-react'

const MENU_ITEMS: MenuItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: 'LayoutDashboard',
  },
  {
    label: 'Receitas',
    href: '/receitas',
    icon: 'ChefHat',
  },
  {
    label: 'Ingredientes',
    href: '/ingredientes',
    icon: 'Utensils',
  },
  {
    label: 'Estoque',
    href: '/estoque',
    icon: 'Package',
  },
  {
    label: 'Compras',
    href: '/compras',
    icon: 'ShoppingCart',
  },
  {
    label: 'Financeiro',
    href: '/financeiro',
    icon: 'DollarSign',
  },
  {
    label: 'Relatórios',
    href: '/relatorios',
    icon: 'BarChart3',
  },
  {
    label: 'Configurações',
    href: '/configuracoes',
    icon: 'Settings',
  },
]

const ICON_MAP: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="w-5 h-5" />,
  ChefHat: <ChefHat className="w-5 h-5" />,
  Utensils: <Utensils className="w-5 h-5" />,
  Package: <Package className="w-5 h-5" />,
  ShoppingCart: <ShoppingCart className="w-5 h-5" />,
  DollarSign: <DollarSign className="w-5 h-5" />,
  BarChart3: <BarChart3 className="w-5 h-5" />,
  Settings: <Settings className="w-5 h-5" />,
}

export function Sidebar() {
  const pathname = usePathname()
  const { isOpen, isCollapsed, isMobile, toggle, collapse } = useSidebar()

  const isActive = (href: string) => {
    return pathname.startsWith(href)
  }

  // Em mobile, não mostrar sidebar se estiver fechada
  if (isMobile && !isOpen) {
    return (
      <button
        onClick={toggle}
        className="fixed bottom-6 right-6 z-50 bg-chefhub-orange text-white p-3 rounded-full shadow-lg hover:bg-orange-700 transition-colors md:hidden"
        aria-label="Abrir menu"
      >
        <Menu className="w-6 h-6" />
      </button>
    )
  }

  return (
    <>
      {/* Overlay em mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen bg-chefhub-dark-blue text-white transition-all duration-300 z-40',
          'border-r border-blue-900',
          isMobile ? 'w-64' : isCollapsed ? 'w-20' : 'w-64',
          isMobile && !isOpen && '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-20 px-4 border-b border-blue-900">
          {!isCollapsed && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-chefhub-orange rounded-lg flex items-center justify-center font-bold">
                CH
              </div>
              <span className={cn('font-bold text-lg', isMobile || isCollapsed ? 'hidden' : '')}>
                ChefHub
              </span>
            </Link>
          )}

          {!isMobile && (
            <button
              onClick={collapse}
              className="p-1 hover:bg-blue-800 rounded-lg transition-colors"
              aria-label={isCollapsed ? 'Expandir' : 'Colapsar'}
            >
              {isCollapsed ? (
                <Menu className="w-5 h-5" />
              ) : (
                <X className="w-5 h-5" />
              )}
            </button>
          )}

          {isMobile && (
            <button
              onClick={toggle}
              className="p-1 hover:bg-blue-800 rounded-lg transition-colors"
              aria-label="Fechar menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
          {MENU_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => isMobile && toggle()}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                'hover:bg-blue-800',
                isActive(item.href) && 'bg-chefhub-orange text-white font-semibold',
                !isActive(item.href) && 'text-gray-300 hover:text-white',
                isCollapsed && 'justify-center px-0'
              )}
              title={isCollapsed ? item.label : undefined}
            >
              {ICON_MAP[item.icon]}
              {!isCollapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-blue-900 p-4">
          <p className={cn('text-xs text-gray-400', isCollapsed && 'text-center')}>
            {isCollapsed ? 'v1.0' : 'ChefHub v1.0'}
          </p>
        </div>
      </aside>

      {/* Spacer para desktop */}
      {!isMobile && (
        <div
          className={cn(
            'transition-all duration-300',
            isCollapsed ? 'w-20' : 'w-64'
          )}
          aria-hidden="true"
        />
      )}
    </>
  )
}
