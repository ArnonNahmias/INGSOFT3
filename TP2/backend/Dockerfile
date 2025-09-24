# Etapa de construcción
FROM golang:1.18-alpine AS builder

# Instalar dependencias del sistema necesarias para CGO y Git
RUN apk add --no-cache gcc musl-dev git

WORKDIR /app

# Copiar archivos de dependencias primero para aprovechar cache de Docker
COPY go.mod go.sum ./
RUN go mod download

# Copiar el código fuente
COPY . .

# Construir la aplicación con optimizaciones
RUN CGO_ENABLED=1 GOOS=linux go build -a -ldflags '-linkmode external -extldflags "-static"' -o main .

# Etapa de ejecución con imagen más ligera
FROM alpine:latest

# Instalar dependencias runtime necesarias
RUN apk --no-cache add ca-certificates tzdata curl

WORKDIR /root/

# Copiar el binario desde la imagen builder
COPY --from=builder /app/main .

# Copiar script de espera para la base de datos
COPY wait-for-db.sh /wait-for-db.sh
RUN chmod +x /wait-for-db.sh

# Crear directorio para uploads si es necesario
RUN mkdir -p uploads

# Instalar netcat para el health check y dependencias
RUN apk add --no-cache netcat-openbsd

EXPOSE 8080

# Usar el script de espera antes de iniciar la aplicación
ENTRYPOINT ["/wait-for-db.sh"]
CMD ["./main"]