# create-vite

> [项目链接](https://github.com/jzyismylover/create-template)

其实目前像前端开发都是基于构建工具提供的脚手架去进行项目的初始化

- vue-cli
- create-vite
- create-react-app
- ……

基本都是内置了很多不同模板，在命名行选择相应的选项去进行模板初始化

```bash
❯ pnpm create vite .
.../share/pnpm/store/v3/tmp/dlx-247580   |   +1 +
.../share/pnpm/store/v3/tmp/dlx-247580   | Progress: resolved 1, reused 0, downloaded 1, added 1, done
✔ Current directory is not empty. Please choose how to proceed: › Ignore files and continue
✔ Select a framework: › Vue
? Select a variant: › - Use arrow-keys. Return to submit.
❯   TypeScript
    JavaScript
    Customize with create-vue ↗
    Nuxt ↗
```

因此其实可以将这个过程定制化，做成自己的模板小工具，具体我觉得可以分为三步

- 准备项目模板
- 编写参数解析 & 文件操作脚本
- 发布 npm 包

## 项目模板

项目的模板通常来说就是自己预备提供的初始化选项文件，比如如果要提供 vue、vue-ts 的化就得提供两个模板文件夹

## 定制脚本

脚本用到的几个关键库

- prompts: 命令行交互设置
- minimist: 命令行参数解析
- kcolorist: 命令行颜色配置

从交互的过程分析，可以分为若干阶段：

1. 初始化项目存放目录
2. 判断存放目录是否为空，不为空用户做何选择
   1. 不为空，用户是否覆盖
   2. 为空，校验目录合法性
3. 选择需要创建的模板
4. 将模板写入文件系统
5. 创建完成后提示启动脚本

整个交互的关键使用了 prompts，具体可以查看项目地址

> prompts 使用数组配置流程，每一步都可以配置是否进行，不触发则进入下一步直到终止. 同时在这过程中配置的变量也可以在流程后获得

:::tip
可复用的一些 utils 函数
:::

- 获取跨平台可以使用的文件路径

```js
import { fileURLToPath } from "url";
const path = fileURLToPath(import.meta.url);
```

- 清空文件夹

```js
function emptyDir(dir) {
  if (!fs.existsSync(dir)) {
    return;
  }
  for (const file of fs.readdirSync(dir)) {
    fs.rmSync(path.resolve(dir, file), { recursive: true, force: true });
  }
}
```

- 文件目录拷贝

```js
function copyDir(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, file);
    copy(srcFile, destFile);
  }
}

function copy(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    copyDir(src, dest);
  } else {
    fs.copyFileSync(src, dest);
  }
}
```


## 发布 npm 包

其实发布倒不是什么大问题，`npm publish` 就可以解决，但是像现在一些脚手架都允许 `npm create ` 来执行。

`npm create` 可以理解为是执行 `npx create-`

```bash
npm create template
# 等价于
npx create-template
```

`npx command` 代表的含义就是要执行某个包，而要配置一个包允许执行需要设置 `package.json` 的 `bin` 属性.

> bin 属性可以配置在命令行调用执行的脚本

```json
{
  "bin": {
    "create-template": "index.js"
  }
}
```

代码段表达的含义是在执行 "create-template" 触发 `node index.js`
