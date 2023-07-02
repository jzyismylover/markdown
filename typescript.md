# TS 基础

## [TS 在线编辑器](https://www.typescriptlang.org/zh/play)



1、什么是动态类型，什么是静态类型？

        1. 动态类型是值在运行中才会对类型进行检测
        2. 静态类型是值在声明
2、javascript 发展到 typescript 有哪些性能上的提升



## :wink: vscode 运行 .ts 文件

```typescript
npm install -g typescript ts-node

// 在 vscode 终端 使用 ts-node xxx.ts 文件即可
// 或者使用 Code Runner 插件
// 不过需要注意这样子对类型检测十分严格，它并不会帮你去自动推断
```



## :smile: typescript 基本类型



- 与JS 共有： boolean, number, string, array, object
- 独特：tuple，enum，interface



### tuple

- tuple 叫做元组，表示一个已知元素数量且类型不必相同的数组

```ts
/* 限定了第一个元素只能是 string, 第二个元素只能是 number */
let x: [string, number];
x = ['hello', 10]; // OK
x = [10, 'hello']; // Error
```

:exclamation: 如果出现越界访问怎么办？如果出现越界访问使用联合类型进行替代

```ts
x[3] = 'world'; // OK, 字符串可以赋值给(string | number)类型
```



### unknown

* unknown 是一个和 any 相似的顶级类型，它可以被赋值为任何类型
```typescript
let value:unknown;
value = 10;
value = "abcd";
value = true;
// 所有形如这样的赋值都是可以成立的 ->
// unknown 是顶级类型，变量可以被赋值给任意类型
value = any(10);
```


* unknown 不能作为值赋值给除了 any 和 unknown 以外类型的变量
```typescript
let value: unknown;
let value1: unknown = value; // OK
let value2: any = value; // OK
let value3: boolean = value; // Error
```

* unknown 类型变量不具备对象、数组访问功能
```typescript
let value: unknown;
value.foo.bar; // Error
value.trim(); // Error
value(); // Error
new value(); // Error
value[0][1]; // Error
```



### null、undefined、void、never

* null 和 undefined 各为一体，都可以赋值给其他类型的变量，但是他们互相不能够赋值给对方。
* void 更多用于没有返回的函数，虽然默认已经帮我们写上了
* never 更多用于无法到达终点的函数

```ts
funtion throw():never {
    throw ('Error') // 永远到不了函数终点的方法例子
}
```



### object & Object & {}

* object 在 TypeScript 2.2 引入，用于表示非原始类型，在 JavaScript 中以下类型被视为原始类型 string, boolean, number, bigint, symbol, null, undefined
* 所有的其他类型被视为非基本类型
```typescript
// All primitive types
type Primitive = string 
 | boolean | number 
 | bigint | symbol 
 | null | undefined;

// All non-primitive types
type NonPrimitive = object;

// 我们可以理解为 object 就是非基本类型的一个集合
```
* object 的另一个用例是作为 ES2015的一部分引入的 WeakMap 数据结构。它的键必须是对象，不能是原始



**Object类型**

* 定义了 Object.prototype 原型对象上的属性
* ObjectConstructor 接口定义了 Object 类的属性

```typescript
interface Object {
  constructor: Function;
  toString(): string;
  toLocaleString(): string;
  valueOf(): Object;
  hasOwnProperty(v: PropertyKey): boolean;
  isPrototypeOf(v: Object): boolean;
  propertyIsEnumerable(v: PropertyKey): boolean;
}

interface ObjectConstructor {
  /** Invocation via `new` */
  new(value?: any): Object;
  /** Invocation via function calls */
  (value?: any): any;
  readonly prototype: Object;
  getPrototypeOf(o: any): any;
  // ···
}
declare var Object: ObjectConstructor;
```
* 与 object 最大的区别是，object 仅仅用于表示非原始类型，不能访问值的任何属性，也就是不能访问 toString, valueOf 等等，而 Object 则包括原始值

**空类型 {}**

* 描述了一个**没有成员**的对象
```typescript
const obj = { }
obj.prop = "semlinker" // 报错
```
解决的方法一般为初始化时就赋值
```typescript
const pt = { 
  x: 3,
  y: 4, 
}; // OK

const pt: Point = { 
  x: 3,
  y: 4, 
};
```
* 使用 Object.assign 的时候需要注意
```typescript
const pt = { x: 666, y: 888 };
const id = { name: "semlinker" };
const namedPoint = {};
Object.assign(namedPoint, pt, id); // 报错

// 解决方法如下
const pt = { x: 666, y: 888 };
const id = { name: "semlinker" };
const namedPoint = {...pt, ...id}
```



### type & interface 区别

* 对象字面量类型可以内联，而接口不能（内联其实就是不用额外在需要使用的外面再去定义的意思，和 CSS 里面的内联样式差不多的概念）
```typescript
// Inlined object literal type:
function f1(x: { prop: number }) {}

function f2(x: ObjectInterface) {} // referenced interface
interface ObjectInterface {
  prop: number;
}
```
* 对象字面量名称不可以重复，而含有重复名称的接口将会被合并
```typescript
// 使用 @ts-ignore 忽略错误。
// @ts-ignore: Duplicate identifier 'PersonAlias'. (2300)
type PersonAlias = {first: string};
// @ts-ignore: Duplicate identifier 'PersonAlias'. (2300)
type PersonAlias = {last: string};

interface PersonInterface {
  first: string;
}
interface PersonInterface {
  last: string;
}
const sem: PersonInterface = {
  first: 'Jiabao',
  last: 'Huang',
};
```



* 映射类型

  对象、class 在 TypeScript 对应的类型是索引类型（Index Type），那么如何对索引类型作修改呢？

  答案是`映射类型`。

  ```typescript
  type MapType<T> = {
    [Key in keyof T]?: T[Key]
  }
  ```

  keyof T 是查询索引类型中所有的索引，叫做`索引查询`。

  T[Key] 是取索引类型某个索引的值，叫做`索引访问`。

  in 是用于遍历联合类型的运算符。

  比如我们把一个索引类型的值变成 3 个元素的数组：

  ```typescript
  type MapType<T> = {
      [Key in keyof T]: [T[Key], T[Key], T[Key]]
  }
  
  type res = MapType<{a: 1, b: 2}>;
  ```

  ![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b8c462c6120348d0bdd00afbaa58727c~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

  **映射类型就相当于把一个集合映射到另一个集合，这是它名字的由来**。

  ![img](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d31910d7bb6f4e379bf91a638e9c4f36~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

  除了值可以变化，索引也可以做变化，用 as 运算符，叫做`重映射`。

  ```typescript
  type MapType<T> = {
      [
          Key in keyof T 
              as `${Key & string}${Key & string}${Key & string}`
      ]: [T[Key], T[Key], T[Key]]
  }
  ```

  我们用 as 把索引也做了修改，改成了 3 个 key 重复：

  ![img](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1240af0a478640cdbc7fa364045eefaf~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

  这里的 & string 可能会迷惑，解释一下：

  因为索引类型（对象、class 等）可以用 string、number 和 symbol 作为 key，这里 keyof T 取出的索引就是 string | number | symbol 的联合类型，和 string 取交叉部分就只剩下 string 了。就像前面所说，交叉类型会把同一类型做合并，不同类型舍弃。

  ![img](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d7a37f14570743898285a59f5e797662~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

  

```typescript
interface Point {
  x: number;
  y: number;
}
type PointCopy1 = {
  [Key in keyof Point]: Point[Key]; // (A)
};
// Syntax error:
// interface PointCopy2 {
//   [Key in keyof Point]: Point[Key];
// };
```



* 多态 this 类型
  多态 this 类型仅仅适用于接口

其实原理上和 Java 所讲的多态是类似的

```typescript
interface AddsStrings {
  add(str: string): this;
};
class StringBuilder implements AddsStrings {
  result = '';
  add(str: string) {
    this.result += str;
    return this;
  }
}
```



## :laughing: typescript 类型守卫

* instanceof运算符用来判断一个构造函数的prototype属性所指向的对象是否存在另外一个要检测对象的原型链上



### 自定义类型保护的类型谓词

* 类型守护有三个比较基础的关键字：in、typeof、instanceof
* 引入自定义类型保护的类型谓词的原因是很多时候我们需要为不同类型的数据编写不同的类型验证方法，整个过程会比较烦琐，而这个技术通过泛型的概念，可以让我们编写一个通用的类型缩小的函数。
```typescript
function isOfType<T>(
  varToBeChecked: any, // 需要缩减类型范围的变量
  propertyToCheckFor: keyof T // 类型上的某个属性
): varToBeChecked is T {
  return (varToBeChecked as T)[propertyToCheckFor] !== undefined;
}
```
[https://cloud.tencent.com/developer/article/1600711](https://cloud.tencent.com/developer/article/1600711)



## :wink: 联合类型和类型别名

1. 首先是联合类型的概念 - 比较大的一个作用是可以提供多种类型的候选，比如string|number 就联合了 string类型和 number类型。
2. 其次是可辨识联合 - 当多个类或者接口都有相同的变量的时候我们可以通过对该变量辨识不同接口或者类从而使用他们各自的方法去组织逻辑。
3. 最后也是最重要的概念就是类型别名 - type 关键字去声明类型别名。
[https://juejin.cn/post/6844903753431138311](https://juejin.cn/post/6844903753431138311)



## :joy: 交叉类型（&）

* 通过 & 关键字合并多个不同的类型，需要注意的是合并的是类型，交叉类型的交叉并不是指类型的交集而是指类型的并集。
* 但是存在一种特例 string | number & string | boolean 混合起来的结果是 string，而不是我们想要的 string | number | boolean，至于为什么会这样可能还需深入理解。
* **可以实现 type 的拓展**
* 语法 T & U



>返回类型既要符合 T 类型也要符合 U 类型
>string | number & string | boolean 这样子的联合存在一定的机制 string 既符合 string |number 也符号 string | boolean 所以最后就会返回最小结果，可以理解为是最小原则


```typescript
interface Ant {
  name: string,
  weight: number
}

interface Fly {
  flyHeight: number,
  speed: numebr
}

// 少了任何一个类型都会报错
const flyAnt: Ant & Fly = {
  name: 'xxx',
  weight: 0.2,
  flyHeight: 20,
  speed:1
}

// 实现 type 的拓展
type Name = {
    name: string
}
type User = Name & { age: number } // { name: string, age: number }
```

>在测试的过程中其实也有了一些 debug 经验，就是说使用关键字正确的语法的时候，编译器一般都会给我们显示推断出结果的，一般难以推断的就证明我们的写法很有可能是出问题的，需要去注意或者修改甚至删除





## :smiley: 联合类型（|）

* 联合类型与交叉类型有管理，但是使用上却完全不同
* 语法：T | U
>返回类型为连接的多个类型中的任意一个
```typescript
let stringOrNumber: string | number = 0
stringOrNumber = ''
```
* 不过需要注意下面这种情况，联合类型因为返回类型为多个类型中的任意一个，比如有 array | string，类型推断以后可能为 string，但是string 没有有 push 方法，所以编译器要做出这样的限制
```typescript
class Bird {
    fly() {
        console.log('Bird flying');
    }
    layEggs() {
        console.log('Bird layEggs');
    }
}

class Fish {
    swim() {
        console.log('Fish swimming');
    }
    layEggs() {
        console.log('Fish layEggs');
    }
}

const bird = new Bird();
const fish = new Fish();

function start(pet: Bird | Fish) {
    // 调用 layEggs 没问题，因为 Bird 或者 Fish 都有 layEggs 方法
    pet.layEggs();

    // 会报错：Property 'fly' does not exist on type 'Bird | Fish'
    // pet.fly();

    // 会报错：Property 'swim' does not exist on type 'Bird | Fish'
    // pet.swim();
}

start(bird);

start(fish);
```



**当类型参数为联合类型，并且在条件类型左边直接引用该类型参数的时候，TypeScript 会把每一个元素单独传入来做类型运算，最后再合并成联合类型，这种语法叫做分布式条件类型。**

比如这样一个联合类型：

```typescript
type Union = 'a' | 'b' | 'c';
```

我们想把其中的 a 大写，就可以这样写：

```typescript
type UppercaseA<Item extends string> = 
    Item extends 'a' ?  Uppercase<Item> : Item;
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/842143798583491aae9dbec0da327da8~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

可以看到，我们类型参数 Item 约束为 string，条件类型的判断中也是判断是否是 a，但传入的是联合类型。这就是 TypeScript 对联合类型在条件类型中使用时的特殊处理：会把联合类型的每一个元素单独传入做类型计算，最后合并。



## 枚举类型

```tsx
enum Enum {
  A = 1,
  B = 'string'
}
Enum.A === 1
Enum[1] === A
```

枚举类型定义数字的话存在双向映射的过程



```tsx
const enum Directions {
    Up,
    Down,
    Left,
    Right
}

let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right]
```

使用 const 声明可以规避双向映射



## :key: 类型兼容

### 基本类型

```tsx
let y:number|string = 'hello-world'
let x: string = y // ok

let y:number|string = 20
let x: string = y // 不 ok

let y:number|string
let x: string = 'hello world'
y = x // 永远都是 ok 
```



存在联合类型的时候，像string | number 要兼容 string 是完全可以的，但是像 string 要兼容 string | number 的话只有当变量取  string 的时候才被运行，否则就会出现上面第二个例子的问题。



### 对象类型

```tsx
interface Named {
    name: string;
}

let x: Named;
// y's inferred type is { name: string; location: string; }
let y = { name: 'Alice', location: 'Seattle' };
x = y;
```



其实对象类型的类型兼容规则：x = y (y 赋值给 x)，意味着 x 的类型要兼容 y 的类型，编译器会对 x 的类型进行遍历，如果 x 需要的类型都出现在 y 中，那么 y 赋值给 x 就是允许的，即使 y 有其余更多的属性也没有关系。



### 函数类型

```tsx
let x = (a: number) => 0;
let y = (b: number, s: string) => 0;

y = x; // OK
x = y; // Error
```

```tsx
let x = (a: number) => 0;
let y = (b: string, s: number) => 0
y = x // 不 ok
```



对于函数类型来说，在返回值类型一致的情况下，x = y(y赋值给 x)，那么编译器会检查 y 中的每个参数在 x 中相同位置是否能找到相同类型的参数，也就是相同位置的类型相同即可不考虑参数的名字。因为其实在 JS 里面函数的参数其实不一定都要传完



### 类

类与对象字面量和接口差不多，但有一点不同：类有静态部分和实例部分的类型。 比较两个类类型的对象时，只有实例的成员会被比较。 静态成员和构造函数不在比较的范围内。

```tsx
class Animal {
    feet: number;
    constructor(name: string, numFeet: number) { }
}

class Size {
    feet: number;
    constructor(numFeet: number) { }
}

let a: Animal;
let s: Size;

a = s;  //OK
s = a;  //OK
```

:key: 私有成员会影响兼容性判断。 当类的实例用来检查兼容时，如果目标类型包含一个私有成员，那么源类型必须包含来自同一个类的这个私有成员。 这允许子类赋值给父类，但是不能赋值给其它有同样类型的类。

```tsx
class Animal {
  private name: string | undefined // 私有类型限定了只能是子类类型赋值给父类
    feet: number;
    constructor(name: string, numFeet: number) {
      this.feet = numFeet
    }
}

class A22 extends Animal { // A22 继承了 Animal，因此它的实例是可以赋值给 Animal 的实例
  constructor(name: string, numFeet: number) {
    super(name, numFeet)
  }
}

class Size {
  private name: string | undefined
    feet: number;
    constructor(numFeet: number) {
      this.feet = numFeet
    }
}

let a1: Animal;
let t1: A22 = new A22('jzy', 22);
let t2: Size = new Size(20)

a1 = t1;  //OK
a1 = t2;  //不 OK
```



### 泛型

对于没指定泛型类型的泛型参数时，会把所有泛型参数当成 any 比较。

```tsx
let identity = function<T>(x: T): T {
    // ...
}

let reverse = function<U>(y: U): U {
    // ...
}

identity = reverse;  // Okay because (x: any)=>any matches (y: any)=>any
```

```tsx
interface NotEmpty<T> {
    data: T;
}
let x: NotEmpty<number>;
let y: NotEmpty<string>;

x = y;  // 不 ok，指定了泛型后 data 的属性不一致
```



# TS 进阶

## 命名空间 namspace



namespace 的引出是为了我们更好地去管理类型，当存在多个类型的时候我们可以将一些是一类的类型进行合并，这样子引用的时候就可以通过某个 namespace 的方式去引入

```ts
namespace Validation {/* Validation 命名空间 */
    export interface StringValidator {
        isAcceptable(s: string): boolean;
    }

    const lettersRegexp = /^[A-Za-z]+$/;
    const numberRegexp = /^[0-9]+$/;

    export class LettersOnlyValidator implements StringValidator {/* 向外暴露类 */
        isAcceptable(s: string) {
            return lettersRegexp.test(s);
        }
    }

    export class ZipCodeValidator implements StringValidator {/* 向外暴露类 */
        isAcceptable(s: string) {
            return s.length === 5 && numberRegexp.test(s);
        }
    }
}

```

:key: 整体来看其实命名空间就是一个小型的 ts 文件，我们可以在内部定义变量，定义类型，然后导出等等，但其实在项目里面我们完全可以将这些逻辑写在一个 TS 文件里面，所以说我们在写 TS 文件就相当于再写命名空间了，完全符合命名空间内部隔离，内部封装的特性。



### 多文件命名空间

```tsx
Validation.ts
namespace Validation {
    export interface StringValidator {
        isAcceptable(s: string): boolean;
    }
}
```

```tsx
LettersOnlyValidator.ts
/// <reference path="Validation.ts" />
namespace Validation {
    const lettersRegexp = /^[A-Za-z]+$/;
    export class LettersOnlyValidator implements StringValidator {
        isAcceptable(s: string) {
            return lettersRegexp.test(s);
        }
    }
}
```

```tsx
ZipCodeValidator.ts
/// <reference path="Validation.ts" />
namespace Validation {
    const numberRegexp = /^[0-9]+$/;
    export class ZipCodeValidator implements StringValidator {
        isAcceptable(s: string) {
            return s.length === 5 && numberRegexp.test(s);
        }
    }
}
```



实际使用的时候

```tsx
/// <reference path="Validation.ts" />
/// <reference path="LettersOnlyValidator.ts" />
/// <reference path="ZipCodeValidator.ts" />

let strings = ["Hello", "98052", "101"];

let validators: { [s: string]: Validation.StringValidator; } = {};
validators["ZIP code"] = new Validation.ZipCodeValidator();
validators["Letters only"] = new Validation.LettersOnlyValidator();
```



### 外部命名空间

```tsx
// declare 声明外部 d3 ts 类型
declare namespace D3 {
    export interface Selectors {
        select: {
            (selector: string): Selection;
            (element: EventTarget): Selection;
        };
    }

    export interface Event {
        x: number;
        y: number;
    }

    export interface Base extends Selectors {
        event: Event;
    }
}

declare var d3: D3.Base; // 外部引用
```





## 装饰器

1. 装饰器是一种特殊类型的声明，能够被附加到类的声明，方法，属性或参数上，可以修改类的行为。通俗的来讲装饰器就是一个方法，可以注入到类，方式，属性参数上来扩展他们的功能。
2. 装饰器有4种，
   - 类装饰器
   - 属性装饰器
   - 方法装饰
   - 参数装饰器
   - :key: 装饰器执行的顺序是属性 -> 方法 -> 参数 -> 类。



### 装饰器工厂

> 利用柯里化的概念内部返回一个函数

- 在TypeScript里，当多个装饰器应用在一个声明上时会进行如下步骤的操作：
  1. 由上至下依次对装饰器表达式求值。
  2. 求值的结果会被当作函数，由下至上依次调用

```tsx
function color(value: string) { // 这是一个装饰器工厂
    return function (target) { //  这是装饰器
        // do something with "target" and "value"...
    }
}
```

```tsx
function f() {
    console.log("f(): evaluated");
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log("f(): called");
    }
}

function g() {
    console.log("g(): evaluated");
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log("g(): called");
    }
}

class C {
    @f()
    @g()
    method() {}
}
```

```tsx
f(): evaluated
g(): evaluated
g(): called
f(): called
```





类中不同声明上的装饰器将按以下规定的顺序应用：

1. *参数装饰器*，然后依次是*方法装饰器*，*访问符装饰器*，或*属性装饰器*应用到每个实例成员。
2. *参数装饰器*，然后依次是*方法装饰器*，*访问符装饰器*，或*属性装饰器*应用到每个静态成员。
3. *参数装饰器*应用到构造函数。
4. *类装饰器*应用到类。



### 类装饰器

类装饰器应用于类构造函数，可以用来**监视，修改或替换类定义**。类装饰器表达式会在运行时当作函数被调用，类的构造函数作为其唯一的参数。

- 类装饰器表达式会在运行时当作函数被调用，类的构造函数作为其唯一的参数（其实就是类本身啦）。
- 如果类装饰器返回一个值，它会使用提供的构造函数来替换类的声明

```tsx
// 类装饰器
function classDecorator<T extends {new(...args:any[]):{}}>(constructor:T) {
    // 当前返回出去的是 Greeter(实际上就是一个 function类型的构造函数)    
    return class extends constructor {
        // 增强原来类的属性
        newProperty = "new property";
        hello = "override";
    }
}

@classDecorator
class Greeter {
    property = "property";
    hello: string;
    constructor(m: string) {
        this.hello = m;
    }
}
```

```js
console.log(new Greeter("world"));
{
  "property": "property",
  "hello": "override",
  "newProperty": "new property"
} 
// constuctor 不生效
```



- 类装饰器工厂

```tsx
interface Person {
    name: string
    age: number
}
// 利用函数柯里化解决传参问题， 向装饰器传入一些参数，也可以叫 参数注解
function enhancer(name: string) {
    return function enhancer(target: any) {
      // 这个 name 就是装饰器的元数据，外界传递进来的参数
      target.prototype.name = name
      target.prototype.age = 18
    }
}
@enhancer('小芝麻') // 在使用装饰器的时候, 为其指定元数据
class Person {
    constructor() {}
}
```





### 方法装饰器

*方法装饰器* 声明在一个方法的声明之前（紧靠着方法声明）。 它会被应用到方法的 *属性描述符* 上，**用来监视，修改或者替换方法定义**。 方法装饰器不能用在声明文件( `.d.ts`)，重载或者任何外部上下文（比如`declare`的类）中。

- 方法装饰器表达式会在运行时当作函数被调用，传入下列3个参数：

  1. 对于静态成员(static)来说是类的构造函数，对于实例成员是类的原型对象。

  2. 成员的名字。

  3. 成员的*属性描述符*(方法装饰器的主要目的)。

- 如果方法装饰器返回一个值，它会被用作方法的 属性描述符。

```tsx
class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
	
    // 方法装饰器
    @enumerable(false)
    greet() { // 实例方法
        return "Hello, " + this.greeting;
    }
}
```

```ts
function enumerable(value: boolean) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        // target === Gretter.prototype
        descriptor.enumerable = value;
    };
}
```





### 访问装饰器

首先得理解访问的概念，这个概念是ES6 Class 里面的概念

```js
class Point {
  constructor() {}
  get name() {
    console.log('getter')
    return this.name // 死循环
  }
  set name(val) {
    console.log('setter')
    this.name = val // 死循环
  }
}
```

 像上面其实无法定义正常存储属性的操作，因此可以理解 get / set 常用于属性的拦截

访问器装饰器 声明在一个访问器的声明之前。 访问器装饰器应用于访问器的 *属性描述符*并且可以用来监视，**修改或替换一个访问器的定义**

- 访问器装饰器表达式会在运行时当作函数被调用，传入下列3个参数：
  1. 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
  2. 成员的名字。
  3. 成员的属性描述符。

```tsx
class Point {
    private _x: number;
    private _y: number;
    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    @configurable(false)
    get x() { return this._x; }

    @configurable(false)
    get y() { return this._y; }
}
```

```tsx
// 定义属性是否可配置
function configurable(value: boolean) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.configurable = value;
    };
}
```



>
>
>属性装饰器 和 参数装饰器其实都是都涉及到元数据(meta data) 的概念，[掘金](https://juejin.cn/post/7086673578858397732)



### 属性装饰器

属性装饰器声明在一个属性声明之前。

- 属性装饰器表达式会在运行时当作函数被调用，传入下列2个参数：
  1. 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
  2. 成员的名字。

> 注意：*属性描述符*不会做为参数传入属性装饰器，这与TypeScript是如何初始化属性装饰器的有关。 因为目前没有办法在定义一个原型对象的成员时描述一个实例属性，并且没办法监视或修改一个属性的初始化方法。返回值也会被忽略。因此，属性描述符只能用来监视类中是否声明了某个名字的属性。





### 参数装饰器

参数装饰器表达式会在运行时当作函数被调用，传入下列3个参数：

1. 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
2. 成员的名字。
3. 参数在函数参数列表中的索引。

> 注意  参数装饰器只能用来监视一个方法的参数是否被传入。





## 协变&逆变

![img](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ad03ca63263943b09763c058a91793c2~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

参数的位置是逆变的，也就是被赋值的函数参数要是赋值的函数参数的子类型，而 string 不是 'hello' 的子类型，所以报错了。

返回值的位置是协变的，也就是赋值的函数的返回值是被赋值的函数的返回值的子类型，这里 undefined 是 void 的子类型，所以不报错。



- 型变分为逆变（contravariant）和协变（covariant）。
- 协变很容易理解，就是子类型赋值给父类型。
- 逆变主要是函数赋值的时候函数参数的性质，参数的父类型可以赋值给子类型，这是因为按照子类型来声明的参数，访问父类型的属性和方法自然没问题，依然是类型安全的。但反过来就不一定了。
- 双向协变：函数的参数无论是子类型还是父类型都可以相互地进行赋值



:key: 特例：如何理解联合类型的父子类型

比如 'a' | 'b' 对应 'a' | 'b' | 'c'，很显然 'a' | 'b' 更加具体，因为相对来说范围小了，这个跟索引类型的表现不一致，因此最后 'a' | 'b' 是 'a' | 'b' | 'c' 的子类型，因此可以进行子类型赋值给父类型的协变操作。



# TS 高级类型及类型

1. 比较简单直观的是常见的泛型类、泛型接口、泛型函数
2. 泛型变量 —— 介绍一下一些常见泛型变量代表的意思：
* T（Type）：表示一个 TypeScript 类型
* K（Key）：表示对象中的键类型
* V（Value）：表示对象中的值类型
* E（Element）：表示元素类型
3. 泛型工具（基础知识）
* typeof —— 获取一个变量的声明或对象的类型
* keyof  —— 获取对象的所有 key 值
* in        —— 遍历枚举类型
* infer    —— 获得某个推断值然后使用
* extends  —— 继承、泛型约束、条件类型与高阶类型（非常重要）
有了对上面基础的一些了解，那么其实对于一些内置的 api 也是挺好理解的，因为它们其实都是基于这些基础的东西来进行扩展的。



## :haircut: [typeof](https://mp.weixin.qq.com/s?__biz=MzI2MjcxNTQ0Nw==&mid=2247484084&idx=1&sn=da6c267d8dd3f6981d1b10cb3cf37254&chksm=ea47a3ecdd302afa38fb56060d2a3e81513b51197cdfaca15b9db1a5dd95cb2a85c06cf8652f&scene=21#wechat_redirect) 

```typescript
  // 需要注意的点是 typeof 操作的是变量或对象而不是一个类型，这个是区别于 keyof主要的地方
  interface Person111 {
    name: string,
    age: number
  }
  const sem: Person111 = { name: "semlinker", age: 30 };
  type person111 = typeof sem;
```



## :smile: [keyof](https://mp.weixin.qq.com/s?__biz=MzI2MjcxNTQ0Nw==&mid=2247484077&idx=1&sn=1215e14604232f1da0031dc3ee4f0b82&chksm=ea47a3f5dd302ae3c89633513fb8c0de72458a1915bb2a079e7961a2f4ea198afc4dc8d4c62e&scene=21#wechat_redirect)

1. 索引访问 —— 在语法上，它们看起来像属性或元素访问，但最终会被转换为类型。
   也就是比如存在一个类型 A，A里面有若干属性 a, b, c....，A[a | b]返回的是 a、b 的联合类型

```typescript
  type a = {
    name: string,
    age: number
  }
  type P3 = A['a' | 'b']; // -> string|number
```

2. keyof 实际情况中的用法

```typescript
  // 强制性要求函数参数中的 key 必须作为属性在 obj 中出现才能够正常返回
  function prop<T extends object, K extends keyof T>(obj: T, key: K) {
    return obj[key];
  }
  type Todo111 = {
    name: string,
    age: number
  }
  const todo111:Todo111 = {
    name: 'jzy',
    age: 18
  }
  console.log(prop(todo111, 'name')); //->jzy
```

3. 一种特殊的情况是当某个接口接受string 类型属性表达式作为键的时候，使用 keyof 获得的最后结果是 string | number

```typescript
interface StringIndexArray {
  [index: string]: string;
}
interface NumberIndexArray {
  [index: number]: string;
}
type K1 = keyof StringIndexArray // type K1 = string | number
type K2 = keyof NumberIndexArray // type K2 = number

  // 因为 JS 中其实只有字符串类型的索引类型，
  // Number 也会被转为 String，这在语法上是支持的。但是反过来 x:number 的时候是不成立的
```





## :key: 分布式条件类型



**当类型参数为联合类型，并且在条件类型左边直接引用该类型参数的时候，TypeScript 会把每一个元素单独传入来做类型运算，最后再合并成联合类型，这种语法叫做分布式条件类型。**

比如这样一个联合类型：

```typescript
type Union = 'a' | 'b' | 'c';
```

我们想把其中的 a 大写，就可以这样写：

```typescript
type UppercaseA<Item extends string> = 
    Item extends 'a' ?  Uppercase<Item> : Item;
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/842143798583491aae9dbec0da327da8~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

可以看到，我们类型参数 Item 约束为 string，条件类型的判断中也是判断是否是 a，但传入的是联合类型。这就是 TypeScript 对联合类型在条件类型中使用时的特殊处理：会把联合类型的每一个元素单独传入做类型计算，最后合并。



```typescript
// 判断一个类型是否是联合类型
type IsUnion<A, B = A> =
    A extends A
        ? [B] extends [A] // 如果是联合类型那么肯定是不成立的
            ? false
            : true
        : never
```

解释下上面这个函数为什么可以判断一个类型是否是联合类型：

首先回到分布式条件类型的定义：**当类型参数为联合类型，并且在条件类型左边直接引用该类型参数的时候，TypeScript 会把每一个元素单独传入来做类型运算，最后再合并成联合类型，这种语法叫做分布式条件类型。**重点在`条件类型左边` A extends B 那么 左边其实就是 A 了，因此上面的 A extends A 其实是触发这个特性使得当前的 A 是每一个单独元素，那么下面的 [B] extends [A] 其实就是为了取消这个特性的操作。因此最后判断整个联合类型 extends 里面的单个类型取假值，就是 true 了。



- 判断两个元素是否相等

```tsx
// [] 是为了阻止类型分配
type IsEqual<X, Y> =
  [X] extends [Y]
    ? [Y] extends [X]
      ? true
      : false
    : false
```





## :star: extends 关键字

* 语法 T extends K
>这里的 extends 不是类、接口的继承，而是对于类型的判断和约束，意思是判断类型 T 能否分配给类型 K
```typescript
// 判断 T 是否可以赋值给 U，可以的话返回 T，否则返回 never
type Exclude<T, U> = T extends U ? T : never

type s1 = string|number
type s2 = string
// (string | number) extends string
type s3 = s1 extends s2 ? string : number // 结果是 number 
// string extends (string | number)
type s4 = s2 extends s1 ? string : number // 结果是 string
```
* 通过上面 s1, s2, s3, s4 的测试我们可以得到一个基本的结论：extends 可以理解为是一个转型的过程，其实跟面向对象中父的引用可以被赋值给子的实例 Person p1 = new Student()，也是多态的概念那么在 typescript 里面其实也是类似，s1 可以理解在是在 s2 上联合类型的结果，是 s2 的一个儿子，所以 s2 可以被赋值为 s1



>上面说到的分布式条件类型：当 extends 前面的是**泛型（且泛型内为联合类型）**的时候，会满足一种分别计算取联合


```typescript
  type P<T> = T extends 'x' ? string : number;
  type A3 = P<'x' | 'y'>  // A3的类型是 string | number
  // 执行过程如下：
  // 先判断 'x' extends 'x' ? string : number => string
  // 再判断 'y' extends 'x' ? string : number => number
  // 最后联合两个判断的结果 string | number 
```
* 阻止类型分配
```typescript
  type P<T> = [T] extends ['x'] ? string : number;
  type A1 = P<'x' | 'y'> // number
  type A2 = P<never> // string
```



## :key: 类型映射（in）

遍历指定接口的 key 或者是遍历联合类型

```typescript
interface Person {
    name: string
    age: number
    gender: number
}

type ReadOnly<T> = {
  readonly [p in keyof T]: T[p]
}

type h1 = ReadonlyValue<Person>
type h2 = string | number 
type h3 = 'name' | 'gender'
type h4 = {
    [p in h2]: p  // -> [x: string]: string, [x: number]: number
}
type h4 = {
    [p in h3]: p  // -> name: 'name', gender: 'gender'
}
```



## :wink: 类型谓词（is）

* 语法： parameterName is Type
>paramterName 必须是来自于 当前函数签名里的一个参数名，判断 parameterName 是否是 type 类型（可能暂时难以理解？hah 没关系往下走呗）
```typescript
class Bird {
  layEggs() {}
  fly() {} 
}

interface Fish {
  swim() {}
  layEggs() {}
}

// 有这么一种应用场景，调用交叉类型中不同类型的不同方法
function start(pet: Bird | Fish) {
    // 调用 layEggs 没问题，因为 Bird 或者 Fish 都有 layEggs 方法
    pet.layEggs();
    if ((pet as Bird).fly) {
        (pet as Bird).fly();
    } else if ((pet as Fish).swim) {
        (pet as Fish).swim();
    }
}
```

* 虽然说可以通过封装函数来简化 if ... else 里面转型的逻辑判断，但是最后判断里面还是得用 as 去做显示转换，使用起来多有不便，于是 is 就可以派上用场了。
```typescript
function isBird(bird: Bird | Fish): bird is Bird {
    return !!(bird as Bird).fly
}
function start(pet: Bird | Fish) {
    // 调用 layEggs 没问题，因为 Bird 或者 Fish 都有 layEggs 方法
    pet.layEggs();
    if (isBird(pet)) {
        pet.fly();
    } else {
        pet.swim();
    }
};
```

通过 `x is type` 来指定x的类型 相当于调用下面的函数 如果返回为`true`  那么 x 类型就是number

```ts
function isNumber(x: any): x is number {
  return typeof x === "number";
}

function isString(x: any): x is string {
  return typeof x === "string";
}
```





### 待推断类型（infer）

* 可以用 infer P 来标记一个泛型，表示这个泛型是一个待推断的类型，并且可以直接使用
```typescript
// 判断 T 是否能赋值给 (param: infer P)=> any，并且将参数推断为泛型 P
type ParamType<T> = T extends (param: infer P) => any ? P : T
type FunctionType = (value: number) => boolean
type Param = ParamType<FunctionType>

// 判断 T 是否能赋值给 (param: any) => infer U，并且将返回值类型推断为泛型 U
type ReturnValueType<T> = T extends (param: infer P) => infer U ? U : T
type Return = ReturnValueType<FunctionType> // boolean
type OtherReturn = ReturnValueType<number> // number

```



### [原始类型保护（typeof）](https://cloud.tencent.com/developer/article/1597328)

* 语法：typeof v === "typename" 或者 typeof v !== "typename"
* 用来获取一个变量或对象的类型
>①用来判断数据的类型是否是某个原始类型（number、string、boolean、symbol）并进行类型保护
>②“typename”必须是 number, string, boolean, symbol，但是 typescript 不会阻止与其他类型进行比较，但是不会把这些表达式识别为类型保护 
>第二个句子貌似有点难理解喔？但仔细想一想类型保护这个概念，是不是可以理解为是 typescript 自动帮我们进行类型推断
```typescript
// 具备类型保护
function print(value: number | string ){
  if(typeof value === 'string') {}
  else {}
}

// 不具备类型保护 -- 仅仅会得到对应的类型
const obj = {
    name: 'hello world',
    age: 18
}
type o1 = typeof obj
```

* 其实也就是说使用了 typeof 进行类型判断后，typescript 会将变量缩减为具体的类型



### 类型保护（instanceof）

* 区别于上面的 typeof，instanceof 类型保护通过构造函数来细化类型
```typescript
function start(pet: Bird | Fish) {
    // 调用 layEggs 没问题，因为 Bird 或者 Fish 都有 layEggs 方法
    pet.layEggs();
    if (pet instanceof Bird) {
        pet.fly();
    } else {
        pet.swim();
    }
}
```
>需要注意的是 instanceof 右侧要求的是一个构造函数 
>具体细化为：构造函数 prototype 属性的类型 和 构造签名返回的类型集合。感觉说白就是接受一个函数或类，返回他们的原型对象



### 索引类型查询操作符（keyof）

* 语法: keyof T
>对于任何类型 T， keyof 的结果为 T 上已知**公共属性名**的联合
```typescript
interface Person {
  name: string,
  age: number
}
type PersonProps = keyof Person // 'name' | 'age'

class Animal {
    type: string;
    weight: number;
    private speed: number;
}
type AnimalProps = keyof Animal; // "type" | "weight"
```
* 常常配合 extends 使用
```typescript
const person = {
    name: 'Jack',
    age: 20
}

function getPersonValue<T extends keyof typeof person>(fieldName: keyof typeof person) {
    return person[fieldName]
}

const nameValue = getPersonValue('name')
const ageValue = getPersonValue('age')

// 会报错：Argument of type '"gender"' is not assignable to parameter of type '"name" | "age"'
// getPersonValue('gender')
```



### 索引访问操作符（T[k]）

* 语法：T[k]
>类似于 js 中使用对象索引的方式，只不过 js 中是返回对象属性的值，而在 ts 中返回的是 T对应属性 P 的类型 
```typescript
interface Person {
    name: string
    age: number
    weight: number | string
    gender: 'man' | 'women'
}

type NameType = Person['name']  // string
type WeightType = Person['weight']  // string | number
type GenderType = Person['gender']  // "man" | "women"
```



## :key: 内置类型



### 只读类型(Readonly<T>)

* 定义
```typescript
type Readonly<T> = {
  readonly [ p in keyof T]: T[p]
}
```
>用于将 T 类型的所有属性设置为只读状态
```typescript
interface Person2 {
    name: string
    age: number
}
const student: Readonly<Person2> = {// 当前的所有属性都不允许修改、删除
    name: 'xxx',
    age: 18
}
```
>readonlu 只读，被 readonlu 标记的属性只能在声明时或类的构造函数中赋值，之后将不可以修改或者删除

### 只读数组（ReadonlyArray<T>）

```typescript
interface ReadonlyArray2<T> {
        /** Iterator of values in the array. */
        [Symbol.iterator](): IterableIterator<T>;

        /**
         * Returns an iterable of key, value pairs for every entry in the array
         */
        entries(): IterableIterator<[number, T]>;
    
        /**
         * Returns an iterable of keys in the array
         */
        keys(): IterableIterator<number>;
    
        /**
         * Returns an iterable of values in the array
         */
        values(): IterableIterator<T>;
}

interface P3 {
    name: string
}
const p4: ReadonlyArray<P3> = [{ name: 'hello' }] // 不允许 push、pop之类对数组长度发生改变的操作
p4[0].name = 'world'  // 内部如果是引用类型的话仍可以修改
```



### 可选类型（Partial<T>）

>用于将  T 类型的所有属性设置为可选属性，首先通过 keyof T, 取出类型 T 的所有属性，然后通过 in 操作符进行遍历，最后在属性后加上 ？，将属性变为可选属性
```typescript
type Partial<T> = {
  [p in keyof T]?: T[p]
}

interface L1 {  
    name: string
    age: number
}
const l1: Partial<L1> = {} // { name? string, age?: number }
```



### 必选类型（Required<T>）

>用于将 T 类型的所有属性设置为必选状态，首先通过 keyof T， 取出类型 T 的所有顺序搞，然后通过 in 操作符进行遍历，最后在属性后的 ？ 前加上 -，将属性变为必选属性
```typescript
type Required<T> = {
  [p in keyof T]-?: T[p]
}

interface R1 {
    name?: string
    age?: number
}
const r1: R1 = {}
const r2: Required<R1> = {
    name: 'name',
    age: 18
}
```



### 提取属性（Pick<T, U>）

* 定义( T 一般是一个接口或者 type)
```typescript
type Pick<T, K extends keyof T> = {
  [p in K]: T[P]
}
```
>从 T 类型中提取部分属性，作为新的返回类型。
```typescript
interface Goods { type: string goodsName: string price: number } // 作为网络请求参数，只需要 goodsName 和 price 就可以 
type RequestGoodsParams = Pick<Goods, 'goodsName' | 'price'> // 返回类型：
const params: RequestGoodsParams = { goodsName: '', price: 10 }
```



### 排除属性（Omit<T, U>）

>与 Pick 作用相反，用于从 T 类型中，排除部分属性
* 定义
```typescript
type Omit<T, k extends keyof T> = Pick<T, Exclude<keyof T, k>>
```

```typescript
type Square = Omit<Rectangular, 'height' | 'width'>
const temp: Square = { length: 5 }
```



### 摘取类型（Extract<T, U>）

>提取 T 中可以赋值给 U 的类型
* 定义
```typescript
type Extract<T, U> = T extends U ? T : never
```


### 排除类型（Exclude<T, U>）

>从 T 中剔除可以赋值给 U 的类型
* 定义
```typescript
type Exclude<T, U> = T extends U ? never : T
```


### 属性映射（Record<K, T>）

>接受两个泛型， K 必须是可以赋值给 string | number | symbol 的类型，通过 in 操作符对 K 进行遍历，每一个属性的类型都必须是 T 类型
* 定义
```typescript
type Record<K extends string | number | symbol, T> = {
    [P in K]: T;
}
```
* 可以理解为是把所有的 key 的类型都变成是 T 的类型
```typescript
interface Person {
    name: string
    age: number
}

const personList = [
    { name: 'Jack', age: 26 },
    { name: 'Lucy', age: 22 },
    { name: 'Rose', age: 18 },
]

const personMap: Record<string, Person> = {}
// [index: string]: { name: string, age: number }
```
* 有一个常用的就是当一个函数参数不知道具体类型时
```typescript
function doSomething(obj: Record<string, any>) { }
```



## :star2: 在 TS 中如何减少重复代码

* 第一种方式是使用 extends 继承的方式（通常出现在某个接口包含一个接口的所有属性并且拓展了自己的一些属性）
* 第二种方式是使用 pick 的方式（从某个接口中挑出和当前有重复的属性避免重复定义）
* 第三种方式是使用 Partial的方式（常用于我们需要将一个接口的部分或者全部属性编程可选选项）



## :key: tsconfig.json 配置

![图片](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABE0AAAGkCAYAAADE7NvMAAAgAElEQVR4AezBD3zXdb3w/dcXd5QUDSsYc8BGImKiglZT++NvarqBCnU7s3xk5iaaB1Jhw45d2YM82dEtxPAk4pam17nuQr3DFJmmbV0pOv8EmQYlNX4i/9SK0gw78nndbD8mINoJTR34fj4zNyKEEEIIIYQQQgghbKUPIYQQQgghhBBCCGEbfQghhBBCCCGEEEII2+hDCCGEEEIIIYQQQthGH0IIIYQQQgghhBDCNvoQQgghhBBCCCGEELbRhxBCCCGEEEIIIYSwjT6EEEIIIYQQQgghhG30IYQQQgghhBBCCCFsow8hhBBCCCGEEEIIYRt9CCGEEEIIIYQQQgjb6EMIIYQQQgghhBBC2EYfQgghhBBCCCGEEMI2+hBCCCGEEEIIIYQQttGHEEIIIYQQQgghhLCNPoQQQgghhBBCCCGEbfQhhBBCCCGEEEIIIWyjDyGEEEIIIYQQQghhG30IIYQQQgghhBBCCNvoQwghhBBCCCGEEELYRh9CCCGEEEIIIYQQwjb6EEIIIYQQQgghhBC20YcQQgghhBBCCCGEsI0+hBBCCCGEEEIIIYRtFLFTy9NSXc7SC6Uxx6vI01JdztILpTFHCCGEEEIIvVoSblz8BLc89jseXfssT/7peUJ4I4b235P93/tuxh9QzrkVBxJC2FoRIYQQQgghhF7v6efXc9pN97DXbrtRc+Bwph9dwdC9+hHCG/Hkn5/nid+v485leQ6/Zh7f//QxlPffkxBCQREhhBBCCCGEXm1DktPm3sMpo4bzyZH70kMJ4Q0Zsmc/huzZj6PLB/Pwqqf55H/dxf1nT6Bv0S6EEKAPvUaeluqMLMvIsoysoZ2CPC3VGQ3teVqqM7IsI8uqacmzhXYasowsy8iyjOqWPFvL01KdkWUZWZZR3ZLn1eVpqc7Isowsy8ga2gkhhBBCCOHtNuv+xxn87n5MGPl+RERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERA7bZwDjR5bz9bZHeHvlaanOaGjnTZKnpTqjoZ0Q/kd96BXytFSXUzeqDRVdTvNjlVS35OnRVHkOzBaVtvpW6s5pIU9Be8N8xikqttXTWncOLXle1lR5DswWFZc3Q105De28Qp6W6nLqRrWhostpfqyS6pY8IYQQQgghvJ3m/ybP8fsORUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFB4bj3lzFvSSchhII+9AbtV1HXWk9bY46CMo49uYrWpZ30qGqeTW0Z3XKTmqlqXUonBbnGRnJskhtHPVurap5NbRkFZbVcWA9N89vZSvtV1LXW09aYo6CMY0+uonVpJyGEEEIIIbydHlr5DIfuM5AEJCABCUhAAhKQgAQkIAEJSEACEpCABCQgAQlIQAISkIAEJCABCUhAAhKQgAQkIAEJSEACEpCABCQgAQlIQAISkIAEJCABCUhAAhKQgAQkIAEJSEACEpCABCQgAQlIQAISkIAEJCABCUhAAhKQgAQkIAEJSEACEpCABCQgAQlIQAISkIAEJCABCUhAAhKQgAQkIAEJSEACEpCABCQgAQlIQAISkIAEJCABCUhAAhKQgAQkIAEJSEACEpCABCQgAQlIQAISkIAEJCABCUhAAhKQgAS8/z3vZukz6wghFPSh12iiMsvIsowsyyiva4XHfkueglH7lvFa2hsysiwjyzKyrJImWlnayctG7VvGloaNrOLVNVGZZWRZRpZllNe1wmO/JU8IIYQQQghvnz+/+CJ77rorCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKSi+Sp6U6I8sysiyjuiXPZnlaqjOyLCPLMrKsmpY8W8jTUp2RZRlZlpFl1bTkeQ15WqozsiwjyzKyhnY2a6chy8iyjCzLqG7JU5CnpTqjoT1PS3VGlmVkWTUtecJOpg+9Rj1tioqKigtqKeN/0N5AZVM9bYqKtlHP39e5tJWqkcPYVj1tioqKigtqKSOEEEIIIYS3l4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiopKb9FUeQ7MFhWXN0NdOQ3tbJSnpbqculFtqKjYNoq68mpa8myUp6W6nLpRbaio2DaKuvJqWvK8Qp6W6nLqRrWhostpfqyS6pY8Xdob5jNOUbGtnta6c2jJ87KmynNgtqi01bdSd04LecLOpA+9QW4c9TRxWUueHvmWahra2W75lstoYmtNlQ20s0l7A5VNVZx8bBlbyY2jniYua8nTI99STUM7IYQQQgghvO0UFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUlF6jqnk2tWUUlNVyYT00zW+H9quoa62nrTHHy3KNtNW3cvPdeWi/irrWetoac7ws10hbfSs3351nK+1XUddaT1tjjoIyjj25italnXTJNTaSY5PcOOrZWlXzbGrL6Jab1ExV61I6CTuTInqFHI220ZCVk9XRrap5OQty/M9yjbTVZ1RmTXSpam6mnla2VN82jvlZRiUF9W1SW8Yr5Gi0jYasnKyOblXNy1mQI4QQQgghhLedEsI7yqh9y9jSsJFVsJSCqpEMY1utSzthX6BqJMPYVuvSTmAYW2uiMmtiK1UnkydHZ0NGZRNbqe8Eyug2at8yws6tiF4jR6PSyCuVUbtAtlJWywJ5Wa5RbGSz2loKyqhdIN2URl6pjNoFslmORqWREEIIIYQQeheREN7JOpe2UjVyNt1al9IJlLG1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26KXyuDDtR0xVSll99eulFJKKaWUsktLPHFHzHD5JZ1mvfM8b/1abNMzc4V3HEHC9z/9CnO+FiMnv8lhIRh8wge85bo3+OL/OlvHpy917FBbdHj1aSf5/Kx5zjtpnuaFU83+2ERDjpjh8ks6zXrned76tdimZ+YK7ziCxFaJrRLi4YIER8xw+UxOn3Wut37NVs1r5rr8kk6z3vlxCYktury9e7a3nnSubZoXTjX7YxMNDvHUaF58hmbEeK11SzS/3MRzO7VNWMq+nUope4YmWyillFJKKaXskjbPa6w++RfK02/01fsYNDVKKWWbdqWUUkoppZRdWqKUUsqzoF0ppZRSSilllxZRSinlmdeulFJKKaWUsktLlFJKeRa0K6WUUkoppezSEqWUUp4F7UoppZRSSim7tCRKKaU889qVUkoppZRSdmmJUkopz4J2pZRSSimllF1alFJKeTa0K6WUUkoppeyyWoP21tx7t9agvZWnT1ujlFIepl0ppZRSSilll/Xr542x98+/7xfPe6ny9Pmd1v9jn6FKKWV77UoppZRSSim7rLbhR/vd/+/v/ed+L1WePkN/sUIzvEcppWyvyRZKKaWUUkopu6Z773bP58dafcRV7vntFyhPvefvfa8XXnektglL2bdTKaVs02QLpZRSSimllF1WfrLKvdec5vYR73T74Ne7t/25ys7bZ9CvDP/FMs//wYc14z6i6RyvlFK212QLpZRSSimllF3bPXfJivdp/fAK7rlLeQq0760ZMV4z7iOa549SSikP1WQLpZRSSimllFJKKeVB2pRSSimllFJKKaWUh2lTSimllFJKKaWUUh6mXSmllLLHiLTuwWbJvZJfK3uupnmOpmnHIE3bb6FNKaWUUsr2mmyhlFJK2c0lv9ba/HO0lPJwjba239G07a2UUkopZZsmWyillFJ2Y63WL6T1C6U8lqZtL21tz1VKKaWU0q9dKaWUshtLfiWt/1TK45HW3Vqeo63tvymllFJKaVdKKaXstlo2b76LRCmPVzb/h6bZS9MMUkoppZQ9W7tSSillN9Xa/F9ks1KemEh+qWl+VymllFL2bO1KKaWU3davEaU8UcmvlVJKKaW0K6WUUnZTaf2KRClPVDbfwyCllFJK2cO1K6WUUnZTya+U8uRsVkoppZTSrpRSStltRSmllFJKKU9Wu1JKKWW3FaWU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)



#### complieOnSave

—— 设置保存文件的时候自动编译，但需要编译器支持。 

```plain
{
	// ...
  "compileOnSave": false,
}
```

#### compilerOptions

—— 配置编译选项

```json
{
  // 常用的一些配置选项，详细信息需查看官网
  "compilerOptions": {  
    "incremental": true, // TS编译器在第一次编译之后会生成一个存储编译信息的文件，第二次编译会在第一次的基础上进行增量编译，可以提高编译的速度
    "tsBuildInfoFile": "./buildFile", // 增量编译文件的存储位置
    "diagnostics": true, // 打印诊断信息 
    "target": "ES5", // 目标语言的版本
    "module": "CommonJS", // 生成代码的模板标准
    "outFile": "./app.js", // 将多个相互依赖的文件生成一个文件，可以用在AMD模块中，即开启时应设置"module": "AMD",
    "lib": ["DOM", "ES2015", "ScriptHost", "ES2019.Array"], // TS需要引用的库，即声明文件，es5 默认引用dom、es5、scripthost,如需要使用es的高级版本特性，通常都需要配置，如es8的数组新特性需要引入"ES2019.Array",
    "allowJS": true, // 允许编译器编译JS，JSX文件
    "checkJs": true, // 允许在JS文件中报错，通常与allowJS一起使用
    "outDir": "./dist", // 指定输出目录
    "rootDir": "./", // 指定输出文件目录(用于输出)，用于控制输出目录结构
    "declaration": true, // 生成声明文件，开启后会自动生成声明文件
    "declarationDir": "./file", // 指定生成声明文件存放目录
    "emitDeclarationOnly": true, // 只生成声明文件，而不会生成js文件
    "sourceMap": true, // 生成目标文件的sourceMap文件
    "inlineSourceMap": true, // 生成目标文件的inline SourceMap，inline SourceMap会包含在生成的js文件中
    "declarationMap": true, // 为声明文件生成sourceMap
    "typeRoots": [], // 声明文件目录，默认时node_modules/@types
    "types": [], // 加载的声明文件包
    "removeComments":true, // 删除注释 
    "noEmit": true, // 不输出文件,即编译后不会生成任何js文件
    "noEmitOnError": true, // 发送错误时不输出任何文件
    "noEmitHelpers": true, // 不生成helper函数，减小体积，需要额外安装，常配合importHelpers一起使用
    "importHelpers": true, // 通过tslib引入helper函数，文件必须是模块
    "downlevelIteration": true, // 降级遍历器实现，如果目标源是es3/5，那么遍历器会有降级的实现
    "strict": true, // 开启所有严格的类型检查
    "alwaysStrict": true, // 在代码中注入'use strict'
    "noImplicitAny": true, // 不允许隐式的any类型
    "strictNullChecks": true, // 不允许把null、undefined赋值给其他类型的变量
    "strictFunctionTypes": true, // 不允许函数参数双向协变
    "strictPropertyInitialization": true, // 类的实例属性必须初始化
    "strictBindCallApply": true, // 严格的bind/call/apply检查
    "noImplicitThis": true, // 不允许this有隐式的any类型
    "noUnusedLocals": true, // 检查只声明、未使用的局部变量(只提示不报错)
    "noUnusedParameters": true, // 检查未使用的函数参数(只提示不报错)
    "noFallthroughCasesInSwitch": true, // 防止switch语句贯穿(即如果没有break语句后面不会执行)
    "noImplicitReturns": true, //每个分支都会有返回值
    "esModuleInterop": true, // 允许export=导出，由import from 导入
    "allowUmdGlobalAccess": true, // 允许在模块中全局变量的方式访问umd模块
    "moduleResolution": "node", // 模块解析策略，ts默认用node的解析策略，即相对的方式导入
    "baseUrl": "./", // 解析非相对模块的基地址，默认是当前目录
    "paths": { // 路径映射，相对于baseUrl
      // 如使用jq时不想使用默认版本，而需要手动指定版本，可进行如下配置
      "jquery": ["node_modules/jquery/dist/jquery.min.js"]
    },
    "rootDirs": ["src","out"], // 将多个目录放在一个虚拟目录下，用于运行时，即编译后引入文件的位置可能发生变化，这也设置可以虚拟src和out在同一个目录下，不用再去改变路径也不会报错
    "listEmittedFiles": true, // 打印输出文件
    "listFiles": true// 打印编译的文件(包括引用的声明文件)
  }
}
```

#### extends

—— 引入其他配置文件，继承配置，通常用在服务器和客户端都在一个项目里面，抽取出公共的配置信息然后继承后再个性化配置

```plain
{
	// ...
  // 把基础配置抽离成tsconfig.base.json文件，然后引入
	"extends": "./tsconfig.base.json"
}
```

#### files

—— 指定需要编译的单个文件列表（只能是文件），通常适用于文件数量可以容易枚举的情况，文件数量多的时候还是使用 include用 glob 通配符去匹配要有效地多。

```plain
{
	// ...
  "files": [
    // 指定编译文件是src目录下的leo.ts文件
    "scr/leo.ts"
  ]
}
```

#### include

—— 指定编译需要编译的文件或目录

```plain
{
	// ...
  "include": [
    // "scr" // 会编译src目录下的所有文件，包括子目录
    // "scr/*" // 只会编译scr一级目录下的文件
    "scr/*/*" // 只会编译scr二级目录下的文件
  ]
}
```


#### exclude

—— 指定编译器需要排除的文件或文件夹（默认排除 `node_modules` 文件夹下文件。 ），基于include 的列表进行排除，通常作为 include 的补充

```plain
{
	// ...
  "exclude": [
    "src/lib" // 排除src目录下的lib文件夹下的文件不会编译
  ]
}
```

* include 和 exclude 都使用 glob 通配符，glob通配符是 shell 使用路径匹配符，类似于正则表达式，但是与正则又有些不同。
**—— ***：匹配一个路径部分中0个或多个字符，注意不匹配以.开始的路径，如文件.a。

**—— ?**：匹配一个字符。

**—— […]**：匹配一系列字符，如[abc]匹配字符a, b, c，在[^…]和[!…]表示匹配不在列表中的字符，如[^abc]匹配除了a, b, c以外的字符。

**—— ****：匹配0个或多个子文件夹。

**—— {a,b}**：匹配a或则b，a和b也是通配符，可以由其他通配符组成。

**—— !**：排除文件，如!a.js表示排除文件a.js。


#### references

—— 指定工程引用依赖，在项目开发中，有时候我们为了方便将前端项目和后端`node`项目放在同一个目录下开发，两个项目依赖同一个配置文件和通用文件，但我们希望前后端项目进行灵活的分别打包。

```plain
{
	// ...
  "references": [ // 指定依赖的工程
     {"path": "./common"}
  ]
}
```

#### typeAcquisition

—— 设置自动引入库类型定义文件(.d.ts)相关，包含 3 个子属性：

* `enable` : 布尔类型，是否开启自动引入库类型定义文件(.d.ts)，默认为 false；
* `include` : 数组类型，允许自动引入的库名，如：[“jquery”, “lodash”]；
* `exculde` : 数组类型，排除的库名。 
```plain
{
	// ...
  "typeAcquisition": {
    "enable": false,
    "exclude": ["jquery"],
    "include": ["jest"]
  }
}
```





## 参考资料

typescript 高级类型及用法：[https://github.com/beichensky/Blog/issues/12](https://github.com/beichensky/Blog/issues/12)

extends关键字：[https://cloud.tencent.com/developer/article/1884330](https://cloud.tencent.com/developer/article/1884330)

Object, object, {} 类型之间的区别：[https://cloud.tencent.com/developer/article/1610691](https://cloud.tencent.com/developer/article/1610691)

​	
