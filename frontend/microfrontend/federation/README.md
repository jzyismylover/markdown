# 模块联邦

模块联邦是一种在**运行时动态共享代码与资源**的一种技术，解决几个微前端里边棘手的问题：
- 依赖共享
- 跨应用复用

:::info
依赖共享
:::
原先在微前端的架构里边，主应用与各个子应用间的依赖是独立加载，也就是在运行时里边难以避免双方会加载部分相同的依赖。在模块联邦技术引出之前通常会基于构建工具去细粒度去进行 splitChunk 将依赖分离为单独 chunk，在不加 hash 的前提下可以利用浏览器对 js 资源的缓存从而避免二次请求拉取相同依赖资源。但是这种需要人工地去定义，且当一个项目的依赖版本需要发生变更的时候这种方式会因为缓存的原因更新不上去。新的依赖版本可能有小 feature 的新 API 更新，版本更新不上去相当于调用了压根不存在的东西，在没有考虑容错的前提下 js 运行时就会异常。

有没有解决方案？也是有的，可以增加 hash 或者重新命名新版本，但是后续子项目想要升级的话均需要遵循相关的命名才可以重新去走缓存加载的线路，整体维护起来难度会比较大。

:::info
跨应用单元复用
:::
这里的单元可以是组件、函数，在以往如果我们需要做这种跨应用的远程模块引入，大体上有以下方式：
- npm 包 


## vite-plugin-federation

- 学习目的：了解模块联邦基础的运作原理
- 学习重点
  - 插件的设计模式
  - vite、rollup 插件机制深入了解：对应插件钩子具体的含义以及可以在这个钩子中常见的业务逻辑
  - 运行时依赖共享  

### Rollup 插件

#### Build 阶段

![](https://common-1306887959.cos.ap-guangzhou.myqcloud.com/vscode/markdown/1744903006594_5f8ccef4-dc98-4082-91f7-da43353700b3.png)

#### Output 阶段

![](https://common-1306887959.cos.ap-guangzhou.myqcloud.com/vscode/markdown/1744903006594_5f8ccef4-dc98-4082-91f7-da43353700b3.png)

##### generate hook

generate hook 是 rollup 在拿到所有 chunk 准备输出到文件系统的最后阶段，通常在这个钩子我们可以对最后要输出的产物做最后处理，比如是根据一定策略将某些产物排除在输出列表外

### shared-production plugin

> vite raw

资源可以使用 ?raw 后缀声明作为字符串引入

```js
import federation_fn_import from './federation_fn_import.js?raw'
```

`federation_fn_import.js` 的内容将作为字符串引入，不再视作模块

:::info
模块逻辑
:::

该文件是 `shared 配置` 生产环境的处理插件，主要的作用是构造 shared 的 importMap，然后对输出阶段的一些产物做处理

#### options hook

 > 本地模块、远程模块的判定

本地模块、远程模块区分主要在某些选项配置里边只有远程模块允许配置，比如 requiredVersion，所以需要了解在生产环境插件内部是如何区分本地、远程模块。
- 本地模块判定基准: 配置中有配置 remotes(说明是导入方) 且不存在 expose 配置（说明不是提供方）
```js
parseOptions.prodRemote.length && !parsedOptions.prodExpose.length
```
- 远程模块判定基准: 配置中有 expose 配置（说明是提供方）
```js
parseOptins.prodExpose.length
```



### expose-production

### remote-production