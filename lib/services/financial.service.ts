import { createClient } from '@/lib/supabase/client'

/**
 * Registrar receita
 */
export async function recordIncome(
  empresaId: string,
  categoria: string,
  valor: number,
  dataLancamento: string,
  descricao?: string
): Promise<boolean> {
  const supabase = createClient()

  try {
    const { error } = await supabase.from('financeiro').insert({
      empresa_id: empresaId,
      tipo: 'receita',
      categoria,
      descricao,
      valor,
      data_lancamento: dataLancamento,
    })

    if (error) throw error
    return true
  } catch (error) {
    console.error('Erro ao registrar receita:', error)
    return false
  }
}

/**
 * Registrar despesa
 */
export async function recordExpense(
  empresaId: string,
  categoria: string,
  valor: number,
  dataLancamento: string,
  descricao?: string
): Promise<boolean> {
  const supabase = createClient()

  try {
    const { error } = await supabase.from('financeiro').insert({
      empresa_id: empresaId,
      tipo: 'despesa',
      categoria,
      descricao,
      valor,
      data_lancamento: dataLancamento,
    })

    if (error) throw error
    return true
  } catch (error) {
    console.error('Erro ao registrar despesa:', error)
    return false
  }
}

/**
 * Buscar movimentações financeiras
 */
export async function getFinancialTransactions(
  empresaId: string,
  dataInicio: string,
  dataFim: string
) {
  const supabase = createClient()

  const { data } = await supabase
    .from('financeiro')
    .select('*')
    .eq('empresa_id', empresaId)
    .gte('data_lancamento', dataInicio)
    .lte('data_lancamento', dataFim)
    .order('data_lancamento', { ascending: false })

  return data || []
}

/**
 * Resumo financeiro do período
 */
export async function getFinancialSummary(
  empresaId: string,
  dataInicio: string,
  dataFim: string
) {
  const supabase = createClient()

  const { data } = await supabase
    .from('financeiro')
    .select('tipo, valor')
    .eq('empresa_id', empresaId)
    .gte('data_lancamento', dataInicio)
    .lte('data_lancamento', dataFim)

  if (!data) return { receita: 0, despesa: 0, lucro: 0 }

  const receita = data
    .filter((t) => t.tipo === 'receita')
    .reduce((acc, t) => acc + t.valor, 0)

  const despesa = data
    .filter((t) => t.tipo === 'despesa')
    .reduce((acc, t) => acc + t.valor, 0)

  return {
    receita,
    despesa,
    lucro: receita - despesa,
  }
}

/**
 * Despesas por categoria
 */
export async function getExpensesByCategory(
  empresaId: string,
  dataInicio: string,
  dataFim: string
) {
  const supabase = createClient()

  const { data } = await supabase
    .from('financeiro')
    .select('categoria, valor')
    .eq('empresa_id', empresaId)
    .eq('tipo', 'despesa')
    .gte('data_lancamento', dataInicio)
    .lte('data_lancamento', dataFim)

  const byCategory: Record<string, number> = {}
  data?.forEach((t) => {
    byCategory[t.categoria] = (byCategory[t.categoria] || 0) + t.valor
  })

  return Object.entries(byCategory).map(([categoria, valor]) => ({
    categoria,
    valor,
  }))
}
