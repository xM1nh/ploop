# stage 1
FROM node:18.18 as builder
WORKDIR /app/server/encoding
COPY ./package*.json ./
RUN npm install
COPY . .
RUN npm run build

# stage 2
FROM node:18.18
WORKDIR /app/server/encoding
COPY ./package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/server/encoding/dist ./dist
COPY .env ./dist/

RUN pwd && ls

EXPOSE 8006
CMD node dist/index.js