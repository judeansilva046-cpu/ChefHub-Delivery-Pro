-- =====================================================
-- ChefHub Delivery Pro® - Initial Schema
-- Database: PostgreSQL (Supabase)
-- =====================================================

-- =====================================================
-- ENUMS
-- =====================================================

CREATE TYPE tipo_negocio_enum AS ENUM (
  'restaurante',
  'dark_kitchen',
  'hamburgueria',
  'pizzaria',
  'cafeteria',
  'marmitaria',
  'outro'
);

CREATE TYPE unidade_medida_enum AS ENUM (
  'kg',
  'g',
  'l',
  'ml',
  'un',
  'xicara',
  'colher'
);

CREATE TYPE movimentacao_tipo_enum AS ENUM (
  'entrada',
  'saida',
  'ajuste'
);

CREATE TYPE compra_status_enum AS ENUM (
  'planejada',
  'realizada',
  'cancelada'
);

CREATE TYPE financeiro_tipo_enum AS ENUM (
  'receita',
  'despesa'
);

-- =====================================================
-- TABELA: USUARIOS
-- =====================================================

CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  nome VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ativo BOOLEAN DEFAULT TRUE,

  CONSTRAINT usuarios_email_check CHECK (email ~ '^\S+@\S+\.\S+$')
);

CREATE INDEX idx_usuarios_email ON usuarios(email);

-- =====================================================
-- TABELA: EMPRESAS
-- =====================================================

CREATE TABLE empresas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  cnpj VARCHAR(14) NOT NULL,
  telefone VARCHAR(20),
  email VARCHAR(255) NOT NULL,
  endereco TEXT,
  tipo_negocio tipo_negocio_enum NOT NULL DEFAULT 'restaurante',
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ativo BOOLEAN DEFAULT TRUE,

  CONSTRAINT empresas_unique_cnpj_por_usuario UNIQUE(usuario_id, cnpj),
  CONSTRAINT empresas_email_check CHECK (email ~ '^\S+@\S+\.\S+$')
);

CREATE INDEX idx_empresas_usuario_id ON empresas(usuario_id);
CREATE INDEX idx_empresas_cnpj ON empresas(cnpj);

-- =====================================================
-- TABELA: CATEGORIAS_INGREDIENTES
-- =====================================================

CREATE TABLE categorias_ingredientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categorias_ingredientes_empresa_id ON categorias_ingredientes(empresa_id);

-- =====================================================
-- TABELA: FORNECEDORES
-- =====================================================

CREATE TABLE fornecedores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  contato VARCHAR(255),
  telefone VARCHAR(20),
  email VARCHAR(255),
  endereco TEXT,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ativo BOOLEAN DEFAULT TRUE,

  CONSTRAINT fornecedores_email_check CHECK (email IS NULL OR email ~ '^\S+@\S+\.\S+$')
);

CREATE INDEX idx_fornecedores_empresa_id ON fornecedores(empresa_id);

-- =====================================================
-- TABELA: INGREDIENTES
-- =====================================================

CREATE TABLE ingredientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  categoria_id UUID NOT NULL REFERENCES categorias_ingredientes(id) ON DELETE RESTRICT,
  nome VARCHAR(255) NOT NULL,
  unidade_medida unidade_medida_enum NOT NULL,
  custo_atual DECIMAL(10, 2) NOT NULL DEFAULT 0,
  fornecedor_id UUID REFERENCES fornecedores(id) ON DELETE SET NULL,
  estoque_atual DECIMAL(12, 3) DEFAULT 0,
  estoque_minimo DECIMAL(12, 3) NOT NULL DEFAULT 0,
  controla_validade BOOLEAN DEFAULT FALSE,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ativo BOOLEAN DEFAULT TRUE,

  CONSTRAINT ingredientes_custo_positivo CHECK (custo_atual >= 0),
  CONSTRAINT ingredientes_estoque_positivo CHECK (estoque_atual >= 0),
  CONSTRAINT ingredientes_estoque_minimo_positivo CHECK (estoque_minimo >= 0)
);

CREATE INDEX idx_ingredientes_empresa_id ON ingredientes(empresa_id);
CREATE INDEX idx_ingredientes_categoria_id ON ingredientes(categoria_id);
CREATE INDEX idx_ingredientes_nome ON ingredientes(nome);
CREATE INDEX idx_ingredientes_fornecedor_id ON ingredientes(fornecedor_id);

-- =====================================================
-- TABELA: RECEITAS
-- =====================================================

CREATE TABLE receitas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  categoria VARCHAR(255),
  rendimento INTEGER NOT NULL DEFAULT 1,
  tempo_preparo_minutos INTEGER NOT NULL DEFAULT 0,
  embalagem VARCHAR(255),
  modo_preparo TEXT NOT NULL,
  custo_total DECIMAL(10, 2) DEFAULT 0,
  custo_por_porcao DECIMAL(10, 2) DEFAULT 0,
  cmv_percentual DECIMAL(5, 2) DEFAULT 0,
  margem_percentual DECIMAL(5, 2) DEFAULT 0,
  preco_sugerido DECIMAL(10, 2) DEFAULT 0,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ativo BOOLEAN DEFAULT TRUE,

  CONSTRAINT receitas_rendimento_positivo CHECK (rendimento > 0),
  CONSTRAINT receitas_tempo_preparo_positivo CHECK (tempo_preparo_minutos >= 0)
);

CREATE INDEX idx_receitas_empresa_id ON receitas(empresa_id);
CREATE INDEX idx_receitas_nome ON receitas(nome);

-- =====================================================
-- TABELA: ITENS_RECEITA
-- =====================================================

CREATE TABLE itens_receita (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receita_id UUID NOT NULL REFERENCES receitas(id) ON DELETE CASCADE,
  ingrediente_id UUID NOT NULL REFERENCES ingredientes(id) ON DELETE RESTRICT,
  quantidade DECIMAL(12, 3) NOT NULL,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT itens_receita_quantidade_positiva CHECK (quantidade > 0),
  CONSTRAINT itens_receita_unique UNIQUE(receita_id, ingrediente_id)
);

CREATE INDEX idx_itens_receita_receita_id ON itens_receita(receita_id);
CREATE INDEX idx_itens_receita_ingrediente_id ON itens_receita(ingrediente_id);

-- =====================================================
-- TABELA: ESTOQUE
-- =====================================================

CREATE TABLE estoque (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  ingrediente_id UUID NOT NULL REFERENCES ingredientes(id) ON DELETE RESTRICT,
  quantidade DECIMAL(12, 3) NOT NULL DEFAULT 0,
  validade DATE,
  lote VARCHAR(255),
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT estoque_quantidade_positiva CHECK (quantidade >= 0),
  CONSTRAINT estoque_unique UNIQUE(empresa_id, ingrediente_id, COALESCE(lote, ''))
);

CREATE INDEX idx_estoque_empresa_id ON estoque(empresa_id);
CREATE INDEX idx_estoque_ingrediente_id ON estoque(ingrediente_id);
CREATE INDEX idx_estoque_validade ON estoque(validade);

-- =====================================================
-- TABELA: MOVIMENTACOES_ESTOQUE
-- =====================================================

CREATE TABLE movimentacoes_estoque (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  ingrediente_id UUID NOT NULL REFERENCES ingredientes(id) ON DELETE RESTRICT,
  tipo movimentacao_tipo_enum NOT NULL,
  quantidade DECIMAL(12, 3) NOT NULL,
  descricao TEXT,
  data_movimento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,

  CONSTRAINT movimentacoes_quantidade_positiva CHECK (quantidade > 0)
);

CREATE INDEX idx_movimentacoes_estoque_empresa_id ON movimentacoes_estoque(empresa_id);
CREATE INDEX idx_movimentacoes_estoque_ingrediente_id ON movimentacoes_estoque(ingrediente_id);
CREATE INDEX idx_movimentacoes_estoque_data ON movimentacoes_estoque(data_movimento);

-- =====================================================
-- TABELA: COMPRAS
-- =====================================================

CREATE TABLE compras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  status compra_status_enum DEFAULT 'planejada',
  data_planejada DATE NOT NULL,
  data_realizada DATE,
  custo_total DECIMAL(12, 2) DEFAULT 0,
  observacoes TEXT,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT compras_custo_positivo CHECK (custo_total >= 0)
);

CREATE INDEX idx_compras_empresa_id ON compras(empresa_id);
CREATE INDEX idx_compras_data_planejada ON compras(data_planejada);
CREATE INDEX idx_compras_status ON compras(status);

-- =====================================================
-- TABELA: ITENS_COMPRA
-- =====================================================

CREATE TABLE itens_compra (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  compra_id UUID NOT NULL REFERENCES compras(id) ON DELETE CASCADE,
  ingrediente_id UUID NOT NULL REFERENCES ingredientes(id) ON DELETE RESTRICT,
  quantidade DECIMAL(12, 3) NOT NULL,
  preco_unitario DECIMAL(10, 2) NOT NULL,
  custo_total DECIMAL(12, 2) NOT NULL,

  CONSTRAINT itens_compra_quantidade_positiva CHECK (quantidade > 0),
  CONSTRAINT itens_compra_preco_positivo CHECK (preco_unitario >= 0),
  CONSTRAINT itens_compra_custo_positivo CHECK (custo_total >= 0)
);

CREATE INDEX idx_itens_compra_compra_id ON itens_compra(compra_id);
CREATE INDEX idx_itens_compra_ingrediente_id ON itens_compra(ingrediente_id);

-- =====================================================
-- TABELA: FINANCEIRO
-- =====================================================

CREATE TABLE financeiro (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  tipo financeiro_tipo_enum NOT NULL,
  categoria VARCHAR(255) NOT NULL,
  descricao TEXT,
  valor DECIMAL(12, 2) NOT NULL,
  data_lancamento DATE NOT NULL,
  referencia_id UUID,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT financeiro_valor_positivo CHECK (valor > 0)
);

CREATE INDEX idx_financeiro_empresa_id ON financeiro(empresa_id);
CREATE INDEX idx_financeiro_data_lancamento ON financeiro(data_lancamento);
CREATE INDEX idx_financeiro_tipo ON financeiro(tipo);
CREATE INDEX idx_financeiro_categoria ON financeiro(categoria);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias_ingredientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE fornecedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE receitas ENABLE ROW LEVEL SECURITY;
ALTER TABLE itens_receita ENABLE ROW LEVEL SECURITY;
ALTER TABLE estoque ENABLE ROW LEVEL SECURITY;
ALTER TABLE movimentacoes_estoque ENABLE ROW LEVEL SECURITY;
ALTER TABLE compras ENABLE ROW LEVEL SECURITY;
ALTER TABLE itens_compra ENABLE ROW LEVEL SECURITY;
ALTER TABLE financeiro ENABLE ROW LEVEL SECURITY;

-- Policies para usuarios (cada usuário vê apenas seus dados)
CREATE POLICY usuarios_select ON usuarios
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY usuarios_update ON usuarios
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Policies para empresas (usuário vê apenas suas empresas)
CREATE POLICY empresas_select ON empresas
  FOR SELECT USING (usuario_id = auth.uid());

CREATE POLICY empresas_insert ON empresas
  FOR INSERT WITH CHECK (usuario_id = auth.uid());

CREATE POLICY empresas_update ON empresas
  FOR UPDATE USING (usuario_id = auth.uid());

CREATE POLICY empresas_delete ON empresas
  FOR DELETE USING (usuario_id = auth.uid());

-- Policies para tabelas dependentes de empresa
CREATE POLICY categorias_ingredientes_select ON categorias_ingredientes
  FOR SELECT USING (
    empresa_id IN (SELECT id FROM empresas WHERE usuario_id = auth.uid())
  );

CREATE POLICY categorias_ingredientes_insert ON categorias_ingredientes
  FOR INSERT WITH CHECK (
    empresa_id IN (SELECT id FROM empresas WHERE usuario_id = auth.uid())
  );

CREATE POLICY categorias_ingredientes_update ON categorias_ingredientes
  FOR UPDATE USING (
    empresa_id IN (SELECT id FROM empresas WHERE usuario_id = auth.uid())
  );

CREATE POLICY categorias_ingredientes_delete ON categorias_ingredientes
  FOR DELETE USING (
    empresa_id IN (SELECT id FROM empresas WHERE usuario_id = auth.uid())
  );

-- Policies para fornecedores
CREATE POLICY fornecedores_select ON fornecedores
  FOR SELECT USING (
    empresa_id IN (SELECT id FROM empresas WHERE usuario_id = auth.uid())
  );

CREATE POLICY fornecedores_insert ON fornecedores
  FOR INSERT WITH CHECK (
    empresa_id IN (SELECT id FROM empresas WHERE usuario_id = auth.uid())
  );

CREATE POLICY fornecedores_update ON fornecedores
  FOR UPDATE USING (
    empresa_id IN (SELECT id FROM empresas WHERE usuario_id = auth.uid())
  );

CREATE POLICY fornecedores_delete ON fornecedores
  FOR DELETE USING (
    empresa_id IN (SELECT id FROM empresas WHERE usuario_id = auth.uid())
  );

-- Policies para ingredientes
CREATE POLICY ingredientes_select ON ingredientes
  FOR SELECT USING (
    empresa_id IN (SELECT id FROM empresas WHERE usuario_id = auth.uid())
  );

CREATE POLICY ingredientes_insert ON ingredientes
  FOR INSERT WITH CHECK (
    empresa_id IN (SELECT id FROM empresas WHERE usuario_id = auth.uid())
  );

CREATE POLICY ingredientes_update ON ingredientes
  FOR UPDATE USING (
    empresa_id IN (SELECT id FROM empresas WHERE usuario_id = auth.uid())
  );

CREATE POLICY ingredientes_delete ON ingredientes
  FOR DELETE USING (
    empresa_id IN (SELECT id FROM empresas WHERE usuario_id = auth.uid())
  );

-- Policies para receitas
CREATE POLICY receitas_select ON receitas
  FOR SELECT USING (
    empresa_id IN (SELECT id FROM empresas WHERE usuario_id = auth.uid())
  );

CREATE POLICY receitas_insert ON receitas
  FOR INSERT WITH CHECK (
    empresa_id IN (SELECT id FROM empresas WHERE usuario_id = auth.uid())
  );

CREATE POLICY receitas_update ON receitas
  FOR UPDATE USING (
    empresa_id IN (SELECT id FROM empresas WHERE usuario_id = auth.uid())
  );

CREATE POLICY receitas_delete ON receitas
  FOR DELETE USING (
    empresa_id IN (SELECT id FROM empresas WHERE usuario_id = auth.uid())
  );

-- Policies para itens_receita (via receita)
CREATE POLICY itens_receita_select ON itens_receita
  FOR SELECT USING (
    receita_id IN (SELECT id FROM receitas WHERE empresa_id IN (SELECT id FROM empresas WHERE usuario_id = auth.uid()))
  );

CREATE POLICY itens_receita_insert ON itens_receita
  FOR INSERT WITH CHECK (
    receita_id IN (SELECT id FROM receitas WHERE empresa_id IN (SELECT id FROM empresas WHERE usuario_id = auth.uid()))
  );

CREATE POLICY itens_receita_update ON itens_receita
  FOR UPDATE USING (
    receita_id IN (SELECT id FROM receitas WHERE empresa_id IN (SELECT id FROM empresas WHERE usuario_id = auth.uid()))
  );

CREATE POLICY itens_receita_delete ON itens_receita
  FOR DELETE USING (
    receita_id IN (SELECT id FROM receitas WHERE empresa_id IN (SELECT id FROM empresas WHERE usuario_id = auth.uid()))
  );

-- Policies para estoque
CREATE POLICY estoque_select ON estoque
  FOR SELECT USING (
    empresa_id IN (SELECT id FROM empresas WHERE usuario_id = auth.uid())
  );

CREATE POLICY estoque_insert ON estoque
  FOR INSERT WITH CHECK (
    empresa_id IN (SELECT id FROM empresas WHERE usuario_id = auth.uid())
  );

CREATE POLICY estoque_update ON estoque
  FOR UPDATE USING (
    empresa_id IN (SELECT id FROM empresas WHERE usuario_id = auth.uid())
  );

CREATE POLICY estoque_delete ON estoque
  FOR DELETE USING (
    empresa_id IN (SELECT id FROM empresas WHERE usuario_id = auth.uid())
  );

-- Policies para movimentacoes_estoque
CREATE POLICY movimentacoes_estoque_select ON movimentacoes_estoque
  FOR SELECT USING (
    empresa_id IN (SELECT id FROM empresas WHERE usuario_id = auth.uid())
  );

CREATE POLICY movimentacoes_estoque_insert ON movimentacoes_estoque
  FOR INSERT WITH CHECK (
    empresa_id IN (SELECT id FROM empresas WHERE usuario_id = auth.uid())
  );

CREATE POLICY movimentacoes_estoque_update ON movimentacoes_estoque
  FOR UPDATE USING (
    empresa_id IN (SELECT id FROM empresas WHERE usuario_id = auth.uid())
  );

-- Policies para compras
CREATE POLICY compras_select ON compras
  FOR SELECT USING (
    empresa_id IN (SELECT id FROM empresas WHERE usuario_id = auth.uid())
  );

CREATE POLICY compras_insert ON compras
  FOR INSERT WITH CHECK (
    empresa_id IN (SELECT id FROM empresas WHERE usuario_id = auth.uid())
  );

CREATE POLICY compras_update ON compras
  FOR UPDATE USING (
    empresa_id IN (SELECT id FROM empresas WHERE usuario_id = auth.uid())
  );

CREATE POLICY compras_delete ON compras
  FOR DELETE USING (
    empresa_id IN (SELECT id FROM empresas WHERE usuario_id = auth.uid())
  );

-- Policies para itens_compra
CREATE POLICY itens_compra_select ON itens_compra
  FOR SELECT USING (
    compra_id IN (SELECT id FROM compras WHERE empresa_id IN (SELECT id FROM empresas WHERE usuario_id = auth.uid()))
  );

CREATE POLICY itens_compra_insert ON itens_compra
  FOR INSERT WITH CHECK (
    compra_id IN (SELECT id FROM compras WHERE empresa_id IN (SELECT id FROM empresas WHERE usuario_id = auth.uid()))
  );

CREATE POLICY itens_compra_update ON itens_compra
  FOR UPDATE USING (
    compra_id IN (SELECT id FROM compras WHERE empresa_id IN (SELECT id FROM empresas WHERE usuario_id = auth.uid()))
  );

CREATE POLICY itens_compra_delete ON itens_compra
  FOR DELETE USING (
    compra_id IN (SELECT id FROM compras WHERE empresa_id IN (SELECT id FROM empresas WHERE usuario_id = auth.uid()))
  );

-- Policies para financeiro
CREATE POLICY financeiro_select ON financeiro
  FOR SELECT USING (
    empresa_id IN (SELECT id FROM empresas WHERE usuario_id = auth.uid())
  );

CREATE POLICY financeiro_insert ON financeiro
  FOR INSERT WITH CHECK (
    empresa_id IN (SELECT id FROM empresas WHERE usuario_id = auth.uid())
  );

CREATE POLICY financeiro_update ON financeiro
  FOR UPDATE USING (
    empresa_id IN (SELECT id FROM empresas WHERE usuario_id = auth.uid())
  );

CREATE POLICY financeiro_delete ON financeiro
  FOR DELETE USING (
    empresa_id IN (SELECT id FROM empresas WHERE usuario_id = auth.uid())
  );

-- =====================================================
-- FIM DO SCHEMA INICIAL
-- =====================================================
