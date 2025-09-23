FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app

COPY --from=builder /app/.output ./.output

# Puerto que usa Nitro (Nuxt 3)
EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
