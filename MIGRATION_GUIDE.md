# VuePress v1 → v2 迁移指南

本指南记录了将项目从 VuePress v1.9.10 迁移到 v2.0.0-rc.23 的完整过程。

## ✅ 迁移完成状态

**当前项目已成功从 VuePress v1.9.10 迁移到 v2.0.0-rc.23！**

- ✅ 依赖更新完成 (v1.9.10 → v2.0.0-rc.23)
- ✅ 配置文件重构完成 (ESM + Vue 3)
- ✅ Vue 3 + Composition API 支持
- ✅ Vite 打包工具配置
- ✅ Draw.io 插件适配 v2 版本
- ✅ 开发服务器正常运行 (http://localhost:8080)

## 🚨 重要变更总结

### 核心变更
- **Vue 版本**: Vue 2 → Vue 3 (Composition API)
- **模块系统**: CommonJS → ESM (纯 ESM 包)
- **TypeScript**: 更好的类型支持
- **打包工具**: 支持 Vite (推荐) 和 Webpack
- **插件系统**: API 重新设计，v1 插件不兼容

## 📋 实际迁移步骤

### 1. 更新依赖包

**主要依赖变更**:
```json
{
  "type": "module",
  "devDependencies": {
    "vuepress": "next",
    "@vuepress/bundler-vite": "next",
    "@vuepress/theme-default": "next",
    "@vuepress/plugin-back-to-top": "next",
    "@vuepress/plugin-medium-zoom": "next",
    "vue": "^3.4.0"
  }
}
```

### 2. 重构配置文件

**主要修改**:
- `.vuepress/config.ts`: 完全重写为 ESM 格式
- `.vuepress/sidebar.js`: 更新为 v2 侧边栏格式  
- `.vuepress/client.ts`: 新增客户端配置文件

### 3. 组件迁移

**DrawioViewer 组件**:
- 从 Vue 2 Options API → Vue 3 Composition API
- 使用 `<script setup>` 语法
- 更新响应式 API (`ref`, `computed`, `onMounted`)

## 🛠️ 解决的关键问题

### 1. ESM 模块导入错误
**解决**: 
```typescript
// ❌ v1 写法
const container = require("markdown-it-container")

// ✅ v2 写法  
import markdownItContainer from "markdown-it-container"
```

### 2. Markdown 配置过时
**解决**: 移除 `markdown.code` 配置

### 3. 插件重复加载
**解决**: 确保每个插件只配置一次

## 🧪 测试验证

### 开发服务器
```bash
pnpm docs:dev
# ✅ 成功启动在 http://localhost:8080
```

---

**迁移完成时间**: 2024年12月21日  
**VuePress 版本**: v1.9.10 → v2.0.0-rc.23  
**状态**: ✅ 成功完成