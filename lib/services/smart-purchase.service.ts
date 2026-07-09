import { createClient } from '@/lib/supabase/client'

/**
 * Calcular ingredientes necessários para produzir quantidade de receita
 */
export async function calculateIngredientsForProduction(
  empresaId: string,
  recipeId: string,
  quantity: number
) {
  const supabase = createClient()

  // Buscar receita com itens
  const { data: recipeItems } = await supabase
    .from('itens_receita')
    .select('*, ingredientes(id, nome, custo_atual, unidade_medida)')
    .eq('receita_id', recipeId)

  if (!recipeItems) return []

  // Buscar estoque atual
  const { data: stock } = await supabase
    .from('estoque')
    .select('ingrediente_id, quantidade')
    .eq('empresa_id', empresaId)

  // Calcular necessidade para cada ingrediente
  const needed = recipeItems.map((item) => {
    const quantidadeNecessaria = item.quantidade * quantity
    const stockAtual =
      stock?.find((s) => s.ingrediente_id === item.ingrediente_id)?.quantidade || 0
    const quantidadeComprar = Math.max(0, quantidadeNecessaria - stockAtual)

    return {
      ingredienteId: item.ingrediente_id,
      nome: item.ingredientes?.nome,
      unidadeMedida: item.ingredientes?.unidade_medida,
      custoUnitario: item.ingredientes?.custo_atual || 0,
      quantidadeNecessaria,
      quantidadeEmEstoque: stockAtual,
      quantidadeComprar,
      custoTotal: quantidadeComprar * (item.ingredientes?.custo_atual || 0),
    }
  })

  return needed
}

/**
 * Criar lista de compra a partir do cálculo
 */
export async function createPurchaseList(
  empresaId: string,
  items: Array<{
    ingredienteId: string
    quantidade: number
    precoUnitario: number
  }>
): Promise<string | null> {
  const supabase = createClient()

  try {
    // Criar compra
    const custoTotal = items.reduce((acc, item) => acc + item.quantidade * item.precoUnitario, 0)

    const { data: compra, error: compraError } = await supabase
      .from('compras')
      .insert({
        empresa_id: empresaId,
        status: 'planejada',
        data_planejada: new Date().toISOString().split('T')[0],
        custo_total: custoTotal,
      })
      .select()
      .single()

    if (compraError) throw compraError

    // Adicionar itens
    const itensCompra = items.map((item) => ({
      compra_id: compra.id,
      ingrediente_id: item.ingredienteId,
      quantidade: item.quantidade,
      preco_unitario: item.precoUnitario,
      custo_total: item.quantidade * item.precoUnitario,
    }))

    const { error: itensError } = await supabase
      .from('itens_compra')
      .insert(itensCompra)

    if (itensError) throw itensError

    return compra.id
  } catch (error) {
    console.error('Erro ao criar lista de compra:', error)
    return null
  }
}

/**
 * Confirmar compra (marcar como realizada)
 */
export async function confirmPurchase(compraId: string): Promise<boolean> {
  const supabase = createClient()

  try {
    const { error } = await supabase
      .from('compras')
      .update({
        status: 'realizada',
        data_realizada: new Date().toISOString().split('T')[0],
      })
      .eq('id', compraId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Erro ao confirmar compra:', error)
    return false
  }
}

/**
 * Buscar compras pendentes
 */
export async function getPendingPurchases(empresaId: string) {
  const supabase = createClient()

  const { data } = await supabase
    .from('compras')
    .select(`
      id, status, data_planejada, custo_total,
      itens_compra(quantidade, preco_unitario, ingredientes(nome))
    `)
    .eq('empresa_id', empresaId)
    .neq('status', 'cancelada')
    .order('data_planejada', { ascending: true })

  return data || []
}
