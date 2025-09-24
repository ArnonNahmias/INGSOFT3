# Posts App - Pipeline CI/CD con Azure DevOps

## 📋 Descripción

Aplicación completa de posts con arquitectura separada Frontend/Backend, configurada para CI/CD con Azure DevOps usando agentes Self-Hosted.

## 🏗️ Características

- **Frontend Next.js 14** - App Router + React + TypeScript
- **Backend Express** - API REST con arquitectura MVC
- **Base de datos MySQL** - Local sin contraseña
- **Autenticación JWT** - Sistema completo de login/registro
- **Pipeline YAML** - Multi-stage CI/CD con Azure DevOps
- **Self-Hosted Agent** - Ejecución en máquina local

## 🏗️ Arquitectura

```
posts-app/
├── front/                 # Frontend Next.js + React + TypeScript
│   ├── app/              # App Router de Next.js 14
│   │   ├── api/          # API Routes integradas (Next.js)
│   │   ├── login/        # Página de login
│   │   └── register/     # Página de registro
│   ├── components/       # Componentes React + Shadcn/ui
│   ├── services/         # Servicios HTTP para API calls
│   ├── config/           # Configuración de base de datos
│   ├── controllers/      # Controladores MVC (integrados)
│   ├── models/           # Modelos TypeScript
│   └── package.json      # Dependencias frontend
├── back/                 # Backend Node.js + Express + TypeScript (Separado)
│   ├── config/           # Configuración de base de datos
│   ├── controllers/      # Controladores MVC
│   ├── models/           # Modelos TypeScript
│   ├── services/         # Servicios de negocio
│   ├── index.ts          # Servidor Express principal
│   └── package.json      # Dependencias backend
└── azure-pipelines.yml   # Pipeline YAML Multi-Stage
  ```

## 🚀 Cómo ejecutar localmente

### Prerrequisitos

- **Node.js 18+**
- **MySQL** (local, sin contraseña para root)
- **npm** o **pnpm**

### Frontend (Opción recomendada - todo integrado)

```bash
cd front
npm install
npm run dev
```

La aplicación estará disponible en: `http://localhost:3000`

### Backend por separado (Opcional)

```bash
cd back  
npm install
npm run setup-db  # Configurar base de datos
npm run dev
```

El backend estará disponible en: `http://localhost:3001`

## 📡 Endpoints API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/auth/register` | Registro de usuario |
| POST | `/api/auth/login` | Login de usuario |
| GET | `/api/posts` | Listar todos los posts |
| GET | `/api/posts/:id` | Obtener post por ID |
| POST | `/api/posts` | Crear nuevo post |
| PUT | `/api/posts/:id` | Actualizar post |
| DELETE | `/api/posts/:id` | Eliminar post |
| GET | `/api/posts/user/:userId` | Posts por usuario |

## 🔧 Pipeline Azure DevOps

### Configuración del Agente Self-Hosted

1. **Crear Pool en Azure DevOps:**
   - Ir a `Project Settings` > `Agent pools`
   - Crear pool `SelfHosted`

2. **Instalar Agente:**
   - Descargar agente para macOS/Windows/Linux
   - Registrar como `Agent-Local`
   - Instalar como servicio

3. **Prerrequisitos del Agente:**
   - Node.js 18+
   - MySQL (local)
   - Git

### Pipeline Stages

1. **CI Stage**: Build y test de frontend y backend
2. **Database Setup**: Verificación de conectividad
3. **Health Check**: Verificación final de artefactos

### Trigger

El pipeline se ejecuta automáticamente en:
- Push a rama `main`
- Cambios en carpetas `front/`, `back/` o `azure-pipelines.yml`

## 📦 Artefactos Generados

- **frontend-build**: Aplicación Next.js compilada (.next)
- **frontend-static**: Archivos estáticos (public)
- **backend-build**: Backend compilado (dist)
- **backend-config**: Configuración (package.json)

## 🌐 URLs

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001 (si se ejecuta por separado)
- **Health Check**: http://localhost:3001/health

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 14** (App Router)
- **React 18** + **TypeScript 5**
- **Tailwind CSS** + **Shadcn/ui**
- **JWT Authentication**

### Backend  
- **Node.js** + **Express** + **TypeScript**
- **MySQL 2** (mysql2 driver)
- **JWT** + **bcryptjs**
- **Arquitectura MVC**

### DevOps
- **Azure DevOps** (Repos + Pipelines)
- **YAML Pipeline** (Multi-stage)
- **Self-Hosted Agent**
- **Artifact Publishing**

## 🔒 Seguridad

- Autenticación JWT
- Passwords hasheados con bcryptjs
- Variables de entorno para configuración
- CORS configurado

## 📊 Monitoreo

- Health check endpoint
- Logs estructurados en pipeline
- Verificación de artefactos
- Tests automatizados (expandible)
\`\`\`

## Instalación y Uso

\`\`\`bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
\`\`\`

La aplicación estará disponible en `http://localhost:3000`

## TODOs para Backend

Esta aplicación está preparada para conectarse a un backend real. Los siguientes TODOs indican dónde se necesita integración:

### Autenticación
- `AuthGuard.tsx`: Implementar redirección a `/login` cuando no hay sesión
- `app/login/page.tsx`: POST a `/auth/login` y redirección a `/app`
- `app/register/page.tsx`: POST a `/auth/register` y redirección a `/app`
- `Navbar.tsx`: Implementar logout real

### Posts/Comentarios
- `app/page.tsx`: Reemplazar posts hardcodeados por fetch al backend
- `app/app/page.tsx`: Reemplazar posts hardcodeados por fetch al backend
- `NewPostForm.tsx`: POST a `/comments` para crear nuevos posts

## Tecnologías

- **Next.js 14** con App Router
- **TypeScript** para type safety
- **Tailwind CSS** para estilos
- **Responsive Design** mobile-first
- **Accesibilidad** con ARIA labels y navegación por teclado
