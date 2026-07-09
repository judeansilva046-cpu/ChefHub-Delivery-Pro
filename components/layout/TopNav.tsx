'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { Bell, LogOut, User } from 'lucide-react'

export function TopNav() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Fechar menu quando clicar fora
  useEffect(() => {
    if (!isUserMenuOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isUserMenuOpen])

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/auth/login')
    } catch (err) {
      console.error('Erro ao fazer logout:', err)
    }
  }

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left side - Empty space for future content */}
        <div className="flex-1" />

        {/* Right side - Notifications and User Menu */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button
            className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Notificações"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* User Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Menu do usuário"
              aria-expanded={isUserMenuOpen}
            >
              {/* Avatar */}
              <div className="w-8 h-8 bg-chefhub-orange rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {user?.nome.charAt(0).toUpperCase()}
              </div>

              {/* User Info - Desktop only */}
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">
                  {user?.nome.split(' ')[0]}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </button>

            {/* User Menu Dropdown */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
                {/* User Info - Mobile */}
                <div className="sm:hidden px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.nome}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>

                {/* Menu Items */}
                <a
                  href="/perfil"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User className="w-4 h-4" />
                  Meu Perfil
                </a>

                {/* Divider */}
                <div className="border-t border-gray-100 my-1" />

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
