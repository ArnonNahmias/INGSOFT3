# ⚠️ IMPORTANTE – Guía de Práctica Sugerida

Lo que vas a ver a continuación es una **guía paso a paso altamente sugerida** para que practiques el uso de Azure DevOps.  
**Te recomendamos hacerla completa**, ya que te ayudará a adquirir los conocimientos necesarios.

---

## PERO: Esta guía **NO es el trabajo práctico** que tenés que entregar

El trabajo práctico será evaluado en base a:
- Tu capacidad para **organizar tu trabajo en Azure DevOps con criterio técnico**.
- Tu capacidad para **explicar y justificar cada decisión que tomaste**.
- Una **defensa oral obligatoria** donde vas a tener que demostrar lo que sabés.

---

## ¿Dónde está el trabajo práctico?

El **TP real que debés entregar y defender** se encuentra al final de este archivo.  
No alcanza con copiar esta guía. **Si no podés defenderlo, no se aprueba.**

---

## Sobre esta guía

- Esta guía NO es exhaustiva.
- Azure DevOps es una plataforma que requiere **investigación y práctica fuera de clase**.
- En 2 horas no vas a aprender Azure DevOps completo. **Esto es solo el punto de partida.**

---

# Guía Paso a Paso – Introducción a Azure DevOps (Práctica sugerida)

## 1- Objetivos de Aprendizaje
- Familiarizarse con la plataforma Azure DevOps
- Ejercitar el uso de las herramientas básicas de Azure DevOps.

## 2- Algunos conceptos fundamentales

A continuación, se presentarán algunos conceptos generales de Azure DevOps a manera de introducción al tema desde el punto de vista práctico.

### ¿Qué es Azure DevOps?

Azure DevOps es una plataforma completa de Microsoft que ofrece servicios de desarrollo para que los equipos compartan código, realicen seguimiento del trabajo y envíen software. Proporciona un conjunto integrado de características a las que se puede acceder a través de un navegador web o un cliente de IDE.

### ¿Por qué usar Azure DevOps?

Azure DevOps ofrece una solución integral que cubre todo el ciclo de vida del desarrollo de software:
- **Planificación**: Herramientas ágiles para planificar, hacer seguimiento y discutir el trabajo
- **Desarrollo**: Repositorios Git ilimitados basados en la nube
- **Entrega**: CI/CD que funciona con cualquier lenguaje, plataforma y nube
- **Pruebas**: Herramientas de prueba manual y exploratoria

### Componentes Principales de Azure DevOps

#### Azure Boards
- Sistema de seguimiento del trabajo que soporta metodologías ágiles (Scrum, Kanban)
- Permite crear y gestionar work items como User Stories, Tasks, Bugs
- Visualización mediante boards personalizables y dashboards

#### Azure Repos
- Control de versiones con Git o Team Foundation Version Control (TFVC)
- Funcionalidades clave:
  - Branching y merging
  - Pull requests con code reviews
  - Políticas de branch
  - Integración con webhooks

#### Azure Pipelines
- Servicio de CI/CD (Integración Continua y Entrega Continua)
- Soporta cualquier lenguaje, plataforma y nube
- Configuración mediante YAML o interfaz visual
- Agentes hosted o self-hosted

#### Azure Test Plans
- Herramientas para pruebas manuales y automatizadas
- Gestión de casos de prueba
- Reportes de calidad y trazabilidad

#### Azure Artifacts
- Gestión de paquetes (NuGet, npm, Maven, Python)
- Feeds públicos y privados
- Integración con pipelines de CI/CD

### Integración con otras herramientas

Azure DevOps se integra nativamente con:
- **GitHub**: Sincronización de código y CI/CD
- **Jenkins**: Orquestación de builds
- **Docker**: Construcción y despliegue de contenedores
- **Kubernetes**: Despliegue y gestión de aplicaciones
- **Slack, Teams**: Notificaciones y colaboración

### Marketplace de extensiones

El marketplace de Azure DevOps ofrece cientos de extensiones para añadir funcionalidades adicionales:
- Herramientas de seguridad
- Integraciones con terceros
- Widgets de dashboard personalizados
- Tareas de pipeline adicionales

## 3- Desarrollo de la Guía

### 1- Crear una cuenta en Azure DevOps
- Navegar a https://dev.azure.com
- Registrarse con una cuenta Microsoft
- Crear una organización (elegir un nombre único)

### 2- Crear un proyecto Sample01
- Click en "+ New Project"
- Configurar:
  - Project name: Sample01
  - Visibility: private
  - Version control: Git
  - Work item process: Basic
- Explicar las diferencias entre los tipos de procesos (Basic, Agile, Scrum, CMMI)

### 3- Explorar Azure Boards
- Navegar a Boards > Work Items
- Crear un Epic
- Crear User Stories asociadas al Epic
- Crear Tasks dentro de las User Stories
- Mover items en el board Kanban

### 4- Crear un repositorio Git desde cero
- Navegar a Repos > Files
- Inicializar con README
- Clonar el repositorio localmente:
```bash
git clone https://dev.azure.com/{organization}/{project}/_git/{repository}
```
- Crear un archivo, hacer commit y push:
```bash
echo "# Mi proyecto" > archivo.md
git add archivo.md
git commit -m "Agregar archivo inicial"
git push origin main
```

### 5- Crear un proyecto Sample02
- Repetir el proceso de creación
- Esta vez seleccionar Work item process: Agile

### 6- Importar un repositorio desde GitHub
- En Repos, seleccionar "Import repository"
- URL: https://github.com/ingsoft3ucc/SimpleWebAPI.git
- Esperar a que complete la importación
- Explorar el código importado

### 7- Trabajar con branches y Pull Requests
- Crear un nuevo branch:
```bash
git checkout -b feature/mi-cambio
```
- Realizar cambios en algún archivo
- Hacer commit y push del branch
- Crear un Pull Request en Azure DevOps
- Configurar políticas de branch (reviewers, build validation)
- Completar el Pull Request

### 8- Configurar el proceso Agile y Sprints
- En Project Settings > Boards > Team configuration
- Configurar las iteraciones (Sprints)
- Definir la duración del sprint (2 semanas)
- Asignar work items a los sprints


# Trabajo Práctico 03 – Introducción a Azure DevOps (2025)

## 🎯 Objetivo

Aplicar y demostrar el uso práctico de Azure DevOps mediante un proyecto real de desarrollo.  
Este trabajo se aprueba **solo si podés explicar qué hiciste, por qué lo hiciste y cómo lo resolviste**.

---

## 🧩 Escenario

Tu equipo de desarrollo necesita migrar su proceso de trabajo a Azure DevOps. Como líder técnico, debés:

1. Configurar un proyecto completo en Azure DevOps con todos sus componentes.
2. Establecer un flujo de trabajo ágil con sprints y seguimiento de tareas.
4. Configurar políticas de calidad de código.
5. Establecer un proceso de code review mediante Pull Requests.
6. Documentar las decisiones tomadas y justificarlas.

---

## 📋 Tareas que debés cumplir

### 1. Configuración inicial del proyecto
- Crear una organización en Azure DevOps
- Crear un proyecto con la metodología ágil que consideres apropiada
- Configurar los equipos y áreas del proyecto
- Documentar en `decisiones.md` por qué elegiste esa metodología

### 2. Gestión del trabajo con Azure Boards
- Crear al menos:
  - 1 Epic que represente una funcionalidad completa
  - 3 User Stories relacionadas con el Epic
  - 2 Tasks por cada User Story
  - 2 Bugs de ejemplo
- Configurar un Sprint de 2 semanas
- Asignar los work items al Sprint
- Documentar la estructura de trabajo elegida

### 3. Control de versiones con Azure Repos
- Importar o crear un repositorio con código de una aplicación
- Configurar políticas de branch para la rama principal:
  - Requerir Pull Request
  - Mínimo 1 reviewer
- Crear al menos 2 branches de feature
- Realizar cambios y crear Pull Requests

---

## 📄 Entregables

1. **Acceso al proyecto de Azure DevOps** con:
   - Todos los componentes configurados y funcionales
   - Historial de builds exitosos
   - Work items organizados en sprints
   - Pull Requests completados

2. **Repositorio en GitHub** con:
   - **README.md** con instrucciones para:
     - Acceder al proyecto de Azure DevOps
     - Clonar y trabajar con el repositorio
     - Ejecutar los pipelines
     - Entender la estructura del proyecto
   - **decisiones.md** explicando:
     - Metodología ágil elegida y justificación
     - Estructura de work items y por qué
     - **Evidencia de funcionamiento**: capturas mostrando:
       - Board con work items organizados
       - Pull Request aprobado y mergeado
     - Problemas encontrados y soluciones aplicadas

3. **URL del proyecto** en el Excel compartido:
   - https://docs.google.com/spreadsheets/d/1mZKJ8FH390QHjwkABokh3Ys6kMOFZGzZJ3-kg5ziELc/edit?gid=0#gid=0

---

## 🗣️ Defensa Oral Obligatoria

Vas a tener que mostrar tu trabajo y responder preguntas como:
- ¿Cuál es la diferencia entre Epic, User Story y Task?
- ¿Cómo configuraste las políticas de branch y por qué?
- ¿Qué ventajas tiene usar Azure Pipelines sobre otras herramientas de CI/CD?
- ¿Qué es un Pull Request y cómo lo usaste?

---

## ✅ Evaluación

| Criterio                                    | Peso |
|---------------------------------------------|------|
| Configuración técnica de Azure DevOps       | 25%  |
| Claridad y justificación en `decisiones.md` | 25%  |
| Defensa oral: comprensión y argumentación   | 50%  |

---

## ⚠️ Uso de IA

Podés usar IA (ChatGPT, Copilot), pero **deberás declarar qué parte fue generada con IA** y justificar cómo la verificaste.  
Si no podés defenderlo, **no se aprueba**.
