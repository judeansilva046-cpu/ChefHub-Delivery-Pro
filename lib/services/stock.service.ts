import { createClient } from '@/lib/supabase/client'

/**
 * Buscar estoque atual com ingrediente info
 */
export async function getStockItems(empresaId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('estoque')
    .select(`
      *,
      ingredientes:ingrediente_id (
        id, nome, unidade_medida, estoque_minimo, custo_atual
      )
    `)
    .eq('empresa_id', empresaId)
    .order('ingredientes(nome)')

  if (error) throw error
  return data || []
}

/**
 * Registrar movimentação de estoque
 */
export async function registerStockMovement(
  empresaId: string,
  ingredienteId: string,
  tipo: 'entrada' | 'saida' | 'ajuste',
  quantidade: number,
  descricao?: string,
  usuarioId?: string
): Promise<boolean> {
  const supabase = createClient()

  try {
    // Registrar movimentação
    const { error: movError } = await supabase
      .from('movimentacoes_estoque')
      .insert({
        empresa_id: empresaId,
        ingrediente_id: ingredienteId,
        tipo,
        quantidade,
        descricao,
        usuario_id: usuarioId,
        data_movimento: new Date().toISOString(),
      })

    if (movError) throw movError

    // Atualizar estoque
    const { data: estoque } = await supabase
      .from('estoque')
      .select('quantidade')
      .eq('empresa_id', empresaId)
      .eq('ingrediente_id', ingredienteId)
      .single()

    if (!estoque) {
      // Criar novo registro de estoque
      await supabase
        .from('estoque')
        .insert({
          empresa_id: empresaId,
          ingrediente_id: ingredienteId,
          quantidade: tipo === 'entrada' ? quantidade : -quantidade,
        })
    } else {
      // Atualizar quantidade
      const novaQtd =
        tipo === 'saida' ? estoque.quantidade - quantidade : estoque.quantidade + quantidade

      await supabase
        .from('estoque')
        .update({
          quantidade: Math.max(0, novaQtd),
          data_atualizacao: new Date().toISOString(),
        })
        .eq('empresa_id', empresaId)
        .eq('ingrediente_id', ingredienteId)
    }

    return true
  } catch (error) {
    console.error('Erro ao registrar movimentação:', error)
    return false
  }
}

/**
 * Buscar histórico de movimentações
 */
export async function getMovementHistory(
  empresaId: string,
  ingredienteId?: string,
  limit = 50
) {
  const supabase = createClient()

  let query = supabase
    .from('movimentacoes_estoque')
    .select(`
      *,
      ingredientes:ingrediente_id (nome),
      usuarios:usuario_id (nome)
    `)
    .eq('empresa_id', empresaId)

  if (ingredienteId) {
    query = query.eq('ingrediente_id', ingredienteId)
  }

  const { data } = await query
    .order('data_movimento', { ascending: false })
    .limit(limit)

  return data || []
}

/**
 * Buscar produtos vencendo
 */
export async function getExpiringProducts(empresaId: string) {
  const supabase = createClient()

  const hoje = new Date().toISOString().split('T')[0]
  const proximos7dias = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0]

  const { data } = await supabase
    .from('estoque')
    .select(`
      *,
      ingredientes:ingrediente_id (nome)
    `)
    .eq('empresa_id', empresaId)
    .lte('validade', proximos7dias)
    .gte('validade', hoje)

  return data || []
}

/**
 * Buscar estoque baixo
 */
export async function getLowStockItems(empresaId: string) {
  const supabase = createClient()

  const { data } = await supabase
    .from('ingredientes')
    .select(`
      id, nome, estoque_atual, estoque_minimo, unidade_medida
    `)
    .eq('empresa_id', empresaId)
    .eq('ativo', true)
    .lte('estoque_atual', 'estoque_minimo')

  return data || []
}
