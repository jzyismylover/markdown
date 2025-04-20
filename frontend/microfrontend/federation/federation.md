# 模块联邦

模块联邦是一种在**运行时动态共享代码与资源**的一种技术，解决几个微前端里边棘手的问题：

- 依赖共享
- 跨应用复用

::: info
依赖共享
:::
原先在微前端的架构里边，主应用与各个子应用间的依赖是独立加载，也就是在运行时里边难以避免双方会加载部分相同的依赖。在模块联邦技术引出之前通常会基于构建工具去细粒度去进行 splitChunk 将依赖分离为单独 chunk，在不加 hash 的前提下可以利用浏览器对 js 资源的缓存从而避免二次请求拉取相同依赖资源。但是这种需要人工地去定义，且当一个项目的依赖版本需要发生变更的时候这种方式会因为缓存的原因更新不上去。新的依赖版本可能有小 feature 的新 API 更新，版本更新不上去相当于调用了压根不存在的东西，在没有考虑容错的前提下 js 运行时就会异常。

有没有解决方案？也是有的，可以增加 hash 或者重新命名新版本，但是后续子项目想要升级的话均需要遵循相关的命名才可以重新去走缓存加载的线路，整体维护起来难度会比较大。

::: info
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

<ImageBox src="1744903006594_5f8ccef4-dc98-4082-91f7-da43353700b3.png"/>

#### Output 阶段

<ImageBox src="1744903864222_28b747d1-2dcb-49be-a02d-b28c19f29376.png"/>

##### generate hook

generate hook 是 rollup 在拿到所有 chunk 准备输出到文件系统前的最后阶段，通常在这个钩子我们可以对最后要输出的产物做最后处理，比如是根据一定策略将某些产物排除在输出列表外

### shared-production plugin

> vite raw

资源可以使用 ?raw 后缀声明作为字符串引入

```js
import federation_fn_import from "./federation_fn_import.js?raw";
```

`federation_fn_import.js` 的内容将作为字符串引入，不再视作模块

::: info
模块逻辑
:::

该内置插件是 `shared 配置` 生产环境处理插件，主要的作用是构造 shared 的 importMap，然后对输出阶段的一些产物做处理

#### options hook

1. 本地模块、远程模块的判定

本地模块、远程模块区分主要在某些选项配置里边只有远程模块允许配置，比如 requiredVersion，所以需要了解在生产环境插件内部是如何区分本地、远程模块。

- 本地模块判定基准: 配置中有配置 remotes(说明是导入方) 且不存在 expose 配置（说明不是提供方）

```js
parseOptions.prodRemote.length && !parsedOptions.prodExpose.length;
```

- 远程模块判定基准: 配置中有 expose 配置（说明是提供方）

```js
parseOptins.prodExpose.length;
```

2. external 排除

定义在 external 中的依赖如果同时在 shared 中，则会将在 shared 中的依赖从 external 去除

#### buildStrat hook

1. 依赖入口查找

一般来说这里的入口指的是 package.json，依赖入口查找是基于 rollup 提供的上下文方法 `this.resolve` 完成。在没有定义 `packagePath` 的时候

```js
this.resolve("vue/package.json");
```

如上会默认从 node_modules 找到对应的入口路径，但是如果定义了 `packagePath` 情况将会变得不一样, 假如 `packagePath=src/packages/tools`

```js
this.resolve("src/packages/tools/package.json");
```

这个时候如果定义的路径不在当前仓库下的话构建就会失败，因为根本找不到这个路径。所以一般来说使用到 `packagePath` 的一般都是 monorepo 项目，即本地模块、远程模块、自定义 npm 包都在一个仓库的情况下。

2. version 取值

在定义 shared 的时候如果不定义 version 的情况下，默认会取当前项目 node_modules/package 里边的 package.json 的 version 字段填充

3. manualChunks 配置

> 存疑点：当 manualChunks 配置为 shared module 的情况下会出现什么问题？

### expose-production

### remote-production

该内置插件主要实现了两个大功能点，解决了整体在模块联邦里面的一些疑惑

1. 模块联邦是怎么在运行时共享依赖？

```js
// 源代码
import { createApp } from "vue";

// 插件处理后代码
const { createApp } = importShared("vue");
```

插件里面是对源代码做了如上替换，而 `importShared` 函数再处理运行时加载的逻辑（后续会详细讲解）。源代码中区分了几种依赖导入的方式：

- `import a, { b } from 'module'`

处理方式：`const a = importShared('module'); const { b } = a`

- `import { b } from 'module'`

处理方式：`const { b } = importShared('module')`

- `import a from 'module'`

处理方式: `const a = importShared('module')`

2. 模块联邦怎么识别到 remote，并从 remote 导入对应的 export？

::: info
要了解插件的详细实现，首先需要了解 estree-walk 在递归过程中 [AST 节点](https://juejin.cn/post/7025193043460358151) 的概念
:::

```js
import d from "e"; // ImportDeclaration

export default e = 1; //ExportDefaultDeclaration
```

`ImportDeclaration` 里边的 `Specifier` 属性

- ImportSpecifier

```js
import { a } from "./a.js";
```

- ImportDefaultSpecifer

```js
import a from "./a.js";
```

- ImportNamespaceSpecifer

```js
import * as a from "./a.js";
```

插件源代码如针对 shared 模块那样，针对 remotes 也区分了几种处理方式，同样是 walk 递归中根据 AST 节点的类型做分类

- 如果是动态导入的方式（`ImportExpression`）

```js
magicString.overwrite(
  node.start,
  node.end,
  // 虚拟模块提供的导入远程模块的方法（本质上是从 prodRemotes 中取得执行函数）
  `__federation_method_getRemote(${JSON.stringify(
    remote.id
  )} , ${JSON.stringify(
    modName
    // 执行函数获取返回值
  )}).then(module=>__federation_method_wrapDefault(module, ${needWrap}))`
);
```

- 如果是静态表达式声明（`ImportDeclaration`）的话区分三种情况，如下代码片段：

```js
node.specifiers.forEach((spec) => {
  // import a from 'lib'
  if (spec.type === "ImportDefaultSpecifier") {
    magicString.appendRight(
      node.end,
      `\n let ${spec.local.name} = __federation_method_unwrapDefault(${afterImportName}) `
    );
  } else if (spec.type === "ImportSpecifier") {
    // import {a as b} from 'lib'
    const importedName = spec.imported.name; // 指的是 a
    const localName = spec.local.name; // 指的是 b
    deconstructStr += `${
      importedName === localName
        ? localName
        : // 解构赋值变量重命名
          `${importedName} : ${localName}`
    },`;
  } else if (spec.type === "ImportNamespaceSpecifier") {
    // import * as a from 'lib'
    magicString.appendRight(
      node.end,
      // 解构赋值
      `let {${spec.local.name}} = ${afterImportName}`
    );
  }
});
```

- 如果是命名导出（`ExportNameDeclaration`）

```js
// 示范例子（当前需要 transform 这段代码）：export { a } from 'remotes/module'

const specifiers = node.specifiers;
let exportContent = "";
let deconstructContent = "";
// [a]
specifiers.forEach((spec) => {
  // localName: a
  const localName = spec.local.name;
  // exportName: a
  const exportName = spec.exported.name;
  // varableName: remotesmodule_a
  const variableName = `${afterImportName}_${localName}`;
  // 对导入做重新命名
  deconstructContent = deconstructContent.concat(
    `${localName}:${variableName},`
  );
  // 导出重新以 exportName 命名
  exportContent = exportContent.concat(`${variableName} as ${exportName},`);
});
// const { a: remotesmodule_a } = remotesmodule
// remotesmodule 是 __federation_method_getRemote 返回的结果
magicString.append(
  `\n const {${deconstructContent.slice(
    0,
    deconstructContent.length - 1
  )}} = ${afterImportName}; \n`
);
// export { remotesmodule_a as a } ES6 模块导出的方式以 a 重新导出
magicString.append(
  `\n export {${exportContent.slice(0, exportContent.length - 1)}}; `
);
```

::: info
以上源代码中其实都涉及到了几个关键函数 `__federation_method_getRemote`、`__federation_method_unwrapDefault`
:::

- `__federation_method_unwrapDefault`：确保不同模块系统（ESM & COMMONJS）之间的默认导出行为一致

```js
function __federation_method_unwrapDefault(module) {
  return module?.__esModule || module?.[Symbol.toStringTag] === "Module"
    ? module.default
    : module;
}
```

- `__federation_method_getRemote`：调用了 `prodRemotes` 中对应 remoteId 的初始化工厂方法

```js
function __federation_method_getRemote(remoteName, componentName) {
  return __federation_method_ensure(remoteName).then((remote) =>
    remote.get(componentName).then((factory) => factory())
  );
}
```

其中的 `__federation_method_ensure` 方法是核心函数，它承载了 `remotes` 模块初始化、单例控制等等

```js
// 案例引入
// remotes: {
//   button: {
//       external: Promise.resolve(entry),
//       externalType: 'promise',
//       format: 'vite'
//   }
// }
async function __federation_method_ensure(remoteId) {
  // 拿到当前模块的 key （button）
  const remote = remotesMap[remoteId];
  if (!remote.inited) {
    if ("var" === remote.format) {
      return new Promise((resolve) => {
        const callback = () => {
          // 单例控制
          if (!remote.inited) {
            // 需要斟酌 format 定义为 var 前提是有操作是直接将 remotesMap 挂到 window 上
            remote.lib = window[remoteId];
            // 底层实现是把初始化的值挂到 globalThis.__federation_shared__
            remote.lib.init(wrapShareModule(remote.from));
            remote.inited = true;
          }
          resolve(remote.lib);
        };
        // 加载远程 JS 文件
        return loadJS(remote.url, callback);
      });
    } else if (["esm", "systemjs"].includes(remote.format)) {
      // 通过 import 加载 JS
      return new Promise((resolve, reject) => {
        const getUrl =
        // 区分是 Promise 函数还是字面量字符串
          typeof remote.url === "function"
            ? remote.url
            : () => Promise.resolve(remote.url);
        getUrl().then((url) => {
          import(/* @vite-ignore */ url)
            .then((lib) => {
              // 单例控制
              if (!remote.inited) {
                // globalThis.__federation_shared__
                const shareScope = wrapShareModule(remote.from);
                lib.init(shareScope);
                remote.lib = lib;
                remote.lib.init(shareScope);
                remote.inited = true;
              }
              resolve(remote.lib);
            })
            .catch(reject);
        });
      });
    }
  } else {
    return remote.lib;
  }
}
```
