# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package files
COPY package.json package-lock.json* ./

# Instalar dependências
RUN npm install --omit=dev

# Stage 2: Runtime
FROM node:18-alpine

WORKDIR /app

# Instalar curl para healthcheck
RUN apk add --no-cache curl

# Copiar node_modules da stage anterior
COPY --from=builder /app/node_modules ./node_modules

# Copiar arquivos da aplicação
COPY package.json package-lock.json* ./
COPY server.js ./

# Criar usuário não-root por segurança
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

# Expor porta
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/stats || exit 1

# Definir arquivo .env obrigatório
ENV DATABASE_URL=""
ENV PORT=3000
ENV NODE_ENV=production

# Iniciar aplicação
CMD ["node", "server.js"]
