'use client'

import { ReactNode } from 'react'
import { AuthProvider } from '@/lib/auth/AuthContext'

interface RootLayoutWrapperProps {
  children: ReactNode
}

export function RootLayoutWrapper({ children }: RootLayoutWrapperProps) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}
