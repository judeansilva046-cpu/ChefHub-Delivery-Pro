'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { IngredientForm } from '@/components/modules/ingredients'
import { getIngredient } from '@/lib/services/ingredients.service'
import { Ingrediente } from '@/types'
import { createClient } from '@/lib/supabase/client'

export default function EditarIngredientePage() {
  const params = useParams()
  const { user, isLoading: authLoading } = useAuth()
  const [ingredient, setIngredient] = useState<Ingrediente | null>(null)
  const [empresaId, setEmpresaId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  // Buscar empresa_id e ingrediente
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) {
        setLoading(false)
        return
      }

      const supabase = createClient()
      const { data: empresaData } = await supabase
        .from('empresas')
        .select('id')
        .eq('usuario_id', user.id)
        .limit(1)
        .single()

      if (!empresaData) {
        setLoading(false)
        return
      }

      setEmpresaId(empresaData.id)

      // Buscar ingrediente
      const ingredientData = await getIngredient(
        params.id as string,
        empresaData.id
      )

      if (ingredientData) {
        setIngredient(ingredientData)
      } else {
        setNotFound(true)
      }

      setLoading(false)
    }

    if (!authLoading) {
      fetchData()
    }
  }, [user?.id, authLoading, params.id])

  if (loading) {
    return (
      <DashboardLayout
        breadcrumbs={[
          { label: 'Ingredientes', href: '/ingredientes' },
          { label: 'Editar' },
        ]}
      >
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-chefhub-orange"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (notFound) {
    return (
      <DashboardLayout
        breadcrumbs={[
          { label: 'Ingredientes', href: '/ingredientes' },
          { label: 'Não encontrado' },
        ]}
      >
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Ingrediente não encontrado</p>
          <a href="/ingredientes" className="text-chefhub-orange font-semibold">
            Voltar para Ingredientes
          </a>
        </div>
      </DashboardLayout>
    )
  }

  if (!empresaId || !ingredient) {
    return (
      <DashboardLayout
        breadcrumbs={[
          { label: 'Ingredientes', href: '/ingredientes' },
          { label: 'Editar' },
        ]}
      >
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Carregando...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: 'Ingredientes', href: '/ingredientes' },
        { label: `Editar: ${ingredient.nome}` },
      ]}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-chefhub-dark-blue mb-2">
          Editar Ingrediente
        </h1>
        <p className="text-gray-600">
          Atualize as informações do ingrediente
        </p>
      </div>

      <div className="max-w-2xl">
        <IngredientForm
          empresaId={empresaId}
          ingredient={ingredient}
        />
      </div>
    </DashboardLayout>
  )
}
