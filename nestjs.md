> nest.js 是构建 node 后端服务高扩展框架，总体可以由 `controller`、`modules`、`service` 构成

- 全局安装 nest

```bash
$ pnpm add -g @nestjs/cli
```

- 创建控制器

```bash
$ nest g controller <path>
```

- 创建 `service`

```bash
$ nest g controller <path>
```

- 创建 `model`

```bash
$ nest g module <path>
```



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



## pipe

> 管道模块，同时也包括了 `techniques` 里面的 `validation`。

`pipe` 负责 `controller` 参数传入预校验以及参数转换，内置了很多转换管道，如下即为整形转换

```ts
@Get(':id')
async findOne(@Param('id', ParseIntPipe) id: number) {
  return this.catsService.findOne(id);
}
```

当然也允许自定义

```ts
@Injectable()
export class TransformStrToIntPipe implements PipeTransform {
  params = []
  constructor(params?: string[]) {
    this.params = params || []
  }
  // 转换 body 中 numberString 参数
  transform(value: any, metadata: ArgumentMetadata) {
    const re = {}
    for(const key in value) {
      this.params.includes(key) ?
        (re[key] = Number(value[key]))
        : (re[key] = value[key]) 
    }
    return re
  }
}
```

- `data`： 客户端传入的 `dto`
- `metadata` ：包含三个参数（data, type, metatype）
  - data: 未知
  - type: 来自 `body` / `param` / `query`
  - metatype: `dto class`







## 执行上下文

> 对于这个概念，我的理解是 nest 暴露了能够访问整个请求过程中一些阶段的参数，像元编程注入到控制器的参数，在 guard / intercepter... 获取请求上下文等等

实际有两个类可以完成上诉任务 `ArgumentHost` & `ExecutionContext`

### ArgumentHost

`all.filter.ts`： 处理全局异常

```ts
@Catch()
export class AllFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // HttpArgumentsHost
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      exception: String(exception)
    });
  }
}
```

`auth.guard.ts`

- `ExecutionContext` 继承 `ArgumentsHost` 用于获取控制器的相关信息，包括类名以及对应请求处理方法别名

```TS
export interface ExecutionContext extends ArgumentsHost {
  // 当前控制器类名
  getClass<T>(): Type<T>;
    
  // 处理指定请求的控制器方法名
  getHandler(): Function;
}
```

- 实际可以基于上诉方法使用元数据编程将相关信息注入到控制器中然后在 `guard` 中进行相关身份或者权限的校验

```ts
// 元编程定义数据
import { SetMetadata } from '@nestjs/common';
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

// guard 校验元数据
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);
    if(isPublic) {
      return true
    }
    // 进行token校验...
}
```

> 上面使用到了 `getAllAndOverride` 方法，该方法的含义是如果 class & method 同时注入了相同元数据的话 method 会覆盖 class 的值。常见的还有 `getAllAndMerge`，处理的机制是合并 method & class 定义的值 —— ['user', 'admin']



## 数据校验

> 对应官网 validation 章节：主要介绍的是对入参参数的类型校验以及 nest 里面支持自动进行相关类型转换的机制

```typescript
```



## cache

> nest 缓存机制，即对于给定符合条件的请求会跳过处理直接返回结果

- 下载对应的依赖包

```bash
$ npm install @nestjs/cache-manager cache-manager
```

- 自定义 `controller` 缓存策略

```ts
@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    // 获取当前请求上下文
    const { httpAdapter } = this.httpAdapterHost;

    const isGetRequest = httpAdapter.getRequestMethod(request) === 'GET';
    const excludePaths = [
      // 需要排除的路径
    ];
    if (
      !isGetRequest ||
      (isGetRequest &&
        excludePaths.includes(httpAdapter.getRequestUrl(request)))
    ) {
      return undefined;
    }
    return httpAdapter.getRequestUrl(request);
  }
}
```



## 序列化

> 官网在 `serialization` 章节介绍如何去定义 `实体`且在其中运用相关规则去更改返回数据。因此可以理解为序列化就是处理返回结果的工具

```ts
// user.controller.ts
  @Get('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async getUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.getUserById(id);
    return new UserEntity(user) // 必须以实例返回才能触发 Interceptor
  }
```

```ts
// user.entity.ts
export class UserEntity {
  id: number
  username: string

  @Exclude()
  password: string

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial)
  }
}
```

因此对于上诉代码实际产生的结果是会排除 `password` 参数，如下 `json`

```json
{
    "id": 1,
    "username": "john",
    "email": "3011543110@qq.com"
}
```



## version

> 官网 `version` 章节主要说的是对于 url 版本的设定

```ts
@Controller('users')
export class UsersController {
  @Get()
  @Version('1') // 对应 url /v1/users
  findAll() {
    return 'findAll()';
  }

  @Get(':id') // 对应 url /users/1
  findOne(@Param('id') id: string) {
    return `findOne(${id})`;
  }
}
```



## cookie

> cookie 的存在其实为了更加安全地进行数据传输以及相关校验，实际上对于 `jwt` 来说没有什么限制，而 cookie 允许对 `域名`、`路径` 进行限制，浏览器在发送请求会根据条件自动上传 `cookie` ，对一些非常情景起屏障作用。[更多 cookie 的描述](https://www.freecodecamp.org/chinese/news/everything-you-need-to-know-about-cookies-for-web-development/)

```ts
@Public()
@Post('/login')
async signIn(@Res({ passthrough: true }) res: Response, @Body() signDto: Record<string, any>) {
    const jwt =  await this.authService.signIn(signDto.username, signDto.password);
    res.cookie('token', jwt?.access_token);
  }
```

实际可以将 `token` 放入 `cookie` 中进行验证起到同源保护的效果。

```ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Cookies = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return data ? request.cookies?.[data] : request.cookies;
});

```

如上可通过编写一个 `拦截器` 来获取 `cookie`，既可以获取 `命名cookie` 也可以获取 `匿名 cookie`





## prisma

> prisma 是一个 orm 工具，支持继承 `mysql` 、`graql` 等等

首先明确 prisma 是由三大部分组成，`prisma client`、`prisma migrate`、`prisma studio`。

- `prisma client` ：执行对应数据检索任务
- `prisma migrate`：根据 schema 生成 sql 并更新到数据库
- `prisma studio`： 数据可视化界面

```sql
mysql> desc User; # 查看一个表的结构
mysql> show create table History; # 展示创建这个表实际需要的 sql 语句
mysql> show create table History\G # 更美观地展示 sql 语句
```



schema.prisma 文件主要包含三个组件：

- 数据源：定义你的数据库连接，并且数据库连接字符串存在 `DATABASE_URL` 环境变量中。

- 生成器：生成 `Prisma Client` — 类型安全的数据库查询构建器，用于向你的数据库发送查询语句。

- 数据模型：定义你的数据库模型。每一个模型都将被映射为底层数据库中的一张表。





实际在操作的时候遇到了些问题

1. ```text
   Error validating field `user` in model `History`: The relation field `user` on model `History` is missing an opposite relation field on the model `User`. Either run `prisma format` or add it manually.
   ```

   一开始以为是 `User` 的结构里面缺失了 `History`  需要引用关联的键，但实际检查发现并无缺少。最后的话根据报错的提示在 `bash` 输入 `npx prisma fotmat` 即可	



![Install and generate Prisma Client](https://www.prisma.io/docs/static/c24add4ac2d8984ecc6846f54a92a318/663f3/prisma-client-install-and-generate.png)

运作机制：

执行 `npx prisma migrate dev --name "init"` 后会更迭数据库

1. 保存迁移：`Prisma Migrate` 将对`prisma schema` 创建快照，并生成执行迁移所需的 SQL 命令。Prisma 会将包含 SQL 命令的迁移文件保存到一个新建的 `prisma/migrations` 文件夹内。

2. 执行迁移：`Prisma Migrate` 将执行迁移文件中的 `SQL` 命令以在数据库中创建底层数据表。
3. 生成 `Prisma Client`：Prisma 将会基于你最新的 schema 文件生成 `Prisma Client`。

### 初始化

- 初始化 `prisma` 文件夹

```bash
$ npx primsa init
```

- 更新`database` 连接

 ```prisma
 
 // 生成 prisma 查询构建器
 generator client {
   provider = "prisma-client-js"
 }
 
 // database
 datasource db {
   provider = "mysql"
   url      = env("DATABASE_URL")
 }
 
 // database table
 model User {
   id       Int       @id @default(autoincrement())
   username String    @unique
   password String
   email    String    @unique
   History  History[]
 }
 
 model History {
   id     Int    @id @default(autoincrement())
   user   User   @relation(fields: [userId], references: [id])
   userId Int
   text   String
   hash   String
 }
 
 ```

- 转换 model 语法生成 sql 并更新到数据库中

```bash
$ npx prisma migrate dev --name <comment>
```

- 下载查询器依赖

```bash
$ npm install @prisma/client
```

执行该语句后会自动执行 `prisma generate`，该命令会读取 最新`schema.prisma`生成查询器，即当前查询器对应最新数据库结构。因此该命令的执行时机最好是 —— 已经确定好数据库模型后。 



### 注入数据

通常新开一个项目的时候数据库往往是空的，要么是通过前端注入要么就是后端先模拟部分。`prisma` 有提供 `seed inject` 服务

- 注入脚本

```ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      username: 'jzyismlover',
      email: '3011543110@qq.com',
      password: 'jzy',
    },
  });

  await prisma.history.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      userId: 1,
      hash: 'hash',
      text: 'jzyismylover',
    },
  });
}

main()
  .catch((err) => console.error(err))
  .finally(() => {
    prisma.$disconnect();
  });

```

- package.json

```json
{
    "prisma": {
        "seed": "ts-node prisma/seed.ts"
    }
}
```

- 注入命令

```bash
$ npx prisma db seed
```







