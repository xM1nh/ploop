# stage 1
FROM node:18.18 as builder
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

# stage 2
FROM node:18.18
WORKDIR /app
COPY package*.json .
COPY vite.config.ts .

COPY --from=builder /app/dist ./dist/
RUN npm install typescript

EXPOSE 5173
CMD ["npm", "run", "preview"]