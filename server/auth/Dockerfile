# stage 1
FROM node:18.18 as builder
WORKDIR /app/server/auth
COPY ./package*.json ./
RUN npm install
COPY . .
RUN npm run build

# stage 2
FROM node:18.18
WORKDIR /app/server/auth
COPY ./package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/server/auth/dist ./dist
COPY .env ./dist/
COPY .env.development.local ./dist/

EXPOSE 8001
CMD node dist/index.js