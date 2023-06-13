> vben-admin 开源项目学习，以下主要记录里面涉及到的知识点



## vue3



### InjectionKey

> 为 `provide / inject` 标注类型 —— Vue 提供了一个 `InjectionKey` 接口，它是一个继承自 `Symbol` 的泛型类型，可以用来在提供者和消费者之间同步注入值的类型 [参考](https://cn.vuejs.org/guide/typescript/composition-api.html#typing-provide-inject)

```tsx
import { provide, inject } from 'vue'
import type { InjectionKey } from 'vue'

const key = Symbol() as InjectionKey<string>

provide(key, 'foo') // 若提供的是非字符串值会导致错误

const foo = inject(key) // foo 的类型：string | undefined
```



### hooks

> 里面涉及到比较有意思 hooks









## windi-css

> 支持大部分 tailwind css 语法且提供了更快速的 HMR。tailwind css 是一个可以通过定义 css 类名，不需要我们写额外 css 代码就能构建完整应用的 css 框架。

- 使用传统构建页面的方式

```html
<div class="chat-notification">
  <div class="chat-notification-logo-wrapper">
    <img class="chat-notification-logo" src="/img/logo.svg" alt="ChitChat Logo">
  </div>
  <div class="chat-notification-content">
    <h4 class="chat-notification-title">ChitChat</h4>
    <p class="chat-notification-message">You have a new message!</p>
  </div>
</div>

<style>
  .chat-notification {
    display: flex;
    max-width: 24rem;
    margin: 0 auto;
    padding: 1.5rem;
    border-radius: 0.5rem;
    background-color: #fff;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
  .chat-notification-logo-wrapper {
    flex-shrink: 0;
  }
  .chat-notification-logo {
    height: 3rem;
    width: 3rem;
  }
  .chat-notification-content {
    margin-left: 1.5rem;
    padding-top: 0.25rem;
  }
  .chat-notification-title {
    color: #1a202c;
    font-size: 1.25rem;
    line-height: 1.25;
  }
  .chat-notification-message {
    color: #718096;
    font-size: 1rem;
    line-height: 1.5;
  }
</style>
```

- 采用 `tailwind css`

```html
<div class="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
  <div class="flex-shrink-0">
    <img class="h-12 w-12" src="/img/logo.svg" alt="ChitChat Logo">
  </div>
  <div>
    <div class="text-xl font-medium text-black">ChitChat</div>
    <p class="text-gray-500">You have a new message!</p>
  </div>
</div>
```



对比发现总的 使用 `tailwind css` 的优势

- 不需要考虑 class 类名如何去定义
- css 代码不会增长（因为每次都是基于既定类名去实现样式）
- 修改更加安全，不需要担心一个地方的修改而导致破坏性行为



### 可响应式设计

| Breakpoint prefix | Minimum width | CSS                                  |
| ----------------- | ------------- | ------------------------------------ |
| `sm`              | 640px         | `@media (min-width: 640px) { ... }`  |
| `md`              | 768px         | `@media (min-width: 768px) { ... }`  |
| `lg`              | 1024px        | `@media (min-width: 1024px) { ... }` |
| `xl`              | 1280px        | `@media (min-width: 1280px) { ... }` |
| `2xl`             | 1536px        | `@media (min-width: 1536px) { ... }` |

```html
<!-- Width of 16 by default, 32 on medium screens, and 48 on large screens -->
<img class="w-16 md:w-32 lg:w-48">
```

实际在使用的时候如上即可，熟悉多媒体查询的话应该也很容易上手。当然如果觉得上面表格提供的 `prefix` 不足以满足需求的话，可进行自定义

```js
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'tablet': '640px',
      // => @media (min-width: 640px) { ... }

      'laptop': '1024px',
      // => @media (min-width: 1024px) { ... }

      'desktop': '1280px',
      // => @media (min-width: 1280px) { ... }
    },
  }
}
```



### 伪元素

> hover、focus ...

```html
<form>
  <input class="border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent ...">
  <button class="bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 ...">
    Sign up
  </button>
</form>
```



## vite



### glob

`glob` 在 vite 中用于动态导入，构建时会分离为独立 chunk

```ts
const modules = import.meta.glob('./dir/*.js')

// vite 生成的代码
const modules = {
  './dir/foo.js': () => import('./dir/foo.js'),
  './dir/bar.js': () => import('./dir/bar.js'),
}
```

```ts
// 遍历访问模块
for (const path in modules) {
  modules[path]().then((mod) => {
    console.log(path, mod)
  })
}
```



## typescript



### declare global

`declare global` 位于 `types/global.d.ts` 下，主要作用是声明全局变量，且该全局变量不是我们自定义的而是来源于`第三方库`，所以也可以理解为使得模块的类型可以在全局使用而不需要多次引入。

```ts
declare global {
  interface Window {
    myGlobalVar: string;
  }
}

window.myGlobalVar = 'Hello, world!';
console.log(window.myGlobalVar);  // 输出：Hello, world!
```



### 函数重载

> 函数重载的出现是为了解决函数返回值通过联合类型确定，导致无法明确从输入值 -> 返回值的确定路线 [参考——掘金](https://juejin.cn/post/7055668560965681182)

```ts
// 说明上面的例子
function getUserInfo(value:number|string):User|User[]|undefined{
    if(typeof value==='number'){
        return userList.find(item=>item.id===value)
    }else{
        return userList.filter(item=>item.grades===value)
    }
}
```

不能明确输入 `value`为 `number`时返回的是什么，因此为了解决这个问题引入 `函数重载`

```ts
function getUserInfo(value:number):User|undefined;
function getUserInfo(value:string,count:number):User[];
// 最后一个参数类型要**兼容**前面的所有函数声明的参数类型
function getUserInfo(value:number|string,count:number=1):User|User[]|undefined{
    if(typeof value==='number'){
        return userList.find(item=>item.id===value)
    }else{
        return userList.filter(item=>item.grades===value).slice(0,count)
    }
}
```



### unknown

> unknown 可用于解决顶级类型 any 宽松的检查机制 —— 即一个参数定义为 any 则无论该参数赋值给任意形式都不会报错

`unknown` 的一些特性

- 与 `any` 类似，所有类型都可以被归为 `unknown`
- `unknown` 类型的变量只能赋值给 `any` & `unknown`

```ts
let value: unknown;

let value1: unknown = value;   // OK
let value2: any = value;       // OK
let value3: boolean = value;   // Error
let value4: number = value;    // Error
let value5: string = value;    // Error
let value6: object = value;    // Error
let value7: any[] = value;     // Error
let value8: Function = value;  // Error
```







## less

>  `less` 是 css 预处理器，可以帮助我们更好地组织以及编写 css



### 变量

```less
@width: 10px;
@height: @width + 10px;

#header {
    width: @width;
    height: @height
}
```

:information_source: 变量这个概念其实 `css `也有，对应通过 `--` 来声明变量，`var()`来引入变量，理解 `继承性`和 `候补属性` 就能够比较好地理解这个概念。

```css
:root {
  --main-bg-color: brown;
}
element {
  background-color: var(--main-bg-color);
}
element {
  background-color: var(--main-bg-color , red); /* red 为 --main-bg-color无效的替代值 */
}
```

### 混合

> 也叫混入，将一组属性从一个规则集应用到另外一个规则集

```css
.bordered {
  border-top: dotted 1px black;
  border-bottom: solid 2px black;
}

/* 应用上面规则集 */
#menu a {
  color: #111;
  .bordered();
}

.post a {
  color: red;
  .bordered();
}
```

### 转义

```less
// less 3.5 版本前
@min768: ~"(min-width: 768px)";
.element {
  @media @min768 {
    font-size: 1.2rem;
  }
}
// less 3.5 版本后
@min768: (min-width: 768px);
.element {
  @media @min768 {
    font-size: 1.2rem;
  }
}
```

编译后

```css
@media (min-width: 768px) {
  .element {
    font-size: 1.2rem;
  }
}
```



