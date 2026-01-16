# Dockerfile para React en EasyPanel
FROM node:20-slim AS build-stage

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run vite build

# Production stage
FROM node:20-slim AS production-stage

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --only=production

COPY --from=build-stage /app/build ./build

# Instalar serve si no está en las dependencias
RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
