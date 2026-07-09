# Autenticação - ChefHub Delivery Pro®

## Overview

A autenticação é implementada usando **Supabase Auth** integrada com o banco PostgreSQL.

## Fluxo de Autenticação

### 1. Registro
```
Usuário preenche formulário → Validação → Cria usuário em auth.users (Supabase) → Cria registro em tabela usuarios → Redireciona para dashboard
```

### 2. Login
```
Usuário entra email/senha → Valida → Supabase Auth retorna session → Busca dados do usuário → Armazena em context → Redireciona para dashboard
```

### 3. Logout
```
Usuário clica em Sair → Supabase Auth limpa sessão → Context limpa dados → Redireciona para login
```

## Estrutura Técnica

### AuthContext (`lib/auth/AuthContext.tsx`)
- Gerencia estado de autenticação
- Fornece métodos: `login()`, `register()`, `logout()`
- Observa mudanças de sessão do Supabase
- Sincroniza dados do usuário

### useAuth Hook (`lib/hooks/useAuth.ts`)
- Hook para acessar contexto de autenticação
- Deve ser usado em componentes "use client"

### Middleware (`middleware.ts`)
- Protege rotas autenticadas
- Redireciona para login se não autenticado
- Redireciona para dashboard se já está autenticado em /auth/login

## Componentes

### LoginForm (`components/modules/auth/LoginForm.tsx`)
- Validação de email e senha
- Exibição de erros
- Integração com useAuth

### RegisterForm (`components/modules/auth/RegisterForm.tsx`)
- Validação de nome, email, senha, telefone
- Confirmação de senha
- Formatação de telefone
- Integração com useAuth

## Fluxo de Dados

```
AuthProvider (Root Layout)
    ↓
AuthContext (gerencia estado)
    ↓
useAuth (acesso em componentes)
    ↓
Componentes (LoginForm, RegisterForm, Dashboard)
```

## Segurança

### RLS (Row Level Security)
- Cada usuário só vê seus próprios dados
- Policies implementadas em todas as tabelas
- Baseado em `auth.uid()`

### Proteção de Rota
- Middleware verifica token Supabase
- Redireciona para login se não autenticado
- Cookie `sb-auth-token` armazenado automaticamente

### Validação
- Email: formato válido
- Senha: mínimo 8 caracteres
- Nome: mínimo 3 caracteres
- Telefone: formato válido (opcional)

## Tipos

### AuthUser
```typescript
interface AuthUser {
  id: string
  email: string
  nome: string
  telefone?: string
  data_criacao: string
  ativo: boolean
}
```

### LoginCredentials
```typescript
interface LoginCredentials {
  email: string
  password: string
}
```

### RegisterCredentials
```typescript
interface RegisterCredentials {
  email: string
  password: string
  confirmPassword: string
  nome: string
  telefone?: string
}
```

## Uso em Componentes

### Exemplo 1: Proteger Rota
```typescript
'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProtectedPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, isLoading, router])

  if (isLoading) return <div>Carregando...</div>

  return <div>Bem-vindo, {user?.nome}!</div>
}
```

### Exemplo 2: Fazer Logout
```typescript
const { logout } = useAuth()

const handleLogout = async () => {
  await logout()
  router.push('/auth/login')
}
```

### Exemplo 3: Acessar Dados do Usuário
```typescript
const { user, isAuthenticated } = useAuth()

if (isAuthenticated) {
  console.log('Email:', user?.email)
  console.log('Nome:', user?.nome)
}
```

## Variáveis de Ambiente Necessárias

```bash
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui
```

## Rotas de Autenticação

| Rota | Descrição | Autenticação Requerida |
|------|-----------|----------------------|
| `/auth/login` | Página de login | Não |
| `/auth/register` | Página de registro | Não |
| `/dashboard` | Dashboard principal | Sim |
| `/ingredientes` | Gerenciar ingredientes | Sim |
| `/receitas` | Gerenciar receitas | Sim |
| `/estoque` | Controlar estoque | Sim |
| `/compras` | Gerenciar compras | Sim |
| `/financeiro` | Controlar financeiro | Sim |
| `/relatorios` | Visualizar relatórios | Sim |

## Troubleshooting

### Erro: "useAuth deve ser usado dentro de <AuthProvider>"
- Certifique-se que o componente está dentro de um cliente ("use client")
- Verifique se AuthProvider está envolvendo o componente no layout

### Erro: "Supabase connection failed"
- Verifique variáveis de ambiente .env.local
- Confirme que projeto Supabase está ativo
- Teste connection no Supabase console

### Sessão perdida ao recarregar
- Supabase Auth armazena session em localStorage
- Middleware detecta e redireciona automaticamente
- Verifique se cookies estão ativados

## Próximas Features

- [ ] Recuperação de senha (forgot password)
- [ ] Autenticação com Google/GitHub
- [ ] Two-factor authentication (2FA)
- [ ] Profile page
- [ ] Edição de dados do usuário
