# stage 1
FROM node:18.18 as builder
WORKDIR /app/server/spray
COPY ./package*.json ./
RUN npm install
COPY . .
RUN npm run build

# stage 2
FROM node:18.18
WORKDIR /app/server/spray
COPY ./package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/server/spray/dist ./dist

EXPOSE 8005
CMD node dist/index.js