> vben-admin 开源项目学习，以下主要记录里面涉及到的知识点



## vue3



### api

> 涉及 vue3 里面暴露出去的不熟悉 api

#### InjectionKey

为 `provide / inject` 标注类型。 Vue 提供了一个 `InjectionKey` 接口，它是一个继承自 `Symbol` 的泛型类型，可以用来在提供者和消费者之间同步注入值的类型 [参考](https://cn.vuejs.org/guide/typescript/composition-api.html#typing-provide-inject)

```tsx
import { provide, inject } from 'vue'
import type { InjectionKey } from 'vue'

const key = Symbol() as InjectionKey<string>

provide(key, 'foo') // 若提供的是非字符串值会导致错误

const foo = inject(key) // foo 的类型：string | undefined
```

#### UnwrapRef

```ts
type UnwrapRef<T> = T extends Ref<infer R> ? R : T

UnwrapRef<Ref<number>> // number
```





### hooks

> 里面比较有意思 hooks 函数

#### useMessage

`useMessage` 主要是配置封装`antd` 消息组件以便在全局引入使用

- `notifycation`

```ts
import { NotificationArgsProps, ConfigProps } from 'ant-design-vue/lib/notification';

// Notifycation 组件提供的方法列表
export interface NotifyApi {
  info(config: NotificationArgsProps): void;
  success(config: NotificationArgsProps): void;
  error(config: NotificationArgsProps): void;
  warn(config: NotificationArgsProps): void;
  warning(config: NotificationArgsProps): void;
  open(args: NotificationArgsProps): void;
  close(key: String): void;
  config(options: ConfigProps): void;
  destroy(): void;
}

// 全局配置 notifycation 选项
notification.config({
  placement: 'topRight', // 出现位置
  duration: 3, // 持续时间
});
```

- `model` ：配置较多，主要需要区分 `图标`、`弹出类型`

  - 定义 `model` 调用方法传入的参数类型

    ```ts
    export interface ModalOptionsEx extends Omit<ModalFuncProps, 'iconType'> {
      iconType: 'warning' | 'success' | 'error' | 'info';
    }
    export type ModalOptionsPartial = Partial<ModalOptionsEx>;
    ```

  - 定义 `model` 组件 `icon`

    ```ts
    import { InfoCircleFilled, CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons-vue';
    
    function getIcon(iconType: string) {
      if (iconType === 'warning') {
        return <InfoCircleFilled class="modal-icon-warning" />;
      } else if (iconType === 'success') {
        return <CheckCircleFilled class="modal-icon-success" />;
      } else if (iconType === 'info') {
        return <InfoCircleFilled class="modal-icon-info" />;
      } else {
        return <CloseCircleFilled class="modal-icon-error" />;
      }
    }
    ```

  - 定义 `model` 内容渲染函数（需要区分是 `组件类型` 还是`普通文本` ） 

    ```ts
    function renderContent({ content }: Pick<ModalOptionsEx, 'content'>) {
      if (isString(content)) {
        return <div innerHTML={`<div>${content as string}</div>`}></div>;
      } else {
        return content;
      }
    }
    ```

  - 定义 `model` 基础配置，如 `确认按钮文字` 、`是否垂直居中`，同时提供一个 `options` 创建函数，合并 `baseOptions` 以及外部传入的参数

    ```ts
    const getBaseOptions = () => {
      const { t } = useI18n();
      return {
        okText: t('common.okText'), // 确认按钮文字
        centered: true, // 垂直剧中展示 Modal 
      };
    };
    
    // 初始化配置
    function createModalOptions(options: ModalOptionsPartial, icon: string): ModalOptionsPartial {
      return {
        ...getBaseOptions(),
        ...options,
        content: renderContent(options),
        icon: getIcon(icon),
      };
    }
    ```

  - 有了配置信息，就是去创建对应的实例方法以便直接导出使用

    ```ts
    function createConfirm(options: ModalOptionsEx) {
      const iconType = options.iconType || 'warning';
      Reflect.deleteProperty(options, 'iconType');
      const opt: ModalFuncProps = {
        centered: true,
        icon: getIcon(iconType),
        ...options,
        content: renderContent(options),
      };
      return Modal.confirm(opt);
    }
    
    function createSuccessModal(options: ModalOptionsPartial) {
      return Modal.success(createModalOptions(options, 'success'));
    }
    
    function createErrorModal(options: ModalOptionsPartial) {
      return Modal.error(createModalOptions(options, 'close'));
    }
    
    function createInfoModal(options: ModalOptionsPartial) {
      return Modal.info(createModalOptions(options, 'info'));
    }
    
    function createWarningModal(options: ModalOptionsPartial) {
      return Modal.warning(createModalOptions(options, 'warning'));
    }
    
    ```

    



### vue-router

> 初始化实例

```ts
export const router = createRouter({
  history: createWebHashHistory(''),
  routes: basicRoutes,
  strict: true, // 禁用尾部 /
  scrollBehavior: () => ({ left: 0, top: 0 })
})
```

- `history` ：采用 `hash` 还是 `history`
- `strict`：通常来说，`/user` 可以匹配浏览器输入 `/user`、`/user/`，`strict` 配置为 `true` 则只允许第一种情况即没有尾部 `/` 的情况匹配成功

- `scrollBehavior`：路由切换完成滚动条的位置

### vue-i18n

> 实现网站国际化 —— 多语种切换

:key: 整体文件目录

```text
locales
├─helper.ts # utils（包括 setHtmlPageLang 、setLocalePool、genMessage）
├─setupI18n.ts # 初始化实例
├─useLocale.ts # 提供获取/更新当前语言环境的函数
├─lang # 资源包
|  ├─en.ts
|  ├─zh_CN.ts
|  ├─zh-CN
|  |   ├─common.ts
|  |   ├─component.ts
|  |   ├─layout.ts
|  |   ├─sys.ts
|  |   ├─routes
|  |   |   ├─basic.ts
|  |   |   ├─dashboard.ts
|  |   |   └demo.ts
|  ├─en
|  | ├─common.ts
|  | ├─component.ts
|  | ├─layout.ts
|  | ├─sys.ts
|  | ├─routes
|  | |   ├─basic.ts
|  | |   ├─dashboard.ts
|  | |   └demo.ts
```

对于 `i18n` 整个流程，其实可以分为：

- 自定义语种资源包
- 将资源包整合为一个 `object`
- `i18n` 实例创建，包括资源和配置初始化
- 提供获取和更新 `locale` 的 hooks `useLocale`
- 提供在 `模板` 和 `ts` 文件中使用的 `t函数` hooks  `useI18n`



1. 安装依赖

```bash
$ pmpm install vue-i18n
```



2. 定义获取资源包代码 —— 该步骤主要根据资源整合生成语种`资源映射`。具体在 `zh_CN.ts` 内部，基于 `vite` 提供的模块导入机制，通过 `genMessage` 将各个模块整合成对象，整个 `export default ` 出去的就是语言环境为中文的情况下的资源信息

```ts
import { genMessage } from '../helper';
import antdLocale from 'ant-design-vue/es/locale/zh_CN';
import momentLocale from 'moment/dist/locale/zh-cn';

const modules: Recordable = import.meta.glob('./zh-CN/**/*.ts', { eager: true });
export default {
  message: {
    ...genMessage(modules, 'zh-CN'),
    antdLocale,
  },
  momentLocale,
  momentLocaleName: 'zh-cn',
};

```

- `utils` —— 将资源名称以及对应的值整合成一个对象
  - 提取文件名作为 `object key`
  - 区分一级目录和二级目录 `routes/sys` & `common` 

```ts
/** 
 * @param langs { './zh-CN/common.ts': { default: {} }}
 * @param prefix language name
 * @return { setting: {
 *  login: { loginButton: '登陆' } 
 * }, header: {} }
 */
export function genMessage(langs: Record<string, Record<string, any>>, prefix = 'lang') {
  const obj: Recordable = {};

  Object.keys(langs).forEach((key) => {
    const langFileModule = langs[key]?.default;
    let filename = key.replace(`./${prefix}/`, '').replace(/^\.\//, '');
    const lastIndex = filename.lastIndexOf('.');
    filename = filename.substring(0, lastIndex); // 去除文件后缀
    const keyLists = filename.split('/'); // 基于文件目录是 routes/xxx
    const moduleName = keyLists.shift();
	
    if (moduleName) {
      if (keyLists.length) {
        set(obj, moduleName, obj[moduleName] || {});
        set(obj[moduleName], keyLists[0], langFileModule);
      } else {
        set(obj, moduleName, langFileModule || {});
      }
    }
  });

  return obj;
}
```



3. 提供 `i18n` 初始化函数
   1.  执行资源加载 `zh_CN.ts`
   2. 自定义 `i18n` 选项
   3. 暴露 `setupI18n` 给 `main.ts`

```ts
async function createI18nOptions(): Promise<I18nOptions> {
  const localeStore = useLocaleStoreWithout(); // 语言环境 store
  const locale = localeStore.getLocale; // 获得当前语言环境
  const defaultLocale = await import(`./lang/${locale}.ts`); // 获得加载资源包函数
  const message = defaultLocale.default?.message ?? {};

  setHtmlPageLang(locale);
  // 标识资源包已经被加载了
  setLocalePool((loadLocalePool) => {
    loadLocalePool.push(locale);
  });

  // i18n 配置选项
  return {
    legacy: false, // 使用 composition api 模式
    locale,
    fallbackLocale: fallback, // 回退语言
    availableLocales,
    messages: {
      [locale]: message,
    },
    silentTranslationWarn: true, // 禁止本地化失败警告
    missingWarn: false,
    silentFallbackWarn: true, // 仅在根本没有可用的转换时生成警告
  };
}

// main.ts 中用于初始化 i18n
export async function setupI18n(app: App<Element>) {
  const options = await createI18nOptions();
  i18n = createI18n(options) as I18n;
  app.use(i18n);
}
```



4. 有了初始化函数后初始的资源显示就没有问题了，但是缺少一个用于更新的函数 —— 当语言环境更新的时候需要进行什么操作

   1. 更新 `store locale`
   2.  判断当前语言环境情况

   <img src="/home/jzy/Documents/markdown/vben/vben.assets/image-20230629105852577.png" alt="image-20230629105852577" style="zoom: 67%;" />



5. 最后 `i18n` 的配置、更新都设置好了，就是如何在`模板`或者 `ts` 文件中引入的问题。实际可以抽取成一个 `hooks`

```ts
// 类型定义
type I18nGlobalTranslation = {
  (key: string): string;
  (key: string, locale: string): string;
  (key: string, locale: string, list: unknown[]): string;
  (key: string, locale: string, named: Record<string, unknown>): string;
  (key: string, list: unknown[]): string;
  (key: string, named: Record<string, unknown>): string;
};
interface I18nGlobalOptions extends Omit<typeof i18n.global, 't'> {
  t: I18nGlobalTranslation;
}
type I18nTranslationRestParameters = [string, any];

// composition api hooks
export function useI18n(namespace?: string): {
  t: I18nGlobalTranslation;
} {
  const normalFn = {
    t: (key: string) => {
      // return getKey(namespace, key); namespace 作用暂不明确
      return key
    },
  };

  if (!i18n) {
    return normalFn;
  }

  const { t, ...methods } = i18n.global as I18nGlobalOptions;

  const tFn: I18nGlobalTranslation = (key: string, ...arg: any[]) => {
    if (!key) return '';
    if (!key.includes('.') && !namespace) return key;
    return t(getKey(namespace, key), ...(arg as I18nTranslationRestParameters));
  };
  return {
    ...methods,
    t: tFn,
  };
}

// 在 setup 函数以外使用
export const t = (key: string) => key;
```

在用的时候就可以

```vue
<template>
 <div>{{ t('sys.login.loginButton') }}</div>
</template>

<script setup lang='ts'>
const { t } = useI18n()
</script>
```

> 为了在 vscode 中有对应信息提示，得下载一个 `i18 ally` 插件，并在项目 `settings.json` 中配置

```json
{
  "i18n-ally.localesPaths": ["src/locales/lang"], // 指定资源所在路径
  "i18n-ally.keystyle": "nested",
  "i18n-ally.sortKeys": true,
  "i18n-ally.namespace": true,
  "i18n-ally.pathMatcher": "{locale}/{namespaces}.{ext}",
  "i18n-ally.enabledParsers": ["json", "ts"],
  "i18n-ally.sourceLanguage": "en",
  "i18n-ally.displayLanguage": "zh-CN",
  "i18n-ally.enabledFrameworks": ["vue", "react"],
}
```





### pinia

> vue 目前流行的状态管理工具

```ts
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  getters: {
    double: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++
    },
  },
})
```

- `state`：`store` 中的数据
- `getter`：`store` 中的计算属性
- `actions`：`store` 中的 `method`



以上是最简 `pinia` 配置

当然除了以上 `option configuration`，也支持在构造函数内使用 `composition api` 的方式定义数据、计算属性和方法。

```ts
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  function increment() {
    count.value++
  }

  return { count, increment }
})
```



> :imp: 解构响应式属性 `storeToRefs `

```ts
<script setup>
import { storeToRefs } from 'pinia'
const store = useCounterStore()
// `name` 和 `doubleCount` 是响应式的 ref
// 会跳过所有的 action 或非响应式 (不是 ref 或 reactive) 的属性
const { name, doubleCount } = storeToRefs(store)
// 作为 action 的 increment 可以直接解构
const { increment } = store
</script>
```



> :imp: 使用 store

如果是在 `script setup` 内部的话，直接导入并执行函数即可

```ts
<script setup>
import { useCounterStore } from '@/stores/counter'
const store = useCounterStore()
</script>
```

如果不能使用组合式 `api`则需要使用映射辅助函数

```ts
export default defineComponent({
  computed: {
    // 允许访问 this.counterStore 和 this.userStore
    ...mapStores(useCounterStore, useUserStore)
    // 允许读取 this.count 和 this.double
    ...mapState(useCounterStore, ['count', 'double']),
  },
  methods: {
    // 允许读取 this.increment()
    ...mapActions(useCounterStore, ['increment']),
  },
})
```



## storage

> 项目中浏览器 `storage` 的设置，理解如下：

```text
cache
├─index.ts # 导出创建 storage 方法
├─memeory.ts # 内存 cache
├─persistent.ts # 导出实际更新存储的方法
└storageCache.ts # 浏览器 storage
```

![image-20230630173828177](/home/jzy/Documents/markdown/vben/vben.assets/image-20230630173828177.png)

🔐 存储加密

项目中亮点之处就是使用 `AES加密算法` 对存储的内容进行加密。可配置传入

``` 
key - 密钥
iv - 初始向量
mode - 加密模式
padding - 偏移
```

总体 `storage` 包含 `get`、`set`、`remove`、`clear` 方法

- `get`：获取缓存内容，如果内容过期则删除
- `set`：设置缓存内容，设定缓存的设定时间 `time` 以及可持续时间 `expire`
- `remove`：根据 `key` 值删除缓存中的内容
- `clear`：清除缓存的所有内容



`localStorage` 的存储形式（同时也是需要进行`加密存储` 的数据）

```ts
// 枚举类型 —— 浏览器缓存 key = VUE_VBEN_ADMIN__DEVELOPMENT__2.8.0__COMMON__LOCAL__KEY__ 的 value键集合

interface BasicStore {
  [TOKEN_KEY]: string | number | null | undefined; // token
  [USER_INFO_KEY]: UserInfo; // 用户信息
  [ROLES_KEY]: string[]; // 用户角色
  [LOCK_INFO_KEY]: LockInfo; // 🔓
  [PROJ_CFG_KEY]: ProjectConfig; // 项目配置
  [MULTIPLE_TABS_KEY]: RouteLocationNormalized[]; // tabs
}
```

```json
{
    "value":{
        "TOKEN__":Object{...},
        "ROLES__KEY__":Object{...},
        "USER__INFO__":Object{...},
        "PROJ__CFG__KEY__":Object{...}
    },
    "time":1688351157733,
    "expire":1688955957733
}
```

创建 `storage` 可配置传入的参数

```json
{
      prefixKey: string; # 存储 key 前缀
      storage: Storage; # 使用哪种浏览器存储模式
      hasEncrypt: boolean; # 当前内容是否已经加密
      timeout?: Nullable<number>; # 内存缓存的持续时间
      key: string; # 加密密钥
      iv: string # 初始加密向量
}
```





🔐 内存存储

除了将内容存储在浏览器 `storage` 中，项目还定义了 `Memory class`。`Memory class` 主要是将内容存储在内存中，实际上每次更新都是在该对象上进行更新。在更新的过程中提供一个选项 —— 是否覆盖浏览器缓存。这样的好处在用户修改对应配置的时候无法恢复的情况（相当于拷贝了一份副本进行更新）。

```ts
// 每个 Memory Cache 的值都有如下结构
export interface Cache<V = any> {
  // 存储值
  value?: V;
  // 过期回调函数 id
  timeoutId?: ReturnType<typeof setTimeout>;
  // 到期时间
  time?: number;
  // 持续时间
  alive?: number;
}
```

一些注意事项

1. 需要考虑 `timeoutId`定时器的清除

   - `set`：重新设置值需要 `clearTimeout` 并重新定义 `setTimeout`

   - `remove`：删除 `key` 及其对应的定时器

   - `reset`：删除过期 `key` 及其对应定时器

2. `get` 函数返回的是 `Cache<T>` | `undefined`，因此凡是在使用的时候都需要判断返回值是否为 `undefined`









## axios

```text
http
├─Axios.ts # 初始化实例
├─axiosCancel.ts # 配置 axios 取消请求
├─axiosTransform.ts # 定义 axios transform 接口
├─checkStatus.ts # 定义错误 code 检查机制并创建对应的消息提示实例
├─helper.ts # 日期转换 util 
└index.ts # 导出程序中使用的 axios 对象
```

上面都是对文件比较抽象的描述，整体流程定义我觉得可以分为：

- 定义 `axios cancler` & `axios transform`
-  初始化 `axios 实例`，注册相关拦截器及配置选项
- 引入并导出 `axios` 实例

> 由于代码量过大不再一一详细描述各个文件的具体实现，抽出其中比较重要的几点进行理解

🔐 `axios cancler`

实现 `axios` 取消重复请求其实有两种

1. 新请求覆盖旧 `pending` 请求(项目中)
2. 忽略新相同请求直到队列中相同`pending` 请求清空

第一种单纯只是前端不接受该请求结果，请求依然被发送到后端，适合输入框类型；

第二种则是正常的一个请求过滤行为，适合对于密集型任务去重减轻后台压力；

🔐 `axios transform`

定义在 `axios` 请求响应不同阶段的接口，包括：

- `beforeRequestHook`：请求之前处理config —— url、参数、时间格式化
- `transformRequestHook` ：处理响应结果
- `requestInterceptors`：`token` 添加、重复请求判断
- `responseInterceptors`：响应拦截 —— 从 pending 中删除但前请求
- `responseInterceptorsCatch`：响应后错误处理
- `requestInterceptorsCatch`：请求前错误处理

🔐 `axios requestOptions`

自定义 `axios` 请求响应过程中可配置参数。实际在使用的时候可以通过传入 `{ requestOptions: opt }` 进行覆盖来改变默认行为

```ts
interface RequestOptions {
  // post请求的时候是否添加参数到url
  joinParamsToUrl?: boolean;
  // 格式化提交参数时间
  formatDate?: boolean;
  // 是否需要对返回数据进行处理
  isTransformResponse?: boolean;
  // 是否返回原生响应头 比如：需要获取响应头时使用该属性
  isReturnNativeResponse?: boolean;
  // 是否将prefix 添加到url
  joinPrefix?: boolean;
  // 接口地址
  apiUrl?: string;
  // 请求拼接路径
  urlPrefix?: string;
  // 错误提示类型
  errorMessageMode?: ErrorMessageMode;
  //  是否加入时间戳(解决get请求缓存)
  joinTime?: boolean;
  // 是否忽略重复请求限制
  ignoreCancelToken?: boolean;
  // 请求是否需要携带 token 验证
  withToken?: boolean;
}
```

🔐 `encodeURLComponent` & `decodeURLComponent`

- `encodeURLComponent`：通过特定字符转义特殊字符，返回被编码后的新字符窜
- `decodeURLComponent`：解码 `encodeURLComponent` 编码字符返回原字符串



## moment

> 为 JS 提供更多日期创建以及格式化的日期库，但是从官网目前状态来看，作者已经不再建议使用该库 —— 该库已经停止维护，对于一些问题也不再进行修复了，因此现在其替代品更多是 `day.js` ，但项目中使用了那就简单记录下其 api 语法

1. 创建日期

```js
语法 moment(string)
```

```text
2013-02-08  # A calendar date part
2013-02     # A month date part
2013-W06-5  # A week date part
2013-039    # An ordinal date part

20130208    # Basic (short) full date
201303      # Basic (short) year+month
2013        # Basic (short) year only
2013W065    # Basic (short) week, weekday
2013W06     # Basic (short) week only
2013050     # Basic (short) ordinal date (year + day-of-year)
2013-02-08T09            # An hour time part separated by a T
2013-02-08 09            # An hour time part separated by a space
2013-02-08 09:30         # An hour and minute time part
2013-02-08 09:30:26      # An hour, minute, and second time part
2013-02-08 09:30:26.123  # An hour, minute, second, and millisecond time part
2013-02-08 24:00:00.000  # hour 24, minute, second, millisecond equal 0 means next day at midnight

20130208T080910,123      # Short date and time up to ms, separated by comma
20130208T080910.123      # Short date and time up to ms
20130208T080910          # Short date and time up to seconds
20130208T0809            # Short date and time up to minutes
20130208T08              # Short date and time, hours only
```

2. 格式化日期

```js
语法 moment.format(string)
```

[具体 string 可定义列表](http://momentjs.cn/docs/#/displaying/format/)



## css attribute

- `vertical-align`: 指定行内元素（inline）或表格单元格（table-cell）元素的垂直对齐方式。

- `currentColor`：代表一个当前元素的颜色变量，若当前元素没有设置 `color` 属性可从父级继承。

  ```css
  fill: currentColor; /* svg 颜色填充由父级决定，可有效减少代码荣誉 */
  ```

- `data-*属性`：允许在标准、语义化的 HTML 元素中存储额外的信息 [MDN](https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Howto/Use_data_attributes)

  ```html
  <article
    id="electriccars"
    data-columns="3"
    data-index-number="12314"
    data-parent="cars">
  ...
  </article>
  ```

  在 js 中可通过 `dom.dataset` 获取，`article.dataset.columns`、`article.dataset.indexNumber`、`article.dataset.parent`

  在 css 中可通过属性选择器根据 `data` 改变样式

  ```css
  article[data-columns='3'] {
    width: 400px;
  }
  article[data-columns='4'] {
    width: 600px;
  }
  ```

  而在项目中，则是使用该特性来实现 `暗黑模式` 样式切换

- `will-change`：告知浏览器该元素会有哪些变化的方法，浏览器可以在元素真正发生变化前提前做好对应的优化准备工作

  ```css
  will-change: transform /* 不应将 will-change 应用与过多元素 */
  ```

  







## svg

> svg —— 可缩放矢量图形，可渲染不同大小的图形。与 `png`、`jpg` 不同，`svg` 格式提供的是矢量图，图像能够被无限放大而不失真或降低质量，并且可以方便地修改内容。 [svg 元素列表](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element)

### use

`use` 可以复用 `svg` 中定义的节点并覆盖其属性`。x, y, width, height，href` 这几个属性，不管源元素是否有设置，都可以覆盖。 而其他属性，如果源 素已经设置，则无法覆盖，如果没有设置，则可以在 use 上设置。

```html
    <svg viewBox="0 0 30 10" xmlns="http://www.w3.org/2000/svg">
      <circle id="myCircle" cx="5" cy="5" r="4" stroke="blue" />
      <!-- <use href="#myCircle" x="10" fill="blue" /> -->
      <!-- <use href="#myCircle" x="20" fill="white" stroke="red" /> -->
    </svg>
    <svg viewBox="0 0 30 10" xmlns="http://www.w3.org/2000/svg">
      <!-- <circle id="myCircle" cx="5" cy="5" r="4" stroke="blue" /> -->
      <use href="#myCircle" x="10" fill="blue" />
      <use href="#myCircle" x="20" fill="white" stroke="red" />
    </svg>
```

上面即使 `use` 和 `circle` 并不在一个 `svg` 标签内部，但仍然可以复用内容，因此可以理解 `use` 的范围是 `html`







## windi-css

> 支持大部分 tailwind css 语法且提供了更快速的 HMR。tailwind css 是一个可以通过定义 css 类名，不需要我们写额外 css 代码就能构建完整应用 css 框架。



### 快速集成

- 基于 vite 集成

```bash
$ npm i -D vite-plugin-windicss windicss
```

- `windi.config.ts` 配置

```ts
import { defineConfig } from "windicss/helpers";

function range(size, startAt = 1) {
  return Array.from(Array(size).keys()).map(item => item + startAt)
}

export default defineConfig({
  darkMode: "class",
  safelist: [
    // 为了解决模板中 p-${size} 未知的配置
    "p-1 p-2 p-3 p-4 p-5",
    range(5).map((i) => `p-${i}`), // 等价于上面的配置
  ],
  plugins: [createEnterPlugin()],
  // 主题配置
  theme: {
    extend: {
      zIndex: {
        "-1": "-1",
      },
      colors: {
        primary: "#0960bd",
      },
      screens: { // 定义不明屏幕分辨率
        sm: "576px",
        md: "768px",
        lg: "992px",
        xl: "1200px",
        "2xl": "1600px",
      },
    },
  },
});

// 定义 transition 动画效果
function createEnterPlugin(maxOutput = 7) {
  const createCss = (index: number, d = "x") => {
    const upd = d.toUpperCase();
    return {
      // 右边过渡进入
      [`*> .enter-${d}:nth-child(${index})`]: {
        transform: `translate${upd}(50px)`,
      },
      // 左边过渡进入 
      [`*> .-enter-${d}:nth-child(${index})`]: {
        transform: `translate${upd}(-50px)`,
      },
      [`* > .enter-${d}:nth-child(${index}),* > .-enter-${d}:nth-child(${index})`]:
        {
          "z-index": `${10 - index}`,
          opacity: "0",
          animation: `enter-${d}-animation 0.4s ease-in-out 0.3s`,
          "animation-fill-mode": "forwards",
          "animation-delay": `${(index * 1) / 10}s`,
        },
    };
  };
  const handler = ({ addBase }) => {
    const addRawCss = {};
    for (let index = 1; index < maxOutput; index++) {
      Object.assign(addRawCss, {
        ...createCss(index, "x"),
        ...createCss(index, "y"),
      });
    }
    addBase({
      ...addRawCss,
      [`@keyframes enter-x-animation`]: {
        to: {
          opacity: "1",
          transform: "translateX(0)",
        },
      },
      [`@keyframes enter-y-animation`]: {
        to: {
          opacity: "1",
          transform: "translateY(0)",
        },
      },
    });
  };
  return { handler };
}

```

上面的配置是 `vben admin` 的配置，具体理解每一项配置得深入学习



### tailwind css

- 使用传统构建页面的方式

```html
<div class="chat-notification">
  <div class="chat-notification-logo-wrapper">
    <img class="chat-notification-logo" src="/img/logo.svg" alt="ChitChat Logo">
  </div>
  <div class="chat-notification-content">
    <h4 class="chat-notification-title">ChitChat</h4>
    <p class="chat-notification-message">You have a new message!</p>
  </div>
</div>

<style>
  .chat-notification {
    display: flex;
    max-width: 24rem;
    margin: 0 auto;
    padding: 1.5rem;
    border-radius: 0.5rem;
    background-color: #fff;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
  .chat-notification-logo-wrapper {
    flex-shrink: 0;
  }
  .chat-notification-logo {
    height: 3rem;
    width: 3rem;
  }
  .chat-notification-content {
    margin-left: 1.5rem;
    padding-top: 0.25rem;
  }
  .chat-notification-title {
    color: #1a202c;
    font-size: 1.25rem;
    line-height: 1.25;
  }
  .chat-notification-message {
    color: #718096;
    font-size: 1rem;
    line-height: 1.5;
  }
</style>
```

- 采用 `tailwind css`

```html
<div class="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
  <div class="flex-shrink-0">
    <img class="h-12 w-12" src="/img/logo.svg" alt="ChitChat Logo">
  </div>
  <div>
    <div class="text-xl font-medium text-black">ChitChat</div>
    <p class="text-gray-500">You have a new message!</p>
  </div>
</div>
```



对比发现总的 使用 `tailwind css` 的优势

- 不需要考虑 class 类名如何去定义
- css 代码不会增长（因为每次都是基于既定类名去实现样式）
- 修改更加安全，不需要担心一个地方的修改而导致破坏性行为



### 可响应式设计

| Breakpoint prefix | Minimum width | CSS                                  |
| ----------------- | ------------- | ------------------------------------ |
| `sm`              | 640px         | `@media (min-width: 640px) { ... }`  |
| `md`              | 768px         | `@media (min-width: 768px) { ... }`  |
| `lg`              | 1024px        | `@media (min-width: 1024px) { ... }` |
| `xl`              | 1280px        | `@media (min-width: 1280px) { ... }` |
| `2xl`             | 1536px        | `@media (min-width: 1536px) { ... }` |

```html
<!-- Width of 16 by default, 32 on medium screens, and 48 on large screens -->
<img class="w-16 md:w-32 lg:w-48">
```

实际在使用的时候如上即可，熟悉多媒体查询的话应该也很容易上手。当然如果觉得上面表格提供的 `prefix` 不足以满足需求的话，可进行自定义

```js
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'tablet': '640px',
      // => @media (min-width: 640px) { ... }

      'laptop': '1024px',
      // => @media (min-width: 1024px) { ... }

      'desktop': '1280px',
      // => @media (min-width: 1280px) { ... }
    },
  }
}
```



### 伪元素

> hover、focus ...

* 语法规则

```html
focus:<css>
hover:<css>
```

- 应用

```html
<form>
  <input class="border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent ...">
  <button class="bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 ...">
    Sign up
  </button>
</form>
```







## vite



- 初始化 `vue-ts` 项目

```bash
$ pnpm create vite vue-ts-project --template vue-ts
```

- 集成 `typescript` 环境

```bash
$ pnpm add typescript @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-plugin-vue -D
```

配置 `eslintrc`





### 插件

> 插件列表主要是拓展项目功能

- `@vitejs/plugin-vue`：支持 `vue` 项目

- `@vitejs/plugin-vue-jsx`：支持 `vue` 使用 `jsx` 或者 `tsx` 语法

  在开发的时候遇到一个问题，经过了漫长的排错最终才发现是项目并不支持使用 `jsx` 语法

  ```js
  SyntaxError: expected expression, got '<'
  ```

### glob

`glob` 在 vite 中用于动态导入，构建时会分离为独立 chunk

```ts
const modules = import.meta.glob('./dir/*.js')

// vite 生成的代码
const modules = {
  './dir/foo.js': () => import('./dir/foo.js'),
  './dir/bar.js': () => import('./dir/bar.js'),
}
```

```ts
// 遍历访问模块
for (const path in modules) {
  modules[path]().then((mod) => {
    console.log(path, mod)
  })
}
```







## typescript



### declare global

`declare global` 位于 `types/global.d.ts` 下，主要作用是声明全局变量，且该全局变量不是我们自定义的而是来源于`第三方库`，所以也可以理解为使得模块的类型可以在全局使用而不需要多次引入。

```ts
declare global {
  interface Window {
    myGlobalVar: string;
  }
}

window.myGlobalVar = 'Hello, world!';
console.log(window.myGlobalVar);  // 输出：Hello, world!
```



### 函数重载

> 函数重载的出现是为了解决函数返回值通过联合类型确定，导致无法明确从输入值 -> 返回值的确定路线 [参考——掘金](https://juejin.cn/post/7055668560965681182)

```ts
// 说明上面的例子
function getUserInfo(value:number|string):User|User[]|undefined{
    if(typeof value==='number'){
        return userList.find(item=>item.id===value)
    }else{
        return userList.filter(item=>item.grades===value)
    }
}
```

不能明确输入 `value`为 `number`时返回的是什么，因此为了解决这个问题引入 `函数重载`

```ts
function getUserInfo(value:number):User|undefined;
function getUserInfo(value:string,count:number):User[];
// 最后一个参数类型要**兼容**前面的所有函数声明的参数类型
function getUserInfo(value:number|string,count:number=1):User|User[]|undefined{
    if(typeof value==='number'){
        return userList.find(item=>item.id===value)
    }else{
        return userList.filter(item=>item.grades===value).slice(0,count)
    }
}
```



### unknown

> unknown 可用于解决顶级类型 any 宽松的检查机制 —— 即一个参数定义为 any 则无论该参数赋值给任意形式都不会报错

`unknown` 的一些特性

- 与 `any` 类似，所有类型都可以被归为 `unknown`
- `unknown` 类型的变量只能赋值给 `any` & `unknown`

```ts
let value: unknown;

let value1: unknown = value;   // OK
let value2: any = value;       // OK
let value3: boolean = value;   // Error
let value4: number = value;    // Error
let value5: string = value;    // Error
let value6: object = value;    // Error
let value7: any[] = value;     // Error
let value8: Function = value;  // Error
```



### tsconfig.json

> 指定了编译项目所需的根目录下的文件以及编译选项

项目总体 `tsconfig.json` 配置如下，以下将详细理解每个选项代表的含义

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "moduleResolution": "node",
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "allowSyntheticDefaultImports": true,
    "strictFunctionTypes": false,
    "jsx": "preserve",
    "baseUrl": ".",
    "allowJs": true,
    "sourceMap": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "experimentalDecorators": true,
    "lib": ["dom", "esnext"],
    "types": ["vite/client"],
    "typeRoots": ["./node_modules/@types/", "./types"],
    "noImplicitAny": false,
    "skipLibCheck": true,
    "paths": {
      "/@/*": ["src/*"],
      "/#/*": ["types/*"]
    }
  },
  "include": [
    "tests/**/*.ts",
    "src/**/*.ts",
    "src/**/*.d.ts",
    "src/**/*.tsx",
    "src/**/*.vue",
    "types/**/*.d.ts",
    "types/**/*.ts",
    "build/**/*.ts",
    "build/**/*.d.ts",
    "mock/**/*.ts",
    "vite.config.ts"
  ],
  "exclude": ["node_modules", "tests/server/**/*.ts", "dist", "**/*.js"]
}

```

🔐 顶层属性有 `compilerOptions`、`include`、`exclude`、`references`、`extends`、`files`。其中 `compilerOptions` 为编译选项，后面的都是非编译选项

- 编译选项：编译过程中的行为
- 非编译选项：控制的是 `typescript` 编译器要编译的项目（文件）信息

[声明文件选项](https://pengfeixc.com/blogs/javascript/tsconfig) —— 这篇文章对于某些选项的讲解我觉得比较好



- `compilerOptions Language and Enviroment`  

  - **target**：定义了某些 `emscript`语法会被转化或者保留`，如果要兼容低版本浏览器的话那么自然就不能写比较新的版本，但如果是确定要面向新版本浏览器的话则可不考虑语法兼容问题。
  - **experimentalDecorators**：是否支持使用装饰器
  - **jsx**：控制 `jsx` 的生成形式

  ![image-20230625162943016](/home/jzy/Documents/markdown/vben/vben.assets/image-20230625162943016.png)

  - **lib**：`ts` 默认包含了 一些`api` 的类型定义，像 `Math`、`document`，支持 `target` 字段定义的 `js` 版本的新特性。具体可设置为一个数组例如 `[dom, esnext]` 

![image-20230625163525990](/home/jzy/Documents/markdown/vben/vben.assets/image-20230625163525990.png)

- `compilerOptions Modules` 

  - **module**：定义 `.ts` 文件最后编译的 `js` 遵循的规范，可以设置为 `CommonJs`、`UMD`、`ESNext`......
  - **moduleResolution**：定义导入文件模块时的模块解析策略，即遵循一个怎么样的原则去寻找模块，ts 默认用node的解析策略，即相对的方式导入。可以定义为 `node`、`node16 / nodenext`
  - **baseUrl**：指定相对导入模块的根目录
  - **paths**：`typescript4.1` 版本之前，设置 `paths` 必须设定 `baseUrl`，但是现在如果没有设置 `baseUrl` 则基于 `tsconfig.json` 所在目录作为根目录。`path`s 的作用是定义导入模块路径别名。

  ```ts
  {
    "compilerOptions": {
      "paths": {
          "app/*": ["./src/app/*"],
          "config/*": ["./src/app/_config/*"],
          "environment/*": ["./src/environments/*"],
          "shared/*": ["./src/app/_shared/*"],
          "helpers/*": ["./src/helpers/*"],
          "tests/*": ["./src/tests/*"]
      },
  }
  ```

  :warning: 需要注意的是，`paths` 的设置仅仅是为了方便开发阶段能够使用快捷命名导入模块而不报错，并不影响像 `vite` 这些构建工具的默认机制，因此还需在这些工具内部配置别名映射

  ```ts
  alias: [
          {
            find: 'vue-i18n',
            replacement: 'vue-i18n/dist/vue-i18n.cjs.js',
          },
          // /@/xxxx => src/xxxx
          {
            find: /\/@\//,
            replacement: pathResolve('src') + '/',
          },
          // /#/xxxx => types/xxxx
          {
            find: /\/#\//,
            replacement: pathResolve('types') + '/',
          },
  ],
  ```

  - **resolveJsonModule**：允许导入 `json` 文件，`ts` 默认不支持导入 `json` 文件，因此该选项经常需要我们重置为 `true`
  - **types**：ts 编译器会默认引入 `typeRoot` 下所有的声明文件，`types` 可以通过指定模块名只引入想要的模块
  - **typeRoots**：指定默认的类型声明文件查找路径，默认为 `node_modules/@types`，指定 `typeRoots` 后，typescript 编译器会从指定路径引入声明路径

  :warning: `types` 和 `typeRoots` 只对 npm 安装的声明模块有效

- `compilerOptions JavaScript Support`

  - **allowJs**: 允许导入 `js` 文件

- `compilerOptions Type Checking`

  - **noUnusedLocals**：对没有引用的变量报错 `true`

  ```ts
  const createKeyboard = (modelID: number) => {
    const defaultModelID = 23;
  'defaultModelID' is declared but its value is never read.
  
    return { type: "keyboard", modelID };
  };
  ```

  - **noUnusedParameters**: 对方法没有使用的参数报错 `true`

  ```ts
  const createDefaultKeyboard = (modelID: number) => {
  'modelID' is declared but its value is never read.
  
    const defaultModelID = 23;
    return { type: "keyboard", modelID: defaultModelID };
  };
  ```

  - **strictFunctionTypes**: 当启用时，此标志会使函数参数得到更正确的检查。:walking: 这个特性仅仅针对函数定义生效，对于对象内再潜逃定义方法的情况不生效

  ```ts
  function fn(x: string) {
    console.log("Hello, " + x.toLowerCase());
  }
   
  type StringOrNumberFunc = (ns: string | number) => void;
   
  // Unsafe assignment is prevented
  let func: StringOrNumberFunc = fn;
  Type '(x: string) => void' is not assignable to type 'StringOrNumberFunc'.
    Types of parameters 'x' and 'ns' are incompatible.
      Type 'string | number' is not assignable to type 'string'.
        Type 'number' is not assignable to type 'string'.
  ```

  ```ts
  // 不生效
  type Methodish = {
    func(x: string | number): void;
  };
   
  function fn(x: string) {
    console.log("Hello, " + x.toLowerCase());
  }
   
  // Ultimately an unsafe assignment, but not detected
  const m: Methodish = {
    func: fn,
  };
  m.func(10);
  ```

  

  - **strict**：设置为 `true` 相当于使用 `use strict`



### 声明文件(.d.ts)

- [`declare var`](https://ts.xcatliu.com/basics/declaration-files.html#declare-var) 声明全局变量
- [`declare function`](https://ts.xcatliu.com/basics/declaration-files.html#declare-function) 声明全局方法
- [`declare class`](https://ts.xcatliu.com/basics/declaration-files.html#declare-class) 声明全局类
- [`declare enum`](https://ts.xcatliu.com/basics/declaration-files.html#declare-enum) 声明全局枚举类型
- [`declare namespace`](https://ts.xcatliu.com/basics/declaration-files.html#declare-namespace) 声明（含有子属性的）全局对象
- [`interface` 和 `type`](https://ts.xcatliu.com/basics/declaration-files.html#interface-和-type) 声明全局类型
- [`export`](https://ts.xcatliu.com/basics/declaration-files.html#export) 导出变量
- [`export namespace`](https://ts.xcatliu.com/basics/declaration-files.html#export-namespace) 导出（含有子属性的）对象
- [`export default`](https://ts.xcatliu.com/basics/declaration-files.html#export-default) ES6 默认导出
- [`export =`](https://ts.xcatliu.com/basics/declaration-files.html#export-1) commonjs 导出模块
- [`export as namespace`](https://ts.xcatliu.com/basics/declaration-files.html#export-as-namespace) UMD 库声明全局变量
- [`declare global`](https://ts.xcatliu.com/basics/declaration-files.html#declare-global) 扩展全局变量
- [`declare module`](https://ts.xcatliu.com/basics/declaration-files.html#declare-module) 扩展模块
- [`/// `](https://ts.xcatliu.com/basics/declaration-files.html#san-xie-xian-zhi-ling) 三斜线指令

:warning: importtant： 其实最重要的是理解 `全局声明文件` 和 `模块声明文件` 

- `全局声明文件`里面的类型定义全局生效，不需要引入就可以直接使
- `模块声明文件`里面的类型定义仅在模块内生效，在之前的一些版本中就是通过 `namespace` 去定义，因此需要引入后才能使用



## less

>  `less` 是 css 预处理器，可以帮助我们更好地组织以及编写 css



### 变量

```less
@width: 10px;
@height: @width + 10px;

#header {
    width: @width;
    height: @height
}
```

:information_source: 变量这个概念其实 `css `也有，对应通过 `--` 来声明变量，`var()`来引入变量，理解 `继承性`和 `候补属性` 就能够比较好地理解这个概念。

```css
:root {
  --main-bg-color: brown;
}
element {
  background-color: var(--main-bg-color);
}
element {
  background-color: var(--main-bg-color , red); /* red 为 --main-bg-color无效的替代值 */
}
```

### 混合

> 也叫混入，将一组属性从一个规则集应用到另外一个规则集

```css
.bordered {
  border-top: dotted 1px black;
  border-bottom: solid 2px black;
}

/* 应用上面规则集 */
#menu a {
  color: #111;
  .bordered();
}

.post a {
  color: red;
  .bordered();
}
```

### 转义

```less
// less 3.5 版本前
@min768: ~"(min-width: 768px)";
.element {
  @media @min768 {
    font-size: 1.2rem;
  }
}
// less 3.5 版本后
@min768: (min-width: 768px);
.element {
  @media @min768 {
    font-size: 1.2rem;
  }
}
```

编译后

```css
@media (min-width: 768px) {
  .element {
    font-size: 1.2rem;
  }
}
```



## eslint / prettier

[宝藏配置](http://www.huhaowb.com/2022/10/11/vite%E5%88%9B%E5%BB%BAVue3%E9%A1%B9%E7%9B%AE%E9%85%8D%E7%BD%AEESLint/)： 覆盖了绝大部分的 `eslint` 、`prettier` 配置，非常好的一篇文章

- 依赖安装

```bash
$ pnpm install eslint eslint-plugin-vue @typescript-eslint/eslint-plugin @typescript-eslint/parser prettier eslint-config-prettier eslint-plugin-prettier
-D
```

- `prettier`：prettier的核心代码 
- `eslint-config-prettier`：这将禁用 ESLint 中的格式化规则，而 Prettier 将负责处理这些规则
- `eslint-plugin-prettier` ：把 Prettier 推荐的格式问题的配置以 ESLint rules 的方式写入，统一代码问题的来源。
-  `eslint`： ESLint的核心代码 
- `@typescript-eslint/parser` ：SLint的解析器，用于解析typescript，从而检查和规范Typescript代码 
- `@typescript/eslint/eslint-plugin`：包含了各类定义好的检测Typescript代码的规范 
- `eslint-plugin-vue `：支持对vue文件检验 [规则集](https://eslint.vuejs.org/rules/max-len.html)
-  `vite-plugin-eslint`：错误将在浏览器中报告，而不止在终端，按需使用
