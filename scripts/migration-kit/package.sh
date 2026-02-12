#!/bin/bash

# =====================================================
# Script de Empacotamento do Migration Kit
# =====================================================

set -e

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔═══════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     Migration Kit - Empacotador v1.0         ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════╝${NC}"
echo ""

# Verificar se está no diretório correto
if [ ! -f "install.sh" ]; then
    echo "❌ Erro: Execute este script do diretório migration-kit/"
    exit 1
fi

# Nome do arquivo
VERSION="1.0.0"
DATE=$(date +%Y%m%d)
FILENAME="migration-kit-v${VERSION}-${DATE}.tar.gz"

echo "📦 Preparando para empacotar..."
echo ""

# Contar arquivos
TOTAL_FILES=$(find . -type f | wc -l)
TOTAL_SIZE=$(du -sh . | awk '{print $1}')

echo "   Total de arquivos: $TOTAL_FILES"
echo "   Tamanho total: $TOTAL_SIZE"
echo ""

# Criar tarball
echo "🗜️  Compactando..."
cd ..
tar -czf "$FILENAME" \
    --exclude='migration-kit/.git' \
    --exclude='migration-kit/node_modules' \
    --exclude='migration-kit/package.sh' \
    migration-kit/

# Mover para o diretório migration-kit
mv "$FILENAME" migration-kit/
cd migration-kit

# Informações do arquivo
PACKAGE_SIZE=$(du -h "$FILENAME" | awk '{print $1}')

echo ""
echo -e "${GREEN}✓ Pacote criado com sucesso!${NC}"
echo ""
echo "📦 Arquivo: $FILENAME"
echo "📊 Tamanho: $PACKAGE_SIZE"
echo ""
echo "Para extrair em outro projeto:"
echo "  $ tar -xzf $FILENAME"
echo "  $ cd migration-kit"
echo "  $ ./install.sh"
echo ""
echo -e "${GREEN}Pronto para distribuição! 🚀${NC}"
echo ""
