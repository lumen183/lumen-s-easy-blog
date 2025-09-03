# 使用Node.js官方镜像作为构建环境
FROM node:18-alpine AS build

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制源代码
COPY . .

# 构建生产版本
RUN npm run build

# 使用Nginx官方镜像作为运行环境
FROM nginx:alpine

# 复制构建产物到Nginx的静态文件目录
COPY --from=build /app/dist /usr/share/nginx/html

# 复制Nginx配置文件（如果需要自定义配置）
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 3000

# 启动Nginx服务
CMD ["nginx", "-g", "daemon off;"]