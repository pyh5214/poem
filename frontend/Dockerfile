FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .

ARG REACT_APP_API_URL=https://localhost:5000
ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN npm run build

FROM nginx:alpine

# 자체 서명 SSL 인증서 생성
RUN apk add --no-cache openssl && \
    mkdir -p /etc/nginx/ssl && \
    openssl req -x509 -nodes -days 3650 -newkey rsa:2048 \
      -keyout /etc/nginx/ssl/key.pem \
      -out /etc/nginx/ssl/cert.pem \
      -subj "/CN=poem-app" \
      -addext "subjectAltName=IP:0.0.0.0"

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
