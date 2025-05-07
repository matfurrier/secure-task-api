# Estágio de build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY . .
RUN npx prisma generate --schema=./prisma/schema.prisma

# Estágio de produção
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
COPY --from=builder /app/.env ./.env 
COPY --from=builder /app/generated ./generated

EXPOSE 3000
CMD [ "node", "src/index.js" ] 