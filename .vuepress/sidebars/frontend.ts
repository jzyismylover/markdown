import type { SidebarConfigArray } from "vuepress/config";

export default [
  // 预留一个路由给默认入口
  "",
  "/frontend/git/git.md",
  {
    title: "Javascript",
    collapsable: true,
    children: [
      "/frontend/javascript/Array.md",
      "/frontend/javascript/ES6.md",
      "/frontend/javascript/javascript.md",
    ],
  },
  "/frontend/typescript/typescript.md",
  {
    title: "Vue",
    children: ["/frontend/vue/vueuse.md"],
  },
  {
    title: "React",
    children: ["/frontend/react/react基础.md", "/frontend/react/react进阶.md"],
  },
  {
    title: "Electron",
    children: [
      "/frontend/electron/electron.md",
      "/frontend/electron/electron-builder.md",
    ],
  },
  {
    title: "前端监控",
    children: [
      "/frontend/monitor/errorCapture/capture.md",
      "/frontend/monitor/performance/performance.md",
    ],
  },
  {
    // sidebar 命名
    title: "微前端",
    // 该 sidebar 模块里面的子内容
    children: [
      "/frontend/microfrontend/README.md",
      "/frontend/microfrontend/federation/README.md",
    ],
  },
] as SidebarConfigArray;
