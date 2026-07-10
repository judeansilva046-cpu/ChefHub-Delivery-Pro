import { createClient } from '@/lib/supabase/client'
import { Receita, ItemReceita } from '@/types'

export interface RecipeWithItems extends Receita {
  itens?: ItemReceita[]
}

/**
 * Buscar receitas com paginação e filtros
 */
export async function getRecipes(
  empresaId: string,
  options?: { search?: string; page?: number; limit?: number }
) {
  const supabase = createClient()
  const limit = options?.limit || 20
  const page = options?.page || 1
  const from = (page - 1) * limit

  let query = supabase
    .from('receitas')
    .select('*', { count: 'exact' })
    .eq('empresa_id', empresaId)
    .eq('ativo', true)

  if (options?.search) {
    query = query.ilike('nome', `%${options.search}%`)
  }

  const { data, count, error } = await query
    .order('nome')
    .range(from, from + limit - 1)

  if (error) throw error
  return { data: data || [], total: count || 0, page }
}

/**
 * Buscar receita com ingredientes
 */
export async function getRecipe(id: string, empresaId: string): Promise<RecipeWithItems | null> {
  const supabase = createClient()

  const { data: recipe, error: recipeError } = await supabase
    .from('receitas')
    .select('*')
    .eq('id', id)
    .eq('empresa_id', empresaId)
    .single()

  if (recipeError) return null

  const { data: items } = await supabase
    .from('itens_receita')
    .select('*, ingredientes(nome, unidade_medida, custo_atual)')
    .eq('receita_id', id)

  return { ...recipe, itens: items || [] }
}

/**
 * Criar receita
 */
export async function createRecipe(
  recipe: Omit<Receita, 'id' | 'data_criacao' | 'data_atualizacao'>,
  items: Array<{ ingrediente_id: string; quantidade: number }>
): Promise<Receita | null> {
  const supabase = createClient()

  try {
    const { data: newRecipe, error: recipeError } = await supabase
      .from('receitas')
      .insert({
        ...recipe,
        data_criacao: new Date().toISOString(),
        data_atualizacao: new Date().toISOString(),
      })
      .select()
      .single()

    if (recipeError) throw recipeError

    // Inserir itens
    if (items.length > 0) {
      const recipeItems = items.map((item) => ({
        receita_id: newRecipe.id,
        ...item,
      }))

      const { error: itemsError } = await supabase
        .from('itens_receita')
        .insert(recipeItems)

      if (itemsError) throw itemsError
    }

    // Recalcular custos
    await recalculateRecipeCosts(newRecipe.id)

    return newRecipe
  } catch (error) {
    console.error('Erro ao criar receita:', error)
    return null
  }
}

/**
 * Atualizar receita
 */
export async function updateRecipe(
  id: string,
  updates: Partial<Receita>,
  items?: Array<{ ingrediente_id: string; quantidade: number }>
): Promise<Receita | null> {
  const supabase = createClient()

  try {
    // Atualizar receita
    const { data, error: updateError } = await supabase
      .from('receitas')
      .update({
        ...updates,
        data_atualizacao: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) throw updateError

    // Atualizar itens se fornecidos
    if (items) {
      await supabase.from('itens_receita').delete().eq('receita_id', id)

      const recipeItems = items.map((item) => ({
        receita_id: id,
        ...item,
      }))

      const { error: itemsError } = await supabase
        .from('itens_receita')
        .insert(recipeItems)

      if (itemsError) throw itemsError
    }

    // Recalcular custos
    await recalculateRecipeCosts(id)

    return data
  } catch (error) {
    console.error('Erro ao atualizar receita:', error)
    return null
  }
}

/**
 * Deletar receita (soft delete)
 */
export async function deleteRecipe(id: string): Promise<boolean> {
  const supabase = createClient()

  try {
    const { error } = await supabase
      .from('receitas')
      .update({ ativo: false })
      .eq('id', id)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Erro ao deletar receita:', error)
    return false
  }
}

/**
 * Recalcular custos da receita
 */
export async function recalculateRecipeCosts(recipeId: string): Promise<void> {
  const supabase = createClient()

  // Buscar itens com custos dos ingredientes
  const { data: items } = await supabase
    .from('itens_receita')
    .select('quantidade, ingredientes(custo_atual)')
    .eq('receita_id', recipeId)

  if (!items) return

  // Calcular custo total
  const custoTotal = items.reduce(
    (acc, item) => acc + item.quantidade * ((item.ingredientes as any)?.custo_atual || 0),
    0
  )

  // Buscar receita para obter rendimento
  const { data: recipe } = await supabase
    .from('receitas')
    .select('rendimento, preco_sugerido')
    .eq('id', recipeId)
    .single()

  if (!recipe) return

  const custoPorPorcao = custoTotal / recipe.rendimento
  const cmvPercentual = recipe.preco_sugerido
    ? (custoTotal / (recipe.preco_sugerido * recipe.rendimento)) * 100
    : 0
  const margemPercentual = 100 - cmvPercentual

  // Atualizar receita
  await supabase
    .from('receitas')
    .update({
      custo_total: custoTotal,
      custo_por_porcao: custoPorPorcao,
      cmv_percentual: cmvPercentual,
      margem_percentual: margemPercentual,
    })
    .eq('id', recipeId)
}

/**
 * Buscar receitas mais lucrativas
 */
export async function getMostProfitableRecipes(
  empresaId: string,
  limit = 5
) {
  const supabase = createClient()

  const { data } = await supabase
    .from('receitas')
    .select('id, nome, margem_percentual, preco_sugerido')
    .eq('empresa_id', empresaId)
    .eq('ativo', true)
    .order('margem_percentual', { ascending: false })
    .limit(limit)

  return data || []
}
