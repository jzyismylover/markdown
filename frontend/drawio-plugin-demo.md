# VuePress Draw.io 插件使用指南

## 简介

这个插件允许您在 VuePress 文档中嵌入和预览 Draw.io 图表。支持多种文件格式和自定义配置。

## 功能特性

- ✅ 支持 `.drawio` 和 `.dio` 文件格式
- ✅ 响应式设计，适配移动端
- ✅ 支持全屏预览
- ✅ 支持暗黑模式
- ✅ 自定义样式配置
- ✅ 在新标签页打开功能
- ✅ 加载状态和错误处理

## 基本使用

### 语法格式

```markdown
::: drawio 图表文件路径 [参数]
:::
```

### 参数说明

- `title="标题"` - 设置图表标题
- `width="宽度"` - 设置容器宽度（默认：100%）
- `height="高度"` - 设置容器高度（默认：400px）

## 使用示例

### 基本示例

```markdown
::: drawio /path/to/your/diagram.drawio
:::
```

### 带标题的示例

```markdown
::: drawio /path/to/your/diagram.drawio title="系统架构图"
:::
```

### 自定义尺寸

```markdown
::: drawio /path/to/your/diagram.drawio title="流程图"
:::
```

### 在线 URL 示例

```markdown
::: drawio https://app.diagrams.net/export/svg/example.drawio title="在线图表"
:::
```

## 实际演示

### 示例流程图

### 基本用法演示

::: drawio diagrams/sample.drawio
:::

## 配置选项 

在 `.vuepress/config.ts` 中配置插件：

```typescript
plugins: [
  [
    require("./plugins/drawio"),
    {
      // Draw.io 服务器 URL
      serverUrl: 'https://embed.diagrams.net',
      
      // 是否启用暗黑模式
      darkMode: false,
      
      // 支持的文件扩展名
      extensions: ['.drawio', '.dio'],
      
      // 自定义样式
      customStyles: {
        border: '1px solid #e1e8ed',
        borderRadius: '8px'
      }
    }
  ]
]
```

## 最佳实践

### 1. 文件组织

建议将 Draw.io 文件放在项目的 `public` 目录下：

```
public/
├── diagrams/
│   ├── architecture.drawio
│   ├── workflow.drawio
│   └── database-schema.drawio
```

### 2. 文件路径

使用相对于 `public` 目录的路径：

```markdown
::: drawio diagrams/architecture.drawio title="系统架构"
:::
```

### 3. 响应式设计

对于移动端适配，建议使用百分比宽度：

```markdown
::: drawio diagrams/mobile-flow.drawio
:::
```

## 故障排除

### 常见问题

1. **图表无法加载**
   - 检查文件路径是否正确
   - 确保文件存在于 `public` 目录中
   - 检查文件格式是否支持

2. **跨域问题**
   - 确保 Draw.io 文件可以通过 HTTP 访问
   - 检查服务器 CORS 设置

3. **样式问题**
   - 检查自定义样式配置
   - 确认 CSS 类名冲突

### 调试技巧

1. 打开浏览器开发工具查看控制台错误
2. 检查网络请求是否成功
3. 验证 iframe 源地址是否正确

## TypeScript 支持

如果您使用 TypeScript，可以添加类型定义：

```typescript
// types/drawio.d.ts
declare module '@vuepress/plugin-drawio' {
  interface DrawioPluginOptions {
    serverUrl?: string;
    darkMode?: boolean;
    extensions?: string[];
    customStyles?: Record<string, string>;
  }
}
```

## 开发扩展

### 自定义组件

您可以基于 `DrawioViewer` 组件创建自己的扩展：

```vue
<template>
  <div class="custom-drawio">
    <DrawioViewer 
      :src="src" 
      :title="title"
      :custom-styles="myStyles"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      myStyles: {
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
      }
    }
  }
}
</script>
```

## 更新日志

### v1.0.0
- ✅ 初始版本发布
- ✅ 支持基本的 Draw.io 图表嵌入
- ✅ 响应式设计
- ✅ 全屏预览功能

---

如有问题或建议，请提交 Issue 或 Pull Request。 