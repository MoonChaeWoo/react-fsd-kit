FROM node:24.7-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install && npm run build

FROM nginx
COPY --from=build /app/dist /opt/dist
RUN echo "server { \
    listen 80; \
    server_name _; \
    root /opt/dist; \
    index index.html; \
    location / { try_files \$uri \$uri/ /index.html; } \
}" > /etc/nginx/conf.d/react.conf \
&& mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.disabled
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]