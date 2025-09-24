# TP2 - Plataforma de Cursos Online con Docker

## 📋 Descripción
Aplicación web containerizada para gestión de cursos online con funcionalidades de autenticación, creación de cursos, y chat en tiempo real. Esta implementación permite desplegar simultáneamente entornos de **QA** y **PRODUCCIÓN** usando la misma imagen Docker pero con configuraciones diferentes.

## 🛠 Tecnologías
- **Backend**: Go 1.18 (Gin framework)
- **Frontend**: React 18 (Create React App)
- **Base de datos**: MySQL 8.0
- **Contenerización**: Docker & Docker Compose
- **Registro de imágenes**: Docker Hub

## 📁 Estructura del proyecto
```
├── backend/                    # API REST en Go
│   ├── Dockerfile             # Imagen Docker del backend
│   ├── main.go               # Punto de entrada
│   └── ...
├── frontend/                  # Aplicación React
│   ├── Dockerfile            # Imagen Docker del frontend
│   ├── Environments/         # Configuraciones de entorno
│   └── ...
├── docker-compose.yml        # Configuración básica
├── docker-compose.qa-prod.yml # QA y PROD simultáneos
├── .env.qa                   # Variables de entorno QA
├── .env.prod                 # Variables de entorno PROD
├── init-db.sql              # Inicialización de base de datos
├── install-tp2.sh           # Script de instalación automatizada
├── deploy-qa.sh             # Script para desplegar solo QA
├── deploy-prod.sh           # Script para desplegar solo PROD
└── check-status.sh          # Script para verificar estado
```

## 🚀 **Instalación Rápida (Una Línea)**

### **Para instalar en cualquier computadora con Docker:**

```bash
curl -sSL https://raw.githubusercontent.com/ArnonNahmias/INGSOFT3/main/TP2/install-remote.sh | bash
```

**Este comando:**
- ✅ Verifica que Docker esté instalado y corriendo
- 📦 Descarga automáticamente la configuración desde GitHub
- 🚀 Despliega QA y PROD simultáneamente
- 🌐 Deja todo listo para usar en http://localhost:3001 (QA) y http://localhost:3002 (PROD)

---

## 🖥️ **Instalación Local (Con Código Fuente)**

### Opción 1: Instalación Automatizada (Recomendada)
```bash
# Dar permisos de ejecución al script
chmod +x install-tp2.sh

# Ejecutar instalación completa
./install-tp2.sh
```

El script ofrece 4 opciones:
1. **Instalación completa**: Construir, publicar en Docker Hub y desplegar
2. **Solo construir y desplegar localmente**: Sin publicar en Docker Hub
3. **Solo desplegar**: Usando imágenes existentes
4. **Limpiar y detener servicios**

### Opción 2: Comandos Manuales

#### Construir Imágenes
```bash
# Construir imagen del backend
docker build -t felipeganame/tp2-backend:dev ./backend
docker build -t felipeganame/tp2-backend:v1.0 ./backend

# Construir imagen del frontend
docker build -t felipeganame/tp2-frontend:dev ./frontend
docker build -t felipeganame/tp2-frontend:v1.0 ./frontend
```

#### Publicar en Docker Hub
```bash
# Login en Docker Hub
docker login

# Publicar imágenes
docker push felipeganame/tp2-backend:dev
docker push felipeganame/tp2-backend:v1.0
docker push felipeganame/tp2-frontend:dev
docker push felipeganame/tp2-frontend:v1.0
```

#### Desplegar QA y PROD
```bash
# Desplegar ambos entornos
export DOCKER_USERNAME=felipeganame
export IMAGE_TAG=dev
docker-compose -f docker-compose.qa-prod.yml up -d

# O desplegar solo QA
./deploy-qa.sh

# O desplegar solo PROD
./deploy-prod.sh
```

## 🌐 URLs de Acceso

### Entorno QA
- **Frontend QA**: http://localhost:3001
- **Backend QA**: http://localhost:8081
- **MySQL QA**: localhost:3307

### Entorno PRODUCCIÓN
- **Frontend PROD**: http://localhost:3002
- **Backend PROD**: http://localhost:8082
- **MySQL PROD**: localhost:3308

## 🗄️ Configuración de Base de Datos

### Credenciales QA
- **Host**: localhost:3307
- **Usuario**: appuser
- **Contraseña**: apppass123
- **Base de datos**: courses_qa

### Credenciales PRODUCCIÓN
- **Host**: localhost:3308
- **Usuario**: appuser
- **Contraseña**: apppass123
- **Base de datos**: courses_prod

## 📊 Monitoreo y Estado

### Verificar Estado de Servicios
```bash
# Verificar estado completo
./check-status.sh

# Ver logs de QA
docker-compose -f docker-compose.qa-prod.yml logs backend-qa

# Ver logs de PROD
docker-compose -f docker-compose.qa-prod.yml logs backend-prod

# Estado de contenedores
docker-compose -f docker-compose.qa-prod.yml ps
```

### Detener Servicios
```bash
# Detener todos los servicios
docker-compose -f docker-compose.qa-prod.yml down

# Detener y limpiar volúmenes
docker-compose -f docker-compose.qa-prod.yml down -v

# Detener solo QA
docker-compose -f docker-compose.qa-prod.yml stop backend-qa frontend-qa db-qa

# Detener solo PROD
docker-compose -f docker-compose.qa-prod.yml stop backend-prod frontend-prod db-prod
```

## 🔧 Variables de Entorno

### Variables Principales (.env.qa y .env.prod)
- `APP_ENV`: Entorno de la aplicación (qa/production)
- `DB_HOST`: Host de la base de datos
- `DB_PORT`: Puerto de la base de datos
- `DB_USER`: Usuario de la base de datos
- `DB_PASSWORD`: Contraseña de la base de datos
- `DB_NAME`: Nombre de la base de datos
- `GIN_MODE`: Modo del framework Gin (debug/release)
- `LOG_LEVEL`: Nivel de logging
- `DOCKER_USERNAME`: Usuario de Docker Hub
- `IMAGE_TAG`: Tag de la imagen a utilizar

### Diferencias entre QA y PROD
| Variable | QA | PROD |
|----------|-------|------|
| `GIN_MODE` | debug | release |
| `LOG_LEVEL` | debug | info |
| `ENABLE_TEST_ROUTES` | true | false |
| `DEBUG_QUERIES` | true | false |
| `DB_NAME` | courses_qa | courses_prod |

## 🏗️ Arquitectura Docker

### Imágenes y Tags
- **`:dev`** → Imágenes para QA y desarrollo
- **`:v1.0`** → Imágenes para producción

### Volúmenes Persistentes
- `courses-qa-db`: Datos de MySQL QA
- `courses-prod-db`: Datos de MySQL PROD
- `courses-qa-uploads`: Archivos subidos en QA
- `courses-prod-uploads`: Archivos subidos en PROD

### Redes Docker
- `courses-qa-network`: Red aislada para QA
- `courses-prod-network`: Red aislada para PROD

## 🔍 API Endpoints
- `GET /courses` - Listar cursos
- `POST /courses` - Crear curso
- `POST /register` - Registrar usuario
- `POST /login` - Iniciar sesión
- `GET /subscriptions` - Ver suscripciones
- `GET /health` - Health check del servicio

## 🐛 Resolución de Problemas

### Problemas Comunes
1. **Servicios no responden**: Esperar ~30 segundos después del despliegue
2. **Error de conectividad DB**: Verificar que los contenedores de DB estén running
3. **Conflicto de puertos**: Verificar que los puertos no estén ocupados
4. **Imágenes no encontradas**: Verificar variables DOCKER_USERNAME e IMAGE_TAG

### Logs Útiles
```bash
# Ver logs de inicialización de DB
docker-compose -f docker-compose.qa-prod.yml logs db-qa
docker-compose -f docker-compose.qa-prod.yml logs db-prod

# Ver logs de aplicación
docker-compose -f docker-compose.qa-prod.yml logs -f backend-qa
docker-compose -f docker-compose.qa-prod.yml logs -f backend-prod
```

## 📈 Desarrollo y Testing

### Desarrollo Local
Para desarrollo sin Docker, consultar documentación específica de cada componente.

### Testing
Los entornos QA y PROD permiten:
- Probar features en QA antes de desplegar a PROD
- Comparar comportamiento entre entornos
- Validar configuraciones específicas por entorno
- Simular deploys de producción

## 📝 Evidencia de Funcionamiento
- ✅ QA y PROD ejecutándose simultáneamente en puertos diferentes
- ✅ Bases de datos separadas con persistencia
- ✅ Misma imagen Docker con configuraciones diferentes
- ✅ Variables de entorno diferenciando comportamiento
- ✅ Imágenes publicadas en Docker Hub con versionado