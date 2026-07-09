'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbsProps {
  customItems?: BreadcrumbItem[]
}

const BREADCRUMB_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  receitas: 'Receitas',
  ingredientes: 'Ingredientes',
  estoque: 'Estoque',
  compras: 'Compras',
  financeiro: 'Financeiro',
  relatorios: 'Relatórios',
  configuracoes: 'Configurações',
  perfil: 'Meu Perfil',
}

export function Breadcrumbs({ customItems }: BreadcrumbsProps) {
  const pathname = usePathname()

  // Gerar breadcrumbs a partir do pathname
  const generateBreadcrumbs = () => {
    if (customItems) {
      return customItems
    }

    const paths = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = [{ label: 'Home', href: '/dashboard' }]

    let currentPath = ''
    for (const path of paths) {
      currentPath += `/${path}`

      // Skip auth e primeiros níveis
      if (path === 'auth') continue

      const label = BREADCRUMB_LABELS[path] || capitalizeWords(path)
      breadcrumbs.push({
        label,
        href: currentPath,
      })
    }

    // A última breadcrumb não é clicável
    if (breadcrumbs.length > 1) {
      delete breadcrumbs[breadcrumbs.length - 1].href
    }

    return breadcrumbs
  }

  const capitalizeWords = (str: string) => {
    return str
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const breadcrumbs = generateBreadcrumbs()

  // Não mostrar breadcrumbs em auth pages
  if (pathname.startsWith('/auth')) {
    return null
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-2 px-4 sm:px-6 lg:px-8 py-3 bg-white border-b border-gray-100"
    >
      {breadcrumbs.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index === 0 ? (
            <Home className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}

          {item.href ? (
            <Link
              href={item.href}
              className="text-sm text-chefhub-orange hover:text-orange-700 transition-colors font-medium"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-sm text-gray-600 font-medium">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}
