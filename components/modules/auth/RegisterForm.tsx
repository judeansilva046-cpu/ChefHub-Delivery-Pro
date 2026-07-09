'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'
import { RegisterCredentials } from '@/types/auth'
import { isValidEmail, formatPhone, cleanPhone } from '@/lib/utils'

export function RegisterForm() {
  const router = useRouter()
  const { register, isLoading, error, clearError } = useAuth()

  const [formData, setFormData] = useState<RegisterCredentials>({
    email: '',
    password: '',
    confirmPassword: '',
    nome: '',
    telefone: '',
  })

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.nome) {
      errors.nome = 'Nome é obrigatório'
    } else if (formData.nome.length < 3) {
      errors.nome = 'Nome deve ter no mínimo 3 caracteres'
    }

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

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Confirme a senha'
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'As senhas não conferem'
    }

    if (formData.telefone && cleanPhone(formData.telefone).length < 10) {
      errors.telefone = 'Telefone inválido'
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
      await register(formData)
      // Redirecionar para dashboard após registro bem-sucedido
      router.push('/dashboard')
    } catch (err) {
      console.error('Erro ao registrar:', err)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-chefhub-dark-blue mb-2">
          ChefHub
        </h1>
        <p className="text-gray-600 mb-6">Delivery Pro®</p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Criar Conta
        </h2>

        {error && (
          <Alert
            variant="error"
            title="Erro ao registrar"
            onClose={clearError}
            closeable
          >
            {error.message}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="nome"
            type="text"
            label="Nome Completo"
            placeholder="João Silva"
            value={formData.nome}
            onChange={(e) => {
              setFormData({ ...formData, nome: e.target.value })
              if (formErrors.nome) {
                setFormErrors({ ...formErrors, nome: '' })
              }
            }}
            error={formErrors.nome}
            required
            disabled={isLoading}
          />

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
            id="telefone"
            type="tel"
            label="Telefone (opcional)"
            placeholder="(11) 99999-9999"
            value={formData.telefone}
            onChange={(e) => {
              const formatted = formatPhone(e.target.value)
              setFormData({ ...formData, telefone: formatted })
              if (formErrors.telefone) {
                setFormErrors({ ...formErrors, telefone: '' })
              }
            }}
            error={formErrors.telefone}
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
            helperText="Mínimo 8 caracteres"
            required
            disabled={isLoading}
          />

          <Input
            id="confirmPassword"
            type="password"
            label="Confirmar Senha"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={(e) => {
              setFormData({ ...formData, confirmPassword: e.target.value })
              if (formErrors.confirmPassword) {
                setFormErrors({ ...formErrors, confirmPassword: '' })
              }
            }}
            error={formErrors.confirmPassword}
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
            Registrar
          </Button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          Já tem conta?{' '}
          <a
            href="/auth/login"
            className="text-chefhub-orange font-semibold hover:underline"
          >
            Faça login
          </a>
        </p>
      </div>
    </div>
  )
}
