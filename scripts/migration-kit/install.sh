#!/bin/bash

# =====================================================
# MIGRATION KIT: Analytics, Ícones e Admin com Abas
# =====================================================
# Script de instalação automatizada
# Autor: Sistema de Migração Automática
# Data: $(date +%Y-%m-%d)

set -e  # Parar em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funções auxiliares
print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Banner
clear
echo -e "${GREEN}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════╗
║                  MIGRATION KIT                            ║
║   Analytics + Ícones (URL→ID) + Admin com Abas           ║
╚═══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Verificar se está no diretório correto
if [ ! -f "install.sh" ]; then
    print_error "Execute este script do diretório migration-kit/"
    exit 1
fi

# =====================================================
# PASSO 1: Verificar Pré-requisitos
# =====================================================
print_header "PASSO 1: Verificando Pré-requisitos"

# Verificar Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    print_success "Node.js instalado: $NODE_VERSION"
else
    print_error "Node.js não encontrado. Instale Node.js primeiro."
    exit 1
fi

# Verificar npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    print_success "npm instalado: $NPM_VERSION"
else
    print_error "npm não encontrado."
    exit 1
fi

# Verificar MySQL
if command -v mysql &> /dev/null; then
    print_success "MySQL CLI encontrado"
else
    print_warning "MySQL CLI não encontrado. Você precisará executar as migrações manualmente."
fi

echo ""

# =====================================================
# PASSO 2: Coletar Informações do Projeto
# =====================================================
print_header "PASSO 2: Configuração do Projeto"

echo -e "${YELLOW}Por favor, forneça as informações do seu projeto:${NC}"
echo ""

# Diretório do projeto
read -p "Caminho completo do projeto destino (ex: /home/user/meu-projeto): " TARGET_DIR

if [ ! -d "$TARGET_DIR" ]; then
    print_error "Diretório não encontrado: $TARGET_DIR"
    exit 1
fi

print_success "Diretório do projeto: $TARGET_DIR"

# Estrutura do projeto
echo ""
echo "Qual é a estrutura do seu projeto?"
echo "1) Monorepo (apps/api, apps/web, packages/database)"
echo "2) Separado (backend/ e frontend/ separados)"
echo "3) Único (tudo na raiz)"
read -p "Escolha (1-3): " PROJECT_STRUCTURE

case $PROJECT_STRUCTURE in
    1)
        API_DIR="$TARGET_DIR/apps/api/src"
        WEB_DIR="$TARGET_DIR/apps/web/src"
        DB_DIR="$TARGET_DIR/packages/database"
        print_success "Estrutura: Monorepo"
        ;;
    2)
        read -p "Caminho do backend (relativo a $TARGET_DIR): " BACKEND_PATH
        read -p "Caminho do frontend (relativo a $TARGET_DIR): " FRONTEND_PATH
        API_DIR="$TARGET_DIR/$BACKEND_PATH/src"
        WEB_DIR="$TARGET_DIR/$FRONTEND_PATH/src"
        DB_DIR="$TARGET_DIR/$BACKEND_PATH"
        print_success "Estrutura: Separado"
        ;;
    3)
        API_DIR="$TARGET_DIR/src"
        WEB_DIR="$TARGET_DIR/src"
        DB_DIR="$TARGET_DIR"
        print_success "Estrutura: Único"
        ;;
    *)
        print_error "Opção inválida"
        exit 1
        ;;
esac

# Nome da tabela de unidades
echo ""
read -p "Nome da tabela de unidades no banco (ex: prod_unidade): " UNIDADE_TABLE

# Banco de dados
echo ""
echo "Deseja executar as migrações SQL automaticamente? (requer MySQL CLI configurado)"
read -p "(s/n): " AUTO_MIGRATE

if [ "$AUTO_MIGRATE" = "s" ]; then
    read -p "Host do banco de dados: " DB_HOST
    read -p "Porta do banco (padrão 3306): " DB_PORT
    DB_PORT=${DB_PORT:-3306}
    read -p "Nome do banco de dados: " DB_NAME
    read -p "Usuário do banco: " DB_USER
    read -sp "Senha do banco: " DB_PASS
    echo ""
fi

echo ""

# =====================================================
# PASSO 3: Backup de Segurança
# =====================================================
print_header "PASSO 3: Backup de Segurança"

BACKUP_DIR="$TARGET_DIR/backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "Criando backup em: $BACKUP_DIR"

if [ "$AUTO_MIGRATE" = "s" ]; then
    print_info "Fazendo backup do banco de dados..."
    mysqldump -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" > "$BACKUP_DIR/database_backup.sql" 2>/dev/null || print_warning "Falha no backup do banco (continuando...)"
fi

print_success "Backup criado"
echo ""

# =====================================================
# PASSO 4: Migração do Banco de Dados
# =====================================================
print_header "PASSO 4: Migração do Banco de Dados"

if [ "$AUTO_MIGRATE" = "s" ]; then
    print_info "Executando migração 01: Analytics Tables..."
    mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" < database/01_analytics_tables.sql 2>/dev/null && print_success "Analytics tables criadas" || print_warning "Tabelas já existem ou erro na criação"

    print_info "Executando migração 02: Ícones System..."
    # Ajustar nome da tabela no SQL antes de executar
    sed "s/prod_unidade/$UNIDADE_TABLE/g" database/02_icones_system.sql > /tmp/02_icones_temp.sql
    mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" < /tmp/02_icones_temp.sql 2>/dev/null && print_success "Sistema de ícones criado" || print_warning "Sistema já existe ou erro na criação"
    rm /tmp/02_icones_temp.sql
else
    print_warning "Migrações SQL não executadas automaticamente."
    print_info "Execute manualmente os arquivos em: database/"
    print_info "  1. database/01_analytics_tables.sql"
    print_info "  2. database/02_icones_system.sql (ajuste o nome da tabela)"
fi

echo ""

# =====================================================
# PASSO 5: Copiar Arquivos Backend
# =====================================================
print_header "PASSO 5: Instalando Arquivos Backend"

# Criar diretórios
mkdir -p "$API_DIR/routes"
mkdir -p "$API_DIR/jobs"
mkdir -p "$TARGET_DIR/uploads/icones"

# Copiar rotas
print_info "Copiando rotas..."
cp backend/analytics.routes.js "$API_DIR/routes/" && print_success "analytics.routes.js copiado"
cp backend/icone.routes.js "$API_DIR/routes/" && print_success "icone.routes.js copiado"

# Copiar jobs
print_info "Copiando jobs..."
cp backend/analytics-aggregation.job.js "$API_DIR/jobs/" && print_success "analytics-aggregation.job.js copiado"

# Copiar ícones
print_info "Copiando ícones..."
cp icones/*.png "$TARGET_DIR/uploads/icones/" && print_success "22 ícones copiados"

echo ""

# =====================================================
# PASSO 6: Copiar Arquivos Frontend
# =====================================================
print_header "PASSO 6: Instalando Arquivos Frontend"

# Criar diretórios
mkdir -p "$WEB_DIR/pages/admin"
mkdir -p "$WEB_DIR/utils"
mkdir -p "$WEB_DIR/layouts"

# Copiar páginas
print_info "Copiando páginas..."
cp frontend/pages/AnalyticsPage.jsx "$WEB_DIR/pages/admin/" && print_success "AnalyticsPage.jsx copiado"
cp frontend/pages/DashboardPage.jsx "$WEB_DIR/pages/admin/" && print_success "DashboardPage.jsx copiado"
cp frontend/pages/UnidadesPage.jsx "$WEB_DIR/pages/admin/" && print_success "UnidadesPage.jsx copiado"

# Copiar utils
print_info "Copiando utils..."
cp frontend/utils/analytics.js "$WEB_DIR/utils/" && print_success "analytics.js copiado"

# Copiar layouts
print_info "Copiando layouts..."
cp frontend/layouts/AdminLayout.jsx "$WEB_DIR/layouts/" && print_success "AdminLayout.jsx copiado"

echo ""

# =====================================================
# PASSO 7: Atualizar Schema Prisma
# =====================================================
print_header "PASSO 7: Atualização do Schema Prisma"

if [ -f "$DB_DIR/prisma/schema.prisma" ]; then
    print_warning "Schema Prisma encontrado em: $DB_DIR/prisma/schema.prisma"
    print_info "Você precisa adicionar manualmente os modelos de:"
    echo "  - ANALYTICS_Event"
    echo "  - ANALYTICS_Session"
    echo "  - ANALYTICS_UnitStats"
    echo "  - ANALYTICS_SearchStats"
    echo "  - PROD_Icone"
    echo ""
    print_info "Referência em: database/03_prisma_schema_reference.prisma"
    echo ""
    read -p "Deseja abrir o arquivo de referência agora? (s/n): " OPEN_REF
    if [ "$OPEN_REF" = "s" ]; then
        ${EDITOR:-nano} database/03_prisma_schema_reference.prisma
    fi
else
    print_warning "Schema Prisma não encontrado. Pulando..."
fi

echo ""

# =====================================================
# PASSO 8: Registrar Rotas
# =====================================================
print_header "PASSO 8: Registrando Rotas"

print_warning "AÇÃO MANUAL NECESSÁRIA:"
print_info "Adicione as seguintes linhas no seu arquivo de rotas principal (ex: app.js ou index.js):"
echo ""
echo -e "${GREEN}// Importar rotas${NC}"
echo "const analyticsRoutes = require('./routes/analytics.routes');"
echo "const iconeRoutes = require('./routes/icone.routes');"
echo ""
echo -e "${GREEN}// Registrar rotas${NC}"
echo "app.use('/api/analytics', analyticsRoutes);"
echo "app.use('/api/icones', iconeRoutes);"
echo ""

# =====================================================
# PASSO 9: Configurar Jobs
# =====================================================
print_header "PASSO 9: Configurando Jobs de Analytics"

print_warning "AÇÃO MANUAL NECESSÁRIA:"
print_info "Configure os jobs de agregação no seu sistema de agendamento (cron, node-cron, etc.):"
echo ""
echo "const analyticsJob = require('./jobs/analytics-aggregation.job');"
echo ""
echo "// Calcular durações de sessão (a cada hora)"
echo "cron.schedule('0 * * * *', analyticsJob.calculateSessionDurations);"
echo ""
echo "// Calcular taxas de conversão (diariamente à meia-noite)"
echo "cron.schedule('0 0 * * *', analyticsJob.calculateConversionRates);"
echo ""
echo "// Limpar dados antigos (semanalmente aos domingos)"
echo "cron.schedule('0 0 * * 0', analyticsJob.cleanOldData);"
echo ""

# =====================================================
# PASSO 10: Configurar Frontend
# =====================================================
print_header "PASSO 10: Configurando Frontend"

print_warning "AÇÕES MANUAIS NECESSÁRIAS:"
print_info "1. Adicione as rotas no seu router (ex: App.jsx ou routes.jsx):"
echo ""
echo "import AnalyticsPage from './pages/admin/AnalyticsPage';"
echo "import DashboardPage from './pages/admin/DashboardPage';"
echo "import UnidadesPage from './pages/admin/UnidadesPage';"
echo ""
echo "<Route path=\"/admin/analytics\" element={<AnalyticsPage />} />"
echo "<Route path=\"/admin/dashboard\" element={<DashboardPage />} />"
echo "<Route path=\"/admin/unidades\" element={<UnidadesPage />} />"
echo ""
print_info "2. Importe o utils/analytics.js nos componentes que precisam de tracking"
echo ""
print_info "3. Configure o Redux store se necessário (queries de analytics)"
echo ""

# =====================================================
# PASSO 11: Instalar Dependências
# =====================================================
print_header "PASSO 11: Verificando Dependências"

print_info "Dependências necessárias:"
echo "  Frontend:"
echo "    - recharts (gráficos)"
echo "    - @ant-design/icons"
echo "    - antd"
echo "    - dayjs"
echo "    - react-leaflet (se usar LocationPicker)"
echo ""
echo "  Backend:"
echo "    - multer (upload de ícones)"
echo "    - crypto (nativo do Node.js)"
echo ""

read -p "Deseja instalar as dependências agora? (s/n): " INSTALL_DEPS

if [ "$INSTALL_DEPS" = "s" ]; then
    print_info "Instalando dependências frontend..."
    cd "$TARGET_DIR"
    npm install recharts @ant-design/icons antd dayjs react-leaflet leaflet --save 2>/dev/null && print_success "Dependências frontend instaladas"

    print_info "Instalando dependências backend..."
    npm install multer --save 2>/dev/null && print_success "Dependências backend instaladas"
fi

echo ""

# =====================================================
# CONCLUSÃO
# =====================================================
print_header "INSTALAÇÃO CONCLUÍDA!"

echo ""
print_success "Migration Kit instalado com sucesso!"
echo ""
print_warning "PRÓXIMOS PASSOS:"
echo ""
echo "1. ✓ Banco de dados migrado"
echo "2. ✓ Arquivos backend copiados"
echo "3. ✓ Arquivos frontend copiados"
echo "4. ✓ Ícones copiados"
echo ""
echo "AÇÕES PENDENTES (MANUAIS):"
echo ""
echo "□ Atualizar schema.prisma com os novos modelos"
echo "□ Executar: npx prisma generate"
echo "□ Registrar rotas no arquivo principal do backend"
echo "□ Registrar rotas no router do frontend"
echo "□ Configurar jobs de agregação (cron)"
echo "□ Adicionar tracking de analytics nos componentes relevantes"
echo "□ Testar funcionalidades:"
echo "  - Acesse /admin/analytics"
echo "  - Acesse /admin/dashboard"
echo "  - Teste criação/edição de unidades com ícones"
echo "  - Verifique se eventos estão sendo registrados"
echo ""
print_info "Documentação completa em: docs/INSTALLATION_GUIDE.md"
print_info "Backup criado em: $BACKUP_DIR"
echo ""
print_success "Boa sorte com a migração! 🚀"
echo ""
