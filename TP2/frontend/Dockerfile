# Etapa de construcción
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias primero para aprovechar cache de Docker
COPY package.json package-lock.json* ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar el código fuente
COPY . .

# Argumento para determinar qué entorno usar
ARG ENVIRONMENT=qa

# Variables de entorno para React
ARG REACT_APP_API
ARG REACT_APP_ENV
ARG REACT_APP_VERSION
ARG REACT_APP_DEBUG

# Modificar el package.json para usar el entorno correcto
RUN sed -i "s/\.env\.desarrollo/.env.${ENVIRONMENT}/g" package.json

# Mostrar el comando de build actualizado para debug
RUN echo "=== Updated build command ===" && grep "build" package.json

# Construir la aplicación con el entorno correcto
RUN npm run build

# Etapa de producción con Nginx
FROM nginx:alpine

# Argumento para determinar qué configuración usar
ARG ENVIRONMENT=qa

# Copiar configuración personalizada de Nginx según el entorno
COPY nginx-${ENVIRONMENT}.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos construidos
COPY --from=builder /app/build /usr/share/nginx/html

# Exponer puerto 80
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]