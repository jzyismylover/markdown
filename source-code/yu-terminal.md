# yu-terminal



## fronted

> 模仿开发：`~/Desktop/programmer/browser-terminal`

浏览器终端，与 `桌面终端`类似，封装了若干内置功能通过命令行的形式调用，从功能来说，应该包含：

- 代码提示(`hint`)
- 历史记录(`histroy`)
- 命令识别
- 快捷键(`shortcut`)

从项目来看，整体可分为四个模块

- 终端：接收用户输入；传送对应命令；接受指令执行结果
- 命令注册器：将封装好功能的命令整体应用到上下文中
- 命令解析器：解析命令(`options`, `params`)
- 命令执行器：根据解析结果执行命令暴露的接口



🔐 反思

刚开始接触项目的时候，面对上面模块的需求不知道怎么去下手，每个部分都有想法但是不知道怎么去组织。其实总的可以从一个任务流的开端开始写，具体在这个项目里面：

1. 首先需要 **终端 `UI`**，那就先把 `UI` 的模板定义好。模板需要数据，那么数据的类型就得定义好，终端需要展示命令结果

```ts
interface CommandResult {
    text: string // 命令文本
    type: string // 结果类型
    status?: 'success' | 'error' // 标识成功与否
    result?: string // 结果文本
    component?: DefineComponent // 结果组件,
}
```

2. 接着就是**注册命令**，定义命令对象接口

```ts
interface Command {
    name: string // 命令名
    action: (...args) => any // 命令执行函数
    options?: CommandOption[] // 命令选项
    params?: CommandParam[] // 命令参数
    alias?: string[] // 命令别名列表
    subCommand?: Record<string, Command> // 子命令
}
```

```ts
interface CommandOption {
    type: 'string' | 'boolean' // 标识选项类型
    key: string // 选项名
    desc?: string // 选项描述
    required?: boolean // 是否必选
    alias?: string[] // 选项别名
    defaultValue?: string | boolean
}
```

```ts

interface CommandParam {
    key: string // 参数名
    desc?: string // 参数描述 
    required?: boolean // 是否必传
}
```

当然以上接口的确立是根据日常对终端使用以及 `getopts` 库实际需要的参数。

多个命令使用 `import.glob('./**/index.ts', { eager: true })` 统一注册

```ts
// 全局注册好的命令
export const commandLists: Command[] = Object.keys(configs).map((key) => {
  const command = configs[key]?.default;
  return command;
});

// 便于检索某个用户输入命令关键字是否在提供的命令列表内
export const commandMap = (function () {
  const map = new Map();
  commandLists.forEach((command) => {
    map.set(command.name, command);
    command.alias?.forEach((alias) => map.set(alias, command));
  });
  return map;
})();
```

3. **解析命令** —— 这也是终端的核心任务。

   - `doExtract`： 从用户文本获取命令关键字 

     ```ts
     let command
     const commandName = text.trim().split(' ', 1)[0].toLowerCase()
     command = commandMap.get(commandName)
     if (command && !parentCommand) {
     	return
     }
     // 针对子命令，在父命令中找到对应 key 返回 Command
     if(parCommand.subCommand && Object.keys(parCommand.subCommand) > 0) {
     	command = parCommand.subCommand[commandName]
     }
     
     return command
     ```

   - `doParse`：获取该命令关键字用户端提供的 `options / params`

     ```ts
     const opts = { // getopts 需要的参数
         alias: {},
         default: {},
         string: []
         boolean: []
     }
     
     // 命令定义的参数选项并入 opts
     if (command.options) {
     	command.options.forEach(option => {
             const { key, defaultValue, alias, type } = option
             if(alias) {
                 opts['alias'][key] = alias
             }
             if(defaultValue) {
                 opts['default'][key] = defaultValue
             }
     		opts[type].push(key)
         })
     }
     
     // 解析
     const parseOpts = getopts(text, opts)
     return parseOpts
     ```

4. **执行命令** —— 需要判断是否包含 `--help` 选项

   ```ts
   const { _, options } = parseOptions
   if(options.help) {
       // 此时就要输出命令的帮助文本
   }
   // 调用命令执行方法
   command.actions(parseOptions, terminal)
   ```



整个流程其实就像上面说的，里面比较有意思的是在终端暴露了一个 `terminal ` 对象

```ts 
interface TerminalMethods {
    focusInput: () => void
    writeTextOutput: (text: string, status: ResultStatus) => void
    writeOutput: (result) => void
}
```

 实际上在 `writeTextOutput`、`writeOutput` 引用了响应式对象 `outputList`，这样在命令执行 `action` 方法后调用这两个方法就可以实现 `outputList` 数据的更新从而在终端上展示执行结果。



## backend

> 基于 `express` 、`mysql`、`redis` 开发终端后台，实现背景图片切换、音频获取、单词翻译等需要访问网络资源的功能

```bash
src 
├─db.js # 连接数据库
├─index.js # CloudBaseRunServer 实例创建(端口监听、路由注册)
├─routes.js # 路由集合
├─server.js # CloudBaseRunServer 实例定义
├─thirdpart # 第三方网络资源
|     ├─backgroundApi.js
|     ├─neteaseMusicApi.js
|     ├─baiduFanYi
|     |     ├─baiduFanYiApi.js
|     |     ├─index.html
|     |     └md5.js
├─service
|    ├─musicService.js
|    └userService.js
├─model
|   └user.js
├─exception
|     ├─errorCode.js
|     └index.js
├─controller
|     ├─backgroundController.js
|     ├─fanyiController.js
|     ├─musicController.js
|     └userController.js
├─constant
|    └index.js
├─config
|   ├─config.js
|   └getConfig.js
```

