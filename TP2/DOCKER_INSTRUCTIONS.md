# 🎓 TP2 - Plataforma de Cursos Online

## 🚀 Ejecutar la aplicación SIN clonar el repositorio

**¡Solo necesitas Docker! No requiere descargar código fuente.**

### ⚡ Opción 1: Script automático (MÁS FÁCIL)

```bash
# Un solo comando para instalar y ejecutar todo
curl -sSL https://raw.githubusercontent.com/ArnonNahmias/INGSOFT3/main/TP2/install.sh | bash
```

### ⚡ Opción 2: Instalación manual (3 pasos)

```bash
# 1. Crear directorio para la aplicación
mkdir tp2-cursos && cd tp2-cursos

# 2. Descargar configuración de producción
curl -o docker-compose.yml https://raw.githubusercontent.com/ArnonNahmias/INGSOFT3/main/TP2/docker-compose.prod.yml

# 3. Crear archivo de variables de entorno
echo "DB_PASSWORD=58005800" > .env

# 4. Ejecutar la aplicación
docker compose up -d
```

### 🌐 Acceso a la aplicación

Una vez ejecutado, accede a:
- **🖥️ Aplicación Web:** http://localhost
- **🔧 API Backend:** http://localhost:8080
- **🗄️ Base de datos MySQL:** localhost:3306

### 📋 Comandos útiles

```bash
# Ver el estado de los contenedores
docker compose ps

# Ver logs en tiempo real
docker compose logs -f

# Parar la aplicación
docker compose down

# Parar y eliminar datos (⚠️ cuidado: borra la base de datos)
docker compose down -v

# Actualizar a nuevas versiones
docker compose pull && docker compose up -d
```

---

## 🐳 Información de las imágenes Docker

### 📦 Imágenes publicadas:
- **Backend:** `felipeganame/tp2-backend:1.0`
- **Frontend:** `felipeganame/tp2-frontend:1.0`
- **Base de datos:** `mysql:5.7`

### 🔍 Encontrar en Docker Hub:
- **Backend:** https://hub.docker.com/r/felipeganame/tp2-backend
- **Frontend:** https://hub.docker.com/r/felipeganame/tp2-frontend
- **Buscar:** "felipeganame/tp2" en Docker Hub

---

## 📋 Configuración manual (alternativa)

Si prefieres crear los archivos manualmente:

### 1. Crear `docker-compose.yml`:

```yaml
services:
  backend:
    image: felipeganame/tp2-backend:1.0
    ports:
      - "8080:8080"
    environment:
      - DB_HOST=db
      - DB_PORT=3306
      - DB_USER=root
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_NAME=proyecto
    depends_on:
      - db
    networks:
      - app-network

  frontend:
    image: felipeganame/tp2-frontend:1.0
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - app-network

  db:
    image: mysql:5.7
    platform: linux/amd64
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
      MYSQL_DATABASE: proyecto
    ports:
      - "3306:3306"
    volumes:
      - dbdata:/var/lib/mysql
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  dbdata:
```

### 2. Crear archivo `.env`:

```bash
DB_PASSWORD=58005800
```

### 3. Ejecutar:

```bash
docker compose up -d
```

---

## 🔧 Variables de entorno

| Variable | Valor por defecto | Descripción |
|----------|------------------|-------------|
| `DB_PASSWORD` | `58005800` | Contraseña de la base de datos MySQL |

---

## 🛠️ Solución de problemas

### Puerto ocupado:
```bash
# Si el puerto 80 está ocupado, cambiar por otro:
# En docker-compose.yml cambiar "80:80" por "8081:80"
# Luego acceder a http://localhost:8081
```

### Limpiar todo y empezar de nuevo:
```bash
docker compose down -v --rmi all
docker compose up -d
```

### Ver logs detallados:
```bash
# Logs de todos los servicios
docker compose logs

# Logs de un servicio específico
docker compose logs backend
docker compose logs frontend
docker compose logs db
```

---

## 🏗️ Arquitectura de la aplicación

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │    │   Backend   │    │   Database  │
│   (React)   │────│    (Go)     │────│   (MySQL)   │
│  Puerto: 80 │    │ Puerto: 8080│    │ Puerto: 3306│
└─────────────┘    └─────────────┘    └─────────────┘
```

---

## 🚀 Para desarrolladores

Si eres desarrollador y quieres modificar el código:

```bash
# Clonar el repositorio completo
git clone https://github.com/ArnonNahmias/INGSOFT3.git
cd INGSOFT3/TP2

# Configurar entorno de desarrollo
cp .env.example .env

# Ejecutar en modo desarrollo (reconstruye las imágenes)
docker compose up --build
```

---

## 📝 Notas importantes

- ✅ **Datos persistentes:** La base de datos se guarda en un volumen Docker (`dbdata`)
- ✅ **Fácil actualización:** Solo ejecuta `docker compose pull` para nuevas versiones
- ✅ **Multiplataforma:** Funciona en Windows, macOS y Linux
- ✅ **Sin dependencias:** Solo necesitas Docker instalado

---

## 📞 Soporte

- **Repositorio:** https://github.com/ArnonNahmias/INGSOFT3
- **Imágenes Docker:** https://hub.docker.com/u/felipeganame
- **Issues:** https://github.com/ArnonNahmias/INGSOFT3/issues