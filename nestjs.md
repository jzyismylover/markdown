> nest.js 是构建 node 后端服务高扩展框架，总体可以由 `controller`、`modules`、`service` 构成

## controller

又名控制器，负责处理传入的请求并向客户端返回响应。

![img](https://docs.nestjs.com/assets/Controllers_1.png)

```bash
# 快速生成一个控制器
$ nest g con <path>
```

一个基本的控制器如下

```typescript
@Controller('file-process') // base path
export class FileProcessController {
  constructor(private fileService: FileProcessService) {}

  @Post('txt') // extra path
  async parseTxt(
  }
}
```

总的请求路径是 `/file-proces/txt`。



- 对于一个 route 来说，可以为 get、post、delete....

```typescript
@Controller('cats')
export class CatsController {
  @Post() // 匹配 post 请求
  create(): string {
    return 'This action adds a new cat';
  }

  @Get() // 匹配 get 请求
  findAll(): string {
    return 'This action returns all cats';
  }
}
```



- 同时也允许我们从对应的 route 中解析得到我们需要的信息比如 request、response.... [详情请看](https://docs.nestjs.com/controllers#request-object)

```typescript
@Controller()
export class CatsController {
  @Get()
  findAll(@Req() request: Request): string { // 解析得到请求(请求头、请求体...)
    return 'This action returns all cats';
  }
}
```

```typescript
@Get('user:id') // /user/1
findOne(@Param() params: any): string { // 获得 params
  console.log(params.id); // 1 
  return `This action returns a #${params.id} cat`;
}
```



- 路由泛匹配

```typescript
@Get('ab*cd') // 可以使用正则语法进行路由泛匹配
findAll() {
  return 'This route uses a wildcard';
}
```

