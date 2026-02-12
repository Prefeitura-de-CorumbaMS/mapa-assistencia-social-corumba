#!/bin/bash
# ============================================
# Script de Setup de Produção
# Mapa Assistência Social - Corumbá/MS
# ============================================

echo "🚀 Configurando Mapa Assistência Social em Produção..."
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Configurar Nginx
echo -e "${BLUE}📝 Passo 1: Configurando Nginx...${NC}"
sudo cp /dados/www/mapa_assistencia/nginx-mapasocial.conf /etc/nginx/sites-available/mapasocial.conf
sudo ln -sf /etc/nginx/sites-available/mapasocial.conf /etc/nginx/sites-enabled/
echo -e "${GREEN}✓ Configuração do Nginx copiada${NC}"

# 2. Testar configuração do Nginx
echo ""
echo -e "${BLUE}🔍 Passo 2: Testando configuração do Nginx...${NC}"
sudo nginx -t
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Configuração do Nginx válida${NC}"
else
    echo -e "${YELLOW}⚠ Erro na configuração do Nginx. Verifique e corrija antes de continuar.${NC}"
    exit 1
fi

# 3. Recarregar Nginx
echo ""
echo -e "${BLUE}🔄 Passo 3: Recarregando Nginx...${NC}"
sudo systemctl reload nginx
echo -e "${GREEN}✓ Nginx recarregado${NC}"

# 4. Instalar Certbot (se necessário)
echo ""
echo -e "${BLUE}🔐 Passo 4: Verificando Certbot...${NC}"
if ! command -v certbot &> /dev/null; then
    echo "Certbot não encontrado. Instalando..."
    sudo apt update
    sudo apt install certbot python3-certbot-nginx -y
    echo -e "${GREEN}✓ Certbot instalado${NC}"
else
    echo -e "${GREEN}✓ Certbot já está instalado${NC}"
fi

# 5. Obter certificado SSL
echo ""
echo -e "${BLUE}🔒 Passo 5: Obtendo certificado SSL...${NC}"
echo -e "${YELLOW}⚠ Certifique-se de que o DNS mapasocial.corumba.ms.gov.br está apontando para este servidor!${NC}"
echo ""
read -p "Deseja continuar com a obtenção do certificado SSL? (s/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
    sudo certbot --nginx -d mapasocial.corumba.ms.gov.br
    echo -e "${GREEN}✓ Certificado SSL configurado${NC}"
else
    echo -e "${YELLOW}⚠ Pulando configuração SSL. Execute manualmente:${NC}"
    echo "   sudo certbot --nginx -d mapasocial.corumba.ms.gov.br"
fi

# 6. Testar renovação automática
echo ""
echo -e "${BLUE}🔄 Passo 6: Testando renovação automática do SSL...${NC}"
sudo certbot renew --dry-run
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Renovação automática configurada${NC}"
fi

# 7. Status final
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Configuração concluída!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "📊 Status dos serviços:"
pm2 list | grep mapasocial
echo ""
echo "🌐 Acesse a aplicação em:"
echo "   https://mapasocial.corumba.ms.gov.br"
echo ""
echo "📝 Comandos úteis:"
echo "   pm2 status              - Ver status dos processos"
echo "   pm2 logs mapasocial-api - Ver logs da API"
echo "   pm2 logs mapasocial-web - Ver logs do Frontend"
echo "   pm2 restart all         - Reiniciar todos os processos"
echo ""
