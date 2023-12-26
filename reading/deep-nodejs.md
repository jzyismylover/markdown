# 深入浅出 nodejs



## 第一章

关键词：回调函数、异步IO、事件循环、并行IO、单线程、master worker、web worker、child_process、CPU 密集



## 第二章 模块机制

 关键词：模块化、Commonjs、核心模块、文件模块、自定义模块、模块路径、文件定位、包缓存、作用域隔离、runThisContext、



### 2.2 核心模块

关键词：Module._extensions、libuv、c++扩展插件

> 小节阅读抽象，主要描述了核心模块的一些内容，核心模块有分为C++编写和 JS 编写，其中使用 C++ 编写的又称为内建模块 [blog](https://www.imyangyong.com/blog/2019/07/node/%E6%B7%B1%E5%85%A5%E7%90%86%E8%A7%A3%20Node%20%E7%9A%84%E6%A0%B8%E5%BF%83%E6%A8%A1%E5%9D%97/)。 



- npm 通过镜像下载包

  ```bash
  $ npm install underscore --registry=http://registry.url
  ```

- npm 设置镜像源

  ```bash
  $ npm config set registry http://registry.url
  ```

- npm 包需要多人管理

  ```bash
  npm owner ls <package name> # 查看package所有者信息
  npm owner add <user> <package name> # 添加一个所有者
  npm owner rm <user> <package name> # 删除一个所有者
  ```



## 第三章 异步 I/O



- 为什么异步 IO 在 JS 中很重要

  因为在浏览器中 Javascript 在单线程中上执行，且与UI渲染共用一个线程，如果没有异步机制的话那么实际阻塞带来的延时严重影响用户体验。

- 阻塞/非阻塞 & 同步/异步 两大概念的区别

  阻塞/非阻塞其实是一个操作系统内核级别的概念，在进行I/O操作的时候如果CPU需要等待I/O任务完成后才处理下一个任务，那么这种行为就是阻塞的。而对于同步和异步而言则更多归属与事件循环里面去解释。

- 跨平台异步 IO 架构

![image-20230920005407581](/home/jzy/Documents/markdown/reading/deep-nodejs.assets/image-20230920005407581.png)

- fs.open 执行过程

![image-20230920010704604](/home/jzy/Documents/markdown/reading/deep-nodejs.assets/image-20230920010704604.png)

调用封装逻辑：Javascript 调用 Node核心模块，核心模块调用 C++ 内建模块，内建模块通过 libuv 进行系统调用。libuv 作为封装层，有两个平台的实现，实质是调用了 us_fs_open 方法



![image-20230923181630972](/home/jzy/Documents/markdown/reading/deep-nodejs.assets/image-20230923181630972.png)

1. node 通过 JS 调用核心函数通过层层封装实际调用了系统底层函数，随后封装请求对象进入线程池中等待执行
2. 线程空闲，执行请求对象中 I/O 操作，执行完成通过 `PostQueuedCompletionStatus` 方法通知 IOCP（`IOCP全称I/O Completion Port，中文译为I/O完成端口。IOCP是一个异步I/O的Windows API`），将当前线程归还给线程池
3. I/O 观察者在执行每一个 tick 的时候会执行 `GetQueuedCompletionStatus` 方法检查线程池中是否有执行完的请求，如果存在，会将请求对象加入到I/O 观察者的队列中

:star: 事件循环、观察者、请求对象、I/O 线程池四者共同构成了 Node 异步 I/O 模型的基本要素



- setTimeout、process.nextTick、setImmediate
  - setTimtOut：执行时会创建定时器对象并插入到观察者对象的一个红黑树中，每次 Tick 执行的时候会从红黑树中迭代取出定时器对象，检查是否超出定时事件。缺点：红黑树查找的复杂度是 O(lgn)，且时间并非精确（每一个tick受任务时间阻塞长度影响）
  - process.nextTick，setImmediate：两者类似，都是通过将回调函数放入队列中，在下一轮 tick 时取出执行。
    - 区别一：由于每一个 tick 其实观察者的检查是有先后顺序，process.nextTick 属于 idle 观察者，setImmediate 属性属于 check 观察者，idle 优先于 check，因此在同一个 tick 中 process.nextTick 执行顺序优于 setImmediate。
    - 区别二：process.nextTick 回调其实是存储在一个数组中，而 setImmediate 存储在一个链表中，因此每次 tick process.nextTick 都会取出数组中的所有回调并执行，而 setImmediate 则执行链表中的每一项



- 经典的服务器模型
  - 同步式
  - 每进程/每请求
  - 每线程/每请求



## 第四章 异步编程



- 异步编程难点
  - 异常处理：因为逻辑函数在下一个 tick 才执行，因此当前 tick 的事件捕获其实并不能正常捕获错误，因此通常都是在回调函数的第一个参数暴露标识是否发生错误
  - 函数嵌套过深：很多时候逻辑函数之间有一个执行先后顺序要求，那么就会出现一个回调函数里面嵌套另外一个逻辑函数，如果这样的依赖很多，那么就会不断嵌套导致层级太深
  - 阻塞代码：node 没有 sleep 函数，而使用 setTimeout 并不能阻止后续代码执行，因此通常使用一个 while 循环来完成 sleep，但这实际会占用 CPU，与其他编程语言的线程休眠大相径庭
  - 多线程编程：现在对于多核CPU利用率要求提高，需要 node 支持
  - 异步转同步：node 部分异步 API 没有提供同步使用方法



> 异步编程主要的解决方案有 三种：事件发布/订阅模式、Promise/Defferred模式、流程控制库模式

**事件发布/订阅模式**

- 事件队列解决雪崩问题

  雪崩问题：在高访问量、大并发量的情况下缓存失效的情景，大量的请求同时涌入数据库中，数据库无法同时承受如此大的查询请求，从而影响到网站整体的响应速度

  ```js
  var proxy = new events.EventEmitter();
  var status = "ready";
  var select = function (callback) {
      proxy.once("selected", callback);
      if (status === "ready") {
          status = "pending";
          db.select("SQL", function (results) {
          proxy.emit("selected", results);
          status = "ready";
          });
      }
  };
  ```

- `eventproxy`

  nodejs 并发控制第三方包，更优雅解决并行任务执行

  - 使用哨兵解决并行任务执行完成后再执行主逻辑

  ```js
  (function () {
    var count = 0;
    var result = {};
  
    $.get('http://data1_source', function (data) {
      result.data1 = data;
      count++;
      handle();
      });
    $.get('http://data2_source', function (data) {
      result.data2 = data;
      count++;
      handle();
      });
    $.get('http://data3_source', function (data) {
      result.data3 = data;
      count++;
      handle();
      });
  
    function handle() {
      if (count === 3) {
        var html = fuck(result.data1, result.data2, result.data3);
        render(html);
      }
    }
  })();
  ```

  - 使用 `eventproxy`

  ```js
  var ep = new eventproxy();
  ep.all('data1_event', 'data2_event', 'data3_event', function (data1, data2, data3) {
    var html = fuck(data1, data2, data3);
    render(html);
  });
  
  $.get('http://data1_source', function (data) {
    ep.emit('data1_event', data);
    });
  
  $.get('http://data2_source', function (data) {
    ep.emit('data2_event', data);
    });
  
  $.get('http://data3_source', function (data) {
    ep.emit('data3_event', data);
    });
  ```

  `eq.all` 函数会等待所有监听事件都完成后才触发回调函数执行，且回调函数参数的顺序与事件监听的顺序一致。`eventproxy` 另一个优势在与简单的错误处理。如果是基于事件发布/订阅模式实现上述流程的话，还需要额外抛出以及监听错误事件执行对应回调，而 `eventproxy` 提供了两个 API

  ```js
  var ep = new eventproxy()
  
  ep.fail(callback)
  ep.done('event')
  ```

  ```js
  ep.fail(callback)
  // means
  ep.bind('error', function(err) {
      ep.unbuild() // 卸载调所有处理函数
      callback(err) // 异步回调
  })
  ```

  ```js
  ep.done('event')
  // means
  function(err, content) {
      if(err) {
  		return ep.emit('error', err)
      }
      ep.emit('event', content)
  }
  ```

  通过两个封装的 API 简化了整个错误处理流程



**Promise/Deferred 模式**

- deffered 主要用于内部，用户维护异步模型的状态；promise 则作用于外部，通过 then 方法暴露给外部添加自定义逻辑

  ![image-20230924153431969](/home/jzy/Documents/markdown/reading/deep-nodejs.assets/image-20230924153431969.png)

```js
var Promise = function () {
    this.queue = [];
    this.isPromise = true
}
// 支持 then 链式调用
Promise.prototype.then = function (fulfilledHandler, errorHandler, progressHandler) {
    var handler = {};
    if (typeof fulfilledHandler === 'function') {
    	handler.fulfilled = fulfilledHandler;
    }
    if (typeof errorHandler === 'function') {
    	handler.error = errorHandler;
    }
    this.queue.push(handler);
    return this;
};

var Deferred = function() {
    this.promise = new Promise()
}

Deferred.prototype.resolve = function(obj) {
    var promise = this.promise
    var handler
    while(handler = promise.queue.shift()) {
        var ret = handler.fulfilled(obj)
        if(ret && ret.isPromise) {
          ret.queue = promise.queue;
           this.promise = ret; // 更新链式调用 promise 引用
           return
        }
    }
}

// 回调
Deferred.prototype.callback = function () {
    var that = this;
    return function (err, file) {
        if (err) {
        	return that.reject(err);
        }
        that.resolve(file);
     };
}
```



**流程控制库**

和 Promise/Deferred 不一样的是，流程控制库不强调维护状态，而是通过不同回调函数注入位置来实现异步编程，可以理解为用户只需要关注回调函数的执行顺序即可，不需要关心内部逻辑处理。常用的流程控制库有 `async`、`step` ……



**异步并发控制**

> 异步编程让我们能够并发任务，但是一旦并发的数量超过某个阈值，可能会导致过系统资源过度使用而报错

解决思路：

- 通过一个队列来控制并发量
- 如果当前活跃（调用发起但未执行回调）的异步调用量小于限定值，从队列中取出执行
- 如果活跃调用达到限定值，调用暂时存放在队列中
- 每个异步调用结束时，从队列中取出新的异步调用执行



## 第五章 内存管理

![image-20230924165018279](/home/jzy/Documents/markdown/reading/deep-nodejs.assets/image-20230924165018279.png)

> 内存管理主要是堆内存管理



### 新生代内存回收算法

**cherry算法**

`cherry` 算法时一种采用复制的方式实现的垃圾回收算法，通过将堆内存一分为二，每一部分空间成为 `semispace`。在两个 `semispace` 中，只有一个处于使用中，另一个处于闲置状态。处于使用状态的称为 `from` 空间，处于限制状态的空间成为 `to` 空间。当开始分配对象时，先在 `from` 空间中进行分配，当开始进行垃圾回收时，会检查from空间中的存活对象，这些存活对象会被复制到 to 空间中，而非存活对象占用的空间将会被释放，完成复制后，from 空间和 to 空间的角色发生对换，典型地使用空间换取时间的回收算法。

![image-20230924165921956](/home/jzy/Documents/markdown/reading/deep-nodejs.assets/image-20230924165921956.png)

> 其实从 from 空间复制到 to 空间的过程中还会经历一个“筛选”过程，需要将存活周期长的对象转移到老生代，这种行为叫 “对象晋升”

![image-20230924171509674](/home/jzy/Documents/markdown/reading/deep-nodejs.assets/image-20230924171509674.png)

![image-20230924171520728](/home/jzy/Documents/markdown/reading/deep-nodejs.assets/image-20230924171520728.png)

以上两图时对象晋升的条件，满足一条就可以晋升到老生代内存区中



### 老生代内存回收算法

> 采用 `Mark-Sweep` 和 `Mark-Compact` 相结合的方式

![image-20230924171819970](/home/jzy/Documents/markdown/reading/deep-nodejs.assets/image-20230924171819970.png)

`mark-sweep` （标记清除）最大的问题是在进行一次标记清除回收后，内存空间会出现不连续状态，这种内存碎片会对后续的内存分配造成问题 —— 在分配大对象的时和，碎片空间无法分配，提前触发垃圾回收，而这次回收是不必要的。

![image-20230924172219550](/home/jzy/Documents/markdown/reading/deep-nodejs.assets/image-20230924172219550.png)

`mark-compact` （标记整理），在 `mark-sweep` 的基础上，将存活的对象往一端移动，移动完成后直接清理掉边界外的内存，这样就能够保证内存的连续性



- 性能比较

![image-20230924172416609](/home/jzy/Documents/markdown/reading/deep-nodejs.assets/image-20230924172416609.png)

考虑 `mark-compact` 需要移动对象速度较慢，因此 V8 在老生代区域主要使用 `mark-sweep` ，只有当剩余空间不足以分配给从新生代晋升的对象时才会使用 `mark-compact`



- 全停顿

  为了避免出现 javascript 应用逻辑与垃圾回收器看到不一致的情况，上述三种基本算法都需要将应用逻辑暂停下来，等待执行完成垃圾回收后再恢复执行应用逻辑，这种行为被成为“全停顿”，也叫“全堆回收垃圾”

![image-20230924172714387](/home/jzy/Documents/markdown/reading/deep-nodejs.assets/image-20230924172714387.png)

为了解决全堆回收垃圾带来的停顿时间（主要是老生代区域标记遍历的时间），引出“增量标记”，即将过程拆分为若干步，JS 执行逻辑与垃圾回收交替进行指导标记阶段完成



## 第六章 Buffer

Buffer 创建、内存分配

- 什么是 Buffer：Buffer 可以理解为是一个元素为16进制两位数的数组
- 如何进行内存分配：对于大小比较小的 buffer 对象，采用 slab 分配方式，每个 slab 大小为 8KB，分配空间不足则创建下一个 slab。对于比较大的 buffer 对象，直接采用 C++ 层面的 `SlowBuffer` 

Buffer 与 Str 类型转换

- 目前Buffer 支持转换的字符串编码类型有：ASCII、UTF-8、UTF-16LE/UCS-2、Base64、Binary、Hex，调用方法

  ``` js
  buffer.toString([encoding], [start], [end]) // 不传默认是 utf-8
  ```

  

- Windows 125系 、ISO-8859系 、IBM/DOS、Macintosh系 、KOI8系 ，Latin1、US-ASCII， GBK GB2312，像这些不支持的编码可以使用 `iconv` 进行转换

  ```js
  var iconv = new Iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE'); // 最多三层降级
  iconv.convert('ça va'); // "ca va "
  ```

  

Buffer 乱码问题

- 为什么会存在乱码？宽字节的中文会在分批次读取中被截断导致部分内容无法正常解析

- 如何解决？`string_decoder` ：在设置可读流的时候可以设置编码类型，`string_decoder` 在不改变读取次数的情况下，能够不分割宽字节，将当前被截断的部分字节拼接到下一部分。

- 如何解决？（高级）正确拼接 `buffer`：

  ```js
  var chunks = [];
  var size = 0;
  res.on('data', function (chunk) {
      chunks.push(chunk);
      size += chunk.length;
  });
  res.on('end', function () {
      var buf = Buffer.concat(chunks, size);
      var str = iconv.decode(buf, 'utf8');
      console.log(str);
  });
  
  Buffer.concat = function(list, length) {
      if (!Array.isArray(list)) {
      	throw new Error('Usage: Buffer.concat(list, [length])');
      }
      if (list.length === 0) {
      	return new Buffer(0);
      } else if (list.length === 1) {
      	return list[0];
      }
      if (typeof length !== 'number') {
      	length = 0;
      	for (var i = 0; i < list.length; i++) {
      		var buf = list[i];
      	length += buf.length;
      	}
      }
      var buffer = new Buffer(length);
      var pos = 0;
      for (var i = 0; i < list.length; i++) {
      	var buf = list[i];
          // 复制 buffer
      	buf.copy(buffer, pos);
      	pos += buf.length;
      }
      return buffer;
  };
  ```




## 第七章 网络编程

章节主要描述了 node 内建模块如何建立一些常用的网络连接，像 TCP、UDP、WebSocket。



- 创建 TCP 服务器

```js
const net = require('net')
const server = net.createServer((socket) > {
    socket.on('data', (data) => {
       // step03
    	socket.write('')
	})
    // step05
    socket.on('end', () => {})
    // step02
	socket.write()
})

server.listen(port, () => {})
```

- 创建 TCP 连接

```js
const net = require('net')
const client = net.connect({ port }, () => {
    // step01
    client.write()
})
client.on('data', () => {
    // step04
    client.end()
})
client.on('end', () => {})
```

- 创建 UDP 连接

```js
const dgram = require('dgram')
const server = dgram.createSocket('udp4')
server.on('listening') // bind 绑定后触发
server.on('message') // 接收到数据推送
server.bind(port)
```

> http 请求模块

为什么会引出这样一个模块？很多时候我们并不关注协议本身的实现，需要一个顶层设计帮我们解决实际问题，`http` 模块可以帮我们快速建立 `tcp` 长连接。并且封装了请求对象、响应对象，让我们能够通过 `JS` 对象操作数据报文（`buffer` 二进制数据）

> http.globalAgent

可以理解为是 `JS HTTP`  连接池，控制并发发送请求的数量

```js
const agent = http.Agent({/* 可传入 http 中自定义连接池 */
    maxSockets: 10
})
```



## 第八章 构建web应用

章节主要描述了 node 如何构建一个后端服务，总的来说可以分为：

- 请求方法&路径解析：解析路径并得到其中的一些路由参数（url package）
- 身份鉴权
  - cookie、session
  - jwt
- 中间件处理
  - 数据预处理
  - db 连接
- 数据响应
  - 向客户端响应不同的数据格式（content-type）
  - 附件下载（content-disposition)
- 模板渲染
  - 模板渲染的原理（regexap）
  - 模板转义防止xss （escape）



## 第九章 玩转进程



node 在 v8 中运行是单进程+单线程结构，为了充分利用 cpu ，可以复制出与系统 cpu 核心数相同的子进程。

```js
const child_process = require('child_process')
child_process.fork('./worker.js')
```

- spawn：启动一个子进程执行命令
- exec：启动一个子进程执行命令，区别于 spawn，有一个回调函数可以获取子进程的状况
- execFile：启动一个子进程执行可执行文件
- fork：与 spawn 类似，不同在于创建的子进程只需执行指定需要执行的 javascript 文件



子进程与父进程之间通过 ipc 进行数据通信，以下是地层基于 libuv 的实现

![image-20231125113556664](/home/jzy/Documents/markdown/reading/deep-nodejs.assets/image-20231125113556664.png) ![image-20231125113645641](/home/jzy/Documents/markdown/reading/deep-nodejs.assets/image-20231125113645641.png)



