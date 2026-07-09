'use client'

import { useContext } from 'react'
import { AuthContext } from '@/lib/auth/AuthContext'

/**
 * Hook para acessar o contexto de autenticação
 * Deve ser usado apenas em componentes dentro de AuthProvider
 *
 * @example
 * const { user, isAuthenticated, login, logout } = useAuth()
 */
export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  }

  return context
}
