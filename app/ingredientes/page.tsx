'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { IngredientsList } from '@/components/modules/ingredients'
import { createClient } from '@/lib/supabase/client'

export default function IngredientsPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [empresaId, setEmpresaId] = useState<string>('')
  const [loading, setLoading] = useState(true)

  // Buscar empresa_id do usuário
  useEffect(() => {
    const fetchEmpresa = async () => {
      if (!user?.id) {
        setLoading(false)
        return
      }

      const supabase = createClient()
      const { data } = await supabase
        .from('empresas')
        .select('id')
        .eq('usuario_id', user.id)
        .limit(1)
        .single()

      if (data) {
        setEmpresaId(data.id)
      }
      setLoading(false)
    }

    if (!authLoading) {
      fetchEmpresa()
    }
  }, [user?.id, authLoading])

  if (loading) {
    return (
      <DashboardLayout breadcrumbs={[{ label: 'Ingredientes' }]}>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-chefhub-orange"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!empresaId) {
    return (
      <DashboardLayout breadcrumbs={[{ label: 'Ingredientes' }]}>
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            Você precisa ter uma empresa configurada
          </p>
          <a href="/configuracoes" className="text-chefhub-orange font-semibold">
            Ir para Configurações
          </a>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: 'Ingredientes', href: '/ingredientes' },
      ]}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-chefhub-dark-blue mb-2">
          Ingredientes
        </h1>
        <p className="text-gray-600">
          Gerencie todos os ingredientes da sua operação
        </p>
      </div>

      <IngredientsList empresaId={empresaId} />
    </DashboardLayout>
  )
}
