/// <reference types="vite/client" />
/// <reference types="@vuepress/client/types" />

// Vue 单文件组件类型声明
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// VuePress 客户端 API 重新导出
declare module "vuepress/client" {
  export * from "@vuepress/client";
}

// Markdown 文件类型声明
declare module "*.md" {
  const content: string;
  export default content;
}

// 图片文件类型声明
declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.jpeg" {
  const src: string;
  export default src;
}

declare module "*.gif" {
  const src: string;
  export default src;
}

declare module "*.svg" {
  const src: string;
  export default src;
}

// Node.js 模块类型声明
declare module "markdown-it-container" {
  import type MarkdownIt from "markdown-it";

  interface ContainerOptions {
    validate?: (params: string) => boolean;
    render?: (
      tokens: any[],
      idx: number,
      options: any,
      env: any,
      renderer: any
    ) => string;
    marker?: string;
  }

  const container: (
    md: MarkdownIt,
    name: string,
    options: ContainerOptions
  ) => void;
  export default container;
}
