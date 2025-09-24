#!/bin/bash

# Script de instalación y despliegue automatizado para TP2 Docker
# Este script construye las imágenes, las publica en Docker Hub y despliega QA y PROD

set -e  # Salir si algún comando falla

echo "=== TP2 Docker - Script de Instalación Automatizado ==="
echo ""

# Variables de configuración
DOCKER_USERNAME="${DOCKER_USERNAME:-felipeganame}"
BACKEND_IMAGE="${DOCKER_USERNAME}/tp2-backend"
FRONTEND_IMAGE="${DOCKER_USERNAME}/tp2-frontend"
DEV_TAG="dev"
PROD_TAG="v1.0"

# Función para imprimir mensajes con formato
print_step() {
    echo ""
    echo "📋 $1"
    echo "----------------------------------------"
}

# Función para verificar que Docker está ejecutándose
check_docker() {
    if ! docker info >/dev/null 2>&1; then
        echo "❌ Error: Docker no está ejecutándose. Por favor inicia Docker Desktop."
        exit 1
    fi
    echo "✅ Docker está ejecutándose correctamente"
}

# Función para limpiar contenedores e imágenes existentes
cleanup_existing() {
    print_step "Limpiando contenedores e imágenes existentes"
    
    # Detener y remover contenedores existentes
    docker-compose -f docker-compose.qa-prod.yml down -v 2>/dev/null || true
    
    # Remover imágenes locales antiguas
    docker rmi ${BACKEND_IMAGE}:${DEV_TAG} 2>/dev/null || true
    docker rmi ${BACKEND_IMAGE}:${PROD_TAG} 2>/dev/null || true
    docker rmi ${FRONTEND_IMAGE}:${DEV_TAG} 2>/dev/null || true
    docker rmi ${FRONTEND_IMAGE}:${PROD_TAG} 2>/dev/null || true
    
    echo "✅ Limpieza completada"
}

# Función para construir imágenes
build_images() {
    print_step "Construyendo imágenes Docker"
    
    echo "🔨 Construyendo imagen del backend..."
    docker build -t ${BACKEND_IMAGE}:${DEV_TAG} ./backend
    docker build -t ${BACKEND_IMAGE}:${PROD_TAG} ./backend
    
    echo "🔨 Construyendo imagen del frontend..."
    docker build -t ${FRONTEND_IMAGE}:${DEV_TAG} ./frontend
    docker build -t ${FRONTEND_IMAGE}:${PROD_TAG} ./frontend
    
    echo "✅ Imágenes construidas exitosamente"
}

# Función para publicar imágenes en Docker Hub
push_images() {
    print_step "Publicando imágenes en Docker Hub"
    
    echo "📤 Haciendo login en Docker Hub..."
    docker login
    
    echo "📤 Subiendo imágenes del backend..."
    docker push ${BACKEND_IMAGE}:${DEV_TAG}
    docker push ${BACKEND_IMAGE}:${PROD_TAG}
    
    echo "📤 Subiendo imágenes del frontend..."
    docker push ${FRONTEND_IMAGE}:${DEV_TAG}
    docker push ${FRONTEND_IMAGE}:${PROD_TAG}
    
    echo "✅ Imágenes publicadas exitosamente en Docker Hub"
}

# Función para desplegar servicios
deploy_services() {
    print_step "Desplegando servicios QA y PROD"
    
    # Exportar variables de entorno para docker-compose
    export DOCKER_USERNAME=${DOCKER_USERNAME}
    export IMAGE_TAG=${DEV_TAG}
    
    echo "🚀 Iniciando servicios con docker-compose..."
    docker-compose -f docker-compose.qa-prod.yml up -d
    
    echo "⏳ Esperando que los servicios estén listos..."
    sleep 30
    
    echo "✅ Servicios desplegados exitosamente"
}

# Función para mostrar información de acceso
show_access_info() {
    print_step "Información de Acceso a los Servicios"
    
    echo "🌐 ENTORNO QA:"
    echo "   - Frontend QA: http://localhost:3001"
    echo "   - Backend QA:  http://localhost:8081"
    echo "   - MySQL QA:    localhost:3307 (usuario: appuser, contraseña: apppass123, db: courses_qa)"
    echo ""
    echo "🌐 ENTORNO PRODUCCIÓN:"
    echo "   - Frontend PROD: http://localhost:3002"
    echo "   - Backend PROD:  http://localhost:8082"
    echo "   - MySQL PROD:    localhost:3308 (usuario: appuser, contraseña: apppass123, db: courses_prod)"
    echo ""
    echo "📋 COMANDOS ÚTILES:"
    echo "   - Ver logs QA:   docker-compose -f docker-compose.qa-prod.yml logs backend-qa"
    echo "   - Ver logs PROD: docker-compose -f docker-compose.qa-prod.yml logs backend-prod"
    echo "   - Detener todo:  docker-compose -f docker-compose.qa-prod.yml down"
    echo "   - Estado:        docker-compose -f docker-compose.qa-prod.yml ps"
}

# Función para verificar el estado de los servicios
check_services() {
    print_step "Verificando estado de los servicios"
    
    echo "📊 Estado de los contenedores:"
    docker-compose -f docker-compose.qa-prod.yml ps
    
    echo ""
    echo "🔍 Verificando conectividad:"
    
    # Verificar backend QA
    if curl -f http://localhost:8081/ >/dev/null 2>&1; then
        echo "✅ Backend QA está respondiendo"
    else
        echo "⚠️  Backend QA no está respondiendo aún"
    fi
    
    # Verificar backend PROD
    if curl -f http://localhost:8082/ >/dev/null 2>&1; then
        echo "✅ Backend PROD está respondiendo"
    else
        echo "⚠️  Backend PROD no está respondiendo aún"
    fi
}

# Función principal
main() {
    echo "🐳 Iniciando proceso de instalación completa..."
    echo ""
    
    # Verificar prerrequisitos
    check_docker
    
    # Preguntar al usuario qué hacer
    echo ""
    echo "¿Qué deseas hacer?"
    echo "1) Instalación completa (limpiar, construir, publicar y desplegar)"
    echo "2) Solo construir y desplegar localmente"
    echo "3) Solo desplegar con imágenes existentes"
    echo "4) Solo limpiar y detener servicios"
    echo ""
    read -p "Selecciona una opción (1-4): " choice
    
    case $choice in
        1)
            cleanup_existing
            build_images
            push_images
            deploy_services
            show_access_info
            check_services
            ;;
        2)
            cleanup_existing
            build_images
            deploy_services
            show_access_info
            check_services
            ;;
        3)
            deploy_services
            show_access_info
            check_services
            ;;
        4)
            print_step "Deteniendo y limpiando servicios"
            docker-compose -f docker-compose.qa-prod.yml down -v
            cleanup_existing
            echo "✅ Limpieza completada"
            ;;
        *)
            echo "❌ Opción no válida"
            exit 1
            ;;
    esac
    
    echo ""
    echo "🎉 ¡Proceso completado exitosamente!"
}

# Ejecutar función principal
main "$@"