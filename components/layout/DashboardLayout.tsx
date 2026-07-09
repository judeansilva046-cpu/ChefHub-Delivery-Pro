'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { Sidebar } from './Sidebar'
import { TopNav } from './TopNav'
import { Breadcrumbs } from './Breadcrumbs'
import { useSidebar } from '@/lib/hooks/useSidebar'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
  children: ReactNode
  breadcrumbs?: Array<{ label: string; href?: string }>
}

export function DashboardLayout({
  children,
  breadcrumbs,
}: DashboardLayoutProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { isCollapsed, isMobile } = useSidebar()

  // Redirecionar para login se não autenticado
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chefhub-orange"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div
        className={cn(
          'flex-1 flex flex-col overflow-hidden transition-all duration-300',
          isMobile ? 'ml-0' : isCollapsed ? 'md:ml-20' : 'md:ml-64'
        )}
      >
        {/* Top Navigation */}
        <TopNav />

        {/* Breadcrumbs */}
        <Breadcrumbs customItems={breadcrumbs} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
