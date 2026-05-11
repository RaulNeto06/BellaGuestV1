#!/bin/bash
# 🚀 Script de Inicialização para Produção - BelaGuest V1

set -e

echo "════════════════════════════════════════════════"
echo "  BelaGuest API - Inicialização em Produção"
echo "════════════════════════════════════════════════"
echo ""

cd belaguest

# Opção 1: Docker Compose (Recomendado)
if command -v docker-compose &> /dev/null; then
    echo "🐳 Iniciando com Docker Compose..."
    docker-compose -f infra/docker-compose.yml up -d
    echo ""
    echo "✅ Containers iniciados!"
    echo "📍 API disponível em: http://localhost:3000"
    echo "🔌 WebSocket pronto em ws://localhost:3000"
    echo ""
    echo "Para ver os logs:"
    echo "  docker-compose -f infra/docker-compose.yml logs -f"
    echo ""
    echo "Para parar:"
    echo "  docker-compose -f infra/docker-compose.yml down"
else
    # Opção 2: Node.js Manual
    echo "📦 Instalando dependências..."
    npm install --production
    echo ""
    echo "🚀 Iniciando servidor..."
    npm start
fi
