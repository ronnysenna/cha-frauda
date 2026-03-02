#!/bin/bash

# 🚀 Script Automático de Deploy - Chá de Fraldas
# Este script faz upload automático do backend para a VPS

echo "🚀 Iniciando Deploy para VPS..."

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configurações
VPS_USER=${VPS_USER:-seu_usuario}
VPS_HOST=${VPS_HOST:-easypanel.ronnysenna.com.br}
VPS_PATH=${VPS_PATH:-/home/$VPS_USER/aplicacoes/cha-frauda-backend}
LOCAL_BACKEND_PATH="$(pwd)/backend"

echo -e "${YELLOW}📋 Configurações:${NC}"
echo "VPS Usuário: $VPS_USER"
echo "VPS Host: $VPS_HOST"
echo "Caminho VPS: $VPS_PATH"
echo "Caminho Local: $LOCAL_BACKEND_PATH"
echo ""

# Passo 1: Verificar se backend existe
if [ ! -d "$LOCAL_BACKEND_PATH" ]; then
    echo -e "${RED}❌ Pasta backend não encontrada!${NC}"
    echo "Caminho esperado: $LOCAL_BACKEND_PATH"
    exit 1
fi

echo -e "${GREEN}✅ Backend encontrado${NC}"

# Passo 2: Verificar se .env existe
if [ ! -f "$LOCAL_BACKEND_PATH/.env" ]; then
    echo -e "${YELLOW}⚠️  Arquivo .env não encontrado${NC}"
    echo "Criando .env..."
    cat > "$LOCAL_BACKEND_PATH/.env" << 'EOF'
DATABASE_URL=postgres://chafrauda:Ideal2015net@easypanel.ronnysenna.com.br:5420/chafrauda?sslmode=disable
PORT=3000
NODE_ENV=production
EOF
    echo -e "${GREEN}✅ .env criado${NC}"
fi

# Passo 3: Copiar arquivos para VPS
echo -e "${YELLOW}📤 Fazendo upload para VPS...${NC}"

ssh $VPS_USER@$VPS_HOST "mkdir -p $VPS_PATH" && echo -e "${GREEN}✅ Pasta criada${NC}"

# Excluir node_modules e .git
rsync -avz --exclude='node_modules' --exclude='.git' --exclude='.gitignore' \
    "$LOCAL_BACKEND_PATH/" "$VPS_USER@$VPS_HOST:$VPS_PATH/" && \
    echo -e "${GREEN}✅ Arquivos enviados${NC}" || \
    { echo -e "${RED}❌ Erro no upload${NC}"; exit 1; }

# Passo 4: Instalar dependências
echo -e "${YELLOW}📦 Instalando dependências...${NC}"
ssh $VPS_USER@$VPS_HOST "cd $VPS_PATH && npm install" && \
    echo -e "${GREEN}✅ Dependências instaladas${NC}" || \
    { echo -e "${RED}❌ Erro ao instalar dependências${NC}"; exit 1; }

# Passo 5: Verificar PM2
echo -e "${YELLOW}🔄 Verificando PM2...${NC}"
ssh $VPS_USER@$VPS_HOST "which pm2" > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️  PM2 não encontrado, instalando...${NC}"
    ssh $VPS_USER@$VPS_HOST "npm install -g pm2"
fi

# Passo 6: Iniciar com PM2
echo -e "${YELLOW}🚀 Iniciando servidor com PM2...${NC}"
ssh $VPS_USER@$VPS_HOST "cd $VPS_PATH && pm2 start server.js --name 'cha-frauda-api' || pm2 restart cha-frauda-api" && \
    echo -e "${GREEN}✅ Servidor iniciado${NC}" || \
    { echo -e "${RED}❌ Erro ao iniciar servidor${NC}"; exit 1; }

# Passo 7: Salvar configuração PM2
echo -e "${YELLOW}💾 Salvando configuração PM2...${NC}"
ssh $VPS_USER@$VPS_HOST "pm2 save"

# Passo 8: Testar conexão
echo -e "${YELLOW}🧪 Testando servidor...${NC}"
sleep 2
ssh $VPS_USER@$VPS_HOST "curl http://localhost:3000/api/stats" > /dev/null 2>&1 && \
    echo -e "${GREEN}✅ Servidor respondendo${NC}" || \
    echo -e "${YELLOW}⚠️  Aguarde alguns segundos para o servidor iniciar${NC}"

echo ""
echo -e "${GREEN}🎉 Deploy concluído com sucesso!${NC}"
echo ""
echo "📋 Próximos passos:"
echo "1. Verificar logs: ssh $VPS_USER@$VPS_HOST 'pm2 logs cha-frauda-api'"
echo "2. Ver status: ssh $VPS_USER@$VPS_HOST 'pm2 list'"
echo "3. Atualizar script-api.js com URL correta da API"
echo ""
echo "API está disponível em:"
echo "  http://$VPS_HOST:3000/api"
echo "  ou"
echo "  https://api.chafrauda.com.br/api (se Nginx configurado)"
