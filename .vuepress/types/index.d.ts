// Vue 组件类型声明
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// VuePress 客户端 API 类型声明
declare module "vuepress/client" {
  export * from "@vuepress/client";
}

// DrawioViewer 组件 Props 类型
export interface DrawioViewerProps {
  src?: string;
  title?: string;
  width?: string;
  height?: string;
  serverUrl?: string;
  darkMode?: boolean;
  customStyles?: Record<string, string>;
  showControls?: boolean;
}

// 全局组件类型声明
declare module "@vue/runtime-core" {
  export interface GlobalComponents {
    DrawioViewer: DefineComponent<DrawioViewerProps>;
  }
}

// 环境变量类型
declare global {
  interface Window {
    __VUEPRESS_SSR__?: boolean;
  }
}

export {};
