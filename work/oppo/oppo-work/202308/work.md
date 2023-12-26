# 2023.08

> 8.22 ~ 8.26



### webpack plugin

具体面对的场景：“一般来说我们开发网页的时候，大多都会以一个大的HTML页面来做，来开发，来发布，来维护。初期可能就1-2人维护，随着业务发展，功能迭代，一个首页会相当复杂，那么就有可能会有一个团队来维护”，明白点说就是需要进行网页内嵌从而实现代码复用，可以使用的解决方案：

- `iframe`
- 微前端
- `ssi`

  `ssi` 又叫 ”server side include“ ，是一种服务端网页内嵌技术，在网关层面对模板进行替换。可通过配置 `nginx` ：

<img src="https://ask.qcloudimg.com/http-save/yehe-1084154/00imu97om9.jpeg" alt="img" style="zoom:67%;" />

具体服务跑在 `nginx` 上时可根据模板路径和入口文件夹进行文件替换！

大概了解上面的原理以后，实现需要 `nginx` 辅助，那在开发环境如何也能看到效果呢，有以下方案：

- 方案一：直接在 `public/index.html` 文件添加打包好的 `html`
- 方案二：通过编写一个 `webpack` 插件实现对模板指定语法的替换（仅仅替换 `public/index.html` 注释模板）

  🔐 理解错误

  其实在写的时候我也一直理解的是替换 `vue` 文件中的注释模板，需要 `loader` 来处理源文件。实际应用场景只在 `webpack` 编译后输出到 `html` 文件上来进行模板替换，因此只需要在 `webpack` 输出 `html` 前更改文件流内容即可。（借助 `HtmlWebpackPlugin`）

`HtmlWebpackPlugin` 暴露了一些 `hooks` 给其他插件使用来更改 `html` 文件内容 [html-webpack-plugin info](https://www.cnblogs.com/wonyun/p/6030090.html)

```text
    * html-webpack-plugin-before-html-generation
    * html-webpack-plugin-before-html-processing
    * html-webpack-plugin-alter-asset-tags
    * html-webpack-plugin-after-html-processing
    * html-webpack-plugin-after-emit
```

基于上述钩子，可以实现对 `public/index.html` 内容更改，插件编写思路参考 [github](https://github.com/pingan8787/script-timestamp-webpack-plugin)

```js
// webpack plugin
class SSIPlugin {
    constructor(options) {}
    apply(compiler) {
        
     // compiler.options.mode === production return;
        
	 compiler.hooks.compilation.tap('ssi-plugin',
          (compilation) => {
            compilation.plugin(
              "html-webpack-plugin-before-html-processing",
              function (htmlPluginData, callback) {
				// 具体业务逻辑
                let resultHTML = htmlPluginData.html.replace('ssi-template', '')
                htmlPluginData.html = resultHTML;
              }
            );
          }
        );
      }
    }
}
```



```js
// vite plugin
export default function SSIPlugin() {
  let config = null
  return {
    name: 'ssi',
    configResolved(resolvedConfig) {
      config = resolvedConfig
    },
    transformIndexHtml(html) {
        // 具体业务逻辑
        return html.replace('ssi-template')
    }
  }
}
```

 总体来说，该插件编写难度不大（前提是熟悉构建工具的各种 `hooks`），因此非常有必要对两个构建工具做一个详细了解（**专门写一个文档**）

🔐 发包问题

```text
package
├─webpack
|    └index.js
├─vite
|  ├─index.mjs
|  └proxy.mjs
```

同时编写 `webpack` 和 `vite` 插件需要解决在不同项目下的引入问题。目前的区分规则是 `webpack` 使用 `require` ，`vite` 使用 `import` ，因此可以在 `package.json` 做一个区分

```json
{
    "exports": {
        ".": {
            "import": "./vite/index.mjs",
            "require": "./webpack/index.js"
        }
    }
}
```

默认包是 `commomjs` 规范，因此对于需要支持 `esm` 规范的文件需要使用 `.mjs` 后缀区分（坑）

