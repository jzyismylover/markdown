import { defineUserConfig } from "vuepress";
import { defaultTheme } from "@vuepress/theme-default";
import { viteBundler } from "@vuepress/bundler-vite";
import { backToTopPlugin } from "@vuepress/plugin-back-to-top";
import { mediumZoomPlugin } from "@vuepress/plugin-medium-zoom";
import { registerComponentsPlugin } from "@vuepress/plugin-register-components";
import { resolve } from "path";
import { fileURLToPath, URL } from "node:url";
import markdownItContainer from "markdown-it-container";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// 导入侧边栏配置
import sidebar from "./sidebar.js";

export default defineUserConfig({
  // 基本配置
  lang: "zh-CN",
  title: "Mr.J 技术博客",
  description: "学习&工作-技术积累",

  // 头部配置
  head: [
    ["link", { rel: "icon", href: "/logo.png" }],
    ["meta", { name: "theme-color", content: "#3eaf7c" }],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    [
      "meta",
      { name: "apple-mobile-web-app-status-bar-style", content: "black" },
    ],
    // 百度统计
    [
      "script",
      {},
      `
        var _hmt = _hmt || [];
        (function() {
          var hm = document.createElement("script");
          hm.src = "https://hm.baidu.com/hm.js?2675818a983a3131404cee835018f016";
          var s = document.getElementsByTagName("script")[0]; 
          s.parentNode.insertBefore(hm, s);
        })();
      `,
    ],
  ],

  // 打包工具配置
  bundler: viteBundler({
    viteOptions: {},
    vuePluginOptions: {},
  }),

  // 主题配置
  theme: defaultTheme({
    logo: "/logo.png",

    // 导航栏
    navbar: [],

    // 侧边栏
    sidebar,

    // 仓库配置
    repo: "jzyismylover/ubuntu-markdown",
    docsBranch: "docs",

    // 编辑链接
    editLink: true,
    editLinkText: "完善页面",

    // 更新时间
    lastUpdated: true,
    lastUpdatedText: "最近更新",

    // 贡献者
    contributors: true,
    contributorsText: "贡献者",
  }),

  // Markdown 配置 - 移除过时的 code 配置
  markdown: {
    headers: {
      level: [2, 3, 4, 5, 6],
    },
  },

  // 插件配置
  plugins: [
    // 回到顶部
    backToTopPlugin(),

    // 图片缩放
    mediumZoomPlugin({
      selector: ".theme-default-content :not(a) > img",
      zoomOptions: {},
    }),

    // 注册组件
    registerComponentsPlugin({
      componentsDir: resolve(__dirname, "./components"),
    }),

    // Draw.io 插件 (重构版)
    {
      name: "vuepress-plugin-drawio-v2",

      clientConfigFile: resolve(__dirname, "./client.ts"),

      extendsMarkdown: (md) => {
        md.use(markdownItContainer, "drawio", {
          validate: (params) => {
            return params.trim().match(/^drawio\s*(.*)$/);
          },

          render: (tokens, idx) => {
            console.log(tokens, idx);
            const token = tokens[idx];
            const info = token.info.trim().slice(6).trim();

            let src = "";
            let title = "";
            let width = "100%";
            let height = "400px";

            if (info) {
              const parts = info.split(/\s+/);
              src = parts[0];

              for (let i = 1; i < parts.length; i++) {
                const part = parts[i];
                if (part.startsWith("title=")) {
                  title = part.substring(6).replace(/"/g, "");
                } else if (part.startsWith("width=")) {
                  width = part.substring(6);
                } else if (part.startsWith("height=")) {
                  height = part.substring(7);
                }
              }
            }

            if (token.nesting === 1) {
              return `<DrawioViewer src="${src}" title="${title}" width="${width}" height="${height}" />\n`;
            }
          },
        });
      },
    },
  ],

  // 开发配置
  port: 8080,
  host: "0.0.0.0",
  temp: ".vuepress/.temp",
  cache: ".vuepress/.cache",
  public: ".vuepress/public",
});
