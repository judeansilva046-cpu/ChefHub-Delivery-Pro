import { createClient } from '@/lib/supabase/client'
import { Ingrediente } from '@/types'

/**
 * Serviço de Ingredientes
 * CRUD completo para ingredientes
 */

export interface GetIngredientsOptions {
  empresaId: string
  categoriaId?: string
  search?: string
  sortBy?: 'nome' | 'custo' | 'estoque'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

/**
 * Buscar todos os ingredientes com filtros opcionais
 */
export async function getIngredients(
  options: GetIngredientsOptions
): Promise<{ data: Ingrediente[]; total: number; page: number }> {
  const supabase = createClient()
  const {
    empresaId,
    categoriaId,
    search,
    sortBy = 'nome',
    sortOrder = 'asc',
    page = 1,
    limit = 20,
  } = options

  try {
    let query = supabase
      .from('ingredientes')
      .select('*', { count: 'exact' })
      .eq('empresa_id', empresaId)
      .eq('ativo', true)

    if (categoriaId) {
      query = query.eq('categoria_id', categoriaId)
    }

    if (search) {
      query = query.ilike('nome', `%${search}%`)
    }

    // Aplicar ordenação
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    // Aplicar paginação
    const from = (page - 1) * limit
    query = query.range(from, from + limit - 1)

    const { data, count, error } = await query

    if (error) throw error

    return {
      data: data || [],
      total: count || 0,
      page,
    }
  } catch (error) {
    console.error('Erro ao buscar ingredientes:', error)
    return { data: [], total: 0, page }
  }
}

/**
 * Buscar um ingrediente específico
 */
export async function getIngredient(
  id: string,
  empresaId: string
): Promise<Ingrediente | null> {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from('ingredientes')
      .select('*')
      .eq('id', id)
      .eq('empresa_id', empresaId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erro ao buscar ingrediente:', error)
    return null
  }
}

/**
 * Criar novo ingrediente
 */
export async function createIngredient(
  ingrediente: Omit<Ingrediente, 'id' | 'data_criacao' | 'data_atualizacao'>
): Promise<Ingrediente | null> {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from('ingredientes')
      .insert({
        ...ingrediente,
        data_criacao: new Date().toISOString(),
        data_atualizacao: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erro ao criar ingrediente:', error)
    return null
  }
}

/**
 * Atualizar ingrediente
 */
export async function updateIngredient(
  id: string,
  updates: Partial<Ingrediente>
): Promise<Ingrediente | null> {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from('ingredientes')
      .update({
        ...updates,
        data_atualizacao: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erro ao atualizar ingrediente:', error)
    return null
  }
}

/**
 * Deletar ingrediente (soft delete)
 */
export async function deleteIngredient(id: string): Promise<boolean> {
  const supabase = createClient()

  try {
    const { error } = await supabase
      .from('ingredientes')
      .update({ ativo: false })
      .eq('id', id)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Erro ao deletar ingrediente:', error)
    return false
  }
}

/**
 * Buscar categorias de ingredientes
 */
export async function getCategories(
  empresaId: string
): Promise<Array<{ id: string; nome: string }>> {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from('categorias_ingredientes')
      .select('id, nome')
      .eq('empresa_id', empresaId)
      .order('nome')

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Erro ao buscar categorias:', error)
    return []
  }
}

/**
 * Criar categoria
 */
export async function createCategory(
  empresaId: string,
  nome: string,
  descricao?: string
): Promise<{ id: string; nome: string } | null> {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from('categorias_ingredientes')
      .insert({
        empresa_id: empresaId,
        nome,
        descricao,
      })
      .select('id, nome')
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erro ao criar categoria:', error)
    return null
  }
}

/**
 * Buscar fornecedores
 */
export async function getSuppliers(
  empresaId: string
): Promise<Array<{ id: string; nome: string }>> {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from('fornecedores')
      .select('id, nome')
      .eq('empresa_id', empresaId)
      .eq('ativo', true)
      .order('nome')

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Erro ao buscar fornecedores:', error)
    return []
  }
}
