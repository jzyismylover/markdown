# hap-toolkit

 快应用开发工具集（hap-toolkit），用于辅助快应用（Quick App）的开发、编译、打包、调试、测试及本地服务模拟等。其目标是为开发者提供端到端的工程化支持。

## 模块划分

hap-compiler（编译模块）

- 负责快应用源码、样式、模板的编译、校验和转换工作。

hap-packager（打包模块）

- 负责编译后资源的遗留打包、产出 rpk（快应用包）/分包、资源归档压缩等功能。

hap-debugger（调试模块）

- 负责设备连接、远程调试、调试命令管理。

- 支持对接 Chrome DevTools、USB 调试、多设备管理等。

hap-server（本地服务模块）

- 提供 Web 调试、HMR、模拟服务器等本地开发服务。

- 用于本地预览和接口模拟。

hap-dsl-xvm（跨端适配模块）

- 用于适配 DSL 到 xvm 标准（虚拟机执行环境），处理运行时的数据结构与桥接等。

hap-dev-utils（开发辅助工具）

- 提供开发时的各种工具方法和脚本辅助。

hap-shared-utils（共享工具库）

- 各模块公共复用的工具函数、配置、事件总线等。

## hap-toolkit-cli

包含了项目创建、项目构建相关的 cli 指令

### 项目创建

流程上是根据用户输入的 `name` 参数，在脚本执行的目录（process.cwd()） 创建一个 `name` 命名的文件夹目录，然后递归拷贝 `hap-dsl-xvm` 中提供的 template 文件夹，在拷贝的过程中包含了对 `manifest.json` 文件的修正，这里不再赘述。

> 文件拷贝的函数
```js
function copyFiles(dest, src, alias) {
  // 遍历收集文件列表
  const pattern = path.join(src, '**/{*,.*}')
  const files = glob.sync(pattern, { nodir: true })

  const promises = files.map((file) => {
    return new Promise((resolve) => {
      const relative = path.relative(src, file)
      const finalPath = path.join(dest, alias[relative] || relative)
      if (!fs.existsSync(finalPath)) {
        resolve(`${relateCwd(finalPath)} created.`)
        fs.copySync(file, finalPath)
      } else {
        resolve(chalk.yellow(`${relateCwd(finalPath)} already existed.`))
      }
    })
  })
  return Promise.all(promises).then((messages) => {
    console.log(messages.join('\n'))
  })
}
```

这里比较有意思的点是在拷贝文件的时候是先用 glob 获取全部文件列表然后再获取文件在源目录中的相对文件路径，最后在目标目录中再执行文件拷贝逻辑而非直接使用目录 cp 的方式，这里从实现来看是会考虑 **文件重命名** 的情况。