# 🗄️ SUPABASE CLOUD - GUIA DE CONFIGURAÇÃO

## ChefHub Delivery Pro® + Supabase Cloud

---

## ✅ PASSO 1: Criar Projeto Supabase

### 1.1 - Registrar/Login

```
Ir para: https://supabase.com
Clicar em: "Start your project"
Login com: Email / GitHub / Google
```

### 1.2 - Criar novo projeto

```
Dashboard → "New Project"

Preencher:
├─ Name: ChefHub Delivery Pro
├─ Region: Brazil (São Paulo) sa-east-1 ⭐
├─ Database Password: [guardar em local seguro]
└─ Plano: Free (suficiente para iniciar)
```

### 1.3 - Aguardar criação

```
⏳ Projeto sendo criado (~2 min)
✅ Pronto quando aparecer "Settings" no menu
```

---

## ✅ PASSO 2: Executar Schema SQL

### 2.1 - Abrir SQL Editor

```
Supabase Dashboard
├─ Projeto criado
├─ Menu esquerdo → SQL Editor
└─ New Query
```

### 2.2 - Copiar SQL completo

Abrir arquivo: `supabase/migrations/001_init_schema.sql`

Copiar **TODO** o conteúdo (todas as tabelas, triggers, RLS)

### 2.3 - Executar SQL

```
1. Colar no SQL Editor
2. Clicar em "Run"
3. Aguardar conclusão (30-60 segundos)
4. ✅ Sucesso quando não houver erros
```

### 2.4 - Verificar tabelas

```
Menu esquerdo → Table Editor
Verificar se existem 12 tabelas:
✅ usuarios
✅ empresas
✅ ingredientes
✅ receitas
✅ itens_receita
✅ estoque
✅ movimentacoes_estoque
✅ compras
✅ itens_compra
✅ financeiro
✅ (e outras)
```

---

## ✅ PASSO 3: Configurar Autenticação

### 3.1 - Ativar Auth

```
Menu esquerdo → Authentication
Settings → Providers
```

### 3.2 - Email/Password (padrão)

```
Já vem ativado por padrão ✅
Não precisa fazer nada
```

### 3.3 - Configurar Email (opcional)

```
Menu → Auth → Email Templates

Customizar (opcional):
- Welcome email
- Reset password email
- Magic link email
```

---

## ✅ PASSO 4: Copiar Credenciais

### 4.1 - Project Settings

```
Menu esquerdo → Settings
ou
Ícone engrenagem → Project Settings
```

### 4.2 - API Keys

```
Guia: API
Copiar e guardar em local SEGURO:

┌─────────────────────────────────────┐
│ Project URL                         │
│ (NEXT_PUBLIC_SUPABASE_URL)          │
│ https://xxx.supabase.co             │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Anon Public Key                     │
│ (NEXT_PUBLIC_SUPABASE_ANON_KEY)     │
│ eyJhbGc...                          │
└─────────────────────────────────────┘

⚠️ NUNCA compartilhe essas chaves!
⚠️ NÃO commitá-las no GitHub!
```

### 4.3 - Service Role Key (para backend)

```
Encontrada também em Settings → API
Copiar se precisar depois (para Vercel Edge Functions)
```

---

## ✅ PASSO 5: Configurar RLS Policies

### 5.1 - Verificar RLS

```
Table Editor → Selecione uma tabela
Menu → Authentication → RLS

Deve estar: "RLS is enabled" ✅
```

### 5.2 - Políticas já criadas

O SQL criado já incluiu todas as RLS policies:

```
✅ usuarios: owner pode acessar próprio registro
✅ empresas: owner pode acessar própria empresa
✅ ingredientes: acesso restrito à empresa
✅ receitas: acesso restrito à empresa
... (todas as tabelas com RLS)
```

### 5.3 - Testar RLS

```
No Supabase Studio → Table Editor
Clicar em uma tabela
"Ativar RLS" se não estiver ativo

Verificar que usuário só vê seus dados
```

---

## ✅ PASSO 6: Storage (Opcional - Fotos)

Se quiser adicionar fotos de receitas/ingredientes:

### 6.1 - Criar bucket

```
Menu esquerdo → Storage
New Bucket → "receitas-images"
Public: No (privado)
```

### 6.2 - Configurar RLS Storage

```
Storage → Policies
Criar policy para acesso autorizado
```

---

## ✅ PASSO 7: Backups Automáticos

### 7.1 - Ativar Backups

```
Settings → Backups
"Enable automatic backups"
Frequência: Daily (recomendado)
```

### 7.2 - Plano Free

```
Supabase Free:
✅ 1 backup automático por dia
✅ Retenção de 7 dias
✅ Suficiente para iniciar
```

---

## ✅ PASSO 8: Monitoramento

### 8.1 - Verificar Status

```
Dashboard → Database
Verificar:
- Database health
- Storage usage
- Realtime connections
```

### 8.2 - Logs

```
Menu → Logs
Verificar erros/warnings
```

---

## 🔐 PASSO 9: Segurança

### 9.1 - Variáveis Seguras

```
⚠️ NUNCA guardar credenciais em:
- .env.local (só localmente!)
- Código hardcoded
- Commits

✅ FAZER:
- Usar .env.local para dev
- Usar Vercel Secrets para produção
- Usar .env.local.example como template
```

### 9.2 - Limitar Acesso

```
Settings → Developers
Configurar rate limiting se necessário
```

### 9.3 - Monitoring

```
Settings → Observability
Ativar monitoring para alertas
```

---

## 📊 Limites Supabase Free

```
✅ Tabelas: Ilimitado
✅ Linhas: Até 500MB
✅ Conexões: Até 10
✅ Bandwidth: Até 2GB/mês
✅ Usuários: Ilimitado
✅ Storage: Até 1GB

Quando crescer:
→ Upgrade para Pro ($25/mês)
```

---

## 🆘 Troubleshooting

### **Erro: "Connection refused"**

```
Solução:
1. Verificar Project URL está correto
2. Verificar firewall (abrir portas)
3. Verificar status do Supabase (status page)
```

### **Erro: "RLS policy violation"**

```
Solução:
1. Verificar se usuário está autenticado
2. Verificar RLS policies (Admin → Table Editor)
3. Rodar query como admin sem RLS
```

### **Erro: "Quota exceeded"**

```
Solução:
1. Verificar uso em Dashboard
2. Fazer cleanup de dados desnecessários
3. Upgrade para plano pago
```

### **Backup corrompido**

```
Solução:
1. Restaurar de backup anterior
2. Settings → Backups → Restore
```

---

## ✨ Checklist Supabase

Antes de fazer deploy:

- [ ] ✅ Projeto criado
- [ ] ✅ Schema SQL executado (12 tabelas)
- [ ] ✅ RLS ativado em todas tabelas
- [ ] ✅ Auth habilitado (Email/Password)
- [ ] ✅ Credenciais copiadas e seguras
- [ ] ✅ Backups automáticos ativados
- [ ] ✅ Storage configurado (opcional)
- [ ] ✅ Testou login com usuário teste
- [ ] ✅ Testou CRUD com dados
- [ ] ✅ Verificou RLS (dados isolados por empresa)

---

## 📞 Próximo Passo

Depois de configurar Supabase:

1. ✅ Copiar credenciais
2. ✅ Colocar em `.env.local` (local)
3. ✅ Fazer push para GitHub
4. ✅ Conectar Vercel
5. ✅ Deploy! 🚀

---

**Documentação Supabase:** https://supabase.com/docs  
**Status Page:** https://status.supabase.com  
**Support:** https://supabase.com/support  
