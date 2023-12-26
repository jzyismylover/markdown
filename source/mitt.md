# mitt

>  mitt 是一个轻量发布订阅模式库，[开源链接](https://github.com/developit/mitt#all)，在看的时候其实也发现了一个 issue 专门讲解源码并给出自己对于源码的一些优化 [issue](https://github.com/haiweilian/tinylib-analysis/issues/8)

代码量不多，逻辑也很好理解，如下则为整个 mitt 的核心代码

```js
/* 构造函数 */
function mitt(all) {
    return {
        all: all | new Map(), // 存储整个事件&回调函数 map 列表
        on(type, event) {}, // 添加事件监听回调
    	off(type, event) {}, // 移除事件回调
        emit(type, event) {}, // 触发事件回调
    }
}
```

> 里面有个地方需要注意下 handlers.indexOf(handler) >>> 0

怎么理解 >>> 0 这个运算符号？[answer](https://segmentfault.com/a/1190000014613703)：给出了解释，>>> 在运算前默认会对之前的值作处理

1. 将数据类型转化为数值类型

   ```js
   function getNumber(num) {
       num = Number(num)
       return num < 0 ? Math.ceil(num) : Math.floor(num)
   }
   ```

2. 如果是正数，返回正数；如果是负数，返回负数 + 2 的32次方

   ```js
   function modulo(a, b) {
       return a - Math.floor(a/b)*b;
   }
   
   function ToUint32(x) {
       return modulo(ToInteger(x), Math.pow(2, 32));
   }
   ```



> 比较有意思的倒是里面的 ts 类型、测试部分

- `ts` 类型带给我一种编写类型体操的思路 —— 怎么去组织一个函数的类型编写

  - 从基础类型开始，比如事件名可以怎么取值，事件处理函数的签名

  ```ts
  /*  基础类型  */
  type EventType = string | Symbol
  // 基础事件处理函数签名
  type Handler<T extends unknow> = (event: T) => void
  // 通配符事件处理函数签名
  type WildcardHandler<T = Record<string, unknown>> = (
  	type: keyof T,
  	event: T[keyof T]
  ) => void
  
  // 事件列表
  type EventHandlerList<T = unknown> = Array<Handler<T>>
  type WildcardHandler<T = Record<String, unknow>> = Array<WildcardHandler<T>> 
  ```

  - 然后拓展到整个 mitt 返回类型定义

  ```ts
  export interface Emitter<Events extends Record<EventType, unknown>> {
  	all: EventHandlerMap<Events>;
  
      // on 类型重载
  	on<Key extends keyof Events>(type: Key, handler: Handler<Events[Key]>): void;
  	on(type: '*', handler: WildcardHandler<Events>): void;
      
      // off 类型重载
  	off<Key extends keyof Events>(
  		type: Key,
  		handler?: Handler<Events[Key]>
  	): void;
  	off(type: '*', handler: WildcardHandler<Events>): void;
  
      // emit 类型重载
  	emit<Key extends keyof Events>(type: Key, event: Events[Key]): void;
  	emit<Key extends keyof Events>(
  		type: undefined extends Events[Key] ? Key : never
  	): void;
  }
  ```

  

- 测试部分，设计到 node `test` 模块

  - `describe` 用于定义一个分组，`it` 用于定义一个单元测试

  ```js
  const assert = require('assert')
  const { describe, it } = require('node:test')
  
  describe('A thing', () => {
    it('should work', () => {
      assert.strictEqual(1, 1);
    });
  
    it('should be ok', () => {
      assert.strictEqual(2, 2);
    });
  
    describe('a nested thing', () => {
      it('should work', () => {
        assert.strictEqual(3, 3);
      });
    });
  });
  ```

  - `beforeEach`：用于在每个子测试之前运行的钩子