// Constantes da Aplicação

// Cores da marca
export const COLORS = {
  darkBlue: '#0B1F3A',
  orange: '#FF6B00',
  white: '#FFFFFF',
  lightGray: '#F5F5F5',
} as const

// Tipos de negócio
export const TIPO_NEGOCIO = [
  { value: 'restaurante', label: 'Restaurante' },
  { value: 'dark_kitchen', label: 'Dark Kitchen' },
  { value: 'hamburgueria', label: 'Hamburgueria' },
  { value: 'pizzaria', label: 'Pizzaria' },
  { value: 'cafeteria', label: 'Cafeteria' },
  { value: 'marmitaria', label: 'Marmitaria' },
  { value: 'outro', label: 'Outro' },
] as const

// Unidades de medida
export const UNIDADES_MEDIDA = [
  { value: 'kg', label: 'Quilograma (kg)' },
  { value: 'g', label: 'Grama (g)' },
  { value: 'l', label: 'Litro (l)' },
  { value: 'ml', label: 'Mililitro (ml)' },
  { value: 'un', label: 'Unidade' },
  { value: 'xicara', label: 'Xícara' },
  { value: 'colher', label: 'Colher' },
] as const

// Tipos de movimentação de estoque
export const TIPOS_MOVIMENTACAO = [
  { value: 'entrada', label: 'Entrada' },
  { value: 'saida', label: 'Saída' },
  { value: 'ajuste', label: 'Ajuste' },
] as const

// Status de compra
export const STATUS_COMPRA = [
  { value: 'planejada', label: 'Planejada' },
  { value: 'realizada', label: 'Realizada' },
  { value: 'cancelada', label: 'Cancelada' },
] as const

// Categorias financeiras - Receitas
export const CATEGORIAS_RECEITA = [
  { value: 'venda_balcao', label: 'Venda Balcão' },
  { value: 'venda_delivery', label: 'Venda Delivery' },
  { value: 'outro', label: 'Outro' },
] as const

// Categorias financeiras - Despesas
export const CATEGORIAS_DESPESA = [
  { value: 'compras', label: 'Compras' },
  { value: 'aluguel', label: 'Aluguel' },
  { value: 'energia', label: 'Energia Elétrica' },
  { value: 'agua', label: 'Água' },
  { value: 'internet', label: 'Internet' },
  { value: 'folha_pagamento', label: 'Folha de Pagamento' },
  { value: 'outro', label: 'Outro' },
] as const

// Validações - Regras
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIRES_UPPERCASE: true,
  PASSWORD_REQUIRES_NUMBER: true,
  PASSWORD_REQUIRES_SPECIAL: false,

  NAME_MIN_LENGTH: 3,
  NAME_MAX_LENGTH: 255,

  EMAIL_MIN_LENGTH: 5,
  EMAIL_MAX_LENGTH: 255,

  PHONE_MIN_LENGTH: 10,
  PHONE_MAX_LENGTH: 11,

  CNPJ_LENGTH: 14,

  INGREDIENT_NAME_MIN_LENGTH: 3,
  INGREDIENT_NAME_MAX_LENGTH: 255,

  RECIPE_NAME_MIN_LENGTH: 3,
  RECIPE_NAME_MAX_LENGTH: 255,
  RECIPE_MIN_YIELD: 1,

  COMPANY_NAME_MIN_LENGTH: 3,
  COMPANY_NAME_MAX_LENGTH: 255,
} as const

// Mensagens de erro
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Este campo é obrigatório',
  INVALID_EMAIL: 'E-mail inválido',
  INVALID_PASSWORD: 'Senha deve ter no mínimo 8 caracteres',
  INVALID_CNPJ: 'CNPJ inválido',
  INVALID_PHONE: 'Telefone inválido',
  PASSWORDS_NOT_MATCH: 'As senhas não conferem',

  USER_NOT_FOUND: 'Usuário não encontrado',
  USER_ALREADY_EXISTS: 'Este e-mail já está registrado',
  INVALID_CREDENTIALS: 'E-mail ou senha incorretos',

  COMPANY_NOT_FOUND: 'Empresa não encontrada',

  INGREDIENT_NOT_FOUND: 'Ingrediente não encontrado',
  INGREDIENT_ALREADY_EXISTS: 'Este ingrediente já existe',

  RECIPE_NOT_FOUND: 'Receita não encontrada',
  RECIPE_ALREADY_EXISTS: 'Esta receita já existe',
  RECIPE_NO_INGREDIENTS: 'Receita deve ter pelo menos um ingrediente',

  STOCK_INSUFFICIENT: 'Estoque insuficiente',

  SERVER_ERROR: 'Erro ao conectar com servidor',
  NETWORK_ERROR: 'Erro de conexão',
  UNKNOWN_ERROR: 'Erro desconhecido',
} as const

// Mensagens de sucesso
export const SUCCESS_MESSAGES = {
  LOGIN: 'Bem-vindo!',
  LOGOUT: 'Você foi desconectado',
  REGISTER: 'Conta criada com sucesso!',
  PASSWORD_RESET: 'E-mail de recuperação enviado',
  PASSWORD_CHANGED: 'Senha alterada com sucesso',

  COMPANY_CREATED: 'Empresa criada com sucesso',
  COMPANY_UPDATED: 'Empresa atualizada com sucesso',
  COMPANY_DELETED: 'Empresa removida com sucesso',

  INGREDIENT_CREATED: 'Ingrediente criado com sucesso',
  INGREDIENT_UPDATED: 'Ingrediente atualizado com sucesso',
  INGREDIENT_DELETED: 'Ingrediente removido com sucesso',

  RECIPE_CREATED: 'Receita criada com sucesso',
  RECIPE_UPDATED: 'Receita atualizada com sucesso',
  RECIPE_DELETED: 'Receita removida com sucesso',

  STOCK_UPDATED: 'Estoque atualizado com sucesso',
  STOCK_MOVEMENT_CREATED: 'Movimentação de estoque registrada',

  PURCHASE_CREATED: 'Compra criada com sucesso',
  PURCHASE_UPDATED: 'Compra atualizada com sucesso',
  PURCHASE_COMPLETED: 'Compra realizada com sucesso',

  DATA_EXPORTED: 'Dados exportados com sucesso',
} as const

// Configurações gerais
export const CONFIG = {
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  DEFAULT_PAGE_SIZE_OPTIONS: [10, 20, 50, 100],

  // Timeouts
  API_TIMEOUT: 30000,
  SESSION_TIMEOUT: 60 * 60 * 1000, // 1 hora

  // CMV Target
  DEFAULT_CMV_TARGET: 30, // 30%

  // Estoque
  WARN_STOCK_DAYS: 7, // Avisar 7 dias antes de vencer
} as const
