import type { SidebarConfig4Multiple } from 'vuepress/config'
import algorithm from './sidebars/algorithm'
import fronted from './sidebars/fronted'

// @ts-ignore
export default {
  '/algorithm/': algorithm,
  '/fronted/': fronted,
  '/': 'auto'
} as SidebarConfig4Multiple