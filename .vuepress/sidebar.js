// VuePress v2 侧边栏配置 - 扁平化结构
export default {
  // 前端技术 - 扁平化显示所有技术栈
  "/frontend/": [
    {
      text: "前端知识概述",
      link: "/frontend/",
    },
    {
      text: "版本控制",
      collapsible: true,
      children: [
        {
          text: "Git",
          link: "/frontend/git/git",
        },
      ],
    },
    {
      text: "Javascript",
      collapsible: true,
      children: [
        {
          text: "JavaScript 基础",
          link: "/frontend/javascript/javascript",
        },
        {
          text: "ES6+ 特性",
          link: "/frontend/javascript/ES6",
        },
        {
          text: "数组操作",
          link: "/frontend/javascript/Array",
        },
      ],
    },
    {
      text: "Typescript",
      collapsible: true,
      children: [
        {
          text: "TypeScript 指南",
          link: "/frontend/typescript/index",
        },
        {
          text: 'Typescript 案例',
          link: '/frontend/typescript/example',
        }
      ],
    },
    {
      text: "Vue",
      collapsible: true,
      children: [
        {
          text: "Vue 概览",
          link: "/frontend/vue/",
        },
        {
          text: "VueUse 工具库",
          link: "/frontend/vue/vueuse",
        },
      ],
    },
    {
      text: "React",
      collapsible: true,
      children: [
        {
          text: "React 基础",
          link: "/frontend/react/react基础",
        },
        {
          text: "React 进阶",
          link: "/frontend/react/react进阶",
        },
      ],
    },
    {
      text: "Electron",
      collapsible: true,
      children: [
        {
          text: "Electron 开发",
          link: "/frontend/electron/electron",
        },
        {
          text: "Electron Builder",
          link: "/frontend/electron/electron-builder",
        },
      ],
    },
    {
      text: "前端监控",
      collapsible: true,
      children: [
        {
          text: "错误捕获",
          link: "/frontend/monitor/errorCapture/capture",
        },
        {
          text: "性能监控",
          link: "/frontend/monitor/performance/performance",
        },
      ],
    },
    {
      text: "微前端",
      collapsible: true,
      children: [
        {
          text: "微前端概览",
          link: "/frontend/microfrontend/microfrontend",
        },
        {
          text: "Module Federation",
          link: "/frontend/microfrontend/federation/federation",
        },
      ],
    },
    {
      text: "移动端开发",
      collapsible: true,
      children: [
        {
          text: "H5 开发",
          link: "/frontend/mobile/H5",
        },
      ],
    },
    {
      text: "桌面应用",
      collapsible: true,
      children: [
        {
          text: "Tauri",
          link: "/frontend/tauri/tauri",
        },
      ],
    },
    {
      text: "可视化",
      collapsible: true,
      children: [
        {
          text: "ECharts",
          link: "/frontend/echarts/echarts",
        },
      ],
    },
    {
      text: "工程化工具",
      collapsible: true,
      children: [
        {
          text: "pnpm",
          link: "/frontend/pnpm/pnpm",
        },
      ],
    },
    {
      text: "其他",
      collapsible: true,
      children: [
        {
          text: "Polyfill",
          link: "/frontend/polyfill",
        },
        {
          text: "Draw.io 插件演示",
          link: "/frontend/drawio-plugin-demo",
        },
      ],
    },
  ],

  // 后端技术
  "/backend/": [
    {
      text: "后端技术概览",
      link: "/backend/",
    },
    {
      text: "Node.js 生态",
      collapsible: true,
      children: [
        {
          text: "NestJS",
          link: "/backend/nestjs/nestjs",
        },
      ],
    },
    {
      text: "系统编程",
      collapsible: true,
      children: [
        {
          text: "Rust",
          link: "/backend/rust/rust",
        },
      ],
    },
    {
      text: "容器化部署",
      collapsible: true,
      children: [
        {
          text: "Docker",
          link: "/backend/docker/docker",
        },
        {
          text: "Nginx",
          link: "/backend/nginx/nginx",
        },
      ],
    },
  ],

  // 算法
  "/algorithm/": [
    {
      text: "算法概览",
      link: "/algorithm/",
    },
    {
      text: "剑指 Offer",
      link: "/algorithm/剑指offer",
    },
    {
      text: "基础算法列表",
      link: "/algorithm/基础算法列表",
    },
  ],

  // 源码阅读
  "/source/": [
    {
      text: "源码阅读概览",
      link: "/source/",
    },
    {
      text: "工具库源码",
      collapsible: true,
      children: [
        {
          text: "arrify",
          link: "/source/arrify",
        },
        {
          text: "mitt",
          link: "/source/mitt",
        },
        {
          text: "create-vite",
          link: "/source/create-vite",
        },
        {
          text: "yu-terminal",
          link: "/source/yu-terminal",
        },
      ],
    },
    {
      text: "组件库源码",
      collapsible: true,
      children: [
        {
          text: "Element Plus",
          link: "/source/element-plus/element-plus",
        },
      ],
    },
    {
      text: "管理系统源码",
      collapsible: true,
      children: [
        {
          text: "Vue Vben Admin - 项目描述",
          link: "/source/vben/description",
        },
        {
          text: "Vue Vben Admin - TypeScript",
          link: "/source/vben/vben-typescript",
        },
        {
          text: "Vue Vben Admin - CSS 架构",
          link: "/source/vben/vben-css",
        },
        {
          text: "Vue Vben Admin - 包管理",
          link: "/source/vben/vben-package",
        },
        {
          text: "Vue Vben Admin - Vite 配置",
          link: "/source/vben/vben-vite",
        },
        {
          text: "Vue Element Plus Admin",
          link: "/source/vue-element-plus-admin.docs",
        },
      ],
    },
  ],

  // 读书笔记
  "/reading/": [
    {
      text: "读书笔记概览",
      link: "/reading/",
    },
    {
      text: "技术类",
      collapsible: true,
      children: [
        {
          text: "深入浅出 Node.js",
          link: "/reading/deep-nodejs",
        },
        {
          text: "Web 性能权威指南",
          link: "/reading/web-performance",
        },
      ],
    },
    {
      text: "个人成长",
      collapsible: true,
      children: [
        {
          text: "掌控习惯",
          link: "/reading/掌控习惯",
        },
        {
          text: "金字塔原理",
          link: "/reading/金字塔原理",
        },
        {
          text: "时间从来不语，却回答了所有问题",
          link: "/reading/时间从来不语，却回答了所有问题",
        },
      ],
    },
  ],

  // 工作记录
  "/job/": [
    {
      text: "工作记录概览",
      link: "/job/",
    },
    {
      text: "OPPO",
      collapsible: true,
      children: [
        {
          text: "工作总结",
          link: "/job/oppo/oppo-work/",
        },
        {
          text: "考试记录",
          link: "/job/oppo/oppo-exam/oppo-exam",
        },
        {
          text: "在线学习",
          link: "/job/oppo/oppo-exam/oppo-online-study",
        },
      ],
    },
  ],

  // 系统相关
  "/system/": [
    {
      text: "macOS",
      link: "/system/macos/macos",
    },
    {
      text: "Ubuntu",
      link: "/system/ubuntu/ubuntu",
    },
  ],

  // 其他内容
  "/others/": [
    {
      text: "其他内容概览",
      link: "/others/",
    },
    {
      text: "日常记录",
      link: "/others/daily/阅读链接记忆.md",
    },
    {
      text: "应用开发",
      collapsible: true,
      children: [
        {
          text: "Indicator App",
          link: "/others/indicator-app/indicator-app",
        },
      ],
    },
    {
      text: "学术研究",
      collapsible: true,
      children: [
        {
          text: "大数据与双边关系量化研究",
          link: "/others/大数据与双边关系量化研究",
        },
      ],
    },
  ],

  // MCP 协议
  "/mcp/": [
    {
      text: "MCP 协议概览",
      link: "/mcp/",
    },
  ],
};
