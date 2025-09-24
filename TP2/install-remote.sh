#!/bin/bash

echo "=== TP2 Docker - Instalación Remota ==="
echo "🐳 Descargando e instalando aplicación de Felipe Ganame..."

# Verificar Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Instalar desde: https://docs.docker.com/"
    exit 1
fi

if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker no está ejecutándose. Iniciar Docker Desktop."
    exit 1
fi

echo "✅ Docker está funcionando correctamente"

# Crear directorio de trabajo
echo "📁 Creando directorio de trabajo..."
mkdir -p tp2-docker-remote && cd tp2-docker-remote

# Descargar archivos necesarios desde GitHub
echo "📥 Descargando configuración desde GitHub..."

GITHUB_USER="ArnonNahmias"
REPO_NAME="INGSOFT3"

curl -sSL -o docker-compose.yml "https://raw.githubusercontent.com/${GITHUB_USER}/${REPO_NAME}/main/TP2/docker-compose.qa-prod.yml"
curl -sSL -o .env.qa "https://raw.githubusercontent.com/${GITHUB_USER}/${REPO_NAME}/main/TP2/.env.qa"
curl -sSL -o .env.prod "https://raw.githubusercontent.com/${GITHUB_USER}/${REPO_NAME}/main/TP2/.env.prod"

# Verificar que se descargaron los archivos
if [[ ! -f "docker-compose.yml" ]]; then
    echo "❌ Error descargando docker-compose.yml"
    echo "   Verificar que el repositorio sea público en: https://github.com/${GITHUB_USER}/${REPO_NAME}"
    exit 1
fi

if [[ ! -f ".env.qa" ]]; then
    echo "❌ Error descargando .env.qa"
    exit 1
fi

if [[ ! -f ".env.prod" ]]; then
    echo "❌ Error descargando .env.prod"  
    exit 1
fi

echo "✅ Archivos descargados correctamente"

# Verificar docker-compose
if ! command -v docker-compose &> /dev/null; then
    echo "⚠️  docker-compose no encontrado, intentando con 'docker compose'"
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

# Desplegar servicios
echo "🚀 Desplegando servicios QA y PROD..."
echo "   (Esto puede tomar unos minutos la primera vez)"

# Descargar imágenes primero
echo "📦 Descargando imágenes de Docker Hub..."
docker pull felipeganame/tp2-backend:dev
docker pull felipeganame/tp2-backend:v1.0
docker pull felipeganame/tp2-frontend:dev
docker pull felipeganame/tp2-frontend:v1.0
docker pull mysql:8.0

# Levantar servicios
$DOCKER_COMPOSE -f docker-compose.yml up -d

# Esperar que los servicios estén listos
echo "⏳ Esperando que los servicios estén listos..."
echo "   - Iniciando bases de datos MySQL..."
sleep 20

echo "   - Esperando conexión a bases de datos..."
sleep 25

echo "   - Iniciando aplicaciones..."
sleep 15

# Verificar estado
echo "📋 Verificando estado de los contenedores..."
$DOCKER_COMPOSE -f docker-compose.yml ps

echo ""
echo "✅ ¡Instalación completada!"
echo ""
echo "🌐 URLs de acceso:"
echo "   📱 QA Frontend:    http://localhost:3001"
echo "   🔧 QA Backend:     http://localhost:8081/courses"
echo "   🗄️  QA Database:    localhost:3307"
echo ""
echo "   🚀 PROD Frontend:  http://localhost:3002" 
echo "   ⚙️  PROD Backend:   http://localhost:8082/courses"
echo "   🗄️  PROD Database:  localhost:3308"
echo ""
echo "📋 Comandos útiles:"
echo "   Ver logs QA:    $DOCKER_COMPOSE -f docker-compose.yml logs -f backend-qa frontend-qa"
echo "   Ver logs PROD:  $DOCKER_COMPOSE -f docker-compose.yml logs -f backend-prod frontend-prod"  
echo "   Detener todo:   $DOCKER_COMPOSE -f docker-compose.yml down"
echo "   Estado:         $DOCKER_COMPOSE -f docker-compose.yml ps"
echo ""
echo "🔍 Para verificar funcionamiento:"
echo "   curl http://localhost:8081/courses  # Backend QA"
echo "   curl http://localhost:8082/courses  # Backend PROD"
echo ""
echo "📁 Directorio de trabajo: $(pwd)"
echo "🧹 Para limpiar: cd .. && rm -rf tp2-docker-remote"