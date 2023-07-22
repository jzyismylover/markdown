## 🔐 storage

> 项目中浏览器 `storage` 的设置，理解如下：

```text
cache
├─index.ts # 导出创建 storage 方法
├─memeory.ts # 内存 cache
├─persistent.ts # 导出实际更新存储的方法
└storageCache.ts # 浏览器 storage
```

![image-20230630173828177](/home/jzy/Documents/markdown/vben/vben-package.assets/image-20230630173828177.png)

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









## 🔐 axios

```text
http
├─Axios.ts # 初始化实例
├─axiosCancel.ts # 配置 axios 取消请求
├─axiosTransform.ts # 定义 axios transform 接口
├─checkStatus.ts # 定义错误 code 检查机制并创建对应的消息提示实例
├─helper.ts # 日期转换 util 
└index.ts # 实例 axios(配置拦截器)
```

上面都是对文件比较抽象的描述，整体流程定义我觉得可以分为：

- 定义 `axios cancler` & `axios transform`
- 初始化 `axios 实例`，注册相关拦截器及配置选项
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
- `responseInterceptors`：响应拦截 —— 从 pending 中删除当前请求
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



## 🔐 moment

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