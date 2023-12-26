# 数组

[参考链接](https://juejin.cn/post/6844903614918459406)



## :key: 创建数组

```javascript
// 字面量
const a = [1, 2, 3]
// 构造器
const b = new Array(3, 11, 8)
const c = Array(3, 11, 8)
```

### Array.of

返回由所有参数值组成的数组，如果没有参数，就返回一个空数组

```javascript
let a = Array.of(3, 11, 8)
let a = Array.of(3)
```

### Array.from

- 将类数组对象和部署了迭代器的对象转换为真正的数组

```javascript
 // 1. 对象拥有length属性 
let obj = {0: 'a', 1: 'b', 2:'c', length: 3}; 
let arr = Array.from(obj); // ['a','b','c']; 

// 2. 部署了 Iterator接口的数据结构 比如:字符串、Set、NodeList对象 
let arr = Array.from('hello'); // ['h','e','l','l','o'] 
let arr = Array.from(new Set(['a','b'])); // ['a','b']
```

- 其实也可以进行数组的初始化(常用于二维数组初始化)，利用 Array.from 的第二个参数 mapFn，该函数会遍历前一个每一个数组元素并返回值

```js
// 构造一个初始全部为 0 的  6*6 的二维数组
const a1 = Array.from(Array(6), () => Array(6).fill(0))
```



## :key: 改变原数组

改变原数组其实就是当数组调用这些方法的时候会对它本身进行修改，包括值的修改和长度的修改，这些方法有 splice, sort, pop, shift, push, unshift, reverse


### splice

向数组中添加或者删除元素，返回被删除的元素数组

- 三个参数

  * index 开始添加/删除的位置，添加是在 index 之前添加，删除是从 index 开始往后删除

  * howmany(可选) 要删除的项目数量。如果设置为0，则不会删除项目

  * item1, ...., itemX（可选） 向数组添加新项目


```js
const a1 = [1, 2, 3, 4]
a1.splice(1, 0, 22) // [1, 22, 2, 3, 4]
a1.splice(1, 2) // [1, 3, 4]
```



### sort

对数组元素进行排序，会直接改变数组元素内部顺序

参数

* 规定排序顺序的比较函数。默认情况下 sort 如果没有传比较函数的话，默认按字母升序，如果元素不是字符串的话，会调用 toString() 方法将元素转化为字符串，然后再进行比较。（但并不会真正地对数组中的元素进行转换处理）

:star: 比较函数（a, b）=> a - b

- 比较函数返回值 < 0，a 排在 b 前面
- 比较函数返回值 = 0，位置不发生改变
- 比较函数返回值 > 0，b 排在 a 前面
- 针对上面这些特性，我们可以根据具体的业务需求来定制对应的排序函数




### pop

删除一个数组中的最后一个元素并返回这个元素



### shift

删除一个数组中的第一个元素并返回这个元素



### push

向数组的尾部添加元素并返回新的数组长度。可以是一个也可以是多个，内部 push 的定义为 push(...args)，所以我们传参的时候直接多个数字传进行就好，它内部会进行处理的。

:key: 参数：item1, item2.....itemn



### unshift

向数组的头添加元素，并返回新的数组长度

:key: 参数：item1, item2, ....., itemn



### reverse

颠倒数组中元素的顺序



### copyWithin

指定位置的成员复制到其他位置（需要注意兼容性的问题）

```javascript
// 语法
array.copyWithin(target, start=0, end=this.length)
```
* target（必须）：从该位置开始替换数据 负数为从后开始
* start：从该位置开始读取数据   负数为从后开始
* end：到该位置前停止读取数据，默认等于数组长度 负数为从后开始
```javascript
[1, 2, 3, 4, 5].copyWithin(0, 2, 5) // [3, 4, 5, 4, 5]
```



### fill

使用给定的值填充一个数组

参数

* 第一个元素：要填充数组的值
* 第二个元素（可选）：填充的开始位置，默认值为 0
* 第三个元素（可选）：填充的结束位置，默认值为 this.length
```javascript
['a', 'b', 'c'].fill(7, 1, 2) // ['a', 7, 'c']
```



## :key: 不改变原数组



### slice

返回一个从开始到结束选择的数组的一部分浅拷贝到一个新数组对象，且原数组不会被改变

参数

* begin（可选）：索引数值，从该索引处开始提取原数组中的元素
* end（可选）：索引数值，在该索引处前结束提取原数组，默认值为数组末尾

```js
// 有一个场景是在一个动态数组中需要不断截取后5个字符
// 数组的长度不断变化，怎么使用简单的方式去截取呢？
array.slice(-5) // 这样子就可以了
```

:key: 这种方法的意思就是说从倒数的第五个元素开始往后截取元素，如果不满足5个话就返回整个数组。



### join

把数组中的所有元素通过指定分隔符进行分隔放入一个字符串，返回生成的字符串

参数

* str（可选）：指定要使用的分隔符，默认使用逗号作为分隔符
```javascript
    let a= [['OBKoro1','23'],'test'];
    let str1=a.join(); // OBKoro1,23,test
    // 可以理解为它做了一个扁平化的处理
    
    let b= [{name:'OBKoro1',age:'23'},'test'];
    let str2 = b.join(); // [object Object],test
```


### toLocaleString

返回一个表示数组的字符串。实际运行起来会调用 join 方法利用 ， 进行隔开



### *concat

>方法用于合并两个或多个数组，返回一个新数组
```javascript
oldArray.concat(arrayX, arrayX, ...., arrayX)
```
需要注意的是如果参数是一个数组的话会自动地将里面的所有元素进行解构，可以理解为是将把数组解开的意思，常用在数组扁平化中
```javascript
var num1 = [[1]];
var num2 = [2, [3]];
var num3=[5,[6]];
var nums = num1.concat(num2);
console.log(nums);
// results is [[1], 2, [3]]
var nums2=num1.concat(4,num3);
console.log(nums2)
// results is [[1], 4, 5,[6]]
// modify the first element of num1
num1[0].push(4);
console.log(nums);
// results is [[1, 4], 2, [3]]
```



### indexOf

>返回在数组元素中找到一个给定元素的第一个索引，如果不存在返回 -1
```javascript
array.indexOf(element, fromIndex)
// element - 需要查找的元素
// fromIndex - 需要查找的位置
// 基于 === 进行判断
// 不能识别 NaN
```



### lastIndexOf

>返回指定元素在数组中的最后一个索引，如果不存在则返回 -1
```javascript
arr.lastIndexOf(element, fromIndex)
// element - 被查找的元素
// fromIndex - 逆向查找的位置默认是-1
```



### *includes

>查找数组是否包含某个元素。解决了 indexOf 不能识别 NaN 的问题，而且更加有语义话不需要判断是否为 -1



## :key: 遍历数组



### forEach

>1. 对于空数组是不会执行回调函数的
>2. 空元素跳过（undefined / nulll 除外）






### every

>检测数组所有元素是否都符合判断条件。如果数组中检测到有一个元素不满足的话整个表达式会返回 false，且剩余的元素不会再进行检测，所有条件都满足条件则返回 false
```javascript
array.every(function(currentValue, index, arr), thisValue)
```



### some

>数组中是否有满足判断条件的元素。语法和 every 类似。如果有一个元素满足条件，则表达式返回 true



### filter

>返回一个新数组，包含所有通过提供的函数测试的元素。语法格式和 every 类似。



### map

>创建一个新数组，结果是原数组中每个元素调用一个提供的函数后返回的结果。语法格式和evey类似



### *reduce*

>对数组中的每个元素执行一个提供的累加函数，将其结果汇总为单个返回值。常用于得到一个数组中的累加值、统计每个元素出现的次数、数组扁平化等等
```javascript
arr.reduce(callback(accumulator, currentValue[, index[, array]])[, initialValue])

1. accumulator(必须)，初始值, 或者上一次调用回调返回的值
2. currentValue(必须),数组当前元素的值
3. index(可选), 当前元素的索引值
4. array(可选),数组对象本身
5. initValue 累加器的初始值（默认数组中的第一个元素）
```

