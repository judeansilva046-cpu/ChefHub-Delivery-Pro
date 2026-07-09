import { createClient } from '@/lib/supabase/client'

/**
 * Relatório de CMV por receita
 */
export async function getCMVByRecipeReport(empresaId: string) {
  const supabase = createClient()

  const { data } = await supabase
    .from('receitas')
    .select('id, nome, cmv_percentual, custo_total, preco_sugerido')
    .eq('empresa_id', empresaId)
    .eq('ativo', true)
    .order('cmv_percentual', { ascending: false })

  return data || []
}

/**
 * Relatório de lucro por receita
 */
export async function getProfitByRecipeReport(empresaId: string) {
  const supabase = createClient()

  const { data } = await supabase
    .from('receitas')
    .select('id, nome, margem_percentual, custo_total, preco_sugerido')
    .eq('empresa_id', empresaId)
    .eq('ativo', true)
    .order('margem_percentual', { ascending: false })

  return data || []
}

/**
 * Relatório de valor do estoque
 */
export async function getStockValueReport(empresaId: string) {
  const supabase = createClient()

  const { data } = await supabase
    .from('estoque')
    .select(`
      quantidade,
      ingredientes (nome, custo_atual, unidade_medida)
    `)
    .eq('empresa_id', empresaId)

  if (!data) return { items: [], totalValue: 0 }

  const items = data.map((item) => ({
    nome: item.ingredientes?.nome,
    quantidade: item.quantidade,
    unidade: item.ingredientes?.unidade_medida,
    custoUnitario: item.ingredientes?.custo_atual,
    valorTotal: item.quantidade * (item.ingredientes?.custo_atual || 0),
  }))

  return {
    items,
    totalValue: items.reduce((acc, item) => acc + item.valorTotal, 0),
  }
}

/**
 * Relatório de consumo de ingredientes por período
 */
export async function getIngredientConsumptionReport(
  empresaId: string,
  dataInicio: string,
  dataFim: string
) {
  const supabase = createClient()

  const { data } = await supabase
    .from('movimentacoes_estoque')
    .select(`
      quantidade, tipo,
      ingredientes (nome, unidade_medida)
    `)
    .eq('empresa_id', empresaId)
    .eq('tipo', 'saida')
    .gte('data_movimento', dataInicio)
    .lte('data_movimento', dataFim)

  const byIngredient: Record<
    string,
    { quantidade: number; unidade: string }
  > = {}

  data?.forEach((mov) => {
    const nome = mov.ingredientes?.nome || 'Desconhecido'
    if (!byIngredient[nome]) {
      byIngredient[nome] = {
        quantidade: 0,
        unidade: mov.ingredientes?.unidade_medida || '',
      }
    }
    byIngredient[nome].quantidade += mov.quantidade
  })

  return Object.entries(byIngredient).map(([nome, data]) => ({
    nome,
    ...data,
  }))
}

/**
 * Relatório P&L (Demonstração do Resultado)
 */
export async function getProfitLossReport(
  empresaId: string,
  dataInicio: string,
  dataFim: string
) {
  const supabase = createClient()

  const { data } = await supabase
    .from('financeiro')
    .select('tipo, categoria, valor')
    .eq('empresa_id', empresaId)
    .gte('data_lancamento', dataInicio)
    .lte('data_lancamento', dataFim)

  if (!data) return { receitas: 0, despesas: 0, lucroLiquido: 0 }

  const receitas = data
    .filter((f) => f.tipo === 'receita')
    .reduce((acc, f) => acc + f.valor, 0)

  const despesas = data
    .filter((f) => f.tipo === 'despesa')
    .reduce((acc, f) => acc + f.valor, 0)

  return {
    receitas,
    despesas,
    lucroLiquido: receitas - despesas,
    margemLiquida: receitas > 0 ? ((receitas - despesas) / receitas) * 100 : 0,
  }
}

/**
 * Relatório de compras realizadas
 */
export async function getPurchaseReport(
  empresaId: string,
  dataInicio: string,
  dataFim: string
) {
  const supabase = createClient()

  const { data } = await supabase
    .from('compras')
    .select(`
      id, data_realizada, status, custo_total,
      itens_compra (
        quantidade, preco_unitario,
        ingredientes (nome)
      )
    `)
    .eq('empresa_id', empresaId)
    .gte('data_planejada', dataInicio)
    .lte('data_planejada', dataFim)
    .order('data_planejada', { ascending: false })

  return data || []
}
