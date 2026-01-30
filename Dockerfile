# Backend Dockerfile
FROM node:18-alpine AS backend
WORKDIR /app
COPY Backend/package.json Backend/package-lock.json ./
RUN npm install --production
COPY Backend/ .
RUN npm run build
CMD ["node", "dist/index.js"]

# Frontend Dockerfile
FROM node:18-alpine AS frontend
WORKDIR /app
COPY Frontend/package.json Frontend/package-lock.json ./
RUN npm install
COPY Frontend/ .
RUN npm run build

# Final Image
FROM nginx:alpine
COPY --from=frontend /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]