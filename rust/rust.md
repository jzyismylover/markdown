学习资源

- [The Tao of Rust](https://github.com/ZhangHanDong/tao-of-rust-codes/blob/master/tao_of_rust_english.md)
- [Translation of the official The Rust Programming Language book](https://github.com/KaiserY/rust-book-chinese)
- [Translation of the Rust By Example](https://github.com/rust-lang-cn/rust-by-example-cn)
- [RustPrimer](https://github.com/rustcc/RustPrimer)
- [Chinese Rust Community](https://github.com/RustChina/rust-china.org)
- [The book in Traditional Chinese](http://askeing.github.io/rust-book/)
- [Translation of The Little Book of Rust Macros](https://github.com/DaseinPhaos/tlborm-chinese)
- [The Rust Course](https://github.com/sunface/rust-course)



## 安装

> 以下为在 linux、macos 安装 rust 通用的方法 —— rustup(一个管理 Rust 版本和相关工具的命令行工具。)

```bash
$ sudo curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

🔐 实际执行后会经过一系列的选项操作并最后在 `.bashrc` 里面创建 `. "$HOME/.cargo/env"`（暴露在环境变量）。如果使用的不是 `bash` 作为默认终端的话可以将当前配置复制到对应终端的配置环境中，比如 `.zshrc`

```bash
$ rustc -V # 检查是否安装成功
rustc 1.70.0 (90c541806 2023-05-31)
```

:warning: 除此之外还需要安装一个链接器( `rustc` 依赖 gcc、glibc )，在 ubuntu 中可以通过安装 `build-essential`，安装的过程会附带安装 `G++, dpkg-dev, GCC and make....`

```bash
$ sudo apt update
$ sudo apt install build-essential
```

- 查看本地文档

```bash
$ rustup doc
```

> `cargo` 可帮助快速初始化 `rust` 项目，有别于将构建结果放在与源码相同的目录，Cargo 会将其放到 `target∕debug` 目录

- cargo new 创建项目。
- cargo build 构建项目。
- cargo run 一步构建并运行项目。
- cargo check 在不生成二进制文件的情况下构建项目来检查错误



🔐 完成以上环境的安装后，就要配置 IDE (vscode)  编程环境了，主要是安装相关插件

- `rust-analyzer`：rust 代码补全以及格式化
- `even better toml`：支持 `.toml` 文件完整特性



🔐 `rustrc`、`rustup`、`cargo` 概念区分

- `rustrc`：编译器，编译项目代码
- `rustup`：工具链管理，用于安装 `rustrc` 版本以及常用组件
- `cargo`：包管理工具



## 编译过程

![](/home/jzy/Documents/markdown/rust/rust.assets/rust-complie-process.png)



## 常见编程概念

> rust 变量定义、基础语法，包括数据结构.....

### 变量

- 定义一个不可变变量（不能二次赋值）

```rust
let x = 5
```

- 定义可变变量

```rust
let mut x = 5
```

> 🔐 存在一个隐藏变量的概念 —— 可同时使用 `let` 声明同名变量，后面的覆盖前面的声明。当前变量仍然不可二次修改。

`隐藏变量` 概念和 `mut` 的区别

- 前者每次都要加上 `let` 定义
- 前者定义同名变量时类型可不一致（实际上是创建了一个新的变量）

### 常量

>  常量与变量的区别

- 不允许对常量使用 `mut`
- 声明常量使用 `const` 关键字
- 必须注明值的类型
- 只能被设置为常量表达式，而不可以是其他任何只能在 `运行时计算出的值`

```rust 
const THREE_HOUR_IN_SECONDS: u32 = 60 * 60 * 3
```

🔐 Rust 对常量的命名约定是在单词之间使用全`大写加下划线` 



### 数据类型

`rust` 是 **静态类型** 语言，在编译时就需要知道所有变量的类型



#### 标量

`标量类型`代表一个单独的值，Rust 有四种基本的标量类型：整型、浮点型、布尔类型和字符类型

##### 整型

> 一个没有小数部分的数字

🔐 表格：rust 中的整型类型

| 长度    | 有符号  | 无符号  |
| ------- | ------- | ------- |
| 8-bit   | `i8`    | `u8`    |
| 16-bit  | `i16`   | `u16`   |
| 32-bit  | `i32`   | `u32`   |
| 64-bit  | `i64`   | `u64`   |
| 128-bit | `i128`  | `u128`  |
| arch    | `isize` | `usize` |

对应 `bit位` 的变体都可以设置为有符号和无符号。

- 对于 `有符号`变体来说，存储范围 

$$
-(2^{n-1}) 到 2^{n - 1} - 1
$$

- 对于 `无符号` 变体来说，存储范围

$$
0 到 2^{n} - 1
$$

- `isize` & `usize` 类型依赖运行程序的计算架构：64位 架构上时 64位，32位架构上为 32 位
- rust 数字类型默认是 `i32`



🔐 表格：rust 中的整型字面值

| 数字字面值                    | 例子          |
| ----------------------------- | ------------- |
| Decimal (十进制)              | `98_222`      |
| Hex (十六进制)                | `0xff`        |
| Octal (八进制)                | `0o77`        |
| Binary (二进制)               | `0b1111_0000` |
| Byte (单字节字符)(仅限于`u8`) | `b'A'`        |

- `98_222` 等价于 `98222` ，`_` 作为分隔符号方便读数

##### 浮点型

> rust 浮点分为 单精度浮点(`f32`) 和 双精度浮点 (`f64`)

```rust
fn main() {
    let x = 2.0; // f64(默认)
    let y: f32 = 3.0; // f32
}
```

##### 布尔类型

> rust 布尔类型有两个可能的值 `true` & `false`

```rust
fn main() {
    let t = true;
    let f:bool = false;
}
```

##### 字符类型

> rust 字符类型被定义为 `char`，代表原生字母类型

🔐 需要注意的是，使用`单引号`声明 `char` 字面量；使用 `双引号`声明字符串的字面量



#### 复合

复合类型将多个值组合成一个类型，包括 `tuple` 和 `array`

##### 元组

- 长度不可变

- 定义 & 访问

  ```rust
  fn main() {
    let tup:(i32, f64, bool, char) = (10, 0.5, true, 'a');
    println!(
      "tup.0:{}, tup.1:{}, tup.2:{}, tup.3:{}",
      tup.0, tup.1, tup.2, tup.3
    )
  }
  ```

- 解构取值

  ```rust
  fn main() {
    let tup:(i32, f64, bool, char) = (10, 0.5, true, 'a');
    let (x, y, q, z) = tup;
  }
  ```

##### 数组

区别于 `元组`，数组中每个元素类型必须相同；且在 `rust` 中，数组的长度是固定的

- 初始化数组

  ```rust
  let array: [i32; 5] = [1, 2, 3, 4, 5]; // 数组长度为5,且所有值类型均为i32
  let array = [3; 5] // 数组长度为5,且所有值均为3
  ```

- 通过 `array[index]` 的形式访问值



#### 函数

函数定义与 `js` 相差不多，同样是 `()` 包裹参数、`{}` 包裹函数体，但以下几点需要注意

- 函数命名—— 全部采用小写，存在多单词时使用` _` 分隔

- 函数参数全部需要注明类型

- 函数返回基于表达式，表达式不需要在末尾加上 `;`

  ```rust
  fn main() {
      let x = plus_one(5);
      println!("The value of x is: {x}");
  }
  
  fn plus_one(x: i32) -> i32 {
      x + 1; // 报错；因为这是一个语句，语句并没有返回值
      x + 1 // 正确；代表这是一个表达式，表达式返回计算值
  }
  ```



#### 循环

> `rust` 中有三种循环：`loop`、`while`、`for`，相对来说比较常用的时后两者

##### loop

- 可以通过 `break` 返回循环值

- 可定义标签，在多层 `loop` 循环嵌套情景下终止对应标签循环

  ```rust
  fn for_loop() {
      let mut count = 0;
      'counting_up: loop {
          let mut remaining = 10;
  		// 嵌套 loop
          loop {
              if remaining == 9 {
                  break;
              }
              if count == 2 {
                  break 'counting_up;
              }
              remaining -= 1;
          }
  
          count += 1;
      }
  }
  ```

##### while

与 `js ` 相差不多

##### for

这里的 `for ` 指的是 `for...in` 循环，也是使用频率最高且不容易出错的循环
