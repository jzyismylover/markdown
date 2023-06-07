## docker-compose

docker-compose 整体是将若干个docker任务组装起来的工具，解决多任务/多服务部署的场景

>  用官方一点的话说就是 docker-compose 能够以单引擎模式进行多容器应用部署和管理



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

以上方式是基于docker已经存在wechat网络的基础上，如果不存在可以先创建

官网对 network 定义的说明：https://docs.docker.com/compose/networking/



### volumes

compose 通常我们在写的时候都会涉及到目录挂载来保障容器销毁时数据不会随着消失，比如说像下面的 `nginx`

```yaml
version: '3'

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

因此对于上面  `docker-compose` 启动 `nginx`，一开始主机上的目录肯定是空，那么实际也一定会把容器内容清空 ，因此最好使用 `volumes`，不然就得先自己去启动一个 `nginx` 容器然后再通过拷贝文件的方式拷贝到宿主机（以上的解决方法）

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

