# ChefHub Delivery Pro® 

Plataforma SaaS especializada em gestão de restaurantes, dark kitchens, hamburguerias, pizzarias, cafeterias, marmitarias e operações de food service em geral.

## 🎯 Objetivo

Permitir que o gestor saiba rapidamente:
- Quanto custa cada receita
- Qual preço deve vender
- O que possui em estoque
- O que precisa comprar
- Se está tendo lucro ou prejuízo

## 🛠 Stack Tecnológico

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS, Shadcn UI
- **Backend:** Supabase (PostgreSQL)
- **Autenticação:** Supabase Auth
- **Hospedagem:** Vercel

## 📦 Instalação

### Pré-requisitos
- Node.js 18+
- npm ou pnpm
- Conta Supabase

### Passos

1. **Clone o repositório**
```bash
git clone <seu-repo>
cd "ChefHub Delivery Pro®"
```

2. **Instale as dependências**
```bash
npm install
# ou
pnpm install
```

3. **Configure variáveis de ambiente**
Copie `.env.local.example` para `.env.local` e preencha com suas credenciais do Supabase:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
```

4. **Configure o banco de dados**
Execute a migration SQL no Supabase:
- Acesse o Supabase console
- Vá para SQL Editor
- Cole o conteúdo de `supabase/migrations/001_init_schema.sql`
- Execute

5. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

6. **Acesse a aplicação**
Abra [http://localhost:3000](http://localhost:3000) no navegador

## 📁 Estrutura do Projeto

```
chefhub-delivery-pro/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # Layout raiz
│   ├── page.tsx              # Página inicial
│   └── globals.css           # CSS global
├── components/               # Componentes React reutilizáveis
├── lib/                       # Utilitários, hooks, clientes
│   ├── supabase/             # Cliente Supabase
│   └── hooks/                # Custom hooks
├── types/                     # TypeScript types
├── supabase/                  # Migrations SQL
│   └── migrations/           # Scripts de banco de dados
├── public/                    # Assets estáticos
├── .env.local                 # Variáveis de ambiente (local)
├── .eslintrc.json             # Configuração ESLint
├── tsconfig.json              # Configuração TypeScript
├── tailwind.config.ts         # Configuração Tailwind
├── postcss.config.mjs         # Configuração PostCSS
└── package.json               # Dependências do projeto
```

## 📋 Módulos em Desenvolvimento

### ✅ Etapa 1: Estrutura do Projeto (CONCLUÍDA)
- [x] Estrutura Next.js 15
- [x] Configuração TypeScript
- [x] Tailwind CSS setup
- [x] Supabase client
- [x] Types base
- [x] Banco de dados schema com RLS

### ⏳ Próximas Etapas
1. Autenticação (Login/Register)
2. Layout principal (Sidebar + Top nav)
3. Dashboard
4. Módulo de Ingredientes
5. Módulo de Receitas
6. Módulo de Estoque
7. Módulo de Compra Inteligente
8. Módulo de Financeiro
9. Módulo de Relatórios

## 🎨 Identidade Visual

- **Azul Escuro:** #0B1F3A
- **Laranja:** #FF6B00
- **Branco:** #FFFFFF
- **Cinza Claro:** #F5F5F5

## 📝 Notas Importantes

- Sem protótipos falsos
- Sem dados mockados
- Tudo com estrutura real
- Sistema pronto para produção
- Código limpo e escalável

## 🚀 Deploy

### Deploy no Vercel

1. Push seu código para GitHub
2. Conecte seu repositório no Vercel
3. Adicione as variáveis de ambiente
4. Deploy automático

```bash
# ou manualmente
vercel deploy
```

## 📞 Contato

Desenvolvido para ChefHub Delivery Pro®

## 📄 Licença

Proprietário
