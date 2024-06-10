# Build stage
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Production stage
FROM node:22-alpine AS production

WORKDIR /app

COPY package*.json ./

RUN npm install --production
RUN npm install prisma

COPY --from=build /app/dist /app/dist
COPY prisma /app/prisma

RUN npx prisma generate

EXPOSE 3000

CMD ["node", "dist/index.js"]
