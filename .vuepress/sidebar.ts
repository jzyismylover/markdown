import type { SidebarConfig4Multiple } from "vuepress/config";
import algorithm from "./sidebars/algorithm";
import frontend from "./sidebars/frontend";

// @ts-ignore
export default {
  "/algorithm/": algorithm,
  "/frontend/": frontend,
  "/": "auto",
} as SidebarConfig4Multiple;
