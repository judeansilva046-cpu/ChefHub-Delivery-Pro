'use client'

import { FormEvent, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Ingrediente } from '@/types'
import {
  createIngredient,
  updateIngredient,
  getCategories,
  getSuppliers,
} from '@/lib/services/ingredients.service'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Alert } from '@/components/ui/Alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

interface IngredientFormProps {
  empresaId: string
  ingredient?: Ingrediente
  onSuccess?: () => void
}

export function IngredientForm({
  empresaId,
  ingredient,
  onSuccess,
}: IngredientFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<Array<{ id: string; nome: string }>>([])
  const [suppliers, setSuppliers] = useState<Array<{ id: string; nome: string }>>([])

  const [formData, setFormData] = useState({
    nome: ingredient?.nome || '',
    categoria_id: ingredient?.categoria_id || '',
    unidade_medida: ingredient?.unidade_medida || 'kg',
    custo_atual: ingredient?.custo_atual || 0,
    fornecedor_id: ingredient?.fornecedor_id || '',
    estoque_minimo: ingredient?.estoque_minimo || 0,
    controla_validade: ingredient?.controla_validade || false,
  })

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Carregar categorias e fornecedores
  useEffect(() => {
    const loadData = async () => {
      const [cats, sups] = await Promise.all([
        getCategories(empresaId),
        getSuppliers(empresaId),
      ])
      setCategories(cats)
      setSuppliers(sups)
    }

    loadData()
  }, [empresaId])

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.nome) {
      errors.nome = 'Nome é obrigatório'
    } else if (formData.nome.length < 3) {
      errors.nome = 'Nome deve ter no mínimo 3 caracteres'
    }

    if (!formData.categoria_id) {
      errors.categoria_id = 'Categoria é obrigatória'
    }

    if (formData.custo_atual <= 0) {
      errors.custo_atual = 'Custo deve ser maior que 0'
    }

    if (formData.estoque_minimo < 0) {
      errors.estoque_minimo = 'Estoque mínimo não pode ser negativo'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      return
    }

    try {
      setIsLoading(true)

      if (ingredient) {
        // Atualizar
        const result = await updateIngredient(ingredient.id, {
          ...formData,
          empresa_id: empresaId,
        })

        if (!result) {
          setError('Erro ao atualizar ingrediente')
          return
        }
      } else {
        // Criar
        const result = await createIngredient({
          ...formData,
          empresa_id: empresaId,
          estoque_atual: 0,
          ativo: true,
        })

        if (!result) {
          setError('Erro ao criar ingrediente')
          return
        }
      }

      if (onSuccess) {
        onSuccess()
      } else {
        router.push('/ingredientes')
      }
    } catch (err) {
      console.error('Erro ao salvar ingrediente:', err)
      setError('Erro ao salvar ingrediente. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {ingredient ? 'Editar Ingrediente' : 'Novo Ingrediente'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert
            variant="error"
            title="Erro"
            onClose={() => setError(null)}
            closeable
          >
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nome do Ingrediente"
              placeholder="Ex: Sal"
              value={formData.nome}
              onChange={(e) => {
                setFormData({ ...formData, nome: e.target.value })
                if (formErrors.nome) {
                  setFormErrors({ ...formErrors, nome: '' })
                }
              }}
              error={formErrors.nome}
              disabled={isLoading}
              required
            />

            <Select
              label="Categoria"
              options={categories.map((cat) => ({
                value: cat.id,
                label: cat.nome,
              }))}
              value={formData.categoria_id}
              onChange={(e) => {
                setFormData({ ...formData, categoria_id: e.target.value })
                if (formErrors.categoria_id) {
                  setFormErrors({ ...formErrors, categoria_id: '' })
                }
              }}
              error={formErrors.categoria_id}
              disabled={isLoading}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Unidade de Medida"
              options={[
                { value: 'kg', label: 'Quilograma (kg)' },
                { value: 'g', label: 'Grama (g)' },
                { value: 'l', label: 'Litro (l)' },
                { value: 'ml', label: 'Mililitro (ml)' },
                { value: 'un', label: 'Unidade' },
                { value: 'xicara', label: 'Xícara' },
                { value: 'colher', label: 'Colher' },
              ]}
              value={formData.unidade_medida}
              onChange={(e) =>
                setFormData({ ...formData, unidade_medida: e.target.value as any })
              }
              disabled={isLoading}
            />

            <Input
              type="number"
              label="Custo Atual (R$)"
              placeholder="0,00"
              value={formData.custo_atual}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  custo_atual: parseFloat(e.target.value),
                })
              }
              error={formErrors.custo_atual}
              step="0.01"
              disabled={isLoading}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Fornecedor (Opcional)"
              options={suppliers.map((sup) => ({
                value: sup.id,
                label: sup.nome,
              }))}
              value={formData.fornecedor_id}
              onChange={(e) =>
                setFormData({ ...formData, fornecedor_id: e.target.value })
              }
              disabled={isLoading}
              placeholder="Selecione um fornecedor"
            />

            <Input
              type="number"
              label="Estoque Mínimo"
              placeholder="100"
              value={formData.estoque_minimo}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  estoque_minimo: parseFloat(e.target.value),
                })
              }
              error={formErrors.estoque_minimo}
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="controla_validade"
              checked={formData.controla_validade}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  controla_validade: e.target.checked,
                })
              }
              disabled={isLoading}
              className="w-4 h-4 text-chefhub-orange rounded"
            />
            <label
              htmlFor="controla_validade"
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              Este ingrediente tem data de validade
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {ingredient ? 'Atualizar' : 'Criar'} Ingrediente
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
