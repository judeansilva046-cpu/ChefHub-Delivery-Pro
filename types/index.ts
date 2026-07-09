// Usuario
export interface Usuario {
  id: string
  email: string
  nome: string
  telefone?: string
  data_criacao: string
  ativo: boolean
}

// Empresa
export interface Empresa {
  id: string
  usuario_id: string
  nome: string
  cnpj: string
  telefone?: string
  email: string
  endereco?: string
  tipo_negocio: 'restaurante' | 'dark_kitchen' | 'hamburgueria' | 'pizzaria' | 'cafeteria' | 'marmitaria' | 'outro'
  data_criacao: string
  ativo: boolean
}

// Categoria de Ingredientes
export interface CategoriaIngrediente {
  id: string
  empresa_id: string
  nome: string
  descricao?: string
  data_criacao: string
}

// Ingrediente
export interface Ingrediente {
  id: string
  empresa_id: string
  categoria_id: string
  nome: string
  unidade_medida: 'kg' | 'g' | 'l' | 'ml' | 'un' | 'xicara' | 'colher'
  custo_atual: number
  fornecedor_id?: string
  estoque_atual: number
  estoque_minimo: number
  controla_validade: boolean
  data_criacao: string
  data_atualizacao: string
  ativo: boolean
}

// Fornecedor
export interface Fornecedor {
  id: string
  empresa_id: string
  nome: string
  contato?: string
  telefone?: string
  email?: string
  endereco?: string
  data_criacao: string
  ativo: boolean
}

// Receita
export interface Receita {
  id: string
  empresa_id: string
  nome: string
  categoria?: string
  rendimento: number
  tempo_preparo_minutos: number
  embalagem?: string
  modo_preparo: string
  custo_total: number
  custo_por_porcao: number
  cmv_percentual: number
  margem_percentual: number
  preco_sugerido: number
  data_criacao: string
  data_atualizacao: string
  ativo: boolean
}

// Item de Receita
export interface ItemReceita {
  id: string
  receita_id: string
  ingrediente_id: string
  quantidade: number
  data_criacao: string
}

// Estoque
export interface Estoque {
  id: string
  empresa_id: string
  ingrediente_id: string
  quantidade: number
  validade?: string
  lote?: string
  data_atualizacao: string
}

// Movimentação de Estoque
export interface MovimentacaoEstoque {
  id: string
  empresa_id: string
  ingrediente_id: string
  tipo: 'entrada' | 'saida' | 'ajuste'
  quantidade: number
  descricao?: string
  data_movimento: string
  usuario_id?: string
}

// Compra
export interface Compra {
  id: string
  empresa_id: string
  status: 'planejada' | 'realizada' | 'cancelada'
  data_planejada: string
  data_realizada?: string
  custo_total: number
  observacoes?: string
  data_criacao: string
}

// Item de Compra
export interface ItemCompra {
  id: string
  compra_id: string
  ingrediente_id: string
  quantidade: number
  preco_unitario: number
  custo_total: number
}

// Financeiro
export interface Financeiro {
  id: string
  empresa_id: string
  tipo: 'receita' | 'despesa'
  categoria: string
  descricao?: string
  valor: number
  data_lancamento: string
  referencia_id?: string
  data_criacao: string
}

// Response types
export interface ApiResponse<T> {
  data?: T
  error?: {
    message: string
    code: string
  }
}

export interface ApiListResponse<T> {
  data?: T[]
  error?: {
    message: string
    code: string
  }
  total?: number
  count?: number
}
