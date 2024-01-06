# 前端错误捕获

前端错误监控流程：

1. 捕获错误构造需要呈现在报表汇总中的信息
2. 上报构造好的错误信息
3. 根据错误信息结构绘制报表 UI，在 UI 中进行错误定位

以下会对上述三个流程进行分析

> [前端错误捕获](https://juejin.cn/post/7100841779854835719#heading-5)

1. 为什么要捕获错误然后进行上报？
2. 从前端的角度来说捕获什么内容？
3. 如何通过 api 进行前端错误捕获？

- 第一个问题（为什么需要捕获 & 上报错误）：错误是用户使用系统功能异常的反馈，在出现问题的时候我们可以通过错误快速定位问题位置
- 第二个问题（需要捕获什么错误）：从宏观来分可以分为 js 报错 和 http 报错.

  - js 报错指的是运行时上代码段的执行错误
  - http 报错指的是网络请求的报错（网站数据的展示依赖于网络响应请求返回）

- 第三个问题（怎么捕获错误）
  - window.onerror
  - window.addEventListener('error')
  - app.prototype.errorHandler
  - window.addEventListener('unhandlerejection')

> 从微观来分类错误的类型

```ts
export enum mechanismType {
  JS = "js",
  RS = "resource",
  UJ = "unhandledrejection",
  HP = "http",
  CS = "cors",
  VUE = "vue",
}
```

## 运行时错误

> 运行时 `JS` 错误捕获方法：`window.onerror`、`window.addEvenetListener('error')`

两者的区别：

1.  `window.onerror` 只能存在一个且后声明的覆盖前面声明的，`window.addEvenetListener('error')` 可以声明多个，按添加顺序触发执行
2.  `window.addEvenetListener('error')` 能够处理静态资源错误
3.  `window.addEventListener('error')` 在捕获阶段工作

```js
window.onerror = function(message, source, lineno, colno, error)
// @return boolean
// true: prevent console
// false: console in the browser
```

- message(`String`)：错误信息
- source(`String`)：发生错误的脚本 url
- lineno(`Number`)：发送错误的行号
- colno(`Number`)：发生错误的列号
- error(`Error`)：Error 对象

```js
window.addEventListener("error", function (event) {});
```

- error( `ErrorEvent`)：错误事件对象 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/ErrorEvent)
  - extend Event
  - message(`String`)：错误信息
  - filename(`String`)：发生错误的脚本 url
  - lineno(`Number`)：发送错误的行号
  - colno(`Number`)：发生错误的列号
  - error(`Error`)：Error 对象

> js 运行时错误类型

<img src="./errorCapture/capture.assets/image-20231108004503666.png" style="display: block; margin: auto;"/>

:game_die: 解析运行时错误堆栈调用：可以使用开源库 [`error-stack-parser`](https://www.npmjs.com/package/error-stack-parser/v/2.0.5), 传入 `error` 对象可以帮助解析出调用堆栈以及具体错误发生的行号、列号…….。（虽然没具体深入了解源码，但是基本的实现应该如下，基于正则处理 `error message string`）

```js
// 正则表达式，用以解析堆栈split后得到的字符串
const FULL_MATCH =
  /^\s*at (?:(.*?) ?\()?((?:file|https?|blob|chrome-extension|address|native|eval|webpack|<anonymous>|[-a-z]+:|.*bundle|\/).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i;

// 限制只追溯10个堆栈
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

## 静态资源错误

静态资源加载异常：界面上的 `img 图片`、`CDN 资源` **突然失效了、打不开了**

```js
window.addEventListener("error", handler, true);
```

使用 `addEventListener` 捕获资源错误时，一定要将 **第三个选项设为 true**，因为资源错误没有冒泡，所以只能在捕获阶段捕获。同理，由于 `window.onerror` 是通过在冒泡阶段捕获错误，所以无法捕获资源错误。

## Promise 错误

`Promise`异常： `Promise` 被 `reject` 且没有被 `catch` 处理的时候，就会抛出 `Promise异常` （包括 `Promise` 内的 `JS` 错误）

```js
window.addEventListener("unhandledrejection", (event) => handler(event), true);
```

注意：`promise` 报错只能获得具体报错信息，获取不到具体报错行号、列号

## HTTP 错误

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

## 跨域脚本错误

跨域脚本错误：存在跨域引用资源的情况

```js
window.addEventListener("error", (event) => handler(event), true);
```

通过以上代码可以捕获这种类型错误，但是返回的永远是 `Script error`，也没有获取到`行号`、`列号`、`文件名`等的信息（其实这是浏览器的一个`安全机制`：当跨域加载的脚本中发生语法错误时，浏览器出于安全考虑，不会报告错误的细节，而只报告简单的 `Script error`。浏览器只允许同域下的脚本捕获具体错误信息，而其他脚本只知道发生了一个错误，但无法获知错误的具体内容（控制台仍然可以看到，JS 脚本无法捕获）

- 解决步骤

  1. 添加`crossorigin="anonymous"`属性。

     ```js
     <script
       src="http://crossorigin/texterror.js"
       crossorigin="anonymous"
     ></script>
     ```

  2. 静态资源所在服务器支持 `CORS`

## 框架内错误

框架内错误捕获一般指的是在 Vue、React 框架内的错误捕获机制，为什么要独立开？框架内有自己的错误捕获机制.

![错误捕获.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/363768b027f74831a7b65db6bbdbcd2b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

上图是 Vue 内部错误捕获的逻辑图，对一组件内抛出的异常其实 Vue 内部有对应的钩子函数对错误进行捕获的. 像一些运行时 JS 错误、异步 promise 错误 是能够被 handler 处理并执行我们定义的回调函数. 而不会被 window.onerror 或者 window.addEventListener('error') 捕获.

> 例外：第三方库内部的错误、setTimeout 错误、语法错误这些是没办法在框架内进行捕获

抽取错误捕获 sdk 的时候秉持的原则是尽量少改动代码，因此最好是不需要用户在 Vue.prototype.errorHandler 去添加额外代码，只需引入 sdk script 就好，那这时候就需要去重写捕获逻辑. Vue 如果不存在 errorHandler 的话最终会通过 console.error 输出错误，因此可以通过重写 console.error，在里面定义错误解析 & 上报逻辑来简化使用成本. (_iframe 作为错误上报桥梁_)

# 前端错误上报

错误上报的过程涉及错误上报的方式 & 时机.

- 错误上报的方式可以分为：beacon、image、request.
- 上报时机不同项目的定义会有差异
  - 比较常见的一种是在页面卸载前的适当时机进行上报（不阻塞主进程）
  - 在浏览器空闲的时候上报（requestIdleCallback）

## beacon

- 适用场景：上报数据量少、在页面卸载前适当时机上报

```ts
function beacon(url: string, data: any): boolean {
  return navigator.sendBeacon(url, JSON.stringify(data));
}
```

> ？？？知识存疑

## image

- 优势

  - 可以跨域发送请求
  - 不需要等待请求返回

- 缺点
  - url 有长度限制，数据太多会导致部分丢失

```ts
function imgRequest(data: ReportData, url: string): void {
  const requestFun = () => {
    const img = new Image();
    const spliceStr = url.indexOf("?") === -1 ? "?" : "&";
    img.src = `${url}${spliceStr}data=${encodeURIComponent(
      JSON.stringify(data)
    )}`;
  };
  this.queue.addFn(requestFun); // 上报队列
}
```

## request

- 优势
  - 没有数据长度、数据格式限制
- 缺点
  - 需要配置跨域

```typescript
async function xhrPost(data: ReportData, url: string): Promise<void> {
  const requestFun = () => {
    fetch(`${url}`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
  this.queue.addFn(requestFun);
}
```

> 上报封装

上诉 image & request 其实都用到了一个 addFn 函数 so why？其实上报并不是说错误发生了马上就上报的过程，就像上面说的有时机的控制. 那具体到 image & request 的上报时机应该是在浏览器空闲时间或者是通过异步的方式从而避免阻塞主进程.

```ts
export class Queue {
  constructor() {
    this.stack = [];
  }
  addFn(fn) {
    // 收集需要上报的函数
    this.stack.push(fn);
    if (window.requestIdleCallback) {
      requestIdleCallback(() => this.flushFn());
    } else {
      Promise.resolve().then(() => this.flushFn());
    }
  }
  flushFn() {
    // 上报当前中的数据
  }
}
```

# 前端错误定位

线上应用部署的过程：

- 构建工具从入口文件开始编译代码（Vue 模板编译）
- 生成编译 chunk 文件（代码混淆）
- 注入 html 引入

背景：引入 js 资源通常都是编译混淆好的 chunk 文件（script 资源明文传输导致源码暴露 & 节省体积），因此通常错误抛出的文件都会显示为 [filename].[hash].js，没办法真正定位到 Vue / React 组件. 因此需要一个映射的过程，通过报错信息给出的错误文件、错误行号、错误列号定位到源代码的位置.

解决：Sourcemap 维护了混淆后的代码行列到原代码行列的映射关系，根据混淆后的行列号，就能够获得对应的原始代码的行列号，结合源代码文件便可定位到真实的报错位置

```json
{
  // soucemap 版本
  "version": 3,

  // 转换后的文件名

  "file": "js/app.a2a3ceec.js",
  // 转换前的文件所在目录，如果与转换前的文件在同一目录，该项为空
  "sourceRoot": "",

  // 转换前的文件，该项是一个数组，表示可能存在多个文件合并
  "sources": [
    "webpack://web-see-demo/./src/App.vue",
    "webpack://web-see-demo/./src/main.js"
  ],
  // 转换前的所有变量名和属性名
  "names": [],

  // 原始文件内容
  "sourcesContent": ["const add = (x,y) => {\n  return x+y;\n}"],

  // 记录位置信息的字符串
  "mappings": "AAAA,IAAM,GAAG,GAAG,UAAC,CAAQ,EAAC,CAAQ;IAC5B,OAAO,CAAC,GAAC,CAAC,CAAC;AACb,CAAC,CAAA"
}
```

> ，mapping 采用可变长 VLQ 编码标识着源文件的信息 [阮一峰](http://ruanyifeng.com/blog/2013/01/javascript_source_map.html)

- 第一位，表示这个位置在（转换后的代码的）的第几列。

- 第二位，表示这个位置属于 sources 属性中的哪一个文件。

- 第三位，表示这个位置属于转换前代码的第几行。
- 第四位，表示这个位置属于转换前代码的第几列。

- 第五位，表示这个位置属于 names 属性中的哪一个变量。

<img src="http://ruanyifeng.com/blogimg/asset/201301/bg2013012202.png" style="display: block; margin: auto;"/>

## 映射过程

npm 中有一些现成的库可以实现源码映射

```js
const sourceMap = require('source-map')
const fs = require('fs')

const data = fs.readFileSync('test.js.map').toString()
const consumer = new sourceMap.SourceMapConsumer(data)

consumer.then((c) => {
    const line = 23, column = 112003
    let s = c.originPositionFor({ line, column })
    console.log(
      c
       .sourceContentFor(s.source)
       .split("\n")
       .slice(Math.max(s.line - 10), 0), s.line + 10)
       .join("\n")
    )
})
```
