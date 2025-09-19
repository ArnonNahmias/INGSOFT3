# 🔄 Ejecutar QA y PROD simultáneamente

Este archivo permite correr los entornos de QA y PROD al mismo tiempo usando la misma imagen pero con diferentes configuraciones.

## 🚀 Uso rápido

```bash
# Ejecutar ambos entornos
docker compose -f docker-compose.qa-prod.yml up -d

# Ver estado
docker compose -f docker-compose.qa-prod.yml ps

# Ver logs
docker compose -f docker-compose.qa-prod.yml logs -f
```

## 🌐 Acceso a las aplicaciones

### Entorno QA (Testing)
- **🖥️ Frontend QA:** http://localhost:81
- **🔧 Backend QA:** http://localhost:8081
- **🗄️ Base de datos QA:** localhost:3307

### Entorno PROD (Producción)
- **🖥️ Frontend PROD:** http://localhost:80
- **🔧 Backend PROD:** http://localhost:8080
- **🗄️ Base de datos PROD:** localhost:3306

## ⚙️ Diferencias entre entornos

| Configuración | QA | PROD |
|---------------|----|----- |
| **GIN_MODE** | `debug` | `release` |
| **LOG_LEVEL** | `debug` | `info` |
| **DB_NAME** | `proyecto_qa` | `proyecto_prod` |
| **Frontend Port** | `81` | `80` |
| **Backend Port** | `8081` | `8080` |
| **DB Port** | `3307` | `3306` |

## 📋 Comandos útiles

```bash
# Iniciar solo QA
docker compose -f docker-compose.qa-prod.yml up -d backend-qa frontend-qa db-qa

# Iniciar solo PROD
docker compose -f docker-compose.qa-prod.yml up -d backend-prod frontend-prod db-prod

# Ver logs específicos
docker compose -f docker-compose.qa-prod.yml logs backend-qa
docker compose -f docker-compose.qa-prod.yml logs backend-prod

# Parar todo
docker compose -f docker-compose.qa-prod.yml down

# Parar y eliminar volúmenes (⚠️ elimina datos)
docker compose -f docker-compose.qa-prod.yml down -v

# Actualizar imágenes
docker compose -f docker-compose.qa-prod.yml pull
docker compose -f docker-compose.qa-prod.yml up -d
```

## 🔧 Variables de entorno

Crear archivo `.env` en el directorio raíz:

```bash
DB_PASSWORD=58005800
```

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────┐
│                HOST MACHINE                     │
├─────────────────────────────────────────────────┤
│  QA ENVIRONMENT          │  PROD ENVIRONMENT    │
│                          │                      │
│  ┌─────────────────────┐ │ ┌─────────────────────┐│
│  │ Frontend QA (:81)   │ │ │ Frontend PROD (:80) ││
│  └─────────────────────┘ │ └─────────────────────┘│
│  ┌─────────────────────┐ │ ┌─────────────────────┐│
│  │ Backend QA (:8081)  │ │ │ Backend PROD (:8080)││
│  └─────────────────────┘ │ └─────────────────────┘│
│  ┌─────────────────────┐ │ ┌─────────────────────┐│
│  │ MySQL QA (:3307)    │ │ │ MySQL PROD (:3306)  ││
│  │ DB: proyecto_qa     │ │ │ DB: proyecto_prod   ││
│  └─────────────────────┘ │ └─────────────────────┘│
│                          │                      │
│  Network: qa-network     │ Network: prod-network│
└─────────────────────────────────────────────────┘
```

## 🎯 Casos de uso

### Testing paralelo
- **QA**: Pruebas con datos de testing, logs detallados
- **PROD**: Simulación de producción con datos reales

### Demostración
- Mostrar la misma aplicación funcionando en diferentes configuraciones
- Comparar performance entre modos debug y release

### Desarrollo
- QA para testing de features
- PROD para validación final antes de despliegue

## ⚠️ Consideraciones importantes

1. **Recursos**: Ejecutar ambos entornos consume más CPU y RAM
2. **Puertos**: Asegúrate de que los puertos no estén ocupados
3. **Base de datos**: Cada entorno tiene su propia base de datos aislada
4. **Logs**: Los logs de QA son más verbosos que los de PROD
5. **Performance**: PROD está optimizado, QA prioriza debugging