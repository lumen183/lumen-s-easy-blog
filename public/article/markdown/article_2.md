# docker基础使用
## 基础维护
### 常用命令
docker system prune -f : 这条命令会清理未使用的镜像、网络、构建缓存，但不会删除已用的镜像和数据卷。

docker-compose down
docker-compose down 是 Docker Compose 提供的服务终止命令，它的行为包括：
● 首先停止所有由 Compose 管理的运行中容器（相当于 docker stop）；
● 然后删除这些已停止的容器（相当于 docker rm）；
● 同时删除 Compose 自动创建的网络（避免残留网络占用资源）。
注意：它不会默认删除数据卷（持久化数据），除非显式添加 -v 选项（脚本中选项 2 就是这种情况）。

为什么要这样设计？
可以避免运行的状态残留
因为docker的设计理念是用镜像定义环境，用容器运行实例」

## 基础知识
### builder和runner
as BUILDER 和 as RUNNER 是给构建阶段指定的别名，用于区分不同的构建阶段并实现 “构建与运行分离”，核心作用是减小最终镜像体积并优化构建流
builder: 负责 “编译 / 构建应用”，包含所有构建依赖（如编译器、SDK、源码、工具链等）。
runner: 仅包含 “运行应用必需的环境和文件”，基于构建阶段的产物进行部署。

### 卷
#### 匿名卷
在 Docker Compose 中这样定义 volumes（仅声明卷名称而不指定挂载目录）是完全合法的，这种方式称为 “匿名卷” 或 “命名卷”（严格来说是命名卷，因为指定了名称如 neo4j_data）。

1. 数据持久化：这些卷会被 Docker 自动管理，用于持久化容器中的数据（如数据库文件、日志等），即使容器被删除，数据也会保留。
2. 自动存储：Docker 会将这些卷的数据存储在宿主机的默认目录中（通常是 /var/lib/docker/volumes/ 下的随机子目录）。
3. 容器间共享：同一 Compose 项目中的多个容器可以通过引用这些卷名称来共享数据。
缺点： 目录比较深，在/var/lib/docker/volumes/项目名_neo4j_data/_data



● 源代码有变动：如果你修改了任何会影响镜像内容的文件（包括 requirements.txt、Dockerfile、build context 里的文件），Docker 会重新构建相关层。
```dockerfile
# 1. 创建一个数据卷
# 通常 docker run 时会自动创建，但手动创建可以更好地管理
docker volume create my-db-data

# 2. 查看所有数据卷
docker volume ls

# 3. 查看某个数据卷的详细信息（可以找到它在宿主机上的具体位置）
docker volume inspect my-db-data

# 4. 在运行容器时使用数据卷
# -v <volume_name>:<path_in_container>
# 示例：运行一个 PostgreSQL 数据库，并将其数据目录 /var/lib/postgresql/data 挂载到我们创建的 my-db-data 数据卷上
docker run -d \
  -p 5432:5432 \
  --name my-postgres \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -v my-db-data:/var/lib/postgresql/data \
  postgres:13

# 5. 删除数据卷
docker volume rm my-db-data

# 实用技巧：清理所有未被任何容器使用的 "悬空" 数据卷
docker volume prune
```
## 网络问题
### docker的代理
docker系统级代理（如浏览器、终端代理）不会自动应用到 Docker 服务（docker daemon），因为 Docker 的镜像拉取操作由后台的docker daemon进程执行，而非普通用户进程。因此，必须单独为 Docker daemon 配置代理。
在Windows上， 需要在settings -> resource -> proxies 中， 填入
http_proxy
https_proxy
no-proxy-host	http://127.0.0.1:7890
http://127.0.0.1:7890
localhost, 127.0.0.1
改完代理后最好电脑重启，可能重启了才有效果
可以尝试这样访问，看看你的代理能否访问相关仓库
curl -x 代理地址  https://quay.io/v2/coreos/etcd/manifests/v3.5.16
如果还不行
	可以尝试清理 Docker 的缓存，例如通过运行 docker system prune -a 命令来删除所有未使用的镜像、容器和网络等资源，然后再次尝试拉取镜像。
docker-compose down 的实际行为：不止是「删除」，而是「完整终止生命周期」
docker-compose down 是 Docker Compose 提供的服务终止命令，它的行为包括：



● 首先停止所有由 Compose 管理的运行中容器（相当于 docker stop）；
● 然后删除这些已停止的容器（相当于 docker rm）；
● 同时删除 Compose 自动创建的网络（避免残留网络占用资源）。



注意：它不会默认删除数据卷（持久化数据），除非显式添加 -v 选项（脚本中选项 2 就是这种情况）。




## 运行问题
出现问题时，可以通过以下代码查看日志
docker-compose logs -f container_name

### 为什么etcd服务跑不起来
command命令行参数与环境变量(应该是默认的）造成“重复设置”冲突，需要把command 那一行移出，改为在environment中设置- ETCD_LISTEN_CLIENT_URLS=http://0.0.0.0:2379等等

服务正常运行，但是healthcheck返回unhealthy
可能是容器内没有curl命令，需要在容器内安装


### docker内部镜像站换源
如果docker容器内有`etc/apt/sources.list`
在 Dockerfile 中通过 sed 命令修改 /etc/apt/sources.list 的操作，在构建的 Docker 镜像中是永久的。
● Docker 镜像的构建是基于 “分层存储” 的，每一条 RUN 命令都会生成一个新的镜像层。
● 当 sed 命令修改了 sources.list 文件后，这个修改会被固化到当前镜像层中。后续基于该镜像启动容器时，容器内的 /etc/apt/sources.list 会直接使用修改后的版本，不会恢复到默认状态。

如果没有
根据具体分析使用 trixie, bookworm等等
```dockerfile
RUN rm -f /etc/apt/sources.list.d/* && \
    echo "deb http://mirrors.aliyun.com/debian/ trixie  main contrib non-free non-free-firmware" > /etc/apt/sources.list && \
    # 添加apt重试机制
    echo "Acquire::Retries \"3\";" > /etc/apt/apt.conf.d/80-retries && \
    # 更新并安装依赖，增加--fix-missing参数处理缺失包
    apt-get update --fix-missing && \
    apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*
```

### healthcheck不通

或使用 curl -L -f 跟随重定向并检查最终目标的状态码（-L 会自动跟随 302 重定向）：
test: ["CMD", "curl", "-L", "-f", "http://0.0.0.0:3000"]