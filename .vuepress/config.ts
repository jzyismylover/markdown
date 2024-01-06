import { defineConfig, UserConfig, DefaultThemeConfig } from 'vuepress/config'
import navbar from './navbar'
import sidebar from './sidebar'
import footer from './footer'

type DefineConfigType = (config: UserConfig<DefaultThemeConfig> & {
  permalink: string
}) => void

const domain = '120.77.245.193'

export default (defineConfig as DefineConfigType)({
  base: '/markdown/',
  title: 'Mr.Jiang-技术博客',
  description: '学习&工作-技术积累',
  head: [
    // 站点图标
    ["link", { rel: "" }],
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
  permalink: "/:slug",
  // 监听文件变化
  extraWatchFiles: ['.vuepress/*.ts', '.vuepress/sidebars/*.ts'],
  markdown: {
    // 开启代码块的行号
    lineNumbers: true,
    // 支持 4 级以上的标题渲染
    extractHeaders: ["h2", "h3", "h4", "h5", "h6"],
  },

  //@ts-ignore
  plugins: [
    ["@vuepress/back-to-top"],
    ["@vuepress/medium-zoom"],
    // [
    //   "sitemap",
    //   {
    //     hostname: domain,
    //   },
    // ],
    ["vuepress-plugin-tags"],
    [
      "vuepress-plugin-code-copy",
      {
        successText: "代码已复制",
      },
    ],
    ["img-lazy"],
  ],

  themeConfig: {
    logo: '/logo.png',
    nav: [],
    sidebar,
    lastUpdated: "最近更新",

    // GitHub 仓库位置
    repo: "jzyismylover/ubuntu-markdown",
    docsBranch: "docs",

    // 编辑链接
    editLinks: true,
    editLinkText: "完善页面",
  }
})