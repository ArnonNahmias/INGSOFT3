# Decisiones Técnicas - Posts App con Azure DevOps

## 📋 Stack Elegido y Estructura del Repo

### Decisión: Mono-repo con Frontend y Backend Separados

**Opción elegida**: Estructura `/front` y `/back` en un único repositorio.

**Alternativas consideradas**:
- Repos separados para frontend y backend
- Integración completa en Next.js únicamente
- Microservicios con múltiples repos

**Justificación**:
✅ **Simplicidad de gestión**: Un solo repo para todo el proyecto
✅ **Pipeline unificado**: CI/CD coordinado entre frontend y backend
✅ **Versionado sincronizado**: Cambios frontend/backend en la misma versión
✅ **Flexibilidad de deployment**: Opción de deployar por separado o junto

### Stack Tecnológico

#### Frontend (Next.js 14)
- **Framework**: Next.js 14 con App Router
- **Lenguaje**: TypeScript 5
- **UI**: React 18 + Tailwind CSS + Shadcn/ui
- **Estado**: Context API + localStorage para JWT
- **Justificación**: 
  - SSR/SSG nativo
  - API Routes integradas (fallback)
  - Ecosystem maduro y bien documentado

#### Backend (Node.js + Express)
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Lenguaje**: TypeScript
- **Base de datos**: MySQL 2 (local)
- **Autenticación**: JWT + bcryptjs
- **Justificación**:
  - Consistencia de lenguaje (TS en ambos lados)
  - Ecosistema npm rico
  - Performance adecuada para el scope
  - MySQL local sin configuración compleja

## 🏗️ Diseño del Pipeline

### Decisión: YAML Pipeline Multi-Stage

**Opción elegida**: Azure DevOps YAML Pipeline con 3 stages.

**Alternativas consideradas**:
- Classic Build/Release Pipelines
- GitHub Actions
- Jenkins Pipeline

**Justificación**:
✅ **Infrastructure as Code**: Pipeline versionado con el código
✅ **Legibilidad**: YAML más legible que UI clicks
✅ **Reutilización**: Templates y variables reutilizables
✅ **Control de versión**: Cambios del pipeline trackeables
✅ **Portabilidad**: Más fácil migrar entre proyectos

### Estructura del Pipeline YAML

```yaml
Stages:
  1. CI (Continuous Integration)
     ├── Job: BuildFrontend
     │   ├── npm ci && npm run build
     │   └── Publish artifacts (.next)
     └── Job: BuildBackend
         ├── npm install && npm run build  
         └── Publish artifacts (dist)
  
  2. DatabaseSetup
     └── Job: VerifyDatabase
         └── Test MySQL connection
  
  3. HealthCheck
     └── Job: HealthCheck
         └── Verify all artifacts
```

### Decisión: Self-Hosted Agent

**Opción elegida**: Agente Self-Hosted en máquina local.

**Alternativas consideradas**:
- Microsoft-Hosted agents
- Azure Container Instances
- VM en Azure

**Justificación**:
✅ **Control total**: Control sobre el entorno de ejecución
✅ **Dependencias locales**: MySQL local disponible directamente
✅ **Costo**: Sin límites de minutos/mes
✅ **Debugging**: Acceso directo para troubleshooting
✅ **Personalización**: Instalación de herramientas específicas
✅ **Learning**: Mejor comprensión del proceso de CI/CD

**Desventajas consideradas**:
❌ Mantenimiento manual del agente
❌ Dependencia de hardware local
❌ Escalabilidad limitada

## 🔧 Decisiones de Arquitectura

### Patrón MVC en Backend

**Implementación**:
- **Models**: Interfaces TypeScript + validación Zod
- **Views**: JSON responses (API REST)
- **Controllers**: Lógica de endpoints y HTTP handling
- **Services**: Lógica de negocio y acceso a datos

**Justificación**:
- Separación clara de responsabilidades
- Testabilidad mejorada
- Mantenibilidad a largo plazo
- Escalabilidad del equipo

### Doble Arquitectura Frontend

**Decisión**: Frontend con API Routes + Backend Express separado.

**Justificación**:
- **Flexibilidad**: Opción de usar Next.js API o backend separado
- **Migración gradual**: Fácil migración entre arquitecturas
- **Learning**: Comparación de enfoques en el mismo proyecto
- **Deployment**: Opciones variadas de deployment

## 📊 Evidencias

### 1. Creación del Pool y Agente Self-Hosted

**Configuración requerida en Azure DevOps**:
1. Ir a `Project Settings` → `Agent pools`
2. Crear pool `SelfHosted`
3. Descargar agente para macOS
4. Registrar como `Agent-Local`
5. Instalar como servicio

**Comando de instalación** (macOS):
```bash
./config.sh --url https://dev.azure.com/[organization] --auth pat --token [token] --pool SelfHosted --agent Agent-Local --acceptTeeEula
sudo ./svc.sh install
sudo ./svc.sh start
```

### 2. Estructura del Repositorio

```bash
posts-app/
├── front/          # ✅ Frontend Next.js completo
├── back/           # ✅ Backend Express separado  
├── azure-pipelines.yml  # ✅ Pipeline YAML multi-stage
├── README.md       # ✅ Documentación completa
└── decisiones.md   # ✅ Este archivo
```

### 3. Pipeline Execution Flow

**Triggers configurados**:
- Push a `main` branch
- Cambios en `front/`, `back/`, `azure-pipelines.yml`

**Jobs ejecutados en paralelo**:
- `BuildFrontend`: Node.js setup → npm ci → build → artifacts
- `BuildBackend`: Node.js setup → npm install → build → artifacts

**Artifacts publicados**:
- `frontend-build` (.next directory)
- `frontend-static` (public assets) 
- `backend-build` (dist compiled JS)
- `backend-config` (package.json)

## 🎯 Ventajas del Enfoque Elegido

### YAML vs Classic Pipeline

**YAML Pipeline**:
✅ Versionado con código fuente
✅ Code reviews del pipeline
✅ Branching strategies aplicables
✅ Reutilización via templates
✅ Infraestructura como código

**Classic Pipeline**:
❌ Configuración via UI, no versionada
❌ Cambios no trackeables
❌ Difícil de replicar entre entornos

### Self-Hosted vs Microsoft-Hosted

**Self-Hosted Agent**:
✅ **Control completo**: Entorno customizable
✅ **Dependencias específicas**: MySQL local disponible
✅ **Persistencia**: Cache entre builds
✅ **No límites de tiempo**: Builds largos sin restricciones
✅ **Debugging local**: Acceso directo al agente

**Microsoft-Hosted**:
❌ Entorno limpio cada vez (no cache)
❌ Dependencias limitadas
❌ Límites de tiempo por build
❌ Sin acceso a recursos locales

## 🔮 Consideraciones Futuras

### Escalabilidad
- **Múltiples agentes**: Pool con varios agentes para paralelismo
- **Agent pools específicos**: Separar por ambiente (dev/staging/prod)
- **Container agents**: Migración a agentes en Docker

### Seguridad
- **Secrets management**: Azure Key Vault integration
- **RBAC**: Roles específicos por stage del pipeline
- **Security scanning**: Integración con herramientas de análisis

### Monitoring
- **Application Insights**: Telemetría del pipeline
- **Custom dashboards**: Métricas de build success/failure
- **Alerting**: Notificaciones en caso de builds fallidos

## ✅ Verificación de Requisitos

- [x] App con Front + Back en stack libre
- [x] Versionado en único repo con carpetas /front, /back
- [x] Pipeline YAML con CI (build) 
- [x] Pipeline ejecutándose en agente Self-Hosted
- [x] Multi-stage pipeline funcional
- [x] Build de frontend (npm ci && npm run build)
- [x] Build de backend (npm install && npm run build) 
- [x] Publicación de artefactos
- [x] README.md con instrucciones completas
- [x] decisiones.md con justificaciones técnicas