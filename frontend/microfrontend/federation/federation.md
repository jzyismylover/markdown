# 模块联邦

模块联邦是一种在**运行时动态共享代码与资源**的一种技术，解决几个微前端里边棘手的问题：

- 依赖共享
- 跨应用复用

::: tip
依赖共享
:::

原先在微前端的架构里边，主应用与各个子应用间的依赖是独立加载，也就是在运行时里边难以避免双方会加载部分相同的依赖。在模块联邦技术引出之前通常会基于构建工具去细粒度去进行 splitChunk 将依赖分离为单独 chunk，在不加 hash 的前提下可以利用浏览器对 js 资源的缓存从而避免二次请求拉取相同依赖资源。但是这种需要人工地去定义，且当一个项目的依赖版本需要发生变更的时候这种方式会因为缓存的原因更新不上去。新的依赖版本可能有小 feature 的新 API 更新，版本更新不上去相当于调用了压根不存在的东西，在没有考虑容错的前提下 js 运行时就会异常。

有没有解决方案？也是有的，可以增加 hash 或者重新命名新版本，但是后续子项目想要升级的话均需要遵循相关的命名才可以重新去走缓存加载的线路，整体维护起来难度会比较大。

::: tip
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

### 第一章 插件基础了解

::: tip
Rollup 插件
:::

#### Build 阶段

<ImageBox src="1744903006594_5f8ccef4-dc98-4082-91f7-da43353700b3.png"/>

#### Output 阶段

<ImageBox src="1744903864222_28b747d1-2dcb-49be-a02d-b28c19f29376.png"/>

##### generate hook

generate hook 是 rollup 在拿到所有 chunk 准备输出到文件系统前的最后阶段，通常在这个钩子我们可以对最后要输出的产物做最后处理，比如是根据一定策略将某些产物排除在输出列表外

### 第二章 shared

> vite raw

资源可以使用 ?raw 后缀声明作为字符串引入

```js
import federation_fn_import from "./federation_fn_import.js?raw";
```

`federation_fn_import.js` 的内容将作为字符串引入，不再视作模块

::: tip
模块逻辑
:::

插件主要用于构造 `shared` 的 importMap，然后对输出阶段的 `chunk` 过滤

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

### 第三章 remotes

该内置插件主要在 transform 钩子实现了两个大功能点，解决了整体在模块联邦里面的一些疑惑

1. 模块联邦为什么能在运行时共享依赖，构建阶段做了什么处理？
2. 模块联邦怎么实现远程模块的运行时调用，构建阶段做了什么处理？

::: tip
要了解插件的详细实现，首先需要了解 estree-walk 在递归过程中 [AST 节点](https://juejin.cn/post/7025193043460358151) 的概念
:::

```js
import d from "e"; // ImportDeclaration

export default e = 1; //ExportDefaultDeclaration
```

`ImportDeclaration` 里边的 `Specifier` 属性，当取值为不同情况的时候代表了不同含义

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

#### 运行时依赖共享构建处理

```js
// 源代码
import { createApp } from "vue";

// 插件处理后代码
const { createApp } = importShared("vue");
```

插件里面是对源代码做了如上替换，而 `importShared` 函数再处理运行时加载的逻辑。

> 前情说明

这里补充一些前情部分，在构建阶是怎么知道我们需要对这个表达式进行替换的呢？这个是关键问题，没有这一部其实下面部分整体逻辑压根都不会走进去。版本上其实还是通过 Estree AST 节点 —— node.source.value 代表的是当前的模块名，比如说 vue。然后会从 `prodSharedOptions` 匹配是否包含了这个模块名，如果包含了这个模块名，才会走下面具体导入方法转换的逻辑。这里还要提一个点：`importShared` 函数从哪里来呢？其实在匹配通过后，会将一个 `hasImportShared` 变量设置为 true，然后往 chunk 的最前面塞入

```js
magicString.prepend(
  `import {importShared} from '\0virtual:__federation_fn_import';\n`
);
```

`virtual:__federation_fn_import` 虚拟模块其实是导入、共享 shared 模块函数的入口，具体里面的逻辑是什么我们下一章节再讲解。

源代码中区分了几种依赖导入方式进行处理：

- `import { b } from 'module'`： ImportSpecifier

```js
magicString.overwrite(
  node.start,
  node.end,
  // `const { b } = importShared('module')`
  `const ${defaultImportDeclaration} = await importShared('${moduleName}');\n`
);
```

- `import a from 'module`：ImportDefaultSpecifier

```js
magicString.overwrite(
  node.start,
  node.end,
  // const a = importShared('module')
  `const {${namedImportDeclaration.join(
    ","
  )}} = await importShared('${moduleName}');\n`
);
```

- `import a, {b as c, d} from 'module'`：ImportSpecifier、ImportDefautSpecifier 混合方式

```js
// 代表着 b:c,d
const imports = namedImportDeclaration.join(",");

// defaultImportDeclaration 代表着 a
// 所以得到的表达式是： const a = await importShared('module'); const {b:c,d} = module;
const line = `const ${defaultImportDeclaration} = await importShared('${moduleName}');\nconst {${imports}} = ${defaultImportDeclaration};\n`;

magicString.overwrite(node.start, node.end, line);
```

需要注意的是，以上执行的基础是在判断当前 ImportDefination 识别到的 `node.source.value`，也就是模块名在我们配置的 `shared` 列表中才会去做这个替换

#### 运行时动态导入构建处理

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

### 第四章 virtual:**federation**

::: tip
第四章的源代码中涉及到了几个关键函数 `__federation_method_getRemote`、`__federation_method_unwrapDefault`
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
                const shareScope = wrapShareModule(remote.from); // from: vite | webpack
                // 疑问点：init 函数从何而来？
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

在上面这段代码中整体看起来还是比较好理解，区分是三方引入是采用全局挂载还是通过模块的方式引入。但还是有部分存疑点：

1. `lib.init()`：init 方法是怎么来的？
2. 在什么场景下使用全局挂载，什么场景下使用模块引入？

为了解答以上的问题，我们需要看第五章节 `remotes`

### 第五章 expose

#### 模块初始化函数

#### CSS 动态导入

Q：在模块联邦里面我们是将 css 都打包到一个大文件中（`cssCodeSplit=false`），为什么需要这么做？

### 第六章 virtual:**federation_fn_import**

在第三章 remotes 里面有提到，插件最后是将 `import xx from 'module'` 的语法转换为 `const xx = importShared('module')` 的语法，`importShared` 函数的实现其实并未详细提及，在源代码中，importShared 函数其实是通过虚拟模块带入，下面会具体了解下这个函数的实现以及其关联的上下文.

```js
async function importShared(name, shareScope = "default") {
  // moduleCache: Object.create(null)
  return moduleCache[name]
    ? // 检查 moduleCache 是否有 module 已经初始化的对象
      // 如果有：直接返回
      new Promise((r) => r(moduleCache[name]))
    : // 如果没有，首先从运行时中取
      (await getSharedFromRuntime(name, shareScope)) ||
        // 如果运行时中没有，则走初始化路线
        getSharedFromLocal(name);
}
```

- `getSharedFromRuntime`

```js {4}
// 从运行时全局对象中获取结果
async function getSharedFromRuntime(name, shareScope) {
  let module = null;
  // 全局对象上是否已经有实例结果， __federation_shared__ 从何而来？
  if (globalThis?.__federation_shared__?.[shareScope]?.[name]) {
    // name -> 模块名
    const versionObj = globalThis.__federation_shared__[shareScope][name];
    const versionKey = Object.keys(versionObj)[0];
    const versionValue = Object.values(versionObj)[0];
    if (moduleMap[name]?.requiredVersion) {
      // 判断配置的版本是否与当前 package.json 版本可以降级满足
      if (satisfy(versionKey, moduleMap[name].requiredVersion)) {
        module = await (await versionValue.get())();
      } else {
        console.log(
          `provider support ${name}(${versionKey}) is not satisfied requiredVersion(\${moduleMap[name].requiredVersion})`
        );
      }
    } else {
      // 调用 shared module get 方法
      module = await (await versionValue.get())();
    }
  }
  if (module) {
    return flattenModule(module, name);
  }
}
```

- `getSharedFromlocal`

```js
async function getSharedFromLocal(name) {
  // 远程模块是否配置依赖 import 选项为 true
  if (moduleMap[name]?.import) {
    // 这里边是兜底策略，当 requiredVersion 不满足的情况下会走到这里复用本地模块的依赖
    let module = await (await moduleMap[name].get())();
    return flattenModule(module, name);
  } else {
    // 如果 import 为 false，兜底策略失效，最后会无法完成模块 shared
    console.error(
      `consumer config import=false,so cant use callback shared module`
    );
  }
}
```

上面代码的逻辑并不难，但是还是有些点需要去理清楚：

1. `moduleMap` 指代的是什么？：其实在源代码中，`moduleMap` 被赋值为 `__rf_var__moduleMap`，而在最终打包阶段其实是在第三章介绍的 remotes 识别到这个特殊的字符串后做代码替换 —— 本质是将 shared 的注册，基础配置组合成一个对象

```js
if (id === "\0virtual:__federation_fn_import") {
  // shared 配置
  const moduleMapCode = parsedOptions.prodShared
    .filter((shareInfo) => shareInfo[1].generate)
    .map(
      // ROLLUP_FILE_URL_${sharedInfo[1].emitFile} 在最后替换成 shared 的 bundle 文件地址
      (sharedInfo) =>
        `'${sharedInfo[0]}':{get:()=>
          ()=>__federation_import(import.meta.ROLLUP_FILE_URL_${
            sharedInfo[1].emitFile
          }),import:${sharedInfo[1].import}${
          sharedInfo[1].requiredVersion
            ? `,requiredVersion:'${sharedInfo[1].requiredVersion}'`
            : ""
        }}`
    )
    .join(",");
  // 这里 getModuleMarker 会返回 __rf_var__moduleMap
  return code.replace(
    getModuleMarker("moduleMap", "var"),
    `{${moduleMapCode}}`
  );
}
```

最后其实相当于是

```js
// __rf_var_moduleMap 会被替换成对象
const moduleMap = {
  vue: {
    get: () => () =>
      __federation_import(
        new URL("__federation_shared_vue-67087f9e.js", import.meta.url).href
      ),
    import: true,
  },
  pinia: {
    get: () => () =>
      __federation_import(
        new URL("__federation_shared_pinia-16496f0d.js", import.meta.url).href
      ),
    import: true,
  },
};
```

2. `__federation_shared__` 是从哪里初始化？

第五章节说到 `__federation__` 虚拟模块提供了 `init` 方法，方法本身是为了初始化 remote 上下文。在这个方法里边，其实内置了对 shared 内容的初始化。

:::tip
对于本地模块 & 远程模块来说 getSharedFromRuntime & getSharedFromlocal 会有什么区别
:::

- 本地模块：会正常走 getSharedFromLocal 的逻辑，因为本地模块默认是会生成 shared bundle 文件，所以无论如何 getSharedFromLocal 的策略都不会失效

todo: 解释远程模块 getShared 过程


:::tip
`__federation_shared__` 在多模块的场景下会不会被重复覆盖
:::

todo: 解释多模块场景下 `globalThis.__federation_shared__` 赋值情况