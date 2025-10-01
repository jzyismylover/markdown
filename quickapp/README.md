# 快应用前端 Core 架构解析

## 概述

快应用（QuickApp）是一个基于 JavaScript 的轻量级应用框架，其前端 Core 部分位于 `core/framework` 目录下，是整个快应用框架的核心引擎。该框架实现了一个完整的虚拟机环境，包括 DSL 解析、运行时系统、样式处理和平台接口等功能模块。

## 整体架构

### 目录结构

```
core/framework/src/
├── dsls/                  # DSL 解析器
│   └── xvm/               # XVM 虚拟机
├── infras/                # 基础设施
│   ├── bundles/           # 内置模块
│   ├── common/            # 公共工具
│   ├── dock/              # 应用容器
│   ├── entry/             # 入口点
│   ├── platform/          # 平台接口
│   ├── runtime/           # 运行时系统
│   └── styling/           # 样式处理
└── shared/                # 共享工具
```

### 核心架构图

```
┌─────────────────────────────────────────────────┐
│                    Entry Layer                   │
│  ┌─────────────┬─────────────┬─────────────────┐ │
│  │    Main     │     Web     │     Worker      │ │
│  │   Entry     │   Entry     │     Entry       │ │
│  └─────────────┴─────────────┴─────────────────┘ │
└─────────────────────────────────────────────────┘
                         │
┌─────────────────────────────────────────────────┐
│                 Framework Layer                  │
│  ┌─────────────────────────────────────────────┐ │
│  │              DSL (XVM)                      │ │
│  │  ┌─────────┬─────────┬─────────┬─────────┐  │ │
│  │  │   VM    │ Compiler│Observer │ Watcher │  │ │
│  │  └─────────┴─────────┴─────────┴─────────┘  │ │
│  └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
                         │
┌─────────────────────────────────────────────────┐
│               Infrastructure Layer               │
│  ┌───────────┬───────────┬───────────┬─────────┐ │
│  │  Runtime  │  Styling  │ Platform  │  Dock   │ │
│  │   DOM     │   CSS     │ Interface │  App    │ │
│  │  Events   │ Compiler  │  Modules  │ Manager │ │
│  └───────────┴───────────┴───────────┴─────────┘ │
└─────────────────────────────────────────────────┘
                         │
┌─────────────────────────────────────────────────┐
│                 Native Layer                     │
│              (Android/iOS)                       │
└─────────────────────────────────────────────────┘
```

## 1. DSL 模块 (XVM) - 虚拟机实现

### 1.1 XVM 虚拟机核心

XVM（eXtended Virtual Machine）是快应用的核心虚拟机，负责组件的创建、数据绑定和生命周期管理。

#### 主要特性

- **组件化架构**：每个自定义组件对应一个 VM 实例
- **数据响应式**：基于 Object.defineProperty 的数据绑定
- **生命周期管理**：完整的组件生命周期钩子
- **事件系统**：支持事件冒泡和捕获

#### 核心类结构

```typescript
class XVm {
  constructor(
    options: ComponentOptions,      // 组件定义
    type: string,                  // 组件名
    parentObj: XVm | Object,       // 父组件或上下文
    parentElement: Element,        // 父元素
    externalData: Object,          // 外部数据
    externalEvents: Object,        // 外部事件
    slotContentTemplate: Object    // 插槽内容
  )
  
  // 核心属性
  _data: Object                    // 组件数据
  _methods: Object                 // 组件方法
  _watchers: Array                 // 数据观察器
  _childrenVms: Array             // 子组件列表
  _rootElement: Element           // 根元素
  
  // API 方法
  $emit(type: string, detail: any): boolean
  $on(type: string, handler: Function): void
  $watch(target: string, callback: Function): Watcher
  $set(path: string, value: any): void
  $delete(key: string): void
}
```

### 1.2 数据观察系统

#### XObserver - 数据观察器

```typescript
class XObserver {
  constructor(value: Object) {
    this.value = value
    this.dep = new XLinker()      // 依赖收集器
    
    if (Array.isArray(value)) {
      this.observeArray(value)
    } else {
      this.walk(value)            // 遍历对象属性
    }
  }
  
  convert(key: string, val: any): void {
    defineReactive(this.value, key, val)
  }
}
```

#### 响应式数据绑定

```javascript
function defineReactive(obj, key, val) {
  const dep = new XLinker()
  let childOb = XObserver.$ob(val)
  
  Object.defineProperty(obj, key, {
    get: function reactiveGetter() {
      const value = val
      if (XLinker.target) {
        dep.depend()              // 收集依赖
        if (childOb) {
          childOb.dep.depend()
        }
      }
      return value
    },
    set: function reactiveSetter(newVal) {
      if (newVal === val) return
      val = newVal
      childOb = XObserver.$ob(newVal)
      dep.notify()              // 通知更新
    }
  })
}
```

### 1.3 组件编译系统

#### 模板编译流程

1. **模板解析**：将 `.ux` 文件的 template 部分解析为 AST
2. **指令处理**：处理 `if`、`for`、`show` 等指令
3. **事件绑定**：处理事件监听器
4. **组件实例化**：创建对应的 DOM 元素或子组件

```javascript
function compile(vm, template, dest) {
  const { type, attr, style, events, children } = template
  
  if (isCustomComponent(type)) {
    compileCustomComponent(vm, component, template, dest, type)
  } else {
    compileNativeComponent(vm, template, dest, type)
  }
  
  // 递归编译子节点
  if (children) {
    children.forEach(child => compile(vm, child, element))
  }
}
```

## 2. 基础设施模块 (Infras)

### 2.1 应用容器 (Dock)

Dock 模块负责应用和页面的生命周期管理，是连接框架层和原生层的桥梁。

#### XApp - 应用实例

```typescript
class XApp extends ModuleHost {
  constructor(id: string, options: AppOptions) {
    this.id = id
    this.name = string                // 应用名称
    this.entry = string               // 入口页面
    this.$data = Object               // 全局数据
    this._pages = Map<string, XPage>  // 页面实例映射
  }
  
  // 生命周期方法
  onCreate(): void
  onShow(): void  
  onHide(): void
  onDestroy(): void
}
```

#### 页面管理

```javascript
// 创建页面
function createPage(id, appId, code, data, intent, meta) {
  const app = getApp(appId)
  const page = new XPage(id, app, intent, meta)
  
  // 初始化页面VM
  const pageVm = new XVm(pageOptions, 'page', page, null, data)
  page.vm = pageVm
  
  return page
}
```

### 2.2 运行时系统 (Runtime)

#### DOM 抽象层

快应用实现了一套完整的 DOM API 抽象层，用于在 JavaScript 层面操作虚拟 DOM。

```typescript
class DomElement extends EventTarget {
  constructor(type: string) {
    this._type = type               // 元素类型
    this._attrs = {}               // 属性
    this._style = {}               // 样式
    this.childNodes = []           // 子节点
    this.parentNode = null         // 父节点
  }
  
  // DOM 操作方法
  appendChild(child: Node): void
  removeChild(child: Node): void
  insertBefore(child: Node, before: Node): void
  
  // 属性操作
  setAttribute(key: string, value: any): void
  removeAttribute(key: string): void
  
  // 样式操作
  setStyle(key: string, value: any): void
}
```

#### 事件系统

支持完整的 W3C 事件模型，包括事件捕获、目标阶段和冒泡阶段。

```typescript
class Event {
  constructor(type: string, options: EventInit) {
    this._type = type
    this._bubbles = options.bubbles || false
    this._cancelable = options.cancelable || false
    this._eventPhase = Event.NONE
  }
  
  stopPropagation(): void
  stopImmediatePropagation(): void
  preventDefault(): void
}

// 事件分发
function dispatchEvent(evt: Event) {
  const parentList = renderParents(this, true)
  const nodeList = parentList.slice().reverse().concat(parentList)
  
  // 捕获阶段 -> 目标阶段 -> 冒泡阶段
  for (const node of nodeList) {
    if (nodeIndex < thisIndex) {
      evt._eventPhase = Event.CAPTURING_PHASE
    } else if (nodeIndex === thisIndex) {
      evt._eventPhase = Event.AT_TARGET
    } else {
      evt._eventPhase = Event.BUBBLING_PHASE
    }
    
    fireTargetEventListener(node, evt)
  }
}
```

#### 消息通信

运行时通过 Listener 和 Streamer 实现与原生层的消息通信。

```javascript
class Listener {
  constructor(docId, streamer) {
    this._docId = docId
    this._streamer = streamer
  }
  
  // 发送操作指令到原生层
  createElement(ref, type, props) {
    this._streamer.sendActions(this._docId, [
      { module: 'dom', method: 'createElement', args: [ref, type, props] }
    ])
  }
  
  setAttr(ref, key, value) {
    this._streamer.sendActions(this._docId, [
      { module: 'dom', method: 'updateAttrs', args: [ref, { [key]: value }] }
    ])
  }
}
```

### 2.3 样式处理系统 (Styling)

#### CSS 解析与编译

样式系统实现了完整的 CSS 解析器，支持选择器解析、样式计算和优先级排序。

```typescript
// CSS 规则类型
const CSSStyleRuleType = {
  TAG: 1,        // 标签选择器
  CLASS: 2,      // 类选择器  
  ID: 3,         // ID选择器
  DESC: 4,       // 后代选择器
  INLINE: 5      // 内联样式
}

// 样式权重
const WEIGHT = {
  TAG: 1,
  CLASS: 1e3,
  ID: 1e6,
  INLINE: 1e9
}
```

#### 样式计算流程

1. **样式收集**：收集元素匹配的所有 CSS 规则
2. **优先级排序**：根据 CSS 规范计算优先级
3. **样式合并**：按优先级合并样式属性
4. **缓存优化**：缓存计算结果提升性能

```javascript
function calcNodeStyle(node, calcType) {
  // 清空缓存
  node._mergedStyleCache = null
  node._matchedCssRuleCache = {}
  
  // 计算内联样式
  const inlineStyle = getNodeInlineStyleAsObject(node)
  
  // 匹配CSS规则
  const styleSheetList = getNodeStyleSheetList(node)
  for (const styleSheet of styleSheetList) {
    matchCssRules(node, styleSheet)
  }
  
  // 合并样式
  const mergedStyle = mergeNodeStyle(node._matchedCssRuleCache)
  node._mergedStyleCache = mergedStyle
}
```

### 2.4 平台接口 (Platform)

平台接口层负责与原生平台的通信，包括模块管理、接口调用和回调处理。

#### 模块系统

```typescript
class ModuleHost {
  constructor(id: string) {
    this.id = id
    this._callbacks = {}           // 回调函数映射
    this._nativeInstList = []      // 原生实例列表
  }
  
  // 接收原生回调
  invoke(inst, callbackId, data, keepAlive) {
    const callback = inst._callbacks[callbackId]
    if (typeof callback === 'function') {
      const result = callback(data)
      if (!keepAlive) {
        delete inst._callbacks[callbackId]
      }
      return result
    }
  }
}
```

#### 接口调用机制

```javascript
function invokeNative(inst, module, method, args, moduleInstId) {
  const { name: modName, type: modType } = module
  const { name: mthName, mode: mthMode } = method
  
  const bridge = modType === 'feature' ? global.JsBridge : global.ModuleManager
  
  // 同步调用
  if (mthMode === MODULES.MODE.SYNC) {
    return bridge.invoke(modName, mthName, args, '-1', moduleInstId)
  }
  
  // 异步调用 - 返回Promise
  return new Promise((resolve, reject) => {
    const callbackId = registerCallback(inst, { resolve, reject })
    bridge.invoke(modName, mthName, args, callbackId, moduleInstId)
  })
}
```

## 3. 框架初始化流程

<ImageBox src="./assets/init-flow"/>

### 3.1 启动流程

```javascript
function initInfras() {
  // 1. 设置框架版本
  global.frameworkVersion = version
  
  // 2. 初始化平台接口
  const glue = {}
  glue.platform = platform
  platform.init()
  
  // 3. 初始化运行时
  glue.runtime = runtime  
  runtime.init()
  
  // 4. 初始化应用容器
  glue.dock = dock
  dock.init(glue)
  
  // 5. 注册内置模块
  glue.platform.defineBundle('parser')
  glue.platform.defineBundle('canvas')
  glue.platform.defineBundle('animation')
}
```

### 3.2 应用创建流程

```javascript
function createApplication(id, code) {
  // 1. 创建应用实例
  const app = new XApp(id, options)
  
  // 2. 编译应用代码
  const appCode = compileAppCode(code)
  
  // 3. 执行应用代码
  const appExports = executeAppCode(appCode, app)
  
  // 4. 设置应用定义
  app.$def = appExports
  
  // 5. 触发应用生命周期
  app.$emit('applc:onCreate')
  
  return app
}
```

### 3.3 页面创建流程

```javascript
function createPage(id, appId, code, data, intent, meta) {
  // 1. 获取应用实例
  const app = getApp(appId)
  
  // 2. 创建页面实例
  const page = new XPage(id, app, intent, meta)
  
  // 3. 创建文档对象
  page.doc = new DomDocument(id, listener)
  
  // 4. 编译页面代码
  const pageCode = compilePageCode(code)
  const pageOptions = executePageCode(pageCode)
  
  // 5. 创建页面VM
  const pageVm = new XVm(pageOptions, 'page', page, page.doc.documentElement, data)
  page.vm = pageVm
  
  return page
}
```

## 4. 数据流和依赖关系

### 4.1 数据流向

```
User Input/Native Events
          ↓
    Event Handlers
          ↓
      VM Methods
          ↓
     Data Changes
          ↓
    Observer/Watcher
          ↓
      DOM Updates
          ↓
    Native Rendering
```

### 4.2 模块依赖关系

```
Entry (main/web/worker)
  ↓
DSL (XVM)
  ↓
Runtime (DOM/Events) ← → Styling (CSS)
  ↓
Platform (Modules/Interface)
  ↓
Native Layer
```

### 4.3 组件通信机制

1. **父子通信**：通过 props 向下传递，events 向上传递
2. **兄弟通信**：通过父组件中转或使用事件总线
3. **跨级通信**：使用 `$dispatch` 和 `$broadcast`
4. **全局通信**：通过 App 实例的全局数据

## 5. 性能优化策略

### 5.1 虚拟DOM优化

- **批量更新**：将多个DOM操作合并为一次原生调用
- **差异比较**：只更新发生变化的属性和样式
- **延迟渲染**：使用 `nextTick` 延迟DOM更新

### 5.2 样式计算优化

- **样式缓存**：缓存计算结果避免重复计算
- **选择器匹配优化**：使用高效的选择器匹配算法
- **样式继承**：合理利用样式继承减少计算量

### 5.3 内存管理

- **组件销毁**：及时清理组件引用和事件监听
- **观察器清理**：销毁时移除数据观察器
- **缓存清理**：定期清理不再使用的缓存数据

## 6. 扩展性设计

### 6.1 插件系统

框架支持通过插件扩展功能：

```javascript
// 插件注册
XVm.mixin({
  onCreate() {
    // 插件初始化逻辑
  },
  onDestroy() {
    // 插件清理逻辑  
  }
})
```

### 6.2 自定义指令

支持注册自定义指令：

```javascript
// 全局指令
app.$def.directives = {
  focus: {
    inserted(el) {
      el.focus()
    }
  }
}
```

### 6.3 模块化架构

各个模块职责明确，接口清晰，便于独立开发和测试。

## 7. 调试和开发工具

### 7.1 调试支持

- **DevTools 集成**：支持 Chrome DevTools 调试
- **错误处理**：完善的错误捕获和报告机制
- **性能分析**：内置性能分析工具

### 7.2 开发模式

- **热更新**：开发时支持代码热更新
- **源码映射**：支持源码级别的调试
- **日志系统**：详细的运行时日志

## 总结

快应用前端 Core 架构是一个设计精良的现代前端框架，具有以下特点：

1. **模块化设计**：各模块职责明确，耦合度低
2. **完整的虚拟机**：实现了完整的组件化开发模式  
3. **高性能渲染**：优化的DOM操作和样式计算
4. **原生集成**：与原生平台深度集成
5. **开发友好**：提供完善的开发和调试工具

该架构为快应用提供了强大的技术基础，支持构建高性能的轻量级应用，是移动端应用开发的优秀解决方案。

---

*本文档基于快应用框架 v1.10.0 版本分析，详细的API文档和使用指南请参考官方文档。*
