# TP2 - Curso Online Plat## 🛠️ Para desarrolladores (código completo)

### Opción 1: Desarrollo con código fuente
```bash
# 1. Clonar repositorio
git clone https://github.com/ArnonNahmias/INGSOFT3.git
cd INGSOFT3/TP2

# 2. Configurar variables de entorno
cp .env.example .env

# 3. Ejecutar en modo desarrollo (reconstruir imágenes)
docker compose up --build
```

### Opción 2: Producción con imágenes publicadas
```bash
# Usar imágenes de Docker Hub sin reconstruir
docker compose -f docker-compose.prod.yml up -d
```

### Opción 3: QA y PROD simultáneos �
```bash
# Ejecutar ambos entornos al mismo tiempo
docker compose -f docker-compose.qa-prod.yml up -d
```
**📋 [Ver guía completa → QA-PROD-INSTRUCTIONS.md](./QA-PROD-INSTRUCTIONS.md)**

**Acceso:**
- **QA:** http://localhost:81 (modo debug)  
- **PROD:** http://localhost:80 (modo release)eres ejecutar la aplicación?

### 👥 **Para usuarios finales (ejecutar la app):**
**📋 [Ver instrucciones completas aquí → DOCKER_INSTRUCTIONS.md](./DOCKER_INSTRUCTIONS.md)**

**Instalación automática (1 comando):**
```bash
curl -sSL https://raw.githubusercontent.com/ArnonNahmias/INGSOFT3/main/TP2/install.sh | bash
```

**O instalación manual:**
```bash
curl -o docker-compose.yml https://raw.githubusercontent.com/ArnonNahmias/INGSOFT3/main/TP2/docker-compose.prod.yml
echo "DB_PASSWORD=58005800" > .env
docker compose up -d
```
**Acceso:** http://localhost

## � Buscar en Docker Hub
- **Backend:** https://hub.docker.com/r/felipeganame/tp2-backend
- **Frontend:** https://hub.docker.com/r/felipeganame/tp2-frontend
- **Buscar:** "felipeganame" en Docker Hub

## �🛠️ Opción 2: Para desarrolladores (código completo)

```bash
# 1. Clonar repositorio
git clone https://github.com/ArnonNahmias/INGSOFT3.git
cd INGSOFT3/TP2

# 2. Configurar variables de entorno
cp .env.example .env

# 3. Ejecutar en modo desarrollo (reconstruir imágenes)
docker compose up --build

# 4. O ejecutar en modo producción (usar imágenes de Docker Hub)
docker compose -f docker-compose.prod.yml up -d
```

## 📦 Imágenes Docker

- **Backend:** `felipeganame/tp2-backend:v1.0`
- **Frontend:** `felipeganame/tp2-frontend:v1.0`
- **Base de datos:** `mysql:5.7`

## 🔧 Variables de entorno

Crear archivo `.env`:
```
DB_PASSWORD=58005800
```