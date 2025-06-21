> 其实刚开始接触 pnpm 的时候需要考虑 pnpm 和 npm、yarn 有什么不一样？为什么要转向使用 pnpm？

pnpm 总体具备三大优势

- 节省磁盘空间
- 提升安装速度
- 保证项目只能访问项目直接依赖包

:information_source: 从节省磁盘空间来说，对于不同项目安装相同的包不再是像从前一样每次都重新安装到 node_modules 中，而是在第一次下载的时候就缓存到本地，下次直接通过硬链接的方式链接过去。

:information_source: 从提升安装速度来说，相对于传统包需要顺次同步经历依赖解析（所有包解析完才下载） => 依赖下载 => 写入 node_modules，pnpm 每解析完一个包就判断缓存是否存在，存在则直接链接不存在再从网络源 fetch。
​																					传统包下载机制

:information_source: 更加安全，传统的方式是“flatten package”，即默认将当前包以及依赖全部平铺到 node_modules，这也是当前 npm / yarn 的工作方式，这种方式的问题在于没有直接写在 `package.json`  `dependences` 里面的依赖包也能直接被访问。存在这么一个场景：项目中依赖了一个 `a` 包，`a`包是 express 的依赖包，因此在引用的时候可以直接

```js
import * as a from 'a'
```

1. 但是随着版本迭代，a 包更新到 version 2，且存在破坏性的更新，即当前版本语法不再兼容上一版本，但是因为 a 包是 express 依赖包，a 更新依赖于 express，只有 express 支持 version 2 后才能去滚动更新 a，因此这完全不受我们开发者的控制。
2. 还有就是一旦 express 支持了 `a` version 2，我们部署的线上代码引用的 `a` 也随之更新，但实际代码的语法还是 version 1，这会给线上的应用代码灾难性的破坏”silly bug“。



## 安装

安装不依赖于 node 环境

```bash
$ wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.zshrc" SHELL="$(which zsh)" zsh -
```

`install.sh` 下载后会注入相关环境变量到 `~/.zshrc` 中

```bash
$ pnpm install-completion zsh
```

增加 `pnpm` 自动补全功能



## 可切换 node 版本

> 传统切换 node 版本的方式是基于 nvm，即在 ～/.nvm 管理各个 node 版本，但是这会存在些不可避免的问题 —— 各个版本之间的全局库是不共享的，因此可以基于 pnpm 来安装 node 版本

```bash
$ pnpm env use --global lts # 安装 LTS version
$ pnpm env remove --global lts # 移除 LTS version
$ pnpm env list
$ pnpm env list --remote # 可下载使用的 node 版本
```



## package.json

1. 指定当前项目支持 node & pnpm 版本

```json
{
    "engines": {
        "node": ">=10",
        "pnpm": ">=3"
    }
}
```

