# CLAUDE.md - Instruções Técnicas ChefHub Delivery Pro®

## 🎯 Direcionamento para Claude/Desenvolvimento

### Princípios Fundamentais

1. **Sem Protótipos Falsos**
   - Cada feature deve funcionar de verdade
   - Usar dados reais, não mockados
   - Todas as funcionalidades devem estar completas

2. **Estrutura de Produção**
   - Banco de dados com relacionamentos reais
   - Autenticação real via Supabase Auth
   - RLS (Row Level Security) implementado
   - Sem atalhos técnicos

3. **Código Limpo e Escalável**
   - TypeScript strict mode
   - Componentes reutilizáveis
   - Tipagem forte
   - Documentação clara

### Roadmap de Desenvolvimento

Executar sequencialmente, NÃO pular etapas:

#### Etapa 1: Estrutura do Projeto ✅ CONCLUÍDA
- [x] Next.js 15 setup
- [x] TypeScript configurado
- [x] Tailwind CSS
- [x] Supabase client
- [x] Types base
- [x] Banco de dados schema completo com RLS
- [x] README.md

**Status:** PRONTO PARA PRÓXIMA ETAPA

#### Etapa 2: Autenticação (Próxima)
- [ ] Página de Login
- [ ] Página de Registro
- [ ] Recuperação de senha
- [ ] Middleware de proteção de rotas
- [ ] Context de autenticação
- [ ] Logout

#### Etapa 3: Layout Principal
- [ ] Sidebar com menu
- [ ] Top navigation
- [ ] Avatar/Profile menu
- [ ] Breadcrumbs
- [ ] Responsividade

#### Etapa 4: Dashboard
- [ ] Cards informativos (faturamento, lucro, CMV, estoque, compras)
- [ ] Widgets (estoque baixo, vencimentos, receitas lucrativas)
- [ ] Gráficos (faturamento, despesas, CMV)

#### Etapa 5: Ingredientes
- [ ] CRUD completo
- [ ] Categorias
- [ ] Filtros e busca
- [ ] Importação em massa

#### Etapa 6: Receitas
- [ ] CRUD de receitas
- [ ] Adicionar ingredientes com quantidades
- [ ] Cálculos automáticos (custo, CMV, margem, preço sugerido)
- [ ] Trigger para recalcular quando ingrediente muda preço

#### Etapa 7: Estoque
- [ ] Visualizar estoque atual
- [ ] Registrar movimentações
- [ ] Controle de validade
- [ ] Alertas de estoque baixo
- [ ] Histórico de movimentações

#### Etapa 8: Compra Inteligente ⭐
- [ ] Fluxo: "Vou produzir X unidades"
- [ ] Cálculo automático de ingredientes necessários
- [ ] Comparação com estoque
- [ ] Geração de lista de compra
- [ ] Cálculo de custo total

#### Etapa 9: Financeiro
- [ ] Lançamento de receitas
- [ ] Lançamento de despesas
- [ ] Categorização
- [ ] Resultado mensal
- [ ] Gráficos financeiros

#### Etapa 10: Relatórios
- [ ] CMV por receita
- [ ] Lucro por receita
- [ ] Consumo de ingredientes
- [ ] Valor do estoque
- [ ] Resultado financeiro
- [ ] Exportação PDF/Excel

### Convenções de Código

#### Componentes
- Usar functional components com hooks
- Exports nomeados para importações explícitas
- Props com interfaces TypeScript
- Componentes em `components/` organizados por feature

```typescript
// ✅ BOM
interface ButtonProps {
  variant: 'primary' | 'secondary'
  children: React.ReactNode
  onClick?: () => void
}

export function Button({ variant, children, onClick }: ButtonProps) {
  return <button>{children}</button>
}

// ❌ RUIM
export default function Button({ variant, children }) {
  // ...
}
```

#### Diretório de Componentes
```
components/
├── ui/                  # Componentes básicos (Button, Input, etc)
├── layout/              # Layout components (Header, Sidebar, etc)
├── modules/
│   ├── auth/
│   ├── dashboard/
│   ├── ingredientes/
│   ├── receitas/
│   └── ...
└── common/              # Shared components
```

#### Hooks Customizados
- Arquivo: `lib/hooks/useNomeHook.ts`
- Prefix com `use`
- Documentação JSDoc
- Tipagem completa

#### API Routes (se necessário)
- Usar Supabase client em vez de API routes quando possível
- Se precisar API routes: `app/api/[resource]/route.ts`
- Validar input
- Retornar erros estruturados

#### Tipos
- Manter em `types/index.ts` ou `types/[feature].ts`
- Nunca usar `any`
- Usar `unknown` quando necessário e depois type guard
- Interfaces para objetos, types para unions

#### Banco de Dados
- Operações via Supabase client
- Não usar SQL raw queries (exceto quando necessário)
- Usar TypeScript types dos dados
- Implementar error handling

#### Styling
- Usar Tailwind CSS (não CSS-in-JS)
- Classes no JSX, não estilo inline
- Usar variáveis CSS para cores customizadas
- Seguir naming do Tailwind

```typescript
// ✅ BOM
<button className="px-4 py-2 bg-chefhub-orange text-white rounded hover:bg-orange-700">
  Enviar
</button>

// ❌ RUIM
<button style={{ padding: '8px 16px', backgroundColor: '#FF6B00' }}>
  Enviar
</button>
```

### Estrutura de Pas ta para Novas Features

Quando adicionar novo módulo:

1. **Components**
   ```
   components/modules/[feature]/
   ├── [feature]List.tsx      # Listagem
   ├── [feature]Form.tsx      # Formulário
   ├── [feature]Detail.tsx    # Detalhes
   └── index.ts               # Exports
   ```

2. **Types**
   ```
   types/[feature].ts          # Types específicos do módulo
   ```

3. **Lib/Hooks**
   ```
   lib/hooks/use[Feature].ts   # Hooks customizados
   ```

4. **API (se necessário)**
   ```
   app/api/[feature]/route.ts  # Endpoints
   ```

5. **Pages (App Router)**
   ```
   app/[feature]/
   ├── page.tsx               # Listagem
   ├── [id]/page.tsx          # Detalhes
   ├── layout.tsx             # Layout do módulo
   └── new/page.tsx           # Criar novo
   ```

### Verificação de Qualidade

Antes de passar para próxima etapa:

- [ ] Código compila sem erros TypeScript
- [ ] Sem `any` types
- [ ] Componentes testam no navegador
- [ ] Dados são reais (Supabase)
- [ ] RLS está funcionando
- [ ] Responsivo em mobile/tablet/desktop
- [ ] Código documentado
- [ ] Sem console.log em produção

### Commit Messages

Usar conventional commits:
```
feat: adiciona módulo X
fix: corrige bug em Y
refactor: reorganiza estrutura de Z
docs: atualiza documentação de A
```

### Environment Variables

Necessárias:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Opcional (para deploy):
- `NEXT_PUBLIC_APP_URL` (URL da app em produção)

### Troubleshooting

**Erro de RLS:**
- Verificar se está autenticado
- Verificar policies no Supabase
- Testar no Supabase Studio

**Erro de tipos:**
- Verificar interface vs type
- Rodar `npm run type-check`
- Verificar imports

**Supabase desconectado:**
- Verificar `.env.local`
- Verificar se projeto Supabase está ativo
- Testar connection no Supabase Studio

---

**Status do Projeto:** Em Desenvolvimento
**Etapa Atual:** 1 (Estrutura) ✅
**Próxima:** 2 (Autenticação)
