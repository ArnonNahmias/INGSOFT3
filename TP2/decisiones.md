# Decisiones Técnicas - TP2 Containerización

## 1. Elección y preparación de la aplicación

### Aplicación elegida
**Plataforma de Cursos Online** - Aplicación web con frontend React y backend Go (Gin)

### Justificación
- **Arquitectura real**: Frontend SPA + API REST + Base de datos
- **Tecnologías modernas**: React para UI, Go para alta performance en backend
- **Complejidad adecuada**: Suficientemente compleja para demostrar containerización, pero manejable
- **Casos de uso reales**: Autenticación, CRUD, chat, upload de archivos

### Configuración del entorno
- **Repositorio GitHub**: https://github.com/ArnonNahmias/INGSOFT3
- **Estructura**: Separación clara entre `/backend` y `/frontend`
- **Control de versiones**: Git con estructura organizada por funcionalidades

---

## 2. Construcción de imágenes personalizadas

### Backend (Go)
**Dockerfile**: Multi-stage build con `golang:1.18` y `ubuntu:latest`

```dockerfile
# Etapa de construcción
FROM golang:1.18 AS builder
# ... compilación
# Etapa de ejecución
FROM ubuntu:latest
```

**Justificaciones:**
- **Multi-stage build**: Reduce tamaño final eliminando herramientas de compilación
- **golang:1.18**: Imagen oficial con todas las herramientas Go necesarias
- **ubuntu:latest**: Base liviana para ejecución, incluye ca-certificates para HTTPS
- **wait-for-it.sh**: Asegura que MySQL esté listo antes de iniciar la aplicación

### Frontend (React)
**Dockerfile**: Multi-stage build con `node:16` y `nginx:alpine`

```dockerfile
FROM node:16 AS builder
# ... build de React
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
```

**Justificaciones:**
- **node:16**: Versión estable de Node.js compatible con las dependencias
- **nginx:alpine**: Servidor web ligero (5MB vs 100MB+) y optimizado para producción
- **Build estático**: React se compila a archivos estáticos servidos por Nginx
- **Multi-stage**: Imagen final solo contiene archivos compilados, no código fuente

### Etiquetado
**Convención**: `felipeganame/tp2-[servicio]:[version]`
- **Usuario**: `felipeganame` (cuenta Docker Hub)
- **Proyecto**: `tp2-` prefix para identificar el trabajo práctico
- **Versión**: `1.0` semántico versionado

---

## 3. Publicación en Docker Hub

### Estrategia de versionado
**Semantic Versioning (SemVer)**: `MAJOR.MINOR.PATCH`

- **1.0**: Versión inicial estable
- **Futuras versiones**:
  - `1.1.0`: Nuevas funcionalidades
  - `1.0.1`: Bug fixes
  - `2.0.0`: Breaking changes

**Tags utilizados:**
- `latest`: Última versión estable (automática)
- `1.0`: Versión específica para reproducibilidad

### Imágenes publicadas
- **Backend**: `felipeganame/tp2-backend:1.0`
- **Frontend**: `felipeganame/tp2-frontend:1.0`

---

## 4. Integración de base de datos

### Base de datos elegida: MySQL 5.7

**Justificaciones:**
- **Compatibilidad**: Ampliamente soportada y documentada
- **Performance**: Excelente para aplicaciones web con lecturas frecuentes
- **Ecosistema**: Driver Go maduro y bien mantenido
- **Volúmenes**: Soporte nativo para persistencia

### Configuración de persistencia
```yaml
volumes:
  dbdata:/var/lib/mysql
```

**Ventajas:**
- **Persistencia**: Datos sobreviven al reinicio de contenedores
- **Performance**: Volúmenes Docker más rápidos que bind mounts
- **Portabilidad**: Funciona igual en cualquier host Docker

### Conectividad
- **Red interna**: `app-network` para comunicación entre contenedores
- **Variables de entorno**: Configuración flexible sin hardcoding
- **Health checks**: `wait-for-it.sh` asegura disponibilidad antes de conexión

---

## 5. Configuración QA y PROD

### Variables de entorno definidas

**Comunes:**
- `DB_HOST`: Host de base de datos
- `DB_PORT`: Puerto de base de datos (3306)
- `DB_USER`: Usuario de base de datos
- `DB_PASSWORD`: Contraseña (desde archivo .env)
- `DB_NAME`: Nombre de base de datos

**Específicas por entorno:**
- `GIN_MODE`: `debug` (QA) vs `release` (PROD)
- `LOG_LEVEL`: `debug` (QA) vs `info` (PROD)
- `DB_NAME`: `proyecto_qa` vs `proyecto_prod`

### Justificación de variables
- **Separación de concerns**: Configuración externa al código
- **Seguridad**: Credenciales en archivos .env (no en imagen)
- **Flexibilidad**: Misma imagen, diferentes configuraciones
- **Debugging**: Logs detallados en QA, optimizados en PROD

---

## 6. Docker Compose para entorno reproducible

### Estructura de archivos
- `docker-compose.yml`: Desarrollo (con build)
- `docker-compose.prod.yml`: Producción (solo imágenes)
- `docker-compose.qa-prod.yml`: QA y PROD simultáneos

### Garantías de reproducibilidad
1. **Imágenes específicas**: Tags fijos (no `latest`)
2. **Variables de entorno**: Configuración declarativa
3. **Volúmenes nombrados**: Estado persistente
4. **Red personalizada**: Aislamiento de tráfico
5. **Dependencias**: `depends_on` asegura orden de inicio

### Documentación
- **README.md**: Instrucciones para desarrolladores
- **DOCKER_INSTRUCTIONS.md**: Guía para usuarios finales
- **install.sh**: Script de instalación automática

---

## 7. Versionado y etiquetado

### Convención elegida
**Semantic Versioning + Git Tags**

```bash
# Crear tag en git
git tag -a v1.0 -m "Primera versión estable"

# Etiquetar imágenes Docker
docker tag felipeganame/tp2-backend:1.0 felipeganame/tp2-backend:v1.0
docker tag felipeganame/tp2-frontend:1.0 felipeganame/tp2-frontend:v1.0
```

### Beneficios
- **Trazabilidad**: Relación directa entre código y imagen
- **Rollback**: Fácil vuelta a versiones anteriores
- **CI/CD**: Integración con pipelines automáticos
- **Compliance**: Auditoría y reproducibilidad

---

## Decisiones arquitectónicas adicionales

### Seguridad
- **Multi-stage builds**: Reduce superficie de ataque
- **Variables de entorno**: Credenciales no hardcodeadas
- **Usuarios no-root**: (Pendiente implementar)
- **Image scanning**: (Recomendado para producción)

### Performance
- **Imágenes alpine**: Menor tamaño y tiempo de descarga
- **Build cache**: Docker layer caching para builds rápidos
- **Resource limits**: (Recomendado definir en producción)

### Monitoreo
- **Health checks**: Verificación automática de estado
- **Logs estructurados**: JSON para herramientas de monitoreo
- **Métricas**: (Recomendado añadir Prometheus/Grafana)

### Escalabilidad
- **Arquitectura stateless**: Backend sin estado local
- **Base de datos externa**: Separada de aplicación
- **Load balancing**: (Preparado para múltiples instancias)