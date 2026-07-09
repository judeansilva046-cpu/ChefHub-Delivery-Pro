# 🚀 GUIA DE DEPLOY EM PRODUÇÃO

## ChefHub Delivery Pro® → Vercel + Supabase Cloud

---

## ✅ PRÉ-REQUISITOS

- [ ] Conta GitHub (para conectar Vercel)
- [ ] Conta Vercel (https://vercel.com)
- [ ] Conta Supabase (https://supabase.com)
- [ ] Projeto commitado no GitHub

---

## 📋 PASSO A PASSO

### **PASSO 1: Preparar Projeto para Deploy**

#### 1.1 - Verificar arquivos obrigatórios

```bash
# Certificar que existem:
✅ package.json
✅ tsconfig.json
✅ tailwind.config.ts
✅ next.config.ts
✅ .env.local.example (template de variáveis)
```

#### 1.2 - Criar `.env.local.example`

```bash
# Criar template de variáveis de ambiente
cat > .env.local.example << 'EOF'
# Supabase (obrigatório)
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=seu-anon-key-aqui

# Opcional (URL de produção)
NEXT_PUBLIC_APP_URL=https://seu-dominio.com
EOF
```

#### 1.3 - Verificar build

```bash
# Testar se projeto compila sem erros
npm run build

# Resultado esperado: .next/ folder criado
# Se houver erro TypeScript, corrigir antes de fazer commit
```

#### 1.4 - Commit e push para GitHub

```bash
git add .
git commit -m "chore: preparar para deploy em produção"
git push origin main
```

---

### **PASSO 2: Configurar Supabase Cloud**

#### 2.1 - Criar projeto Supabase

1. Ir para https://supabase.com
2. Clicar em "New Project"
3. Preencher:
   - **Name:** ChefHub Delivery Pro
   - **Region:** Brazil (São Paulo) - `sa-east-1`
   - **Database password:** Guardar em local seguro
4. Criar projeto (leva ~2 min)

#### 2.2 - Executar migrations

1. Copiar conteúdo de `supabase/migrations/001_init_schema.sql`
2. No Supabase Studio → SQL Editor
3. Clicar em "New Query"
4. Colar e executar o SQL completo
5. Aguardar conclusão (tabelas, RLS, triggers criados)

#### 2.3 - Copiar credenciais

No Supabase Studio → Settings → API:

```
Copiar e guardar:
- Project URL (NEXT_PUBLIC_SUPABASE_URL)
- anon public key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
```

---

### **PASSO 3: Deploy no Vercel**

#### 3.1 - Conectar GitHub

1. Ir para https://vercel.com/new
2. Clicar em "Continue with GitHub"
3. Autorizar Vercel
4. Selecionar repositório `ChefHub Delivery Pro`

#### 3.2 - Configurar variáveis de ambiente

No formulário do Vercel:

```
Environment Variables:

NEXT_PUBLIC_SUPABASE_URL = [copiar do Supabase]
NEXT_PUBLIC_SUPABASE_ANON_KEY = [copiar do Supabase]
NEXT_PUBLIC_APP_URL = https://seu-projeto.vercel.app (ou domínio custom)
```

#### 3.3 - Deploy

```
Clicar em "Deploy"
Aguardar build completar (~3-5 min)
```

#### 3.4 - Verificar status

```
Quando aparecer "Visit":
✅ Seu site está LIVE em produção!

URL: https://seu-projeto.vercel.app
```

---

### **PASSO 4: Testar em Produção**

#### 4.1 - Acessar o app

```
https://seu-projeto.vercel.app
```

#### 4.2 - Testar fluxo completo

- [ ] **Registro** → Criar nova conta
- [ ] **Login** → Fazer login com email/password
- [ ] **Ingredientes** → Criar ingrediente teste
- [ ] **Receitas** → Criar receita com ingrediente
- [ ] **Dashboard** → Ver dados em tempo real
- [ ] **Compras** → Calcular compra inteligente
- [ ] **Financeiro** → Registrar receita/despesa
- [ ] **Relatórios** → Gerar relatório

#### 4.3 - Verificar performance

```
Vercel Dashboard → Analytics:
✅ Response time
✅ Bandwidth
✅ Requests
```

---

## 🔐 Segurança em Produção

### **Checklist de Segurança**

- [ ] RLS policies ativas no Supabase
- [ ] Não commitou `.env.local` (está no `.gitignore`?)
- [ ] Credenciais Supabase seguras (usar Supabase Secrets)
- [ ] CORS configurado no Supabase
- [ ] Backups automáticos habilitados (Supabase Cloud)
- [ ] Monitoring ativado (Vercel + Supabase)

### **Ativar Backups Supabase**

1. Supabase Studio → Settings → Backups
2. Clicar em "Enable automatic backups"
3. Escolher frequência (recomendado: daily)

---

## 📊 Monitoramento em Produção

### **Verificar Logs**

```
Vercel Dashboard → Logs:
- Function logs (execução)
- Edge logs (performance)
- Build logs (deployment)
```

### **Alertas**

```
Vercel Settings → Alerts:
- Email on build failure
- Slack integration (opcional)
```

---

## 🎯 Próximos Passos Após Deploy

### **Imediatamente:**

1. ✅ Testar com dados reais
2. ✅ Convidar users beta para testar
3. ✅ Coletar feedback
4. ✅ Documentar bugs encontrados

### **Curto Prazo (1-2 semanas):**

1. Implementar features extras (Dark Mode, Notificações)
2. Otimizar performance
3. Adicionar testes automatizados
4. Setup de analytics

### **Médio Prazo (1-3 meses):**

1. Lançamento público
2. Marketing e growth
3. Integração com outros sistemas
4. Escalabilidade

---

## 🆘 Troubleshooting

### **Erro: "Supabase connection failed"**

```
Solução:
1. Verificar NEXT_PUBLIC_SUPABASE_URL está correto
2. Verificar NEXT_PUBLIC_SUPABASE_ANON_KEY está correto
3. No Vercel: Settings → Environment Variables → redeploy
```

### **Erro: "RLS policy violation"**

```
Solução:
1. Verificar se usuário está autenticado
2. Verificar se empresa_id está correto
3. No Supabase: verificar RLS policies nas tabelas
```

### **Erro: "Build failed"**

```
Solução:
1. Verificar TypeScript errors: npm run type-check
2. Verificar Next.js warnings: npm run build
3. Fazer fix localmente, push para GitHub
4. Vercel fará rebuild automático
```

### **App lento em produção**

```
Solução:
1. Verificar queries no Supabase (usar slow query log)
2. Adicionar índices nas tabelas
3. Implementar caching no Vercel
4. Otimizar imagens
```

---

## 📈 Escalabilidade

### **Quando usuario crescer:**

#### Supabase:
```
- Aumentar connection pool
- Usar read replicas para queries pesadas
- Implementar caching com Redis
```

#### Vercel:
```
- Upgradar plano Pro (automatic scaling)
- Implementar Edge Caching
- CDN global já incluído
```

---

## ✨ Checklist Final

Antes de chamar "PRONTO PARA PRODUÇÃO":

- [ ] ✅ Código compilado sem erros
- [ ] ✅ Variáveis de ambiente configuradas
- [ ] ✅ Database migrations executadas
- [ ] ✅ RLS policies ativas
- [ ] ✅ Todas as páginas carregam
- [ ] ✅ Autenticação funciona
- [ ] ✅ CRUD completo testado
- [ ] ✅ Cálculos automáticos funcionam
- [ ] ✅ Gráficos carregam com dados
- [ ] ✅ Relatórios geram corretamente
- [ ] ✅ Performance aceitável
- [ ] ✅ Mobile responsivo

---

## 🎉 Status: PRONTO PARA PRODUÇÃO

```
ChefHub Delivery Pro® v1.0
Deployed on Vercel + Supabase Cloud
Ready for users!
```

**URL:** https://seu-projeto.vercel.app  
**Admin:** judeansilva046@gmail.com  
**Data de deploy:** [data]  
**Status:** ✅ ONLINE

---

## 📞 Suporte

Se precisar fazer changes depois do deploy:

```bash
# 1. Fazer change local
# 2. Testar: npm run dev
# 3. Commit e push: git push origin main
# 4. Vercel rebuilda automaticamente
# 5. Verificar em https://seu-projeto.vercel.app
```

Não precisa fazer deploy manual – Vercel monitora o GitHub!

---

**Desenvolvido por:** Claude Agent  
**Projeto:** ChefHub Delivery Pro® v1.0  
**Stack:** Next.js 15 + Supabase + Vercel  
**Licença:** MIT  
