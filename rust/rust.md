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

:warning: 除此之外还需要安装一个编译器，在 ubuntu 中可以通过安装 `build-essential`，安装的过程会附带安装 `G++, dpkg-dev, GCC and make....`

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

> 🔐 存在一个隐藏变量的概念 —— 可同时使用 `let` 声明同名变量，后面的覆盖前面的声明。当前 变量仍然不可二次修改。

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

#### 标量

> 标量类型代表一个单独的值，Rust 有四种基本的标量类型：整型、浮点型、布尔类型和字符窜类型





#### 复合
