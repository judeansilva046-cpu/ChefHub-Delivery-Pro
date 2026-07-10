import { createClient } from '@/lib/supabase/client'

/**
 * Serviço de Dashboard
 * Busca dados agregados para o dashboard
 */

export interface DashboardStats {
  faturamento: number
  lucroEstimado: number
  cmvMedio: number
  estoque: number
  compras: number
}

export interface DashboardAlerts {
  estoquesBaixos: Array<{
    id: string
    nome: string
    estoque_atual: number
    estoque_minimo: number
  }>
  produtosVencendo: Array<{
    id: string
    nome: string
    validade: string
    quantidade: number
  }>
  receitasLucrativas: Array<{
    id: string
    nome: string
    margem_percentual: number
    preco_sugerido: number
  }>
  comprasNecessarias: Array<{
    id: string
    nome: string
    quantidade_necessaria: number
    quantidade_estoque: number
  }>
}

/**
 * Buscar estatísticas do dashboard para o mês atual
 */
export async function getDashboardStats(
  empresaId: string
): Promise<DashboardStats> {
  const supabase = createClient()

  // Obter data do início do mês
  const hoje = new Date()
  const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
    .toISOString()
    .split('T')[0]

  try {
    // Faturamento do mês
    const { data: financeiroData } = await supabase
      .from('financeiro')
      .select('valor')
      .eq('empresa_id', empresaId)
      .eq('tipo', 'receita')
      .gte('data_lancamento', inicioMes)

    const faturamento = financeiroData?.reduce(
      (acc, item) => acc + item.valor,
      0
    ) || 0

    // Despesas do mês
    const { data: despesasData } = await supabase
      .from('financeiro')
      .select('valor')
      .eq('empresa_id', empresaId)
      .eq('tipo', 'despesa')
      .gte('data_lancamento', inicioMes)

    const despesas = despesasData?.reduce(
      (acc, item) => acc + item.valor,
      0
    ) || 0

    // Lucro estimado
    const lucroEstimado = faturamento - despesas

    // CMV médio (calcular de todas as receitas)
    const { data: receitasData } = await supabase
      .from('receitas')
      .select('cmv_percentual')
      .eq('empresa_id', empresaId)
      .eq('ativo', true)

    const cmvMedio =
      receitasData && receitasData.length > 0
        ? receitasData.reduce((acc, item) => acc + item.cmv_percentual, 0) /
          receitasData.length
        : 0

    // Valor do estoque
    const { data: estoqueData } = await supabase
      .from('estoque')
      .select('quantidade, ingrediente_id')
      .eq('empresa_id', empresaId)

    // Buscar preços dos ingredientes
    let estoque = 0
    if (estoqueData && estoqueData.length > 0) {
      const { data: ingredientesData } = await supabase
        .from('ingredientes')
        .select('id, custo_atual')
        .eq('empresa_id', empresaId)
        .in(
          'id',
          estoqueData.map((e) => e.ingrediente_id)
        )

      estoque = estoqueData.reduce((acc, item) => {
        const ingrediente = ingredientesData?.find(
          (i) => i.id === item.ingrediente_id
        )
        return acc + (item.quantidade * (ingrediente?.custo_atual || 0))
      }, 0)
    }

    // Compras do mês
    const { data: comprasData } = await supabase
      .from('compras')
      .select('custo_total')
      .eq('empresa_id', empresaId)
      .eq('status', 'realizada')
      .gte('data_realizada', inicioMes)

    const compras = comprasData?.reduce(
      (acc, item) => acc + item.custo_total,
      0
    ) || 0

    return {
      faturamento,
      lucroEstimado,
      cmvMedio: Math.round(cmvMedio * 100) / 100,
      estoque,
      compras,
    }
  } catch (error) {
    console.error('Erro ao buscar stats do dashboard:', error)
    return {
      faturamento: 0,
      lucroEstimado: 0,
      cmvMedio: 0,
      estoque: 0,
      compras: 0,
    }
  }
}

/**
 * Buscar alertas e widgets do dashboard
 */
export async function getDashboardAlerts(
  empresaId: string
): Promise<DashboardAlerts> {
  const supabase = createClient()

  try {
    // Estoques baixos
    const { data: estoquesBaixos } = await supabase
      .from('ingredientes')
      .select('id, nome, estoque_atual, estoque_minimo')
      .eq('empresa_id', empresaId)
      .eq('ativo', true)
      .lte('estoque_atual', 'estoque_minimo')
      .limit(5)

    // Produtos vencendo (próximos 7 dias)
    const hoje = new Date()
    const proximos7dias = new Date(hoje.getTime() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0]

    const { data: produtosVencendo } = await supabase
      .from('estoque')
      .select('id, ingrediente_id, validade, quantidade')
      .eq('empresa_id', empresaId)
      .lte('validade', proximos7dias)
      .gte('validade', hoje.toISOString().split('T')[0])
      .limit(5)

    // Buscar nomes dos ingredientes
    let produtosVencendoComNomes: any[] = []
    if (produtosVencendo && produtosVencendo.length > 0) {
      const { data: ingredientesData } = await supabase
        .from('ingredientes')
        .select('id, nome')
        .in(
          'id',
          produtosVencendo.map((p) => p.ingrediente_id)
        )

      produtosVencendoComNomes = produtosVencendo.map((p) => ({
        id: p.id,
        nome: ingredientesData?.find((i) => i.id === p.ingrediente_id)
          ?.nome || 'Desconhecido',
        validade: p.validade,
        quantidade: p.quantidade,
      }))
    }

    // Receitas mais lucrativas
    const { data: receitasLucrativas } = await supabase
      .from('receitas')
      .select('id, nome, margem_percentual, preco_sugerido')
      .eq('empresa_id', empresaId)
      .eq('ativo', true)
      .order('margem_percentual', { ascending: false })
      .limit(5)

    // Compras necessárias (receitas com ingredientes em falta)
    const { data: itensReceita } = await supabase
      .from('itens_receita')
      .select('ingrediente_id, quantidade')

    const { data: estoque } = await supabase
      .from('estoque')
      .select('ingrediente_id, quantidade')
      .eq('empresa_id', empresaId)

    const { data: ingredientes } = await supabase
      .from('ingredientes')
      .select('id, nome, estoque_minimo')
      .eq('empresa_id', empresaId)

    // Calcular compras necessárias
    const comprasNecessarias = ingredientes
      ?.filter((ing) => {
        const estoqueAtual = estoque?.find(
          (e) => e.ingrediente_id === ing.id
        )?.quantidade || 0
        return estoqueAtual <= ing.estoque_minimo
      })
      .map((ing) => ({
        id: ing.id,
        nome: ing.nome,
        quantidade_necessaria: ing.estoque_minimo || 0,
        quantidade_estoque:
          estoque?.find((e) => e.ingrediente_id === ing.id)?.quantidade || 0,
      }))
      .slice(0, 5) || []

    return {
      estoquesBaixos: estoquesBaixos || [],
      produtosVencendo: produtosVencendoComNomes,
      receitasLucrativas: receitasLucrativas || [],
      comprasNecessarias,
    }
  } catch (error) {
    console.error('Erro ao buscar alertas do dashboard:', error)
    return {
      estoquesBaixos: [],
      produtosVencendo: [],
      receitasLucrativas: [],
      comprasNecessarias: [],
    }
  }
}

/**
 * Buscar faturamento por dia (últimos 30 dias)
 */
export async function getRevenueByDay(empresaId: string) {
  const supabase = createClient()

  try {
    const hoje = new Date()
    const trintaDiasAtras = new Date(
      hoje.getTime() - 30 * 24 * 60 * 60 * 1000
    )
      .toISOString()
      .split('T')[0]

    const { data } = await supabase
      .from('financeiro')
      .select('data_lancamento, valor')
      .eq('empresa_id', empresaId)
      .eq('tipo', 'receita')
      .gte('data_lancamento', trintaDiasAtras)
      .order('data_lancamento', { ascending: true })

    // Agrupar por dia
    const byDay: Record<string, number> = {}
    data?.forEach((item) => {
      const dia = item.data_lancamento
      byDay[dia] = (byDay[dia] || 0) + item.valor
    })

    return Object.entries(byDay).map(([dia, valor]) => ({
      dia,
      valor,
    }))
  } catch (error) {
    console.error('Erro ao buscar faturamento por dia:', error)
    return []
  }
}

/**
 * Buscar despesas por categoria (este mês)
 */
export async function getExpensesByCategory(empresaId: string) {
  const supabase = createClient()

  try {
    const hoje = new Date()
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
      .toISOString()
      .split('T')[0]

    const { data } = await supabase
      .from('financeiro')
      .select('categoria, valor')
      .eq('empresa_id', empresaId)
      .eq('tipo', 'despesa')
      .gte('data_lancamento', inicioMes)

    // Agrupar por categoria
    const byCategory: Record<string, number> = {}
    data?.forEach((item) => {
      const categoria = item.categoria
      byCategory[categoria] = (byCategory[categoria] || 0) + item.valor
    })

    return Object.entries(byCategory).map(([categoria, valor]) => ({
      categoria,
      valor,
    }))
  } catch (error) {
    console.error('Erro ao buscar despesas por categoria:', error)
    return []
  }
}
