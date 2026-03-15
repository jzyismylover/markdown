# ES6  系列

[TOC]



## :smile: 函数的扩展

- 函数的 length 属性指的是预期传入函数的参数长度

- 剩余参数末尾不能接其他参数
- bind 返回的函数，name 属性值会加上 bound 前缀

```js
// 所以在模拟 bind 方法的时候这个可能是模拟不出来的
function foo() {};
foo.bind({}).name // "bound foo"

(function(){}).bind({}).name // "bound "
```



### 箭头函数

:key: 箭头函数的作用是使得回调函数的语法更加简洁

```js
arrayList.map(item => {})
// 替换了
arrayList.map(function() {
     
})
```

:exclamation: 普通函数内部的 this 指向函数运行时所在的对象，箭头函数的 this 就是 | 定义时上层作用域 | 指向的 this，也就是说箭头函数的 this 是固定的，不允许通过其他类似 call / apply 的方式进行修改。

```js
// ES6
function foo() {
  setTimeout(() => {
    console.log('id:', this.id);
  }, 100);
}

// ES5
function foo() {
  var _this = this;

  setTimeout(function () {
    console.log('id:', _this.id);
  }, 100);
}
```



:exclamation: 对象不构成作用域使得最后下面的 this 指向 window

```js
const cat = {
  lives: 9,
  jumps: () => {
    this.lives--;
  }
}
```

块级作用域指的是 {} 包裹着的代码

```js

//if块
if(1){}

//while块
while(1){}

//函数块
function foo(){}
 
//for循环块
for(let i = 0; i<100; i++){}

//单独一个块
{}
```







### Function.prototype.toString

:key: toString 方法会返回函数代码本身，而且新版本的内置方法会保留函数的注释





### catch 命令的参数省略

```js
try {
}catch(err){
    
}
// 以往我们在写 try...catch 的时候通常会这样子去写
// 但其实很多时候我们是不需要 err 传参的

try {} catch {}
// 所以在新版中我们可以像上面一样去写
```









## :smile: Object 

对象一些方法的集合



### Object.hasOwnProperties

方法返回一个由指定对象的所有自身属性的属性名（包括不可枚举属性但不包括Symbol值作为名称的属性）组成的数组.















## :smile: 字符串的新增方法



###  padStart & padEnd

- 实例方法；用于在头部补全字符串

- 参数列表：

​			len - 字符串补全生成的最大长度

​			str - 用于补全的字符串

```js
// 比如在大数相加中 两个数的位数不一样的时候需要进行头部补全
function bigAdd(a, b) {
    const MAXL = Math.max(a.length, b.length)
    a = a.padStart(MAXL, 0)
    b = b.padStart(MAXL, 0)
    // .......进行下一步的累加处理
}
```

补全的规则

- 如果原字符串的长度大于等于指定的长度，返回原字符串
- 如果用于补全的 str 长度和原字符串长度累加大于 len，截取掉超出长度的 部分 str 字符(填满了就行的意思)



---



### trimStart & trimEnd

- 作用和 trim 是一样的，只是说现在将 trim 分成了首尾两种，去首就用

  trimStart，去尾就用 trimEnd。

- @result：总是返回新的字符串

- 除了空格键，这两个方法对字符串头部（或尾部）的 \t、\n等不可见的空白符号也有效



---



### includes & startsWith & endsWith

提供了三个方法来判断一个字符串是否包含另外一个字符串



- includes : 返回布尔值，表示是否找到了参数字符串
- startsWith：返回布尔值，表示参数字符串是否在原字符串的头部
- endsWith：返回布尔值，表示参数字符串是否在原字符串的尾部

```js
let s = 'Hello world!';

console.log(s.endsWith('Hello ', 6)) // true 针对是前 6 个字符
console.log(s.endsWith('hello ', 6)) // false 大小写敏感
console.log(s.startsWith('world', 6)) // true 从第7个字符串开始比较
console.log(s.startsWith(' world', 6)) // false
```





## :star: Set & Map

ES6 引出的新的数据结构，本质也是为了补充 ES5 数组对象等在使用场景上有限的问题。



### Set 结构

set 作为集合的一个概念，里面不存在相等的元素。其实本质上是使用 类似JS 的 === 算法来进行判断的，也就是说 -0 和 +0 在 === 是相等的，那就不会被重新添加到结构中。

```js
NaN === NaN // JS 认为这个是 false
```



:wink: set 原型上的方法

- add
- has
- delete
- size
- clear



:cop: Set 的遍历 -- key 和 value 是一样的

- Set.prototype.keys -- 返回键
- Set.prototype.values -- 返回值
- Set.prototype.entries -- 返回[键，值]



:exclamation: 需要注意以下几点

- 在 set 中 NaN 和 NaN 不会重复
- 在 set 中 null 和 null / undefined 和 undefined不会重复
- 引用类型数组，对象等引用类型会出现重复(因为它们都是不同的引用)
- Array.from 可以将 Set 转为 Array(在数组去重中非常好用)







### weakSet 

weakSet 其实与 Set 的区别：weakSet 保存的是弱引用，所以只能存储引用类型，弱引用的意思就是当前对成员的引用不纳入计数的范围内。进入垃圾回收时机以后就可以去回收内存了。

:grey_exclamation: 有几点需要注意

- 还是一个集合(只是元素类型有限制)

- 没有遍历方法，只有 add / delete / has。没有遍历是因为成员随时可能被回收，运行前后的成员的数量很可能出现不一致的情况。
- 没有 size 属性，原理和上面的类似。

```js
const foos = new WeakSet()
class Foo {
  constructor() {
    foos.add(this)
  }
  method () {
    // 好处在于在实例外部引用为0 的时候可以直接回收不用考虑 foos
    if (!foos.has(this)) {}
  }
}
```



### Map 结构

map 解决了什么问题？map 解决了 ES5 中对象只能以字符串作为键的问题，其实这个也不算是问题，只是说存在一定的局限性而已。



:man: 初始化

- 接受一个二维数组，每个成员表示的是 [键，值]，原理如下：

````js
const items = [
  ['name', '张三'],
  ['title', 'Author']
];

const map = new Map();

items.forEach(
  ([key, value]) => map.set(key, value)
);
````

利用了 items 是可迭代的，得到一个双结构的元素进行 map 的初始化，因此除了数组，任意一个可迭代的具有双元素的数据都是可以作为 map 初始化的源的。



:joy_cat: map 方法集合

- get -- 读取未知的键返回 undefined
- set  -- 同一个键多次赋值以最后的为主
- has
- delete
- size
- clear



:pouting_cat: map 的遍历（区别于 Set 就是 key 和 value 是不一样的）

- Map.prototype.keys -- 返回键

- Map.prototype.values -- 返回值

- Map.prototype.entries -- 返回 [键，值]

- Map.prototype.forEach

  ```js
  const reporter = {
    report: function(key, value) {
      console.log("Key: %s, Value: %s", key, value);
    }
  };
  
  map.forEach(function(value, key, map) {
    this.report(key, value);
  }, reporter);// reporter 作为 forEach 绑定的 this 对象
  ```





:exclamation: 需要注意以下问题

- 多个NaN 为被 map 视为相同的键
- map 的遍历顺序就是插入顺序(解决 LRU 非常有用的一个特性)
- map 的默认迭代器接口是就是 Map.prototype.entries





### weakMap

只接受引用类型的数据作为键值，因为保存的是键名指向对象的弱引用。

````js
const e1 = document.getElementById('foo');
const e2 = document.getElementById('bar');
const arr = [
  [e1, 'foo 元素'],
  [e2, 'bar 元素'],
];
````

想象一下上面的场景， arr 保持着对 e1, e2 的引用，e1, e2 要被清除得去清除 arr 的引用，难倒是不难，主要是很多时候我们都会忘记这件事就可能导致内存泄漏了。



:exclamation: 需要注意以下问题

- 注意是对键名指向对象的弱引用，不是键值，但是一旦键名被删除了，键值的引用也就解除了(对应的)

- 没有遍历方法
- 没有 size 属性
- 不支持 clear 方法，只支持 get / delete / has / set



### weakRef

ES2021 引出的一个新的基于弱引用的数据结构(现实中不知道各大浏览器的支持度如何)

```js
const proxy = new WeakRef({
   name: ''
})
// proxy 是对对象的弱引用
```

```js
const obj = proxy.deref()
// 如果原始对象已经被清除掉的话，则 obj 为 undefined 
// 否则就返回原始对象
```

- 一个经典的弱引用缓存的实现函数

```js
function makeWeakCached(f) {
  const cache = new Map();
  return key => {
    const ref = cache.get(key);
    if (ref) {// 过期 | 缓存
      const cached = ref.deref();
      if (cached !== undefined) return cached;
    }

    const fresh = f(key);
    cache.set(key, new WeakRef(fresh));
    return fresh;
  };
}

const getImageCached = makeWeakCached(getImage);
```







## :key: Promise 对象

:key: Promise 是一种异步编程的解决方案，本质上是为了解决以前的回调地狱的问题。



### Promise 缺点

- 无法取消，一旦新建就会立即执行，无法中途取消
- 如果不设置回调函数，Promise 内部抛出的错误不会反应到外部

```js
const promise = new Promise((resolve, reject) => {
    throw ('Error')
    resolve(1)
})
// 里面的这个错误完全被吃掉了，对外部不产生任何的影响
// 本质上其实是 promise 内部进行了一个 try...catch 的处理
```

- 当处于 pending 状态的时候无法得出目前处于哪一个阶段(刚开始/即将完成???)



### Promise 特点

1. 状态单一转换途径 -- 只能由内部的 resolve 和 reject 改变，不受外界的影响
2. 状态不可逆 / 不可变 -- 一旦状态由 pending 变到 resolve / reject 就不能再次改变



### Promise 注意事项

- 当返回一个 promise 后状态直接依赖于返回的 promise

```js
const p1 = new Promise(function (resolve, reject) {
  setTimeout(() => reject('fail'), 3000)
})

const p2 = new Promise(function (resolve, reject) {
  setTimeout(() => resolve(p1), 1000)
})

// p2 的状态依赖于p1 的状态
p2
  .then(result => console.log(result))
  .catch(error => console.log(error))
// Error: fail
```



- 调用 resolve 或 reject 并不会终结  Promise 的参数函数的执行，如下 resolve 了以后后面的代码都会执行，所以保险地来说我们一般会在 resolve 后加上 return 保证当前 promise 内部的执行完成

```js
new Promise((resolve, reject) => {
  resolve(1);
  console.log(2);
}).then(r => {
  console.log(r);
});
// 2
// 1
```



### Promise.prototype.then

then 方法的作用是为  Promise 提供状态变换后的回调执行。返回的是一个新的 Promise 对象，如果 then 内部 return 的是一个基本值的话，新 Promise 的状态会直接 resolve；如果 return 的是一个 Promise，会执行 Promise.then(resolve, reject) 的操作，也就是状态的变化完全依赖于 return 的 promise。

```js
let promise = new Promise((resolve, reject) => {
    resolve('hello')
})

promise.then(res => {
    console.log(res) // hello
    return 'world'
}).then(res => {
    console.log(res) // world
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve('Sunday'), 2000)
    })
}).then(res => {// 执行的时机依赖于上一个then 返回的 promise
	console.log(res) // 2000 ms 后输出 Sunday
})
```



### Promise.prototype.catch

catch 方法其实是 then(null, () => {}) 的表现形式，也就是只捕获错误后执行的回调函数。里面比较重要的是一个叫 ”错误透传“ 的概念。

```js
const promise = new Promise((resolve, reject) => {
    reject('err')
})
.then(value => console.log('suc1')) // 透传
.then(value => console.log('suc2')) //透传
.catch(reason => console.log(reason)) // 捕获
.then(value => console.log('suc3')) // 会执行不??? 会的
// 为啥??? 因为 catch 其实返回的也是一个 promise，执行完成状态也就会变成 fulfilled
// Promise<fulfilled> undefined
```

其实透传就是忽略掉中间经过的 then 然后被第一个 catch 捕获掉.



:exclamation: 关于 promise 内部的错误其实还是蛮怪异的(这也是为什么会有 generator 生成器来处理异步任务的原因之一) -- promise 内部会吃掉错误

```js
// 官网的一个例子
const someAsyncThing = function() {
  return new Promise(function(resolve, reject) {
    // 下面一行会报错，因为x没有声明
    resolve(x + 2);
  });
};

someAsyncThing().then(function() {
  console.log('everything is great');
});

setTimeout(() => { console.log(123) }, 2000);
// Uncaught (in promise) ReferenceError: x is not defined
// 123
```

但是在 node 和在浏览器中执行的结果不一致，为啥呢？node 里面其实是做了这么一个限制，也就是如果 promise 内部有未捕获的错误会直接终止进程(本地的 node 版本是 V16.13.1 可能在低版本中并不会存在这样的限制)



### Promise.prototype.finally

参数: callback() 不接受任何参数

- finally 等价于 then(callback, callback)，也就是无论 promise 的状态如何改变都是会执行传入的callback 函数。

- finally 返回的也是一个 promise 对象

  ```js
  // finall
  Promise.prototype.finally = function(callback) {
      const P = this.constructor
      return this.then(
      	(val) => P.resolve(callback()).then(() => val),
          (reason) => P.resolve(callback()).then(() => { throw reason })
      )
  }
  ```




### Promise.resolve

方法是将一个参数封装为 promise 独享返回的过程。

```js
Promise.resolve('foo')
// 等价于
new Promise(resolve => resolve('foo'))
```



:exclamation: 需要特别注意 resolve 的参数传递类型

1. 参数是 Promise 实例

​	如果参数是 Promise 实例，那么Promise.resolve将不做任何修改、原封不动地返回这个实例。



2. 参数是 thenable 对象

```js
// 具备 then 方法的对象
let thenable = {
  then: function(resolve, reject) {
    resolve(42);
  }
};
```

Promise.resolve()方法会将这个对象转为 Promise 对象，然后就立即执行thenable对象的then()方法。



3. 参数不是具备 then() 方法的对象，或根本不是对象

​	返回一个新的 promise 对象，状态为 resolve，传递的值就是 Promise.resolve 出去的值

```js
const promise = Promise.resolve('hello')
/*
	promise 的数据类型 Promise<fulfilled> 值是 'hello'
*/
```



4. 参数是一个函数

​	会先执行函数，然后将函数的返回值作为新 promise 对象的值

```js
function getName() {
    return 'jzy'
    // 没有就是返回 undefined
}
const promise = Promise.resolve(getName())
promise.then(res => {
    console.log(res) // jzy || undefined
})
```











## :grin: Reflect 对象

Reflect 是 ES6 引出用来操作对象的 API。



关键字：对象相同行为；函数式编程



### 设计目标

- 抽取 Object 对象内一些内部方法
- 修改某些 Object 方法的返回结果使其变得更合理
- 让 Object 操作变成函数式行为
- 提供与 proxy 一致的函数签名



### Reflect.get

Reflect.get(target, name, receiver) 

- 返回 target 对象的 name 属性

```js
var myObject = {
  foo: 1,
  bar: 2,
  get baz() {
    return this.foo + this.bar;
  },
}

var tar = {
    foo: 3,
    bar: 4
}


console.log(Reflect.get(myObject, 'baz', tar)) // 7
console.log(Reflect.get(myObject, 'foo', tar)) // 1
console.log(Reflect.get(true, 'foo', tar)) // TypeError: Reflect.get called on non-object
```

:star: 有两个需要注意的地方

- 如果 target 传入的是非对象，会报错
- name 部署了 get 方法且在存在 receiver 的情况下 ---> get 方法的 this 会指向 receiver



### Reflect.set

Reflect.set(target, name, value, receiver)

- 设置 target 属性的 name 等于 value

```js
var myObject = {
  foo: 4,
  set bar(value) {
    return this.foo = value;
  },
};

var myReceiverObject = {
  foo: 0,
};

// 传入 receiver，set 方法的 this 指向的就是 myReceiverObject
// 对 this.foo 的修改其实就是对 myReceiverObject.foo 的修改
Reflect.set(myObject, 'bar', 1, myReceiverObject);
myObject.foo // 4
myReceiverObject.foo // 1
```



```js
let p = {
    a: 'a'
};

let handler = {
    // target 指的是绑定代理的目标也就是 p
    // receiver 指的是 proxy 实例也就是 ooo
    set(target, key, value, receiver) {
        Reflect.set(target, key, value, receiver)
    },
};
let ooo = new Proxy(p, handler);
```

:star: 有两个需要注意的地方(与 get 是类似的)

- 如果 target 传入的是非对象，会报错
- name 部署了 set方法且在存在 receiver 的情况下 ---> set 方法的 this 会指向 receiver



### Reflect.has

Reflect.has(obj, name)

```js
const obj = { foo: '' }
// 'foo' in obj === Reflect.has(obj, 'foo')
```





### Reflect.deleteProperty

Reflect.deleteProperty(obj, name)

```js
const obj = {
    foo: ''
}
// delete obj.foo === Reflect.deleteProperty(obj, 'foo')
```





### Reflect.constructor

Reflect.constructor(function, args)

````js
function Person(name, age) {
    this.name = name
    this.age = age
}
// const p = new Person('name')
// const p = Reflect.construct(Person, ['name', 'age'])
````

:star:需要注意两点

- function 传入的必须是一个函数(因为是 new 行为)
- args 传入的必须是一个数组，表示构造函数的参数



### Reflect.getPrototypeOf

Reflect.getPrototypeOf(obj) - 读取对象的 __proto_\__ 属性

```js
const myObj = new FancyThing();

// 旧写法
Object.getPrototypeOf(myObj) === FancyThing.prototype;

// 新写法
Reflect.getPrototypeOf(myObj) === FancyThing.prototype;
```

:star:传入的 obj 必须为 Object 对象 否则会报错



### Reflect.setPrototypeOf

Reflect.setPrototypeOf(obj, newProto) 

- 设置对象的 __proto\__ 属性

```js
Reflect.setPrototypeOf({}, null) // true
Reflect.setPrototypeOf(Object.freeze({}), null) // false
Reflect.setPrototypeOf(null, null) // TypeError
Reflect.setPrototypeOf(undefined, null) // TypeError
Reflect.setPrototypeOf({}, 1) // TypeError
```

:star: 需要注意两点

- obj 传入的必须是 Object 对象
- newProto 必须是 null 或者 Object 对象





### Reflect.apply

Reflect.apply(func, thisArg, args) 

- 绑定 thisArg 后传入 args 执行 func函数

```js
const ages = [11, 33, 12, 54, 18, 96];

const youngest = Reflect.apply(Math.min, null, ages)
// const youngest = Math.min(...ages) // 不使用 apply也可以使用解构赋值的方式
const type = Object.prototype.toString.call(youngest);

console.log(youngest) // 11
console.log(type)  // [object Number]
```

:star:需要注意

- func 传入的必须是 Function





### Reflect.defineProperty

Reflect.defineProperty(target, propertyKey, attributes) 

- 等同于 Object.defineProperty，用于定义某个属性的 configurable, enumerable, writable, value, get, set等，未来会替代 Object.defineProperty

```js
const p = new Proxy({}, {
  set(target, key, value, receiver){
      console.log('set')
      return Reflect.set(target, key, value)
  },
  defineProperty(target, prop, descriptor) {
    console.log(descriptor);
    return Reflect.defineProperty(target, prop, descriptor);
  }
});

p.foo = 'bar'; // {value: "bar", writable: true, enumerable: true, configurable: true}
```

:star: set 和 defineProperty 的触发场景

- 如果设置了 set 方法且 Reflect.set 不传入 receiver 则不会触发 defineProperty
- Reflect.set一旦传入receiver，就会将属性赋值到receiver上面，导致触发defineProperty拦截





### Reflect.getOwnPropertyDescriptor

Reflect.getOwnPropertyDescriptor(target, propertyKey)

- 获取对象的 descriptor

```js
var myObject = {};
Object.defineProperty(myObject, 'hidden', {
  value: true,
  enumerable: false,
});

console.log(Reflect.getOwnPropertyDescriptor(myObject, 'hidden'))
//  {"value":true,"writable":false,"enumerable":false,"configurable":false}
```

:key:通过上面的输出我们可以知道默认的 descriptor

````js
{"writable":false,"enumerable":false,"configurable":false} 
````





### Reflect.isExtensible

Reflect.isExtensible (target)

- 返回 boolean 表示 target 是否可扩展





### Reflect.preventExtension

Reflect.preventExtension(target)

- 使得 target 不可扩展(不可新增属性 / 可以 get 和 delete)

```js
var myObject = {};
Reflect.preventExtensions(myObject) // true

myObject.hello = 'hahah' // 不报错但是不生效
```





### Reflect.ownKeys

Reflect.ownKeys (target)

- 返回对象所有的属性

```js
var myObject = {
  foo: 1,
  bar: 2,
  [Symbol.for('baz')]: 3,
  [Symbol.for('bing')]: 4,
};

// 旧写法
Object.getOwnPropertyNames(myObject)
// ['foo', 'bar']

Object.getOwnPropertySymbols(myObject)
//[Symbol(baz), Symbol(bing)]

// 新写法 -- 等同于上面两个之和
Reflect.ownKeys(myObject)
// ['foo', 'bar', Symbol(baz), Symbol(bing)]
```





## :laughing: Proxy

- [x] 重新学习的目标是搞清楚 proxy 实例 和 target 的区别

* 里面的一些方法和 Reflect 是一样的，参数也是一样的，可以这么去理解，proxy 是一个代理器，当我们触发 proxy 的一些拦截的话会使用 Reflect 来更新对象。



:star: 监听以下的一些方法设置

- get 
- set
- has
- deleteProerty
- constructor
- getPrototypeOf
- setPrototypeOf
- apply
- defineProperty
- getOwnProtertyDescriptor
- isExtensible
- preventExtension
- ownKeys







## :star2: 生成器 & 迭代器



- 调用 Generator 函数，返回一个遍历器对象，代表 Generator 函数内部指针。以后每次调用遍历器的 next 方法，就会返回一个有着 value 和 done 两个属性的对象。
- value - yield 表达式后面的值
- done - 代表遍历是否结束



:star: 本质上，generator 是基于协程来实现的，所有在一个函数内部才会有状态这个概念。协程是不受操作系统控制的，单纯由用户控制(比如生成器的 next 方法)，才会发生状态的转换。



### for...of 

for...of 循环可以自动遍历 Generator 函数运行时生成的 Interator 对象，且不需要再调用 next 方法。

我们也都知道对象其实是不可以使用 for...of 去遍历的，因此我们可以使用生成器来对对象进行改造

```js
// 第一种方法
function* objectEntries(obj) {
    // Reflect.ownkeys 拿到对象所有的键值包括 symbol
  let propKeys = Reflect.ownKeys(obj);
	
    // 遍历对象的属性然后通过 yield 去操作
  for (let propKey of propKeys) {
    yield [propKey, obj[propKey]];
  }
}

let jane = { first: 'Jane', last: 'Doe' };

for (let [key, value] of objectEntries(jane)) {
  console.log(`${key}: ${value}`);
}
```

```js
// 第二种方法：对象内部新增 [Symbol.interator]: function* (){}
function* objectEntries() {
  let propKeys = Object.keys(this);

  for (let propKey of propKeys) {
    yield [propKey, this[propKey]];
  }
}

let jane = { first: 'Jane', last: 'Doe' };

jane[Symbol.iterator] = objectEntries;

for (let [key, value] of jane) {
  console.log(`${key}: ${value}`);
}
```

:star: 需要清楚的一点是，无论是 for...of / 扩展运算符 / Array.from 都是可以将 Generator 返回的 interator 作为参数，但是遇到 done 为 true 的话就会马上停止遍历。



### Generator.prototype.next()

```js
// 采用生成器实现延时执行函数的效果
function* f() {
  console.log('执行了！')
}

var generator = f();

setTimeout(function () {
  generator.next()
}, 2000);
```

```javascript
function* dataConsumer() {
  console.log('Started');
  console.log(`1 ${yield}`)
  console.log(`2 ${yield}`)
}

let genObj = dataConsumer()
genObj.next();  // started
genObj.next('a') // 1 a
genObj.next('b') // 2 b
```



### Generator.prototype.throw()

- 执行一次 throw 附带执行一次 next
- 只有执行过一次 next，throw 传递的错误才能被内部捕获

```js
var g = function* () {
  try {
    yield 1;
  } catch (e) {
    console.log('函数体内：' + e);
  }
};

var i = g();
i.next(); 
i.throw('出错了~~~~');  // 进入函数体内错误捕获
try {
    i.throw('出错了~~~~~') // 进入函数体外错误捕获
} catch(err) {
    console.log('函数体外：', err)
}
```

:star:区别于全局上的 throw 函数，throw 只能被函数体外的 catch 语句捕获。同时与其他错误类似，如果没有进行正确的错误处理流程，程序将会报错(也就是 throw 了但是你没有使用 try ... catch 进行错误处理)



### Generator.prototype.return()

Generator 函数返回的遍历器对象，还有一个 return 方法，可以返回给定的值，并且终结遍历 Generator 函数。

```js
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

var g = gen();

g.next()        // { value: 1, done: false }
g.return('foo') // { value: "foo", done: true }
g.next()        // { value: undefined, done: true }
```

:star2: 终结指的是将对应的 done 变为 true，将 value 变为 return 传入进来的值。如果迭代器内部有 try {} finally 语句块，会先执行完所有的 finally 语句块后再执行 return { value: xxx, done: true }



### yield*

常用在一个 Generator 函数内部调用另外一个 Generator 的情况。yield* 表示后面接着的是一个遍历器对象。



:star2:可以这么去理解：yield* 表达式其实就是将 Generator 转化为 多个 yield 子表达式的过程，然后在父 Generator 再遍历的过程。

```js
// 如果被代理的 Generator 函数有return语句，那么就可以向代理它的 Generator 函数返回数据
function* foo() {
  yield 2;
  yield 3;
  return "foo";
}

function* bar() {
  yield 1;
  var v = yield* foo(); // 接受 foo 返回的数据
  console.log("v: " + v);
  yield 4;
}

var it = bar();

it.next()
// {value: 1, done: false}
it.next()
// {value: 2, done: false}
it.next()
// {value: 3, done: false}
it.next();
// "v: foo"
// {value: 4, done: false}
it.next()
// {value: undefined, done: true}
```

- 使用 yield 实现数组的 flat 扁平化

```js
function* iterTree(tree) {
  if (Array.isArray(tree)) {
    for(let i=0; i < tree.length; i++) {
      yield* iterTree(tree[i]);
    }
  } else {
    yield tree;
  }
}

const tree = [ 'a', ['b', 'c'], ['d', 'e'] ];

for(let x of iterTree(tree)) {
  console.log(x);
}
```



### 作为对象属性的 Generator 函数

```js
let obj = {
    // 前面使用 * 标识是 Generator 函数
    *myGeneratorMethod() {}
}
```



### Generator 函数的 this

- Generator 不能作为构造函数使用

- Generator 原型上的属性和方法可以被继承

```js
function *gen() {
    yield this.a = 1
    yield this.b = 2
}

// 通过封装函数的方式使得 Generator 状态机可以作为构造函数
function Fn() {
    return gen.call(gen.prototype)
}

const obj = new Fn()
obj.next()
obj.next()

console.log(obj.a)
console.log(obj.b)
```



### 实际应用	



- 异步操作同步化表达

```js
function *gen() {
    loadingData() // 加载动画
    yield renderData() // 渲染数据
    hideLoading() // 隐藏加载动画
}

const g = gen() // 一开始不会执行
g.next() // 执行到 renderData
// renderData 里面再调用 g.next() 从而隐藏加载动画
```



- 部署 Interator  接口

```js
const setUpInterator = function(obj) {
    // 方法一就是通过往对象上添加 Symbol.inerator 属性来实现可迭代
    obj[Symbol.iterator] = function*() {
        for(const key in obj) {
            if(obj.hasOwnProperty(key)) {
                yield obj[key]
            }
        }
    }
}
```



:star: 总的来说，generator 作为生成器函数，不像普通函数调用后就执行。返回的是一个迭代器对象，我们可以通过 for ... of 来进行迭代。内部通过 yield 关键字来实现状态机的切换，每 next 一次执行到 yield 的时候就交出对应的执行权限，对应的上下文会被缓存起来，等到下次取到状态执行权后再入栈



### Generator 异步

:exclamation:  ES6 引入 Generator 之前也有几种方法解决JS同步阻塞的问题，常见的有回调函数 / Promise。回调函数可能出现的问题是多个回调之间存在强耦合关系导致一个操作修改会影响到其他操作，不断嵌套的过程就导致了”回调地狱“的问题。由此引出了 Promise，通过 .then .... 直观上同步的方式解决了嵌套问题，但是稍微有点不好的就是需要封装多一层 Promise 对象导致语义不清晰。

:star: Generator 的引出解决了上面问题，本质上基于协程实现，可以控制执行时机且内部代码看上去和同步的方式一模一样，语义非常清晰，同时外部的错误可以在内部进行捕获。



- thunk 包装

```js
// 本质上是通过将 next 作为 fn 的回调函数传入
// 等到 fn 执行回调的时候再恢复 Generator 的执行权
function run(fn) {
  var gen = fn();

  function next(err, data) {
    var result = gen.next(data);
    if (result.done) return;
    result.value(next.bind(this, null, 'filename')); // 这里通过这么一种方式来模拟
  }

  next();
}

// thunk 包装函数
function thunk(fn) {
    return function() {
        const args = [].slice.call(arguments)
        return function(callback) {
            args.push(callback)
            return fn.apply(this, args)
        }
    }
}

// 模拟读取文件的异步回调
function log(filename, callback) {
    callbacl = callback ? callback :  function(err=null, data='file') { return 'data' }
    setTimeout(() => callback(), 5000)
}

const readFileThunk = thunk(log)

var g = function* () {
  var f1 = yield readFileThunk('file1');
  console.log(f1)
  var f2 = yield readFileThunk('file2');
  console.log(f2)
  var f3 = yield readFileThunk('file3');
  console.log(f3)
};

run(g);
```



:tiger: 其实 CO 的 promise 封装和 run 方法是类似的，只是换成了 Promise.then 的方式进行回调的传入



## :sob: Class 类



其实 Class 本质上还是使用函数去实现的，Class 只是方便我们使用的一种语法糖，并不是像Java 或者 C 里面存在真正类的定义。所以还是存在原型 & 原型链的概念，规则其实也和 ES5 中是一样的。

```js
function Point(x, y) {
    // 构造函数
    this.x = x
    this.y = y
}
Point.prototype.toString = function() {
    return ''
}

// 上面的声明等价于
Class Point {
    constructor(x, y) {
		this.x = x
        this.y = y
    }
    toString() {}
}
```

:key: 类的所有方法都在原型对象上

:warning: 默认有一个 constructor 函数返回 this 对象，如果更改为返回其他对象，可能导致的问题是不能进行实例继承和原型继承。

```js
class Foo {
  constructor() {
    this.name = 'xxx'
    return Object.create(null) // 覆盖了原来默认返回 this 的行为
  }
}

const foo = new Foo()
console.log(foo.name) // undefined
```



```js
Object.getPrototypeOf(obj) // 生产环境建议使用这种方式获取原型对象
```

为啥呢？其实有一种说法是 __proto_\_ 其实并不被一些浏览器认可，虽然说 google 或者 microsoft 是支持的，但像 IE 或者火狐的一些低版本其实是不被认可的，但上面这种因为是对象里面的方法，所以其实是广大浏览器都支持的。



### getter & setter 

- Object.getOwnPropertyDescriptor

````js
// Object.getOwnpropertyDescriptor 用于获取某个属性的描述符
// 也就是 { configurable, writable, enumerable, value }
// 同时也说明了一个问题 对应的 getter 和 setter 是定义在原型上的
// 且这个属性是不可枚举的因为 Object.keys 遍历不出来
var descriptor = Object.getOwnPropertyDescriptor(
  CustomHTMLElement.prototype, "html"
); // 返回的是一个对象 { configurable, writable, enumera }
````

```js
class CustomHTMLElement {
  get html() {
    return this.element.innerHTML;
  }

  set html(value) {
    this.element.innerHTML = value;
  }
}

const cus = new CustomHTMLElement()
console.log(Object.hasOwnProperty.call(cus.__proto__, 'html')) // true
console.log(Object.hasOwnProperty.call(cus., 'html'))  // false 
```



### class 表达式

```js
const MyClass = class Me {
  getClassName() {
    return Me.name; // Me 只能在内部使用
  }
};

// 立即执行类 => 创建对应的实例
let person = new class {
  constructor(name) {
    this.name = name;
  }

  sayName() {
    console.log(this.name);
  }
}('张三');

person.sayName(); // "张三"
```



### 静态方法 & 静态属性

:key: 通过关键字 static 声明的方法只能通过 Class.xxx 的方式去使用，函数内部的 this 指向的不再是实例对象而是对应的构造函数。static 允许被继承，即子类可通过 super 去调用。



:warning: 静态属性其实一开始的规范中是如下声明的

```js
class Person {}
Person.name = 'name'
```

但是考虑到这样子不太直接所以就引入了另一种规范

```js
class Person {
    static name = 'name'
}
```



### 实例属性的新写法

````js
class Customer {
    count = 0 // 直接声明到顶部
    // 但是用的时候其实还是需要 this.count
    // 只是说现在一眼就能看到有哪些实例属性
}
````



### new.target

- 在函数中 new Target 指向的是构造函数

```js
function Person() {
    console.log(new.target)
}
const person = new Person() // [Person Function]
```

- 在对象中返回的是当前 Class

```js
class Person {
    constructor() {
        console.log(new.target)
    }
}
const person = new Person() // 指向 Class Person
```

- 在继承关系中，指向的是子类。我们可以使用这一特性来实现一个抽象类，也就是只能被继承不能被实例

```js
class Person {
    constructor() {
        if(new.target === Person) {
            throw('不能被实例化')
        }
    }
}
class Student extends Person {
    constructor() {
        super()
    }
}
```



## :joy: Class 继承



- ES6 继承方式和 ES5 继承方式的差别

ES6 的继承机制，是先将父类的属性和方法，加到一个空的对象上面，然后再将该对象作为子类的实例，即“继承在前，实例在后”，ES5 恰恰相反“实例在先，继承在后”。因此引出了一系列的注意事项，子类的构造函数必须包含 super 调用，this 的使用必须在 super 后等等。

:arrow_heading_up: 2022/ 5/ 24 [补充差异](https://zhuanlan.zhihu.com/p/404315749)

```js
// 基于 ES5 的继承方式
```







### super

```js
class A {}
class B {
	constructor() {
        super() // 执行父类的构造函数
        // 等价于 A.prototype.constructor.call(this)
    }
}
```



> super 可以用作函数和对象。用作函数时只能在子类的构造函数中使用，且只能使用一次，内部默认的 this 指向指向的是子类的构造函数，其实也就是子类实例。作为对象使用的时候，如果在普通函数中使用， this 指向的是父类原型对象，如果在静态函数中使用， this 指向的是父类。





- ES6 规定，在子类*普通方法*中通过 this 调用父类的方法时，方法内部的 this 指向当前的子类实例。

```js
class A {
  constructor() {
    this.x = 1;
  }
  print() {
    console.log(this.x);
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;
  }
  m() {
    super.print(); // 遵循上面的规定 实际执行的是 super.print.call(this)
  }
}

let b = new B();
b.m() // 2
```



- ES6 规定，在子类的静态方法中通过 super 调用父类的方法时，方法内部的 this 指向当前的子类，而不是子类的实例。

```js
class A {
  constructor() {
    this.x = 1;
  }
  static print() {
    console.log(this.x);
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2; // 实例属性
  }
  static m() {
    super.print();
  }
}

B.x = 3; // 静态属性
B.m() // 3
```



:warning: 下面这段代码一直不能够理解？？？

```js
class A {
  constru	ctor() {
    this.x = 1;
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;
    super.x = 3; // 赋值和读取的操作不一样???
    console.log(super.x); // undefined
    console.log(this.x); // 3
  }
}

let b = new B();
```



### 原型链



有以下规律

1. 子类的 __proto\__ 属性，表示构造函数的继承，总是指向父类
2. 子类的 prototype 的 __proto\__ 属性，表示原型方法的继承，总是指向父类的 prototype 属性

```js
// 具体的实现流程
class A {
}

class B extends A{
}

B.__proto__ === A // true
B.prototype.__proto__ === A.prototype // true

// B 的实例继承 A 的实例
Object.setPrototypeOf(B.prototype, A.prototype);
// 等价于 B.prototype.__proto__ = A.prototype

// B 继承 A 的静态属性
Object.setPrototypeOf(B, A);
// 等价于 B.__proto = A

const b = new B();

```



- 实例对象的原型链

:star: 面试的时候有问这么一个问题

```js
class A {}
class B extends A{}
const c = new B()
// 请问 c 的原型链是怎么继承的
```

```js
class Point {}
class ColorPoint extends Point {}

var p1 = new Point();
var p2 = new ColorPoint();

// 我是这么理解的，Point 和 ColortPoint 都是作为构造函数生成 p1 和 p2
// 自然符合 ES5 中的一些规范要求
console.log(p2.__proto__ === ColorPoint.prototype)  // true
console.log(p2.__proto__.__proto__ === Point.prototype) // true 
console.log(typeof Point) // 'function'
```

根据上面的一些输出：其实 Point 和 ColorPoint 就是构造函数，所以对于 c 来说，c__proto_\_ === B.prototype，而 B.prototype === A.prototype，这就是这个问题的答案





### 类合并

可以抽取出来一个 mix 函数，实现多个类实例属性 / 静态属性的合并

```js
function mix(...mixins) {
  class Mix {
    constructor() {
      for (let mixin of mixins) {
        copyProperties(this, new mixin()); // 拷贝实例属性
      }
    }
  }

  for (let mixin of mixins) {
    copyProperties(Mix, mixin); // 拷贝静态属性
    copyProperties(Mix.prototype, mixin.prototype); // 拷贝原型属性
  }

  return Mix;
}

function copyProperties(target, source) {
  for (let key of Reflect.ownKeys(source)) {
    if ( key !== 'constructor'
      && key !== 'prototype'
      && key !== 'name'
    ) {
      let desc = Object.getOwnPropertyDescriptor(source, key);
      Object.defineProperty(target, key, desc);
    }
  }
}

// 具体使用的时候
class A extends mix(B, C) {} // 这样就实现了继承多个类了
```





## :sleeping: Iterator



关键词：访问接口；for...of；结构分离



特性 / 作用

- 为不同的数据结构提供了统一的访问形式
- 数据结构成员按某种次序排列
- 为 for...of 遍历提供接口



封装数据结构返回一个遍历器对象，初始时遍历器指针指向结构的第一个元素，不断地调用 next 方法，指针不断后移直至 done 为 true 代表当前结构的数据已经被访问完成。

```js
// 本质上部署了 Iterator 接口其实指的是有 [Symbol.iterator]: function *() {} 这个方法
const obj = {
	[Symbol.iterator]: function () {
        return {
			next() { // 返回一个 next 方法使得指针可以往后迭代
				return {
                    value: '',
                    done: true
                }
            }
        }
    }
}
```

:tada: 部署了迭代器接口  ----> 返回迭代器对象 ----> 调用 next 方法 -----> 返回数据结构子元素 



- 迭代器实现链表结构

```js
function Obj(value) {
  this.value = value;
  this.next = null;
}

// 部署接口
Obj.prototype[Symbol.iterator] = function() {
  var iterator = { next: next }; // 返回迭代器对象

  var current = this;
  console.log(current)

  function next() {
    if (current) { // 判断 next 指向的是否是 null
      var value = current.value;
      current = current.next; // 指向下一个指针
      return { done: false, value: value };
    }
    return { done: true };
  }
  return iterator;
}

var one = new Obj(1);
var two = new Obj(2);  
var three = new Obj(3);
one.next = two;
two.next = three;

// 做了这么一件事 { value, next: {value, next: {value, next}}  }

for (var i of one){
  console.log(i); // 1, 2, 3
}
```



### 部署迭代器接口

- 对于类数组对象来说，可以直接拷贝 Array.prototype 的迭代器接口

:warning: 经过测试，函数的 arguments 列表居然是可以迭代的(可能是内置了)

```js
const obj = {
    0: 'a',
    1: 'b',
    2: 'c',
    length: 3
}
for(const item of obj) {// 正常来说我们是不能通过 for...of 遍历obj的
    // 因为 obj 没有部署迭代器接口
    console.log(item) 
}

// 改成下面这样子就可以了
const obj = {
    0: 'a',
    1: 'b',
    2: 'c',
    length: 3,
    [Symbol.iterator]: Array.prototype[Symbol.iterator]
}
```



- 对于普通对象来说，需要根据自己实际的需求来定制迭代器接口



### 覆盖默认迭代器



- 对于具备迭代器接口的数据结构（字符串 / 数组 / etc），我们可以覆盖原来的迭代器接口，从而在不改变原数据的情况下更改遍历的结果。

```js
const arr = [1, 2, 3]
arr[Symbol.iterator] = function() {// 覆盖原来的迭代器
    let _first = true
    return {
        next:function() {
           if(_first) {
               _first = false
                return {
                    value: 'jzyismylover',
                    done: false
                }
           } else {
               return {
                   done: true
               }
           }
        }
    }
}
for(const item of arr) {
    console.log(item)  // 只会输出 jzyismylover
}
console.log(arr) // 还是原来的[1, 2, 3]
```



### 遍历器对象的 return、throw

遍历器对象除了有 next 方法，还有 return 和 throw 方法。



- return 主要用于在 for...of 循环中遇到 break / throw error 的时候执行 { done: true } 退出当前迭代状态

```js
const a1 = [1, 3, 5, 6, 7]
a1[Symbol.iterator] = function() {
    const len = this.length, _this = this
    let i = 0
    return {// 其实数组的 iterator 接口就类似这样部署的
        next() {
            if(i < len) {
                i++
                return {
                    value: _this[i]
                }
            } else {
                return {
                    done: true
                }
            }
        },
        return() { // 如果定义了 return 语法就必须返回一个 done: true
            // 否则会报错 Iterator result undefined is not an object
            console.log('提前退出了') // 在 break 操作后触发
            return {
                done: true
            }
        }
    }
}

for(const item of a1) {
    if(item % 2 === 0) {
        break
    }
    console.log(item) // 3 5
}
```



### for...of



只要部署了迭代器接口，我们就可以使用 for...of 对数据结构进行访问，也就是说，for...of循环内部调用的是数据结构的 Symbol.iterator 方法。其实上面也有很多使用 for...of 遍历的例子，就不一一列举了，主要还是从里面的一些特例进行分析。



1. 数组

```js
let arr = [3, 5, 7];
arr.foo = 'hello';

for (let i in arr) {
  console.log(i); // "0", "1", "2", "foo"
}

for (let i of arr) {
  console.log(i); //  "3", "5", "7"
}
```

:warning: 也就是说 for...of 遍历数组的时候只会遍历数字键，非数字键会被跳过。那如果我把 arr.foo 改成 arr['3'] 会有变化吗？其实是会有的

```js
arr['3'] = 'hello';
for (let i of arr) {
  console.log(i); //  "3", "5", "7", "hello"
}
// 其实应该是内部做了一个 parseInt / Number 的转化，然后用 isNaN 去判断
```



2. Map & Set

Map 和 Set 都可以使用 for...of 进行迭代遍历

```js
// 区别在于 Set 迭代的是值，Map 迭代的是键和值
for(const item of Set) {}
for(const [key, value] of Map) {}
```



### for...in

for...in 的缺陷在于它将所有的键都看成是字符，所以会把我们自定义的一些属性也给遍历出来，但其实这些并不是我们想要的，就像上面举的一个数组例子一样，会把 arr.foo = 'hello' 的 foo 也给遍历出来。所以其实 for...in 更适合用于遍历对象，因为对象其实不需要考虑遍历顺序的问题。

for... of 的引出其实就是为了给开发人员提供一个统一的数据访问接口，解决传统for 循环复杂，forEach 无法中途退出，for...in 冗余属性等等问题。





## :boom: async 函数



async 函数其实是 Generator 生成器的语法糖

关键字：内置执行器；更好的语义；更广的适应性；返回值是Promise 



:star: async 函数会返回一个 Promise 对象，状态变化的理解是关键

- 内部的 return 作为 then 函数接收的参数
- 内部的 throw 直接作为 catch 捕获的参数

- 只有内部的 await 全部执行完或者遇到 return / 报错才会更新返回 Promise 的状态



:key: 非常重要

内部成功执行完成但无 return --->  Promise.state === 'resolve' -----> then 接受 undefined

内部成功执行完成有 return --->  Promise.state === 'resolve'  -------> then 接受 return 的值

内部抛出  ------> Promise.state === 'reject' ---------> catch 接受报错

```js
async function getTitle() {
  await new Promise((resolve, reject) => {
      setTimeout(resolve, 1000)
  })
  await 2
  // return await 2 等同于 return 2
}
getTitle()
.then(item => console.log('suc '+item))  // suc: undefined / suc: 2
.catch(err => console.log('err ', err))
```

```js
async function getTitle() {
  await new Promise((resolve, reject) => {
      setTimeout(resolve, 1000)
  })
  await 2
  consoo
}
getTitle()
.then(item => console.log('suc '+item))
.catch(err => console.log('err ', err))  // err: ReferenceError: consoo is not defined
```



:key: 面试中遇到的代码考核题

```js
async function getName() {
  console.log('async start')
  await 'tesing' // 同样会被注册为微任务 -- 只是说马上就会进行相关状态变化
  await new Promise((resovle) => {
    console.log('haha')
    resovle('hello world')
  })
  return 'testing'
}

console.log('script start')
getName().then(res => {
  console.log(res)
})
console.log('script end')

// await 'testing' 我们可以这样去看
new Promise((resolve) => {
    resolve('testing')
}).then(() => {
    // 执行后面的代码
    // 也就说说后面的代码都会被注册为微任务
})
```







### await

await 后面可以分为两种情况：部署了 then 方法 和 没有部署 then 方法

1. 没有部署 then 方法

```js
await 1
await 'hello'
```

上面这些会直接注册微任务将参数传递进入 then 中



2. 部署了 then 方法（定义了 then 方法的对象）

```js
class Sleep {
  constructor(timeout) {
    this.timeout = timeout;
  }
  then(resolve, reject) {
    const startTime = Date.now();
    setTimeout(
      () => resolve(Date.now() - startTime),
      this.timeout
    );
  }
}

(async () => {
  const sleepTime = await new Sleep(1000); // 等待 then 方法执行完成
  console.log(sleepTime);
})();
// 1000
```

如果是上面这种情况的话会执行 promise 的同步代码，然后跳出当前执行函数，等到执行时机回到函数后再将对应的微任务进行注册。



```js
function test(delay) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(111)
        }, delay)
    }).then((res) => 'thenable' + res)
}

(async () => {
    const res = await test(3000)
    console.log(res)  // thenable res
})();
```

本质上的原因是因为 then 返回的也是 promise，所以 await 也会等待 then 返回的 Promise 状态变换后再往上执行，这也是为什么部署了 then 方法的对象会被视为 Promise 对象。总结来说就是 await 返回的结果是最后一个 Promise 处理成功的结果。



:warning: 为什么 async 不能用在 forEach 中呢？

```js
arr.forEach(async () => {
    await ....
}) // 这样子的方式 arr 中的元素会同时触发也就是不会按顺序返回对应的结果
```



### 错误处理

```js
async function f() {
  try {
    await new Promise(function (resolve, reject) {
      throw new Error('出错了');
    });
  } catch(e) {// 进行 try...catch 捕获
  }
  return await('hello world');
}

// 或者使用 then 捕获

async function f() {
    await new Promise(function (resolve, reject) {
      throw new Error('出错了');
    }).catch(console.log)
  return await('hello world');
}
```



### 内部实现

运行流程

1. 执行生成器函数返回生成器对象
2. 调用 step 方法执行 next
3. 通过 done: true / false 判断当前是否结束
4. 结束的话直接返回对应的 value
5. 否则根据 Promise 的状态：resolve 执行下一个 next 方法 / reject 执行 throw 方法

```js
function fn(args) {
  return spawn(function* () {
    // ...
  });
}

function spawn(genF) {
    return new Promise(function (resolve, reject) {
        const gen = genF() // 生成生成器对象
        function step(nextF) {// 部署自动执行 Generator
            let next
            try { // 需要注意对应 try...catch 的捕获时机
                // 其实只需要捕获 next = nextF()即可
                // 因为这里执行可能 generator.throw
                next = nextF()
                console.log(next)
                if (next.done) {// 执行完成
                    return resolve(next.value)
                }
                // 还可以往下执行的意思
                Promise.resolve(next.value)
                    .then(val => { step(() => gen.next(val)) })
                    .catch(err => { step(() => gen.throw(err)) })
            } catch (err) {
                reject(err)
            }
        }
        step(() => gen.next())
    });
}
```





## :wink: Modules



:star: ES6 模块设计思想是尽量静态化，静态化的意思就是使得在编译阶段就能确定模块的依赖关系以及输入输出变量。

```js
// 以前使用 require 导入的时候
const { resolve } = require('fs')

/* 本质上等价于 */
const fs = require('fs')
resolve = fs.resolve
```

:exclamation: 也就是说 CommonJS 导出的其实是一个模块对象，然后再从对象上读取方法进行赋值，所以只有运行的时候我们才知道加载了哪些方法，没有办法在编译阶段进行判断。

而 ES6 使用 import / export 关键字，本质上导出的不是一个模块对象，而是表达加载的含义

```js
// 从 fs 上加载三个属性/方法
import { stat, exists, readFile } from 'fs'
```



### export 

:key: export 向外导出的是一个接口

```js
function v1() { ... }
function v2() { ... }

// 推荐使用这种方式进行导出
// 因为我们一眼就能看到导出了啥
export {
  v1 as streamV1, // 使用 as 关键字进行导出模块的重命名
  v2 as streamV2,
  v2 as streamLatestVersion
};
               
export 1  // Error：导出的是接口不是值
```



### import

:key: import 导入的是 export 的接口，所以对应的属性最好不要修改，也就是 read-only 就好。和 export 一样，import 同样存在作用域提升，默认提升到当前全局作用域的顶部。

```js
import { streamV1 as stream, streamV2 } from './test.js'
// 导入的名字必须与 export 相同
// 可以使用 as 关键字进行重命名

import { 'foo' + a } from './test.js'
// Error：因为静态编译的原因不允许通过表达式去引入

import * as moduleName from './test.js' // 模块整体导出重命名为 moduleName
moduleName.getNaem() // 通过类似这样的方式来实现调用
```



### export default

```js
export default a

/* 等价于 */

export {
	a as default
}
```

:key: 因此一个模块内部只能使用一次 export default, 多次使用就不知道把那个变量命名为default 导出。export default 其实是 export 的特殊情况，以 default 作为默认接口导出

```js
/* 导出 */
export default function (obj) {
  // ···
}

export function each(obj, iterator, context) {
  // ···
}

export { each as forEach };

/* 导入 */
import _, { each, forEach } from 'lodash';
```

上面是很多包模块比较常见的写法 -- 同时接受 default 接口和其他接口的导出。



:heavy_heart_exclamation: !!! 以下概念 在 vite 的模块导出(i**mport.meta.globEager**)非常重要

```js 
// index.js
export const a = 1
export default {
  name: 'jzyismylover'
}

// main.js 导入
import * as module from './index.js'
/*
{
	a: 1,
	default: { name: 'jzyismylover' }
}
*/
```

本质上其实是 export default 导出 default 接口 和 a接口，但是写在一起的话不是那么容易去理解







### export & import 复合写法

:key: export 和 import 可以写在同一行表示从 xxx 模块导入 xxx 方法/属性然后直接导出

```js
export { for, bar } from 'module'

/* 等价于 */
import { foo, bar } from 'module'
export {
	foo,
    bar
}
```

```js
export { foo as default } from 'module'

/* 等价于 */
import { foo } from 'module'
export default foo
```

```js
export { default as foo } from 'module'

/* 等价于 */
import foo from 'module'
export {
	foo
}
```

:exclamation: 使用上面复合的写法的话内部是无法使用导入的变量，这点需要注意！！！



### 跨模块常量



！！！如果在项目中使用到很多的常量，比如说路由，接口名，菜单名等等，ES6 里面推荐我们建一个 constants 的文件夹来存储这些常量，并将不同模块的常量抽取到 index.js 中，最后需要导入的时候从 index.js 里面导入即可。

```js
// constants/menu.js
export const menu = { }

// constants/route.js
export const routes = { }

// constants/index.js
export { menu } from './menu.js'
export { routes } from './route.js' 

// 外部使用的时候
import { menu } from 'constants/index.js'
```



### import()

:key: 是 ES2020 提出的运行时加载的手段，返回一个 promise. 在 Vue 中懒加载路由有运用到

```js
// index.js
export const a = 1
export default {
  name: 'jzyismylover'
}

import('./index').then(module => { console.log(module) })
/*
module: {
	a: '1',
	default: { name: 'jzyismylover' }
}
*/
//---------------------------------
/*
仅有 export default 的情况
module: {
	default: { name: 'jzyismylover' }
}
*/
//----------------------------------
/*
仅有 export 的情况
module: {
	a: 1
}
*/
```



## :stuck_out_tongue_winking_eye: 编程风格



### 对象



1. 单行定义的对象最后一个属性不加 ','，多行定义的对象最后一个属性加上 ,

```js
// bad
const a = { k1: v1, k2: v2, };
const b = {
  k1: v1,
  k2: v2
};

// good
const a = { k1: v1, k2: v2 };
const b = {
  k1: v1,
  k2: v2,
};
```

2. 不要随意去添加对象的属性，尽量初始化的时候就确定

```js
// bad
const a = {};
a.x = 3;

// if reshape unavoidable
const a = {};
Object.assign(a, { x: 3 });

// good
const a = { x: null };
a.x = 3;
```

3. 属性名 与 值同名的尽量缩写

```js
let name = '', age = ''
const obj = {
	name,
    age
}
```



### 函数



1. 使用默认值函数语法设置函数参数的默认值

```js
function handleThings(opts = {}) {
  // ...
}
```

2. 不使用 argument 对象

```js
function getName(...arguments) {} // 不推荐使用
function getName(...args) {} // 推荐使用
```

3. 尽可能使用箭头函数

```js
[1, 2, 3].map(function (x) {
  return x * x;
}); // 不推荐

[1, 2, 3].map((x) => {
  return x * x;
}); // 推荐
```

4. 不使用 self 绑定 this

```js
function getName() {
	const self = this
    return function() {
		// 使用 self
        // 但其实如果要改变某个函数 this 指向为 getName 的话使用 bind 
        
    }
}

```



































