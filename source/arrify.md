
> 一个将传入值转换为数组类型的包

```js
// 核心源码
export default function arrify(value) {
	if (value === null || value === undefined) {
		return [];
	}

	if (Array.isArray(value)) {
		return value;
	}

	if (typeof value === 'string') {
		return [value];
	}

	if (typeof value[Symbol.iterator] === 'function') {
		return [...value];
	}

	return [value];
}

```

`arrify` 值得学习的点

- `Symbol.iterator` 迭代器
- `package.json` 规范

### package.json

#### type

> type 字段用于声明 npm 包准许的模块化规范

- commonjs(默认值) 
- module —— 遵循 `ES Module` 规范

`type` 一旦指定，目录下的 `.js` 都遵循 `type` 指定的模块规范

#### main

#### module

#### browser

以上三个可以连在一起学习，都是定义引用一个包时 `入口文件` 的位置

- `main`：定义 `npm包`的入口文件，`browser` & `node` 环境都可以用
- `module`：定义 `esm规范 npm 包`的入口文件，`browser` &`node` 环境都可以使用

- `browser`： 定义 `npm 包` 在 `browser` 环境下的入口文件

```json
  "main": "dist/index.js",  // main 
  "module": "dist/index.mjs", // module

  // browser 可定义成和 main/module 字段一一对应的映射对象，也可以直接定义为字符串
  "browser": {
    "./dist/index.js": "./dist/index.browser.js", // browser+cjs
    "./dist/index.mjs": "./dist/index.browser.mjs"  // browser+mjs
  },
```

实际使用时有优先级区分

```js
import demo from 'demo'
```

以上面导入为例：

1. `browser+mjs`
2. `module`
3. `browser+cjs`
4. `main`

### exports

> 定义 npm 包导出 —— 啥意思呢？可以理解为里面定义的其实是键值对，键为导入的路径，值为具体对应导入的文件路径

:imp: `exports` 的优先级高于 `main`、`module`、`browser`

```json
{
    "name": "project",
    "exports": {
        ".": "./dist/package",
        "./b": "./dist/package_b"
    }
}
```

```js
import * as pj from 'project' // 等价于 from "project/dist/package"
import * as pj from 'project/b' // 等价于 from 'project/dist/package_b'
```

除此以外，其他 `project` 路径的导入都不正确

`exports` 还可以针对 `import` 和 `require` 指定不同文件

```json
{ 
  "name":"pkg",
  "main": "./main-require.cjs",
  "exports": {
    "import": "./main-module.js",
    "require": "./main-require.cjs"
  },
  "type": "module"
}
```

- 如果使用 `require ` 导入包，则引用的是 `cjs` 文件
- 如果使用 `import` 导入包，则引用的是 `js` 文件

### files

> files 字段规定了将包作为项目依赖时包含在内的文件列表

官网有这么一句话：“`Certain files are always included, regardless of settings:`”

- `package.json`
- `README`
- `LICENSE` / `LICENCE`
- The file in the "main" field

也就是无论 `files` 如何设定，`.npmignore` 或者 `.gitignore` 怎么排除都会包含以上文件

```text
// 以下文件会被自动排除在外
.git
CVS
.svn
.hg
.lock-wscript
.wafpickle-N
.*.swp
.DS_Store
._*
npm-debug.log
.npmrc
node_modules
config.gypi
*.orig
```





