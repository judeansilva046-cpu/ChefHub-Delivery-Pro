'use client'

import { useState, useCallback, useEffect } from 'react'
import {
  getIngredients,
  GetIngredientsOptions,
} from '@/lib/services/ingredients.service'
import { Ingrediente } from '@/types'

interface UseIngredientsOptions extends Omit<GetIngredientsOptions, 'empresaId'> {}

interface UseIngredientsReturn {
  ingredients: Ingrediente[]
  total: number
  page: number
  isLoading: boolean
  error: string | null
  searchTerm: string
  sortBy: 'nome' | 'custo' | 'estoque'
  sortOrder: 'asc' | 'desc'
  setSearchTerm: (term: string) => void
  setSortBy: (sort: 'nome' | 'custo' | 'estoque') => void
  setSortOrder: (order: 'asc' | 'desc') => void
  setPage: (page: number) => void
  refetch: () => Promise<void>
}

/**
 * Hook para gerenciar lista de ingredientes com filtros, busca e paginação
 */
export function useIngredients(
  empresaId: string,
  options?: UseIngredientsOptions
): UseIngredientsReturn {
  const [ingredients, setIngredients] = useState<Ingrediente[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [page, setPage] = useState(options?.page || 1)
  const [searchTerm, setSearchTerm] = useState(options?.search || '')
  const [sortBy, setSortBy] = useState<'nome' | 'custo' | 'estoque'>(
    (options?.sortBy as 'nome' | 'custo' | 'estoque') || 'nome'
  )
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(
    options?.sortOrder || 'asc'
  )

  const fetchIngredients = useCallback(async () => {
    if (!empresaId) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const result = await getIngredients({
        empresaId,
        search: searchTerm,
        sortBy,
        sortOrder,
        page,
        limit: options?.limit || 20,
        categoriaId: options?.categoriaId,
      })

      setIngredients(result.data)
      setTotal(result.total)
    } catch (err) {
      console.error('Erro ao buscar ingredientes:', err)
      setError('Erro ao carregar ingredientes')
    } finally {
      setIsLoading(false)
    }
  }, [empresaId, searchTerm, sortBy, sortOrder, page, options?.limit, options?.categoriaId])

  // Buscar ingredientes quando dependências mudam
  useEffect(() => {
    fetchIngredients()
  }, [fetchIngredients])

  return {
    ingredients,
    total,
    page,
    isLoading,
    error,
    searchTerm,
    sortBy,
    sortOrder,
    setSearchTerm,
    setSortBy,
    setSortOrder,
    setPage,
    refetch: fetchIngredients,
  }
}
