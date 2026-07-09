# Layout Principal - ChefHub Delivery Pro®

## Overview

O layout principal consiste em:
- **Sidebar**: Menu de navegação lateral
- **Top Navigation**: Barra superior com notificações e menu do usuário
- **Breadcrumbs**: Navegação por caminho
- **Main Content**: Área de conteúdo principal

## Componentes

### Sidebar (`components/layout/Sidebar.tsx`)

Menu lateral responsivo com:
- Logo e nome da empresa
- 8 itens de menu com ícones
- Colapso automático em desktop
- Menu móvel com overlay
- Indicador de rota ativa
- Badge para notificações

**Features:**
- Responsive: collapsa em desktop, overlay em mobile
- Persistência: salva estado em localStorage
- Ícones Lucide React
- Animações suaves
- Acessibilidade com ARIA labels

**Menu Items:**
1. Dashboard
2. Receitas
3. Ingredientes
4. Estoque
5. Compras
6. Financeiro
7. Relatórios
8. Configurações

### TopNav (`components/layout/TopNav.tsx`)

Barra superior sticky com:
- Notificação (sino com badge)
- Menu do usuário com dropdown
- Avatar com inicial do nome
- Logout button
- Informações do usuário

**Features:**
- Dropdown que fecha ao clicar fora
- Avatar dinâmico
- Responsivo (informações do usuário em desktop)
- Menu logout seguro

### Breadcrumbs (`components/layout/Breadcrumbs.tsx`)

Navegação por caminho com:
- Geração automática do pathname
- Links clicáveis
- Ícone de home
- Separadores (chevron)
- Customizável

**Features:**
- Automático: lê pathname e gera breadcrumbs
- Customizável: aceita array de items
- Não aparece em auth pages
- Responsive

### DashboardLayout (`components/layout/DashboardLayout.tsx`)

Wrapper que junta tudo:
- Proteção de rota
- Sidebar + TopNav + Breadcrumbs + Content
- Loading state
- Responsivo

## Hooks

### useSidebar (`lib/hooks/useSidebar.ts`)

Gerencia estado da sidebar:

```typescript
const { isOpen, isCollapsed, isMobile, toggle, collapse } = useSidebar()

// isOpen: boolean - Sidebar visível
// isCollapsed: boolean - Sidebar colapsada (desktop)
// isMobile: boolean - Detecta mobile
// toggle(): void - Abre/fecha sidebar
// collapse(): void - Collapsa/expande sidebar
```

**Features:**
- Persistência em localStorage
- Detecção automática de mobile
- Listener de resize

## Componentes UI

### Card

Sistema de cards reutilizáveis:

```typescript
<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
  </CardHeader>
  <CardContent>Conteúdo</CardContent>
  <CardFooter>Rodapé</CardFooter>
</Card>
```

Componentes:
- `Card` - Container principal
- `CardHeader` - Cabeçalho com borda
- `CardTitle` - Título
- `CardContent` - Conteúdo
- `CardDescription` - Descrição/texto menor
- `CardFooter` - Rodapé com borda

## Responsividade

### Desktop (md+)
- Sidebar 264px fixo ou colapsado (80px)
- TopNav sticky no topo
- Breadcrumbs abaixo de TopNav
- Conteúdo com padding

### Tablet (sm-md)
- Sidebar colapsado por padrão
- Ícones com tooltip no hover
- TopNav funcional

### Mobile (<sm)
- Sidebar como overlay/drawer
- Menu botão no canto (FAB)
- Overlay ao abrir sidebar
- Responsivo totalmente

## Uso em Páginas

### Template Básico

```typescript
'use client'

import { DashboardLayout } from '@/components/layout/DashboardLayout'

export default function MyPage() {
  return (
    <DashboardLayout breadcrumbs={[
      { label: 'Modulo', href: '/modulo' },
      { label: 'Página' }
    ]}>
      <div>
        {/* Seu conteúdo aqui */}
      </div>
    </DashboardLayout>
  )
}
```

### Com Cards

```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

<Card>
  <CardHeader>
    <CardTitle>Título do Card</CardTitle>
  </CardHeader>
  <CardContent>
    Conteúdo principal
  </CardContent>
</Card>
```

## Cores e Estilo

### Sidebar
- Background: `#0B1F3A` (chefhub-dark-blue)
- Active Item: `#FF6B00` (chefhub-orange)
- Hover: `#0F2D5C` (blue-800)
- Border: `#0F2D5C` (blue-900)

### TopNav
- Background: Branco
- Border: Cinza claro
- Shadow: Leve

### Cards
- Background: Branco
- Border: Cinza 200
- Shadow: Leve, aumenta no hover

## Acessibilidade

- ARIA labels em botões
- Navegação por teclado
- Ícones com títulos (tooltips)
- Contraste adequado
- Sem cores como única forma de indicação

## Performance

- Sidebar state em localStorage (não localStorage exceto estado da UI)
- Memoização de componentes
- Lazy loading de breadcrumbs
- Event listeners limpos

## Troubleshooting

### Sidebar não persiste
- Verifique localStorage no navegador
- Limpe cache/cookies se necessário

### Sidebar não aparece em mobile
- Verifique se `useSidebar` está funcionando
- Confirme que window.innerWidth está correto

### Breadcrumbs não aparecem
- Não aparecem em `/auth/*`
- Verifique pathname no app

### Menu do usuário não fecha
- Listener de click outside pode estar bloqueado
- Verifique z-index de outros elementos

## Próximas Features

- [ ] Collapse animation mais suave
- [ ] Keyboard shortcuts para abrir/fechar sidebar
- [ ] Dark mode
- [ ] Customização de menu items
- [ ] Search global
- [ ] Recent items na sidebar
