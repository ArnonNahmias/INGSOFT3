# Decisiones del Proyecto

## 1. Metodología Ágil
Elegimos **Agile** por su simplicidad, flexibilidad y porque permite entregar valor de forma iterativa.  
Trabajamos con **sprints de 2 semanas**, lo que facilita entregar avances pequeños y continuos, y adaptarnos rápido a cambios.

---

## 2. Áreas y Equipos
Dividimos el proyecto en dos sub-áreas:
- **Frontend**
- **Backend**

Cada equipo se enfoca en su área, lo que mejora la organización y permite medir el progreso de forma más clara y separada.

---

## 3. Estructura de Trabajo en Azure Boards

### Jerarquía utilizada
- **Epic**
  - Autenticación de Usuarios

- **User Stories**
  - Registro de Usuario (Frontend)
  - Registro de Usuario (Backend)
  - Inicio de Sesión (Frontend)
  - Inicio de Sesión (Backend)

- **Tasks** (2 por cada User Story)
  - Ejemplo Frontend: Diseñar formulario, validar campos.
  - Ejemplo Backend: Crear endpoint, validar en base de datos.

- **Bugs**
  - Validación de email incorrecta en formulario de registro.
  - Token de sesión expira antes de lo esperado.

- **Sprint**
  - **Sprint 1** (22/09/2025 – 05/10/2025) → todas las User Stories, Tasks y Bugs fueron asignados aquí.

### Justificación
La estructura **Epic → User Stories → Tasks → Bugs** da:
- Orden y visibilidad en el proyecto.
- Separación clara de responsabilidades entre **Frontend** y **Backend**.
- Trazabilidad de errores reales con **Bugs** de ejemplo.
- Planificación simple con un Sprint de 2 semanas.

---

## 4. Decisiones sobre Branch Policies en Azure Repos

En la rama principal **`main`** configuramos políticas para asegurar la calidad del código y el control de cambios.

### Configuraciones aplicadas
- **Require Pull Request**:  
  Todo cambio en `main` debe pasar por un Pull Request (PR). Esto evita merges directos y garantiza revisión.
  
- **Minimum number of reviewers: 1**  
  Al menos un integrante del equipo debe aprobar cada PR antes de integrarlo. Esto asegura colaboración y revisión de código.

- **Check for linked work items (Optional)**  
  Activamos la opción opcional. Azure recomienda vincular cada PR con un Work Item, mejorando la trazabilidad, pero sin bloquear el flujo en caso de que falte.

- **Limit merge types – Solo Squash merge**  
  Permitimos únicamente *Squash merge*. Esto condensa todos los commits de la rama de feature en un único commit en `main`, manteniendo un historial limpio.

### Opciones descartadas
- **Build Validation**: No configuramos pipelines automáticos, ya que no era parte de la consigna.  
- **Status Checks**: No integramos herramientas externas como SonarCloud, porque excede el alcance actual.  
- **Automatically included reviewers**: No los configuramos porque el equipo es reducido; preferimos asignar revisores manualmente.

### Justificación
- Se asegura un **mínimo control de calidad** (PR + revisión).  
- El historial queda **limpio y entendible** gracias a Squash merge.  
- Mantenemos **flexibilidad** en los PRs sin bloquear el avance.  
- Optamos por **simplicidad** y cumplir lo pedido en la consigna, sin añadir complejidad extra.

---

## 5. Conclusión
Con estas decisiones logramos un entorno de trabajo:
- Ágil, ordenado y fácil de mantener.  
- Con separación clara de responsabilidades.  
- Con control básico de calidad en el flujo de integración.  
- Adaptado al alcance de la consigna, pero alineado con buenas prácticas reales.
