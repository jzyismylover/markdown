# nginx

> 一句话介绍 ：`nginx` 是开源轻量 web 服务器，能实现反向代理、负载均衡

## 配置文件

`nginx` 配置文件基本由三部分组成

```bash
...              #全局块

events {         #events块
   ...
}

http      #http块
{
    ...   #http全局块
    server        #server块
    { 
        ...       #server全局块
        location [PATTERN]   #location块
        {
            ...
        }
        location [PATTERN] 
        {
            ...
        }
    }
    server
    {
      ...
    }
    ...     #http全局块
}
```

- 全局块：设置一些影响 nginx 服务器整体运行的配置指令

- events块：影响nginx服务器与用户的网络连接

- http 块：包括http全局块和server块，是服务器配置中最频繁的部分，包括配置代理、缓存、日志定义等绝大多数功能
  - server：配置虚拟主机相关参数
  - location：配置请求路由，以及各种页面的处理



## 反向代理

反向代理通常指的是在服务端设置一个中间者的角色，以此作为桥梁访问实际需要访问的域名。

> 客户端对代理服务器是无感知的，客户端不需要做任何配置，用户只请求反向代理服务器，反向代理服务器选择目标服务器，获取数据后再返回给客户端。反向代理服务器和目标服务器对外而言就是一个服务器，只是暴露的是代理服务器地址，而隐藏了真实服务器的IP地址。

反向代理有什么用？

- 负载均衡：合理分配服务器负载
- 请求缓存：应对一段时间内多个相同资源请求，首次请求资源获得结果则缓存，下次重新请求的时候可以直接从缓存中获取数据而不需要在通过代理转接到目的服务器重新获取。
- 安全：作为代理服务请求不直接送达目的主机，可对某些恶意请求进行过滤

```yaml
server {
    listen       80;
    listen  [::]:80;
    server_name  localhost; # 监听的主机

    #access_log  /var/log/nginx/host.access.log  main;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
    }
	
	# 通过 nest1 nest2 区分两个不同的服务
	
    location /nest1 {
      rewrite ^/nest1/(.*) /$1 break;
      proxy_pass http://10.173.113.95:3000; # 代理到指定地址
      # 以下是为了解决跨域问题
      add_header 'Access-Control-Allow-Methods' 'GET,OPTIONS,POST' always;
      add_header 'Access-Control-Allow-Origin' $http_origin always;
      add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type, X-Requested-With, Cache-Control' always;
      if ($request_method = OPTIONS ) { return 200; }
    }

    location /nest2 {
      rewrite ^/nest2/(.*) /$1 break;
      proxy_pass http://10.173.113.95:3001;
      # 以下是为了解决跨域问题
      add_header 'Access-Control-Allow-Methods' 'GET,OPTIONS,POST' always;
      add_header 'Access-Control-Allow-Origin' $http_origin always;
      add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type, X-Requested-With, Cache-Control' always;
      if ($request_method = OPTIONS ) { return 200; }
    }

   
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}

```



## 负载均衡

负载均衡主要的策略就是实际在请求的时候面向一个地址比如 `localhost:8080`，但实际在处理请求的时候通过权重分配把请求更多地分发到空闲的机子上保证资源分配处理合理性。

```yaml
# 定义当前负载的主机名
upstream nest_server{
  server 10.173.113.95:3000 weight=2; #定义权重
  server 10.173.113.95:3001 weight=1;
  #每有请求到达nest_server，按照两个到1号机一个到2号机的策略进行分配
}

server {
    listen       80;
    listen  [::]:80;
    server_name  localhost; # 监听的主机
	
    location /nest1 {
      rewrite ^/nest1/(.*) /$1 break;
      proxy_pass http://nest_server; # 代理到指定地址
      # 以下是为了解决跨域问题
      add_header 'Access-Control-Allow-Methods' 'GET,OPTIONS,POST' always;
      add_header 'Access-Control-Allow-Origin' $http_origin always;
      add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type, X-Requested-With, Cache-Control' always;
      if ($request_method = OPTIONS ) { return 200; }
    }
}
```



## 应用问题

1. 实际 location 配置过程中通常会出现对 / 的疑问 [demo 说明](https://juejin.cn/post/7083306471697416228)，比如

```yaml
location /nest1 {
	proxy_pass http://xxx.xxx.xxx.xxx # 以下替换为 target
}
```

```yaml
location /nest1/ {
	proxy_pass http://xxx.xxx.xxx.xxx/
}
```

以上两者的效果其实完全不一样，假设当前nginx监听的 server_name = `localhost`假如请求的是 `http://localhost/nest1/start`

- 第一个实际会转发到 `http://target/nest1/start`

- 第二个实际会转发到 `http://target/start`

因此在实际使用的时候要考虑是否需要保留前缀别名段

2. 实际在配置 proxy_pass 的时候

```yaml
proxy_pass http://localhost
proxy_pass http://127.0.0.1
```

上面两种写法其实都会出现 502 bad gateway 的报错



## 路径匹配规则

—— [参考](https://www.cnblogs.com/yuncong/p/12427480.html)

| 模式                | 含义                                                         |
| ------------------- | :----------------------------------------------------------- |
| location = /uri     | = 表示精确匹配，只有完全匹配上才能生效                       |
| location ^~ /uri    | ^~ 开头对URL路径进行前缀匹配，并且在正则之前。               |
| location ~ pattern  | 开头表示区分大小写的正则匹配                                 |
| location ~* pattern | 开头表示不区分大小写的正则匹配                               |
| location /uri       | 不带任何修饰符，也表示前缀匹配，但是在正则匹配之后           |
| location /          | 通用匹配，任何未匹配到其它location的请求都会匹配到，相当于switch中的default |

- 首先精确匹配 `=`
- 其次前缀匹配 `^~`
- 其次是按文件中顺序的正则匹配
- 然后匹配不带任何修饰的前缀匹配。
- 最后是交给 `/` 通用匹配
- 当有匹配成功时候，停止匹配，按当前匹配规则处理请求

> 注意：前缀匹配，如果有包含关系时，按**最大匹配原则**进行匹配。比如在前缀匹配：`location /dir01` 与 `location /dir01/dir02`，如有请求 `http://localhost/dir01/dir02/file ` 将最终匹配到 `location /dir01/dir02`
