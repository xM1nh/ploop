# stage 1
FROM node:18.18 as builder
WORKDIR /app/server/gateway
COPY ./package*.json ./
RUN npm install
COPY . .
RUN npm run build

# stage 2
FROM node:18.18
WORKDIR /app/server/gateway
COPY ./package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/server/gateway/dist ./dist

EXPOSE 8001
CMD node dist/index.js