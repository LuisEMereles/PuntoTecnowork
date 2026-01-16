# Dockerfile para React en EasyPanel
FROM node:20-slim AS build-stage

WORKDIR /app

# Copiar package.json primero
COPY package.json ./

# Copiar el resto de archivos
COPY . .

# Instalar dependencias
RUN npm ci || npm install

# Build de la aplicación
RUN npm run vite build

# Production stage
FROM node:20-slim AS production-stage

WORKDIR /app

# Instalar serve para archivos estáticos
RUN npm install -g serve

# Copiar package.json y dependencias de producción
COPY package.json ./
RUN npm ci --only=production || npm install --only=production

# Copiar build desde la etapa anterior
COPY --from=build-stage /app/build ./build

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
