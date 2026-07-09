'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { RegisterForm } from '@/components/modules/auth/RegisterForm'

export default function RegisterPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  // Redirecionar para dashboard se já está autenticado
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  return <RegisterForm />
}
