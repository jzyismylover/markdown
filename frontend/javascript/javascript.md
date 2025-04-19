# JS 基础

> 主要 [readme.md](readme.md) 是复习阶段复习到的一些知识，相比于红宝书的知识点可能只是九牛一毛了，所以有空还是多看看书

[TOC]

## :wink: JS 作用域

作用域是一个关键的概念，定义了变量搜索的过程，也就是我们当前函数使用到了某个变量，它可以从哪里来的这么一个意思。作用域其实有两种，静态作用域 和 动态作用域。

**关键：函数的作用域在函数定义的时候就决定了**

[学习链接](https://zhuanlan.zhihu.com/p/65565830) & [冴羽](https://github.com/mqyqingfeng/Blog/blob/master/articles/%E6%B7%B1%E5%85%A5%E7%B3%BB%E5%88%97%E6%96%87%E7%AB%A0/JavaScript%E6%B7%B1%E5%85%A5%E4%B9%8B%E8%AF%8D%E6%B3%95%E4%BD%9C%E7%94%A8%E5%9F%9F%E5%92%8C%E5%8A%A8%E6%80%81%E4%BD%9C%E7%94%A8%E5%9F%9F.md)

### 静态作用域

```js
var a = 1;
function fn() {
  console.log(a);
}
function testing() {
  var a = 2;
  fn();
}
// 1
```

### 动态作用域

```js
var a = 1;
function fn() {
  console.log(a);
}
function testing() {
  var a = 2;
  fn();
}
// 2
```

:key: 两者主要的区别是函数的作用域是在定义时确定还是在运行时确定，静态作用域是在定义时就确定了，动态作用域是在调用的时候再确定。因为对于第一段代码，a 的搜索过程就是从 fn -> 全局；对于第二段代码，a 搜索的过程就是从 fn -> testing -> 全局，两种是完全不一样的过程。

## :wink: 代理

1. 代理空对象

```js
const target = { id: "target" };
const handler = {};

const proxy = new Proxy(target, handler);
```

创建处理的代理器 proxy 相当于是原对象的一个引用

2. 捕获器参数

```js
const target = { id: "target" };
const handler = {
  /*
     trapTarget - 指向原对象 target 的引用
     property - 访问的属性名
     receiver - 指向 proxy 代理的引用
     */
  get(trapTarget, property, receiver) {},
};

const proxy = new Proxy(target, handler);
```

3. 反射 API

- Reflect 作为一个对象封装了原始行为，与捕获器具有相同的名称和函数签名
- Reflect 的 [设计目标](https://es6.ruanyifeng.com/#docs/reflect)
  - 将 Object 对象的一些明显属于语言内部的方法放到 Reflect 对象上
  - 修改某些 object 方法返回的结果
  - 让 object 的操作变成函数行为
  - Reflect 和 proxy 具有相同的函数签名

```js
const target = { id: 'target' }
const handler = {
    get = Reflect.get
}
```

4. JS 对象的四个特征

   - enumerable - 是否可以被 for...in 遍历 - 注意 for...in 会返回原型和对象上可枚举的属性

   - configurable - 是否可被配置 - 不影响 enumerable

   - value - 当前属性的值

   - writable - 是否可以被修改

```js
const target = {};
Object.defineProperty(target, {
  configurable: false,
  enumerable: false,
  writable: false,
  value: "bar",
});
// get 与 value 不能同时存在
// set 和 writable 不能同时存在
```

:key: 解释下 configurable 是什么意思

- 锁定属性描述符
- 属性不可删除

```js
// 锁定属性描述符
const obj = {
  name: "jzyismylover",
};
Object.defineProperty(obj, "name", {
  enumerable: true,
  configurable: false,
  writable: false,
});

// 一旦初始的描述 configurable 设置为 false，那么这个配合就会报错
Object.defineProperty(obj, "name", {
  enumerable: false,
});
```

```js
Object.defineProperty(obj, 'name', {
       ^

TypeError: Cannot redefine property: name(属性不可再配置的意思)
    at Function.defineProperty (<anonymous>)
    at Object.<anonymous> (F:\开发文件\javascript\js\日常学习\errorHandler.js:24:8)
    at Module._compile (node:internal/modules/cjs/loader:1101:14)
    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1153:10)
    at Module.load (node:internal/modules/cjs/loader:981:32)
    at Function.Module._load (node:internal/modules/cjs/loader:822:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)
    at node:internal/main/run_main_module:17:47
```

5. 代理撤销

```js
const { proxy, revoke } = Proxy.revocable(target, handler);
revoke(); // 取消当前的代理
```

- 常见的代理配置

```js
const user = {
  name: "Jake",
};
const proxy = new Proxy(user, {
  // 访问函数时机
  get(target, property, receiver) {
    return Reflect.get(...arguments);
  },
  // 设置元素时机
  set(target, property, value, receiver) {
    return Reflect.set(...arguments);
  },
  // 函数属性是否存在判断时机
  has(target, property) {
    return Reflect.has(...arguments);
  },
  // 函数调用时机
  apply(target, thisArg, ...argumentsList) {
    // thisArg 指的是调用函数时的 this 参数
    return Reflect.apply(...arguments);
  },
  // new 操作符时机
  construct(target, argumentList, newTarget) {
    // argumentList - 传给目标构造函数的参数列表
    // newTarget 最初被调用的构造函数
    return Reflect.construct(...arguments);
  },
  // 删除属性时机
  deleteProperty(target, key) {
    return Reflect.deleteProperty(...arguments);
  },
});
```

> _需要注意_，所有的操作都是基于 proxy 实例去操作然后再映射会原对象上的，所以我们可以基于代理器做很多规则的验证，比如满足什么条件以后才可以修改对应的值，或者隐藏原对象上的某些属性。

1. 属性验证

```js
const target = {
  onlyNumbersGoHere: 0,
};

const proxy = new Proxy(target, {
  set(target, property, value) {
    // 验证只有当赋值的类型为 number 的时候才可以完成赋值
    if (typeof value !== "number") {
      return false;
    } else {
      return Reflect.set(...arguments);
    }
  },
});
```

2. 数据绑定与可观察对象

```js
function getMedian(...nums) {
  return nums.sort()[Math.floor(nums.length / 2)];
}
const proxy = new Proxy(target, {
  apply(target, thisArg, ...argumentsList) {
    for (let item of argumentsList) {
      if (typeof item !== "number") {
        throw "TypeError";
      }
    }
    return Reflect.apply(...arguments);
  },
});
```

3. 数据绑定与可观察对象

```js
const userList = [];
const emit = function (val) {
  console.log(val);
};
const proxy = new Proxy(userList, {
  // push 时触发的是userList[0] = 'xxx' 和 userList.length=xxx
  set(target, property, value, receiver) {
    const res = Reflect.set(...arguments);
    if (res) {
      emit(Reflect.get(target, property, receiver));
    }
    return res;
  },
});

proxy.push("hello world");
```

## :yellow_heart: [Object 对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)

### Object.assign

- 语法格式：Object.assign(target, ...sources)  
  用于将所有可枚举属性的值从一个或多个源对象分配到目标对象，并返回目标对象(浅拷贝)--改变目标对象

```js
const obj1 = { a: "hello world" };
const obj2 = { b: "hello world" };

console.log(Object.assign(obj1, obj2)); //  {a:"hello world",b:"hello world"}
console.log(obj1); //  {a:"hello world",b:"hello world"}
console.log(obj2); // { b: 'hello world' }
```

```js
const o2 = {
  [symbol]: 2,
  toString() {
    console.log("");
  },
  getName: function () {
    console.log("");
  },
};

console.log(Object.getOwnPropertyDescriptor(o2, "getName"));
/* {
  value: [Function: getName],
  writable: true,
  enumerable: true,
  configurable: true
}*/

console.log(Object.getOwnPropertyDescriptor(o2, "toString"));
/*
{
  value: [Function: toString],
  writable: true,
  enumerable: true,
  configurable: true
}
*/

console.log(Object.getOwnPropertyDescriptor(o2, symbol));
/*{ value: 2, writable: true, enumerable: true, configurable: true }*/
```

:exclamation: Symbol 的 enumerable 为 true, 但是在下文会出现无法被 for...in 或者 Object.keys() 遍历，经过一番探究发现内部是做了一番处理的，之前的版本是用 for... in 进行所有属性的枚举然后拷贝的，在 ES6 里面可能使用了 Object.getOwnPropertySymbols 来获得 所有 Symbol 属性然后再拷贝。

#### 浅拷贝特性

也就说如果拷贝属性的值是引用类型的话，克隆之后对象对其的修改会更新到原对象上，因为这个操作的都是同一个内存地址。除非手动修改了对应的指向

```js
const obj = {
  list: [1, 2, 3],
};

const newObj = Object.assign({}, obj);
newObj.list = [1, 2]; // 手动更改了新对象的list的指向
// 这样子 obj.list 和 newObj.list 就独立开来互相不受
```

### 对象的枚举

- for...in：遍历对象自身和**继承**的可枚举的属性

  :star: 在遍历拷贝的时候需要注意使用 Object.hasOwnProerty 来排除在原型链上的一些属性

- Object.keys()：返回对象自身的所有可枚举的属性的键名

- JSON.stringify：只串行化对象自身的可枚举的属性

  :star2: 会忽略 undefined 、函数、Symbol，同时处理循环引用会报堆栈错误

- Object.getOwnPropertyNames：和 `Object.keys` 类似，但也会返回不可枚举自有属性，只要他们的名字是字符窜

- Object.getOwnPropertySymbols：返回 `symbol` 自有属性无论是否可枚举

- Reflect.ownKeys：返回所有自有属性名包括 `string` / `symbol` 无论是否可枚举

- Object.assign：忽略 enumerable 为 false 的属性，只拷贝对象自身的可枚举的属性

## :japanese_ogre: [LocalStorage 安全分析](https://blog.csdn.net/yangdeli888/article/details/7735260)

> 1. localStorage 的存储实现长且存储的内容基本上都是以明文的方式进行存储，对于网站攻击者来说，可以通过直接注入 localstorage.removeItem() 或者 localStorage.clear() 的方式对缓存进行清空等等
> 2. 在这里我们关心的是 localstorage 设置时限性的问题，也就是如何给 localstorage 像 cookie 一样设置一个有效时间或者说如何判断当前 localstorage 缓存的内容是最新的

```js
// 有两种解决方法，
// 第一种是前端自己操作设置一个过期时限，与数据包装在一起转换为 JSON 字符串的形式存入缓存，下次取值的时候判断是否在时限内
// 第二种是通过类似协商缓存的方式，每次请求携带一个Etag标识到服务器，以 Etag的一致性判断当前数据是否更新

// 基于第一种思路的实现方法
function set(key, value) {
  var curtime = new Date().getTime(); //获取当前时间
  localStorage.setItem(key, JSON.stringify({ val: value, time: curtime })); //转换成json字符串序列
}
function get(key, exp) {
  //exp是设置的过期时间
  var val = localStorage.getItem(key); //获取存储的元素
  var dataobj = JSON.parse(val); //解析出json对象
  if (new Date().getTime() - dataobj.time > exp) {
    //如果当前时间-减去存储的元素在创建时候设置的时间 > 过期时间
    console.log("expires"); //提示过期
  } else {
    console.log("val=" + dataobj.val);
  }
}
```

## :wink: web 常见攻击

CSRF 和 XSS

- CSRF(跨站请求伪造) 的攻击流程

<img src="E:\杂七杂八的东西\typeorm 图片存储区\v2-4f67322fc9c1aba2d6a251696d14ec31_720w.jpg" style="display: block; margin: auto;"/>

1. 登录受信任网站 A ，并在本地生成保存 Cookie；
2. 在不登出 A 情况下，访问病毒网站 B

​ 用户只有符合上面两个步骤的操作才具备遭受 CSRF 攻击的基础

:key: 面试中有问到一个问题

CSRF 是如何模拟发起 get / post 请求？换言而知就是问有哪些方式可以实现不同源的 get 请求和 post 请求？

- 首先我们得知道在 HTML/ JS / CSS 中有哪些请求方式不受同源限制。--> 页面中的链接，重定向，以及表单提交是不会受到同源策略的限制的。

  - 链接指的就是 link, script, img, iframe 的链接
  - 表单指的就是浏览器原生表单

- get 请求 -- jsonp(script 不受同源限制)

- post 请求 -- 设置一个自动提交的表单发送 post 请求，访问页面后会自动进行提交。

  [解释](https://blog.csdn.net/wabiaozia/article/details/78771709)

- XSS(跨站脚本) 的攻击流程

<img src="E:\杂七杂八的东西\typeorm 图片存储区\v2-04906c5c0874c9e33a95dde9643ef74f_720w.jpg" style="display: block; margin: auto;"/>

[DOM 型 XSS 攻击](https://www.jianshu.com/p/190dedd585f2)

## :ok: BigInt

> JS 中的 number 类型无法精确表示非常大的数，会出现常说的丢失精度
>
> [参考链接](https://juejin.cn/post/6844903974378668039)

```js
console.log(9007199254740992 === 9007199254740993;    // → true 居然是true!

// 要创建BigInt，只需要在数字末尾追加n即可
console.log( 9007199254740995n );    // → 9007199254740995n
console.log( 9007199254740995 );     // → 9007199254740996
```

- BigInt 不支持一元加号运算符, 这可能是某些程序可能依赖于 + 始终生成 Number 的不变量，或者抛出异常。另外，更改 + 的行为也会破坏 asm.js 代码。

- 因为隐式类型转换可能丢失信息，所以不允许在 BigInt 和 Number 之间进行混合操作。当混合使用大整数和浮点数时，结果值可能无法由 BigInt 或 Number 精确表示。

## :star: 类型转换

> JS 的类型转换主要有三种，转为布尔值；转为字符串；转为数字 [转换的原理过程](https://zhuanlan.zhihu.com/p/270336824)

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/20/16de9512eaf1158a~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)

- 对象转为原始类型
  - 如果 Symbol.toPrimitive()方法，优先调用再返回
    - 默认有一个 hint 参数代表当前需要转换的类型
      - default == 默认的类型
      - number 强制转换为 Number 类型
      - string 强制转换为 String 类型
  - 调用 valueOf()，如果转换为原始类型，则返回
  - 调用 toString()，如果转换为原始类型，则返回
  - 如果都没有返回原始类型，会报错

```js
const a = {
  name: "wyl",
  age: 20,
  [Symbol.toPrimitive](hint) {
    if (hint === "number") {
      // 如果当前需要转化的是 number
      return 10;
    } else if (hint === "string") {
      // 如果当前需要转化的是string
      return "wyl0";
    }
    return "wyl1";
  },
};

console.log(+a); // + 就是将 a 转化为 number
console.log(String(a)); // String() 就是将 a 转化为 string
```

```js
// 如何让if(a == 1 && a == 2)条件成立？
var a = {
  value: 0,
  valueOf: function () {
    this.value++;
    return this.value;
  },
};
console.log(a == 1 && a == 2); // true
```

## :kissing: 函数

函数的调用方式

1. 普通调用
2. 对象调用
3. call / apply 调用
4. 作为 new 间接调用

> 箭头函数与普通函数的区别

1. 外形不同

2. 箭头函数都是匿名函数

3. 箭头函数不能用于构造函数

4. this 指向不同

   在普通函数中，this 指向的是调用它的对象，如果用作构造函数，this 指向创建的对象实例

   箭头函数的 this 在声明的时候绑定其上下文的 this，指向的是所在**作用域**指向的对象。

5. 箭头函数没有 arguments 对象
6. 箭头函数不能用作 Generator 函数
7. 箭头函数不允许使用 call / apply 的方法改变 this 指向

## :laughing: 闭包

> 闭包是指有权访问另外一个函数作用域中的变量的函数

```js
// 如何解决下面这个经典的问题
for (var i = 1; i <= 5; i++) {
  setTimeout(function timer() {
    console.log(i);
  }, 0);
}
```

## :page_facing_up: this

不同情况的 this 调用，this 的指向会不同。

- 对于直接调用函数，不管函数放到什么地方，this 一定是 window
- 对于 obj.foo() 来说，谁调用了函数，谁就是 this，所以此时 foo 内部的 this 指向的就是 obj
- 对于 new 的方式，this 永远绑定在实例对象上，不会被任何形式改变
- 对于 bind 的方式，this 会被绑定在 bind 设置的对象上，如果对一个函数进行多次 bind，函数的 this 永远由第一次 bind 决定

this 决定的优先级

- new 的优先级最高
- 接下来是 bind 函数
- 然后是 obj.foo 的调用方式
- 最后是直接调用的方式

![image.png](https://s.poetries.work/gitee/2020/07/2.png)

## :question: 内存管理

### 内存机制

1. 从 JS 的内存机制来说，基础变量的值保存在栈内存中，赋值的时候直接拷贝内存值；引用类型的值保存在堆内存中，并在栈内存中存在指向对应堆内存地址的指针，赋值的时候拷贝的是指针。
2. 为什么引用类型不一起存储在栈内存中呢？栈内存不止存放变量，还负责函数上下文执行的切换任务。

### 内存回收

新生代内存 & 老生代内存

- 新生代内存的回收方式：From 检查存活对象按顺序放置在 To 中(尽量避免出现内存碎片)，然后将 From 和 To 职责调换，From 变为闲置区，To 变为使用区，后面循环这个过程。

<img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/23/16e96b71923adacb~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp" style="display: block; margin: auto;"/>

- 老生代内存回收方式

  - 标记清除(常用)

    1. 标记阶段：遍历堆内存中的所有对象并打上标记，对于代码中使用的以及被强引用的取消标记

    2. 清除阶段：回收掉仍有具有标记的变量

    3. 存在内存碎片问题，通过标记整理解决但耗时

  - 引用计数

    :sparkler: 区分强引用 和 弱引用

## :eight_pointed_black_star: 事件循环

> 浏览器的事件循环，node 的事件循环
>
> 区别：浏览器的微任务总是在宏任务执行完后执行（一开始有个 script ）
>
> node 的微任务在各个时机都有可能被执行

:star: 浏览器的事件循环机制：初始将执行上下文栈不断出栈入栈同步代码，遇到宏任务就将宏任务放到宏任务队列，遇到微任务就放到微任务队列，等到执行上下文栈为空时，查看微任务队列是否为空，不为空就不断出队直至为空；然后查看宏任务队列是否为空，不为空队出队执行宏任务，将中间产生的微任务队列推入微任务队列，当前函数执行完后再去执行微任务队列内的函数。

(:stars: 主线程从“任务队列”循环读取任务的过程)

```js
console.log("start");
setTimeout(() => {
  console.log("timeout");
});
Promise.resolve().then(() => {
  console.log("resolve");
});
console.log("end");
```

1. 一开始整段脚本作为第一个**宏任务**执行(没有就从事件队列中获取)
2. 执行过程中同步代码直接执行，**宏任务**进入宏任务队列，**微任务**进入微任务队列
3. 当前宏任务执行完出队，检查微任务队列，如果有则依次执行，直到微任务队列为空
4. 执行浏览器 UI 线程的渲染工作
5. 检查是否有 Web worker 任务，有则执行
6. 执行队首新的宏任务，回到 2，依此循环，直到宏任务和微任务队列都为空

<img src="https://cos.poetries.work/gitee/2020/07/70.png" alt="img" style="zoom: 25%;" />

:tada: 事件队列中的回调函数是由各自线程插入到事件队列中的

<img src="https://cos.poetries.work/gitee/20190928/11.png" alt="img" style="zoom: 33%;" />

:tada: **tips**: 关于 async 和 await 内部微任务的理解. 当 await 后面跟的是一个变量，会把 await 下面的代码注册为微任务压入微任务队列。当 await 后面跟的是一个 Promise，会等到执行时机回来后再注册。两者的区别主要是注册微任务的时机 => 后果就是执行的顺序会不一样

```js
console.log("script start");

async function async1() {
  await async2();
  console.log("async1 end");
}
/******可以尝试下这两个不同的函数对比执行效果******/
function async2() {
  console.log("async2 end");
  return Promise.resolve().then(() => {
    console.log("async2 end1");
  });
}
async function async2() {
  console.log("async2 end");
  return Promise.resolve().then(() => {
    console.log("async2 end1");
  });
}
/********************************************/
async1();

setTimeout(function () {
  console.log("setTimeout");
}, 0);

new Promise((resolve) => {
  console.log("Promise");
  resolve();
})
  .then(function () {
    console.log("promise1");
  })
  .then(function () {
    console.log("promise2");
  });

console.log("script end");

// script start => async2 end => Promise => script end => async2 end1 => promise1 => promise2 => async1 end => setTimeout
```

:star2: node 事件循环机制：有五个重要的阶段；poll 轮询 check 检查 event close 事件清除 timer 定时器 callback 回调函数（一般是 I/O 回调）

三个比较重要的阶段：

- timer

  执行 setTimeout 和 setInterval 的回调

- check

  直接执行 setImmdiate 回调

- poll

  poll 作为一个至关重要的阶段

<img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/2/1709951e65ffe00e~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp" style="display: block; margin: auto;"/>

- process.nextTick 是一个独立于 eventLoop 的任务队列。

> 在每一个 eventLoop 阶段完成后会去检查 nextTick 队列，如果里面有任务，会让这部分任务优先于微任务执行。这个也是 node 区别于浏览器特有的。

:mega: tips: 可以去说的一个点是 node10 版本之前微任务执行时机和 node11 版本后的微任务时机的区别

## :exclamation: 生成器 & 协程

- 生成器是 ES6 的新语法

```js
function* gen() {
  yield 1;
  yield 2;
}
```

- 生成器其实是基于协程来实现的。一个线程中可以有多个协程，但是同一时间只有一个协程在执行，这就涉及到了协程切换的问题，所以我们可以在一个 next 之后执行若干代码，再 next，时机就回到上一次执行末尾。协程并不受操作系统的控制，完全由用户自定义切换

- thunk (偏函数)：接受一定的参数定制化函数

```js
// 使用 thunk 使得 generator 可以顺序执行完
const readFileThunk = (filename) => {
  return (callback) => {
    fs.readFile(filename, callback);
  };
};

const gen = function* () {
  const data1 = yield readFileThunk("001.txt");
  console.log(data1.toString());
  const data2 = yield readFileThunk("002.txt");
  console.log(data2.toString);
};

let g = gen();
// 第一步: 由于进场是暂停的，我们调用next，让它开始执行。
// next返回值中有一个value值，这个value是yield后面的结果，放在这里也就是是thunk函数生成的定制化函数，里面需要传一个回调函数作为参数
g.next().value((err, data1) => {
  // 第二步: 拿到上一次得到的结果，调用next, 将结果作为参数传入，程序继续执行。
  // 同理，value传入回调
  g.next(data1).value((err, data2) => {
    g.next(data2);
  });
});
```

- 使用 promise 解决上面的问题

```js
/**
 *  Promise 实现协程顺序调用
 */

// 有这么一个读取文件的函数
function readFile(filename, delay) {
  return new Promise((resolve, reject) => {
    // 使用 setTimeout 去模拟文件异步读取
    setTimeout(() => {
      resolve(filename);
    }, delay);
  });
}

// 实现的目的就是 gen 内部按顺序执行
const gen = function* () {
  const res1 = yield readFile("file1", 2000);
  console.log(res1);
  const res2 = yield readFile("file2", 1000);
  console.log(res2);
};

let g = gen();
function getGenPromise(gen, data) {
  return gen.next(data).value;
}

// generator 中的 next传递的参数会赋值给上一个 yield的变量
// 回到这里的执行顺序是
// 1. 执行 g.next() 得到 generator 1
// 2. 将 generator 1 作为next参数传回生成器函数中赋值给 res1
// 3. 输出 res1
getGenPromise(g)
  .then((data1) => {
    return getGenPromise(g, data1);
  })
  .then((data2) => {
    return getGenPromise(g, data2);
  });
```

## :star: 原型链

> 原型链是实现继承的方式之一，每个实例对象都有一个 proto 属性指向构造函数的原型，当这个原型的 proto 属性又指向另一个实例或者原型时就构成了原型链。

<img src="E:\杂七杂八的东西\typeorm 图片存储区\1ed77e1f65372daaaca3552f86ebdd71_sm_xform_imageauth_key=1650629181-QB8bKLSg3goWZqna-0-7f3bb63e446b927e35eb4cfd4879817b&response-content-disposition=inline%3B+filename%3Dimage.png%3B+filename%3DUTF-8''image.png" style="display: block; margin: auto;"/>

:key: 谨记一点：对象其实是由函数构造出来的，同时函数原型也是一个特殊的对象。

```javascript
console.log(Object.prototype.__proto__ === null); // true

// 函数原型也是一个特殊的对象(由 new Object() 生成)
console.log(Function.prototype.__proto__ === Object.prototype); // true

// 对象也是由 Function 生成的 (函数的 constructor 一般都指向 Function [Function Function])
console.log(Function.prototype === Object.__proto__); // true

// Function 由 Function实例生成
console.log(Function.constructor === Function); // true
```

- 对象的 hasOwnProperty() 来检查**对象自身**中是否含有该属性（需要注意）
- 使用 in 检查对象中是否含有某个属性时，如果对象中没有但是原型链中有，也会返回 true

JS 实现继承有 6 种方式 [github](https://github.com/mqyqingfeng/Blog/issues/16)

- 原型链继承
- 缺点
  - 引用类型的属性会被所有实例共享
  - 创建 Student 实例时不能向 Parent 传参

```js
function Parent() {
  this.names = ["kevin", "daisy"];
}

function Child() {}

Child.prototype = new Parent();

var child1 = new Child();
child1.names.push("yayu");
console.log(child1.names); // ["kevin", "daisy", "yayu"]

var child2 = new Child();
console.log(child2.names); // ["kevin", "daisy", "yayu"]
```

- 构造函数继承
- 缺点
  - 方法在构造函数中定义，每次创建实例都会创建一次方法

```js
function Person() {}
function Student() {
  Person.call();
}
// 缺点就是没办法继承原型上的属性和方法
```

- 组合继承

```js
function Person() {}
function Student() {
  Person.call(this);
}

Student.prototype = new Person();
// 缺点是调用了两次 Person 方法

// 优化手段
Student.prototype = Person.prototype;
Student.prototype.constructor = Student;
```

- 原型式继承
  - Object.create 的实现方式

```js
function createObj(o) {
  function F() {}
  F.prototype = o;
  return new F();
}
```

- 寄生式继承

```js
function Clone(obj) {
  let clone = Object.create(obj);
  // 额外附加一些属性
  clone.getName = function () {
    return this.name;
  };
  return clone;
}
```

- 寄生组合式继承
  - 与组合式继承相比，只执行了一次父类构造函数，避免在原型上创建多余的属性

```js
// 当前用得最广泛
function Person() {}
function Student() {
  Person.call(this);
}
function Clone(source, target) {
  target.prototype = Object.create(source);
  target.prototype.constructor = target;
}
```

> 从设计模式的思想上谈谈继承本身的问题

```js
class Car {
  constructor(id) {
    this.id = id;
  }
  drive() {
    console.log("wuwuwu!");
  }
  music() {
    console.log("lalala!");
  }
  addOil() {
    console.log("哦哟！");
  }
}
class otherCar extends Car {}
```

父类有三个方法，每个子类都可以通过继承得到这三个方法，但是其实这三个方法在某些子类是不需要的，所以说**继承的最大问题就是无法决定继承哪些属性，所有的属性都得继承。**解决的方法是通过组合的方式，也就是将这些方法一个个抽离出来，后面通过组合的方式来一个个堆叠上去

## :information_source: JS 常见问题

> 参考链接：https://juejin.cn/post/6844903986479251464
>
> 参考链接：https://juejin.cn/post/6844904004007247880

1. 函数的 arguments 为什么不是数组？如何转化成数组？

2. forEach 中 return 有效果吗？如何中断 forEach 循环？

3. 如何判断 JS 判断数组中是否包含某个值？

4. 如何实现数组扁平化？
   1. ES6 flat 方法
   2. toString() 转化后切割字符串（注意最后要进行类型转换）
   3. 使用 some 函数递归
   4. 使用 reduce 函数递归
5. 手动实现数组的一些方法

   > 下面的代码没有做很多的错误处理，比如是不是数组但是调用了这些方法或者传入的 callback 不是函数等等
   >
   > 参考链接：https://juejin.cn/post/6844903986479251464#heading-0（里面的12章-17章写得很全）

```js
// 实现数组 map 方法
// Array.prototype.map 的函数签名 (callback, thisArg)
// thisArg 表示的是传入作为 callback 的 this 对象
Array.prototype._map = function (callback, thisArg) {
  let newArray = [],
    o = Object(this);
  let len = o.length >>> 0; // 右移运算 保证len为数字且为整数
  for (let key = 0; key < len; key++) {
    if (key in o) {
      let val = o[key];
      let res = callback.call(thisArg, val, key, o);
      newArray[key] = res;
    }
  }
  return newArray;
};

// 实现数组 reduce 方法
Array.prototype._reduce = function (callback, initValue) {
  let o = Object(this),
    len = o.length >>> 0;
  let accumulator = initValue;
  accumulator = accumulator ? accumulator : o[0];
  for (let j = 1; j < len; j++) {
    accumulator = callback.call(this, accumulator, o[j], j, o);
  }
  return accumulator;
};

// 实现数组 push / pop 方法
Array.prototype._push = function (...item) {
  let o = Object(this),
    len = o.length >>> 0,
    argsLen = item.length >>> 0;
  for (let i = 0; i < argsLen; i++) {
    o[len + i] = item[i];
  }
  o.length = len + argsLen;
  return o.length;
};

// 实现数组 filter 方法
Array.prototype._filter = function (callback, thisArg) {
  let o = Object(this),
    len = o.length >>> 0;
  let arr = [];
  for (let k = 0; k < len; k++) {
    if (k in o) {
      if (callback.call(this, o[k], k, o)) {
        arr.push(o[k]);
      }
    }
  }
  return arr;
};

// 实现数组 splice 方法(困难) - 涉及到非常多的考虑情况

// 实现数组 sort 方法(困难) - 涉及到插入排序和快速排序
```

- Array.from 创建二维数组

```js
// 创建一个有 9 行 10 列且初始值全为 false 的二维数组
Array.from(Array(9), () => new Array(10).fill(false));

// Array.from 的参数
// arrayLike 想要转换成数组的伪数组对象或可迭代对象。
// mapFn 可选 如果指定了该参数，新数组中的每个元素会执行该回调函数。
// thisArg 可选 可选参数，执行回调函数 mapFn 时 this 对象。
```

### JS 运算符

[优先级规则](https://www.cainiaojc.com/javascript/operator_precedence.html)

```js
let a = { n: 1 };
let b = a;
a.x = a = { n: 2 };

console.log(a.x); // undefined
console.log(b.x); // {n: 2}
```

<img src="https://img-blog.csdn.net/20181017162857161?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L214MTg1MTkxNDI4NjQ=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70" style="display: block; margin: auto;"/>

图里面画的很清晰，. 运算的优先级高于 = ，所以会优先执行对 x 的赋值，此时 a b 对应的堆栈空间就会被修改，然后再对 a 进行赋值，此时 a 会另外开辟一个内存空间。

### JS 精度丢失

[answer](https://juejin.cn/post/6844903630185693192)

## :no_good: 前端性能优化

> [参考链接](https://blog.51cto.com/u_15098009/2612150) 可以从四个方向进行阐述说明

- 网络请求
  - 尽量避免重定向（访问一个网页重定向到另一个网页）
  - DNS / 资源预解析（dns-prefetch）
  - 利用 HTTP 缓存、本地缓存
  - 静态资源合并，化简多个网络请求，或者使用懒加载的手段延时请求
  - 对 JS、CSS 等资源进行压缩；按需引入
  - 使用 CDN ，减少服务器过载能力
- 页面解析与处理
  - 注意 link 和 script 的引入位置，尽量将 link 放在 head 中引入，将 script 放在 body 后引入
  - 慎用 @import
- 运行时
  - 使用虚拟列表防止页面创建多个 DOM 节点（虚拟列表的实现）
  - 使用防抖 / 节流控制事件触发的频率（防抖&节流的实现）
  - 对于一些高耗时的任务使用异步回调或者 使用 Web Worker 模拟多线程处理

## :question: JS 位运算

| 运算符 | 名称         | 描述                                                     |
| :----- | :----------- | :------------------------------------------------------- |
| &      | AND          | 如果两位都是 1 则设置每位为 1                            |
| \|     | OR           | 如果两位之一为 1 则设置每位为 1                          |
| ^      | XOR          | 如果两位只有一位为 1 则设置每位为 1                      |
| ~      | NOT          | 反转所有位                                               |
| <<     | 零填充左位移 | 通过从右推入零向左位移，并使最左边的位脱落。             |
| >>     | 有符号右位移 | 通过从左推入最左位的拷贝来向右位移，并使最右边的位脱落。 |
| >>>    | 零填充右位移 | 通过从左推入零来向右位移，并使最右边的位脱落。           |

- 左位移 - 相当于是之前除最左边外的所有二进制位 \* 2
- 右位移 - 相当于是之前除最右边外所有二进制位 / 2

- _number_. toString（radix）- 需要注意是 number.toString
  - radix - 规定表示数字的基数
    - 2 - 数字以二进制显示
    - 8 - 数字以八进制显示
    - 10 - 数字以十进制显示（默认）
- [parseInt](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/parseInt)（string, radix）
  - 解析一个字符串并返回指定基数的十进制整数

```js
// 二进制转十进制
function binToDec(bin) {
  return parseInt(bin, 2).toString(10);
}
console.log(binToDec(10)); // 2

// 十进制转二进制
function decToBin(dec) {
  // >>> 0 可以将非基础类型转变成 0
  // >>> 0 可以将浮点数转换成整数
  return (dec >>> 0).toString(2);
}
console.log(decToBin(2)); // 10
```

## :m: Symbol

1. 用来解决属性名冲突的问题， 构造唯一的属性名或者变量
2. 私有属性
3. [ES6 Symbol](https://es6.ruanyifeng.com/#docs/symbol)

- 封装私有属性

```js
functon getObj() {
    const symbol = Symbol()
    const obj = {}
    obj[symbol] = 'test'
    return obj

```

- 遍历

```js
// 使用 Object.keys() / for...in 是拿不到 symbol 属性的
const obj = {
  name: "jzy",
  [Symbol()]: "jzyismylover",
};

for (const key in obj) {
  console.log(key); // 拿不到 Symbol
}
console.log(Object.keys(obj)); // 拿不到 Symbol
```

:exclamation: 虽然经过测试 enumerable 为 true，但是还是不能被 for...in 或者 Object.keys() 遍历，猜测可能是内部 API 实现的原因。

Symbol 函数可以接受一个字符串作为参数，表示对 Symbol 实例的描述.(但也是仅仅为了用于区分不同的 symbol，并不具有实际的意义)

- Symbol.prototype.description - 返回 Symbol 的描述信息
- Symbol 作为键值不能使用点运算符（会当成字符串处理）
- 对象内部定义 Symbol 键值，需要放在 [] 内

- Symbol.hasInstance - 用于判断某对象是否为某构造器的实例. 本质上自定义 instanceof 行为的一种方式

```js
class Array1 {
  static [Symbol.hasInstance](instance) {
    return Array.isArray(instance);
  }
}
console.log([] instanceof Array1); // true

class Numebr1 {
  static [Symbol.hasInstance](instance) {
    return typeof instance === "number";
  }
}
console.log(1 instanceof Numebr1); // true
// 之前基本类型是不能使用 instanceof 判断类型的
// 这种做法相当于对这个方法进行扩充
```

- [[Symbol.interator] 实现对象可迭代](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator)

  生成器其实是迭代器的一种特殊情况

  ```js
  const obj4 = {
    // 代表当前对象可迭代
    [Symbol.iterator]: function* () {
      for (let i = 0; i <= 10; i++) {
        yield i;
      }
    },
  };

  for (const item of obj4) {
    // 遇到 done 为 true 就停止
    console.log(item);
  } // 0, 1, 2, 3, 4, 5, 6, .... 9, 10
  ```

- Symbol.for

和 Symbol 不一样的是，Symbol.for 面对同样的字符串的时候会返回相同的引用

```js
const s = Symbol.for("name");
const t = Symbol.for("name");
```

## :o: JSON.stringify

:warning: 序列化过程中可能会出现的问题

1. 忽略 undefined, function, symbol,

2. 出现循环引用会报错(stringify 序列化对象的过程中导致不断引用，堆栈不断堆叠形成无限循环)

（这时候面试官很可能就会问深拷贝的问题了）

## :star2: Web Worker

:warning: 原理是什么？真的有多线程吗？实际运作的时候有什么限制？网易面试的时候被这一连串问题问懵了，确实只是知道 Web Worker 是为了解决 JS 单线程而引出的，他们通过事件监听进行通信，但是对其中的一些原理一无所知。

[学习网址 1](https://jishuin.proginn.com/p/763bfbd38a14)

[非常有用的译作](https://juejin.cn/post/6844903566281457678#heading-6)

关键字：独立内存空间/独立 JS 环境；并行执行；加载同源限制；Worker 对象；无法操作 UI；数据通信；workerGlobalScoped; DelicatedGlobalScoped;

- Web Worker 会创建操作系统级别的线程，有独立于主线程的内存空间，线程之间通过 postMessage 通信。
- Web Worker 受主线程的控制，主线程可以销毁以及创建 worker 线程。
- Web Worker 数据传输问题可能是限制效率比较大的问题，特别是在传输比较大数据量的时候，整体会影响主线程同步代码的执行导致页面阻塞。传递数据的方式有三种：structure data(结构化克隆)、transfer memory (转交内存控制权)、shared array buffer(共享内存)。项目中用到的是结构化克隆的方式，第二种转交内存控制权更多用于二进制数据，且其中存在将数据转换为二进制矩阵的损耗。第三种问题在于多个线程共享一个内存块时的竞争问题。

:star: Web Worker 是运行在浏览器内部的一条独立线程，因此需要使用 Web Worker 运行的代码块也必须存放在一个 **独立文件** 中，这点需要非常注意。

```js
var worker = new Worker("task.js");
```

如果此处的 “task.js” 存在且能被访问，那么浏览器（注意是浏览器）会创建一个新的线程去异步下载源代码文件。一旦下载完成，代码将立刻执行，此时 Worker 也就开始了它的工作。 如果提供的代码文件不存在返回 404，那么 Worker 会静默失败并不抛出异常

## :dancer: 跨域

跨域指的是打破浏览器的同源策略限制，同源策略限制指的是 协议；域名；端口相同才能进行相互通信，内部的一些缓存才能共享。这是浏览器为了保证不同网页信息不污染的一种策略。

## :key: JS 可选链 ?

[学习链接](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Optional_chaining)

可选链的用途其实非常广泛，之前觉得这个好像是 TS 里面的概念，但其实这是 JS 里面的概念，而且是非常重要的概念。

```js
obj?.prop; // 对象属性可选
obj?.[expr]; // 对象属性表达式可选
arr?.[index]; // 数组索引可选
func?.(args); // 函数调用可选
```

:exclamation: 以 obj?.prop 举例来说，可选的意思就是当 obj 不为 `null` / `undefined`才去执行 obj.prop 获得 prop 属性的值。如果不使用可选链的话会出现什么结果，如果 obj 为 undfined / null ，根本就没有访问的语法，此时就会报错了。

### 对象可选链

```js
let nestedProp = obj.first && obj.first.second;
// 等价于
let nestedProp = obj?.first;
```

所以可以理解为可选链就是先进行非 null/undefined 的判断然后再执行对应的属性查值操作

```js
// 可选链和表达式
let nesteProp = obj?.["prop" + "Name"];

// 数组索引
let arrItem = array?.[42];
```

:exclamation: 需要注意一个点，可选链不可以用于赋值，因为它是判断一个属性是否存在的操作，不存在还赋值那肯定是有问题的

```js
let object = {}
object?.name = 'hello world'
```

### 函数可选链

```js
let result = someInterface.customMethod?.();
```

- 如果 someInstance 存在 customMethod 且值是函数的话正常工作

- 如果 someInstance 存在 customMethod 且值不是函数的话会报 TypeError 的错误
- 如果 someInstance 不存在 customMethod 则返回 undefined，不进行后面函数执行操作
- 如果 someInstance 为 null / undefined 报 TypeError 的错误

:star: 处理可选的回调函数或者事件处理器

```js
function doSomething(onContent, onError) {
  try {
  } catch (err) {
    if (onError) {
      // 校验onError是否真的存在
      onError(err.message);
    }
  }
}
```

```js
// 可选链的写法
function doSomething(onContent, onError) {
  try {
  } catch (err) {
    onError?.(); // 即使onError为undefined也不会报错
  }
}
```

## :wink: 空值合并操作符 ??

[学习链接](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator)

```js
let num = age ?? 30;
```

- 如果 age 不为 undefined 或者 null，就将 age 的值返回给 num，否则就返回 30。合并的意思其实就是给变量一个默认值的意思，通常配合可选链一起使用

```js
const name = obj?.name ?? "jzy";
```

:exclamation: 区别于 ||，|| 针对的假值是有六个，而 ?? 针对的只是 undefined & null

## 手写题目

> 手写题目主要是对一些原生的 API 用自己的方法实现的过程，常见的有 apply, call, bind, instanceof, promise 的实现，再到后面可能就是深拷贝（数组深拷贝、对象的深拷贝）、数组扁平化、大数相加等等，下面就将一些常见的手写题总结汇总一下。
>
> 参考链接：https://juejin.cn/post/6946022649768181774
>
> 参考链接：https://juejin.cn/post/6968713283884974088

### JSONP 实现跨域资源请求

```js
const JSONP = function (url, params, cbName) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    window[cbName] = function (data) {
      resolve(data);
      document.body.removeChild(script);
    };

    params = {
      //
      ...params,
      callback: cbName,
    };
    const arr = Object.keys(params).map((key) => `${key}=params[key]`); // 转换参数格式
    script.src = `${url}?${arr.join("&")}`; // 拼接 url 参数
    document.body.appendChild(script);
  });
};
```

### Object.is 内部实现

:warning: Object.is 是判断两个变量是否相等的 API，与常用的 == / === 是有区别的，==会将类型进行强制类型转换但是 Object.is 不会。=== 认为 +0 和 -0 是相等的，且 NaN !== NaN，但是 Object.is 恰好相反

```js
function is(x, y) {
  if (x === y) {
    //当 x, y都是0时, 1/+0 = +Infinity, 1/-0 = -Infinity, 是不一样
    return x != 0 || 1 / x === 1 / y;
  } else {
    //  x和y同时为NaN时，返回true
    return x !== x && y !== y;
  }
}
```

### 数组扁平化

```js
// 设置扁平化的层级
function flat(arr, depth = Infinity) {
  return arr.reduce((prev, curr) => {
    // 因为有可能存在尚未完全扁平的子项，所以这里用的是[curr]
    if (depth <= 0) {
      return prev.concat([curr]);
    }
    if (Array.isArray(curr)) {
      depth--;
      // 这里容易出现忘记加上 depth
      return prev.concat(flat(curr, depth));
    } else {
      return prev.concat(curr);
    }
  }, []);
}

function flat(arr, depth = Infinity) {
  // Array.prototype.some(callback) 遇到 true 就返回
  while (arr.some((item) => Array.isArray(item)) && depth > 0) {
    // 谨记这里每次使用的都是空数组
    arr = [].concat(...arr);
    depth--;
  }
  return arr;
}
```

### 对象的扁平化

```js
/*
const obj = {
 a: {
        b: 1,
        c: 2,
        d: {e: 5}
    },
 b: [1, 3, {a: 2, b: 3}],
 c: 3
}

flatten(obj) 结果返回如下
// {
//  'a.b': 1,
//  'a.c': 2,
//  'a.d.e': 5,
//  'b[0]': 1,
//  'b[1]': 3,
//  'b[2].a': 2,
//  'b[2].b': 3
//   c: 3
// }
*/
```

```js
/**
 * @function 对象的深拷贝
 * @param {*} obj
 */
function flattenObj(obj) {
  const res = {};
  // obj 在递归结束的时候指的是某一个基本类型的值
  const flat = (obj, path) => {
    if (typeof obj !== "object") {
      res[path] = obj;
      return;
    }
    // 数组
    if (Array.isArray(obj)) {
      for (const item in obj) {
        if (obj.hasOwnProperty(item)) {
          // 防止拷贝数组上的一些原型方法
          flat(obj[item], `${path}[${item}]`);
        }
      }
    }
    // 对象
    else {
      for (const item in obj) {
        // 判断是否是初始进入的时候
        // 如果不是就得加 xxx.xxx 去访问了
        let subfix = !path ? item : path + "." + item;
        flat(obj[item], `${subfix}`);
      }
    }
  };
  flat(obj, "");
  return res;
}
```

### 深拷贝

> 深拷贝是在浅拷贝的基础上对内部所有的引用变量都进行拷贝的过程。浅拷贝是直接拷贝引用的过程，深拷贝是直接将内存空间内的内容进行拷贝

- 浅拷贝的实现方式
  - 手动拷贝
  - Object.assign
  - concat
  - slice
  - ... 扩展运算符

```js
function toRawType(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1);
}
function deepClone(obj, map = new WeakMap()) {
  // 递归的终止条件
  if (
    [
      "String",
      "Number",
      "Boolean",
      "Null",
      "Undefined",
      "Symbol",
      "Function",
    ].includes(toRawType(obj))
  ) {
    return obj;
  }

  let res = new obj.constructor();

  if (map.get(obj)) {
    return map.get(obj);
  }
  map.set(obj, res);

  // 拷贝 Date
  if (toRawType(obj) === "D") {
    return new Date(obj.valueof()); // 保证值是一样的情况下指向不同的内存地址
  }

  // 拷贝 Regxap
  if (toRawType(obj) === "Regxap") {
    let newReg = /\w+$/g;
    // 先拿到正则的文本，再拿到对应的标志位
    let result = new obj.constructor(newReg.source, newReg.exec(obj));
    result.lastIndex = obj.lastIndex; // 更新下一次匹配的开始索引
    return result;
  }

  // 拷贝 Set
  else if (toRawType(obj) === "Set") {
    for (let item of obj.keys()) {
      res.add(deepClone(item, map));
    }
  }

  // 拷贝 map
  else if (toRawType(obj) === "Map") {
    for (let item of obj.keys()) {
      res.set(item, deepClone(obj.get(item), map));
    }
  }

  // 拷贝数组和对象
  else {
    for (let key in obj) {
      res[key] = deepClone(obj[key], map);
    }
  }
  return res;
}
```

平时如何判断对象类型

- typeof
- instanceof
- Array.isArray
- Object.prototype.toString,call(8, -1)
- Object.is

...etc

### 发布订阅模式 & 观察者模式

> 它们之间很容易混淆，本质的区别是发布订阅者模式其实是有个中介角色来解耦发布者和订阅者
>
> 参考链接：https://zhuanlan.zhihu.com/p/51357583

- 观察者模式

```js
/**
 * @class 观察者
 */
class Notify {
  constructor() {
    this.observerList = [];
  }

  // 添加订阅者
  add(obj) {
    this.observerList.push(obj);
  }

  // 移除订阅者
  remove(obj) {
    const idx = this.observerList.findIndex((v) => v == obj);
    if (idx !== -1) {
      this.observerList.splice(idx, 1);
    }
  }

  // 通知订阅者
  nofify() {
    this.observerList.forEach((item) => {
      item.update(); // 所有的订阅者都部署了相同的接口
    });
  }
}

/**
 * @class 订阅者
 */
class Watch {
  constructor(name) {
    this.name = name;
  }
  update() {
    console.log(this.name);
  }
}
```

- 发布订阅模式

```js
class EventEmitter {
  constructor() {
    this.cache = {};
  }

  // 添加订阅者
  on(key, cb) {
    if (!this.cache[key]) {
      this.cache[key] = [];
    }
    this.cache.push(cb);
  }

  // 取消订阅
  off(key, cb) {
    if (!this.cache[key]) {
      return;
    }
    this.cache[key] = this.cache[key].filter((item) => item != cb);
  }

  // 更新订阅者
  update(key, callback, cb) {
    this.cache[key] = this.cache[key].map((item) => {
      if (item == callback) {
        return cb;
      } else {
        return item;
      }
    });
  }

  // 触发订阅
  emit(key, ...args) {
    this.cache[key] && this.cache[key].forEach((cb) => cb.apply(this, ...args));
  }

  // 只执行一次的订阅
  once(key, cb) {
    function fn() {
      cb();
      this.off(key, fn);
    }
    this.on(key, fn);
  }
}
```

### 数组转树

```js
// 大概的意思就是传入一个 pid，以 id 为 pid 的节点作为根节点
// 递归地去构建整一棵树
function convertToTreeData(data, pid) {
  const result = [];
  let temp = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].parentId === pid) {
      const obj = { title: data[i].title, id: data[i].id };
      temp = convertToTreeData(data, data[i].id);
      if (temp.length > 0) {
        obj.children = temp;
      }
      result.push(obj);
    }
  }
  return result;
}
var nodes = [
  { id: 2, title: "第一级1", parentId: 0 },
  { id: 3, title: "第二级1", parentId: 2 },
  { id: 4, title: "第二级2", parentId: 2 },
  { id: 5, title: "第三级1", parentId: 4 },
  { id: 6, title: "第三级2", parentId: 3 },
];
```

### 驼峰转短横线 & 短横线转驼峰

> Vue 的工具函数内部就有这么个方法，abCde -> ab-cde, ab-cde -> abCde

```js
/**
 * @function 短横线转驼峰
 * @description 驼峰一般指的是小驼峰
 * @param {*} str
 */
function toCamel(str) {
  const reg = /-(\w)/g;
  str = str.replace(reg, function (res, item1) {
    return item1.toUpperCase();
  });
  return str;
}

/**
 * @function 驼峰转短横线
 * @description 驼峰一般指的是小驼峰
 * @param {*} str
 */
function toLine(str) {
  const reg = /([A-Z])/g;
  str = str.replace(reg, function (res, item1) {
    return "-" + item1.toLowerCase();
  });
  return str;
}
```

### setTimeout 模拟 setInterval

> setInterval 的缺点在于假如内部回调的执行时间过长的话，会出现下一次回调在上一次回调执行完成后马上执行的情况，setTimeout 可以保证上一次代码执行完成后再进入下一个定时器任务。

```js
let timer = null;
function _setInterval(fn, delay) {
  if (typeof fn !== "function") {
    throw "TypeError: fn is not a function";
  }
  const cb = () => {
    timer = setTimeout(() => {
      fn.apply(this);
      cb();
    }, delay);
  };
  cb();
}
```

### 并行的 Promise 调度器

:key:本质上是通过一个 runCount 来互斥当前回调函数的访问，在 request 函数内部通过内部递归的方式

```js
//todo javascript 的并发控制
/* 
  具体的场景是：当前有若干的任务需要执行，但是当前处理器处理的任务是有限制的
  比如当前总共有 6 个任务，但是当前最多只能处理 2 个任务，需要我们编写程序进行
  调度处理，指定一个任务队列，一个运行队列，运行队列满了以后任务需要在任务队列
  进行等待，运行队列有空位，那么按优先级去除任务队列优先级高的任务运行
 */

class Scheduler {
  constructor(max) {
    this.count = 0; // 当前正在运行的任务数
    this.max = max; // 最多可运行的任务数
    this.callback = []; // 当前存储的任务队列
  }

  addTask(task, time) {
    const cb = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          task.apply(this);
          resolve();
        }, time);
      });
    };
    this.callback.push(cb);
  }

  request() {
    if (this.callback.length <= 0 || this.count > this.max) {
      return;
    }
    this.callback
      .shift()()
      .then(() => {
        this.count--;
        this.request();
      });
  }

  start() {
    for (const item of this.callback) {
      this.count++;
      this.request();
    }
  }
}
```

### instanceof

```js
fucntion _instanceof(left, right) {
    // 左侧的变量如果是基本值直接返回 false
    if(typeof left !== 'object' || left == null) { return false }
    // 右侧的变量如果不是对象报错 TypeError
    if(typeof right !== 'object') {
        throw (`${right} is not an object`)
    }
    const prototype = right.prototype
    while(left) {
        if(left.__proto__ === prototype) { return true }
        left = left.__proto__
    }
    return false
}
```

### new

```js
/**
 * @function new 模拟实现
 * @param {*} constructor 构造函数
 * @param {*} args 构造函数传递的参数
 */
function _new(constructor, ...args) {
  if (typeof constructor !== "function") {
    throw "TypeError: constrctor is not a function";
  }

  const obj = Object({});
  obj.__proto__ = constructor.prototype; // 设置隐式原型链
  const re = constructor.apply(obj, args); // 构造函数内部 this 指向 obj
  return re && (typeof re === "object" || typeof re === "function") ? re : obj;
}
```

### call

```js
Function.prototype._call = function (context) {
  context = context ? context : window; // 处理没有传入指定 this 对象的情况

  const args = [].slice.call(arguments, 1); // 获得传递进来参数
  const key = Symbol(); // 保证键值不与原对象内的发生冲突
  context[key] = this;

  return context[key](...args);
};
```

### apply

> 原理上和 call 是一样的，只是对传入参数的处理方式不一样

```js
Function.prototype._apply = function (context) {
  context = context ? context : window;

  const args = arguments[1];
  const key = Symbol();
  context[key] = this;

  return context[key](...args);
};
```

### bind

```js
Function.prototype._bind = function (context, ...args) {
  if (context == null) {
    context = window;
  }
  const _this = this;
  const cb = function () {
    // 特别需要注意的是这里不能使用箭头函数
    const _args = [...args, arguments];
    const real_this = this instanceof _this ? this : context;
    _this.apply(real_this, _args);
  };
  // 将 cb 构造函数的原型指向 _this 实例使得原型链上的数据可以继承
  cb.prototype = Object.create(_this);
  return cb;
};
```

:exclamation: 上面的代码是可以绑定但是好像不符合真实 bind 的机制

```js
Function.prototype._bind = function (context, ...args) {
  if (context == null) {
    context = window;
  }

  const self = this;
  return function F(...arg) {
    if (this.constructor === F) {
      // 作为构造函数
      return new self(...args, ...arg);
    }

    return self.apply(context, [...args, ...arg]);
  };
};
```

## 排序算法

> 排序算法稳定性分析是比较重要的问题，指的是在排序的前后，相等元素的相对次序保持不变，稳定的排序算法能够对多次排序的结果又记忆功能。稳定性的判断在于比较的过程中是否会发生跨元素的情况

### 冒泡排序

```js
/**
 * @function 冒泡排序
 * @param {*} arr
 */
function sort(arr) {
  let isSwap;
  const len = arr.length;
  for (let i = 0; i < len - 1; i++) {
    isSwap = false;
    for (let j = 1; j < len; j++) {
      if (arr[j - 1] > arr[j]) {
        // 冒泡排序算法并不是一定是稳定的，稳定的原因是因为我们这里采用的是 > 的策略，如果更换成 >= 就变成不稳定排序了
        let tmp = arr[j - 1];
        arr[j - 1] = arr[j];
        arr[j] = tmp;
        isSwap = true; // 优化策略1
      }
    }
    if (!isSwap) {
      break;
    }
  }
  return arr;
}
```

### 选择排序

> 不稳定的排序算法
>
> 【1,3[1],7,4,6,3[2],5,2】
>
> 排序过程中可能出现 3[1] 在 3[2] 后面的情况

```js
/**
 * @function 选择排序
 * @param {*} arr
 */
function sort(arr) {
  // 选择的策略的问题（每次选的是最大值还是最小值）
  let min_index,
    len = arr.length;
  for (let i = 0; i < len - 1; i++) {
    min_index = i;
    for (let j = i + 1; j < len; j++) {
      if (arr[j] < arr[min_index]) {
        min_index = j;
      }
    }
    if (min_index !== i) {
      // 判断是否有比 arr[i] 更小的元素
      let tmp = arr[i];
      arr[i] = arr[min_index];
      arr[min_index] = tmp;
    }
  }
  return arr;
}
```

### 插入排序

> 插入排序和冒泡排序一样是可以被设计成稳定的排序算法 arr[j] < arr[j-1] 是关键

```js
/**
 * @function 插入排序
 * @param {*} arr
 */
function sort(arr) {
  const len = arr.length;
  let isSwap;
  for (let i = 1; i < len; i++) {
    isSwap = false;
    for (let j = i; j >= 1; j--) {
      if (arr[j] < arr[j - 1]) {
        // 迭代比较的过程
        let tmp = arr[j];
        arr[j] = arr[j - 1];
        arr[j - 1] = tmp;
      }
    }
  }
  return arr;
}
```

### 快速排序

> 可扩展性很强，基本的策略就是选定一个中间值，将所有小于它的元素移动到中间值左边，将所有大于它的元素移动到中间值右边。
>
> 稳定性分析的参考链接：https://blog.csdn.net/gaoxueyi551/article/details/89413936

```js
/**
 * @function 快速排序
 * @param {*} arr
 * @example 假设有这么一种极端情况 [1, 1, 1, 1, 1]
 * 快排不稳定的根源在于基准元素的选取
 */
function sort(arr, left, right) {
  if (left >= right) {
    return;
  }
  let t = arr[left],
    i = left,
    j = right;
  while (i < j) {
    while (i < j && arr[j] > t) {
      j--;
    }
    arr[i] = arr[j];
    while (i < j && arr[i] < t) {
      i++;
    }
    arr[j] = arr[i];
  }
  arr[i] = t;
  sort(arr, left, i - 1);
  sort(arr, i + 1, right);
  return arr;
}
// 调用的时候注意传参问题
```

### 归并排序

> 稳定的排序算法，每个数组的相对顺序总是会保持的

```js
/**
 * @function 归并排序
 * @param {*} arr
 */
function mergeSort(arr1, arr2) {
  if (arr1.length <= 0) {
    return arr2;
  }
  if (arr2.length <= 0) {
    return arr1;
  }

  const arr3 = [];
  let i = (j = 0);
  while (i < arr1.length && j < arr2.length) {
    if (arr1[i] < arr2[j]) {
      arr3.push(arr1[i++]);
    } else {
      arr3.push(arr2[j++]);
    }
  }

  // 注意最后需要对 slice 后结果进行解构赋值
  i < arr1.length && arr3.push(...arr1.slice(i));
  j < arr2.length && arr3.push(...arr2.slice(j));
  return arr3;
}
function sort(arr) {
  // 当左右的元素都只剩下一个的时候可以进行合并操作
  if (arr.length < 2) {
    return arr;
  }
  let mid = Math.floor(arr.length / 2);
  return mergeSort(sort(arr.slice(0, mid)), sort(arr.slice(mid)));
}
```

### LazyMan

> 难点有
>
> 1. 实现链式调用，每个函数都必须返回 this 实现链式调用
> 2. 队列存储，将所有的任务都存储到一个任务队列当中
> 3. 异步调用，constructor 内部使用异步调用保证后面的步骤全部执行完
> 4. sleep 状态区分，是首休眠还是说普通休眠，首休眠的话需要把首休眠的任务放到任务队列的队头

```js
/**
 * @class 实现 LazyMan
 * @description 一个取和执行的过程
 */

/*实现一个LazyMan，可以按照以下方式调用:
LazyMan(“Hank”)输出:
Hi! This is Hank!

LazyMan(“Hank”).sleep(10).eat(“dinner”)输出
Hi! This is Hank!
//等待10秒..
Wake up after 10
Eat dinner~

LazyMan(“Hank”).eat(“dinner”).eat(“supper”)输出
Hi This is Hank!
Eat dinner~
Eat supper~

LazyMan(“Hank”).eat(“supper”).sleepFirst(5)输出
//等待5秒
Wake up after 5
Hi This is Hank!
Eat supper*/

class LazyMan {
  constructor(name) {
    this.tasks = [];
    const task = () => {
      console.log(`Hi! This is ${name}`);
      this.next();
    };

    this.tasks.push(task);
    setTimeout(() => {
      // 使用异步的原因是因为可能后面有 sleep 或者 sleepFirst
      this.next();
    }, 0);
  }
  next() {
    const task = this.task.shift();
    task && task();
  }
  sleep(time) {
    this._sleepWrapper(time, false);
    return this; // 实现链式调用
  }
  sleepFirst(time) {
    this._sleepWrapper(time, true);
    return this;
  }
  _sleepWrapper(time, isFirst) {
    const task = () => {
      setTimeout(() => {
        console.log(`Wake up after ${time}`);
        this.next(); // 每次执行完就请求下一次的执行
      }, time * 1000);
    };
    if (isFirst) {
      this.tasks.unshift(task);
    } else {
      this.task.push(task);
    }
  }
  eat(name) {
    const task = () => {
      console.log(`Eat ${name}`);
      this.next();
    };
    this.tasks.push(task);
    return this;
  }
}
```

### 防抖

```js
var debounce = function (fn, delay = 3000) {
  let timer = null;
  return function () {
    const args = arguments;
    if (timer) {
      clearInterval(timer);
    }
    // 每次都重新计时
    timer = setTimeout(() => {
      // 箭头函数解决 this 指向问题，不然指向的是 window
      fn.apply(this, args);
    }, delay);
  };
};
```

```js
// 我们可以这样去理解立即执行这个概念，立即执行就是第一次触发就会执行
// 那后面怎么互斥这个立即执行呢，我们会在 setTimeout 里面重置立即执行
// 只有当执行完一次完整的 setTimeout 以后才能够重新立即执行
// 由始至终其实都是第一次调用，然后 ns 后再进行下一次的头调用
var debounce = function (fn, delay = 3000, immediate = false) {
  let timer = null;

  return function () {
    const args = arguments,
      context = this;

    if (timer) {
      clearTimeout(timer);
      // 因此这里不能进行置 null 的操作
    }

    // 下面就是判断 immediate 为 true / false 的操作
    if (immediate) {
      // 要么是这个
      // 清除定时器后对应的 timer 是定时器的 id
      let isCall = !timer; // 判断是否能执行的关键
      timer = setTimeout(() => {
        timer = null;
      }, delay);
      isCall && fn.apply(context, args);
    } else {
      // 要么是这个
      timer = setTimeout(() => {
        fn.apply(context, args);
      }, delay);
    }
  };
};
```

### 节流

### 版本号比较

> 题目描述:有一组版本号如下['0.1.1', '2.3.3', '0.302.1', '4.2', '4.3.5', '4.3.4.5']。现在需要对其进行排序，排序的结果为 ['4.3.5','4.3.4.5','2.3.3','0.302.1','0.1.1']

```js
const arr_1 = ["0.1.1", "2.3.3", "0.302.1", "4.2", "4.3.5", "4.3.4.5"];
const res = arr_1.sort((a, b) => {
  let item1 = a.split(".");
  let item2 = b.split(".");
  for (let i = 0; i < item1.length; i++) {
    if (item1[i] < item2[i]) {
      return 1;
    } else if (item1[i] > item2[i]) {
      return -1;
    }
  }
  if (i < item2.length) {
    return 1;
  } else return -1;
});
```

> 顺便回顾了下 Array.prototype.sort 的内容，sort 支持我们传入一个函数，函数有两个参数，一个是 a 一个是 b，如果 a - b < 0 的话那么最后 a 会在 b 前面，如果 a - b = 0 那么相对的位置不发生改变，如果 a - b > 0 ，那么 a 会排在 b 的后面

### LRU 算法

> LRU 是通过双向链表和哈希表来实现元素的出入的

```js
/**
 * @class 基于 Map 结构实现 LRU 算法
 * @description 基于哈希表的查找和删除的线性时间复杂度
 */

class LRUCache {
  constructor(capacity) {
    this.secretKey = new Map();
    this.capacity = capacity;
  }
  get(key) {
    if (this.secretKey.has(key)) {
      let tempValue = this.secretKey.get(key);
      this.secretKey.delete(key);
      this.secretKey.set(key, tempValue);
      console.log("get keys:", this.secretKey.keys());
      return tempValue;
    } else return -1;
  }
  put(key, value) {
    // key存在，仅修改值
    if (this.secretKey.has(key)) {
      this.secretKey.delete(key);
      this.secretKey.set(key, value);
    }
    // key不存在，cache未满
    else if (this.secretKey.size < this.capacity) {
      this.secretKey.set(key, value);
    }
    // 添加新key，删除旧key
    else {
      this.secretKey.set(key, value);
      // 删除map的第一个元素，即为最长未使用的
      console.log("put keys:", this.secretKey.keys());
      this.secretKey.delete(this.secretKey.keys().next().value);
    }
  }
}
```

### 硬币找零

```js
/**
 * @function 硬币找零
 * @param {*} coins
 * @param {*} account
 * @description dp数组的定义 dp[i] 总值为 i的款项需要的最小凑次数
 */
function caluCoin(coins, account) {
  // 典型的背包问题
  const dp = [0];
  for (let i = 1; i <= account; i++) {
    dp[i] = Infinity; // 置为无穷方便比较
    for (let j = 0; j < coins.length; j++) {
      if (i >= coins[j]) {
        dp[i] = Math.min(dp[i], dp[i - coins[j]] + 1);
      }
    }
  }
  if (!isFinite(dp[account])) {
    return -1;
  }
  return dp[account];
}
```

### 类数组转数组的方法

```js
// 扩展运算
[...arraylike];
// Array.from
Array.from(arraylike);
// 原型
Array.prototype.slice.call(arraylike);
Array.prototype.concat.apply([], arraylike);
```

### 使用 XMLHttpRequest 实现 AJAX

> MDN 介绍：https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/open

```js
function ajax(method, params) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    // true 代表的是异步
    xhr.open("GET", url);
    // 设置请求头
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.readystate != 4) return;
      if (xhr.status === 200 || xhr.status === 304) {
        resolve(xhr.responseText);
      } else {
        reject(new Error(xhr.responseText));
      }
    };
    // get 或者 head 请求应该置为 null
    xhr.send();
  });
}
```

### 实现模板字符串解析功能

```js
/*
let template = '我是{{name}}，年龄{{age}}，性别{{sex}}';
let data = {
  name: '姓名',
  age: 18
}
render(template, data); 我是姓名，年龄18，性别undefined
*/
```

```js
function render(template, data) {
  const reg = /\{\{([a-z]+)\}\}/g;
  const str = template.replace(reg, function (_, args) {
    // - 代表的是匹配完整的字符串 {{name}} {{age}}
    // args 代表的是内部的变量 name, age
    return data[args];
  });
  return str;
}
```

### 列表转树形结构

```js
/*
[
    {
        id: 1,
        text: '节点1',
        parentId: 0 //这里用0表示为顶级节点
    },
    {
        id: 2,
        text: '节点1_1',
        parentId: 1 //通过这个字段来确定子父级
    }
    ...
]

转成
[
    {
        id: 1,
        text: '节点1',
        parentId: 0,
        children: [
            {
                id:2,
                text: '节点1_1',
                parentId:1
            }
        ]
    }
]
*/
```

### 判断循环引用

```js
function function isCycle(obj) {
  let hasCycle = false
  const map = new Map()

  function loop(obj) {
      const keys = Object.keys(obj)
      keys.forEach(item => {
          const val = obj[item]
          if(val != null && typeof val === 'object') {// 是对象才可能存在循环引用的情况
              if(map.get(val)) {
                  hasCycle = true
                  return
              } else {
                  map.set(val, val)
                  loop(val) // 因为可能存在多个对象嵌套的情况 -- 需要递归调用
              }
          }
      })
  }

  loop(obj)

  return hasCycle
}
```

### 对象 / 数组宽松比较

```js
/* vue2 内部的判断函数 */
/* 在原理的基础上增加了 set 、map、date 的 loose equal */
function looseEqualUpper(a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      let typeA = toRawType(a), typeB = toRawType(b) // 借用上述得到源类型的方法

      if (typeA == 'Array' && typeB == 'Array') { // Array
          // Array.prototype.every() - 遇到false 返回false,否则返回tru
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (a instanceof Date && b instanceof Date) { // Date
        return a.getTime() === b.getTime()
      } else if(typeA == 'Set' && typeB == 'Set') { // Set
          console.log('===Set===')
          const keysA = a.keys(), keysB = b.keys()

          if(keysA.length === keysB.length) {
              for(let itemA of a) { // 如果是基于无顺序都要验证相等性的话
                let tmp = 0
                for(let itemB of b) {
                  if(looseEqualUpper(itemA, itemB)) { break }
                  else tmp++
                }
                if(tmp === keysA.length) { return false }
              }
          }
          return true


      } else if(typeA == 'Map' && typeB == 'Map') { // Map
          console.log('===Map===')
          const keysA = a.keys(), keysB = b.keys()

          if(keysA.length === keysB.length) {
            for(let item of keysA) {
              return looseEqualUpper(a.get(item), b.get(item))
            }
          } else { return false }

        } else if (!isArrayA && !isArrayB) { // Object
          var keysA = Object.keys(a);
          var keysB = Object.keys(b);

          // 键值列表长度 & 每个键值
          return keysA.length === keysB.length && keysA.every(function (key) {
            return looseEqual(a[key], b[key]) // 同样存在键值是对象需要递归判断
          })
      }

      else {
        return false
      }
    } catch (e) {
      return false
    }
  } else if (!isObjectA && !isObjectB) {// 基本值的判断
    return String(a) === String(b)
  } else {
    return false
  }
}xxxxxxxxxx function isLooseEqual() {/* vue2 内部的判断函数 */function looseEqualUpper(a, b) {  if (a === b) { return true }  var isObjectA = isObject(a);  var isObjectB = isObject(b);  if (isObjectA && isObjectB) {    try {      let typeA = toRawType(a), typeB = toRawType(b) // 借用上述得到源类型的方法      if (typeA == 'Array' && typeB == 'Array') { // Array        return a.length === b.length && a.every(function (e, i) {          return looseEqual(e, b[i])        })      } else if (a instanceof Date && b instanceof Date) { // Date        return a.getTime() === b.getTime()      } else if(typeA == 'Set' && typeB == 'Set') { // Set          console.log('===Set===')          const keysA = a.keys(), keysB = b.keys()          if(keysA.length === keysB.length) {               for(let itemA of a) { // 如果是基于无顺序都要验证相等性的话                let tmp = 0                for(let itemB of b) {                  if(looseEqualUpper(itemA, itemB)) { break }                  else tmp++                }                if(tmp === keysA.length) { return false }              }          }           return true       } else if(typeA == 'Map' && typeB == 'Map') { // Map          console.log('===Map===')          const keysA = a.keys(), keysB = b.keys()                    if(keysA.length === keysB.length) {            for(let item of keysA) {              return looseEqualUpper(a.get(item), b.get(item))            }          } else { return false }        } else if (!isArrayA && !isArrayB) { // Object          var keysA = Object.keys(a);          var keysB = Object.keys(b);                    // 键值列表长度 & 每个键值          return keysA.length === keysB.length && keysA.every(function (key) {            return looseEqual(a[key], b[key]) // 同样存在键值是对象需要递归判断          })      }             else {        return false      }    } catch (e) {      return false    }  } else if (!isObjectA && !isObjectB) {// 基本值的判断    return String(a) === String(b)  } else {    return false  }}}
```

## Vue 原理实现

> 响应性原理

Vue 双向绑定原理

双向绑定建立在 MVVM 的模型基础上。

- 模型层应用的数据及业务逻辑
- 视图层应用的展示效果，各类 UI 组件
- 业务逻辑层，负责将数据和视图关联起来

双向绑定指的是

1. 数据变化后更新视图
2. 视图变化后更新数据

Vue 实现中两个主要组成部分

- 监听器 Observer：对所有属性进行监听
- 解析器 Compiler，对每个元素节点的指令进行扫描和解析，根据指令替换数据，绑定对应的更新函数

具体的实现原理

1. new Vue 执行初始化，将 data 中数据通过 Object.defineProperty 进行响应化处理，过程发生在 Observer 里面，每个 key 都会一个 dep 实例来存储 watcher 实例数组
2. 对模版进行编译时，找到动态绑定数据，从 data 中获取数据并初始化视图，这个过程发生在 Complier，如果遇到了 v-model， 就监听 input 事件，更新 data 对应的数值
3. 在解析指令的过程中，会定义对应的更新函数和 watcher，之后对应的数据变化时，watcher 会调用更新函数，watcher 读取 data 的 key，触发 getter 的依赖机制，将对应的 watcher 添加到 dep 里
4. data 数据一旦发生变化，会找到对应的 dep，通知所有的 watcher 执行更新函数

### parsePath

```js
/**
 * @function 解析形如b.a.c返回值
 */
const bailRE = new RegExp("/[^\\w.$]/");
function parsePath(path) {
  // 保证不出现出 a-zA-Z0-9_$外的其他字符
  if (bailRE.test(path)) {
    return;
  }
  const segments = path.split(".");
  return function (obj) {
    // 解析
    for (let i = 0; i < segments.length; i++) {
      if (!obj) return;
      obj = obj[segments[i]];
    }
    return obj;
  };
}
```

### reactive - 基于对象

```js
/**
 * @function 响应式
 * @param {*} obj
 */

const render = (key, val) => {
  console.log(`SET key=${key} val=${val}`);
};

const defineReactive = (obj, key, val) => {
  // 递归的操作
  reactive(val);

  // Object.definePropert 监听
  Object.defineProperty(obj, key, {
    get() {
      return val;
    },
    set(newVal) {
      if (val === newVal) return;
      val = newVal;
      render(key, newVal);
    },
  });
};

const reactive = (obj) => {
  if (typeof obj === "object") {
    for (const key in obj) {
      defineReactive(obj, key, obj[key]);
    }
  }
};

// 实现的目的是调用 reactive(data) 从而实现对整个 data 对象的一个监听
const data = {
  a: 1,
  b: 2,
  c: {
    c1: {
      af: 900,
    },
    c2: 4,
  },
};
```

### reactive - 基于数组

```js
/**
 * @function 模仿Vue重写数组原型上的方法
 */

const render = (methods, ...args) => {
  console.log(`Action ${methods} arg=${args.join(",")}`);
};

const arrPrototype = Array.prototype; // 保存原来数组原型
const newArrayPrototype = Object.create(arrPrototype)[
  ("push", "pop", "shift", "unshift", "sort", "splice", "reverse")
].forEach((methodname) => {
  newArrayPrototype[methodname] = function () {
    // 执行原有的数组方法
    arrPrototype[methodname].call(this, arguments);
    // 触发渲染
    render(methodname, ...arguments);
  };
});

const reactive = (obj) => {
  if (Array.isArray(obj)) {
    obj__proto__ = newArrayPrototype; // 更改原型链
  }
};
```

### proxy

> QU proxy 能够对深层对象进行监听吗？与下面的递归到底有什么区别呢？

```js
/**
 * 简单实现 proxy 响应式
 */

let observeStore = new Map();

function makeObservable(target) {
  let handlername = Symbol("handler");
  observeStore.set(handlername, []); // 注册多个回调函数

  // 加入回调函数
  target.observe = function (cb) {
    observeStore.get(handlername).push(cb);
  };

  // 设置拦截配置
  const proxyHandler = {
    get(target, key) {
      // 如果当前存在嵌套层级的对象
      if (typeof target[key] === "object" && target[key] != null) {
        return new Proxy(target[key], proxyHandler);
      }

      let success = Reflect.get(...arguments);
      success &&
        observeStore
          .get(handlername)
          .forEach((handler) => handler("get", key, target[key]));
      return success;
    },
    set(target, key, newVal) {
      let success = Reflect.set(...arguments);
      success &&
        observeStore
          .get(handlername)
          .forEach((handler) => handler("set", key, target[key]));
      return success;
    },
    deleteProperty(target, key) {
      let success = Reflect.defineProperty(...arguments);
      success &&
        observeStore
          .get(handlername)
          .forEach((handler) => handler("delete", key, target[key]));
      return success;
    },
  };

  return new Proxy(target, proxyHandler);
}

let user = {};
user = makeObservable(user); // 将 user 变为响应式对象

// observe 回调在数据发生改变的时候执行回调函数 - 注意可能注册了很多回调函数
user.observe((action, key, value) => {
  // 执行响应
});
```

---

虚拟 DOM 是 对于真实 DOM 的抽象，本质上是 JS 对象，可以通过渲染器解析映射到真实 DOM 上

从优点来说

1. 相对于真实 DOM 来说，操作的属性比较少
2. 不需要手动操作 DOM
3. 可以跨平台(基于本质是 JS 对象)

从缺点来说

1. 首次渲染大量 DOM 的时候，由于多了一层虚拟 DOM 的计算，会比 innerHTML 插入速度慢
2. 做一些针对性的优化的时候，真的 DOM 的操作还是更快一点

### 虚拟 DOM 转 真实 DOM

```js
{
  tag: 'DIV',
  attrs:{
  id:'app'
  },
  children: [
    {
      tag: 'SPAN',
      children: [
        { tag: 'A', children: [] }
      ]
    },
    {
      tag: 'SPAN',
      children: [
        { tag: 'A', children: [] },
        { tag: 'A', children: [] }
      ]
    }
  ]
}
// 把上诉虚拟Dom转化成下方真实Dom
<div id="app">
  <span>
    <a></a>
  </span>
  <span>
    <a></a>
    <a></a>
  </span>
</div>
```

```js
function render(vnode) {
  // 防止递归过程中出现 number 类型的数据
  if (typeof vnode === "number") {
    vnode = String(vnode);
  }
  if (typeof vnode === "string") {
    // 创建内容/文本节点
    return document.createTextNode(vnode);
  }

  // 创建节点
  const realDom = document.createElement(vnode.tag);
  // 属性赋值
  if (vnode.attrs) {
    for (const key in attrs) {
      realDom.setAttribute(key, vnode.attrs[key]);
    }
  }

  // 遍历判断是否存在子结点
  if (vnode.children) {
    vnode.forEach((childNode) => {
      realDom.appendChild(render(childNode));
    });
  }

  return realDom;
}
```

### nextTick

```vue
<template>
  <div>
    <div>{{ number }}</div>
    <div @click="handleClick">click</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      number: 0,
    };
  },
  methods: {
    handleClick() {
      for (let i = 0; i < 1000; i++) {
        this.number++;
      }
    },
  },
};
</script>
```

:warning: 像上面这种情况一样，如果 Vue 不做处理的话视图会在每次 this.number ++ 后更新，导致更新的次数为 1000 次，这对性能来说是非常不好的。所以 Vue 的处理方式是将对应的 Watcher push 进入一个队列中，在一定的时机后再统一进行更新。这里的时机指的是下一个事件循环，也就是在执行上下文栈为空的时候才进行更新操作。对于上面的代码来说，执行的时机是 for 循环 1000 次以后，因为这个队列会去重，所以最后只有一个 Watcher，然后再调用 update 方法去更新视图。

:star2: nextTick 的实现其实就是用到了事件循环，使用形如 Promise / setTimeout / MutationObserve 等方式去包装。源码里面就针对浏览器支持各种 API 的程度写了一个策略函数。

```js
// 简单模拟一下
const queue = []; // 存放回调函数列表
let pending = false; // 互斥变量 同一时间只能执行一次

function nextTick(cb) {
  queue.push(cb);

  if (!pending) {
    pending = true;
    setTimeout(flushCallbacks, 0);
  }
}

// 执行所有的 callbacks 函数
function flushCallbacks() {
  pending = false;
  const copies = queue.slice(0);
  queue.length = 0;
  for (let i = 0; i < copies.length; i++) {
    copies[i]();
  }
}
```

:warning: 上面只是把 callback 加进去 queue 里面了对吧我们还没有进行去重的操作，所以还需要对相同的 watch 进行去重，一个实现的思路就是通过一个 uid 标识不同的 watcher，如果是相同 uid 的 watcher 那么就不再加入到里面去了。

```js
let uid = 0

class Watcher {
	constructor() {
		this.id = ++uid
    },
}
```
