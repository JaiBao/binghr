# develop stage
FROM node:18-alpine as develop-stage
WORKDIR /app
COPY package*.json ./
RUN npm i -g @quasar/cli
COPY . .
# build stage
FROM develop-stage as build-stage
RUN yarn
RUN yarn build
# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist/spa /usr/share/nginx/html
# 安装 OpenSSL 包
# RUN apk add --no-cache openssl
# # 创建 SSL 目录
# COPY default.conf /etc/nginx/conf.d/default.conf
# RUN mkdir -p /etc/nginx/ssl
# COPY fullchain.crt /etc/nginx/ssl/fullchain.crt
# COPY private.pem /etc/nginx/ssl/private.pem
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
# 生成 SSL 证书和密钥
# RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
#     -subj "/C=TW/ST=Taiwan/L=Taipei/O=aaa/CN=asd.com" \
#     -keyout /etc/nginx/ssl/nginx.key -out /etc/nginx/ssl/nginx.crt