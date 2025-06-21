import { defineClientConfig } from "vuepress/client";
import DrawioViewer from "./components/DrawioViewer.vue";

export default defineClientConfig({
  enhance({ app, router, siteData }) {
    // 注册全局组件
    app.component("DrawioViewer", DrawioViewer);
  },

  setup() {
    // 在这里可以进行一些全局的设置
  },

  layouts: {
    // 可以在这里定义自定义布局
  },

  rootComponents: [
    // 根组件
  ],
});
