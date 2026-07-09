'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'
import { LoginCredentials } from '@/types/auth'
import { isValidEmail } from '@/lib/utils'

export function LoginForm() {
  const router = useRouter()
  const { login, isLoading, error, clearError } = useAuth()

  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
  })

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.email) {
      errors.email = 'E-mail é obrigatório'
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'E-mail inválido'
    }

    if (!formData.password) {
      errors.password = 'Senha é obrigatória'
    } else if (formData.password.length < 8) {
      errors.password = 'Senha deve ter no mínimo 8 caracteres'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    clearError()

    if (!validateForm()) {
      return
    }

    try {
      await login(formData)
      // Redirecionar para dashboard após login bem-sucedido
      router.push('/dashboard')
    } catch (err) {
      // Erro já é tratado pelo contexto
      console.error('Erro ao fazer login:', err)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-chefhub-dark-blue mb-2">
          ChefHub
        </h1>
        <p className="text-gray-600 mb-6">Delivery Pro®</p>

        {error && (
          <Alert
            variant="error"
            title="Erro ao fazer login"
            onClose={clearError}
            closeable
          >
            {error.message}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="email"
            type="email"
            label="E-mail"
            placeholder="seu@email.com"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value })
              if (formErrors.email) {
                setFormErrors({ ...formErrors, email: '' })
              }
            }}
            error={formErrors.email}
            required
            disabled={isLoading}
          />

          <Input
            id="password"
            type="password"
            label="Senha"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value })
              if (formErrors.password) {
                setFormErrors({ ...formErrors, password: '' })
              }
            }}
            error={formErrors.password}
            required
            disabled={isLoading}
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
            disabled={isLoading}
          >
            Entrar
          </Button>
        </form>

        <div className="mt-6 space-y-2">
          <p className="text-center text-gray-600 text-sm">
            Não tem conta?{' '}
            <a
              href="/auth/register"
              className="text-chefhub-orange font-semibold hover:underline"
            >
              Registre-se
            </a>
          </p>
          <p className="text-center text-gray-600 text-sm">
            <a
              href="/auth/forgot-password"
              className="text-chefhub-orange font-semibold hover:underline"
            >
              Esqueceu a senha?
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
