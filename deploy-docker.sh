#!/bin/bash

# 🐳 Script Helper para Deploy com Docker
# Este script facilita o deploy do projeto via Docker

set -e

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configurações
VPS_USER="${VPS_USER:-usuario}"
VPS_HOST="${VPS_HOST:-easypanel.ronnysenna.com.br}"
VPS_PATH="${VPS_PATH:-/home/$VPS_USER/apps/cha-frauda}"
LOCAL_PATH="$(pwd)"

echo -e "${BLUE}🐳 DEPLOY COM DOCKER - Chá de Fraldas${NC}"
echo ""

# Menu
show_menu() {
    echo -e "${YELLOW}O que você deseja fazer?${NC}"
    echo "1) Enviar arquivos para VPS"
    echo "2) Iniciar containers (docker-compose up -d)"
    echo "3) Ver status dos containers"
    echo "4) Ver logs"
    echo "5) Parar containers"
    echo "6) Fazer backup do banco"
    echo "7) Restaurar backup"
    echo "8) Deploy completo (1 + 2 + 3)"
    echo "9) Sair"
    echo ""
    read -p "Escolha uma opção (1-9): " choice
}

# 1. Enviar arquivos
deploy_files() {
    echo -e "${YELLOW}📤 Enviando arquivos para VPS...${NC}"
    
    # Verificar se SSH está acessível
    if ! ssh -o ConnectTimeout=5 "$VPS_USER@$VPS_HOST" "echo ✅ SSH acessível" > /dev/null 2>&1; then
        echo -e "${RED}❌ Não consegui conectar via SSH${NC}"
        echo "Verifique:"
        echo "  - VPS_USER: $VPS_USER"
        echo "  - VPS_HOST: $VPS_HOST"
        echo "  - Chave SSH ou senha está correta?"
        return 1
    fi
    
    # Criar pasta no servidor
    ssh "$VPS_USER@$VPS_HOST" "mkdir -p $VPS_PATH" && \
        echo -e "${GREEN}✅ Pasta criada${NC}"
    
    # Enviar arquivos
    rsync -avz \
        --exclude='.git' \
        --exclude='node_modules' \
        --exclude='.DS_Store' \
        --exclude='*.log' \
        --exclude='.env' \
        "$LOCAL_PATH/" "$VPS_USER@$VPS_HOST:$VPS_PATH/" && \
        echo -e "${GREEN}✅ Arquivos enviados${NC}" || \
        { echo -e "${RED}❌ Erro no envio${NC}"; return 1; }
    
    echo -e "${GREEN}✅ Deploy de arquivos concluído${NC}"
}

# 2. Iniciar containers
start_containers() {
    echo -e "${YELLOW}🚀 Iniciando containers...${NC}"
    
    ssh "$VPS_USER@$VPS_HOST" << 'EOSSH'
        cd /home/$USER/apps/cha-frauda
        echo "🔨 Construindo imagens Docker..."
        docker-compose build
        echo "🚀 Iniciando containers..."
        docker-compose up -d
        echo "✅ Containers iniciados!"
        docker-compose ps
EOSSH
    
    echo -e "${GREEN}✅ Containers iniciados${NC}"
}

# 3. Ver status
show_status() {
    echo -e "${YELLOW}📊 Status dos containers:${NC}"
    ssh "$VPS_USER@$VPS_HOST" "cd $VPS_PATH && docker-compose ps"
    
    echo ""
    echo -e "${YELLOW}🧪 Testando API:${NC}"
    ssh "$VPS_USER@$VPS_HOST" "curl -s http://localhost:3000/api/stats | head -20"
}

# 4. Ver logs
show_logs() {
    echo -e "${YELLOW}📋 Qual container você quer ver os logs?${NC}"
    echo "1) API (backend)"
    echo "2) Postgres (banco de dados)"
    echo "3) Nginx (web server)"
    echo "4) Todos"
    read -p "Escolha (1-4): " log_choice
    
    case $log_choice in
        1)
            ssh "$VPS_USER@$VPS_HOST" "cd $VPS_PATH && docker-compose logs -f api"
            ;;
        2)
            ssh "$VPS_USER@$VPS_HOST" "cd $VPS_PATH && docker-compose logs -f postgres"
            ;;
        3)
            ssh "$VPS_USER@$VPS_HOST" "cd $VPS_PATH && docker-compose logs -f nginx"
            ;;
        4)
            ssh "$VPS_USER@$VPS_HOST" "cd $VPS_PATH && docker-compose logs -f"
            ;;
        *)
            echo -e "${RED}Opção inválida${NC}"
            ;;
    esac
}

# 5. Parar containers
stop_containers() {
    echo -e "${YELLOW}⛔ Parando containers...${NC}"
    ssh "$VPS_USER@$VPS_HOST" "cd $VPS_PATH && docker-compose stop" && \
        echo -e "${GREEN}✅ Containers parados${NC}"
}

# 6. Fazer backup
backup_database() {
    echo -e "${YELLOW}💾 Fazendo backup do banco...${NC}"
    
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    
    ssh "$VPS_USER@$VPS_HOST" << EOSSH
        cd $VPS_PATH
        mkdir -p backups
        docker exec cha-frauda-postgres pg_dump -U chafrauda -d chafrauda > backups/chafrauda_$TIMESTAMP.sql
        echo "✅ Backup criado: chafrauda_$TIMESTAMP.sql"
        ls -lh backups/ | tail -5
EOSSH
    
    echo -e "${GREEN}✅ Backup concluído${NC}"
    
    # Perguntar se quer baixar
    read -p "Deseja baixar o backup para seu computador? (s/n): " download_choice
    if [ "$download_choice" == "s" ] || [ "$download_choice" == "S" ]; then
        echo -e "${YELLOW}📥 Baixando backup...${NC}"
        mkdir -p "$LOCAL_PATH/backups"
        scp "$VPS_USER@$VPS_HOST:$VPS_PATH/backups/chafrauda_$TIMESTAMP.sql" "$LOCAL_PATH/backups/" && \
            echo -e "${GREEN}✅ Backup baixado${NC}"
    fi
}

# 7. Restaurar backup
restore_backup() {
    echo -e "${YELLOW}🔄 Restaurar backup do banco${NC}"
    echo -e "${RED}⚠️  CUIDADO! Isto vai sobrescrever os dados atuais!${NC}"
    read -p "Tem certeza? Digite 'SIM' para continuar: " confirm
    
    if [ "$confirm" != "SIM" ]; then
        echo "Operação cancelada"
        return
    fi
    
    echo -e "${YELLOW}Qual backup você quer restaurar?${NC}"
    ssh "$VPS_USER@$VPS_HOST" "cd $VPS_PATH && ls -lh backups/"
    
    read -p "Nome do arquivo (ex: chafrauda_20240115_120000.sql): " backup_file
    
    ssh "$VPS_USER@$VPS_HOST" << EOSSH
        cd $VPS_PATH
        echo "🔄 Restaurando $backup_file..."
        docker-compose exec -T postgres psql -U chafrauda -d chafrauda < backups/$backup_file
        echo "✅ Backup restaurado!"
EOSSH
}

# 8. Deploy completo
complete_deploy() {
    echo -e "${BLUE}🐳 Executando deploy completo${NC}"
    deploy_files && sleep 2
    start_containers && sleep 5
    show_status
}

# Main loop
while true; do
    echo ""
    show_menu
    
    case $choice in
        1) deploy_files ;;
        2) start_containers ;;
        3) show_status ;;
        4) show_logs ;;
        5) stop_containers ;;
        6) backup_database ;;
        7) restore_backup ;;
        8) complete_deploy ;;
        9) 
            echo -e "${GREEN}Até logo! 👋${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}❌ Opção inválida${NC}"
            ;;
    esac
done
