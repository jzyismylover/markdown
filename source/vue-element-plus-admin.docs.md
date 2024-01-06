# vue-element-plus-admin

> 基于 `vue3`、`typescript`、`element-plus`、`tailwindCSS` 多功能的后台管理系统

## layout

从整体 `layout` 来说，默认的布局方式：左菜单、右内容区。内容区又可以细分为

- 顶部工具：包括面包屑、全屏、切换语言、个人信息
- tabs 标签：展示路由操作历史，可跳转、关闭、刷新
- 内容区：展示每个菜单对应的内容 ( `<router-view />` )
- footer：copyright 显示

<img src="/home/jzy/Documents/markdown/source-code/vue-element-plus-admin.docs.assets/image-20231030223944167.png" style="display: block; margin: auto;"/>

布局不难实现，主要是能够实现布局可配置化

<img src="/home/jzy/Documents/markdown/source-code/vue-element-plus-admin.docs.assets/image-20231030224418441.png" style="display: block; margin: auto;"/>

布局可配置化指的是用户能够通过自定义设置来展示 UI，如上，用户可配置菜单显隐、系统主题、头部主题……，因此就必须代码组织必须灵活。

**`store/modules/app.ts`**：这个 `pinia store` 集成了所有可配置系统选项，个人认为可以概括为两部分

- 一次性配置：面包屑、折叠菜单、标签页…… 这些可以理解为是对系统的控件进行配置
- 持久性配置：系统主题、组件尺寸、动态路由……这些可以理解为是系统级别配置

```ts
// pinia structure
export const useAppStore = defineStore("app", {
  state: (): AppState => {
    return {};
  },
  actions: {},
  getters: {}, // 计算属性
});

// 可在非 setup 外使用
export const useAppStoreWithOut = () => {
  return useAppStore(store);
};
```

在 `state` 中定义配置选项，在 `getters` 中暴露获取配置选项的方法，个人感觉这是个比较好的模式

```ts
state: () => {
    return {
        mobile: false,
        pageLoading: false
    }
}

getters: {
    getMobile() {
		return this.mobile
    },
    getPageLoading() {
        return this.pageLoading
    }
}
```

配置总体可分为

```ts
const source = `
      // 面包屑
      breadcrumb: ${appStore.getBreadcrumb},
      // 面包屑图标
      breadcrumbIcon: ${appStore.getBreadcrumbIcon},
      // 折叠图标
      hamburger: ${appStore.getHamburger},
      // 全屏图标
      screenfull: ${appStore.getScreenfull},
      // 尺寸图标
      size: ${appStore.getSize},
      // 多语言图标
      locale: ${appStore.getLocale},
      // 标签页
      tagsView: ${appStore.getTagsView},
      // 标签页图标
      getTagsViewIcon: ${appStore.getTagsViewIcon},
      // logo
      logo: ${appStore.getLogo},
      // 菜单手风琴
      uniqueOpened: ${appStore.getUniqueOpened},
      // 固定header
      fixedHeader: ${appStore.getFixedHeader},
      // 页脚
      footer: ${appStore.getFooter},
      // 灰色模式
      greyMode: ${appStore.getGreyMode},
      // layout布局
      layout: '${appStore.getLayout}',
      // 暗黑模式
      isDark: ${appStore.getIsDark},
      // 组件尺寸
      currentSize: '${appStore.getCurrentSize}',
      // 主题相关
      theme: {
        // 主题色
        elColorPrimary: '${appStore.getTheme.elColorPrimary}',
        // 左侧菜单边框颜色
        leftMenuBorderColor: '${appStore.getTheme.leftMenuBorderColor}',
        // 左侧菜单背景颜色
        leftMenuBgColor: '${appStore.getTheme.leftMenuBgColor}',
        // 左侧菜单浅色背景颜色
        leftMenuBgLightColor: '${appStore.getTheme.leftMenuBgLightColor}',
        // 左侧菜单选中背景颜色
        leftMenuBgActiveColor: '${appStore.getTheme.leftMenuBgActiveColor}',
        // 左侧菜单收起选中背景颜色
        leftMenuCollapseBgActiveColor: '${appStore.getTheme.leftMenuCollapseBgActiveColor}',
        // 左侧菜单字体颜色
        leftMenuTextColor: '${appStore.getTheme.leftMenuTextColor}',
        // 左侧菜单选中字体颜色
        leftMenuTextActiveColor: '${appStore.getTheme.leftMenuTextActiveColor}',
        // logo字体颜色
        logoTitleTextColor: '${appStore.getTheme.logoTitleTextColor}',
        // logo边框颜色
        logoBorderColor: '${appStore.getTheme.logoBorderColor}',
        // 头部背景颜色
        topHeaderBgColor: '${appStore.getTheme.topHeaderBgColor}',
        // 头部字体颜色
        topHeaderTextColor: '${appStore.getTheme.topHeaderTextColor}',
        // 头部悬停颜色
        topHeaderHoverColor: '${appStore.getTheme.topHeaderHoverColor}',
        // 头部边框颜色
        topToolBorderColor: '${appStore.getTheme.topToolBorderColor}'
      }
    `;
```

> 实现可配置化的布局

```ts
const appStore = useAppStore(); // pinia 配置状态存储
const renderLayout = () => {
  const layout = appStore.getLayout;
  switch (unref(layout)) {
    case "classic":
      const { renderClassic } = useRenderLayout();
      return renderClassic();
    case "topLeft":
      const { renderTopLeft } = useRenderLayout();
      return renderTopLeft();
    case "top":
      const { renderTop } = useRenderLayout();
      return renderTop();
    case "cutMenu":
      const { renderCutMenu } = useRenderLayout();
      return renderCutMenu();
    default:
      break;
  }
};
```

```tsx
const renderClassic = () => {
    return (
      <>
         <div
          class={[
            `${prefixCls}-content`,
            'absolute top-0 h-[100%]',
            {
              /* 折叠菜单 */
              'w-[calc(100%-var(--left-menu-min-width))] left-[var(--left-menu-min-width)]':
                collapse.value && !mobile.value,
               /* 展开菜单 */
              'w-[calc(100%-var(--left-menu-max-width))] left-[var(--left-menu-max-width)]':
                !collapse.value && !mobile.value,
              'fixed !w-full !left-0': mobile.value
            }
          ]}
          style="transition: all var(--transition-time-02);"
        >
      </>
    )
}
```

参考上面部分 `jsx`，项目可配置化基于 `css variables` 来控制，在 `:root` 上挂载一些 `css 变量`，然后通过选项配置、配合 `tailwindCSS` 动态设置 `classname` 改变布局

```css
:root {
  --left-menu-max-width: 200px;
  --left-menu-min-width: 64px;
  --transition-time-02: 0.2s;
}
```

> !!! `less` 变量

`hooks` 里面有一个 `useDesign` 方法，暴露出全局 `css` 命名前缀，而变量的导出则是通过 `CSS Module` 的方式在 less 文件导出变量

```ts
import variables from "@/styles/variables.module.less";

export const useDesign = () => {
  const lessVariables = variables;

  /**
   * @param scope 类名
   * @returns 返回空间名-类名
   */
  const getPrefixCls = (scope: string) => {
    return `${lessVariables.namespace}-${scope}`;
  };

  return {
    variables: lessVariables,
    getPrefixCls,
  };
};
```

```less
/* variables.module.less */

// 命名空间
@namespace: v;
// el命名空间
@elNamespace: el;

// 导出变量
:export {
  namespace: @namespace;
  elNamespace: @elNamespace;
}
```

> 其实我一直对于颜色配置有个疑问，在配置面板配置颜色后其实并不会说所有的容器的背景色都会发生变化，而是在黑白才会有明显的区分，怎么做到对颜色亮度的衡量区分？

```js
/* colorIsDark */
export const colorIsDark = (color: string) => {
  if (!isHexColor(color)) return;
  const [r, g, b] = hexToRGB(color)
    .replace(/(?:\(|\)|rgb|RGB)*/g, "")
    .split(",")
    .map((item) => Number(item));
  return r * 0.299 + g * 0.578 + b * 0.114 < 192;
};
```

### 菜单

<img src="/home/jzy/Documents/markdown/source-code/vue-element-plus-admin.docs.assets/image-20231105101542241.png" style="display: block; margin: auto;"/>

> 菜单主题怎么去配置？总体有以下一些配置选项

```ts
const theme: Recordable = {
  // 左侧菜单边框颜色
  leftMenuBorderColor: isDarkColor ? "inherit" : "#eee",
  // 左侧菜单背景颜色
  leftMenuBgColor: color,
  // 左侧菜单浅色背景颜色
  leftMenuBgLightColor: isDarkColor ? lighten(color!, 6) : color,
  // 左侧菜单选中背景颜色
  leftMenuBgActiveColor: isDarkColor
    ? "var(--el-color-primary)"
    : hexToRGB(unref(primaryColor), 0.1),
  // 左侧菜单收起选中背景颜色
  leftMenuCollapseBgActiveColor: isDarkColor
    ? "var(--el-color-primary)"
    : hexToRGB(unref(primaryColor), 0.1),
  // 左侧菜单字体颜色
  leftMenuTextColor: isDarkColor ? "#bfcbd9" : "#333",
  // 左侧菜单选中字体颜色
  leftMenuTextActiveColor: isDarkColor ? "#fff" : "var(--el-color-primary)",
  // logo字体颜色
  logoTitleTextColor: isDarkColor ? "#fff" : "inherit",
  // logo边框颜色
  logoBorderColor: isDarkColor ? color : "#eee",
};
```

> 菜单生成

菜单生成可以分为三种模式

- 后端生成带权限路由
- 前端生成带权限路由
- 前端使用静态路由

```ts
// premission.ts
    generateRoutes(
      type: 'server' | 'frontEnd' | 'static',
      routers?: AppCustomRouteRecordRaw[] | string[]
    ): Promise<unknown> {
      return new Promise<void>((resolve) => {
        let routerMap: AppRouteRecordRaw[] = []
        if (type === 'server') {
          // 模拟后端过滤菜单
          routerMap = generateRoutesByServer(routers)
        } else if (type === 'frontEnd') {
          // 模拟前端过滤菜单
          routerMap = generateRoutesByFrontEnd(cloneDeep(asyncRouterMap), routers as string[])
        } else {
          // 直接读取静态路由表
          routerMap = cloneDeep(asyncRouterMap)
        }
        // 动态路由，404一定要放到最后面
        this.addRouters = routerMap.concat([
          {
            path: '/:path(.*)*',
            redirect: '/404',
            name: '404Page',
            meta: {
              hidden: true,
              breadcrumb: false
            }
          }
        ])
        // 渲染菜单的所有路由（constantRouterMap 指的是一些无权限路由）
        this.routers = cloneDeep(constantRouterMap).concat(routerMap)
        resolve()
      })
    },
```

从上面菜单生成可以看出除了细分为三种不同的路由生成方式，其实还有动态路由、`constantRouterMap`

- 动态路由：作为降级路由，匹配不存在的路径重定向到 404
- `constantRouterMap`：无权限且不展示的路由项，通常是由前端定义的登陆页、重定向页

#### 后端生成

后端生成首先需要前后端协调好具体的格式以及对应的参数，要点主要有：

- 路径 `path` 的设定，因为返回的是一个 `string`，因此需要提前规划好怎么最后把路径映射到对应位置的 `vue` 文件上
- 原数据 `meta` 的设定，元数据主要控制权限以及对应路由参数，包括该路由项是否可见，什么角色权限的用户可以访问

```ts
function generateRoutesByServer(routes) {
  const res = [];
  for (const route of routes) {
    const data = {
      // 作为添加到 vue-router 上的路由项
      path: route.path,
      name: route.name,
      redirct: route.reditct,
      meta: route.meta,
    };
    // 处理 component(不同 crm 根据各自项目文件命名规范有所不同)
    const modules = import.meta.glob("../views/**/*.{vue,tsx}");
    const currentComponent =
        modules[`../${route.component}.vue`] ||
        modules[
          `../${route.component}.tsx`
        ] /* 基于约定好 route.component为前端组件目录，如 views/src/dashboard/index */,
      component = route.component;
    if (!currentComponent && !component.includes("#")) {
      /* 找不到组件所在且不作为顶层父路由 */
      warning();
    } else {
      route.component = component === "#" ? Layout : currentComponent;
    }

    // 递归处理 children
    if (route.children && route.children.length) {
      route.children = generateRoutesByServer(route.children);
    }

    res.push(data);
  }
  return res;
}
```

#### 前端生成

其实项目里面 `fronted` & `static ` 界定有点模糊，从个人的角度，可以理解为就是使用前端定义的静态路由来渲染菜单。

```ts
// router.ts
export const aysncRoutes = [];

// permission.ts
routerMap = cloneDeep(asyncRoutes);
```

> 生成路由后，就是如何根据路由去生成菜单，总的来说需要做的工作

- 菜单过滤

  - 路由角色过滤，即针对当前用户哪些路由是不可见

  > 当然不做这方面的过滤也是 ok 的，可以在路由跳转的时候前端再根据当前角色判断是否有权限去进行路由跳转（路由拦截器）

  - `true`：顺利跳转到目标页面
  - `false`：重定向到权限申请页面或者给一个全局信息提示

  :imp: 看情况吧，如果涉及到权限申请的功能就没必要作这个限制了

- 区分 `menu` & `menuGroup`

  - `menu`：单菜单
  - `menuGroup`：菜单分组

```ts
function hasOneShowChildren(children, parent) {
    const onlyOneChild = ref(null)
    const showChildrenLists = children.filter(v => {
        if(!v.hidden) return false
        else {
            onlyOneChild = v
        }
    })

    // 只有一个 children
    if(showChildrenLists.length === 1) {
        return {
            oneShowingChild: true
            onlyOneChild: unref(onlyOneChild)
        }
    }

	// 没有 children
	else if(!showChildrenLists.length) {
        onlyOneChild.value = { ...parent, path: '', noShowingChildren: true } // noShowingChildren作为该情况标识
        return {
            oneShowingChild: true,
            onlyOneChild: unref(onlyOneChild)
        }
    }

	// 需递归渲染子路由
	else {
        return {
           oneShowingChild: false,
           onlyOneChild: unref(onlyOneChild)
  		}
    }
}
```

#### 渲染菜单

```tsx
function renderMenuItem(routes, parentPath = '/') {
	const routes = routes ?? permissionStore.getRoutes
    routes.map(v => {
        if(v?.meta?.hidden) {
            const { oneShowingChild, onlyOneChild } = hasOneShowChildren(routes)
            const fullpath = isUrl(path) ? path : pathResole(parentPath, v.path)
            // 渲染 menu-item
            if(oneShowingChild &&
              (!onlyOneChild?.children || onlyOneChild?.noShowingChildren) &&
              !meta?.alwaysShow) {
                return <ElMenuItem index={onlyOneChild ? pathResolve(fullpath, onlyOneChild.path)}></ElMenuItem>
            }
            // 渲染 submenu(递归 renderMenuItems)
            else {
                return <ElSubMenu>
                    {{
                        default: () => renderMenuItem(v.children!, fullpath) /* 默认插槽 */
                    }}
                </ElSubMenu>
            }
        }
    })
 }
```

### 工具栏

> 工具栏可以有什么配置选项?

```ts
const setHeaderTheme = (color: string) => {
  const isDarkColor = colorIsDark(color);
  const textColor = isDarkColor ? "#fff" : "inherit";
  const textHoverColor = isDarkColor ? lighten(color!, 6) : "#f6f6f6";
  const topToolBorderColor = isDarkColor ? color : "#eee";
  setCssVar("--top-header-bg-color", color);
  setCssVar("--top-header-text-color", textColor);
  setCssVar("--top-header-hover-color", textHoverColor);
  appStore.setTheme({
    // 头部背景色
    topHeaderBgColor: color,
    // 头部字体颜色
    topHeaderTextColor: textColor,
    // 头部悬停颜色
    topHeaderHoverColor: textHoverColor,
    // 头部边框颜色
    topToolBorderColor,
  });
  if (unref(layout) === "top") {
    setMenuTheme(color);
  }
};
```

#### 面包屑

> 面包屑是什么？面包屑是一种“历史记录”的应用方式，让用户比较明确地知道自己所处网站位置。为了浏览体验，一般情况只有 3 级，首页>栏目页>内容页，3 层目录结构可以让用户随时随地的找到自己所在的位置又能保证栏目分类后的各个栏目的权重不至于太分散。

从具体实现来说：

1. 获得当前所在页面路由
2. 将所有子路由项的 `path` 拼接完整 （递归）
3. 过滤得到一个满足当前路由路径的路由子项，返回完整的父级路由树（递归）
4. 将步骤三得到的路由树平铺为数组
5. 循环步骤 4 得到的数组渲染 `Breadcrumb`

```ts
/* step 2 */
function filterBreadcrumb(routes, parentPath = "") {
  const res = [];
  for (const route of routes) {
    const meta = route.meta || {};
    // 过滤不可见路由
    if (meta.hidden && !meta.canTo) continue;

    // 只有一个子项
    const data =
      !meta.alwaysShow && route.children?.length === 1
        ? {
            ...route.children[0],
            path: pathResolve(route.path, route.children[0].path),
          }
        : { ...route };

    data.path = pathResolve(parentPath, data.path);

    // 递归
    if (data.children) {
      data.children = filterBreadcrumb(data.children, data.path);
    }
    res.push(data);
  }
  return res;
}
```

> `step2` 目的主要有两个
>
> 1. 过滤掉不可见的路由 `/login`、`/redirct`、`/error`、`/` （不应该出现在面包屑中）
>
> 2. 通过递归整个路由树，将二级甚至多级路由的 `path` 属性补全为完整路径，方便 `step3` 进行 `filter` 匹配

```ts
/* step 3 */
function filter(list, filterFunction, config = {}) { /* filterFunction: (node) => node.path === currentPath */
    const children = config.children ?? 'children'
    const filterList = (list) => {
		list
            .map(v => { ...v })
        	.filter(v => {
            	v.children = v.children && filterList(v.children, filterFunction)
                return filterFunction(v) || (v.children && v.children.length)
        	})
    }
    return filter(list)
}
```

> `step3` 实现的逻辑是如果子项满足筛选条件的化就返回带有子项的整个路由树，因此 `filter` 函数的原则有两个
>
> 1. 满足 `filterFunction`：主要针对子项來說，路由是匹配的
> 2. 子項不爲空：主要针对顶层或者父级路由來說，其子項匹配則该父项也应入到最后的結果中

```ts
/* step 4 */
function treeToList(treeLists) {
  const res = [];
  treeLists = [...treeLists];
  for (const treeNode of treeLists) {
    if (treeNode.children) res.concat(treeToList(treeNode.children));
    else {
      res.push({ ...treeNode });
    }
  }
  return res;
}
```

> `step4` 实现的逻辑可以理解为是一个平铺树的算法题，上面采用基本的递归实现，项目中有一个非常有意思的实现方式
>
> ```ts
> function treeToList(treeLists) {
>     treeLists = [...treeLists]
>     for(let i=0; i < treeLists.length, i++) {
>         const item = treeLists[i]
>         if(!item.children) { continue }
>         treeLists.splice(i + 1, 0, ...result[i].children)
>     }
>     return treeLists
> }
> ```

### 路由标签页

> 路由标签页：提供一个可以让用户切换到之前已经访问过的页面的快捷方式

<img src="/home/jzy/Documents/markdown/source-code/vue-element-plus-admin.docs.assets/image-20231105155644009.png" style="display: block; margin: auto;"/>

功能设计：

1. 定义 `store` ，包含访问历史数据、对应 `tabs` 的操作方法
2. 监听当前路由，动态切换 `tabs`（当 `tabs` 列表比较长的时候能实现滚动到对应 `tabs-item`）
3. 点击 `tab-item`，路由切换，页面刷新

具体逻辑：

1. 初始化 `tabs`：找出哪些是需要初始就展示的 `tabs`（固定）
2. `store` 数据&方法定义：定义存储访问过的、目前的 `state` 以及一系列增删改对应 `actions` 方法
3. 定义 `useTagViews` 方法，作为 `hooks` 包含 `store` 处理方法的同时可额外传入 `callback`
4. 根据 `vistedTags` 渲染 `tabs` 列表，配置工具栏（刷新、删除当前、删除其他、删除左侧、删除右侧、删除全部）
5. 监听路由变化，当路由改变时滚动到对应的 `tag` 标签 ( `scrollLeft` )

- `Step 3`

```ts
function filterAffixTags(routes, parentPath) {
  let tags = []; // 固定的 tag 列表
  routes.forEach((route) => {
    const meta = route.meta ?? {};
    const tagPath = pathResolve(parentPath, route.path);
    if (meta?.affix) {
      tags.push({ ...route, path: tagPath });
    }

    if (route.children) {
      const tempTags = filterAffixTags(route.children, tagPath);
      tempTags && (tags = [...tags, ...tempTags]);
    }
  });
  return tags;
}
```

- `Step 2`

```ts
/* tagsView.ts */
export const useTagsViewStore = defineStore('tagsView', {
    state: () => {
        return {
            vistedTags: [], // 存储历史访问过的路由记录
            selectedTag: null， // 存储当前正在访问的路由记录
        }
    }，
   	actions: {
   		/* 关闭其他 tabs */
    	closeAllTags() {
  		  this.visitedViews.filter((tag) => tag?.meta?.affix)
		},
       /* 关闭左侧 tabs */
        closeLeftTags(view) {
          const idx = this.visitedViews.findIndex(v => v.path === view.path)
          return this.visitedViews.filter((v, i) => {
              return v?.meta?.affix || v.path === view.path || i > idx
          })
        },
       /* 关闭右侧 tabs */
        closeRightTags(view) {
            const idx = this.visitedViews.findIndex(v => v.path === view.path)
        	return this.visitedViews.filter((v, i) => {
                return v?.meta?.affix || v.path === view.path || i < idx
            })
        }
		/* 其他若干反 */
	}
})
```

**下面就是主要内容区功能封装，笔记是对 utils 函数以及组件封装的思路，utils 实现统一记录在 `utils-collections` **

## dashboard

> 这部分主要是 （分析页、工作台） 模块

### Count.vue

> 缓动递增/递减数值

`props` 定义

- duration：动画持续时间

- startVal：开始值
- endVal：结束值
- easingFn：动画函数

基本实现逻辑：

1. 确定初始值、结束值、变化动画函数、动画持续时间，这四个值是最基础能保证功能实现的参数
2. 判断初始值与结束值的大小来确定是增还是减
3. 判断是否有自定义动画函数，如果没有则采用 `requestAnimationFrame` 函数参数中的 `timestamp` 参数，根据 `timestamp` 每次增加来计算进度条

可拓展实现：

- 支持小数类型
- 支持添加千分位分隔符（100,000, 100, 000, 000）
- 支持添加显示前缀后缀

### Echarts.vue

> echarts hooks

`props` 定义

- options：`echarts ` 选项
- width：容器宽度
- height：容器高度

基本实现逻辑：

1. 定义全局 `echarts` （注册必要 `plugins`）

2. 初始化 `domRef`，根据 props 传参判断是否在挂载完成后初始化 `echarts`
3. 监听选项的变化动态更新 `echarts`（setOptions）
4. 监听屏幕变化动态缩放 `echarts`（echartRef.resize）
5. 组件卸载阶段移除屏幕事件监听

> 对应 `vben-admin` 里面的实现，有好有坏

好处在于：将 `echarts` 初始化以及对应逻辑封装到 `vue` 文件里面，在使用的时候引入组件即可

不好在于：如果需要支持地图（需要注册地图数据），只能去 props 中添加标识然后初始化的时候补充逻辑；而在 `vben-admin` 中，则是封装为一个 `useEcharts` ，内部暴露出 `echarts` 实例、`setOptions` 等各种属性方法，调用更加灵活。

## guide

> 引导页

直观来讲就是递进高亮某个区块引导用户熟悉操作流程的过程

实现逻辑：

- 使用 [`driver.js`](https://github.com/kamranahmedse/driver.js/blob/master/src/events.ts)，封装 `useGuide`，指定` `options 数组作为步骤列表

## components

> 组件封装模块，这个也应该是最值得去学习的模块。表格 & 表单这两个封装过程比较复杂，需慢慢消化

:key: 数据双向绑定

代码里面比较显而易见的双向绑定可以参考 “密码强度” —— 密码文本框之间存在一个双向绑定过程。

- 项目的实现逻辑：子组件`ref` 变量使用 `props` 作为初始值初始化。子组件数据发生变化时调用 `emit` 更新父组件数据。和之前预想思路差不多，少了个监听 `props` 的逻辑，因为子组件状态完全由本身本身，除了初始化其余情况不需要由父组件控制更新。

> 对于表单 & 表格，遵循可配置化，即通过 `JS` 来控制子元素生成

### 表单

首先理解通过配置文件去生成整个表单这个概念。我我觉得和之前在工作中使用 JS 变量去控制表单生成无异，关键在：

- 定义好每一项需要传入的参数

根据定义好的参数去覆盖不同可能出现场景

```ts
// 继承 el-form props
export interface FormProps extends Partial<ElFormProps> {
  // 表单元数据
  schema?: FormSchema[];
  // 栅格布局标识
  isCol?: boolean;
  // 表单绑定数据
  model?: Recordable;
  // placeholder 设置标识
  autoSetPlaceholder?: boolean;
  // 自定义默认插槽标识
  isCustom?: boolean;
  [key: string]: any;
}
```

`schema`

```ts
export interface FormSchema {
  /**
   * 唯一标识
   */
  field: string;

  /**
   * 标题
   */
  label?: string;

  /**
   * col组件属性
   */
  colProps?: ColProps;

  /**
   * 表单组件属性
   */
  componentProps?:
    | InputComponentProps
    | AutocompleteComponentProps
    | InputNumberComponentProps
    | SelectComponentProps
    | SelectV2ComponentProps
    | CascaderComponentProps
    | SwitchComponentProps
    | RateComponentProps
    | ColorPickerComponentProps
    | TransferComponentProps
    | RadioGroupComponentProps
    | RadioButtonComponentProps
    | DividerComponentProps
    | DatePickerComponentProps
    | DateTimePickerComponentProps
    | TimePickerComponentProps
    | InputPasswordComponentProps
    | TreeSelectComponentProps
    | UploadComponentProps
    | JsonEditorProps
    | any;

  /**
   * formItem组件属性
   */
  formItemProps?: FormItemProps;

  /**
   * 渲染的组件名称
   */
  component?: ComponentName;

  /**
   * 初始值
   */
  value?: any;

  /**
   * 是否隐藏，如果为true，会连同值一同删除，类似v-if
   */
  remove?: boolean;

  /**
   * 样式隐藏，不会把值一同删掉，类似v-show
   */
  hidden?: boolean;

  /**
   * @returns 远程加载下拉项
   */
  optionApi?: any;
}
```

从以上属性可以看出，在保证 `form-item` 以及对应表单控件原 `element-plus` 属性支持的情况下再拓展一些其他属性。 `Input` 控件自定义属性类型如下：

```ts
export interface InputComponentProps extends Partial<InputProps> {
  rows?: number;
  on?: {
    blur?: (event: FocusEvent) => void;
    focus?: (event: FocusEvent) => void;
    change?: (value: string | number) => void;
    clear?: () => void;
    input?: (value: string | number) => void;
  };
  slots?: {
    prefix?: (...args: any[]) => JSX.Element | null;
    suffix?: (...args: any[]) => JSX.Element | null;
    prepend?: (...args: any[]) => JSX.Element | null;
    append?: (...args: any[]) => JSX.Element | null;
  };
  style?: CSSProperties;
}
```

把事件封装在 on & 插槽封装在 slots 中是因为 **JSX** 需要这样的数据结构

### 表格

### 编辑器

> 包括富文本编辑器 & JSON 编辑器

#### 富文本编辑器

封装 `@wangeditor/editor`、`@wangeditor/editor-for-vue`

#### JSON 编辑器

严格意义上并不算是编辑器，可以理解为是一个 `JSON` 格式化工具，基于 `vue-json-pretty` 实现

### 图片预览

> `element-plus` 自带有一个 `ElImageViewer` 组件

封装思路：

1.  定义一个 `createViewer` 函数，传入 `urlLists`
2.  在触发预览操作的时候，使用 `render` 函数动态创建 `imageViewer`

- 之前想法：`imageViewer` 作为一个组件写入夫组件，通过在父组件维护一个 `isShow` 变量控制显示隐藏；

- 目前实现：每次触发预览只需要调用 `createViewer` 函数即可，父组件不再需要维护控制变量（解耦）。

  ```typescript
  import { render, createVNode } from "vue";

  function createViewer(urlList: string[]) {
    const vnode = createVNode(ImageViewer, propsData);
    const container = document.createElement("script");
    document.body.appendChild(container);
    render(vnode, container); // 挂载 vnode 到 container 上
  }
  ```

### 图标

> 图标和图标选择器可以纳入一起学习

阅读完有几个疑问：

1. 项目中包括了三个不同的图标来源，但是没看到具体如何去引入相关 CSS 资源
2. 如何做到图标的按需打包

:key: Answer

使用 `@iconify/vue` —— 包含若干 [图标集](https://icon-sets.iconify.design/)

<img src="/home/jzy/Documents/markdown/source-code/vue-element-plus-admin.docs.assets/image-20231115231518237.png" style="display: block; margin: auto;"/>

​ 一般来说 `api-provider` 可忽略，`icon-prefix` 代表是哪个图标集合，`icon-name` 表示具体的图标

而项目中之所以能渲染三个不同类型的图标库也是得益于此

### 二维码

> 基于 `qrcode` 实现，具体使用的时候可以参考 [官方文档](https://www.npmjs.com/package/qrcode)

### 高亮

> 高亮的指的是对指定文段中的部分短语或句子进行高亮显示（与普通文段作颜色上区分）

实现原理：

1. 高亮组件渲染函数，接收 props

   ```js
   highlightPhrase: string[]
   highlightColor: string
   ```

2. 传入需要高亮的内容列表，建立正则匹配内容并替换为 {{ index }}，index 代表索引

3. 按 {{|}}切割文本，得到文段分组。

4. 遍历文段分组，如果单一分组类型为数字说明为需要高亮的短语（`hightlightPhrase[index]`）

### 密码强度

> 1-5 五个等级，给出当前密码强度

实现原理：

1. 原生 `CSS` 绘制原始密码强度 UI。借助 `::before` & `::after` 伪类，以 `border-left` & `border-right` 作为切割点，切割出四个缺口形成五个等级 `step`

2. `zxcvbn` 计算密码强度

3. `CSS` 属性选择器设置在不同 `level` 下背景色

   ```css
   div[data-score="0"] {
     width: 20%; /* 40% 60% 80% 100% */
     background-color: var(--el-color-danger);
   }
   ```

### 瀑布流

> 列宽度相同，不同列纵向元素高度不尽相同

功能：

- 能根据屏幕响应式进行布局
- 首屏如果加载不完则自动继续加载（滚动加载）

实现原理（基于绝对定位）：

1. 首先根据屏幕宽度确定有多少列（ `Math.floor(document.documentElement.clientWdith / preWidth) ` ）

2. 遍历数据，分为两种情况

   1. 第一行所有列未填满：加入待渲染列表；

      ```ts
      /*
        i: 第 i 列
        preWidth: 列宽度
        gap: 元素间距
      */
      renderLists.push({
        top: 0,
        left: i * (preWidth + gap), // 往后推一列
      });
      ```

   2. 第一行所有列已填满：需要计算哪一列高度最小（逻辑上将下一个元素插入到当前列，通过 `top` 、`left` 描述这个过程）

      ```ts
      /*
        i: 第 i 列
        minHeight: 最小高度
      */
      renderLists.push({
        top: minHeight + gap,
        left: i * (preWidth + gap),
      });
      ```

3. 计算容器高度

   ```js
   wrapperWidth = cols * (preWidth + gap) - gap;
   wrapperHeigth = Math.max(...heights);
   ```

4. 滚动加载

   使用到了 `@vueuse/core` 里面的 `useIntersectionObserver`。当加载更多的容器进入视口时触发父组件数据获取函数，通过 `loading` & `end` 变量来控制加载的时机。列表组件可以单纯地理解为是一个展示组件，数据获取 & 状态控制均为外部控制。
