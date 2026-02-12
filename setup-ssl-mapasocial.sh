#!/bin/bash

# ============================================
# Script para configurar SSL no Mapa Social
# ============================================

echo "=========================================="
echo "Configuração SSL - Mapa Assistência Social"
echo "=========================================="
echo ""

# Verificar se está rodando como root
if [ "$EUID" -ne 0 ]; then
   echo "❌ Este script precisa ser executado como root (use sudo)"
   exit 1
fi

echo "📋 Domínio: mapasocial.corumba.ms.gov.br"
echo ""

# Verificar se certbot está instalado
if ! command -v certbot &> /dev/null; then
    echo "❌ Certbot não está instalado"
    echo "   Instale com: apt install certbot python3-certbot-nginx"
    exit 1
fi

# Gerar certificado SSL com Certbot
echo "🔐 Gerando certificado SSL..."
certbot certonly --nginx \
    -d mapasocial.corumba.ms.gov.br \
    --non-interactive \
    --agree-tos \
    --email ti@corumba.ms.gov.br

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Falha ao gerar certificado SSL"
    echo ""
    echo "Possíveis causas:"
    echo "1. O domínio mapasocial.corumba.ms.gov.br não está apontando para este servidor"
    echo "2. A porta 80 não está acessível publicamente"
    echo "3. Já existe um certificado válido"
    echo ""
    echo "Verifique e tente novamente."
    exit 1
fi

# Atualizar configuração do Nginx
echo ""
echo "📝 Atualizando configuração do Nginx..."

NGINX_CONF="/etc/nginx/sites-available/mapasocial.conf"

# Fazer backup da configuração atual
cp $NGINX_CONF ${NGINX_CONF}.backup.$(date +%Y%m%d_%H%M%S)

# Atualizar os caminhos dos certificados
sed -i 's|/etc/letsencrypt/live/mapareme.corumba.ms.gov.br/fullchain.pem|/etc/letsencrypt/live/mapasocial.corumba.ms.gov.br/fullchain.pem|g' $NGINX_CONF
sed -i 's|/etc/letsencrypt/live/mapareme.corumba.ms.gov.br/privkey.pem|/etc/letsencrypt/live/mapasocial.corumba.ms.gov.br/privkey.pem|g' $NGINX_CONF

# Testar configuração do Nginx
echo ""
echo "🧪 Testando configuração do Nginx..."
nginx -t

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Erro na configuração do Nginx"
    echo "   Restaurando backup..."
    mv ${NGINX_CONF}.backup.* $NGINX_CONF
    exit 1
fi

# Recarregar Nginx
echo ""
echo "🔄 Recarregando Nginx..."
systemctl reload nginx

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Erro ao recarregar Nginx"
    exit 1
fi

echo ""
echo "=========================================="
echo "✅ Certificado SSL configurado com sucesso!"
echo "=========================================="
echo ""
echo "🌐 Site: https://mapasocial.corumba.ms.gov.br"
echo "🔐 Certificado válido por 90 dias"
echo "📅 Renovação automática configurada"
echo ""
