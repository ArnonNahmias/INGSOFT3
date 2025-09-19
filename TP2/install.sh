#!/bin/bash

# 🎓 TP2 - Script de instalación automática
# Este script descarga y ejecuta la aplicación de cursos online

echo "🎓 TP2 - Plataforma de Cursos Online"
echo "====================================="
echo ""

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker no está instalado"
    echo "📥 Instala Docker desde: https://docker.com/get-started"
    exit 1
fi

# Verificar si Docker Compose está disponible
if ! docker compose version &> /dev/null; then
    echo "❌ Error: Docker Compose no está disponible"
    echo "📥 Instala Docker Compose desde: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker detectado correctamente"
echo ""

# Crear directorio para la aplicación
APP_DIR="tp2-cursos-online"
echo "📁 Creando directorio: $APP_DIR"
mkdir -p "$APP_DIR"
cd "$APP_DIR"

# Descargar configuración de producción
echo "⬇️  Descargando configuración de producción..."
curl -s -o docker-compose.yml https://raw.githubusercontent.com/ArnonNahmias/INGSOFT3/main/TP2/docker-compose.prod.yml

if [ $? -ne 0 ]; then
    echo "❌ Error al descargar docker-compose.yml"
    exit 1
fi

# Crear archivo .env
echo "🔑 Configurando variables de entorno..."
echo "DB_PASSWORD=58005800" > .env

# Ejecutar la aplicación
echo "🚀 Iniciando la aplicación..."
echo ""
docker compose up -d

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 ¡Aplicación iniciada exitosamente!"
    echo ""
    echo "🌐 Accede a la aplicación en:"
    echo "   👉 Frontend: http://localhost"
    echo "   👉 API:      http://localhost:8080"
    echo ""
    echo "📋 Comandos útiles:"
    echo "   • Ver estado:     docker compose ps"
    echo "   • Ver logs:       docker compose logs -f"
    echo "   • Parar app:      docker compose down"
    echo ""
    echo "📁 Ubicación: $(pwd)"
else
    echo "❌ Error al iniciar la aplicación"
    exit 1
fi