#!/bin/bash

# 🚀 ChefHub Delivery Pro® - Production Setup Script
# Script para preparar projeto para deploy

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║   ChefHub Delivery Pro® - Production Setup                ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check Node.js
echo -e "${BLUE}[1/6] Verificando Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}❌ Node.js não encontrado. Instale em https://nodejs.org${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node --version)${NC}"
echo ""

# Step 2: Check npm
echo -e "${BLUE}[2/6] Verificando npm...${NC}"
if ! command -v npm &> /dev/null; then
    echo -e "${YELLOW}❌ npm não encontrado${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm $(npm --version)${NC}"
echo ""

# Step 3: Install dependencies
echo -e "${BLUE}[3/6] Instalando dependências...${NC}"
if [ ! -d "node_modules" ]; then
    npm install
    echo -e "${GREEN}✅ Dependências instaladas${NC}"
else
    echo -e "${GREEN}✅ Dependências já instaladas${NC}"
fi
echo ""

# Step 4: Type check
echo -e "${BLUE}[4/6] Verificando TypeScript...${NC}"
if npm run type-check 2>/dev/null; then
    echo -e "${GREEN}✅ Sem erros TypeScript${NC}"
else
    echo -e "${YELLOW}⚠️ Existem erros TypeScript - verifique antes de fazer deploy${NC}"
fi
echo ""

# Step 5: Build
echo -e "${BLUE}[5/6] Fazendo build...${NC}"
if npm run build; then
    echo -e "${GREEN}✅ Build concluído com sucesso${NC}"
else
    echo -e "${YELLOW}❌ Build falhou - verifique os erros acima${NC}"
    exit 1
fi
echo ""

# Step 6: Create env template
echo -e "${BLUE}[6/6] Criando template de variáveis...${NC}"
if [ ! -f ".env.local.example" ]; then
    cat > .env.local.example << 'EOF'
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=seu-anon-key-aqui

# Application URL (OPTIONAL)
NEXT_PUBLIC_APP_URL=https://seu-dominio.com
EOF
    echo -e "${GREEN}✅ .env.local.example criado${NC}"
else
    echo -e "${GREEN}✅ .env.local.example já existe${NC}"
fi
echo ""

# Summary
echo "╔════════════════════════════════════════════════════════════╗"
echo -e "${GREEN}║   ✅ SETUP COMPLETO - Pronto para Deploy!         ║${NC}"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${YELLOW}Próximos passos:${NC}"
echo ""
echo "1. Criar projeto Supabase:"
echo "   https://supabase.com → New Project"
echo ""
echo "2. Executar migrations:"
echo "   Supabase Studio → SQL Editor"
echo "   Cole: supabase/migrations/001_init_schema.sql"
echo ""
echo "3. Copiar credenciais:"
echo "   Supabase Studio → Settings → API"
echo "   Copie: Project URL e anon public key"
echo ""
echo "4. Fazer push para GitHub:"
echo "   git add ."
echo "   git commit -m 'chore: preparar para deploy'"
echo "   git push origin main"
echo ""
echo "5. Deploy no Vercel:"
echo "   https://vercel.com/new"
echo "   Selecione repositório GitHub"
echo "   Adicione variáveis de ambiente"
echo "   Deploy!"
echo ""
echo -e "${GREEN}Mais detalhes em: DEPLOY_PRODUCAO.md${NC}"
