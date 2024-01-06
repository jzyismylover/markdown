# docker

docker 的出现使得环境可以跨平台，不依赖与主机的操作系统。

[docker 百度百科](https://baike.baidu.com/item/Docker/13344470)

### 场景一：单机

<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/84c2c41a62c648aab6f2fd5185779d58~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp" style="display: block; margin: auto;"/>

在同一台电脑安装不同环境的项目

### 场景二：多机

<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b31848e522bd4290b7536ae20fa88b71~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp" style="display: block; margin: auto;"/>

在不同操作系统的电脑下载不同环境的项目

- docker 的出现解决的问题：镜像机制，通过将环境也打包进入镜像仓库，别人从仓库拉下来的时候连同项目代码和环境也拉下来，然后直接运行就可以啦！！！
- docker 的核心思想是隔离，每个集装箱是互相隔离的，互不影响，这就能解决之前多项目端口冲突的问题。

### 容器技术 VS 虚拟机技术

虚拟机

- 笨重，资源占用多，冗余步骤多，启动慢(相当于一台独立的主机)

容器

- 容器化技术不是模拟一个完整的操作系统，容器与容器之间互相隔离

- 镜像文件非常小巧(只包括一些非常常用的启动脚本和命令)

### 基础命令

- 删除所有的镜像文件

```bash
 $ docker image rm $(docker image ls -q)
 $ docker rmi $(docker image ls -q)
```

- 删除容器

```bash
# 利用可变参数
$ docker ps -aq | xargs docker stop
$ docker ps -a -q | xargs docker rm

$ docker stop $(docker ps -a -q)
$ docker rm $(docker ps -a -q)
```

- 容器重命名

```bash
$ docker rename [原容器名] [现容器名]
```

- 进入容器

```bash
$ docker exec -it 6527 /bin/bash
# 假如出现报错的话启用下面这种
$ docker exec -it 6527 /bin/sh
```

```bash
$ docker attach <container_id>
```

- attach 直接进入容器启动命令的终端不会启动新的进程，用 exit 退出会导致容器的停止
- exec 是在容器中打开新的终端，并且可以启动新的进程，用 exit 退出不会导致容器的停止

* 容器退出删除命令

```bash
exit #容器退出
Ctrl+P+Q #不停止推出

docker rm 容器id                  # 删除指定的容器 不能删除正在运行的
docker rm -f $(docker ps -aq)     # 删除所有容器
docker ps -a -q | xargs docker rm # 删除所有容器
复制代码
```

- 启动、停止容器命令

```bash
# 启动容器
docker start 容器id
# 重启容器
docker restart 容器id
# 停止容器运行
docker stop 容器id
# 杀死容器
docker kill 容器id
```

```bash
# 以交互式 shell 执行我们启动的容器
$ docker run -p 80:8080/tcp ubuntu bash
$ docker run -it nginx:latest /bin/bash

$ docker run --name mynginx -d nginx:latest
```

- docker 进入容器终端的两种退出方式

  - exit(终止当前容器运行)
  - ctrl + p + q (不终止当前容器运行)

- docker 查看内部容器的运行进程情况

```bash
$ docker top <container_id>
```

- 容器数据拷贝

```bash
$ docker cp <container_id>:<容器内路径> 目的主机路径
$ docker cp ddb1:/usr/share/nginx/html /var
```

- 容器镜像备份
  - export 导出容器的内容作为一个 tar 归档文件
  - import 从 tar 包中的内容创建一个新的文件系统再导入镜像

```bash

```

### 联合文件系统

union 文件系统是一种分层、轻量级并且高性能的文件系统。

#### 提交新镜像

提交容器副本使之成为一个新的镜像

```bash
$ docker commit -m "提交描述信息" -a="作者" 容器id 要创建的目标镜像名:[标签名]
```

```bash
jzy:/var/ $ docker commit -m="install vim in ubuntu" -a='jzyismylover' 1f4ba0556d96 jubuntu:1.0     [0:32:34]
sha256:8a29d66dfb70ed231b380d9e2b2615f15718ea5a53dc85c272f9b545abcdffc3
jzy:/var/ $ docker images                                                                           [0:33:39]
REPOSITORY    TAG       IMAGE ID       CREATED          SIZE
jubuntu       1.0       8a29d66dfb70   11 seconds ago   180MB
qingyu-docs   latest    53dcfcf198fe   9 hours ago      24.3MB
ubuntu        latest    ba6acccedd29   13 months ago    72.8MB
```

### 容器与宿主机通信

```bash
# 将容器上的文件拷贝到当前宿主机的文件夹
$ docker cp mycontainer:/opt/testnew/file.txt /opt/test/

# 将宿主机的文件拷贝到容器上的文件夹
$ docker cp /opt/test/ mycontainer:/opt/testnew/file.txt
```

### 容器数据卷

容器内文件和宿主机文件的共享同步，容器数据卷的方式完成数据的**持久化**，把容器内的数据备份 + 持久化到本机宿主机目录，保证容器内的数据不会消失。

代码：`docker run -privileged=true -v 宿主机目录:容器目录 镜像`

```bash
$ docker run -d -p 5000:5000 -v /var/registry:/tmp/registry --privileged=true registry
```

```bash
$ docker run -it --name ubuntu-testing -v /tmp/dockerData:/var/docker ubuntu
```

无论容器是否停止下次启动的时候 docker 依然会和数据卷的数据进行同步。了解了持久化的概念后其实开启容器卷也有分相关权限的，读权限、写权限（只对容器内进行限制）

- 可读可写 rw
- 只可读 ro

```bash
$ docker run -it --name ubuntu-testing -v /tmp/dockerData:/var/docker:ro ubuntu
```

- 容器数据卷的继承和共享。`docker run --volumes-from 继承的容器`

```bash
$ docker run -it --name ubuntu-02 --volumes-from ubuntu-01 ubuntu
```

### 部件安装

#### 安装 mysql

```bash
$ docker pull mysql:latest

$ 	docker run --detach \
--publish 5006:3306 --privileged=true \
--volume /docker/mysql/log:/var/log/mysql \
--volume /docker/mysql/data:/var/lib/mysql \
--volume /docker/mysql/conf:/etc/mysql/conf.d \
--env MYSQL_ROOT_PASSWORD=jzy \
--name mysql \
mysql
```

- 修改 mysql 配置解决中文乱码问题，在 conf.d / conf 里面新建一个 my.cnf

```bash
☁  conf  cat my.cnf
[client]
default-character-set = utf8

[mysqld]
character-set-server = utf8
collation-server = utf8_general_ci
```

```bash
 Variable_name            | Value                          |
+--------------------------+--------------------------------+
| character_set_client     | utf8mb3                        |
| character_set_connection | utf8mb3                        |
| character_set_database   | utf8mb3                        |
| character_set_filesystem | binary                         |
| character_set_results    | utf8mb3                        |
| character_set_server     | utf8mb3                        |
| character_set_system     | utf8mb3                        |
| character_sets_dir       | /usr/share/mysql-8.0/charsets/ |
+--------------------------+-------------------------------
```

#### [安装 gitlab](https://zhuanlan.zhihu.com/p/413217715)

```bash
$ docker pull gitlab/gitlab-ci
```

不知道为啥 docker hub 上搜不到这个镜像的相关信息，但是很多教程都是基于这个镜像来安装 gitlab，那就按照教程来吧。下载的过程非常漫长，估计是因为源在外国的原因，因此考虑更换为阿里云加速镜像源。

```json
"registry-mirrors": [
  "https://6ztirue0.mirror.aliyuncs.com",
]
```

```bash
# 查看日志
$ dmesg
```

- 启动 gitlab 镜像

```bash
$ mkdir /docker
$ cd /docker
$ docker run -d
6443:443 \
-p 6022:22 \
-p 6080: 80 \
-v /docker/gitlab/etc:/etc/gitlab \
-v /docker/gitlab/log:/var/log/gitlab \
-v /docker/gitlab/opt:/var/opt/gitlab \
--privileged=true  \
--name gitlab \
gitlab/gitlab-ce
```

- 启动了容器以后在端口存在内外映射不一致的基础上，进入容器内部进行配置修改

```bash
$ docker exec -it gitlab /bin/bash

# 修改 gitlab.rb 配置文件
$ vi /etc/gitlab/gitlab.rb
## 加入如下
# gitlab访问地址，可以写域名。如果端口不写的话默认为80端口
external_url 'http://101.133.225.166'
# ssh主机ip
gitlab_rails['gitlab_ssh_host'] = '101.133.225.166'
# ssh连接端口
gitlab_rails['gitlab_shell_ssh_port'] = 9922

$ gitlab-ctl reconfigure
```

- 然后更新完配置以后需要解决映射的问题了，`/etc/gitlab/gitlab.rb` 文件的配置会映射到 `gitlab.yml` 这个文件，由于在 docker 中运行，在 gitlab 上生成的 http 地址应该是 `http://localhost:6088`,所以，要修改下面文件

```bash
$ vi /opt/gitlab/embedded/service/gitlab-rails/config/gitlab.yml

  gitlab:
    host: 101.133.225.166
    port: 6080 # 这里改为6080
    https: false

$ gitlab-ctl restart
```

- 大致上其实配置上述就可完成 gitlab 的访问了（可能会出现 502，但其实我猜测是因为延时设得太短的问题）。然后就是登录的问题了，其实我们并不知道我们的用户名和密码是啥，用户名可以查下是 root，密码可用下面命令行获得：

```bash
$ /etc/gitlab/initial_root_password
```

```json
[
  {
    "id": 1,
    "username": "root",
    "name": "Administrator",
    "state": "active",
    "avatar_url": "https://www.gravatar.com/avatar/e64c7d89f26bd1972efa854d13d7dd61?s=80&d=identicon",
    "web_url": "http://127.0.0.1:6080/root"
  }
]
```

#### 安装 gitlab-runner

```bash
$ docker run -d \
-v /docker/gitlab-runner/config:/etc/gitlab-runner \
-v /var/run/docker.sock:/var/run/docker.sock \
--name gitlab-runner \
--privileged=true  \
gitlab/gitlab-runner:latest
```

#### [安装 jenkins](https://www.cnblogs.com/esofar/p/11163583.html)

tips: 要更换阿里云加速镜像不然下不来

```bash
$ vim /etc/docker/daemon.json
{
"registry-mirrors":[
  "https://hub-mirror.c.163.com",
  "https://registry.aliyuncs.com",
  "https://registry.docker-cn.com",
  "https://docker.mirrors.ustc.edu.cn"
  ]
}
$ systemctl restart docker
```

```bash
$ docker search jenkins
$ docker pull jenkins/jenkins:latest
$ docker run -d \
-p 5000:8080 \
-v /docker/jenkins/:/var/jenkins_home \
--privileged=true \
--name jenkins \
jenkins/jenkins

# 推荐使用这个镜像构建
$ docker pull jenkinsci/blueocean
$ docker run -u root \
-d \
-p 5000:8080 \
-p 50000:50000 \
-v /docker/jenkins:/var/jenkins_home \
--name jenkins \
jenkinsci/blueocean
```

遇到的 bugs:

1. 修改/var/lib/jenkins/updates/default.json

jenkins 在下载插件之前会先检查网络连接，其会读取这个文件中的网址。默认是：访问谷歌，这就很坑了，服务器网络又不能 FQ，所以将图下的 google 改为 `www.baidu.com`即可，更改完重启服务。

<img src="https://images2018.cnblogs.com/blog/1235834/201807/1235834-20180723182817537-757932915.png" style="display: block; margin: auto;"/>

2. 修改/var/lib/jenkins/hudson.model.UpdateCenter.xml

该文件为 jenkins 下载插件的源地址，改地址默认 jenkins 默认为：`https://updates.jenkins.io/update-center.json`，就是因为 https 的问题，此处我们将其改为 http 即可，之后重启 jenkins 服务即可。其他国内备用地址（也可以选择使用）：

`https://mirrors.tuna.tsinghua.edu.cn/jenkins/updates/update-center.json`

`http://mirror.esuni.jp/jenkins/updates/update-center.json`

#### 安装 redis

```bash
$ docker pull redis

# 安装 redis 配置文件(默认docker容器不会创建这个)
$ wget http://download.redis.io/redis-stable/redis.conf
```

`修改配置文件`

- bind 127.0.0.1 -::1 #这行要注释掉，解除[本地连接](https://www.zhihu.com/search?q=本地连接&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A2672255852})限制
- protected-mode no #默认 yes，如果设置为 yes，则只允许在本机的回环连接，其他机器无法连接。
- daemonize no #默认 no 为不[守护进程](https://www.zhihu.com/search?q=守护进程&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A2672255852})模式，docker 部署不需要改为 yes，docker run -d 本身就是后台启动，不然会冲突
- requirepass 123456 #设置密码
- appendonly yes #持久化

`运行容器`

```bash
$ docker run \
--name redis \
-p 6379:6379 \
-v /var/redis/redis.conf:/etc/redis/redis.conf \
-v /var/redis/data:/data \
-d redis redis-server /etc/redis/redis.conf \
--appendonly yes \
--requirepass jzy
```

```bash
# 查看 redis 容器启动日志
☁  redis  docker logs --since 30m redis
1:C 04 Feb 2023 02:25:47.418 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
1:C 04 Feb 2023 02:25:47.419 # Redis version=6.2.6, bits=64, commit=00000000, modified=0, pid=1, just started
1:C 04 Feb 2023 02:25:47.419 # Configuration loaded
1:M 04 Feb 2023 02:25:47.420 * monotonic clock: POSIX clock_gettime
1:M 04 Feb 2023 02:25:47.420 # Warning: Could not create server TCP listening socket ::1:6379: bind: Cannot assign requested address
1:M 04 Feb 2023 02:25:47.421 * Running mode=standalone, port=6379.
1:M 04 Feb 2023 02:25:47.421 # Server initialized
1:M 04 Feb 2023 02:25:47.421 # WARNING overcommit_memory is set to 0! Background save may fail under low memory condition. To fix this issue add 'vm.overcommit_memory = 1' to /etc/sysctl.conf and then reboot or run the command 'sysctl vm.overcommit_memory=1' for this to take effect.
1:M 04 Feb 2023 02:25:47.422 * Ready to accept connections
```

`进入 redis 容器`

```bash
$ docker exec -it redis redis-cli
$ auth [password]
$ ...
```

#### 安装 registry

Docker 官方的 Docker Registry 是一个基础版本的 Docker 镜像仓库，具备仓库管理的完整功能，但是没有图形化界面。因此可以考虑使用 `registry` 简易搭建一个私服仓库。

```bash
$  docker run -d \
     --restart=always \
     --name registry \
     -p 5000:5000 \
     -v registry-data:/var/lib/registry \
     registry
```

·基于 dockerc-compose 进行安装 `docker-compose.yml` [教程](https://zhuanlan.zhihu.com/p/420936752)

```bash
 version: '3.0'
 services:
   registry:
     image: registry
     volumes:
       - ./registry-data:/var/lib/registry
   ui:
     image: joxit/docker-registry-ui:static
     ports:
       - 8080:80
     environment:
       - REGISTRY_TITLE=传智教育私有仓库
       - REGISTRY_URL=http://registry:5000
     depends_on:
       - registry
```

### docker 进阶

#### 容器状态

```bash
jzy:yunshan-qingyu/ (feature/jzy✗) $ docker stats ubuntu
CONTAINER ID   NAME      CPU %     MEM USAGE / LIMIT     MEM %     NET I/O           BLOCK I/O   PIDS
0ed639cf7c23   ubuntu    0.00%     307.3MiB / 18.66GiB   1.61%     85.5MB / 1.93MB   0B / 0B     3
```

#### 网络

docker 的网络模式有四种

- bridge
- host
- none
- container

```bash
☁  ~  ifconfig
docker0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 172.17.0.1  netmask 255.255.0.0  broadcast 172.17.255.255
        inet6 fe80::42:8eff:fec7:4ffc  prefixlen 64  scopeid 0x20<link>
        ether 02:42:8e:c7:4f:fc  txqueuelen 0  (Ethernet)
        RX packets 165347  bytes 33023554 (31.4 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 194657  bytes 84005495 (80.1 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 172.22.5.29  netmask 255.255.192.0  broadcast 172.22.63.255
        inet6 fe80::216:3eff:fe06:bd88  prefixlen 64  scopeid 0x20<link>
        ether 00:16:3e:06:bd:88  txqueuelen 1000  (Ethernet)
        RX packets 63504458  bytes 9401012840 (8.7 GiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 75738874  bytes 9483268461 (8.8 GiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 10488  bytes 1065854 (1.0 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 10488  bytes 1065854 (1.0 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

veth18f2a98: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet6 fe80::f847:17ff:fe5c:2ef2  prefixlen 64  scopeid 0x20<link>
        ether fa:47:17:5c:2e:f2  txqueuelen 0  (Ethernet)
        RX packets 1880  bytes 170610 (166.6 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 2771  bytes 218901 (213.7 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

veth7f94c09: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet6 fe80::2054:99ff:feaf:181c  prefixlen 64  scopeid 0x20<link>
        ether 22:54:99:af:18:1c  txqueuelen 0  (Ethernet)
        RX packets 10966  bytes 3627135 (3.4 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 13283  bytes 1010376 (986.6 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```

`ifconfig` 列出当前主机的网卡情况

- `eth0` 是当前主机的默认网卡
- `docker0` 可以理解为是 docker 网桥交换机
- `lo` 是本机回环网卡
- `veth` 是 docker 容器以 `bridge` 模式运行虚拟网卡

- `bridge` 模式是 docker 默认的模式，每个 docker 容器内部都要自己完整的网卡以及网络设置（`eth0`），与宿主机交换的过程是通过 docker0 完成。 docker0 会虚拟出 `veth` 网卡一一对应容器网卡进行网络通信。
- `host` 模式指的是容器复用宿主机的网络配置
- `none` 模式指的是容器没有网络配置
- `container` 模式指的是复用其他容器的网络配置

```bash
# 以 bridge 模式的网络状态
/ $ ifconfig
eth0      Link encap:Ethernet  HWaddr 02:42:AC:11:00:04
          inet addr:172.17.0.4  Bcast:172.17.255.255  Mask:255.255.0.0
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:7 errors:0 dropped:0 overruns:0 frame:0
          TX packets:0 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:0
          RX bytes:586 (586.0 B)  TX bytes:0 (0.0 B)

lo        Link encap:Local Loopback
          inet addr:127.0.0.1  Mask:255.0.0.0
          UP LOOPBACK RUNNING  MTU:65536  Metric:1
          RX packets:0 errors:0 dropped:0 overruns:0 frame:0
          TX packets:0 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000
          RX bytes:0 (0.0 B)  TX bytes:0 (0.0 B)
```

#### 自定义网络

自定义网络的意思是在原有网络的基础上创建新的有标识含义的专有网络给容器使用，可以解决的问题：<u>不同容器之间不能通过容器名 ping 通，可以完美避开之前需要指定固定 ip 才能完成容器之间通信的问题</u>

- 默认有的网络 `network`

```bash
☁  ~  docker network ls
NETWORK ID          NAME                DRIVER              SCOPE
c4416e6f31c3        bridge              bridge              local
28a7a6822118        host                host                local
963a4ed0f214        none                null                local
```

- 创建新的网络。创建新网络默认使用的网络模式是 `bridge`

```bash
☁  ~  docker network create base
32c2fe4fc21df6f0e808444a48f7b00f9adfc16aacc0e4b2e3d2d82b5e747892
☁  ~  docker network ls
NETWORK ID          NAME                DRIVER              SCOPE
32c2fe4fc21d        base                bridge              local
c4416e6f31c3        bridge              bridge              local
28a7a6822118        host                host                local
963a4ed0f214        none                null                local
```

- 把容器加入到指定网路 `--network`

```bash
☁  ~  docker run -it --name alpine --network base alpine
```

- 查看当前容器网络情况 `inspect`

```bash
☁  ~  docker inspect alpine | tail -n 22
            "Networks": {
                "base": {
                    "IPAMConfig": null,
                    "Links": null,
                    "Aliases": [
                        "f1b7ec152df4"
                    ],
                    "NetworkID": "32c2fe4fc21df6f0e808444a48f7b00f9adfc16aacc0e4b2e3d2d82b5e747892",
                    "EndpointID": "1e5a88d58794e30464cd215a671cb34c804c196a68daf527380795b50c4a3998",
                    "Gateway": "172.18.0.1",
                    "IPAddress": "172.18.0.2",
                    "IPPrefixLen": 16,
                    "IPv6Gateway": "",
                    "GlobalIPv6Address": "",
                    "GlobalIPv6PrefixLen": 0,
                    "MacAddress": "02:42:ac:12:00:02",
                    "DriverOpts": null
                }
            }
        }
    }
]
```

### Dockerfile

> Dockerfile 本质上就是通过关键字（保留字）创建层层镜像 [Dockerfile 最佳实践](https://yeasy.gitbook.io/docker_practice/appendix/best_practices#dockerfile-zhi-ling)

Dockerfile 构建流程

- docker 从基础镜像运行一个容器
- 执行一条指令并对容器进行修改
- 执行类似 docker commit 的操作提交一个新的容器
- docker 再基于刚提交的镜像运行一个新容器
- 执行 dockerfile 中的下一条指令直至所有指令执行完成

```bash
☁  yunshan-qingyu [feature/jzy] ⚡ docker build -t yunshan-qingyu .
[+] Building 291.6s (14/14) FINISHED
 => [internal] load build definition from Dockerfile                   0.1s
 => => transferring dockerfile: 280B                                   0.0s
 => [internal] load .dockerignore                                      0.0s
 => => transferring context: 136B                                      0.0s
 => [internal] load metadata for docker.io/library/nginx:alpine        0.3s
 => [internal] load metadata for docker.io/library/node:16-alpine     15.3s
 => CACHED [stage-1 1/2] FROM docker.io/library/nginx:alpine@sha256:e  0.0s
 => [internal] load build context                                    229.1s
 => => transferring context: 455.08MB                                229.0s
 => [builder 1/6] FROM docker.io/library/node:16-alpine@sha256:0e071f  0.0s
 => CACHED [builder 2/6] WORKDIR /build                                0.0s
 => CACHED [builder 3/6] COPY package*.json /build                     0.0s
 => CACHED [builder 4/6] RUN npm ci                                    0.0s
 => [builder 5/6] COPY . /build                                        9.2s
 => [builder 6/6] RUN npm run build                                   36.5s
 => [stage-1 2/2] COPY --from=builder /build/yunshan-qingyu /usr/shar  0.1s
 => exporting to image                                                 0.1s
 => => exporting layers                                                0.0s
 => => writing image sha256:b6c5f661bebcdf06ced43007292ee85ad64e750c0  0.0s
 => => naming to docker.io/library/yunshan-qingyu
```

#### FROM

> 基于 docker hub 仓库的远程镜像

#### MAINTAINER

> 镜像作者

#### RUN

> 等价于在某个容器内部执行 bash / shell 等脚本命令

# docker compose

[^背景]: 在日常工作中，经常会碰到需要多个容器相互配合来完成某项任务的情况。例如要实现一个 Web 项目，除了 Web 服务容器本身，往往还需要再加上后端的数据库服务容器，甚至还包括负载均衡容器等

compose 可以理解为是使用一个`docker-compose.yml`配置文件管理若干的容器的启动来实现容器编排。

### 安装

```bash
$  curl -L https://github.com/docker/compose/releases/download/1.23.1/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
# 速度太慢，改用中国镜像
$ curl -L https://get.daocloud.io/docker/compose/releases/download/1.29.1/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
```

·配置执行权限

```bash
$ sudo chmod +x /usr/local/bin/docker-compose
```

·添加 bash 补全命令

```bash
$  curl -L https://raw.githubusercontent.com/docker/compose/1.29.1/contrib/completion/bash/docker-compose > /etc/bash_completion.d/docker-compose
```

·如果上述出现错误，大概就是 DNS 相关问题了

```bash
$  echo "199.232.68.133 raw.githubusercontent.com" >> /etc/hosts
```

### 基础配置

以下为基于 flask 嵌入 redis 的 docker-compose.yml 配置

```yaml
version: '3'

services:
  ocr:
    container_name: flask
    build: .
    ports:
      - 3500:5000
    links:
      - redis
    volumesdocker-compose 整体是将若干个docker任务组装起来的工具，解决多任务/多服务部署的场景

:
      - /usr/local/share/nltk_data:/root/nltk_data
    privileged: true # 设置容器权限为 root(不安全)
  redis:
    container_name: redis
    image: redis:alpine
```

### network

compose 在应用启动的时候会建立一个默认网络，名称为 docker-compose.yml 所在目录名称小写形式加上 `_default`

```bash
❯ docker-compose -f ~/Documents/compose/wechat.yml up -d
[+] Building 0.0s (0/0)
[+] Running 2/2
 ✔ Network compose_default  Created                                        0.2s
 ✔ Container wechat         Started                                        0.8s
```

> :information_source: 但是可能存在这么一个场景：我在一个文件系统中存在多个 compose 文件，对应的比如有 nginx、wechat 等等，每次启动的时候其实我并不想他们公用一个网络，此时就需要自定义 network

```yaml
networks:
  wechat_net: # 容器网络的别名
    name: wechat # 真正创建出来的名字
    driver: bridge
```

以上 compose 会自动创建一个名为 wechat 的网络

```yaml
networks:
  nginx_net:
    external: true
    name: nginx # docker全局存在的网络名
```

以上方式是基于 docker 已经存在 wechat 网络的基础上，如果不存在可以先创建

官网对 network 定义的说明：https://docs.docker.com/compose/networking/

### volumes

compose 通常我们在写的时候都会涉及到目录挂载来保障容器销毁时数据不会随着消失，比如说像下面的 `nginx`

```yaml
version: "3"

networks:
  nginx:
    external: true
    name: nginx

services:
  nginx:
    image: nginx:latest
    ports:
      - 8088:80
    volumes:
      - /home/jzy/nginx:/etc/nginx
    networks:
      - nginx
```

但是其实上面写是有问题的，首先理解下 `volume mount` & `bind mount`，两者都是都是绕过了 container 文件系统，但使用上有区别

- `volume mount` 由 docker 管理，数据存储在`/var/lib/docker/volumes/[volume_name]/_data`
- `bind mount` 则完全是依赖于主机的目录结构和操作系统

> :warning: 实际使用注意：如果绑定挂载到容器中的一个非空的目录且当前主机上的目录为空的话，`volume` 会拷贝容器目录的内容，而 `bind` 会直接清空 [说明](https://www.cnblogs.com/chuanzhang053/p/16620053.html)

因此对于上面 `docker-compose` 启动 `nginx`，一开始主机上的目录肯定是空，那么实际也一定会把容器内容清空 ，因此最好使用 `volumes`，不然就得先自己去启动一个 `nginx` 容器然后再通过拷贝文件的方式拷贝到宿主机（以上的解决方法）

```yaml
services:
  nginx:
    image: nginx:latest
    ports:
      - 8088:80
    volumes:
      - nginx:/etc/nginx
    networks:
      - nginx
volumes:
  nginx:
```

### 应用启动

> 包含各种应用启动的配置文件

```yaml
version: "3"

services:
  mysql:
    image: mysql
    # restart: always
    container_name: mysql
    environment:
      MYSQL_ROOT_PASSWORD: jzy
      TZ: Asia/Shanghai
    ports:
      - 3306:3306
    volumes:
      - ~/docker-compose/mysql/data:/var/lib/mysql
      - ~/docker-compose/mysql/config/my.cnf:/etc/mysql/my.cnf
    command: --max_connections=1000
      --character-set-server=utf8mb4
      --collation-server=utf8mb4_general_ci
      --default-authentication-plugin=mysql_native_password
```
