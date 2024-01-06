# 11 月积累

## 前端监控

> 其实这部分的内容应该归到十月份，但 10 月份总结就放到现在

1. 为什么要做监控？
2. 要监控什么内容？
3. 怎么做监控？

- 第一个问题（为什么做监控）：监控可以帮助我们及时发现问题、快速定位问题。像在错误发生的时候我们已经将相关错误分类上报，因此对于某类问题可以通过监控系统快速查询匹配。监控并不只意味着错误监控，像性能、数据埋点都可以归属为监控内容（顾名思义全方位监控）
- 第二个问题（要监控什么内容）：具体内容可分为
  - `页面的性能情况`：包括各阶段加载耗时，一些关键性的用户体验指标
  - `用户的行为情况`：包括 `PV`、`UV`、访问来路，路由跳转等
  - `接口的调用情况`：通过 `http` 访问外部接口的成功率、耗时情况等
  - `页面的稳定情况`：各种前端异常等
  - `数据上报及优化`：如何将监控捕获到的数据优雅的上报
- 第三个问题（怎么做监控）
  - 性能数据获取（ `PerformanceObserver` ）
  - 错误数据获取（`window.onerror` ……）
  - 用户行为数据获取（`window.location`、`navigator`……）

### 前端错误捕获

[^介绍]: [前端错误捕获](https://juejin.cn/post/7100841779854835719#heading-5)

```ts
// 错误类型
export enum mechanismType {
  JS = "js",
  RS = "resource",
  UJ = "unhandledrejection",
  HP = "http",
  CS = "cors",
  VUE = "vue",
}
```

> 运行时 `JS` 错误捕获方法：`window.onerror`、`window.addEvenetListener('error')`

两者的区别：

1.  `window.onerror` 只能存在一个且后声明的覆盖前面声明的，`window.addEvenetListener('error')` 可以声明多个，按添加顺序触发执行
2.  `window.addEvenetListener('error')` 能够处理静态资源错误

<img src="./oppo-work/202311/work.assets/image-20231108004503666.png" style="display: block; margin: auto;"/>

:game_die: 解析运行时错误堆栈调用：可以使用开源库 [`error-stack-parser`](https://www.npmjs.com/package/error-stack-parser/v/2.0.5), 传入 `error` 对象可以帮助解析出调用堆栈以及具体错误发生的行号、列号…….。（虽然没具体深入了解源码，但是基本的实现应该如下，基于正则处理 `error message string`）

```js
// 正则表达式，用以解析堆栈split后得到的字符串
const FULL_MATCH =
  /^\s*at (?:(.*?) ?\()?((?:file|https?|blob|chrome-extension|address|native|eval|webpack|<anonymous>|[-a-z]+:|.*bundle|\/).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i;

// 限制只追溯10个
const STACKTRACE_LIMIT = 10;

// 解析每一行
export function parseStackLine(line: string) {
  const lineMatch = line.match(FULL_MATCH);
  if (!lineMatch) return {};
  const filename = lineMatch[2];
  const functionName = lineMatch[1] || "";
  const lineno = parseInt(lineMatch[3], 10) || undefined;
  const colno = parseInt(lineMatch[4], 10) || undefined;
  return {
    filename,
    functionName,
    lineno,
    colno,
  };
}
```

> 静态资源加载异常

静态资源加载异常：我们界面上的 `img 图片`、`CDN 资源` **突然失效了、打不开了**

```js
window.addEventListener("error", handler, true);
```

使用 `addEventListener` 捕获资源错误时，一定要将 **第三个选项设为 true**，因为资源错误没有冒泡，所以只能在捕获阶段捕获。同理，由于 `window.onerror` 是通过在冒泡阶段捕获错误，所以无法捕获资源错误。

> Promise 异常

`Promise`异常： `Promise` 被 `reject` 且没有被 `catch` 处理的时候，就会抛出 `Promise异常` （包括 `Promise` 内的 `JS` 错误）

```js
window.addEventListener("unhandledrejection", (event) => handler(event), true);
```

注意：`promise` 报错只能获得具体报错信息，获取不到具体报错行号、列号

> HTTP 请求异常

`HTTP` 异常：通常可以理解为是针对业务接口请求异常（400、500）或者是业务接口抛出的业务错误。

从捕获角度来说，因为 `HTTP` 请求地层逻辑是基于 `XMLHttpRequest` | `fetch` 完成，因此可以重写方法来包含错误捕获逻辑

```ts
/* XMLHttpRequest 捕获指标 */
export interface httpMetrics {
  method: string;
  url: string | URL;
  body: Document | XMLHttpRequestBodyInit | null | undefined | ReadableStream;
  requestTime: number;
  responseTime: number;
  status: number;
  statusText: string;
  response?: any;
}
```

- 重写 `XMLHttpRequest`

```ts
export const proxyXmlHttp = (
  sendHandler: Function | null | undefined,
  loadHandler: Function
) => {
  if (
    "XMLHttpRequest" in window &&
    typeof window.XMLHttpRequest === "function"
  ) {
    const oXMLHttpRequest = window.XMLHttpRequest;
    if (!(window as any).oXMLHttpRequest) {
      // oXMLHttpRequest 为原生的 XMLHttpRequest，可以用以 SDK 进行数据上报，区分业务
      (window as any).oXMLHttpRequest = oXMLHttpRequest;
    }
    (window as any).XMLHttpRequest = function () {
      const xhr = new oXMLHttpRequest();
      const { open, send } = xhr;
      let metrics = {} as httpMetrics;

      xhr.open = (method, url) => {
        metrics.method = method;
        metrics.url = url;
        open.call(xhr, method, url, true);
      };

      xhr.send = (body) => {
        metrics.body = body || "";
        metrics.requestTime = new Date().getTime();
        // sendHandler 可以在发送 Ajax 请求之前，挂载一些信息，比如 header 请求头
        if (typeof sendHandler === "function") sendHandler(xhr);
        send.call(xhr, body);
      };
      xhr.addEventListener("loadend", () => {
        const { status, statusText, response } = xhr;
        metrics = {
          ...metrics,
          status,
          statusText,
          response,
          responseTime: new Date().getTime(),
        };
        if (typeof loadHandler === "function") loadHandler(metrics);
        // xhr.status 状态码
      });
      return xhr;
    };
  }
};
```

> 跨域脚本错误

跨域脚本错误：存在跨域引用资源的情况

```js
window.addEventListener("error", (event) => handler(event), true);
```

通过以上代码可以捕获这种类型错误，但是返回的永远是 `Script error`，也没有获取到`行号`、`列号`、`文件名`等的信息（其实这是浏览器的一个`安全机制`：当跨域加载的脚本中发生语法错误时，浏览器出于安全考虑，不会报告错误的细节，而只报告简单的 `Script error`。浏览器只允许同域下的脚本捕获具体错误信息，而其他脚本只知道发生了一个错误，但无法获知错误的具体内容（控制台仍然可以看到，JS 脚本无法捕获）

- 解决方案

  1. 添加`crossorigin="anonymous"`属性。

     ```js
     <script
       src="http://crossorigin/texterror.js"
       crossorigin="anonymous"
     ></script>
     ```

  2. 静态资源所在服务器支持 `CORS`

## 项目优化

> 基于 webpack 来讲，可以从打包速度上进行优化，也可以从 web 性能角度进行优化

### 打包速度

- `dll`：共享函数库，webpack 中也有内置 `dll` 的功能，它指的是可以将可以共享，并且不经常改变的代码，抽取成一个共享的库。从实现步骤来说：

  - 创建 `.dll.js` 文件，包含一些不经常改变的三方包
  - 创建 映射文件 `mainfest.json` ，建立`.dll.js` 模块映射
  - `add-asset-html-webpack-plugin` 插件帮助引入 `.dll.js` 文件

  ```js
  // webpack.dll.js
  const webpack = require("webpack");

  module.exports = {
    mode: "production",
    // 打包一个大 chunk
    // vendors: ['react', 'mobx', 'mobx-react', 'socket.io-client']
    // 分开打包多个第三方 chunk
    entry: {
      lodash: ["lodash"],
      jquery: ["jquery"],
    },
    output: {
      filename: "[name].dll.js",
      path: path.resolve(__dirname, "../dll"),
      library: "[name]",
    },
  };
  ```

  ```js
  // webpack.config.js
  const path = require("path");
  const fs = require("fs");
  const AddAssetHtmlWebpackPlugin = require("add-asset-html-webpack-plugin");

  const plugins = [];

  const files = fs.readdirSync(path.resolve(__dirname, "../dll"));
  files.forEach((file) => {
    // 自动引入 dll 文件
    if (/.*\.dll.js/.test(file)) {
      plugins.push(
        new AddAssetHtmlWebpackPlugin({
          filepath: path.resolve(__dirname, "../dll", file),
        })
      );
    }
    // 建立映射关系
    if (/.*\.manifest.json/.test(file)) {
      plugins.push(
        new webpack.DllReferencePlugin({
          manifest: path.resolve(__dirname, "../dll", file),
        })
      );
    }
  });

  module.exports = {
    plugins,
  };
  ```

### 网页性能

> FP、FCP、LCP…… 这些指标可以作为性能分析手段。从优化层面也是从不同方面来尽可能提升这些指标数值

## 知识文章阅读

- [Nest 微服务](https://juejin.cn/post/7207637337571901495)：微服务通过 `TCP` 与主服务进行通信，主 `controller` 接收 HTTP 请求然后建立 TCP 连接与微服务进行数据通信，微服务接收数据再在内部 `service` 进行处理。

  <img src="./oppo-work/202311/work.assets/image-20231116001146060.png" style="display: block; margin: auto;"/>

- [qiankun 样式隔离](https://juejin.cn/post/7184419253087535165)：qiankun 本身有两种样式隔离方案

  - shadow dom：父子互相隔离。QU：子容器内组件如果挂载到 body 上样式设置失效
  - scoped：子容器样式不影响父容器，父容器可以改变子容器（类似于 Vue scoped）。QU：无法设置挂载到 body 上组件样式

  较好的解决方案是使用 `Vue`、`React` 本身的样式隔离方案（ `Vue scoped`、`React CSSModule`）
